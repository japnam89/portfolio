import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep pdfkit out of the bundle so it can resolve its bundled font files
  // (Helvetica.afm) at runtime from node_modules instead of a phantom path.
  // better-sqlite3 is a native addon — externalize it so the host's prebuilt
  // binary is required at runtime (avoids Turbopack ABI mismatches).
  serverExternalPackages: ["pdfkit", "better-sqlite3"],

  // Allow images served from Hostinger Object Storage (RustFS). The gallery
  // uses `unoptimized` so remotePatterns isn't strictly required, but it's
  // set correctly in case optimization is toggled on later.
  // Host from your share URL: rustfs-dkgj.srv1865422.hstgr.cloud
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.srv1865422.hstgr.cloud" },
      { protocol: "https", hostname: "images.credly.com" },
    ],
  },

  // --- Hostinger deployment ---
  //
  // DEFAULT (Node.js hosting / VPS): leave as-is. Hostinger runs `npm run
  // build` then `npm run start`. Next.js binds to the PORT env var Hostinger
  // provides and listens on 0.0.0.0 by default. The contact API route works.
  //
  // SHARED / "Website" hosting (no Node.js): Next can't run a server there, so
  // export a static site instead. Uncomment the `output` line below, then run
  // `npm run build`. The contact API route is excluded from the static export
  // (it needs a server), so the form will still submit client-side but won't
  // send email on shared hosting. Upload the generated `out/` folder via FTP.
  //
  // output: "export",
};

export default nextConfig;
