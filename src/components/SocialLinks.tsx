import Link from "next/link";
import type { ReactElement } from "react";
import { socials, type Social } from "@/data/socials";

// Brand glyphs (simple-icons style paths). Inline = no icon dependency.
const GLYPHS: Record<Social["icon"], ReactElement> = {
  x: (
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  ),
  github: (
    <path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.53 11.53 0 0 0 23.5 12.02C23.5 5.73 18.27.5 12 .5z" />
  ),
  linkedin: (
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  ),
  email: (
    <path d="M3 4h18a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm9 7.2 7.5-5.2H4.5zM4 7.1V19h16V7.1l-8 5.55z" />
  ),
};

type Props = {
  /** "icons" = compact icon row (footer). "cards" = labeled cards. */
  variant?: "icons" | "cards";
  className?: string;
};

export default function SocialLinks({ variant = "icons", className }: Props) {
  if (variant === "cards") {
    return (
      <ul className={`grid gap-4 ${className ?? ""}`}>
        {socials.map((s) => (
          <li key={s.name}>
            <Link
              href={s.href}
              target={s.icon === "email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white/70 px-5 py-4 transition-colors hover:border-zinc-300 hover:bg-white"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
                    {GLYPHS[s.icon]}
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-zinc-900">{s.name}</p>
                  <p className="text-sm text-zinc-500">{s.desc}</p>
                </div>
              </div>
              <span className="font-mono text-sm text-zinc-400 transition-colors group-hover:text-blue-600">
                {s.handle} ↗
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  // icons variant: compact row for the footer.
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      {socials.map((s) => (
        <Link
          key={s.name}
          href={s.href}
          target={s.icon === "email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={s.name}
          title={s.name}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/70 bg-white/70 text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-900 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            {GLYPHS[s.icon]}
          </svg>
        </Link>
      ))}
    </div>
  );
}
