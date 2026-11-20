import site from "../content/site";
import { onHome } from "../lib/paths";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-h4 text-ink">{site.name}</p>
          <a className="text-link mt-2 inline-block text-sm text-muted" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <div className="flex gap-5 text-sm text-muted">
          <a className="hover:text-ink" href={onHome() ? "#top" : "/"}>
            Site
          </a>
          <a className="hover:text-ink" href={site.photography} target="_blank" rel="noopener noreferrer">
            Photography
          </a>
        </div>
        <div className="space-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted sm:text-right">
          <p suppressHydrationWarning>© {year}</p>
          <p>
            Plants by{" "}
            <a
              className="text-link"
              href="https://unsplash.com/photos/ph7QQq63lCs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Natalie Kovach
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
