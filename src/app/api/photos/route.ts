import { NextResponse } from "next/server";
import { listPhotoKeys, presignGet } from "@/lib/hostinger";

// Server-side only. Always runs fresh so presigned URLs don't go stale in
// the static build.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // If DEMO_PHOTO_URLS is set, serve those directly (temporary override).
  const demo = process.env.DEMO_PHOTO_URLS;
  if (demo) {
    const photos = demo
      .split(",")
      .map((src, i) => ({ key: `photos/DEMO${i}.JPG`, src: src.trim() }))
      .filter((p) => p.src);
    return NextResponse.json({ photos, source: "demo" });
  }

  const configured = Boolean(
    process.env.RUSTFS_ACCESS_KEY && process.env.RUSTFS_SECRET_KEY,
  );

  // Without credentials there's no point calling RustFS — return an empty
  // gallery (200) instead of letting the SDK throw a 500.
  if (!configured) {
    return NextResponse.json({
      photos: [],
      source: "rustfs",
      configured: false,
      error: "RUSTFS_ACCESS_KEY / RUSTFS_SECRET_KEY not set in environment",
    });
  }

  try {
    const keys = await listPhotoKeys();
    const photos = await Promise.all(
      keys.map(async (key) => ({ key, src: await presignGet(key) })),
    );
    return NextResponse.json({ photos, source: "rustfs", configured });
  } catch (err) {
    // Surface the real failure so a blank live gallery is debuggable instead
    // of silently returning []. `err` is an S3 error (name + message).
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/photos] storage unavailable:", err);
    return NextResponse.json(
      {
        photos: [],
        source: "rustfs",
        configured,
        error: configured
          ? `RustFS list failed: ${message}`
          : "RUSTFS_ACCESS_KEY / RUSTFS_SECRET_KEY not set in environment",
      },
      { status: 200 }, // 200 so the client still renders the gallery shell
    );
  }
}
