import { projectHref } from "../lib/paths";
import { projectImage } from "../lib/projectImages";
import Picture from "./ui/Picture";

export default function Project({ project }) {
  const tech = project.technologies.slice(0, 5).join("  ·  ");
  const image = projectImage(project);
  const primary = project.caseStudy ? projectHref(project) : project.demo;

  return (
    <article
      className={`spotlight border-t border-line py-10 first:border-t-0 first:pt-0 ${
        image ? "grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-12" : ""
      }`}
    >
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {[project.year, project.status].filter(Boolean).join("  ·  ")}
        </p>
        <h3
          className="mt-2 w-fit font-display text-h3 text-ink"
          style={project.slug ? { viewTransitionName: `project-${project.slug}` } : undefined}
        >{project.title}</h3>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">{project.description}</p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          {tech}
        </p>
        {project.caseStudy || project.demo || project.github ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.caseStudy ? (
              <a className="btn btn-fill" href={projectHref(project)}>
                Case study
              </a>
            ) : null}
            {project.demo ? (
              <a className={`btn ${project.caseStudy ? "btn-quiet" : "btn-fill"}`} href={project.demo} target="_blank" rel="noopener noreferrer">
                Live <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {project.github ? (
              <a className="btn btn-quiet" href={project.github} target="_blank" rel="noopener noreferrer">
                Source
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      {image ? (
        // The same destination as the first button, so it stays out of the tab order.
        <a
          href={primary ?? undefined}
          tabIndex={-1}
          aria-hidden="true"
          className="screenshot group block"
          {...(!project.caseStudy && project.demo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          <Picture
            photo={image}
            sizes="(min-width: 1152px) 560px, (min-width: 768px) 52vw, 100vw"
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
        </a>
      ) : null}
    </article>
  );
}
