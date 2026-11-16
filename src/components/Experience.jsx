import experienceData from "../data/experienceData";

export default function Experience() {
  return (
    <div>
      {experienceData.map((job) => (
        <article
          key={`${job.company}-${job.role}-${job.duration}`}
          className="grid gap-3 border-t border-line py-8 first:border-t-0 first:pt-0 md:grid-cols-[11rem_1fr] md:gap-10"
        >
          <p className="font-mono text-xs leading-6 text-muted">{job.duration}</p>
          <div>
            <h3 className="font-display text-2xl tracking-tight text-ink md:text-[1.7rem]">
              {job.role}
            </h3>
            <p className="mt-1 text-moss">
              {job.company}
              {job.promoted ? (
                <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  Promoted
                </span>
              ) : null}
            </p>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              {job.description}
            </p>
            {job.tags?.length ? (
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                {job.tags.join("  ·  ")}
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
