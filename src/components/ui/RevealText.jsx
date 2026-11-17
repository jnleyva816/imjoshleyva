import { m, useReducedMotion } from "framer-motion";
import { ease } from "../../lib/motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const word = {
  hidden: { opacity: 0, y: "0.45em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export default function RevealText({ text, className = "", ...rest }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <p className={className} {...rest}>
        {text}
      </p>
    );
  }

  const words = text.split(" ");

  return (
    <m.p
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...rest}
    >
      <span className="sr-only">{text}</span>
      {words.map((item, index) => (
        <span key={`${item}-${index}`} aria-hidden="true">
          <m.span className="inline-block" variants={word}>
            {item}
          </m.span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </m.p>
  );
}
