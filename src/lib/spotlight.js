/**
 * Feeds the pointer position to the nearest `.spotlight` element as
 * --mx/--my, which index.css turns into a soft glow. One listener for the
 * whole page; does nothing on touch screens.
 */
export function trackSpotlight() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};

  let frame = 0;
  const onMove = (event) => {
    const card = event.target instanceof Element ? event.target.closest(".spotlight") : null;
    if (!card || frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left + 20}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  };

  document.addEventListener("pointermove", onMove, { passive: true });
  return () => {
    document.removeEventListener("pointermove", onMove);
    cancelAnimationFrame(frame);
  };
}
