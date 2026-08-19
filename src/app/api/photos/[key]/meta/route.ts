import { NextResponse } from "next/server";
import { upsertCaption, mergeCaption } from "@/lib/captions";
import { metaFor } from "@/data/photos";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin gate: same pattern as /api/posts. POST_ADMIN_PASSWORD in the
// gitignored .env, sent as the `x-admin-password` header.
function adminOk(req: Request): boolean {
  const env = process.env.POST_ADMIN_PASSWORD;
  if (!env) return false; // never allow mutations if no password is configured
  const sent = req.headers.get("x-admin-password") || "";
  return sent === env;
}

// Photo keys contain a slash (e.g. "photos/DSC08068.JPG") so they're passed
// URL-encoded as the [key] segment.
function decodeKey(raw: string): string {
  return decodeURIComponent(raw);
}

// GET /api/photos/[key]/meta -> merged caption (stored over static default)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const key = decodeKey((await params).key);
  const fallback = metaFor(key);
  return NextResponse.json({ key, caption: mergeCaption(key, fallback) });
}

// PUT /api/photos/[key]/meta -> update caption (admin only)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = decodeKey((await params).key);
  let body: {
    title?: string;
    alt?: string;
    location?: string;
    date?: string;
    description?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const updated = upsertCaption(key, body);
  return NextResponse.json({ key, caption: updated });
}
