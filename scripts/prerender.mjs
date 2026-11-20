// Runs after `vite build`: renders every page to HTML so it paints before
// any JavaScript loads, and gives each one its own title, preview image, and
// schema.org data. Also writes /llms.txt and /sitemap.xml from the same data.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const server = await import(pathToFileURL(path.join(root, ".ssr/entry-server.js")).href);
const { pages, render, siteDigest, headTags, ORIGIN } = server;

const templates = new Map();
const template = async (name) => {
  if (!templates.has(name)) templates.set(name, await fs.readFile(path.join(dist, name), "utf8"));
  return templates.get(name);
};

for (const page of pages()) {
  let html = await template(page.template);
  // src/lib/seo.js owns these tags; a copy in a template would be a second source.
  if (/<title>|rel="canonical"|property="og:(?!site_name)|application\/ld\+json/.test(html)) {
    throw new Error(`${page.template}: page tags belong in src/lib/seo.js, not the template`);
  }
  if (!html.includes('<div id="root"></div>')) throw new Error(`${page.template}: no empty #root`);
  html = html
    .replace("</head>", `${headTags(page)}</head>`)
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
