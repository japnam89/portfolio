"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// A navigation bar. `Link` is Next.js's special anchor tag — client-side navigation.
// Becomes a hamburger menu on small screens.

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/certificates", label: "Certifications" },
  { href: "/photography", label: "Photography" },
  { href: "/blog", label: "Blog" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/70 bg-white/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="Japnam.tech logo"
            width={28}
            height={28}
            className="rounded-md"
            priority
          />
          Japnam<span className="text-gradient">.tech</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-5 text-sm font-medium text-zinc-600 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition-colors hover:text-zinc-900"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="https://x.com/japnamfx"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-900"
            >
              X
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/japnam-singh-160968164/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-900"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://github.com/japnam89"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-zinc-900"
            >
              GitHub
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="rounded-md p-2 text-zinc-700 hover:bg-zinc-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="border-t border-zinc-200/70 bg-white px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-3 text-sm font-medium text-zinc-700">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block transition-colors hover:text-zinc-900"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex gap-4 border-t border-zinc-200/70 pt-3">
              <a
                href="https://x.com/japnamfx"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-zinc-900"
              >
                X
              </a>
              <a
                href="https://www.linkedin.com/in/japnam-singh-160968164/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-zinc-900"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/japnam89"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-zinc-900"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
