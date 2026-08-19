# Japnam.tech on Azure AKS (low-cost, self-hosted)

Two things run in your Azure subscription:
1. A **self-hosted GitHub Actions runner** (pod) — builds the app on push.
2. The **Next.js app itself** (pod) — serves `japnam.tech` to the internet.

The registrar only **registers the domain** (`japnam.tech`) and serves DNS. You
point the domain's A record at the AKS LoadBalancer IP.

---

## Option A — Build on AKS runner, deploy to the Node host (cheapest, no always-on node)
- `runner-deployment.yaml` runs the Actions runner.
- `.github/workflows/deploy.yml` builds + SFTP-deploys source to the
  Node host (it runs `npm ci && npm run build`).
- Cost: GitHub Actions minutes only. No AKS node needed for serving.
- See "Runner setup" below. Skip the serving manifests.

## Option B — Serve on AKS (app runs in your cluster) ← *low-cost single node*
- `serving.yaml` deploys the app container with a PersistentVolumeClaim for the
  SQLite blog DB and a `LoadBalancer` Service (gives a public IP).
- Cost: ~1 small AKS node (e.g. B2s ~ $30/mo + AKS control plane ~ $73/mo).
  Use the **Spot/System node pool** smallest SKU to keep it low. The blog DB
  persists on the PVC across restarts.

### 1. Build & push the image
```bash
# from repo root, after `docker login <registry>`
docker build -t <your-registry>/japnam-web:latest .
docker push <your-registry>/japnam-web:latest
# edit k8s/serving.yaml image: to match, then:
```
You can build on the AKS runner (Option A) and push to ACR — no local Docker
needed. Or `az acr build` to build in Azure.

### 2. Create the env Secret (do NOT commit real secrets)
```bash
kubectl create secret generic japnam-env \
  --from-literal=POST_ADMIN_PASSWORD='***' \
  --from-literal=RUSTFS_ACCESS_KEY='***' \
  --from-literal=RUSTFS_SECRET_KEY='***' \
  --from-literal=RUSTFS_ENDPOINT='http://2.25.91.163:32773' \
  --from-literal=RUSTFS_REGION='us-east-1' \
  --from-literal=RUSTFS_SESSION_TOKEN='' \
  --from-literal=RUSTFS_URL_EXPIRES='3600' \
  --from-literal=RESEND_API_KEY='***' \
  --from-literal=CONTACT_TO_EMAIL='you@example.com' \
  --from-literal=CONTACT_FROM_EMAIL='Portfolio <onboarding@resend.dev>'
```

### 3. Apply
```bash
kubectl apply -f k8s/serving.yaml
kubectl get svc japnam-web -w   # wait for EXTERNAL-IP
```

### 4. DNS (registrar)
In the registrar → `japnam.tech` → **DNS Zone Editor** (switch off parking nameservers
to registrar-managed DNS first):
- `A    @    → <EXTERNAL-IP from step 3>`
- `CNAME  www  →  japnam.tech`
- Wait for propagation (≤ 24h).
- TLS: add `cert-manager` + Let's Encrypt (or put Azure Front Door / App Gateway
  in front) so `https://japnam.tech` works. The registrar's free SSL does NOT cover
  an AKS IP.

---

## Runner setup (Option A, or to build the image for Option B)
1. Create a runner on GitHub: repo → Settings → Actions → Runners → New →
   "New self-hosted runner" → Linux x64. Copy the `./config.sh` command and
   token.
2. Put the token in `k8s/runner-deployment.yaml` as `GITHUB_TOKEN`
   (or create a K8s Secret and reference it).
3. `kubectl apply -f k8s/runner-deployment.yaml`.
4. The pod registers as a runner labelled `aks`. Push to `main` and the workflow
   runs there. From AKS, `srv1865422.hstgr.cloud` resolves to the real server
   IP (unlike this dev VM), so SFTP deploy works.

## Notes
- `better-sqlite3` is compiled inside the Docker image against its own Node 22,
  so there is no ABI mismatch (the SFTP/prebuilt path had this risk — see
  DEPLOY.md).
- The blog DB lives at `/app/data/blog.db` on the PVC; it survives pod restarts.
