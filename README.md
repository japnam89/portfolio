# My Portfolio

A personal developer portfolio built with **Next.js (App Router)**, **React**,
**TypeScript**, and **Tailwind CSS**. It includes a working **Node.js API route**
for the contact form that sends real email via [Resend](https://resend.com).

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build
npm run lint     # eslint
npm run start    # serve the production build
```

## Contact form email (optional)

The form works out of the box (it logs messages to the server console).
To send real email:

1. Copy `.env.example` to `.env.local`
2. Get a free API key at https://resend.com (10k emails/month free)
3. Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL`
4. Restart `npm run dev`

## Deploy to Vercel

```bash
npx vercel         # first time: log in, then deploy
npx vercel --prod  # production
```

Add `RESEND_API_KEY` and `CONTACT_TO_EMAIL` as Environment Variables in the
Vercel project settings.

## Deploy to Hostinger

### Option A — Hostinger Node.js hosting / VPS (recommended; contact form works)

1. In the Hostinger dashboard, create a **Node.js** app and point its root to this
   project folder.
2. Set the **start command** to: `npm run start`
3. Set the **build command** to: `npm run build`
4. Add Environment Variables (same names as `.env.example`):
   `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
5. Hostinger sets `PORT` and `HOST` for you — `npm run start` (which runs
   `next start`) picks them up automatically. Done.

### Option B — Hostinger shared / "Website" hosting (static FTP upload)

Shared hosting has no Node runtime, so export a static site:

1. Open `next.config.ts` and uncomment `output: "export",`
2. Run `npm run build` — this generates an `out/` folder
3. Upload the **contents of `out/`** to `public_html/` via FTP (FileZilla)

> ⚠️ On static hosting the contact **API route won't run** (no server). The form
> still submits client-side but email sending needs the Node backend — use
> Option A if you want the contact form to actually email you.

## Project structure

```
src/
  app/
    page.tsx            # Home (/)
    about/page.tsx      # About (/about)
    projects/page.tsx   # Projects (/projects)
    contact/page.tsx    # Contact form (/contact)  -> "use client"
    api/contact/route.ts# Node.js backend (POST /api/contact)
    layout.tsx          # Navbar + Footer + metadata
    globals.css         # styles + entrance animation + dark hero
  components/
    Navbar.tsx
    Footer.tsx
  data/
    projects.ts         # EDIT THIS: your projects & skills
```
