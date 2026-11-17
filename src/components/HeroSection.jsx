import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import profile from "../assets/profile_picture.jpg?w=384;640;864&format=avif;webp;jpg&as=picture";
import Picture from "./ui/Picture";
import resume from "../assets/JoshuaLeyvaResume.pdf";
import site from "../content/site";
import { fadeUp } from "../lib/motion";
import { Sprig } from "./ui/Marks";
import RevealText from "./ui/RevealText";
import Photo from "./ui/Photo";
import { photosFor } from "../lib/photos";

const heroPhoto = photosFor("hero")[0];

export default function HeroSection() {
  const reduce = useReducedMotion();
  const [audienceId, setAudienceId] = useState(site.audiences[0].id);
  const audience =
    site.audiences.find((item) => item.id === audienceId) ?? site.audiences[0];

  return (
    <section className="grid items-end gap-12 pb-16 pt-8 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-16">
      <motion.div
        className="lg:col-span-7"
        variants={fadeUp(reduce)}
        initial="hidden"
        animate="visible"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {site.title}
        </p>
        <h1 className="mt-4 font-display text-[clamp(3.4rem,8vw,6rem)] leading-[0.92] tracking-[-0.035em] text-ink">
          {site.name}
        </h1>

        <div
          className="mt-8 flex flex-wrap gap-x-5 gap-y-2"
          role="tablist"
          aria-label="Introduction"
        >
          {site.audiences.map((item) => {
            const active = item.id === audience.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
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

        <div className="mt-6 min-h-[5.5rem] max-w-xl" role="tabpanel">
          <AnimatePresence mode="wait" initial={true}>
            <RevealText
              key={audience.id}
              text={audience.copy}
              className="text-lg leading-relaxed text-muted"
            />
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a className="btn btn-fill" href={resume} download="JoshuaLeyvaResume.pdf">
            Resume
          </a>
          <a className="btn btn-quiet" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>

        <p className="mt-8 text-sm text-muted">
          {site.social.map((item, index) => (
            <span key={item.label}>
              {index > 0 ? (
                <span className="mx-3 text-muted" aria-hidden="true">
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
      </motion.div>

      <motion.div
        className="lg:col-span-5"
        variants={fadeUp(reduce)}
        initial="hidden"
        animate="visible"
      >
        <div className="relative mx-auto w-full max-w-sm">
          <Sprig className="pointer-events-none absolute -left-14 -top-8 h-52 w-28 text-moss opacity-50" />
          <Picture
            photo={{ src: profile.img.src, sources: profile.sources, caption: "Joshua Leyva" }}
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
              delay={0.5}
              caption={false}
              sizes="176px"
            />
          ) : null}
        </div>
      </motion.div>
    </section>
  );
}
