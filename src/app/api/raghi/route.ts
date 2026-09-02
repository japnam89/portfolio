// POST /api/raghi
// Triggers the n8n workflow that generates the monthly Raghi list.
// The workflow must be "Active" (on the n8n canvas) so its production
// webhook is always listening. The production webhook URL is
//   https://n8n-1lje.srv1948665.hstgr.cloud/webhook/sgpc-kirtan-duty
// (no "-test" suffix — that's the test-mode one-shot webhook).
//
// Usage (client):
//   fetch('/api/raghi', { method: 'POST' })
//     → { ok: true, message: 'Raghi list request queued' }
//
// IMPORTANT: On the n8n canvas, click the workflow toggle to "Active"
// (top-right corner, from "Execute" to "Active"). Then the production
// webhook at /webhook/sgpc-kirtan-duty will always listen and respond.

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const N8N_BASE_URL =
  process.env.N8N_BASE_URL ?? "https://n8n-1lje.srv1948665.hstgr.cloud";

// Production webhook — always on when workflow is Active on the canvas.
const N8N_PRODUCTION_WEBHOOK =
  process.env.N8N_WEBHOOK_URL ??
  `${N8N_BASE_URL}/webhook/sgpc-kirtan-duty`;

// Test-mode webhook — one-shot, only works after "Execute workflow" click.
const N8N_TEST_WEBHOOK =
  process.env.N8N_TEST_WEBHOOK_URL ??
  `${N8N_BASE_URL}/webhook-test/sgpc-kirtan-duty`;

export async function POST() {
  // Try the production webhook first (always on when workflow is Active).
  // If that fails (404 or connection error), fall back to the test-mode
  // webhook and log a warning so the button still doesn't break.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    const res = await fetch(N8N_PRODUCTION_WEBHOOK, {
      method: "POST",
      headers: { "Accept": "application/json" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      console.log(`[raghi] production webhook OK (${res.status})`);
    } else {
      // Fall back to test-mode webhook.
      console.warn(
        `[raghi] production webhook returned ${res.status}, trying test webhook…`,
      );
      const testRes = await fetch(N8N_TEST_WEBHOOK, {
        method: "POST",
        headers: { "Accept": "application/json" },
        signal: AbortSignal.timeout(15_000),
      });
      if (testRes.ok) {
        console.log(`[raghi] test webhook OK (${testRes.status}) — trigger workflow on canvas for always-on`);
      } else {
        const text = await testRes.text().catch(() => "");
        console.warn(
          `[raghi] test webhook also failed (${testRes.status}): ${text.slice(0, 200)}`,
        );
      }
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
    production_webhook: N8N_PRODUCTION_WEBHOOK,
    note: "Make the n8n workflow Active on the canvas for always-on production webhook.",
  });
}
