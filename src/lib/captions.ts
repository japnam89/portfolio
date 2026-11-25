// Server-only photo-caption storage backed by SQLite (better-sqlite3).
// File DB lives at process.cwd()/data/captions.db so it persists across
// redeploys (the deploy does not wipe the app directory). Created/migrated on
// first import. Captions here OVERRIDE the static defaults in
// src/data/photos.ts at request time.
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type {
  PhotoCaptionFields,
  PhotoCaptionTranslations,
  TranslationLocale,
} from "@/lib/content-types";
import type { PhotoMeta } from "@/data/photos";

export type Caption = {
  key: string; // bucket key, e.g. "photos/DSC08068.JPG"
  title?: string | null;
  alt?: string | null;
  location?: string | null;
  date?: string | null;
  description?: string | null;
  translations?: PhotoCaptionTranslations;
};

type CaptionRow = Omit<Caption, "translations"> & { translations: string };

const dataDir = join(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });

// Reuse a single connection across hot reloads in dev.
const g = globalThis as unknown as { __captionsDb?: Database.Database };
const db = g.__captionsDb ?? new Database(join(dataDir, "captions.db"));

if (!g.__captionsDb) {
  db.pragma("journal_mode = WAL");
  g.__captionsDb = db;
}

db.exec(`
  CREATE TABLE IF NOT EXISTS captions (
    key TEXT PRIMARY KEY,
    title TEXT,
    alt TEXT,
    location TEXT,
    date TEXT,
    description TEXT,
    translations TEXT NOT NULL DEFAULT '{}',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);
const columns = db.pragma("table_info(captions)") as Array<{ name: string }>;
if (!columns.some((column) => column.name === "translations")) {
  db.exec(
    "ALTER TABLE captions ADD COLUMN translations TEXT NOT NULL DEFAULT '{}'",
  );
}

export function getCaption(key: string): Caption | undefined {
  const row = db.prepare("SELECT * FROM captions WHERE key = ?").get(key) as
    | CaptionRow
    | undefined;
  if (!row) return undefined;
  const { translations, ...caption } = row;
  return { ...caption, translations: parseTranslations(translations) };
}

export function upsertCaption(
  key: string,
  input: PhotoCaptionFields & { translations?: PhotoCaptionTranslations },
): Caption {
  const translations = input.translations
    ? parseCaptionTranslations(input.translations)
    : getCaption(key)?.translations ?? {};
  db.prepare(
    `INSERT INTO captions (key, title, alt, location, date, description, translations, updated_at)
     VALUES (@key, @title, @alt, @location, @date, @description, @translations, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET
       title=excluded.title,
       alt=excluded.alt,
       location=excluded.location,
       date=excluded.date,
       description=excluded.description,
       translations=excluded.translations,
       updated_at=datetime('now')`,
  ).run({ key, ...input, translations: JSON.stringify(translations) });
  return getCaption(key)!;
}

// Merge a stored caption over the static default. Only non-empty stored fields
// win, so a partial edit doesn't wipe fields the admin didn't set.
export function mergeCaption(
  key: string,
  fallback: PhotoMeta,
): PhotoMeta {
  const row = getCaption(key);
  if (!row) return fallback;
  const clean = (v?: string | null) => (v && v.trim() ? v.trim() : undefined);
  const translations: PhotoCaptionTranslations = {};
  for (const language of ["hi", "pa"] as const) {
    const merged = mergeTranslation(
      row.translations?.[language],
      fallback.translations?.[language],
      clean,
    );
    if (merged) translations[language] = merged;
  }
  return {
    alt: clean(row.alt) ?? fallback.alt,
    title: clean(row.title) ?? fallback.title,
    location: clean(row.location) ?? fallback.location,
    date: clean(row.date) ?? fallback.date,
    description: clean(row.description) ?? fallback.description,
    translations,
  };
}

function mergeTranslation(
  override: PhotoCaptionTranslations[TranslationLocale],
  fallback: PhotoCaptionTranslations[TranslationLocale],
  clean: (value?: string | null) => string | undefined,
): PhotoCaptionFields | undefined {
  const result: PhotoCaptionFields = {};
  for (const field of ["alt", "title", "location", "date", "description"] as const) {
    const value = clean(override?.[field]) ?? clean(fallback?.[field]);
    if (value) result[field] = value;
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function parseTranslations(value: string): PhotoCaptionTranslations {
  const parsed: unknown = JSON.parse(value);
  return parseCaptionTranslations(parsed);
}

export function parseCaptionTranslations(
  value: unknown,
): PhotoCaptionTranslations {
  const parsed = value;
  if (!isRecord(parsed)) {
    throw new Error("Stored photo caption translations must be an object.");
  }

  const translations: PhotoCaptionTranslations = {};
  for (const language of ["hi", "pa"] as const) {
    const raw = parsed[language];
    if (raw === undefined) continue;
    if (!isRecord(raw)) {
      throw new Error(`Stored ${language} photo caption translation must be an object.`);
    }

    const fields: PhotoCaptionFields = {};
    for (const field of ["alt", "title", "location", "date", "description"] as const) {
      const fieldValue = raw[field];
      if (fieldValue === undefined) continue;
      if (typeof fieldValue !== "string") {
        throw new Error(`Stored photo caption ${field} must be a string.`);
      }
      fields[field] = fieldValue;
    }
    translations[language] = fields;
  }
  return translations;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
