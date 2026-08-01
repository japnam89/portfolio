import Link from "next/link";
import Image from "next/image";

// Home page ("/"). Server component: fetches one feature photo from the
// existing /api/photos route so the hero always shows a live bucket image.
async function getFeaturePhoto(): Promise<string | null> {
  try {
    const res = await fetch(
      new URL("/api/photos", process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000").toString(),
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { photos?: { key: string; src: string }[] };
    return data.photos?.[0]?.src ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const feature = await getFeaturePhoto();

  return (
    <section className="relative overflow-hidden">
      {/* Decorative gradient orbs + grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="orb absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="orb absolute -right-16 top-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-24 sm:py-32 lg:grid-cols-2">
        <div className="stagger">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-500">
            Staff Engineer &amp; Azure Architect
          </p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-7xl">
            <span className="text-gradient">Japnam Singh</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-zinc-600">
            A <strong className="text-zinc-900">Staff Engineer</strong> and{" "}
            <strong className="text-zinc-900">Azure Architect</strong> with 10
            years of software engineering experience. I design resilient cloud
            platforms, lead platform teams, and still love shipping code — this
            portfolio is one of them.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/projects" className="btn-primary">
              View my projects
            </Link>
            <Link href="/contact" className="btn-ghost">
              Get in touch
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-sm">
            {[
              ["Certifications", "/certificates"],
              ["Photography", "/photography"],
              ["Resume", "/resume"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-zinc-200 bg-white/60 px-4 py-1.5 font-medium text-zinc-700 backdrop-blur transition-colors hover:border-blue-300 hover:text-blue-600"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured photo from the bucket */}
        <div className="stagger">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/60 shadow-2xl">
            {feature ? (
              <Image
                src={feature}
                alt="Featured photography by Japnam Singh"
                fill
                unoptimized
                priority
                sizes="(max-width: 1024px) 90vw, 45vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-fuchsia-100 text-zinc-400">
                Featured photo
              </div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
