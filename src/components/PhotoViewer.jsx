import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ease } from "../lib/motion";
import { PhotoViewerContext } from "../lib/photoViewer";

function Lightbox({ photos, index, onClose, onStep }) {
  const reduce = useReducedMotion();
  const photo = photos[index];
  const many = photos.length > 1;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (many && event.key === "ArrowRight") onStep(1);
      if (many && event.key === "ArrowLeft") onStep(-1);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [many, onClose, onStep]);

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
        {many ? (
          <button type="button" className="hover:text-ink" onClick={() => onStep(-1)}>
            Prev
          </button>
        ) : (
          <span />
        )}
        <span className="text-center normal-case tracking-normal">
          {photo.caption || (many ? `${index + 1} / ${photos.length}` : "")}
        </span>
        <span className="flex gap-5">
          {many ? (
            <button type="button" className="hover:text-ink" onClick={() => onStep(1)}>
              Next
            </button>
          ) : null}
          <button type="button" className="hover:text-ink" onClick={onClose}>
            Close
          </button>
        </span>
      </div>
    </motion.div>
  );
}

export default function PhotoViewer({ children }) {
  const [state, setState] = useState(null);

  const open = useCallback((photos, index = 0) => setState({ photos, index }), []);
  const close = useCallback(() => setState(null), []);
  const step = useCallback(
    (delta) =>
      setState((current) =>
        current
          ? {
              ...current,
              index: (current.index + delta + current.photos.length) % current.photos.length,
            }
          : current,
      ),
    [],
  );

  return (
    <PhotoViewerContext.Provider value={open}>
      {children}
      <AnimatePresence>
        {state ? (
          <Lightbox photos={state.photos} index={state.index} onClose={close} onStep={step} />
        ) : null}
      </AnimatePresence>
    </PhotoViewerContext.Provider>
  );
}
