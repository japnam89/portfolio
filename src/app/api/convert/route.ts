import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { writeFile, mkdtemp, readFile, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { putObject, presignGet } from "@/lib/hostinger";

export const runtime = "nodejs";
// Conversions can take a few seconds; give the route room to finish.
export const maxDuration = 60;

const execFileP = promisify(execFile);

// Only these are handed to LibreOffice. Anything else is rejected up front so
// we never exec an unknown converter on an arbitrary upload.
const ALLOWED: Record<string, string> = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/msword": ".doc",
  "application/vnd.oasis.opendocument.text": ".odt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.oasis.opendocument.presentation": ".odp",
  "application/rtf": ".rtf",
  "text/plain": ".txt",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.ms-excel": ".xls",
};
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

function liboBinary(): string {
  return process.env.LIBREOFFICE_BIN || "libreoffice";
}

export async function POST(req: NextRequest) {
  // Bucket must be configured or there's nowhere to park the files.
  if (!process.env.RUSTFS_ACCESS_KEY || !process.env.RUSTFS_SECRET_KEY) {
    return NextResponse.json(
      { error: "Storage not configured on the server." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart form." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 25 MB limit." }, { status: 413 });
  }

  const mime = file.type || "";
  const ext = ALLOWED[mime];
  if (!ext) {
    return NextResponse.json(
      { error: `Unsupported file type: ${mime || "unknown"}.` },
      { status: 415 },
    );
  }

  const work = await mkdtemp(join(tmpdir(), "conv-"));
  const inPath = join(work, `in${ext}`);
  const id = randomUUID();
  const baseName = file.name?.replace(/\.[^.]+$/, "") || "document";

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(inPath, buf);

    // Run LibreOffice headless to convert to PDF into the same work dir.
    await execFileP(liboBinary(), [
      "--headless",
      "--convert-to",
      "pdf",
      "--outdir",
      work,
      inPath,
    ], { timeout: 50000 });

    const outPath = join(work, `in.pdf`);
    let pdf: Buffer;
    try {
      pdf = await readFile(outPath);
    } catch {
      return NextResponse.json(
        { error: "Conversion failed — LibreOffice produced no output." },
        { status: 500 },
      );
    }

    // Park both the original and the PDF in the bucket under a convert/ prefix.
    const docKey = `convert/${id}/${baseName}${ext}`;
    const pdfKey = `convert/${id}/${baseName}.pdf`;
    await putObject(docKey, buf, mime);
    await putObject(pdfKey, pdf, "application/pdf");

    const [docUrl, pdfUrl] = await Promise.all([
      presignGet(docKey),
      presignGet(pdfKey),
    ]);

    return NextResponse.json({
      ok: true,
      pdfUrl,
      docUrl,
      pdfKey,
      filename: `${baseName}.pdf`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/convert] failed:", err);
    return NextResponse.json({ error: `Conversion error: ${message}` }, { status: 500 });
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}
