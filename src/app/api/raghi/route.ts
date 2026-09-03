// POST /api/raghi
// Triggers the n8n workflow that generates the monthly Raghi list.
//
// IMPORTANT — two things needed on the n8n side for this to work:
//   1. The sgpc-kirtan-duty workflow must be toggled to "Active" on the
//      n8n canvas (top-right corner, switch from "Execute" to "Active").
//   2. The n8n container (on the VPS) needs Traefik labels so that
//      n8n-1lje.srv1948665.hstgr.cloud/webhook/* routes to n8n (port 5678)
//      instead of falling through to the portfolio app's /convert endpoint.
//      Without those labels, /webhook/* hits the portfolio app and returns
//      a PDF; only /webhook-test/* reaches n8n.
//
// Currently the default URL is the TEST webhook because the VPS n8n container
// doesn't have Traefik labels. For always-on production mode:
//   a) Add Traefik labels to the n8n container on the VPS (see deploy docs)
//   b) Change the URL below to /webhook/sgpc-kirtan-duty (no -test)
//   c) Toggle the workflow to "Active" on the n8n canvas
//
// Test-mode webhooks need "Execute workflow" clicked on the canvas first
// (one-shot — works for one call after clicking).
//
// Usage (client):
//   fetch('/api/raghi', { method: 'POST' })
//     → { ok: true, message: 'Raghi list request queued' }

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Default: test webhook (reaches n8n through current Traefik setup).
// Change to /webhook/sgpc-kirtan-duty (production, always-on) once
// Traefik labels are added to the n8n container on the VPS.
const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ??
  "https://n8n-1lje.srv1948665.hstgr.cloud/webhook-test/sgpc-kirtan-duty";

export async function POST() {
  // Fire-and-forget: trigger the n8n workflow, don't wait for its result.
  // If the webhook isn't reachable/registered, log it but still return 200
  // to the client so the button doesn't break.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ source: "japnam.tech/raghi" }),
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
    webhook_url: N8N_WEBHOOK_URL,
    note:
      "For always-on: (1) toggle workflow Active on n8n canvas, (2) add Traefik labels to n8n container on VPS, (3) switch URL to /webhook/sgpc-kirtan-duty.",
  });
}
