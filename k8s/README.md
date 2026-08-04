# CI: Build on AKS, deploy to Hostinger

This repo deploys via a **self-hosted GitHub Actions runner that runs as a pod
in your Azure AKS cluster**. The runner builds the Next.js app and SFTP-deploys
the prebuilt artifact to your Hostinger Node hosting. Hostinger only serves the
app and owns the `japnam.tech` DNS — AKS is purely the build/CI host.

## Flow
```
git push main
   → GitHub Actions (routed to the AKS runner pod)
       → npm ci --omit=dev
       → npm run build            (prebuilt .next/ artifact)
       → scripts/deploy-hostinger.py --built
           → SFTP to Hostinger, extract, Hostinger `npm run start` serves it
```

## 1. Register the AKS runner (one-time, from a machine with kubectl + AKS kubeconfig)
```bash
kubectl create namespace portfolio
kubectl create secret generic github-runner -n portfolio \
  --from-literal=GITHUB_TOKEN=<github_PAT_classic_with_repo_scope>
kubectl apply -f k8s/runner-deployment.yaml
```
The pod appears under repo → Settings → Actions → Runners, labelled `aks,portfolio`.

## 2. Add Hostinger secrets to the GitHub repo
Settings → Secrets → Actions:
- `HOSTINGER_HOST` — e.g. `srv1865422.hstgr.cloud` (the web-host SSH host,
  **not** the RustFS storage IP `2.25.91.163`)
- `HOSTINGER_USER` — the SSH user (e.g. `u123456`, not `root`)
- `HOSTINGER_PASS` — SSH password
- `HOSTINGER_REMOTE` — document root, e.g.
  `/home/u123456/domains/japnam.tech/public_html`

## 3. Hostinger side
- In hPanel, set the Node app **Start command** to `npm run start` (the
  `prestart` script builds if `.next` is missing, but CI ships a ready build).
- Set runtime env vars (`RUSTFS_*`, `RESEND_*`) in hPanel → Environment.
- The `japnam.tech` DNS stays on Hostinger; the runner only reaches Hostinger
  over SSH/SFTP — AKS never exposes the app publicly.

## Notes
- The runner resolves `srv1865422.hstgr.cloud` to the real Hostinger IP (only
  the build VM aliases it to localhost). So SFTP works from AKS.
- `npm ci --omit=dev` is fine because `@tailwindcss/postcss` and
  `@tailwindcss/oxide-linux-x64-gnu` are in `dependencies` (see DEPLOY.md).
