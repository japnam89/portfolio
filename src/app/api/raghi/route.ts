// POST /api/raghi
// Fetches the monthly Raghi / kirtan duty list PDF from
// https://hs.sgpc.net/kirtan_duty_english_pdf.php and streams it
// back to the client as a download. No n8n dependency.
//
// On the frontend this is called from /raghi — the button says
// "Download raagi list of this month" and triggers this endpoint.
//
// Usage (client):
//   fetch('/api/raghi', { method: 'POST' })
//     → binary PDF, Content-Type: application/pdf, Content-Disposition: attachment

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SGPC_KIRTAN_DUTY_PDF =
  process.env.SGPC_KIRTAN_DUTY_PDF_URL ??
  "https://hs.sgpc.net/kirtan_duty_english_pdf.php";

export async function POST() {
  let upstream: Response;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    upstream = await fetch(SGPC_KIRTAN_DUTY_PDF, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeout);
  } catch (err) {
    console.error("[raghi] failed to fetch SGPC PDF:", err);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Failed to reach SGPC — the kirtan duty list may not be published yet this month. Try again later.",
      },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    const body = await upstream.text().catch(() => "");
    console.error(
      `[raghi] SGPC returned ${upstream.status}: ${body.slice(0, 500)}`,
    );
    return NextResponse.json(
      {
        ok: false,
        message: `SGPC returned HTTP ${upstream.status}. The list may not be available yet this month.`,
      },
      { status: 502 },
    );
  }

  // Stream the PDF straight through to the client.
  const headers = new Headers(upstream.headers);
  headers.set("Content-Disposition", 'attachment; filename="kirtan_duty_list.pdf"');
  headers.set("Cache-Control", "no-cache, no-store, must-revalidate");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}

// GET gives a friendly note when someone visits /api/raghi directly.
export async function GET() {
  return NextResponse.json({
    message: "POST to download the monthly Raghi / kirtan duty list PDF.",
    source: SGPC_KIRTAN_DUTY_PDF,
    note: "The list is fetched live from hs.sgpc.net each time you click Download.",
  });
}
