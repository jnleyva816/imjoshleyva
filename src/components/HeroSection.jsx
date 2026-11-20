import { useRef, useState } from "react";
import profile from "../assets/profile_picture.jpg?w=384;640;864&format=avif;webp;jpg&as=picture";
import Picture from "./ui/Picture";
import site from "../content/site";
import { Sprig } from "./ui/Marks";
import RevealText from "./ui/RevealText";
import Photo from "./ui/Photo";
import LocalTime from "./ui/LocalTime";
import CopyEmail from "./ui/CopyEmail";
import { homeHref } from "../lib/paths";
import { photosFor } from "../lib/photos";

const heroPhoto = photosFor("hero")[0];

export default function HeroSection() {
  const [audienceId, setAudienceId] = useState(site.audiences[0].id);
  const audience =
    site.audiences.find((item) => item.id === audienceId) ?? site.audiences[0];
  const tabs = useRef(null);

  // Arrow keys, Home, and End move between tabs, as the ARIA tabs pattern expects.
  const onTabKey = (event) => {
    const ids = site.audiences.map((item) => item.id);
    const at = ids.indexOf(audience.id);
    const next = {
      ArrowRight: (at + 1) % ids.length,
      ArrowLeft: (at - 1 + ids.length) % ids.length,
      Home: 0,
      End: ids.length - 1,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setAudienceId(ids[next]);
    tabs.current?.querySelectorAll('[role="tab"]')[next]?.focus();
  };

  return (
    <section className="grid items-end gap-12 pb-16 pt-8 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-16">
      <div className="rise lg:col-span-7">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <span>{site.title}</span>
          <LocalTime />
        </p>
        <h1
          className="mt-4 w-fit font-display text-hero text-ink"
          style={{ viewTransitionName: "site-name" }}
        >
          {site.name}
        </h1>

        <div
          className="mt-8 flex flex-wrap gap-x-5 gap-y-2"
          role="tablist"
          aria-label="Introduction"
          ref={tabs}
          onKeyDown={onTabKey}
        >
          {site.audiences.map((item) => {
            const active = item.id === audience.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`intro-tab-${item.id}`}
                aria-selected={active}
                aria-controls="intro-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => setAudienceId(item.id)}
                className={`border-b pb-1 text-sm transition-colors ${
                  active
                    ? "border-moss text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div
          className="mt-6 max-w-xl"
          role="tabpanel"
          id="intro-panel"
          aria-labelledby={`intro-tab-${audience.id}`}
        >
          <RevealText
            key={audience.id}
            text={audience.copy}
            className="min-h-[5.5rem] text-lg leading-relaxed text-muted"
          />

          {/* Each audience gets its own next step: résumé, case studies, or photos. */}
          <div key={`links-${audience.id}`} className="swap-in mt-8 flex flex-wrap items-center gap-3">
            {audience.links.map((link, index) => {
              const external = /^https?:/.test(link.href);
              return (
                <a
                  key={link.href}
                  className={`btn ${index === 0 ? "btn-fill" : "btn-quiet"}`}
                  href={homeHref(link.href)}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {link.label}
                  {external ? <span aria-hidden="true">↗</span> : null}
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <a className="btn btn-quiet" href={`mailto:${site.email}`}>
            Email me
          </a>
          <CopyEmail />
        </div>

        <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted sm:gap-x-0">
          {site.social.map((item, index) => (
            <span key={item.label}>
              {index > 0 ? (
                <span className="mx-3 hidden text-muted sm:inline" aria-hidden="true">
                  ·
                </span>
              ) : null}
              <a
                className="text-link"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            </span>
          ))}
        </p>

        {site.now?.text ? (
          <p className="mt-8 max-w-xl border-l-2 border-moss/40 pl-4 text-[0.95rem] leading-relaxed text-muted">
            <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Now</span>
            {site.now.text}
            {site.now.updated ? (
              <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted/80">
                {site.now.updated}
              </span>
            ) : null}
          </p>
        ) : null}
      </div>

      <div className="rise lg:col-span-5" style={{ "--rise-delay": "120ms" }}>
        <div className="relative mx-auto w-full max-w-sm">
          <Sprig className="pointer-events-none absolute -left-14 -top-8 h-52 w-28 text-moss opacity-50" />
          <Picture
            photo={{ src: profile.img.src, sources: profile.sources, caption: "Joshua Leyva", alt: "Portrait of Joshua Leyva" }}
            sizes="(min-width: 1024px) 384px, (min-width: 640px) 384px, 90vw"
            fetchPriority="high"
            decoding="async"
            width="640"
            height="800"
            className="relative aspect-[4/5] w-full rounded-2xl border border-line object-cover shadow-[0_24px_50px_-32px_rgba(27,25,22,0.55)]"
          />
          {heroPhoto ? (
            <Photo
              photo={heroPhoto}
              className="absolute -bottom-10 -left-4 z-10 w-32 sm:-left-12 sm:w-40 lg:w-44"
              tilt={-5}
              caption={false}
              sizes="176px"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
