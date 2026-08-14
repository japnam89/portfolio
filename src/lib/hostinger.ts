// Server-only helper for Hostinger Object Storage (RustFS, S3-compatible).
// Lists photo objects in the `photos` bucket and mints fresh presigned GET
// URLs. Uses the official AWS SDK v3 S3Client with path-style addressing
// (RustFS serves buckets at the root of its gateway host).
//
// Verified working config (tested from this environment):
// - endpoint: https://rustfs-dkgj.srv1865422.hstgr.cloud
// - region: us-east-1
// - accessKeyId / secretAccessKey: from RUSTFS_ACCESS_KEY / RUSTFS_SECRET_KEY
// - bucket: "photos" (forcePathStyle: true)
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = process.env.RUSTFS_ENDPOINT ?? "https://rustfs-dkgj.srv1865422.hstgr.cloud";
const region = process.env.RUSTFS_REGION ?? "us-east-1";
const accessKeyId = process.env.RUSTFS_ACCESS_KEY;
const secretAccessKey = process.env.RUSTFS_SECRET_KEY ?? process.env.RUSTFS_SECRET_ACCESS_KEY;
const bucket = process.env.RUSTFS_BUCKET ?? "photos";
const expires = Number(process.env.RUSTFS_URL_EXPIRES ?? 3600);

// NOTE: credential validation is deferred to request time (inside the client
// call), NOT at module load — so `next build` doesn't crash when these env vars
// are absent in some environments.
const client = new S3Client({
  region,
  endpoint,
  credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
  forcePathStyle: true,
});

export const PHOTOS_PREFIX = "photos/";
const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif|bmp)$/i;

// List every image object in the photos bucket. Objects are stored with bare
// keys (e.g. "DSC08068.JPG") inside the "photos" bucket, so we list with no
// prefix and filter by extension. (Listing with Prefix "photos/" would
// double up to "photos/photos/..." and return nothing.)
export async function listPhotoKeys(): Promise<string[]> {
  const keys: string[] = [];
  let continuation: string | undefined;
  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuation,
      })
    );
    for (const obj of res.Contents ?? []) {
      if (obj.Key && IMAGE_RE.test(obj.Key)) keys.push(obj.Key);
    }
    continuation = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuation);
  return keys;
}

// Mint a fresh presigned GET URL for one object.
export async function presignGet(key: string): Promise<string> {
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: expires },
  );
}

// Upload an object's body (Buffer) into the bucket. Used by the /convert
// pipeline to park the user's uploaded doc and the resulting PDF.
// `contentType` is set so browsers/downloads open it correctly.
export async function putObject(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

// Mint a presigned PUT URL so a browser can upload a file directly to the
// bucket without proxying the bytes through the Next.js server.
export async function presignPut(
  key: string,
  contentType: string,
  expiresIn = 600,
): Promise<string> {
  return getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn },
  );
}
