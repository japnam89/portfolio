import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

export function isAdminPassword(candidate: string | null | undefined): boolean {
  const password = process.env.POST_ADMIN_PASSWORD;
  if (!password || !candidate) return false;

  const expected = Buffer.from(password);
  const provided = Buffer.from(candidate);
  return (
    expected.length === provided.length &&
    timingSafeEqual(expected, provided)
  );
}

export function createAdminSessionToken(now = Date.now()): string {
  const password = process.env.POST_ADMIN_PASSWORD;
  if (!password) throw new Error("POST_ADMIN_PASSWORD is not configured");

  const issuedAt = Math.floor(now / 1000).toString();
  return `${issuedAt}.${sign(issuedAt, password)}`;
}

export function isValidAdminSession(
  token: string | undefined,
  now = Date.now(),
): boolean {
  const password = process.env.POST_ADMIN_PASSWORD;
  if (!password || !token) return false;

  const separator = token.indexOf(".");
  if (separator <= 0) return false;

  const issuedAt = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!/^\d+$/.test(issuedAt) || !signature) return false;

  const issuedAtSeconds = Number(issuedAt);
  const nowSeconds = Math.floor(now / 1000);
  if (
    !Number.isSafeInteger(issuedAtSeconds) ||
    issuedAtSeconds > nowSeconds ||
    nowSeconds - issuedAtSeconds > ADMIN_SESSION_MAX_AGE_SECONDS
  ) {
    return false;
  }

  const expected = Buffer.from(sign(issuedAt, password));
  const provided = Buffer.from(signature);
  return (
    expected.length === provided.length &&
    timingSafeEqual(expected, provided)
  );
}

function sign(value: string, password: string): string {
  return createHmac("sha256", password).update(value).digest("base64url");
}
