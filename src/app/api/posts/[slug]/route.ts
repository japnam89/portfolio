import { NextResponse } from "next/server";
import { updatePost, deletePost } from "@/lib/blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin gate: edit/delete require the admin password (set via POST_ADMIN_PASSWORD
// in the gitignored .env). Sent as the `x-admin-password` header.
function adminOk(req: Request): boolean {
  const env = process.env.POST_ADMIN_PASSWORD;
  if (!env) return false; // never allow mutations if no password is configured
  const sent = req.headers.get("x-admin-password") || "";
  return sent === env;
}

// PUT /api/posts/[slug] -> update (admin only)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  let body: { title?: string; content?: string; excerpt?: string; cover?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const updated = updatePost(slug, body);
  if (!updated) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json({ post: updated });
}

// DELETE /api/posts/[slug] -> delete (admin only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!adminOk(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;
  const ok = deletePost(slug);
  if (!ok) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
