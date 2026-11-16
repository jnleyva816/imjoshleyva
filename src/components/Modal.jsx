import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function Modal({ isOpen, onClose, project }) {
  const reduce = useReducedMotion();
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="Close project details"
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-dialog-title"
            tabIndex={-1}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-line bg-paper p-6 shadow-none outline-none sm:p-8"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  {[project.year, project.status].filter(Boolean).join("  ·  ")}
                </p>
                <h2
                  id="project-dialog-title"
                  className="mt-2 font-display text-3xl tracking-tight text-ink"
                >
                  {project.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink"
              >
                Close
              </button>
            </div>

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

            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt=""
                className="mt-6 aspect-[16/9] w-full rounded-xl border border-line object-cover"
              />
            ) : null}

            <p className="mt-6 leading-relaxed text-muted">
              {project.longDescription || project.description}
            </p>

            {project.technologies?.length ? (
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                {project.technologies.join("  ·  ")}
              </p>
            ) : null}

            {project.features?.length ? (
              <ul className="mt-6 space-y-2">
                {project.features.map((feature) => (
                  <li key={feature} className="text-ink">
                    {feature}
                  </li>
                ))}
              </ul>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
