# Deploy to japnam.tech (Hostinger Node hosting)

This is a Next.js 16 App Router app (Node server, not static export). It runs
with `npm run build` then `npm run start`.

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

## 2. Hostinger Git Deployment
In hPanel → your `japnam.tech` Node hosting → **Git** (or Git Deployment /
Auto Deploy):
- Repository URL: `https://github.com/japnam89/portfolio.git`
- Branch: `main`
- Build command: `npm run build`
- Start command / Node start: `npm run start`
- Node version: 22 (matches local `node -v`)

Then add `japnam.tech` as the domain on this hosting and point its DNS
(Hostinger nameservers, or an A record) at the hosting.

## 3. Environment variables (DO NOT commit — set in hPanel)
hPanel → the hosting → **Environment / Variables** (or `.env` editor). Copy
from `.env.example`. The critical ones:

```
RESEND_API_KEY=...
CONTACT_TO_EMAIL=...
CONTACT_FROM_EMAIL=...
RUSTFS_ENDPOINT=http://2.25.91.163:32773
RUSTFS_REGION=us-east-1
RUSTFS_ACCESS_KEY=CTzANZ5xQ9gwielhjUQ8
RUSTFS_SECRET_KEY=<real secret — revealed when the key is created in hPanel>
RUSTFS_SESSION_TOKEN=<only if using temporary/session creds>
RUSTFS_URL_EXPIRES=3600
```

`.env*` is git-ignored, so local `.env.local` never gets pushed.

## 4. Photography gallery — credential notes
- The gallery fetches `/api/photos`, which lists the `photos/` prefix of the
  bucket and mints presigned GET URLs server-side (using the `aws4` lib).
- Endpoint is `http://2.25.91.163:32773` (path-style, bucket at root).
- **You must supply `RUSTFS_SECRET_KEY`** — the actual Secret Access Key for
  `CTzANZ5xQ9gwielhjUQ8`. The 40-char strings tried during setup were NOT it;
  the real one is shown once when the key is created in hPanel. Without it the
  route returns an empty list and the gallery shows a "curating" placeholder.
- If you only have a session (temporary) credential, also set
  `RUSTFS_SESSION_TOKEN` to the token from a working share URL.

## 5. Verify
After deploy, visit `https://japnam.tech/`. Every page should return 200 and
`/api/photos` should return presigned `src` URLs that load JPEGs (once the
real `RUSTFS_SECRET_KEY` is set).
