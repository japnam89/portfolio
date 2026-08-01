import Link from "next/link";

// This is the Home page ("/"). In the App Router, the file name `page.tsx`
// inside a folder becomes a route. `app/page.tsx` = the root route "/".
export default function Home() {
  return (
    <section className="hero-dark mx-auto max-w-5xl px-6 py-32 sm:py-40">
      <div className="stagger">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
          Staff Engineer &amp; Azure Architect
        </p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-7xl">
          Japnam Singh
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-zinc-300">
          A <strong className="text-white">Staff Engineer</strong> and{" "}
          <strong className="text-white">Azure Architect</strong> with 10 years
          of software engineering experience. I design resilient cloud
          platforms, lead platform teams, and still love shipping code — this
          portfolio is one of them.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            View my projects
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/10"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </section>
  );
}
