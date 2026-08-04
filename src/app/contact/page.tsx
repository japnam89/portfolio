"use client";
// ^ This directive tells Next.js: "this component runs in the browser."
// Only client components can use state (useState) and handle form events.
// Pages are "server components" by default — good for content, but a form
// that reacts to clicks needs to be a client component.

import { useState } from "react";
import BuyMeCoffee from "@/components/BuyMeCoffee";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser's default page reload
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      // This is the actual fetch to our Node.js API route (see app/api/contact/route.ts).
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setMessage("Thanks! Your message was received by the server.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="orb absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="orb absolute -right-16 top-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_30%,#000,transparent)]" />
      </div>

      <div className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-gradient">Contact me</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          Send me a note — this form posts to a Node.js API route I wrote.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Name
            <input
              name="name"
              required
              className="rounded-lg border border-zinc-300 bg-white/70 px-4 py-3 text-base outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Your name"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              required
              className="rounded-lg border border-zinc-300 bg-white/70 px-4 py-3 text-base outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Message
            <textarea
              name="message"
              required
              rows={5}
              className="rounded-lg border border-zinc-300 bg-white/70 px-4 py-3 text-base outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              placeholder="Say hello..."
            />
          </label>

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send message"}
          </button>

          {message && (
            <p
              className={`text-sm font-medium ${
                status === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <div className="mt-10 border-t border-zinc-200/70 pt-8">
          <p className="text-sm text-zinc-500">
            If my work helped you, you can support it:
          </p>
          <div className="mt-4">
            <BuyMeCoffee />
          </div>
        </div>
      </div>
    </section>
  );
}
