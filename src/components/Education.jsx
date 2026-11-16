import education from "../data/educationData";

export default function Education() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="font-mono text-xs text-muted">{education.date}</p>
        <h3 className="mt-2 font-display text-3xl tracking-tight text-ink">
          <a
            className="text-link decoration-transparent hover:decoration-moss"
            href={education.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {education.school}
          </a>
        </h3>
        <p className="mt-2 text-muted">{education.place}</p>
        <dl className="mt-8 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Degree
            </dt>
            <dd className="mt-1 text-ink">{education.degree}</dd>
          </div>
          <div>
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Focus
            </dt>
            <dd className="mt-1 text-ink">{education.focus}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Honors
            </dt>
            <dd className="mt-1 text-ink">{education.honors}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Coursework
          </h3>
          <ul className="mt-3 space-y-2">
            {education.coursework.map((course) => (
              <li key={course} className="text-ink">
                {course}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Notes
          </h3>
          <ul className="mt-3 space-y-2">
            {education.notes.map((note) => (
              <li key={note} className="text-muted">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
