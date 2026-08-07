import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getPost } from "@/lib/blog";
import PostAdminControls from "@/components/PostAdminControls";

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

  const html = marked.parse(post.content, { async: false }) as string;

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Back to blog
      </Link>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">{post.title}</h1>
      <p className="mt-2 text-sm text-zinc-400">{formatDate(post.created_at)}</p>
      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover}
          alt={post.title}
          className="mt-6 w-full rounded-xl"
        />
      )}
      <PostAdminControls slug={post.slug} />
      <div
        className="prose mt-8 max-w-none text-zinc-800"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
