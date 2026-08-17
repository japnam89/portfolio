"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

// A navigation bar. `Link` is Next.js's special anchor tag — client-side navigation.
// Becomes a hamburger menu on small screens. Social links are intentionally
// omitted here (they live in the footer) for a cleaner header.

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/certificates", label: "Certifications" },
  { href: "/photography", label: "Photography" },
  { href: "/blog", label: "Blog" },
  { href: "/social", label: "Social" },
];

// Tools grouped under a "Services" dropdown.
const services = [
  {
    href: "/domains",
    label: "Buy / Sell Domains",
    desc: "My ENS (.eth) collection — make an offer.",
    icon: "🌐",
  },
  {
    href: "/convert",
    label: "Doc to PDF",
    desc: "Convert Office docs to PDF, free & private.",
    icon: "📄",
  },
  {
    href: "/diagrams",
    label: "Diagrams",
    desc: "Sequence & architecture diagrams (Mermaid).",
    icon: "📊",
  },
  {
    href: "/workflows",
    label: "Workflow Templates",
    desc: "Free n8n automation & AI workflow templates.",
    icon: "⚡",
  },
  {
    href: "/azure-training",
    label: "Azure 1:1 Training",
    desc: "Personal cloud/architecture coaching with a Staff Azure Architect.",
    icon: "🎓",
  },
  {
    href: "https://japnam.tech/receipt",
    external: true,
    label: "Receipt Scanner",
    desc: "Scans Google Drive receipts, OCRs them, and stores structured data.",
    icon: "🧾",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);

  // Close the desktop dropdown on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-gradient-to-b from-white/80 to-white/50 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-full px-1 py-0.5"
          onClick={() => setOpen(false)}
        >
          <span className="flex items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-zinc-200/70 transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Japnam Singh"
              width={22}
              height={22}
              className="rounded-md"
            />
          </span>
          <span className="text-base font-semibold tracking-tight text-zinc-900">
            Japnam<span className="text-gradient">.tech</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 text-sm font-medium text-zinc-600 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full px-3.5 py-2 transition-colors hover:bg-zinc-900/5 hover:text-zinc-900"
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Services dropdown */}
          <li ref={servicesRef} className="relative">
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((v) => !v)}
              className="flex items-center gap-1 rounded-full px-3.5 py-2 transition-colors hover:bg-zinc-900/5 hover:text-zinc-900"
            >
              Services
              <svg
                className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {servicesOpen && (
              <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl">
                {services.map((s) =>
                  s.external ? (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setServicesOpen(false);
                        setOpen(false);
                      }}
                      className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-zinc-900/5"
                    >
                      <span className="text-2xl leading-none">{s.icon}</span>
                      <span>
                        <span className="block text-sm font-semibold text-zinc-900">
                          {s.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-zinc-500">
                          {s.desc}
                        </span>
                      </span>
                    </a>
                  ) : (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => {
                        setServicesOpen(false);
                        setOpen(false);
                      }}
                      className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-zinc-900/5"
                    >
                      <span className="text-2xl leading-none">{s.icon}</span>
                      <span>
                        <span className="block text-sm font-semibold text-zinc-900">
                          {s.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-zinc-500">
                          {s.desc}
                        </span>
                      </span>
                    </Link>
                  ),
                )}
              </div>
            )}
          </li>
        </ul>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-700"
          >
            Contact
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          className="rounded-md p-2 text-zinc-700 transition-colors hover:bg-zinc-900/5 md:hidden"
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

      {/* Mobile dropdown panel (no social links — footer holds those) */}
      {open && (
        <div className="border-t border-white/40 bg-white/95 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-900/5 hover:text-zinc-900"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {/* Services group in mobile menu */}
            <li className="px-3 pt-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Services
            </li>
            {services.map((s) =>
              s.external ? (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-900/5 hover:text-zinc-900"
                    onClick={() => setOpen(false)}
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </a>
                </li>
              ) : (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-zinc-900/5 hover:text-zinc-900"
                    onClick={() => setOpen(false)}
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </Link>
                </li>
              ),
            )}

            <li className="pt-2">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-zinc-900 px-3 py-2.5 text-center font-semibold text-white"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
