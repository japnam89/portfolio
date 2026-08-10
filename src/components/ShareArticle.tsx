"use client";

import { useState } from "react";

// "Share this article" bar — minimal, like parveensingh.com post footers.
// Inline brand glyphs (no icon dependency). Copy-link gives instant feedback.

const ICONS = {
  x: (
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  ),
  linkedin: (
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  ),
  facebook: (
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
  ),
  link: (
    <path d="M3.9 12a3.1 3.1 0 0 1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7A3.1 3.1 0 0 1 3.9 12zM8 13h8v-2H8v2zm9-6h-4v1.9h4a3.1 3.1 0 0 1 0 6.2h-4V17h4a5 5 0 0 0 0-10z" />
  ),
};

type Props = {
  title: string;
  url: string;
};

export default function ShareArticle({ title, url }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl = (base: string) =>
    `${base}?${new URLSearchParams({ url, text: title }).toString()}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be blocked; ignore */
    }
  };

  const btn =
    "flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-900 hover:text-white";

  return (
    <section className="mt-12 flex flex-wrap items-center gap-4 border-t border-zinc-200 pt-6">
      <span className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Share this article
      </span>
      <div className="flex items-center gap-2.5">
        <a
          href={shareUrl("https://twitter.com/intent/tweet")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          title="Share on X"
          className={btn}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            {ICONS.x}
          </svg>
        </a>
        <a
          href={shareUrl("https://www.linkedin.com/sharing/share-offsite")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
          className={btn}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            {ICONS.linkedin}
          </svg>
        </a>
        <a
          href={shareUrl("https://www.facebook.com/sharer/sharer.php")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          title="Share on Facebook"
          className={btn}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            {ICONS.facebook}
          </svg>
        </a>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy link"
          title={copied ? "Copied!" : "Copy link"}
          className={btn}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            {ICONS.link}
          </svg>
          {copied && (
            <span className="sr-only">Link copied to clipboard</span>
          )}
        </button>
      </div>
      {copied && (
        <span className="text-sm font-medium text-green-600">Link copied!</span>
      )}
    </section>
  );
}
