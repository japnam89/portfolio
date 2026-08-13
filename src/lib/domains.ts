// Server-only storage for domain buy-offers, backed by SQLite (better-sqlite3).
// Reuses the same data/ directory as the blog DB. Offers are persisted here and
// also emailed to the site owner via the shared sendEmail helper.
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { sendEmail } from "./email";

const dataDir = join(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });

const g = globalThis as unknown as { __domainDb?: Database.Database };
const db = g.__domainDb ?? new Database(join(dataDir, "domains.db"));

if (!g.__domainDb) {
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS domain_offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      domain TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      offer TEXT,
      message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  g.__domainDb = db;
}

export type DomainOffer = {
  id: number;
  domain: string;
  name: string;
  email: string;
  offer?: string | null;
  message?: string | null;
  created_at: string;
};

const insertStmt = db.prepare(`
  INSERT INTO domain_offers (domain, name, email, offer, message)
  VALUES (@domain, @name, @email, @offer, @message)
`);

export function addOffer(input: {
  domain: string;
  name: string;
  email: string;
  offer?: string;
  message?: string;
}): DomainOffer {
  const info = insertStmt.run(input);
  const created = db
    .prepare(`SELECT * FROM domain_offers WHERE id = ?`)
    .get(info.lastInsertRowid) as DomainOffer;

  // Notify the owner. Falls back to console logging if Resend isn't configured.
  void sendEmail({
    subject: `💰 New offer on ${input.domain} from ${input.name}`,
    replyTo: input.email,
    text:
      `Domain: ${input.domain}\n` +
      `From: ${input.name} <${input.email}>\n` +
      `Offer: ${input.offer || "(none)"}\n` +
      `Message: ${input.message || "(none)"}\n` +
      `Received: ${created.created_at}`,
  });

  return created;
}

export function listOffers(): DomainOffer[] {
  return db
    .prepare(`SELECT * FROM domain_offers ORDER BY created_at DESC`)
    .all() as DomainOffer[];
}
