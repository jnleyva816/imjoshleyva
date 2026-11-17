import { useEffect, useState } from "react";
import wall from "../assets/wallpaper/monstera.jpg?w=1280;1920&format=avif;webp;jpg&quality=50&as=picture";
import Picture from "./ui/Picture";

/** Waits for the page to finish loading and the browser to be idle. */
function useAfterLoad() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idle;
    const start = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
        : window.setTimeout(() => setReady(true), 200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
    };
  }, []);

  return ready;
}

/**
 * Plants fixed behind the page. The page itself is painted in translucent
 * paper (.veil in index.css), so the leaves show through faintly. Loaded
 * after everything else so it never competes with the content, then faded in.
 */
export default function Wallpaper() {
  const ready = useAfterLoad();
  const [shown, setShown] = useState(false);

  return (
    <div className="wallpaper" aria-hidden="true">
      {ready ? (
        <Picture
          photo={{ src: wall.img.src, width: wall.img.w, height: wall.img.h, sources: wall.sources, alt: "" }}
          sizes="(orientation: portrait) 150vh, 100vw"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setShown(true)}
          className={`wallpaper-img ${shown ? "is-shown" : ""}`}
        />
      ) : null}
    </div>
  );
}
