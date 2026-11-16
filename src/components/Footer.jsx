import site from "../content/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-2xl tracking-tight text-ink">{site.name}</p>
          <a className="text-link mt-2 inline-block text-sm text-muted" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <div className="flex gap-5 text-sm text-muted">
          <a className="hover:text-ink" href="#top">
            Site
          </a>
          <a className="hover:text-ink" href="#studio">
            Design notes
          </a>
          <a className="hover:text-ink" href={site.photography} target="_blank" rel="noopener noreferrer">
            Photography
          </a>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          © {year}
        </p>
      </div>
    </footer>
  );
}
