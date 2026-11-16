import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import photoCaptions from "../content/photos";
import { ease } from "../lib/motion";

const files = import.meta.glob(
  "../assets/photos/working/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" },
);

const workingPhotos = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, src]) => {
    const name = path.split("/").pop();
    return { name, src, caption: photoCaptions[name] ?? "" };
  });

function Lightbox({ index, onClose, onStep }) {
  const reduce = useReducedMotion();
  const photo = workingPhotos[index];

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onStep(1);
      if (event.key === "ArrowLeft") onStep(-1);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper/95 p-4 backdrop-blur-sm sm:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || "Photo"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={photo.src}
          src={photo.src}
          alt={photo.caption}
          className="max-h-[80vh] max-w-full object-contain"
          initial={reduce ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          onClick={(event) => event.stopPropagation()}
        />
      </AnimatePresence>
      <div
        className="mt-5 flex w-full max-w-3xl items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="hover:text-ink" onClick={() => onStep(-1)}>
          Prev
        </button>
        <span className="text-center normal-case tracking-normal">
          {photo.caption || `${index + 1} / ${workingPhotos.length}`}
        </span>
        <span className="flex gap-5">
          <button type="button" className="hover:text-ink" onClick={() => onStep(1)}>
            Next
          </button>
          <button type="button" className="hover:text-ink" onClick={onClose}>
            Close
          </button>
        </span>
      </div>
    </motion.div>
  );
}

export default function WorkingPhotos() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta) =>
      setOpen((current) =>
        current === null
          ? current
          : (current + delta + workingPhotos.length) % workingPhotos.length,
      ),
    [],
  );

  if (workingPhotos.length === 0) return null;

  return (
    <>
      <div className="-mx-5 mb-8 overflow-x-auto px-5 pb-12 pt-2 sm:-mx-8 sm:px-8 [scrollbar-width:thin]">
        <ul className="flex snap-x snap-mandatory items-end gap-6 md:gap-8">
          {workingPhotos.map((photo, index) => (
            <motion.li
              key={photo.name}
              className="shrink-0 snap-start"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease, delay: Math.min(index, 6) * 0.06 }}
            >
              <button
                type="button"
                onClick={() => setOpen(index)}
                className="group block text-left"
                aria-label={photo.caption ? `Open photo: ${photo.caption}` : `Open photo ${index + 1}`}
              >
                <motion.img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  className="h-64 w-auto max-w-[80vw] object-contain drop-shadow-[0_10px_14px_rgba(27,25,22,0.16)] md:h-80"
                  whileHover={reduce ? undefined : { y: -4 }}
                  transition={{ duration: 0.3, ease }}
                />
                {photo.caption ? (
                  <span className="mt-3 block max-w-[16rem] text-sm text-muted group-hover:text-ink">
                    {photo.caption}
                  </span>
                ) : null}
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {open !== null ? <Lightbox index={open} onClose={close} onStep={step} /> : null}
      </AnimatePresence>
    </>
  );
}
