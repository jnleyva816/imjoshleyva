/**
 * The shape of every content file in src/content and src/data. The build
 * (scripts/check-content.mjs) and `npm test` both check against it, so a typo
 * like `caseStuddy` or a missing `summary` fails with the field's path instead
 * of a crash halfway through pre-rendering.
 *
 * Objects are strict: an unknown key is an error, which is what catches typos.
 * When you add a field to a data file, add it here too.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const text = z.string().trim().min(1);
const url = z.url({ protocol: /^https?$/ });
const href = z.union([url, z.string().regex(/^[#/]/, "an in-site link starts with # or /")]);
const month = "(January|February|March|April|May|June|July|August|September|October|November|December) \\d{4}";

const link = z.strictObject({ label: text, href });

/** A screenshot in src/assets/projects. */
const image = z.strictObject({
  file: z
    .string()
    .regex(/^[\w.-]+\.(png|jpe?g|webp|avif)$/i)
    .refine((file) => fs.existsSync(path.join(root, "src/assets/projects", file)), {
      message: "no such file in src/assets/projects",
    }),
  alt: text,
});

export const project = z.strictObject({
  id: z.number().int(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "lowercase letters, digits, and dashes"),
  title: text,
  description: text,
  technologies: z.array(text).min(1),
  demo: url.optional(),
  github: url.optional(),
  image: image.optional(),
  category: text,
  year: z.string().regex(/^\d{4}$/),
  status: text,
  caseStudy: z
    .strictObject({
      timeline: text,
      role: text,
      summary: text,
      why: z.array(text).min(1),
      features: z.array(text).min(1),
      how: z.array(text).min(1),
      decisions: z.array(z.strictObject({ title: text, text })).min(1),
      next: z.array(text).optional(),
    })
    .optional(),
});

export const projects = z
  .array(project)
  .min(1)
  .refine((list) => new Set(list.map((p) => p.slug)).size === list.length, "slugs must be unique")
  .refine((list) => new Set(list.map((p) => p.id)).size === list.length, "ids must be unique");

export const experience = z
  .array(
    z.strictObject({
      company: text,
      role: text,
      duration: z.string().regex(new RegExp(`^${month} — (${month}|Present)$`), 'like "July 2025 — Present"'),
      description: text,
      // One measurable result, shown under the description. Keep it short.
      impact: text.max(140).optional(),
      tags: z.array(text).optional(),
      promoted: z.boolean().optional(),
    }),
  )
  .min(1);

export const education = z.strictObject({
  school: text,
  url,
  place: text,
  degree: text,
  date: z.string().regex(new RegExp(`^${month}$`)),
  honors: text,
  focus: text,
  coursework: z.array(text),
  notes: z.array(text),
});

export const skills = z.array(
  z.strictObject({
    name: text,
    items: z.array(z.strictObject({ name: text, experience: z.string().regex(/^\d+ yrs?$/, 'like "5 yrs"') })).min(1),
  }),
);

const section = z.strictObject({ id: z.string().regex(/^[a-z-]+$/), index: z.string().regex(/^\d{2}$/), title: text, lede: text.optional() });

export const site = z
  .strictObject({
    name: text,
    role: text,
    company: text,
    title: text,
    email: z.email(),
    timeZone: z.strictObject({ id: text, place: text }),
    now: z.strictObject({ text, updated: text }).optional(),
    photography: url,
    nav: z.array(z.strictObject({ href, label: text, external: z.boolean().optional() })),
    contact: z.strictObject({ endpoint: z.string().startsWith("/") }),
    social: z.array(link),
    about: z.strictObject({
      paragraphs: z.array(text),
      facts: z.array(z.strictObject({ label: text, value: text, href: url.optional() })),
    }),
    music: z.strictObject({ youtube: z.string(), title: text, artist: text, note: text }).optional(),
    audiences: z
      .array(z.strictObject({ id: z.string().regex(/^[a-z-]+$/), label: text, copy: text, links: z.array(link).min(1).max(2) }))
      .min(1),
    sectionOrder: z.array(z.string()),
    sections: z.record(z.string(), section),
  })
  .superRefine((value, ctx) => {
    for (const key of value.sectionOrder) {
      if (!key.startsWith("photos:") && !value.sections[key]) {
        ctx.addIssue({ code: "custom", path: ["sectionOrder"], message: `"${key}" has no entry in sections` });
      }
    }
    const ids = new Set(Object.values(value.sections).map((s) => s.id));
    for (const item of value.nav) {
      if (item.href.startsWith("#") && !ids.has(item.href.slice(1))) {
        ctx.addIssue({ code: "custom", path: ["nav"], message: `${item.href} is not a section id` });
      }
    }
  });

export const resume = z.strictObject({
  name: text,
  headline: text,
  contact: z.array(text),
  summary: text,
  projects: z.array(z.strictObject({ name: text, link: text, text })),
  educationNote: text,
});

/** File → schema. Paths are relative to the repo root. */
export const files = {
  "src/content/site.js": site,
  "src/content/resume.js": resume,
  "src/data/projectsData.js": projects,
  "src/data/experienceData.js": experience,
  "src/data/educationData.js": education,
  "src/data/skillsData.js": skills,
};

/** Every problem across every file, as "file: path: message" lines. */
export async function problems() {
  const found = [];
  for (const [file, schema] of Object.entries(files)) {
    const { default: data } = await import(path.join(root, file));
    const result = schema.safeParse(data);
    if (result.success) continue;
    for (const issue of result.error.issues) {
      found.push(`${file}: ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
  }
  return found;
}
