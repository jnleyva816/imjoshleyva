import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ease } from "../lib/motion";
import { Sprig } from "./ui/Marks";

const comparisons = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Newsreader:opsz,wght@6..72,500;6..72,600&family=Outfit:wght@400;500&display=swap";

const sentence = "Joshua Leyva builds software that has to hold up.";

function Sample({ kicker, verdict, children }) {
  const using = verdict === "Using";
  return (
    <article className="border-t border-line py-8">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{kicker}</p>
        <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${using ? "text-moss" : "text-muted"}`}>
          {verdict}
        </p>
      </div>
      {children}
    </article>
  );
}

function QuietMove() {
  const [run, setRun] = useState(0);

  return (
    <div>
      <button type="button" className="btn btn-quiet" onClick={() => setRun((value) => value + 1)}>
        Replay
      </button>
      <motion.p
        key={run}
        className="mt-4 font-display text-4xl tracking-tight text-ink"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
      >
        {sentence}
      </motion.p>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        One fade, twelve pixels, just over half a second. It runs once as you scroll. Nothing bounces, pulses, or spins.
      </p>
    </div>
  );
}

export default function DesignLab() {
  useEffect(() => {
    const id = "grove-comparison-fonts";
    if (document.getElementById(id)) return undefined;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = comparisons;
    document.head.appendChild(link);
    return undefined;
  }, []);

  return (
    <div className="pb-20 pt-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Design notes</p>
      <h1 className="mt-3 max-w-3xl font-display text-5xl tracking-[-0.03em] text-ink md:text-6xl">
        What to keep, and what was making it look generated.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
        The live site already uses the direction marked Using. These samples are the decision, not a second theme. Swap type or color in <span className="font-mono text-sm text-ink">src/index.css</span> and copy in <span className="font-mono text-sm text-ink">src/content/site.js</span>.
      </p>

      <section className="mt-16">
        <h2 className="font-display text-3xl tracking-tight text-ink">Type</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Inter was doing a lot of the “template” feeling. A serif is only for names and section titles. Body text stays a plain sans.
        </p>

        <Sample kicker="Fraunces + Figtree + IBM Plex Mono" verdict="Using">
          <p className="font-display text-4xl tracking-tight text-ink md:text-5xl">{sentence}</p>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted">
            Figtree for everything you read. Fraunces only when the words are a title. Plex Mono for dates and labels, never for paragraphs.
          </p>
        </Sample>

        <Sample kicker="Newsreader + Outfit" verdict="Close, skipped">
          <p style={{ fontFamily: '"Newsreader", Georgia, serif' }} className="text-4xl tracking-tight text-ink md:text-5xl">
            {sentence}
          </p>
          <p style={{ fontFamily: "Outfit, sans-serif" }} className="mt-3 max-w-xl text-lg leading-relaxed text-muted">
            Also editorial, and a little more like an agency homepage. Easy to overdo the serif. Outfit is clean, but it is everywhere in 2024 product marketing.
          </p>
        </Sample>

        <Sample kicker="Instrument Serif + Inter" verdict="Skip">
          <p style={{ fontFamily: '"Instrument Serif", Georgia, serif' }} className="text-4xl text-ink md:text-5xl">
            {sentence}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif" }} className="mt-3 max-w-xl text-lg leading-relaxed text-muted">
            Instrument Serif is handsome. Pairing it with Inter pulls the page straight back to the default generated look. Inter is retired.
          </p>
        </Sample>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl tracking-tight text-ink">Borders</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Edges should separate content. They should not be a decoration you notice before the words.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-line bg-raised p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Using</p>
            <p className="mt-3 font-display text-2xl text-ink">Hairline</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              One pixel, low contrast, small radius on photos only. Sections are rules, not cards.
            </p>
          </div>
          <div className="rounded-2xl border border-white/30 bg-white/10 p-5 shadow-xl backdrop-blur-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Skip</p>
            <p className="mt-3 text-2xl font-semibold text-ink">Glass</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Blur, translucent fill, and a white border on every block. This was the whole previous site.
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-emerald-500 p-[2px]">
            <div className="h-full rounded-[14px] bg-paper p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Skip</p>
              <p className="mt-3 bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-2xl font-bold text-transparent">
                Gradient frame
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Indigo-to-emerald text and borders. It reads as a starter prompt, not a person.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 text-moss">
          <Sprig className="h-16 w-10" />
          <div className="h-px flex-1 bg-line" />
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">One plant, not a pattern</p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl tracking-tight text-ink">Motion</h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss">Using</p>
            <QuietMove />
          </div>
          <div className="space-y-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Skip</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <span className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Pulsing dots between sections, a bouncing badge, and spinning rings around the portrait. They were running at the same time, so none of them felt intentional.
              </p>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              Hover no longer lifts entire cards. Links change color. Photos stay still. The theme control is a word in the nav, Light or Dark, instead of a floating sun button.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl tracking-tight text-ink">Tools</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-ink">Staying</h3>
            <ul className="mt-3 space-y-2 text-muted">
              <li>React and Vite. No framework migration.</li>
              <li>Tailwind v4, now pointed at CSS variables.</li>
              <li>Framer Motion, limited to the fade above.</li>
              <li>The existing resume, photos, LeetCode card, and SoundCloud embed.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-ink">Not adding</h3>
            <ul className="mt-3 space-y-2 text-muted">
              <li>GSAP, Lenis, Lottie, or Three.js. Smooth-scroll libraries make a one-page site feel like a template.</li>
              <li>A component kit. There is no form system to justify it.</li>
              <li>Particle leaves, animated vines, or a plant on every section.</li>
              <li>Skill percentages. A bar at 95% is a costume. Years are enough.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="font-display text-3xl tracking-tight text-ink">Where the old page was working</h2>
        <ul className="mt-4 max-w-2xl space-y-2 text-muted">
          <li>Real jobs, dates, and two real projects. That stays.</li>
          <li>Dark mode that remembers a choice. That stays, with calmer colors.</li>
          <li>The audience switcher is a good idea. It is now three lines of text, without emoji.</li>
          <li>Photography still has its own link.</li>
        </ul>
        <h2 className="mt-10 font-display text-3xl tracking-tight text-ink">Where it needed to change</h2>
        <ul className="mt-4 max-w-2xl space-y-2 text-muted">
          <li>Every heading was the same indigo-to-emerald gradient.</li>
          <li>Glass cards, blur, and hover-lift were applied to sections that are just text.</li>
          <li>Experience was a zigzag timeline. A dated list is easier to scan and easier to extend.</li>
          <li>Project filters offered Mobile, Desktop, and APIs when neither project is those things.</li>
          <li>Skills, education, and the hero each drew their own oversized heading, so titles repeated.</li>
          <li>A second stylesheet, App.css, fought Tailwind and was not imported. It is gone.</li>
        </ul>
      </section>
    </div>
  );
}
