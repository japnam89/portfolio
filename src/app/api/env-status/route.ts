import { NextResponse } from "next/server";

// Reports which RUSTFS_* config vars are present in the running environment,
// WITHOUT exposing secret values. Lets you diagnose a blank gallery from a
// single curl (e.g. https://japnam.tech/api/env-status) instead of needing
// `kubectl exec`. Never returns secret material — only booleans + lengths.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KEYS = [
  "RUSTFS_ENDPOINT",
  "RUSTFS_REGION",
  "RUSTFS_ACCESS_KEY",
  "RUSTFS_SECRET_KEY",
  "RUSTFS_BUCKET",
  "RUSTFS_URL_EXPIRES",
  "DEMO_PHOTO_URLS",
];

export async function GET() {
  const present: Record<string, boolean | number | string> = {};
  for (const k of KEYS) {
    const v = process.env[k];
    present[k] = v ? (k.includes("SECRET") || k.includes("KEY") ? v.length : v) : false;
  }
  const rustfsConfigured = Boolean(
    process.env.RUSTFS_ACCESS_KEY && process.env.RUSTFS_SECRET_KEY,
  );
  return NextResponse.json({
    rustfsConfigured,
    demoMode: Boolean(process.env.DEMO_PHOTO_URLS),
    vars: present,
  });
}
