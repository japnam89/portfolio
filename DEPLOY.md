# Deploy to japnam.tech (Hostinger Node hosting)

This is a Next.js 16 App Router app (Node server, not static export). It runs
with `npm run build` then `npm run start`.

## 0. Node version
Next.js 16.2.12 requires `node >= 20.9.0` (no upper bound). 20 / 22 / 24 all
work — verified building + serving under **v24.19.0** on this VM. In hPanel pick
any of those; if the app won't start, confirm with `node -v` that it's >= 20.

## 1. Create a GitHub repo (one-time)
On github.com → New repository → name it `portfolio` (under `japnam89`).
Leave it empty (no README). Copy its URL, e.g.
`https://github.com/japnam89/portfolio.git`.

Then, on **your** machine (this VM has no GitHub auth), push the existing
committed code:

```bash
cd portfolio
git remote add origin https://github.com/japnam89/portfolio.git
git branch -M main
git push -u origin main
```

If you'd rather push from this VM, paste a GitHub **Personal Access Token**
(classic, `repo` scope) and I'll run the push for you.

## 2. Hostinger Git Deployment (recommended)
In hPanel → your `japnam.tech` Node hosting → **Git** (or Git Deployment /
Auto Deploy):
- Repository URL: `https://github.com/japnam89/portfolio.git`
- Branch: `main`
- Build command: `npm run build`
- Start command / Node start: `npm run start`
- Node version: 20 / 22 / 24 (matches the `>=20` engine; all tested OK)
- Then **Deploy / Restart**.

### CRITICAL: production install strips devDependencies
Hostinger runs the install as `npm ci --omit=dev` (production only). Anything in
`devDependencies` is **NOT installed**, which caused two real build failures:

1. **Tailwind v4 native binary missing** — `@tailwindcss/postcss` and the
   platform binding `@tailwindcss/oxide-linux-x64-gnu` were in `devDependencies`,
   so the build died with
   `Cannot find module './tailwindcss-oxide.linux-x64-gnu.node'`.
   **Fix:** both are now in `dependencies` (regular deps survive `--omit=dev`).

2. **Build-time crash on missing RustFS vars** — `src/lib/hostinger.ts` used to
   `throw` at module load if `RUSTFS_*` env vars were absent, crashing
   `next build` during "Collecting page data".
   **Fix:** credentials are now validated only at request time (inside
   `presign()`), so the dynamic `/api/photos` route degrades gracefully to an
   empty list instead of breaking the build.

Because of the above, **do NOT move those packages back to devDependencies**, and
**do NOT add a top-level `throw` on missing env vars in any module imported at
build time**. If you restructure deps, always re-test with:
```bash
rm -rf node_modules .next && npm ci --omit=dev && npm run build
```

## 3. Manual deploy on the host (alternative)
SSH into the Node hosting box (hPanel → Advanced → SSH Access; the host is the
per-account one, e.g. `srv1865422…` (the VPS host), **not** the RustFS
Object Storage gateway `rustfs-dkgj.srv1865422.hstgr.cloud`):

```bash
cd ~/portfolio
git pull                      # or upload the source
npm install                   # full install (no --omit=dev) is safest
npm run build
PORT=3000 nohup npm run start > app.log 2>&1 &
```
Prefer hPanel's managed Start command over a hand-run `nohup` process (it
survives reboots). The `prestart` npm script auto-runs `next build` if `.next`
is missing, so a bare `npm run start` won't fail with "no production build".

## 4. Environment variables (DO NOT commit — set in hPanel or .env)
hPanel → the hosting → **Environment / Variables** (or `.env` editor). Copy
from `.env.example`. The critical ones:

```bash
# Blog admin + notifications (optional)
POST_ADMIN_PASSWORD=<set-a-strong-password>
RESEND_API_KEY=<resend-api-key>
CONTACT_TO_EMAIL=<your-email>
CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>

# RustFS / Hostinger Object Storage (private photo bucket)
RUSTFS_ENDPOINT=https://rustfs-dkgj.srv1865422.hstgr.cloud
RUSTFS_REGION=us-east-1
RUSTFS_ACCESS_KEY=<rustfs-access-key>
RUSTFS_SECRET_KEY=<rustfs-secret-key>
RUSTFS_BUCKET=photos
RUSTFS_URL_EXPIRES=3600
```

On the **VPS / Docker** deployment, these come from the gitignored `.env`
file (see `docker-compose.yml`): `cp .env.example .env` then fill in the
real values. `.env*` is git-ignored, so local secrets never get pushed.

**Without `RUSTFS_SECRET_KEY` the app still builds and serves (HTTP 200); the
gallery just returns an empty placeholder.** This is by design — set the var
to populate the gallery.

## 5. Photography gallery — credential notes
- The gallery fetches `/api/photos`, which lists the `photos` bucket and mints
  presigned GET URLs server-side using the AWS SDK v3 `S3Client`
  (`forcePathStyle: true`).
- Endpoint is `https://rustfs-dkgj.srv1865422.hstgr.cloud` (the Hostinger
  Object Storage gateway; path-style, bucket at root).
- **You must supply `RUSTFS_ACCESS_KEY` + `RUSTFS_SECRET_KEY`** — the
  credentials for your RustFS bucket. Without them the route returns an empty
  list and the gallery shows a "curating" placeholder.
- Alternatively, set `DEMO_PHOTO_URLS` to a comma-separated list of image URLs
  to verify the gallery end-to-end before wiring the real secret.

## 6. Verify
After deploy, visit `https://japnam.tech/`. Every page should return 200 and
`/api/photos` should return presigned `src` URLs that load JPEGs (once the
real `RUSTFS_SECRET_KEY` is set). A `{"photos":[]}` response with HTTP 200 means
the app is healthy but storage creds are missing — not an error.
