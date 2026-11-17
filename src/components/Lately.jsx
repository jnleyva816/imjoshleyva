import { useEffect, useState } from "react";
import site from "../content/site";

const label = "font-mono text-[11px] uppercase tracking-[0.16em] text-muted";
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

const strava = site.social.find((item) => item.label === "Strava")?.href;
const substack = site.social.find((item) => item.label === "Substack")?.href;

async function load(path) {
  try {
    const response = await fetch(path, { headers: { Accept: "application/json" } });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}

/**
 * Latest Substack posts and Strava running totals, from api/writing.js and
 * api/running.js. Each half hides itself until it has something to show.
 */
export default function Lately() {
  const [posts, setPosts] = useState([]);
  const [running, setRunning] = useState(null);

  useEffect(() => {
    let live = true;
    load("/api/writing").then((data) => live && setPosts(data?.posts ?? []));
    load("/api/running").then((data) => live && setRunning(data?.recent?.runs ? data : null));
    return () => {
      live = false;
    };
  }, []);

  if (!posts.length && !running) return null;

  return (
    <div className="grid gap-10 sm:grid-cols-2" aria-live="polite">
      {posts.length ? (
        <div>
          <p className={label}>Latest writing</p>
          <ul className="mt-4 space-y-3">
            {posts.map((post) => (
              <li key={post.url}>
                <a className="text-link text-ink" href={post.url} target="_blank" rel="noopener noreferrer">
                  {post.title}
                </a>
                {post.date ? (
                  <span className="ml-2 font-mono text-[11px] text-muted">
                    {dateFormat.format(new Date(post.date))}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
          {substack ? (
            <a className="text-link mt-4 inline-block text-sm text-muted" href={substack} target="_blank" rel="noopener noreferrer">
              All posts ↗
            </a>
          ) : null}
        </div>
      ) : null}

      {running ? (
        <div>
          <p className={label}>Running, last 4 weeks</p>
          <p className="mt-4 font-display text-4xl tracking-tight text-ink">
            {number.format(running.recent.miles)} <span className="text-2xl text-muted">mi</span>
          </p>
          <p className="mt-1 text-muted">
            {running.recent.runs} runs · {number.format(running.recent.hours)} hours
            {running.year?.miles ? ` · ${number.format(running.year.miles)} mi this year` : ""}
          </p>
          {strava ? (
            <a className="text-link mt-4 inline-block text-sm text-muted" href={strava} target="_blank" rel="noopener noreferrer">
              On Strava ↗
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
