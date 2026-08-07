"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Admin page to edit an existing post. Loads the post by slug, prefills the
// form, and PUTs updates (admin-password gated). The password is read from
// sessionStorage (set once on the admin pages) and sent as x-admin-password.

function getAdminPwd(): string {
  return sessionStorage.getItem("admin_pwd") || "";
}

export default function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/posts/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        const p = d.post;
        if (p) {
          setTitle(p.title);
          setExcerpt(p.excerpt || "");
          setContent(p.content || "");
          setCover(p.cover || "");
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [slug]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    let pwd = getAdminPwd();
    if (!pwd) {
      pwd = prompt("Admin password:") || "";
      if (!pwd) return;
      sessionStorage.setItem("admin_pwd", pwd);
    }
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-password": pwd },
        body: JSON.stringify({ title, excerpt, content, cover }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) sessionStorage.removeItem("admin_pwd");
        setStatus({ ok: false, msg: data.error || `Failed (${res.status})` });
      } else {
        setStatus({ ok: true, msg: "Saved! Redirecting…" });
        setTimeout(() => router.push(`/blog/${slug}`), 700);
      }
    } catch {
      setStatus({ ok: false, msg: "Network error" });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    let pwd = getAdminPwd();
    if (!pwd) {
      pwd = prompt("Admin password:") || "";
      if (!pwd) return;
      sessionStorage.setItem("admin_pwd", pwd);
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
        headers: { "x-admin-password": pwd },
      });
      if (res.ok) {
        router.push("/blog");
      } else {
        if (res.status === 401) sessionStorage.removeItem("admin_pwd");
        setStatus({ ok: false, msg: "Delete failed (check password)" });
        setBusy(false);
      }
    } catch {
      setStatus({ ok: false, msg: "Network error" });
      setBusy(false);
    }
  }

  if (!loaded) return <p className="mx-auto max-w-3xl px-6 py-20">Loading…</p>;

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-bold tracking-tight">Edit post</h1>
      <form onSubmit={save} className="mt-8 space-y-5">
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
          <label className="block text-sm font-medium text-zinc-700">Excerpt (optional)</label>
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Cover image URL (optional)</label>
          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            placeholder="https://…"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Content (Markdown)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={14}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm"
          />
        </div>

        {status && (
          <p className={status.ok ? "text-sm text-green-600" : "text-sm text-red-600"}>
            {status.msg}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete post
          </button>
          <Link
            href={`/blog/${slug}`}
            className="ml-auto text-sm text-zinc-500 hover:text-zinc-900"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
