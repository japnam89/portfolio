import { Resend } from "resend";

// Shared transactional-email helper. Mirrors the pattern used by /api/contact.
// Respects RESEND_API_KEY + a recipient env var; falls back to console logging
// when those aren't set (so flows still work in dev).

export async function sendEmail(opts: {
  to?: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = opts.to || process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    // Dev fallback: log instead of failing.
    console.log("[email] (no RESEND_API_KEY/recipient) would send:", {
      to,
      subject: opts.subject,
    });
    return { ok: true };
  }
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
      to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    if (error) {
      console.error("[email] resend error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { ok: false, error: String(err) };
  }
}
