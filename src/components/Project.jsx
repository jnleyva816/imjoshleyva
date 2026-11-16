import { useState } from "react";
import Modal from "./Modal";

export default function Project({ project }) {
  const [open, setOpen] = useState(false);
  const tech = project.technologies.slice(0, 5).join("  ·  ");

  return (
    <article className="grid items-start gap-6 border-t border-line py-10 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-10">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:col-span-5"
        aria-label={`Open details for ${project.title}`}
      >
        <img
          src={project.imageUrl}
          alt=""
          className="aspect-[4/3] w-full rounded-xl border border-line object-cover"
          loading="lazy"
        />
      </button>

      <div className="md:col-span-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {[project.year, project.status].filter(Boolean).join("  ·  ")}
        </p>
        <h3 className="mt-2 font-display text-3xl tracking-tight text-ink">
          <button type="button" onClick={() => setOpen(true)} className="text-left">
            {project.title}
          </button>
        </h3>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">{project.description}</p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          {tech}
        </p>
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
          <button type="button" className="btn btn-quiet" onClick={() => setOpen(true)}>
            Details
          </button>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} project={project} />
    </article>
  );
}
