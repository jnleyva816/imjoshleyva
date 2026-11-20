/**
 * What each page says about itself: title, description, preview image, and
 * schema.org data. This is the only place those tags are written:
 * scripts/prerender.mjs bakes them into the built HTML, `vite dev` injects
 * them through the seo-head plugin in vite.config.js, and the same content
 * becomes /llms.txt. The HTML templates carry none of it.
 *
 * Imports keep their .js extensions because the build scripts load this in
 * plain Node.
 */
import site from "../content/site.js";
import resume from "../content/resume.js";
import projects from "../data/projectsData.js";
import experience from "../data/experienceData.js";
import education from "../data/educationData.js";
import skills from "../data/skillsData.js";

export const ORIGIN = "https://joshleyva.dev";

const studies = projects.filter((project) => project.caseStudy);

const person = {
  "@type": "Person",
  "@id": `${ORIGIN}/#person`,
  name: site.name,
  alternateName: resume.name,
  jobTitle: site.role,
  worksFor: { "@type": "Organization", name: site.company, url: "https://cryptio.co" },
  url: `${ORIGIN}/`,
  image: `${ORIGIN}/og.jpg`,
  email: `mailto:${site.email}`,
  description: resume.summary,
  homeLocation: { "@type": "Place", name: "Florida, United States" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: education.school,
    url: education.url,
  },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "degree",
    name: education.degree,
    recognizedBy: { "@type": "CollegeOrUniversity", name: education.school },
  },
  hasOccupation: {
    "@type": "Occupation",
    name: site.role,
    skills: skills.flatMap((group) => group.items.map((item) => item.name)).join(", "),
  },
  knowsAbout: [
    "Solutions engineering",
    "Production support",
    "SQL",
    "Crypto accounting",
    "Full-stack web development",
    "Quality assurance",
    "Photography",
    ...skills.flatMap((group) => group.items.slice(0, 3).map((item) => item.name)),
  ],
  sameAs: site.social.map((item) => item.href),
};

const website = {
  "@type": "WebSite",
  "@id": `${ORIGIN}/#website`,
  name: site.name,
  url: `${ORIGIN}/`,
  author: { "@id": person["@id"] },
};

const graph = (...nodes) => ({ "@context": "https://schema.org", "@graph": nodes });

const breadcrumbs = (...items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], index) => ({
    "@type": "ListItem",
    position: index + 1,
    name,
    item: `${ORIGIN}${path}`,
  })),
});

