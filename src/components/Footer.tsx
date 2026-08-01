export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-zinc-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-zinc-500">
        <span>© {year} Japnam Singh. Built with Next.js &amp; Node.js.</span>
        <div className="flex gap-5">
          <a
            href="/resume"
            className="font-medium text-zinc-700 transition-colors hover:text-blue-600"
          >
            Resume ↗
          </a>
          <a
            href="https://github.com/japnam89"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 transition-colors hover:text-blue-600"
          >
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/japnam-singh-160968164/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 transition-colors hover:text-blue-600"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
