// Server-only helper for Hostinger Object Storage (RustFS, fronted by Traefik).
// Lists photo objects under PHOTOS_PREFIX and mints fresh presigned GET URLs.
//
// Learned from a working share URL (http://2.25.91.163:32773/photos/...):
// - The S3 gateway is reached at ENDPOINT (an IP:port, e.g. 2.25.91.163:32773),
//   NOT the public srv1865422.hstgr.cloud host. Sign host = that endpoint host.
// - Path-style, and the bucket (rustfs-dkgj) is served at the ROOT — i.e. the
//   object key is just "photos/XXX.JPG" with no bucket prefix in the path.
// - Requests use a session access key + session token (temp credentials).
// - We use the `aws4` library (correct, minimal SigV4).
import aws4 from "aws4";

const endpoint = process.env.RUSTFS_ENDPOINT ?? "http://2.25.91.163:32773";
const region = process.env.RUSTFS_REGION ?? "us-east-1";
const accessKeyId = process.env.RUSTFS_ACCESS_KEY;
const secretAccessKey = process.env.RUSTFS_SECRET_KEY ?? process.env.RUSTFS_SECRET_ACCESS_KEY;
const sessionToken = process.env.RUSTFS_SESSION_TOKEN;
const expires = Number(process.env.RUSTFS_URL_EXPIRES ?? 3600);

// NOTE: credential validation is intentionally deferred to request time (inside
// `presign`), NOT at module load. Throwing here would crash `next build`
// during "Collecting page data" even for the dynamic /api/photos route, which
// is built to degrade gracefully when storage is unavailable.
function requireCreds() {
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("RustFS env vars missing. Set RUSTFS_ACCESS_KEY / RUSTFS_SECRET_KEY (and RUSTFS_ENDPOINT, RUSTFS_SESSION_TOKEN).");
  }
}

// Parse host:port from the endpoint for SigV4 host signing.
const endpointHost = endpoint.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const PHOTOS_PREFIX = "photos/";
const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif|bmp)$/i;

// Presign with aws4. Path-style, bucket at root (key already includes prefix).
function presign(key: string, xId = "GetObject"): string {
  requireCreds();
  const signed = aws4.sign({
    accessKeyId,
    secretAccessKey,
    ...(sessionToken ? { sessionToken } : {}),
    service: "s3",
    region,
    host: endpointHost,
    path: `/${key}?x-amz-checksum-mode=ENABLED&x-id=${xId}`,
    signQuery: true,
    expires,
  });
  return signed.url || `${endpoint}/${key}`;
}

// List every image object under PHOTOS_PREFIX.
export async function listPhotoKeys(): Promise<string[]> {
  const keys: string[] = [];
  let continuation: string | undefined;
  do {
    const extra: Record<string, string> = {};
    if (continuation) extra["continuation-token"] = continuation;
    const url = presign("", "ListObjectsV2");
    const u = new URL(url);
    u.searchParams.set("x-id", "ListObjectsV2");
    u.searchParams.set("list-type", "2");
    u.searchParams.set("prefix", PHOTOS_PREFIX);
    if (continuation) u.searchParams.set("continuation-token", continuation);

    const res = await fetch(u.toString());
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`ListObjects failed ${res.status}: ${body.slice(0, 200)}`);
    }
    const xml = await res.text();
    const contents = xml.match(/<Contents>([\s\S]*?)<\/Contents>/g) ?? [];
    for (const c of contents) {
      const k = c.match(/<Key>(.*?)<\/Key>/)?.[1];
      if (k && IMAGE_RE.test(k)) keys.push(k);
    }
    continuation = xml.match(/<NextContinuationToken>(.*?)<\/NextContinuationToken>/)?.[1];
  } while (continuation);
  return keys;
}

// Mint a fresh presigned GET URL for one object.
export async function presignGet(key: string): Promise<string> {
  return presign(key);
}
