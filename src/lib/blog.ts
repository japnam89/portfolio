// Server-only blog storage backed by SQLite (better-sqlite3). File DB lives at
// process.cwd()/data/blog.db so it persists across redeploys (our deploy does
// not wipe the app directory). The DB is created/migrated on first import.
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  cover?: string | null;
  created_at: string; // ISO
};

const dataDir = join(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });

// Reuse a single connection across hot reloads in dev.
const g = globalThis as unknown as { __blogDb?: Database.Database };
const db =
  g.__blogDb ??
  new Database(join(dataDir, "blog.db"));

if (!g.__blogDb) {
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      cover TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
  `);
  g.__blogDb = db;
}

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  return base || `post-${Date.now()}`;
}

export function listPosts(): Post[] {
  return db
    .prepare("SELECT * FROM posts ORDER BY created_at DESC")
    .all() as Post[];
}

export function getPost(slug: string): Post | undefined {
  return db.prepare("SELECT * FROM posts WHERE slug = ?").get(slug) as
    | Post
    | undefined;
}

export function createPost(input: {
  title: string;
  content: string;
  excerpt?: string;
  cover?: string;
}): Post {
  const slug = slugify(input.title);
  // Ensure slug uniqueness.
  let unique = slug;
  let n = 1;
  while (getPost(unique)) unique = `${slug}-${n++}`;
  db
    .prepare(
      `INSERT INTO posts (slug, title, excerpt, content, cover)
       VALUES (@slug, @title, @excerpt, @content, @cover)`,
    )
    .run({
      slug: unique,
      title: input.title,
      excerpt: input.excerpt?.trim() || input.content.slice(0, 160).replace(/[#>*_`\-]/g, " ").replace(/\n/g, " ").trim(),
      content: input.content,
      cover: input.cover || null,
    });
  return getPost(unique)!;
}

export function deletePost(slug: string): boolean {
  const info = db.prepare("DELETE FROM posts WHERE slug = ?").run(slug);
  return info.changes > 0;
}
