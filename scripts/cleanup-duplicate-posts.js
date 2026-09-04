const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(process.cwd(), "data", "blog.db"));
db.pragma("journal_mode = WAL");

// Remove duplicate posts (the -1 suffix ones created by running the seed twice)
const dupes = db
  .prepare("SELECT id, slug FROM posts WHERE slug LIKE ?")
  .all("%-1");
console.log("Removing", dupes.length, "duplicate posts:");
for (const d of dupes) console.log("  -", d.slug);
db.prepare("DELETE FROM posts WHERE slug LIKE ?").run("%-1");
console.log("\nDone. Total posts now:", db.prepare("SELECT COUNT(*) as c FROM posts").get().c);
