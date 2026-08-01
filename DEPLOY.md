# Deploy to japnam.com (Hostinger Node hosting)

This is a Next.js 16 App Router app (Node server, not static export). It runs
with `npm run build` then `npm run start`.

## 1. Push the code
The repo has no remote yet. From this directory:

```bash
git init
git add -A
git commit -m "Portfolio: photography gallery + deploy-ready"
git remote add origin <your-repo-url>   # GitHub (github.com/japnam89) or Hostinger Git
git push -u origin main
```

## 2. Hostinger Git Deployment
In hPanel → your `japnam.com` hosting → **Git** (or **Git Deployment** / Auto Deploy):
- Repository URL: the repo above
- Branch: `main`
- Build command: `npm run build`
- Run command / Node start: `npm run start`
- Node version: 22 (matches local `node -v`)

Add `japnam.com` as a domain and point its DNS (A/AAAA or Hostinger's nameservers)
at this hosting.

## 3. Environment variables (DO NOT commit — set in hPanel)
hPanel → the hosting → **Environment / Variables** (or `.env` editor). Copy from
`.env.example`. The critical ones:

```
RESEND_API_KEY=...
CONTACT_TO_EMAIL=...
CONTACT_FROM_EMAIL=...
RUSTFS_ENDPOINT=http://<gateway-host>:<port>
RUSTFS_REGION=us-east-1
RUSTFS_ACCESS_KEY=CTzANZ5xQ9gwielhjUQ8
RUSTFS_SECRET_KEY=<real secret — revealed once in hPanel>
RUSTFS_SESSION_TOKEN=<only if using temporary/session creds>
RUSTFS_URL_EXPIRES=3600
```

`.env*` is git-ignored, so local `.env.local` never gets pushed.

## 4. Photography gallery — credential notes
- The gallery fetches `/api/photos`, which lists the `photos/` prefix of the
  bucket and mints presigned GET URLs server-side (using the `aws4` lib).
- The signing host is `RUSTFS_ENDPOINT`'s host:port (the Traefik/RustFS gateway),
  path-style, bucket served at root. This was derived from a working share URL.
- **You must supply `RUSTFS_SECRET_KEY`** — the actual Secret Access Key for
  `CTzANZ5xQ9gwielhjUQ8`. The 40-char strings tried during setup were not it;
  the real one is shown once when the key is created in hPanel. Without it the
  route returns 500 and the gallery is blank.
- If you only have a session (temporary) credential, also set
  `RUSTFS_SESSION_TOKEN` to the token from a working share URL.

## 5. Verify
After deploy, visit `https://japnam.com/photography`. The network tab should
show `/api/photos` returning 200 with presigned `src` URLs that load JPEGs.
