// Builds src/assets/JoshuaLeyvaResume.pdf from the same data the site uses.
//
//   npm run resume
//
// Set CHROME to a Chromium binary if Playwright's own browser isn't installed
// (on NixOS: CHROME=$(command -v chromium) npm run resume).

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import experience from "../src/data/experienceData.js";
import education from "../src/data/educationData.js";
import skills from "../src/data/skillsData.js";
import resume from "../src/content/resume.js";
import { byCompany, short, span as dates } from "../src/lib/resumeData.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "src/assets/JoshuaLeyvaResume.pdf");

const esc = (value) =>
  String(value).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const font = (pkg, file) => pathToFileURL(path.join(root, "node_modules", pkg, "files", file)).href;

const companies = byCompany(experience);

const experienceHtml = companies
  .map(
    ({ company, roles }) => `
    <div class="job">
      <div class="row"><h3>${esc(company)}</h3><span class="when">${esc(dates(roles))}</span></div>
      ${roles
        .map(
          (role) => `
        <div class="role">
          <div class="row"><span class="role-name">${esc(role.role)}</span>${
            roles.length > 1 ? `<span class="when">${esc(short(role.duration))}</span>` : ""
          }</div>
          <p>${esc(role.description)}</p>
        </div>`,
        )
        .join("")}
    </div>`,
  )
  .join("");

const projectsHtml = resume.projects
  .map(
    (project) => `
    <div class="project">
      <div class="row"><h3>${esc(project.name)}</h3><span class="when">${esc(project.link)}</span></div>
      <p>${esc(project.text)}</p>
    </div>`,
  )
  .join("");

const skillsHtml = skills
  .map(
    (group) =>
      `<p><b>${esc(group.name)}:</b> ${group.items.map((item) => esc(item.name)).join(", ")}</p>`,
  )
  .join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Joshua Leyva – Resume</title>
<style>
  @font-face { font-family: "Fraunces"; font-weight: 100 900; src: url("${font("@fontsource-variable/fraunces", "fraunces-latin-opsz-normal.woff2")}") format("woff2"); }
  @font-face { font-family: "Figtree"; font-weight: 300 900; src: url("${font("@fontsource-variable/figtree", "figtree-latin-wght-normal.woff2")}") format("woff2"); }
  @page { size: Letter; margin: 0.4in 0.55in; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #1b1916; font: 400 9.1pt/1.34 "Figtree", sans-serif; }
  h1 { margin: 0; font: 500 24pt/1 "Fraunces", serif; letter-spacing: -0.01em; }
  h2 { margin: 9pt 0 4pt; padding-bottom: 2pt; border-bottom: 0.75pt solid #2c4a3c; font: 600 8pt/1 "Figtree", sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #2c4a3c; }
  h3 { margin: 0; font: 600 10pt/1.3 "Figtree", sans-serif; }
  p { margin: 0; }
  a { color: inherit; text-decoration: none; }
  .title { margin-top: 3pt; font-size: 11pt; color: #2c4a3c; }
  .contact { margin-top: 4pt; color: #4f4a42; font-size: 8.8pt; }
  .contact span + span::before { content: "·"; margin: 0 6pt; }
  .summary { margin-top: 8pt; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; }
  .when { color: #4f4a42; font-size: 8.6pt; white-space: nowrap; }
  .job, .project { margin-top: 5pt; break-inside: avoid; }
  .job:first-of-type, .project:first-of-type { margin-top: 0; }
  .role { margin-top: 2pt; }
  .role-name { font-weight: 500; color: #2c4a3c; }
  .role p, .project p { color: #2a2723; }
  .skills p { margin-top: 1.5pt; }
  .skills b { font-weight: 600; }
  .edu p { margin-top: 1.5pt; color: #2a2723; }
</style>
</head>
<body>
  <h1>${esc(resume.name)}</h1>
  <div class="title">${esc(resume.headline)}</div>
  <div class="contact">${resume.contact.map((item) => `<span>${esc(item)}</span>`).join("")}</div>

  <p class="summary">${esc(resume.summary)}</p>

  <h2>Experience</h2>
  ${experienceHtml}

  <h2>Projects</h2>
  ${projectsHtml}

  <h2>Skills</h2>
  <div class="skills">${skillsHtml}</div>

  <h2>Education</h2>
  <div class="edu">
    <div class="row"><h3>${esc(education.school)}</h3><span class="when">${esc(short(education.date))}</span></div>
    <p>${esc(education.degree)}, ${esc(education.focus)}. ${esc(education.honors)}.</p>
    <p>${esc(resume.educationNote)}</p>
  </div>
</body>
</html>`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "resume-"));
const page = path.join(tmp, "resume.html");
fs.writeFileSync(page, html);

const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const tab = await browser.newPage();
await tab.goto(pathToFileURL(page).href, { waitUntil: "networkidle" });
await tab.evaluate(() => document.fonts.ready);
await tab.pdf({ path: output, preferCSSPageSize: true, printBackground: true });
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });

console.log(`Wrote ${path.relative(root, output)}`);
