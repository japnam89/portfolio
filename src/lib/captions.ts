// Server-only photo-caption storage backed by SQLite (better-sqlite3).
// File DB lives at process.cwd()/data/captions.db so it persists across
// redeploys (the deploy does not wipe the app directory). Created/migrated on
// first import. Captions here OVERRIDE the static defaults in
// src/data/photos.ts at request time.
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

export type Caption = {
  key: string; // bucket key, e.g. "photos/DSC08068.JPG"
  title?: string | null;
  alt?: string | null;
  location?: string | null;
  date?: string | null;
  description?: string | null;
};

const dataDir = join(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });

// Reuse a single connection across hot reloads in dev.
const g = globalThis as unknown as { __captionsDb?: Database.Database };
const db = g.__captionsDb ?? new Database(join(dataDir, "captions.db"));

if (!g.__captionsDb) {
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS captions (
      key TEXT PRIMARY KEY,
      title TEXT,
      alt TEXT,
      location TEXT,
      date TEXT,
      description TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  g.__captionsDb = db;
}

export function getCaption(key: string): Caption | undefined {
  return db.prepare("SELECT * FROM captions WHERE key = ?").get(key) as
    | Caption
    | undefined;
}

export function upsertCaption(
  key: string,
  input: {
    title?: string;
    alt?: string;
    location?: string;
    date?: string;
    description?: string;
  },
): Caption {
  db.prepare(
    `INSERT INTO captions (key, title, alt, location, date, description, updated_at)
     VALUES (@key, @title, @alt, @location, @date, @description, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET
       title=excluded.title,
       alt=excluded.alt,
       location=excluded.location,
       date=excluded.date,
       description=excluded.description,
       updated_at=datetime('now')`,
  ).run({ key, ...input });
  return getCaption(key)!;
}

// Merge a stored caption over the static default. Only non-empty stored fields
// win, so a partial edit doesn't wipe fields the admin didn't set.
export function mergeCaption(
  key: string,
  fallback: {
    alt: string;
    title?: string;
    location?: string;
    date?: string;
    description?: string;
  },
): { alt: string; title?: string; location?: string; date?: string; description?: string } {
  const row = getCaption(key);
  if (!row) return fallback;
  const clean = (v?: string | null) => (v && v.trim() ? v.trim() : undefined);
  return {
    alt: clean(row.alt) ?? fallback.alt,
    title: clean(row.title) ?? fallback.title,
    location: clean(row.location) ?? fallback.location,
    date: clean(row.date) ?? fallback.date,
    description: clean(row.description) ?? fallback.description,
  };
}
