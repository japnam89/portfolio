import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Social — Japnam Singh",
  description: "Find Japnam Singh on X, GitHub, and LinkedIn.",
};

// Central place for social profiles. Edit these URLs in one spot.
const socials = [
  {
    name: "X (Twitter)",
    handle: "@japnamfx",
    href: "https://x.com/japnamfx",
    desc: "Thoughts on cloud, code, and career.",
  },
  {
    name: "GitHub",
    handle: "japnam89",
    href: "https://github.com/japnam89",
    desc: "Open-source and project repositories.",
  },
  {
    name: "LinkedIn",
    handle: "japnam-singh-160968164",
    href: "https://www.linkedin.com/in/japnam-singh-160968164/",
    desc: "Professional profile and certifications.",
  },
];

export default function Social() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">
        <span className="text-gradient">Social</span>
      </h1>
      <p className="mt-4 text-lg text-zinc-600">
        Connect with me across the web.
      </p>

      <ul className="mt-10 grid gap-4">
        {socials.map((s) => (
          <li key={s.name}>
            <Link
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white/70 px-5 py-4 transition-colors hover:border-zinc-300 hover:bg-white"
            >
              <div>
                <p className="font-semibold text-zinc-900">{s.name}</p>
                <p className="text-sm text-zinc-500">{s.desc}</p>
              </div>
              <span className="font-mono text-sm text-zinc-400 transition-colors group-hover:text-blue-600">
                {s.handle} ↗
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-zinc-400">
        Prefer email?{" "}
        <Link href="/contact" className="text-zinc-600 underline hover:text-blue-600">
          Get in touch
        </Link>
        .
      </p>
    </section>
  );
}
