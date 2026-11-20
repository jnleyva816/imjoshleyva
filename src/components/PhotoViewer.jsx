import { useCallback, useEffect, useRef, useState } from "react";
import { PhotoViewerContext } from "../lib/photoViewer";
import { canTransition, withTransition } from "../lib/viewTransition";
import Picture from "./ui/Picture";

const MORPH = "lightbox-photo";

function Lightbox({ photos, index, onClose, onStep }) {
  const photo = photos[index];
  const many = photos.length > 1;
  // Browsers with View Transitions morph the photo; the rest fade it (CSS,
  // and off under reduced motion).
  const fade = !canTransition;
  const dialog = useRef(null);
  const closeButton = useRef(null);

  // Move focus into the dialog while it's open and give it back on close.
  useEffect(() => {
    const previous = document.activeElement;
    closeButton.current?.focus({ preventScroll: true });
    return () => previous?.focus?.({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Tab") {
        const buttons = [...(dialog.current?.querySelectorAll("button") ?? [])];
        if (!buttons.length) return;
        const at = buttons.indexOf(document.activeElement);
        const next = event.shiftKey ? (at <= 0 ? buttons.length - 1 : at - 1) : (at + 1) % buttons.length;
        event.preventDefault();
        buttons[next].focus();
      }
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

  const image = (
    <Picture
      photo={photo}
      sizes="100vw"
      className="max-h-[80vh] w-auto max-w-full object-contain"
      style={canTransition ? { viewTransitionName: MORPH } : undefined}
      onClick={(event) => event.stopPropagation()}
    />
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper/95 p-4 backdrop-blur-sm sm:p-10 ${fade ? "fade-in" : ""}`}
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || photo.alt || "Photo"}
      onClick={onClose}
    >
      {fade ? (
        <div key={photo.src} className="swap-in">
          {image}
        </div>
      ) : (
        image
      )}
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
          <button ref={closeButton} type="button" className="hover:text-ink" onClick={onClose}>
            Close
          </button>
        </span>
      </div>
      {photo.exif ? (
        <p
          className="mt-3 flex max-w-3xl flex-wrap justify-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted/80"
          aria-label="Camera settings"
          onClick={(event) => event.stopPropagation()}
        >
          {[photo.exif.camera, photo.exif.lens, ...photo.exif.settings].filter(Boolean).map((part, i) => (
            <span key={part}>
              {i > 0 ? <span aria-hidden="true" className="mr-3">·</span> : null}
              {part}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}

function tag(element) {
  if (element) element.style.viewTransitionName = MORPH;
}

function untag(element) {
  if (element) element.style.viewTransitionName = "";
}

export default function PhotoViewer({ children }) {
  const [state, setState] = useState(null);
  const origin = useRef(null);
  const index = state?.index;

  // `from` is the thumbnail <img> that was clicked; the lightbox grows out of it.
  // Only one element may hold the transition name in each snapshot, so it
  // moves from the thumbnail to the lightbox inside the update.
  const open = useCallback((photos, index = 0, from = null) => {
    origin.current = { element: from, index };
    withTransition(
      () => {
        untag(from);
        setState({ photos, index });
      },
      { kind: "photo", before: () => tag(from) },
    );
  }, []);

  const close = useCallback(() => {
    const back = origin.current?.index === index ? origin.current.element : null;
    withTransition(
      () => {
        setState(null);
        tag(back);
      },
      { kind: "photo", after: () => untag(back) },
    );
  }, [index]);

  const step = useCallback((delta) => {
    withTransition(
      () =>
        setState((current) =>
          current
            ? {
                ...current,
                index: (current.index + delta + current.photos.length) % current.photos.length,
              }
            : current,
        ),
      { kind: "photo" },
    );
  }, []);

  const lightbox = state ? (
    <Lightbox photos={state.photos} index={state.index} onClose={close} onStep={step} />
  ) : null;

  return (
    <PhotoViewerContext.Provider value={open}>
      {children}
      {lightbox}
    </PhotoViewerContext.Provider>
  );
}
