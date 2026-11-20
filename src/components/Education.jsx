import education from "../data/educationData";

const label = "font-mono text-[11px] uppercase tracking-[0.14em] text-muted";

/** A row under Skills, in the same two-column grid. */
export default function Education() {
  return (
    <div
      id="education"
      className="mt-10 grid gap-3 border-t border-line pt-10 md:grid-cols-[11rem_1fr] md:gap-10"
    >
      <h3 className="text-sm font-medium text-ink">Education</h3>
      <div className="max-w-2xl">
        <p className="font-display text-h4 text-ink">
          <a className="text-link" href={education.url} target="_blank" rel="noopener noreferrer">
            {education.school}
          </a>
        </p>
        <p className="mt-1 text-muted">
          {education.degree} · {education.focus} · {education.date}
        </p>
        <p className="mt-3 text-ink">{education.honors}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{education.notes.join(" · ")}</p>
        <p className={`mt-4 ${label}`}>
          <span className="sr-only">Coursework: </span>
          {education.coursework.join("  ·  ")}
        </p>
      </div>
    </div>
  );
}
