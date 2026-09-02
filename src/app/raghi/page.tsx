import type { Metadata } from "next";
import RaghiForm from "./RaghiForm";

export const metadata: Metadata = {
  title: "Raghi List — Japnam Singh",
  description:
    "Download the monthly Raghi list — triggers an n8n workflow that generates and sends the latest list.",
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
        Download the monthly kirtan duty list from Darbar Sahib Amritsar. Clicking
        the button below triggers an n8n workflow that generates the list and sends
        it your way.
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
          Each request kicks off the{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-mono text-zinc-700">
            sgpc-kirtan-duty
          </code>{" "}
          n8n workflow, which generates the monthly kirtan duty list from Darbar
          Sahib Amritsar and delivers it.
        </p>

        {/* Client interactive part */}
        <RaghiForm />

        <p className="mt-4 text-xs text-zinc-400">
          Triggers the n8n webhook{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs font-mono">
            /webhook-test/sgpc-kirtan-duty
          </code>{" "}
          on{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs font-mono">
            n8n-1lje.srv1948665.hstgr.cloud
          </code>
          .
        </p>
      </div>
    </section>
  );
}
