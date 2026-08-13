"use client";

import { useState } from "react";

// Inline offer form for a single domain. Posts to /api/domain-offers.
export default function DomainOfferForm({ domain }: { domain: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [offer, setOffer] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/domain-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, name, email, offer, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong.");
        return;
      }
      setStatus("ok");
      setName("");
      setEmail("");
      setOffer("");
      setMessage("");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (status === "ok") {
    return (
      <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
        ✅ Offer sent for <strong>{domain}</strong>. Thanks!
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <p className="text-xs font-medium text-zinc-500">Make an offer</p>
      <input
        required
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
      <input
        required
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
      <input
        placeholder="Offer amount (e.g. 2.5 ETH)"
        value={offer}
        onChange={(e) => setOffer(e.target.value)}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
      <textarea
        placeholder="Message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
      {status === "error" && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-zinc-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send offer"}
      </button>
    </form>
  );
}
