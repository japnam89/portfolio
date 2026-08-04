#!/usr/bin/env python3
"""
Deploy the portfolio (Next.js 16 Node server app) to Hostinger Node hosting
via SFTP, then run `npm ci && npm run build` over SSH.

Supports BOTH password auth and SSH-key auth (paramiko).

Usage (password):
    python scripts/deploy-hostinger.py \
        --host hXXXX.hosting.hostinger.com --port 22 --user uXXXX \
        --remote /home/uXXXX/domains/japnam.tech/public_html \
        --password '****'

Usage (key):
    python scripts/deploy-hostinger.py --host ... --user ... --remote ... \
        --identity ~/.ssh/id_rsa

Flags:
    --host      Hostinger SSH/SFTP hostname (required)
    --port      SSH port (default 22)
    --user      SSH username (required)
    --remote    Remote document root the Node app lives in (required)
    --password  SSH password (use this OR --identity)
    --identity  Path to SSH private key (optional)
    --no-build  Upload only, skip `npm ci && npm run build` on the remote
    --built     Source was ALREADY built on the CI runner: include the local
                .next/ output in the upload and skip the remote build entirely
                (Hostinger just serves it). Use in CI: build on the runner,
                then ship the ready artifact.
    --dry-run   List files that would transfer, make no changes
"""
import argparse
import os
import sys
import tarfile
import tempfile

import paramiko

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Directories/files excluded from the upload. The remote runs `npm ci` +
# `npm run build`, so we normally must NOT ship .next. `data/` (the SQLite blog
# DB) is also excluded so a redeploy never overwrites the live database on the
# host. When --built is set, .next/ IS included (prebuilt artifact).
EXCLUDE_DIRS = {".git", "node_modules", ".next", "out", "build", ".venv-deploy", "data"}
EXCLUDE_FILES = {
    ".env", ".env.local", ".env.production", ".env.example",  # secrets go in hPanel, not in upload
    ".demoenv", ".demoenv.example",  # also holds a presigned token
    "package-lock.json.bak",
}
# Explicit extra excludes (relative paths / names) not otherwise matched.
EXTRA_SKIP_NAMES = {".deploy-exclude", "scripts"}


def should_skip(path_rel: str) -> bool:
    parts = path_rel.split("/")
    if parts[0] in EXCLUDE_DIRS or path_rel in EXCLUDE_DIRS:
        return True
    basename = parts[-1]
    if basename in EXCLUDE_FILES or basename in EXCLUDE_DIRS:
        return True
    if basename in EXTRA_SKIP_NAMES:
        return True
    if basename.startswith("npm-debug.log") or basename == "core" or basename.startswith("core."):
        return True
    return False


def collect_files(built=False):
    # When built=True, keep .next/ (prebuilt artifact); otherwise exclude it.
    skip_dirs = set(EXCLUDE_DIRS)
    if built:
        skip_dirs.discard(".next")
    out = []
    for root, dirs, files in os.walk(REPO_ROOT):
        # prune excluded dirs in-place
        rel_root = os.path.relpath(root, REPO_ROOT)
        if rel_root == ".":
            dirs[:] = [d for d in dirs if d not in skip_dirs and d not in EXTRA_SKIP_NAMES]
        else:
            top = rel_root.split("/")[0]
            if top in EXCLUDE_DIRS or top in EXTRA_SKIP_NAMES:
                dirs[:] = []
                continue
        for f in files:
            rel = os.path.normpath(os.path.join(rel_root, f))
            if should_skip(rel):
                continue
            out.append(rel)
    return sorted(out)


def make_tar(file_list, dry_run=False):
    tmp = tempfile.NamedTemporaryFile(suffix=".tar.gz", delete=False)
    tmp.close()
    if dry_run:
        for rel in file_list:
            print("  would transfer:", rel)
        os.unlink(tmp.name)
        return None
    with tarfile.open(tmp.name, "w:gz") as tf:
        for rel in file_list:
            tf.add(os.path.join(REPO_ROOT, rel), arcname=rel)
    return tmp.name


