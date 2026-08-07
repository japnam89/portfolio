// Server-side markdown rendering for blog posts, with syntax highlighting
// via highlight.js. Returns trusted HTML (authors are the site owner).
import { marked } from "marked";
import hljs from "highlight.js";

marked.setOptions({
  gfm: true,
  breaks: false,
});

// marked v15 passes a single token object to renderer.code.
const renderer = new marked.Renderer();
renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
  const language = (lang || "").trim().split(/\s+/)[0];
  let highlighted: string;
  try {
    if (language && hljs.getLanguage(language)) {
      highlighted = hljs.highlight(text, { language }).value;
    } else {
      highlighted = hljs.highlightAuto(text).value;
    }
  } catch {
    highlighted = text;
  }
  const label = language ? `<span class="code-lang">${language}</span>` : "";
  const cls = language ? ` language-${language}` : "";
  return `<pre class="code-block${cls}">${label}<code class="hljs">${highlighted}</code></pre>`;
};

marked.use({ renderer });

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
