"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || `Sign-in failed (${response.status})`);
        return;
      }

      setPassword("");
      router.refresh();
    } catch {
      setError("Could not verify the admin password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-bold tracking-tight">Admin sign-in</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Enter the admin password to create a post.
      </p>
      <form onSubmit={signIn} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-zinc-700">
          Admin password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {busy ? "Verifying…" : "Continue"}
        </button>
      </form>
    </section>
  );
}
