import { useState } from "react";
import site from "../content/site";

export default function Listening() {
  const track = site.music;
  const [started, setStarted] = useState(false);
  if (!track?.youtube) return null;

  const embed = `https://www.youtube-nocookie.com/embed/${track.youtube}?autoplay=1&rel=0&playsinline=1`;
  const cover = `https://i.ytimg.com/vi/${track.youtube}/hqdefault.jpg`;

  return (
    <div>
      <h3 className="font-display text-h4 text-ink">Listening</h3>
      <p className="mt-2 text-sm text-muted">{track.note}</p>
      <div className="mt-4 overflow-hidden rounded-md border border-line bg-raised">
        <div className="relative aspect-video bg-ink/5">
          {started ? (
            <iframe
              src={embed}
              title={`${track.title} by ${track.artist}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="group absolute inset-0 size-full"
              aria-label={`Play ${track.title}`}
            >
              <img src={cover} alt="" loading="lazy" className="size-full object-cover" />
              <span className="absolute inset-0 grid place-items-center bg-ink/20 transition-colors group-hover:bg-ink/30">
                <span className="grid size-14 place-items-center rounded-full bg-paper/90 text-ink shadow-lg transition-transform group-hover:scale-105">
                  <svg viewBox="0 0 16 16" className="size-5 translate-x-px" aria-hidden="true">
                    <path d="M4 2.5v11a.5.5 0 0 0 .77.42l8.5-5.5a.5.5 0 0 0 0-.84l-8.5-5.5A.5.5 0 0 0 4 2.5Z" fill="currentColor" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
        <div className="flex items-baseline justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm text-ink">{track.title}</p>
            <p className="truncate text-xs text-muted">{track.artist}</p>
          </div>
          <a
            className="shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-moss"
            href={`https://www.youtube.com/watch?v=${track.youtube}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube ↗
          </a>
        </div>
      </div>
    </div>
  );
}
