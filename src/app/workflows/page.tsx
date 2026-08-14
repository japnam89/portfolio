import type { Metadata } from "next";
import { workflows } from "@/data/workflows";

export const metadata: Metadata = {
  title: "Workflow Templates — Japnam Singh",
  description:
    "Free n8n workflow templates — automation, AI, DevOps and data pipelines you can import and adapt.",
};

export default function WorkflowsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="flex items-center gap-3">
        <span className="text-3xl">⚡</span>
        <h1 className="text-4xl font-bold tracking-tight">Workflow Templates</h1>
      </div>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        Free <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">n8n</code>{" "}
        workflow templates you can import and adapt. Click{" "}
        <span className="font-medium">Download</span> to grab the{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">.json</code>,
        then import it into your own n8n instance (Settings → Import from File).
      </p>

      {workflows.length === 0 ? (
        <p className="mt-12 text-zinc-500">
          No templates yet — add entries to{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
            src/data/workflows.ts
          </code>
          .
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((w) => (
            <article
              key={w.id}
              className="group flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-medium text-zinc-600">
                  {w.category}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-zinc-900">
                {w.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
                {w.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {w.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                {w.download ? (
                  <a
                    href={w.download}
                    download
                    className="text-sm font-semibold text-emerald-600 hover:underline"
                  >
                    ⬇ Download JSON
                  </a>
                ) : (
                  <span className="text-sm font-medium text-zinc-300">
                    Download soon
                  </span>
                )}
                {w.link && (
                  <a
                    href={w.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Details ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
