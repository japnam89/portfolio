"use client";

import { useState } from "react";

export default function RaghiForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/raghi", { method: "POST" });
      if (!res.ok) {
        // Try to read an error message from JSON; fall back to status text.
        let msg: string;
        try {
          const body = (await res.json()) as { message?: string };
          msg = body.message ?? `Server returned ${res.status}`;
        } catch {
          msg = res.statusText ?? `Server returned ${res.status}`;
        }
        throw new Error(msg);
      }

      // The response is a PDF — stream it into a blob and trigger a browser
      // download so the file lands on the user's machine.
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ragi-list-this-month.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Couldn&apos;t fetch the Raghi list: {error}
        </div>
      )}
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Downloading…
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L19.5 15M21 10.5h-2.25A2.25 2.25 0 0016.5 8.25M19.5 15l-3-3M16.5 8.25H21" />
            </svg>
            Download Raghi list of this month
          </>
        )}
      </button>
    </>
  );
}
