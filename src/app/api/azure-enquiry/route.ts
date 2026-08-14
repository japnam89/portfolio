import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";

// POST /api/azure-enquiry — handles the Azure 1:1 training enquiry form.
// Reuses the shared sendEmail helper (Resend) used by /api/contact.
export async function POST(request: Request) {
  let data: {
    name?: string;
    email?: string;
    level?: string;
    focus?: string[];
    timing?: string;
    message?: string;
  };
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, level, focus, timing, message } = data;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "name, email and message are required" },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 },
    );
  }

  const focusList = Array.isArray(focus) && focus.length ? focus.join(", ") : "—";
  const text =
    `New Azure 1:1 training enquiry from ${name} <${email}>:\n\n` +
    `Experience level: ${level || "—"}\n` +
    `Focus areas: ${focusList}\n` +
    `Preferred timing: ${timing || "—"}\n\n` +
    `Message:\n${message}`;

  const { ok, error } = await sendEmail({
    to: process.env.CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `Azure 1:1 training enquiry — ${name}`,
    text,
  });

  if (!ok) {
    return NextResponse.json(
      { error: error || "Could not send enquiry. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, message: "Enquiry received" });
}

export async function GET() {
  return NextResponse.json({ message: "Send a POST to enquire about Azure 1:1 training." });
}
