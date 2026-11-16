import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ease } from "../../lib/motion";
import { usePhotoViewer } from "../../lib/photoViewer";

/**
 * A framed photo shown uncropped. `drift` is how many pixels it travels
 * against the scroll; `tilt` is a resting rotation in degrees.
 * `group` is the set the lightbox steps through when this photo is opened.
 */
export default function Photo({
  photo,
  group = [photo],
  className = "",
  imgClassName = "",
  drift = 0,
  tilt = 0,
  delay = 0,
  caption = true,
}) {
  const reduce = useReducedMotion();
  const open = usePhotoViewer();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  const moving = !reduce && drift !== 0;

  return (
    <motion.div ref={ref} className={className} style={moving ? { y } : undefined}>
      <motion.figure
        initial={reduce ? false : { opacity: 0, y: 20, rotate: tilt * 0.4 }}
        whileInView={{ opacity: 1, y: 0, rotate: tilt }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease, delay }}
      >
        <motion.button
          type="button"
          onClick={() => open(group, Math.max(0, group.indexOf(photo)))}
          className="block w-full cursor-zoom-in"
          aria-label={photo.caption ? `Open photo: ${photo.caption}` : "Open photo"}
          whileHover={reduce ? undefined : { y: -4 }}
          transition={{ duration: 0.3, ease }}
        >
          <img
            src={photo.src}
            alt={photo.caption}
            loading="lazy"
            className={`block h-auto w-full object-contain drop-shadow-[0_10px_14px_rgba(27,25,22,0.16)] ${imgClassName}`}
          />
        </motion.button>
        {caption && photo.caption ? (
          <figcaption className="mt-3 text-sm text-muted">{photo.caption}</figcaption>
        ) : null}
      </motion.figure>
    </motion.div>
  );
}
