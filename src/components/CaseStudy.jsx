import { m, useReducedMotion } from "framer-motion";
import { fadeUp } from "../lib/motion";
import { projectHref } from "../lib/paths";

const label = "font-mono text-[11px] uppercase tracking-[0.16em] text-muted";

function Block({ title, children }) {
  const reduce = useReducedMotion();
  return (
    <m.section
      className="grid gap-4 border-t border-line py-10 md:grid-cols-[11rem_1fr] md:gap-10"
      variants={fadeUp(reduce)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
    >
      <h2 className={`${label} pt-1.5`}>{title}</h2>
      <div className="max-w-2xl">{children}</div>
    </m.section>
  );
}

const Paragraphs = ({ items }) => (
  <div className="space-y-4 text-lg leading-relaxed text-muted">
    {items.map((text) => (
      <p key={text}>{text}</p>
    ))}
  </div>
);

const Points = ({ items }) => (
  <ul className="space-y-2.5 text-lg leading-relaxed text-muted">
    {items.map((text) => (
      <li key={text} className="flex gap-3">
        <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-moss" />
        <span>{text}</span>
      </li>
    ))}
  </ul>
);

export default function CaseStudy({ project, others }) {
  const study = project.caseStudy;

  return (
    <article className="pb-16 pt-8 lg:pt-16">
      <a href="/#projects" className="text-link text-sm text-muted">
        ← All projects
      </a>

      <header className="rise mt-10 max-w-3xl">
        <p className={label}>
          {[study.timeline, project.status].filter(Boolean).join("  ·  ")}
        </p>
        <h1
          className="mt-4 w-fit font-display text-[clamp(2.8rem,7vw,5rem)] leading-[0.95] tracking-[-0.035em] text-ink"
          style={{ viewTransitionName: `project-${project.slug}` }}
        >
          {project.title}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-muted">{study.summary}</p>
      </header>

      <dl className="mt-10 grid max-w-3xl gap-6 sm:grid-cols-3">
        <div>
          <dt className={label}>Role</dt>
          <dd className="mt-2 text-ink">{study.role}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className={label}>Stack</dt>
          <dd className="mt-2 text-ink">{project.technologies.join(", ")}</dd>
        </div>
      </dl>

      {project.demo || project.github ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {project.demo ? (
            <a className="btn btn-fill" href={project.demo} target="_blank" rel="noopener noreferrer">
              Live
            </a>
          ) : null}
          {project.github ? (
            <a className="btn btn-quiet" href={project.github} target="_blank" rel="noopener noreferrer">
              Source on GitHub
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="mt-16">
        {study.why ? (
          <Block title="Why">
            <Paragraphs items={study.why} />
          </Block>
        ) : null}
        {study.features ? (
          <Block title="What it does">
            <Points items={study.features} />
          </Block>
        ) : null}
        {study.how ? (
          <Block title="How it works">
            <Paragraphs items={study.how} />
          </Block>
        ) : null}
        {study.decisions ? (
          <Block title="Decisions">
            <div className="space-y-6">
              {study.decisions.map((item) => (
                <div key={item.title}>
                  <h3 className="font-display text-2xl tracking-tight text-ink">{item.title}</h3>
                  <p className="mt-2 text-lg leading-relaxed text-muted">{item.text}</p>
                </div>
              ))}
            </div>
          </Block>
        ) : null}
        {study.next ? (
          <Block title="Next">
            <Points items={study.next} />
          </Block>
        ) : null}
      </div>

      {others.length ? (
        <nav className="mt-6 border-t border-line pt-10" aria-label="More case studies">
          <p className={label}>More</p>
          <ul className="mt-4 space-y-2">
            {others.map((other) => (
              <li key={other.slug}>
                <a className="text-link font-display text-2xl tracking-tight text-ink" href={projectHref(other)}>
                  {other.title} →
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </article>
  );
}
