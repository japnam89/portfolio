import Database from "better-sqlite3";
import path from "node:path";
const db = new Database(path.join(process.cwd(), "data", "blog.db"));

const targets = [
  "ai-103-azure-ai-apps-and-agents-developer-what-changed-from-ai-102",
  "ai-901-azure-ai-fundamentals-the-new-ai-900-for-2027",
  "az-305-designing-microsoft-azure-infrastructure-solutions-still-the-core-in-2027",
];

console.log("=== Post verification ===\n");
for (const slug of targets) {
  const row = db.prepare("SELECT slug, title, content, length(content) as len FROM posts WHERE slug = ?").get(slug);
  if (!row) {
    console.log(`MISSING: ${slug}`);
    continue;
  }
  const c = row.content;
  console.log(`Post: ${row.title}`);
  console.log(`  Slug:      ${slug}`);
  console.log(`  Content bytes: ${c.length}`);
  console.log(`  Has image:    ${c.includes("unsplash.com/photo-") ? "yes" : "MISSING"}`);
  console.log(`  Has code block:  ${c.includes("```") ? "yes" : "MISSING"}`);
  const tableCount = (c.match(/^\|.*\|$/gm) || []).length;
  console.log(`  Table rows:    ${tableCount}`);
  console.log(`  Has blockquote: ${c.includes("> ") ? "yes" : "none"}`);
  console.log(`  Has YAML map:  ${c.includes("AZ-900") && c.includes("AZ-305") && c.includes("certification map") ? "yes" : "check"}`);
  console.log("");
}

// Also show hello-world to confirm it's untouched
const hw = db.prepare("SELECT slug, title, content, length(content) as len FROM posts WHERE slug = ?").get("hello-world");
console.log(`Post: ${hw.title} — untouched, ${hw.len} bytes`);
