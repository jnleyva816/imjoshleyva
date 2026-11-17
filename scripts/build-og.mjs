// Builds the link-preview images in public/og/ (1200 × 630) for the résumé and
// each case study, from the same data the pages use. The home page keeps
// public/og.jpg, a screenshot of the hero.
//
//   npm run og
//
// Set CHROME to a Chromium binary if Playwright's own browser isn't installed
// (on NixOS: CHROME=$(command -v chromium) npm run og).

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import projects from "../src/data/projectsData.js";
import resume from "../src/content/resume.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/og");

const esc = (value) =>
  String(value).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const font = (pkg, file) => pathToFileURL(path.join(root, "node_modules", pkg, "files", file)).href;
const portrait = pathToFileURL(path.join(root, "src/assets/profile_picture.jpg")).href;

const cards = [
  {
    file: "resume.png",
    eyebrow: "Résumé",
    title: resume.name,
    text: resume.summary,
    tags: ["SQL", "Production systems", "Full stack"],
  },
  ...projects
    .filter((project) => project.caseStudy)
    .map((project) => ({
      file: `${project.slug}.png`,
      eyebrow: `Case study · ${project.year}`,
      title: project.title,
      text: project.caseStudy.summary,
      tags: project.technologies.slice(0, 5),
    })),
];

const page = (card) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: "Fraunces"; font-weight: 100 900; src: url("${font("@fontsource-variable/fraunces", "fraunces-latin-opsz-normal.woff2")}") format("woff2"); }
  @font-face { font-family: "Figtree"; font-weight: 300 900; src: url("${font("@fontsource-variable/figtree", "figtree-latin-wght-normal.woff2")}") format("woff2"); }
  @font-face { font-family: "Plex Mono"; font-weight: 500; src: url("${font("@fontsource/ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff2")}") format("woff2"); }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #f4f0e8; color: #1b1916; font-family: Figtree, sans-serif; }
  .card { position: relative; height: 100%; padding: 72px 80px 64px; display: flex; flex-direction: column; overflow: hidden; }
  .card::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 10px; background: #2c4a3c; }
  .eyebrow { font: 500 17px "Plex Mono", monospace; letter-spacing: 0.18em; text-transform: uppercase; color: #2c4a3c; }
  h1 { margin-top: 22px; font: 400 88px/0.95 Fraunces, serif; letter-spacing: -0.035em; max-width: 960px; }
  p { margin-top: 28px; max-width: 900px; font-size: 27px; line-height: 1.45; color: #4f4a42;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(27, 25, 22, 0.14); padding-top: 28px; }
  .who { display: flex; align-items: center; gap: 16px; font-size: 22px; }
  .who img { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; object-position: 50% 30%; border: 1px solid rgba(27, 25, 22, 0.14); }
  .who span { color: #4f4a42; }
  .tags { display: flex; gap: 10px; }
  .tags b { font: 500 14px "Plex Mono", monospace; letter-spacing: 0.08em; text-transform: uppercase; color: #2c4a3c;
    border: 1px solid rgba(44, 74, 60, 0.3); border-radius: 999px; padding: 7px 14px; }
</style></head><body><div class="card">
  <div class="eyebrow">${esc(card.eyebrow)}</div>
  <h1>${esc(card.title)}</h1>
  <p>${esc(card.text)}</p>
  <div class="foot">
    <div class="who"><img src="${portrait}" alt=""><strong>Joshua Leyva</strong><span>joshleyva.dev</span></div>
    <div class="tags">${card.tags.map((tag) => `<b>${esc(tag)}</b>`).join("")}</div>
  </div>
</div></body></html>`;

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
// Loaded from a file so the page may read the local fonts and portrait.
const html = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "og-")), "card.html");
for (const card of cards) {
  fs.writeFileSync(html, page(card));
  await tab.goto(pathToFileURL(html).href, { waitUntil: "load" });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: path.join(outDir, card.file) });
  console.log(`wrote public/og/${card.file}`);
}
await browser.close();
