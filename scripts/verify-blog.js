const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(process.cwd(), "data", "blog.db"));

const posts = db.prepare("SELECT slug, title, content FROM posts ORDER BY created_at DESC").all();

console.log("=== Blog post verification ===\n");
for (const p of posts) {
  const c = p.content;
  const h3 = (c.match(/^### /gm) || []).length;
  const codeBlocks = c.includes("```");
  const imgCount = (c.match(/!\[[^\]]*\]\(https?:\/\/[^\)]+\)/g) || []).length;
  const tableRows = (c.match(/^\|.*\|$/gm) || []).length;
  const hasBlockquote = c.includes("> ");
  const hasBullets = (c.match(/^[-*+]\s+/gm) || []).length;
  const charCount = c.length;

  console.log(`${p.title}`);
  console.log(`  Slug:    ${p.slug.slice(0, 50)}`);
  console.log(`  Chars:   ${charCount}`);
  console.log(`  H3s:     ${h3}`);
  console.log(`  Code blocks:  ${codeBlocks ? "yes" : "no"}`);
  console.log(`  Images:  ${imgCount}`);
  console.log(`  Table rows:   ${tableRows}`);
  console.log(`  Blockquotes:  ${hasBlockquote ? "yes" : "no"}`);
  console.log(`  Bullet lists: ${hasBullets}`);
  console.log("");
}

console.log("=== Target posts check ===\n");
const targets = [
  "ai-103-azure-ai-apps-and-agents-developer-what-changed-from-ai-102",
  "ai-901-azure-ai-fundamentals-the-new-ai-900-for-2027",
  "az-305-designing-microsoft-azure-infrastructure-solutions-still-the-core-in-2027",
];
for (const slug of targets) {
  const post = db.prepare("SELECT slug, title, content FROM posts WHERE slug = ?").get(slug);
  if (post) {
    const c = post.content;
    const hasImg = c.includes("unsplash.com/photo-");
    const hasCode = c.includes("```");
    const hasTable = (c.match(/^\|.*\|$/gm) || []).length > 2;
    console.log(`  ${post.title.slice(0, 50)}`);
    console.log(`    Cover image:        ${hasImg ? "yes" : "MISSING"}`);
    console.log(`    Code blocks:        ${hasCode ? "yes" : "MISSING"}`);
    console.log(`    Tables (>=3 rows):  ${hasTable ? "yes" : "MISSING"}`);
    console.log(`    Content length:     ${c.length} chars`);
  } else {
    console.log(`  NOT FOUND: ${slug}`);
  }
}
