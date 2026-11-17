import site from "../content/site";

export default function About() {
  const { paragraphs = [], facts = [] } = site.about ?? {};
  if (paragraphs.length === 0 && facts.length === 0) return null;

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_18rem] md:gap-16">
      <div className="max-w-2xl space-y-4 text-lg leading-relaxed text-ink">
        {paragraphs.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
      {facts.length > 0 ? (
        <dl className="space-y-4 text-sm md:border-l md:border-line md:pl-8">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{fact.label}</dt>
              <dd className="mt-1 text-ink">
                {fact.href ? (
                  <a className="text-link" href={fact.href} target="_blank" rel="noopener noreferrer">
                    {fact.value} ↗
                  </a>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
