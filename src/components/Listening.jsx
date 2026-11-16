import { useEffect, useRef, useState } from "react";
import site from "../content/site";

function clock(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Listening() {
  const track = site.music;
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = audio.current;
    if (!el) return undefined;
    const sync = () => {
      setPlaying(!el.paused);
      setTime(el.currentTime);
      setDuration(el.duration);
    };
    const events = ["play", "pause", "timeupdate", "loadedmetadata", "ended"];
    events.forEach((name) => el.addEventListener(name, sync));
    return () => events.forEach((name) => el.removeEventListener(name, sync));
  }, []);

  if (!track?.src) return null;

  const toggle = () => {
    const el = audio.current;
    if (el.paused) el.play();
    else el.pause();
  };

  return (
    <div>
      <h3 className="font-display text-2xl text-ink">Listening</h3>
      <p className="mt-2 text-sm text-muted">{track.note}</p>
      <div className="mt-4 flex items-center gap-4 rounded-md border border-line bg-raised p-4">
        <button
          type="button"
          onClick={toggle}
          className="btn btn-fill size-11 shrink-0 justify-center !p-0"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
              <rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
              <rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="size-4 translate-x-px" aria-hidden="true">
              <path d="M4 2.5v11a.5.5 0 0 0 .77.42l8.5-5.5a.5.5 0 0 0 0-.84l-8.5-5.5A.5.5 0 0 0 4 2.5Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-ink">{track.title}</p>
          <p className="truncate text-xs text-muted">{track.artist}</p>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step="any"
              value={time}
              onChange={(event) => {
                audio.current.currentTime = Number(event.target.value);
              }}
              className="h-1 flex-1 cursor-pointer accent-[var(--moss)]"
              aria-label="Seek"
            />
            <span className="font-mono text-[11px] tabular-nums text-muted">
              {clock(time)} / {clock(duration)}
            </span>
          </div>
        </div>
        <audio ref={audio} src={track.src} preload="none" loop />
      </div>
      {track.credit ? (
        <p className="mt-2 text-xs text-muted">
          {track.credit.href ? (
            <a className="text-link" href={track.credit.href} target="_blank" rel="noopener noreferrer">
              {track.credit.label}
            </a>
          ) : (
            track.credit.label
          )}
        </p>
      ) : null}
    </div>
  );
}
