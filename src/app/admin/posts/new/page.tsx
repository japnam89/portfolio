"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Admin page to publish a new blog post. Auth uses a Bearer token equal to the
// POST_ADMIN_PASSWORD env var (set in hPanel). The token is sent only to the
// same-origin /api/posts endpoint.
export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ title, excerpt, content, cover }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ ok: false, msg: data.error || `Failed (${res.status})` });
      } else {
        setStatus({ ok: true, msg: "Published! Redirecting…" });
        setTimeout(() => router.push("/blog"), 800);
      }
    } catch {
      setStatus({ ok: false, msg: "Network error" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">New post</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Admin-only. The password is the <code>POST_ADMIN_PASSWORD</code> set in
        the hosting environment.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Excerpt (optional)
          </label>
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Cover image URL (optional)
          </label>
          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            placeholder="https://…"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Content (Markdown)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={14}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm"
            placeholder={"# Heading\n\nWrite your post in **markdown**."}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Admin password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>

        {status && (
          <p
            className={
              status.ok
                ? "text-sm text-green-600"
                : "text-sm text-red-600"
            }
          >
            {status.msg}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
        >
          {busy ? "Publishing…" : "Publish"}
        </button>
      </form>
    </section>
  );
}
