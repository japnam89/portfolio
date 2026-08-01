"use client";
// ^ This directive tells Next.js: "this component runs in the browser."
// Only client components can use state (useState) and handle form events.
// Pages are "server components" by default — good for content, but a form
// that reacts to clicks needs to be a client component.

import { useState } from "react";

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
    <section className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Contact me</h1>
      <p className="mt-4 text-lg text-zinc-600">
        Send me a note — this form posts to a Node.js API route I wrote.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Name
          <input
            name="name"
            required
            className="rounded-lg border border-zinc-300 px-4 py-3 text-base"
            placeholder="Your name"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded-lg border border-zinc-300 px-4 py-3 text-base"
            placeholder="you@example.com"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Message
          <textarea
            name="message"
            required
            rows={5}
            className="rounded-lg border border-zinc-300 px-4 py-3 text-base"
            placeholder="Say hello..."
          />
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
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
    </section>
  );
}
