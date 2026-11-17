import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { allPhotos } from "../lib/photos";
import { usePhotoViewer } from "../lib/photoViewer";
import site from "../content/site";
import Picture from "./ui/Picture";

const SECONDS_PER_PHOTO = 6;
const RESUME_AFTER_MS = 2200;
const DRAG_THRESHOLD = 6;
const COPIES = 3;

function widthAt(photo, desktopHeight, mobileHeight) {
  const ratio = photo.width / photo.height;
  return `(min-width: 768px) ${Math.round(desktopHeight * ratio)}px, ${Math.round(mobileHeight * ratio)}px`;
}

function Strip({ photos, hidden, onOpen }) {
  return (
    <ul className="flex shrink-0 items-center gap-6 pr-6 md:gap-8 md:pr-8" aria-hidden={hidden || undefined}>
      {photos.map((photo, index) => {
        const label = photo.caption || photo.alt;
        return (
        <li key={photo.name} className="shrink-0">
          <button
            type="button"
            tabIndex={hidden ? -1 : undefined}
            onClick={(event) => onOpen(index, event.currentTarget.querySelector("img"))}
            className="block cursor-zoom-in"
            aria-label={label ? `Open photo: ${label}` : "Open photo"}
          >
            <Picture
              photo={photo}
              sizes={widthAt(photo, 288, 224)}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-56 w-auto max-w-none select-none drop-shadow-[0_10px_14px_rgba(27,25,22,0.16)] md:h-72"
            />
          </button>
        </li>
        );
      })}
    </ul>
  );
}

/**
 * The strip is repeated COPIES times inside a normal scroll container.
 * It drifts on its own, and visitors can swipe, drag, or use the scroll
 * wheel. Scrolling is kept inside the middle copies so it loops both ways.
 */
function useAutoScroll(ref, { count, enabled }) {
  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return undefined;

    const first = node.querySelector("ul");
    let stripWidth = 0;
    let position = 0;
    let hovering = false;
    let focused = false;
    let resumeAt = 0;
    let last = performance.now();
    let frame = 0;

    const measure = () => {
      const was = stripWidth;
      stripWidth = first.getBoundingClientRect().width;
      if (!stripWidth) return;
      // Start in the middle copy so there is room to scroll left.
      position = was ? (position / was) * stripWidth : stripWidth;
      node.scrollLeft = position;
    };

    const wrap = () => {
      if (!stripWidth) return;
      if (node.scrollLeft < stripWidth * 0.5) node.scrollLeft += stripWidth;
      else if (node.scrollLeft >= stripWidth * 1.5) node.scrollLeft -= stripWidth;
      position = node.scrollLeft;
    };

    const hold = () => {
      resumeAt = performance.now() + RESUME_AFTER_MS;
    };

    const tick = (now) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const paused = hovering || focused || now < resumeAt || document.hidden;
      if (stripWidth && !paused) {
        const speed = stripWidth / (count * SECONDS_PER_PHOTO);
        position += speed * dt;
        node.scrollLeft = position;
      }
      wrap();
      frame = requestAnimationFrame(tick);
    };

    // Anything that moves the strip other than this loop: remember where it is.
    const onScroll = () => {
      if (Math.abs(node.scrollLeft - position) > 1.5) {
        position = node.scrollLeft;
        hold();
      }
    };
    const onEnter = (event) => {
      if (event.pointerType === "mouse") hovering = true;
    };
    const onLeave = (event) => {
      if (event.pointerType === "mouse") hovering = false;
    };
    const onFocusIn = () => (focused = true);
    const onFocusOut = () => (focused = false);

    // Mouse dragging; touch uses native scrolling.
    let drag = null;
    const onDown = (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag = { x: event.clientX, start: node.scrollLeft, moved: false };
    };
    const onMove = (event) => {
      if (!drag) return;
      const delta = event.clientX - drag.x;
      if (!drag.moved && Math.abs(delta) < DRAG_THRESHOLD) return;
      if (!drag.moved) {
        drag.moved = true;
        node.setPointerCapture(event.pointerId);
        node.dataset.dragging = "true";
      }
      node.scrollLeft = drag.start - delta;
      position = node.scrollLeft;
    };
    const onUp = (event) => {
      if (!drag) return;
      if (drag.moved) {
        node.releasePointerCapture?.(event.pointerId);
        hold();
        // A drag must not count as a click on the photo underneath.
        const swallow = (click) => click.stopPropagation();
        node.addEventListener("click", swallow, { capture: true, once: true });
        setTimeout(() => node.removeEventListener("click", swallow, { capture: true }), 0);
      }
      delete node.dataset.dragging;
      drag = null;
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(first);
    measure();
    frame = requestAnimationFrame(tick);

    node.addEventListener("scroll", onScroll, { passive: true });
    node.addEventListener("wheel", hold, { passive: true });
    node.addEventListener("touchstart", hold, { passive: true });
    node.addEventListener("touchmove", hold, { passive: true });
    node.addEventListener("pointerenter", onEnter);
    node.addEventListener("pointerleave", onLeave);
    node.addEventListener("focusin", onFocusIn);
    node.addEventListener("focusout", onFocusOut);
    node.addEventListener("pointerdown", onDown);
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerup", onUp);
    node.addEventListener("pointercancel", onUp);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      node.removeEventListener("scroll", onScroll);
      node.removeEventListener("wheel", hold);
      node.removeEventListener("touchstart", hold);
      node.removeEventListener("touchmove", hold);
      node.removeEventListener("pointerenter", onEnter);
      node.removeEventListener("pointerleave", onLeave);
      node.removeEventListener("focusin", onFocusIn);
      node.removeEventListener("focusout", onFocusOut);
      node.removeEventListener("pointerdown", onDown);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerup", onUp);
      node.removeEventListener("pointercancel", onUp);
    };
  }, [ref, count, enabled]);
}

export default function PhotoCarousel() {
  const open = usePhotoViewer();
  const reduce = useReducedMotion();
  const photos = allPhotos();
  const scroller = useRef(null);
  useAutoScroll(scroller, { count: photos.length, enabled: !reduce && photos.length > 0 });

  if (photos.length === 0) return null;

  const onOpen = (index, from) => open(photos, index, from);
  const copies = reduce ? 1 : COPIES;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl text-ink">Recent frames</h3>
        <a className="text-link text-sm text-muted" href={site.photography} target="_blank" rel="noopener noreferrer">
          Full portfolio ↗
        </a>
      </div>
      <div
        ref={scroller}
        className="marquee -mx-5 mt-6 flex cursor-grab overflow-x-auto overscroll-x-contain py-6 [scrollbar-width:none] data-[dragging=true]:cursor-grabbing sm:-mx-8 [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Photo carousel. Scroll sideways to browse."
        tabIndex={0}
      >
        {Array.from({ length: copies }, (_, copy) => (
          <Strip key={copy} photos={photos} hidden={copy > 0} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
