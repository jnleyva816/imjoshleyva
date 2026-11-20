import Shell from "./Shell";
import pdf from "../assets/JoshuaLeyvaResume.pdf";
import experience from "../data/experienceData";
import education from "../data/educationData";
import skills from "../data/skillsData";
import projects from "../data/projectsData";
import resume from "../content/resume";
import site from "../content/site";
import { projectHref } from "../lib/paths";
import { byCompany, short, span } from "../lib/resumeData";

const label = "font-mono text-[11px] uppercase tracking-[0.16em] text-muted";
const when = "font-mono text-xs text-muted";

const links = [
  { text: site.email, href: `mailto:${site.email}` },
  { text: "joshleyva.dev", href: "/" },
  ...site.social
    .filter((item) => ["GitHub", "LinkedIn"].includes(item.label))
    .map((item) => ({ text: item.label, href: item.href, external: true })),
];

function Part({ title, children }) {
  return (
    <section className="grid gap-4 border-t border-line py-10 md:grid-cols-[11rem_1fr] md:gap-10">
      <h2 className={`${label} pt-1`}>{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

const caseStudyFor = (name) =>
  projects.find((project) => project.caseStudy && project.title.toLowerCase() === name.toLowerCase());

function Resume() {

  return (
    <article className="pb-16 pt-8 lg:pt-16">
      <header className="rise">
        <p className={label}>Résumé</p>
        <h1
          className="mt-4 w-fit font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.95] tracking-[-0.035em] text-ink"
          style={{ viewTransitionName: "site-name" }}
        >
          {resume.name}
        </h1>
        <p className="mt-3 text-xl text-moss">{resume.headline}</p>
        <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          {links.map((link) => (
            <a
              key={link.text}
              className="text-link"
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.text}
            </a>
          ))}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a className="btn btn-fill" href={pdf} download="JoshuaLeyvaResume.pdf">
            Download PDF
          </a>
          <button type="button" className="btn btn-quiet" onClick={() => window.print()}>
            Print
          </button>
        </div>
        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-muted">{resume.summary}</p>
      </header>

      <div className="mt-12">
        <Part title="Experience">
          <div className="space-y-10">
            {byCompany(experience).map(({ company, roles }) => (
              <div key={company} className="spotlight">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-display text-h4 text-ink">{company}</h3>
                  <p className={when}>{span(roles)}</p>
                </div>
                <div className="mt-3 space-y-5">
                  {roles.map((role) => (
                    <div key={role.role + role.duration}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6">
                        <p className="text-moss">{role.role}</p>
                        {roles.length > 1 ? <p className={when}>{short(role.duration)}</p> : null}
                      </div>
                      <p className="mt-1.5 max-w-2xl leading-relaxed text-muted">{role.description}</p>
                      {role.impact ? (
                        <p className="mt-1.5 max-w-2xl font-medium text-ink">{role.impact}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Part>

        <Part title="Projects">
          <div className="space-y-6">
            {resume.projects.map((project) => {
              const study = caseStudyFor(project.name);
              return (
                <div key={project.name}>
                  <h3 className="font-display text-xl tracking-tight text-ink">{project.name}</h3>
                  <p className="mt-1.5 max-w-2xl leading-relaxed text-muted">{project.text}</p>
                  {study || project.link ? (
                    <p className="mt-2 flex flex-wrap gap-x-5 text-sm">
                      {study ? (
                        <a className="text-link text-ink" href={projectHref(study)}>
                          Case study
                        </a>
                      ) : null}
                      {project.link ? (
                        <a
                          className="text-link text-muted"
                          href={`https://${project.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.link}
                        </a>
                      ) : null}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Part>

        <Part title="Skills">
          <dl className="space-y-3">
            {skills.map((group) => (
              <div key={group.name} className="sm:flex sm:gap-4">
                <dt className="w-32 shrink-0 text-ink">{group.name}</dt>
                <dd className="text-muted">{group.items.map((item) => item.name).join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Part>

        <Part title="Education">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="font-display text-h4 text-ink">{education.school}</h3>
            <p className={when}>{short(education.date)}</p>
          </div>
          <p className="mt-2 text-moss">
            {education.degree}, {education.focus}
          </p>
          <p className="mt-1.5 text-muted">{education.honors}</p>
          <p className="mt-1.5 max-w-2xl leading-relaxed text-muted">{resume.educationNote}</p>
        </Part>
      </div>
    </article>
  );
}

export default function ResumePage() {
  return (
    <Shell>
      <Resume />
    </Shell>
  );
}
