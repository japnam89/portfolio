import type { Metadata } from "next";
import RaghiForm from "./RaghiForm";

export const metadata: Metadata = {
  title: "Raghi List — Japnam Singh",
  description:
    "Download the monthly Raghi list — the kirtan duty roster from Darbar Sahib Amritsar.",
};

export default function RaghiPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">📋</span>
        <h1 className="text-4xl font-bold tracking-tight">Raghi List</h1>
      </div>
      <p className="mt-4 text-lg text-zinc-600">
        Download the monthly kirtan duty list from Darbar Sahib Amritsar. Click the
        button below to get the latest PDF — it's fetched live from the SGPC website.
      </p>

      {/* Action card */}
      <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📋</span>
          <h2 className="text-xl font-semibold">
            Download raagi list of this month
          </h2>
        </div>

        <p className="mt-4 text-zinc-600">
          Each request fetches the current month's kirtan duty list directly from
          SGPC (Sri Hasht martyrdom... no — Sri Harimandir Sahib / Darbar Sahib
          Amritsar's official schedule). The list shows which ragis are assigned
          kirtan on which dates for the coming month.
        </p>

        {/* Client interactive part */}
        <RaghiForm />

        <p className="mt-4 text-xs text-zinc-400">
          Source:{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs font-mono">
            hs.sgpc.net/kirtan_duty_english_pdf.php
          </code>
        </p>
      </div>
    </section>
  );
}
