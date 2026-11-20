import { useSyncExternalStore } from "react";

/*
 * Motion lives in CSS (src/index.css): scroll-driven entrances, the word
 * reveal, dialog transitions. This hook is for the one place JavaScript moves
 * things itself, the photo carousel.
 */

const query = "(prefers-reduced-motion: reduce)";

function subscribe(onChange) {
  const list = window.matchMedia(query);
  list.addEventListener("change", onChange);
  return () => list.removeEventListener("change", onChange);
}

/**
 * True when the visitor asked for reduced motion. The pre-rendered HTML and
 * the first client render both say false, so hydration matches; React then
 * re-renders with the real value.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
