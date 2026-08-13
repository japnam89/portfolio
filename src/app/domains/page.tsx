import type { Metadata } from "next";
import { domains } from "@/data/domains";
import DomainOfferForm from "./DomainOfferForm";

export const metadata: Metadata = {
  title: "ENS Domains — Japnam Singh",
  description:
    "My .eth domain collection — won across Metamask, Namebase and ETH World. Open to serious buy offers.",
};

export default function DomainsPage() {
  const forSale = domains.filter((d) => d.forSale);
  const held = domains.filter((d) => !d.forSale);

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🌐</span>
        <h1 className="text-4xl font-bold tracking-tight">ENS Domains</h1>
      </div>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        A selection of <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm">.eth</code>{" "}
        domains I&apos;ve won across Metamask, Namebase and ETH World. If you see
        one you want, send a quote — I&apos;m open to serious offers on the ones
        marked &ldquo;For sale&rdquo;.
      </p>

      {forSale.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Open to offers
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {forSale.map((d) => (
              <div
                key={d.name}
                className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/70"
              >
                <p className="text-lg font-semibold text-zinc-900">{d.name}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  Won via {d.acquiredVia}
                  {d.wonDate ? ` · ${d.wonDate}` : ""}
                </p>
                {d.description && (
                  <p className="mt-2 text-sm text-zinc-600">{d.description}</p>
                )}
                <div className="mt-4 flex-1">
                  <DomainOfferForm domain={d.name} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {held.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Held (not for sale)
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {held.map((d) => (
              <li
                key={d.name}
                className="flex items-center justify-between rounded-xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200/70"
              >
                <div>
                  <p className="font-medium text-zinc-800">{d.name}</p>
                  <p className="text-xs text-zinc-500">
                    {d.acquiredVia}
                    {d.wonDate ? ` · ${d.wonDate}` : ""}
                  </p>
                </div>
                <span className="rounded-full bg-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600">
                  Held
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
