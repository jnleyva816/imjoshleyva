import wall from "../assets/wallpaper/monstera.jpg?w=1280;1920&format=avif;webp;jpg&quality=50&as=picture";
import Picture from "./ui/Picture";

/**
 * Plants fixed behind the page. The page itself is painted in translucent
 * paper (.veil in index.css), so the leaves show through faintly.
 */
export default function Wallpaper() {
  return (
    <div className="wallpaper" aria-hidden="true">
      <Picture
        photo={{ src: wall.img.src, width: wall.img.w, height: wall.img.h, sources: wall.sources, alt: "" }}
        sizes="(orientation: portrait) 150vh, 100vw"
        decoding="async"
        fetchPriority="low"
        className="wallpaper-img"
      />
    </div>
  );
}
