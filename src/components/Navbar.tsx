import Link from "next/link";

// A navigation bar. `Link` is Next.js's special anchor tag — client-side navigation.

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/certificates", label: "Certifications" },
  { href: "/photography", label: "Photography" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Japnam<span className="text-blue-600">.dev</span>
        </Link>
        <ul className="flex gap-5 text-sm font-medium text-zinc-600">
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
      </nav>
    </header>
  );
}
