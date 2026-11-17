import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently crossing the reading line, a
 * band a little above the middle of the viewport. Ids that are not on the
 * page are ignored. Returns "" while the hero is in view.
 */
export default function useActiveSection(ids) {
  const [active, setActive] = useState("");
  const key = ids.join("|");

  useEffect(() => {
    const elements = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!elements.length || !("IntersectionObserver" in window)) return undefined;

    const visible = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = elements.find((element) => visible.has(element.id));
        setActive(current ? current.id : "");
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
