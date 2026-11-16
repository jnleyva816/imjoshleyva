import { flushSync } from "react-dom";

export const canTransition =
  typeof document !== "undefined" && typeof document.startViewTransition === "function";

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Runs a React state update inside a View Transition when the browser
 * supports it and the visitor hasn't asked for reduced motion.
 * `kind` is added to <html> as `vt-<kind>` for the duration, so CSS can
 * style each kind of transition separately.
 */
export function withTransition(update, { kind, before, after } = {}) {
  if (!canTransition || reducedMotion()) {
    update();
    return;
  }
  const root = document.documentElement;
  if (kind) root.classList.add(`vt-${kind}`);
  before?.();
  const transition = document.startViewTransition(() => flushSync(update));
  transition.finished.finally(() => {
    if (kind) root.classList.remove(`vt-${kind}`);
    after?.();
  });
}
