import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  isAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!process.env.POST_ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Admin authentication is not configured" },
      { status: 503 },
    );
  }

  let body: { password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.password !== "string" || !isAdminPassword(body.password)) {
    return NextResponse.json(
      { error: "Invalid admin password" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken(),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    },
  );
  return response;
}
