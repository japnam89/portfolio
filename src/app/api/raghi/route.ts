// POST /api/raghi
// Triggers the n8n workflow that generates the monthly Raghi list.
// The n8n webhook URL is configured via N8N_WEBHOOK_URL env var.
//
// Usage (client):
//   fetch('/api/raghi', { method: 'POST' })
//     → { ok: true, message: 'Raghi list request queued' }
//
// The n8n workflow should expose this webhook via
//   https://n8n-1lje.srv1948665.hstgr.cloud/webhook-test/sgpc-kirtan-duty
// (test-mode webhook — click "Execute workflow" on the n8n canvas first).

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ?? "https://n8n-1lje.srv1948665.hstgr.cloud/webhook-test/sgpc-kirtan-duty";

export async function POST() {
  // Fire-and-forget: trigger the n8n workflow, don't wait for its result.
  // n8n test-mode webhooks are one-shot; if the workflow isn't executed on
  // the canvas first, the webhook returns 404 — log it and still return 200
  // to the client so the button doesn't break.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Accept": "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[raghi] n8n webhook returned ${res.status}: ${text.slice(0, 200)}`);
    } else {
      console.log(`[raghi] n8n webhook triggered OK (${res.status})`);
    }
  } catch (err) {
    console.error("[raghi] failed to reach n8n webhook:", err);
  }

  return NextResponse.json(
    { ok: true, message: "Raghi list request queued" },
    { status: 200 },
  );
}

// GET gives a friendly note when someone visits /api/raghi directly.
export async function GET() {
  return NextResponse.json({
    message: "POST to trigger the monthly Raghi list workflow.",
    n8n_webhook: N8N_WEBHOOK_URL,
  });
}
