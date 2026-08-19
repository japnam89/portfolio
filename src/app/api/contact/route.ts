import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { Resend } from "resend";

// On static export (shared hosting) this route can't run, so we mark
// it static and it is simply omitted from the build. Under `next start` it runs
// normally. `force-static` is safe in both modes.
export const dynamic = "force-static";

// This is the BACKEND. The file path `app/api/contact/route.ts` becomes the
// endpoint POST /api/contact. This is real Node.js server code running inside
// Next.js — it never ships to the browser.

// `POST` is the function Next.js calls when a POST request hits this route.
// `Request` is the standard web Request object (same one browsers use).
export async function POST(request: Request) {
  // 1. Read the JSON body the browser form sent.
  let data: { name?: string; email?: string; message?: string };
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, message } = data;

  // 2. Simple validation (never trust the client!).
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "name, email and message are required" },
      { status: 400 }
    );
  }

  // Basic email-shape check — good enough for a portfolio form.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  // 3. If a Resend key is configured, send a REAL email.
  //    Otherwise, fall back to logging (so the form still works in dev).
  if (apiKey && toEmail) {
    try {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
        to: toEmail,
        replyTo: email,
        subject: `Portfolio contact from ${name}`,
        text: `New message from ${name} <${email}>:\n\n${message}`,
      });

      if (error) {
        console.error("[contact] resend error:", error);
        return NextResponse.json(
          { error: "Could not send email. Please try again." },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error("[contact] send failed:", err);
      return NextResponse.json(
        { error: "Could not send email. Please try again." },
        { status: 502 }
      );
    }
  } else {
    // Dev fallback: log to the server console and keep going.
    console.log("[contact] new message:", { id: randomUUID(), name, email, message });
  }

  // 4. Send a response back to the browser.
  return NextResponse.json(
    { ok: true, message: "Received your message" },
    { status: 200 }
  );
}

// Optional: handle GET so visiting the URL in a browser gives a friendly note
// instead of an error.
export async function GET() {
  return NextResponse.json({ message: "Send a POST to contact me." });
}
