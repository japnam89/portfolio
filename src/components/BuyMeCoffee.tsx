import Link from "next/link";

// "Buy me a coffee" button. Links out to your PayPal (set NEXT_PUBLIC_PAYPAL_URL
// in the hosting env, or replace the default below). NEXT_PUBLIC_ vars are
// inlined at build time, so set it before `npm run build` / in hPanel env.
const PAYPAL_URL =
  process.env.NEXT_PUBLIC_PAYPAL_URL || "https://paypal.me/japnam89";

export default function BuyMeCoffee() {
  return (
    <Link
      href={PAYPAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-[#ffdd00] px-4 py-2 text-sm font-semibold text-[#0a0a0a] shadow-sm transition-transform hover:scale-[1.03] hover:bg-[#ffd400]"
      aria-label="Buy me a coffee via PayPal"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
      Buy me a coffee
    </Link>
  );
}
