#!/usr/bin/env bash
# Deploy the portfolio (Next.js 16 Node server app) to the Node hosting box
# via rsync-over-SSH, then run `npm ci && npm run build` on the remote.
#
# Usage (password, via sshpass):
#   SSHPASS='<password>' ./scripts/deploy.sh \
#       --host ssh.example.com --port 22 --user uXXXX \
#       --remote /home/uXXXX/domains/japnam.tech/public_html
#
# Usage (SSH key):
#   ./scripts/deploy.sh --host ... --port 22 --user ... \
#       --remote /home/.../public_html --identity ~/.ssh/id_rsa
#
# Flags:
#   --host      Remote SSH/SFTP hostname
#   --port      SSH port (default 22)
#   --user      SSH username
#   --remote    Remote directory the Node app lives in (document root)
#   --identity  Path to SSH private key (optional; else uses sshpass/agent)
#   --no-build  Skip `npm ci && npm run build` on the remote (upload only)
#   --dry-run   Show what rsync would transfer, make no changes
set -euo pipefail

HOST="" PORT=22 USER="" REMOTE="" IDENTITY="" NO_BUILD=0 DRY=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --host) HOST="$2"; shift 2;;
    --port) PORT="$2"; shift 2;;
    --user) USER="$2"; shift 2;;
    --remote) REMOTE="$2"; shift 2;;
    --identity) IDENTITY="$2"; shift 2;;
    --no-build) NO_BUILD=1; shift;;
    --dry-run) DRY=1; shift;;
    *) echo "Unknown arg: $1" >&2; exit 2;;
  esac
done

[[ -n "$HOST" && -n "$USER" && -n "$REMOTE" ]] || {
  echo "ERROR: --host, --user and --remote are required." >&2; exit 2; }

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
EXCLUDEF="$REPO_ROOT/.deploy-exclude"
SSH_OPTS=(-p "$PORT" -o StrictHostKeyChecking=accept-new -o BatchMode=yes)
if [[ -n "$IDENTITY" ]]; then SSH_OPTS+=(-i "$IDENTITY"); fi

# Build the rsync transport command (ssh or sshpass ssh)
if [[ -n "${SSHPASS:-}" ]]; then
  RSYNC_RSH=(sshpass -e ssh "${SSH_OPTS[@]}")
  SSH_CMD=(sshpass -e ssh "${SSH_OPTS[@]}")
else
  RSYNC_RSH=(ssh "${SSH_OPTS[@]}")
  SSH_CMD=(ssh "${SSH_OPTS[@]}")
fi

echo "==> Deploying $REPO_ROOT -> $USER@$HOST:$REMOTE"
echo "==> Rsync (excluding node_modules/.next/.git/.env*) ..."
rsync -avz --delete --exclude-from="$EXCLUDEF" \
  ${DRY:+--dry-run} \
  -e "${RSYNC_RSH[*]}" \
  "$REPO_ROOT/" "$USER@$HOST:$REMOTE/"

if [[ $DRY -eq 1 ]]; then echo "==> Dry run only. Done."; exit 0; fi
[[ $NO_BUILD -eq 1 ]] && { echo "==> Skipping remote build (--no-build)."; exit 0; }

echo "==> Running npm ci && npm run build on the remote ..."
"${SSH_CMD[@]}" "$USER@$HOST" "cd '$REMOTE' && npm ci --omit=dev 2>&1 | tail -5 && npm run build 2>&1 | tail -25"

echo "==> Upload + build complete."
echo "    Next: in the hosting dashboard set the Node app start command to 'npm run start'"
echo "    and ensure NODE_ENV=production, PORT is the one the host provides."
echo "    Then visit https://japnam.tech/"
