export default function Project({ project }) {
  const tech = project.technologies.slice(0, 5).join("  ·  ");

  return (
    <article className="border-t border-line py-10 first:border-t-0 first:pt-0">
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {[project.year, project.status].filter(Boolean).join("  ·  ")}
        </p>
        <h3 className="mt-2 font-display text-3xl tracking-tight text-ink">{project.title}</h3>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">{project.description}</p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          {tech}
        </p>
        {project.demo || project.github ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demo ? (
              <a className="btn btn-fill" href={project.demo} target="_blank" rel="noopener noreferrer">
                Live
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
    </article>
  );
}
