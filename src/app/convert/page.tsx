"use client";

import { useState, useRef } from "react";

type Result = {
  pdfUrl: string;
  filename: string;
};

const ACCEPT =
  ".doc,.docx,.odt,.rtf,.txt,.ppt,.pptx,.odp,.xls,.xlsx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/rtf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.oasis.opendocument.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    setResult(null);
    setFile(e.target.files?.[0] ?? null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/convert", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Conversion failed.");
      }
      setResult({ pdfUrl: data.pdfUrl, filename: data.filename });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <div className="flex items-center gap-3">
        <span className="text-3xl">📄</span>
        <h1 className="text-4xl font-bold tracking-tight">Doc to PDF</h1>
      </div>
      <p className="mt-4 text-lg text-zinc-600">
        Convert Word, PowerPoint, Excel, OpenDocument and plain text files to PDF
        for free — processed on the server with LibreOffice, then parked in the
        same object-storage bucket as the photos. Files stay on this VPS; nothing
        is sent to a third party.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <label className="block text-sm font-medium text-zinc-700">
          Choose a document (max 25 MB)
        </label>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          onChange={onPick}
          className="mt-3 block w-full text-sm text-zinc-600 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-zinc-700"
        />

        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            disabled={!file || busy}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Converting…" : "Convert to PDF"}
          </button>
          {file && (
            <span className="truncate text-sm text-zinc-500">{file.name}</span>
          )}
        </div>

        {busy && (
          <p className="mt-4 text-sm text-zinc-500">
            Spinning up LibreOffice headless — this can take a few seconds…
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {result && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-800">
              Done! Your PDF is ready.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href={result.pdfUrl}
                download={result.filename}
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Download PDF ↓
              </a>
              <a
                href={result.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-300 hover:bg-emerald-100"
              >
                Open in new tab ↗
              </a>
            </div>
          </div>
        )}
      </form>

      <p className="mt-6 text-xs text-zinc-400">
        Supported: DOC, DOCX, ODT, RTF, TXT, PPT, PPTX, ODP, XLS, XLSX.
        Converted files are stored in the <code>convert/</code> prefix of the
        object bucket and served via short-lived presigned URLs.
      </p>
    </section>
  );
}
