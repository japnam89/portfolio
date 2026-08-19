import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getPost, listPosts } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";
import { presignGet } from "@/lib/system-storage";
import PostAdminControls from "@/components/PostAdminControls";
import ShareArticle from "@/components/ShareArticle";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found — Japnam.tech" };
  return { title: `${post.title} — Japnam.tech`, description: post.excerpt };
}

function formatDate(iso: string) {
  const d = new Date(iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// "/blog/[slug]". Renders the stored markdown post.
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = renderMarkdown(post.content);

  // Cover: if it's a storage key (no scheme), mint a fresh presigned URL at
  // render time so it never goes stale. Full URLs pass through unchanged.
  let coverSrc: string | null = null;
  if (post.cover) {
    if (post.cover.startsWith("http")) {
      coverSrc = post.cover;
    } else {
      try {
        coverSrc = await presignGet(post.cover);
      } catch {
        coverSrc = null;
      }
    }
  }

  // Absolute URL for share targets (X/LinkedIn/Facebook prefill + copy-link).
  const h = await headers();
  const host = h.get("host") ?? "japnam.tech";
  const proto = h.get("x-forwarded-proto") ?? "https";
  const origin = `${proto}://${host}`;
  const shareUrl = `${origin}/blog/${post.slug}`;

  // Related posts: other posts (most recent first), excluding the current one.
  const related = listPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back to blog
      </Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-sm text-zinc-400">{formatDate(post.created_at)}</p>
      {coverSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverSrc}
          alt={post.title}
          className="mt-6 w-full rounded-xl"
        />
      )}
      <PostAdminControls slug={post.slug} />
      <div
        className="prose mt-8 max-w-none text-zinc-800"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <ShareArticle
        title={post.title}
        url={shareUrl}
      />

      {related.length > 0 && (
        <section className="mt-16 border-t border-zinc-200 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            More from the blog
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-xl border border-zinc-200 p-4 transition hover:border-zinc-400 hover:shadow-sm"
              >
                <h3 className="font-medium text-zinc-900 group-hover:text-gradient">
                  {p.title}
                </h3>
                {p.excerpt && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                    {p.excerpt}
                  </p>
                )}
                <p className="mt-2 text-xs text-zinc-400">
                  {formatDate(p.created_at)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
