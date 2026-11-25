// POST /api/raghi
// Fetches the selected monthly Raghi / kirtan duty list PDF from SGPC, reads
// the schedule date for a month-specific filename, and returns it as a download.
//
// On the frontend this is called from /raghi — the button says
// "Download raagi list of this month" and triggers this endpoint.
//
// Usage (client):
//   fetch('/api/raghi', { method: 'POST' })
//     → binary PDF, Content-Type: application/pdf, Content-Disposition: attachment

import { NextResponse } from "next/server";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export const dynamic = "force-dynamic";

const SGPC_KIRTAN_DUTY_PDFS = {
  english:
    process.env.SGPC_KIRTAN_DUTY_PDF_URL ??
    "https://hs.sgpc.net/kirtan_duty_english_pdf.php",
  punjabi:
    process.env.SGPC_KIRTAN_DUTY_PUNJABI_PDF_URL ??
    "https://hs.sgpc.net/kirtan_duty_punjabi_pdf.php",
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const PUNJABI_MONTH_NAMES = [
  "ਜਨਵਰੀ",
  "ਫਰਵਰੀ",
  "ਮਾਰਚ",
  "ਅਪ੍ਰੈਲ",
  "ਮਈ",
  "ਜੂਨ",
  "ਜੁਲਾਈ",
  "ਅਗਸਤ",
  "ਸਤੰਬਰ",
  "ਅਕਤੂਬਰ",
  "ਨਵੰਬਰ",
  "ਦਸੰਬਰ",
];

async function getScheduleMonth(pdfData: Uint8Array) {
  const loadingTask = getDocument({ data: pdfData.slice() });
  const document = await loadingTask.promise;

  try {
    let text = "";
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      text += ` ${content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")}`;
    }

    const date = text.match(/(\d{1,2})\s*[./-]\s*(\d{1,2})\s*[./-]\s*(\d{4})/);
    if (!date) throw new Error("No schedule date found in the PDF.");

    const day = Number(date[1]);
    const month = Number(date[2]);
    const year = Number(date[3]);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    if (
      day < 1 ||
      month < 1 ||
      month > 12 ||
      parsedDate.getUTCDate() !== day ||
      parsedDate.getUTCMonth() !== month - 1 ||
      parsedDate.getUTCFullYear() !== year
    ) {
      throw new Error("The schedule date in the PDF is invalid.");
    }

    return { month: MONTH_NAMES[month - 1], monthIndex: month - 1, year };
  } finally {
    await loadingTask.destroy();
  }
}

export async function POST(request: Request) {
  const requestedLanguage =
    new URL(request.url).searchParams.get("language") ?? "english";

  if (requestedLanguage !== "english" && requestedLanguage !== "punjabi") {
    return NextResponse.json(
      { ok: false, message: "Choose English or Punjabi." },
      { status: 400 },
    );
  }

  const language = requestedLanguage;
  const source = SGPC_KIRTAN_DUTY_PDFS[language];
  let upstream: Response;
  let pdfData: ArrayBuffer;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    upstream = await fetch(source, {
      method: "GET",
      signal: controller.signal,
    });

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

    pdfData = await upstream.arrayBuffer();
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
  } finally {
    clearTimeout(timeout);
  }

  if (new TextDecoder().decode(new Uint8Array(pdfData).subarray(0, 5)) !== "%PDF-") {
    console.error(`[raghi] SGPC returned a non-PDF response for ${language}.`);
    return NextResponse.json(
      {
        ok: false,
        message: "SGPC did not return a valid PDF. Try again later.",
      },
      { status: 502 },
    );
  }

  let schedule: Awaited<ReturnType<typeof getScheduleMonth>>;
  try {
    schedule = await getScheduleMonth(new Uint8Array(pdfData));
  } catch (err) {
    console.error("[raghi] failed to extract schedule month from PDF:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Could not read the schedule month from the SGPC PDF.",
      },
      { status: 502 },
    );
  }

  const filename =
    language === "punjabi"
      ? `ਰਾਗੀ_ਸੂਚੀ_${PUNJABI_MONTH_NAMES[schedule.monthIndex]}_${schedule.year}_ਪੰਜਾਬੀ.pdf`
      : `Raghi_List_${schedule.month}_${schedule.year}_English.pdf`;
  const fallbackFilename =
    language === "punjabi"
      ? `Raghi_List_${schedule.month}_${schedule.year}_Punjabi.pdf`
      : filename;
  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${fallbackFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
  });
  headers.set("Cache-Control", "no-cache, no-store, must-revalidate");

  return new NextResponse(pdfData, {
    status: 200,
    headers,
  });
}

// GET gives a friendly note when someone visits /api/raghi directly.
export async function GET() {
  return NextResponse.json({
    message:
      "POST to download the monthly Raghi / kirtan duty list PDF. Use ?language=english or ?language=punjabi.",
    sources: SGPC_KIRTAN_DUTY_PDFS,
    note: "The selected language is fetched live from hs.sgpc.net.",
  });
}
