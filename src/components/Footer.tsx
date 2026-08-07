import BuyMeCoffee from "./BuyMeCoffee";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-zinc-200/70 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-zinc-500">
        <span>© {year} Japnam Singh. Built with Next.js &amp; Node.js.</span>
        <div className="flex items-center gap-5">
          <BuyMeCoffee />
        </div>
      </div>
    </footer>
  );
}
