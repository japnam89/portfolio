import type { Metadata } from "next";
import Link from "next/link";
import { listPosts, type Post } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Japnam Singh",
  description: "Notes, write-ups and tutorials by Japnam Singh.",
};

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  // SQLite datetime('now') is UTC "YYYY-MM-DD HH:MM:SS"; normalize to ISO.
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// "/blog". Posts are read from the SQLite DB at request time.
export default function Blog() {
  let posts: Post[] = [];
  try {
    posts = listPosts();
  } catch {
    posts = [];
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          New post
        </Link>
      </div>
      <p className="mt-4 text-lg text-zinc-600">
        Occasional notes on cloud, engineering, and photography.
      </p>

      <div className="mt-10 space-y-8">
        {posts.length === 0 && (
          <p className="text-zinc-500">No posts yet — publish one from the admin page.</p>
        )}
        {posts.map((p) => (
          <article
            key={p.id}
            className="border-b border-zinc-200/70 pb-6 last:border-0"
          >
            <Link href={`/blog/${p.slug}`} className="group">
              <h2 className="text-2xl font-semibold tracking-tight group-hover:text-gradient">
                {p.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {formatDate(p.created_at)}
              </p>
              {p.excerpt && (
                <p className="mt-3 text-zinc-600">{p.excerpt}</p>
              )}
            </Link>
            <Link
              href={`/admin/posts/${p.slug}/edit`}
              className="mt-2 inline-block text-xs font-medium text-zinc-400 hover:text-zinc-700"
            >
              Edit
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