/** The page for a URL path, or undefined. Trailing slashes and .html are ignored. */
export function pageFor(path) {
  const clean = path.split(/[?#]/)[0].replace(/\.html$/, "").replace(/\/index$/, "/").replace(/(.)\/+$/, "$1");
  return pages().find((page) => page.path === clean);
}

const escape = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Everything a page puts in <head> about itself. */
export function headTags(page) {
  const url = `${ORIGIN}${page.path}`;
  const image = `${ORIGIN}${page.image.path}`;
  return `
    <title>${escape(page.title)}</title>
    <meta name="description" content="${escape(page.description)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${page.ogType}" />
    <meta property="og:site_name" content="${escape(site.name)}" />
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
  `;
}

/** Every pre-rendered page: where it comes from, where it goes, what it says. */
export function pages() {
  const home = {
    path: "/",
    template: "index.html",
    out: "index.html",
    title: `${site.name} · ${site.role}`,
    description: `${site.name} is a ${site.title}. Production systems, SQL, and customer-facing fixes, plus photography and the occasional side project.`,
    ogType: "profile",
    image: { path: "/og.jpg", alt: "Joshua Leyva's site: name, role, and portrait" },
    jsonLd: graph(person, website, {
      "@type": "ProfilePage",
      url: `${ORIGIN}/`,
      mainEntity: { "@id": person["@id"] },
      isPartOf: { "@id": website["@id"] },
    }),
  };

  const resumePage = {
    path: "/resume",
    template: "resume.html",
    out: "resume.html",
    title: `Résumé · ${site.name}`,
    description: resume.summary,
    ogType: "profile",
    image: { path: "/og/resume.png", alt: `Résumé of ${site.name}, ${resume.headline}` },
    jsonLd: graph(
      person,
      {
        "@type": "ProfilePage",
        url: `${ORIGIN}/resume`,
        name: `Résumé of ${site.name}`,
        mainEntity: { "@id": person["@id"] },
        isPartOf: { "@id": website["@id"] },
      },
      breadcrumbs(["Home", "/"], ["Résumé", "/resume"]),
    ),
  };

  const projectPages = studies.map((project) => ({
    path: `/projects/${project.slug}`,
    template: "project.html",
    out: `projects/${project.slug}.html`,
    title: `${project.title} · ${site.name}`,
    description: project.caseStudy.summary,
    ogType: "article",
    image: { path: `/og/${project.slug}.png`, alt: `${project.title}: a project by ${site.name}` },
    jsonLd: graph(
      {
        "@type": "SoftwareSourceCode",
        name: project.title,
        description: project.description,
        url: `${ORIGIN}/projects/${project.slug}`,
        ...(project.github ? { codeRepository: project.github } : {}),
        programmingLanguage: project.technologies,
        dateCreated: project.year,
        creativeWorkStatus: project.status,
        author: { "@id": person["@id"] },
      },
      breadcrumbs(["Home", "/"], ["Projects", "/#projects"], [project.title, `/projects/${project.slug}`]),
    ),
  }));

  return [home, resumePage, ...projectPages];
}

const list = (items) => items.map((item) => `- ${item}`).join("\n");

/**
 * Plain-text version of the whole site for language models: /llms.txt.
 */
export function siteDigest() {
  return [
    `# ${site.name}`,
    `> ${site.title}. ${resume.summary}`,
    `Email: ${site.email}\nSite: ${ORIGIN}\nRésumé: ${ORIGIN}/resume (with a PDF download)`,
    `## Now\n${site.now.text} (updated ${site.now.updated})`,
    `## Work\n${experience
      .map((job) => `### ${job.role}, ${job.company} (${job.duration})\n${job.description}`)
      .join("\n\n")}`,
    `## Projects\n${projects
      .map((project) => {
        const lines = [`### ${project.title} (${[project.year, project.status].filter(Boolean).join(", ")})`, project.description];
        lines.push(`Built with: ${project.technologies.join(", ")}`);
        if (project.caseStudy) {
          const study = project.caseStudy;
          lines.push(`Case study: ${ORIGIN}/projects/${project.slug}`);
          lines.push(`Why: ${study.why.join(" ")}`);
          lines.push(`Features:\n${list(study.features)}`);
          lines.push(`How it works:\n${list(study.how)}`);
          lines.push(`Decisions:\n${list(study.decisions.map((item) => `${item.title}: ${item.text}`))}`);
          if (study.next?.length) lines.push(`Next:\n${list(study.next)}`);
        }
        if (project.demo) lines.push(`Live: ${project.demo}`);
        if (project.github) lines.push(`Code: ${project.github}`);
        return lines.join("\n");
      })
      .join("\n\n")}`,
    `## Other projects\n${list(resume.projects.filter((item) => !projects.some((p) => p.title === item.name)).map((item) => `${item.name}: ${item.text}`))}`,
    `## Education\n${education.degree}, ${education.school}, ${education.place} (${education.date}). ${education.honors}. Focus: ${education.focus}.\n${list(education.notes)}`,
    `## Skills\n${skills.map((group) => `${group.name}: ${group.items.map((item) => `${item.name} (${item.experience})`).join(", ")}`).join("\n")}`,
    `## About\n${site.about.paragraphs.join("\n\n")}\n${list(site.about.facts.map((fact) => `${fact.label}: ${fact.value}`))}`,
    `## Links\n${list(site.social.map((item) => `${item.label}: ${item.href}`))}`,
  ].join("\n\n");
}