def connect(args):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    kwargs = dict(hostname=args.host, port=args.port, username=args.user, timeout=30)
    if args.identity:
        kwargs["key_filename"] = args.identity
    elif args.password:
        kwargs["password"] = args.password
    else:
        # try available ssh keys / agent
        pass
    try:
        client.connect(**kwargs)
    except paramiko.AuthenticationException:
        print("ERROR: SSH authentication failed. Check username/password or key.", file=sys.stderr)
        sys.exit(1)
    return client


def sftp_put_dir(sftp, tar_name, remote_root):
    # ensure remote root exists
    parts = remote_root.strip("/").split("/")
    cur = ""
    for p in parts:
        cur = cur + "/" + p if cur else "/" + p
        try:
            sftp.stat(cur)
        except IOError:
            sftp.mkdir(cur)
    with sftp.open(os.path.join(remote_root, "_deploy.tar.gz").replace("\\", "/"), "wb") as remote_f:
        with open(tar_name, "rb") as local_f:
            remote_f.set_pipelined(True)
            while True:
                chunk = local_f.read(1 << 20)
                if not chunk:
                    break
                remote_f.write(chunk)
    return os.path.join(remote_root, "_deploy.tar.gz").replace("\\", "/")


def remote_extract_and_build(client, remote_root, tar_remote, no_build, built=False):
    # Extract the uploaded tarball over the deploy dir. `tar -xzf` overwrites
    # matching files but does NOT delete untracked files, so the SQLite blog DB
    # at data/blog.db (created at runtime) survives redeploys.
    cmd_parts = []
    cmd_parts.append(f"cd '{remote_root}'")
    cmd_parts.append(f"&& tar -xzf '{tar_remote}'")
    cmd_parts.append(f"&& rm -f '{tar_remote}'")
    if built:
        # Prebuilt artifact shipped from CI: install runtime deps only (Hostinger
        # needs node_modules to actually RUN next start) and do NOT rebuild.
        cmd_parts.append("&& npm ci --omit=dev")
    elif not no_build:
        cmd_parts.append("&& npm ci --omit=dev")
        cmd_parts.append("&& npm run build")
    cmd = " ".join(cmd_parts)
    print("==> Running remote:", cmd)
    stdin, stdout, stderr = client.exec_command(cmd, timeout=600)
    for line in stdout:
        print("   ", line.rstrip())
    err = stderr.read().decode(errors="replace")
    rc = stdout.channel.recv_exit_status()
    if rc != 0:
        print("ERROR: remote command failed (rc=%d)" % rc, file=sys.stderr)
        if err:
            print(err, file=sys.stderr)
        sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", required=True)
    ap.add_argument("--port", type=int, default=22)
    ap.add_argument("--user", required=True)
    ap.add_argument("--remote", required=True)
    ap.add_argument("--password", default="")
    ap.add_argument("--identity", default="")
    ap.add_argument("--no-build", action="store_true")
    ap.add_argument("--built", action="store_true",
                    help="Source was prebuilt on the runner; include local .next/ and skip remote build")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    files = collect_files(built=args.built)
    print(f"==> Collected {len(files)} files to transfer"
          + (" (incl. prebuilt .next/)" if args.built else " (excluding node_modules/.next/.git/.env*)"))
    tar_name = make_tar(files, dry_run=args.dry_run)
    if args.dry_run:
        print("==> Dry run complete. Nothing transferred.")
        return

    # --built implies the remote should not rebuild (artifact is ready)
    no_build = args.no_build or args.built

    client = connect(args)
    try:
        sftp = client.open_sftp()
        tar_remote = sftp_put_dir(sftp, tar_name, args.remote)
        sftp.close()
        remote_extract_and_build(client, args.remote, tar_remote, no_build, built=args.built)
    finally:
        client.close()
        os.unlink(tar_name)

    print("==> Deploy complete.")
    print("    Next: in hPanel set the Node app Start command to 'npm run start'")
    print("    Ensure NODE_ENV=production and PORT is the one Hostinger provides,")
    print("    then visit https://japnam.tech/")


if __name__ == "__main__":
    main()
