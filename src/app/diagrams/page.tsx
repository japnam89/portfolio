import type { Metadata } from "next";
import { diagrams } from "@/data/diagrams";
import Mermaid from "@/components/Mermaid";

export const metadata: Metadata = {
  title: "Diagrams — Japnam Singh",
  description:
    "Sequence diagrams and other architecture visuals, rendered from Mermaid (.mmd) definitions.",
};

export default function DiagramsPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="flex items-center gap-3">
        <span className="text-3xl">📊</span>
        <h1 className="text-4xl font-bold tracking-tight">Diagrams</h1>
      </div>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        Architecture and sequence diagrams rendered live from{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">Mermaid</code>{" "}
        (think <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">.mmd</code>)
        definitions. Handy for parking flows you want to reference later.
      </p>

      {diagrams.length === 0 ? (
        <p className="mt-12 text-zinc-500">
          No diagrams yet — add entries to{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">
            src/data/diagrams.ts
          </code>
          .
        </p>
      ) : (
        <div className="mt-12 flex flex-col gap-12">
          {diagrams.map((d) => (
            <article
              key={d.id}
              className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold leading-snug text-zinc-900">
                    {d.title}
                  </h2>
                  {d.description && (
                    <p className="mt-1 text-sm text-zinc-500">{d.description}</p>
                  )}
                </div>
                <span className="rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-medium text-zinc-600">
                  {d.type}
                </span>
              </div>
              <div className="px-6 py-6">
                <Mermaid code={d.code} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
