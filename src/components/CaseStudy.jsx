import { projectHref } from "../lib/paths";
import { projectImage } from "../lib/projectImages";
import useActiveSection from "../lib/useActiveSection";
import Picture from "./ui/Picture";

const label = "font-mono text-[11px] uppercase tracking-[0.16em] text-muted";

function Block({ id, title, children }) {
  return (
    <section id={id} className="reveal grid gap-4 border-t border-line py-10 md:grid-cols-[11rem_1fr] md:gap-10 lg:grid-cols-1 lg:gap-4">
      <h2 className={`${label} pt-1.5`}>{title}</h2>
      <div className="max-w-2xl">{children}</div>
    </section>
  );
}

/** The sections a case study has, in page order. Missing ones are skipped. */
const BLOCKS = [
  { id: "why", title: "Why" },
  { id: "features", title: "What it does" },
  { id: "how", title: "How it works" },
  { id: "decisions", title: "Decisions" },
  { id: "next", title: "Next" },
];

/** Sticky "On this page" list beside the case study on wide screens. */
function Contents({ blocks }) {
  const active = useActiveSection(blocks.map((block) => block.id));
  return (
    <nav aria-label="On this page" className="toc hidden lg:block">
      <div className="sticky top-24 border-t border-line pt-10">
        <p className={label}>On this page</p>
        <ul className="mt-4 space-y-2 border-l border-line text-sm">
          {blocks.map((block) => (
            <li key={block.id}>
              <a
                href={`#${block.id}`}
                aria-current={active === block.id ? "location" : undefined}
                className={`-ml-px block border-l py-0.5 pl-4 transition-colors hover:text-ink ${
                  active === block.id ? "border-moss text-ink" : "border-transparent text-muted"
                }`}
              >
                {block.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
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
  const image = projectImage(project);
  const blocks = BLOCKS.filter((block) => {
    const value = study[block.id];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });
  const has = (id) => blocks.some((block) => block.id === id);

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
          className="mt-4 w-fit font-display text-title text-ink"
          style={{ viewTransitionName: `project-${project.slug}` }}
        >
          {project.title}
        </h1>
        <p className="mt-6 text-lede text-muted">{study.summary}</p>
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
              Live <span aria-hidden="true">↗</span>
            </a>
          ) : null}
          {project.github ? (
            <a className="btn btn-quiet" href={project.github} target="_blank" rel="noopener noreferrer">
              Source on GitHub
            </a>
          ) : null}
        </div>
      ) : null}

      {image ? (
        <figure className="rise screenshot mt-12" style={{ "--rise-delay": "120ms" }}>
          <Picture
            photo={image}
            sizes="(min-width: 1152px) 1088px, 100vw"
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full"
          />
        </figure>
      ) : null}

      <div className="mt-16 lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-16">
        <div>
          {has("why") ? (
            <Block id="why" title="Why">
              <Paragraphs items={study.why} />
            </Block>
          ) : null}
          {has("features") ? (
            <Block id="features" title="What it does">
              <Points items={study.features} />
            </Block>
          ) : null}
          {has("how") ? (
            <Block id="how" title="How it works">
              <Paragraphs items={study.how} />
            </Block>
          ) : null}
          {has("decisions") ? (
            <Block id="decisions" title="Decisions">
              <div className="space-y-6">
                {study.decisions.map((item) => (
                  <div key={item.title}>
                    <h3 className="font-display text-h4 text-ink">{item.title}</h3>
                    <p className="mt-2 text-lg leading-relaxed text-muted">{item.text}</p>
                  </div>
                ))}
              </div>
            </Block>
          ) : null}
          {has("next") ? (
            <Block id="next" title="Next">
              <Points items={study.next} />
            </Block>
          ) : null}
        </div>
        {blocks.length > 2 ? <Contents blocks={blocks} /> : null}
      </div>

      {others.length ? (
        <nav className="mt-6 border-t border-line pt-10" aria-label="More case studies">
          <p className={label}>More</p>
          <ul className="mt-4 space-y-2">
            {others.map((other) => (
              <li key={other.slug}>
                <a className="text-link font-display text-h4 text-ink" href={projectHref(other)}>
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
