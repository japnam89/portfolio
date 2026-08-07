"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Edit + Delete controls shown on a post's page. Delete is admin-gated
// (prompts for the password, sends x-admin-password). Edit links to the
// admin edit page.
export default function PostAdminControls({ slug }: { slug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function del() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    let pwd = sessionStorage.getItem("admin_pwd") || "";
    if (!pwd) {
      pwd = prompt("Admin password:") || "";
      if (!pwd) return;
      sessionStorage.setItem("admin_pwd", pwd);
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
        headers: { "x-admin-password": pwd },
      });
      if (res.ok) {
        router.push("/blog");
      } else {
        if (res.status === 401) sessionStorage.removeItem("admin_pwd");
        setErr("Delete failed (check password)");
        setBusy(false);
      }
    } catch {
      setErr("Network error");
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 flex items-center gap-3 text-sm">
      <Link
        href={`/admin/posts/${slug}/edit`}
        className="rounded-md border border-zinc-300 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={del}
        disabled={busy}
        className="rounded-md border border-red-300 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {busy ? "Deleting…" : "Delete"}
      </button>
      {err && <span className="text-red-600">{err}</span>}
    </div>
  );
}
