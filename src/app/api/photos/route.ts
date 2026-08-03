import { NextResponse } from "next/server";
import { listPhotoKeys, presignGet } from "@/lib/hostinger";

// Server-side only. Always runs fresh so presigned URLs don't go stale in
// the static build.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// TEMP: if DEMO_PHOTO_URLS is set (comma-separated presigned URLs), return
// those directly so the gallery is verifiable before the real S3 secret is
// wired. DELETE this block once RUSTFS_SECRET_KEY is correct.
export async function GET() {
  const demo = process.env.DEMO_PHOTO_URLS;
  if (demo) {
    const photos = demo
      .split(",")
      .map((src, i) => ({ key: `photos/DEMO${i}.JPG`, src: src.trim() }))
      .filter((p) => p.src);
    return NextResponse.json({ photos });
  }
  try {
    const keys = await listPhotoKeys();
    const photos = await Promise.all(
      keys.map(async (key) => ({ key, src: await presignGet(key) })),
    );
    return NextResponse.json({ photos });
  } catch (err) {
    // No usable storage credentials yet (or the bucket is unreachable).
    // Return an empty list so the gallery can show a graceful placeholder
    // instead of erroring out.
    console.error("[/api/photos] storage unavailable, returning empty list:", err);
    return NextResponse.json({ photos: [] });
  }
}
