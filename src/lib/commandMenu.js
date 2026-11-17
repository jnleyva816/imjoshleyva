import useHydrated from "./useHydrated";

export const OPEN_EVENT = "open-command-menu";

/** Opens the ⌘K menu from anywhere, e.g. the header button. */
export const openCommandMenu = () => window.dispatchEvent(new Event(OPEN_EVENT));

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);
export const shortcutLabel = isMac ? "⌘K" : "Ctrl K";

/** The label for pre-rendered markup, which can't know the visitor's OS. */
export function useShortcutLabel() {
  return useHydrated() ? shortcutLabel : "Ctrl K";
}
