import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "../../lib/motion";

export default function Section({ id, index, title, lede, children }) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id={id}
      className="border-t border-line py-16 md:py-24"
      variants={fadeUp(reduce)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className="mb-10 max-w-2xl md:mb-14">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {index}
        </p>
        <h2 className="font-display text-4xl tracking-[-0.03em] text-ink md:text-5xl">
          {title}
        </h2>
        {lede ? (
          <p className="mt-4 text-lg leading-relaxed text-muted">{lede}</p>
        ) : null}
      </div>
      {children}
    </motion.section>
  );
}
