import { lazy, Suspense, useEffect, useState } from "react";
import { OPEN_EVENT } from "../lib/commandMenu";

const CommandMenu = lazy(() => import("./CommandMenu"));

/**
 * Listens for ⌘K / Ctrl K and the header button, and only then downloads the
 * menu, so it costs nothing on first paint.
 */
export default function CommandMenuLoader() {
  const [wanted, setWanted] = useState(false);

  useEffect(() => {
    if (wanted) return undefined;
    const want = () => setWanted(true);
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        want();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, want);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, want);
    };
  }, [wanted]);

  return wanted ? (
    <Suspense fallback={null}>
      <CommandMenu startOpen />
    </Suspense>
  ) : null;
}
