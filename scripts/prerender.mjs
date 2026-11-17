// Runs after `vite build`: renders every page to HTML so it paints before
// any JavaScript loads, and gives each one its own title, preview image, and
// schema.org data. Also writes /llms.txt and /sitemap.xml from the same data.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const server = await import(pathToFileURL(path.join(root, ".ssr/entry-server.js")).href);
const { pages, render, siteDigest, ORIGIN } = server;

const escape = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Tags each page sets for itself; the template's copies are dropped first.
const perPage = [
  /\s*<title>[\s\S]*?<\/title>/,
  /\s*<meta\s+name="description"[\s\S]*?\/>/,
  /\s*<link\s+rel="canonical"[^>]*>/,
  /\s*<meta\s+property="og:(?:type|url|title|description|image(?::\w+)?)"[\s\S]*?\/>/g,
  /\s*<meta\s+name="twitter:[\w:]+"[\s\S]*?\/>/g,
  /\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/,
];

function head(page) {
  const url = `${ORIGIN}${page.path}`;
  const image = `${ORIGIN}${page.image.path}`;
  return `
    <title>${escape(page.title)}</title>
    <meta name="description" content="${escape(page.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${page.ogType}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escape(page.title)}" />
    <meta property="og:description" content="${escape(page.description)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escape(page.image.alt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="alternate" type="text/plain" title="LLM-readable summary" href="/llms.txt" />
    <script type="application/ld+json">${JSON.stringify(page.jsonLd).replace(/</g, "\\u003c")}</script>
    <noscript><style>#root [style*="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}</style></noscript>
  `;
}

const templates = new Map();
const template = async (name) => {
  if (!templates.has(name)) templates.set(name, await fs.readFile(path.join(dist, name), "utf8"));
  return templates.get(name);
};

for (const page of pages()) {
  let html = await template(page.template);
  for (const pattern of perPage) html = html.replace(pattern, "");
  if (!html.includes('<div id="root"></div>')) throw new Error(`${page.template}: no empty #root`);
  html = html
    .replace("</head>", `${head(page)}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(page.path)}</div>`);

  const out = path.join(dist, page.out);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, html);
  console.log(`prerendered ${page.path} -> dist/${page.out}`);
}

// Only a template; known projects now have their own files, the rest 404.
await fs.rm(path.join(dist, "project.html"));

await fs.writeFile(path.join(dist, "llms.txt"), `${siteDigest()}\n`);

const urls = pages()
  .map((page) => `  <url><loc>${ORIGIN}${page.path}</loc></url>`)
  .join("\n");
await fs.writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
console.log("wrote dist/llms.txt and dist/sitemap.xml");
