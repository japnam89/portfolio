import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Japnam Singh",
  description:
    "Tools & utilities: buy/sell ENS domains, convert documents to PDF, and view architecture diagrams.",
};

const services = [
  {
    href: "/domains",
    icon: "🌐",
    title: "Buy / Sell Domains",
    desc: "My collection of ENS (.eth) names won across Metamask, Namebase and ETH World. Browse the ones open to offers and send a quote.",
    cta: "Browse domains →",
  },
  {
    href: "/convert",
    icon: "📄",
    title: "Doc to PDF",
    desc: "Convert Word, PowerPoint, Excel, OpenDocument and plain text to PDF — free, processed on-server with LibreOffice, files never leave the VPS.",
    cta: "Convert a file →",
  },
  {
    href: "/diagrams",
    icon: "📊",
    title: "Diagrams",
    desc: "Sequence and architecture diagrams rendered live from Mermaid (.mmd) definitions — handy for parking flows you want to reference later.",
    cta: "View diagrams →",
  },
];

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🛠️</span>
        <h1 className="text-4xl font-bold tracking-tight">Services</h1>
      </div>
      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        A few tools and utilities I&apos;ve bundled into the site — from trading
        ENS domains to quick document conversion and architecture diagrams.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="text-4xl">{s.icon}</span>
            <h2 className="mt-4 text-xl font-semibold text-zinc-900">
              {s.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">
              {s.desc}
            </p>
            <span className="mt-5 text-sm font-semibold text-blue-600 transition-colors group-hover:text-blue-700">
              {s.cta}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
