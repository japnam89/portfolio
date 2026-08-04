import { NextResponse } from "next/server";
import { listPosts, createPost } from "@/lib/blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/posts -> list (public)
export async function GET() {
  try {
    return NextResponse.json({ posts: listPosts() });
  } catch (err) {
    console.error("[/api/posts] list failed:", err);
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}

// POST /api/posts -> create (open, no auth)
export async function POST(req: Request) {
  let body: { title?: string; content?: string; excerpt?: string; cover?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.title || !body.content) {
    return NextResponse.json(
      { error: "title and content are required" },
      { status: 400 },
    );
  }
  try {
    const post = createPost({
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      cover: body.cover,
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("[/api/posts] create failed:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
