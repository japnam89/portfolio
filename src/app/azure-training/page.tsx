"use client";

import { useState } from "react";

const FOCUS_AREAS = [
  "Landing Zones & Governance",
  "AKS / Kubernetes",
  "Terraform / Bicep (IaC)",
  "Identity (Entra ID / Managed Identity)",
  "Networking (VNet / Private Endpoints)",
  "Solution / Architecture Design",
  "Certification Prep (AZ-104 / AZ-305)",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced", "Not sure yet"];
const TIMINGS = [
  "Weekdays (daytime)",
  "Weekdays (evening)",
  "Weekends",
  "Flexible",
];

export default function AzureTraining() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [focus, setFocus] = useState<string[]>([]);

  function toggleFocus(area: string) {
    setFocus((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      level: fd.get("level"),
      timing: fd.get("timing"),
      focus,
      message: fd.get("message"),
    };

    try {
      const res = await fetch("/api/azure-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setStatus("sent");
      setMessage("Thanks! Your training enquiry is in — I'll get back to you shortly.");
      form.reset();
      setFocus([]);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const inputCls =
    "rounded-lg border border-zinc-300 bg-white/70 px-4 py-3 text-base outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200";

  return (
    <section className="mx-auto max-w-2xl px-6 py-20">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🎓</span>
        <h1 className="text-4xl font-bold tracking-tight">Azure 1:1 Training</h1>
      </div>
      <p className="mt-4 text-lg text-zinc-600">
        Personal, hands-on coaching with a Staff Azure Architect. Tell me your
        level and what you want to cover, and I&apos;ll tailor a session plan for
        you.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Name
          <input name="name" required className={inputCls} placeholder="Your name" />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Email
          <input
            name="email"
            type="email"
            required
            className={inputCls}
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Experience level
          <select name="level" defaultValue="" className={inputCls} required>
            <option value="" disabled>
              Select your level…
            </option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-2 text-sm font-medium">
          Focus areas
          <p className="text-xs font-normal text-zinc-500">
            Pick what you&apos;d like to cover (optional, multi-select).
          </p>
          <div className="flex flex-wrap gap-2">
            {FOCUS_AREAS.map((area) => {
              const active = focus.includes(area);
              return (
                <button
                  type="button"
                  key={area}
                  onClick={() => toggleFocus(area)}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {area}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Preferred timing
          <select name="timing" defaultValue="" className={inputCls} required>
            <option value="" disabled>
              Select preferred timing…
            </option>
            {TIMINGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Your goals / message
          <textarea
            name="message"
            required
            rows={5}
            className={inputCls}
            placeholder="What do you want to achieve? Any specific topics, certs, or projects?"
          />
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send enquiry"}
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
