import { resume } from "@/data/resume";
import PdfKit from "pdfkit";
import { NextResponse } from "next/server";

// GET /api/resume-pdf — generates a real PDF from src/data/resume.ts and streams
// it back as a download. Runs on the Node.js server (needs Node runtime, so it
// is excluded from static exports). `force-dynamic` ensures it executes per
// request (pdfkit loads font files at runtime, not at build/prerender time).
export const dynamic = "force-dynamic";

export async function GET() {
  const doc = new PdfKit({ margin: 50 });

  // Stream the PDF bytes directly into the HTTP response (no Buffer type issue).
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      doc.on("data", (chunk: Uint8Array) => controller.enqueue(chunk));
      doc.on("end", () => controller.close());
      doc.on("error", (err) => controller.error(err));

      // ---- render content ----
      doc.fontSize(22).font("Helvetica-Bold").text(resume.name);
      doc.fontSize(12).font("Helvetica").fillColor("#2563eb").text(resume.title);
      doc.fillColor("#000").fontSize(10).text(
        [resume.contact.email, resume.contact.github, resume.contact.linkedin].join(
          "   |   "
        )
      );

      doc.moveDown().fontSize(11).font("Helvetica").text(resume.summary);

      const section = (title: string) => {
        doc.moveDown().fontSize(14).font("Helvetica-Bold").text(title);
        doc.moveDown(0.25);
      };

      section("Experience");
      for (const job of resume.experience) {
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(`${job.role} — ${job.company}  (${job.period})`);
        for (const p of job.points) {
          doc.fontSize(10).font("Helvetica").text(`• ${p}`, { indent: 12 });
        }
        doc.moveDown(0.4);
      }

      section("Education");
      for (const e of resume.education) {
        doc.fontSize(11).font("Helvetica-Bold").text(`${e.degree} — ${e.school}`);
        doc.fontSize(10).font("Helvetica").text(e.period);
        doc.moveDown(0.4);
      }

      doc.end();
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${resume.name.replace(
        /\s+/g,
        "_"
      )}_Resume.pdf"`,
    },
  });
}
