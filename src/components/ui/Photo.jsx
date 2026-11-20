import { usePhotoViewer } from "../../lib/photoViewer";
import Picture from "./Picture";

/**
 * A framed photo shown uncropped. `drift` is how many pixels it travels
 * against the scroll; `tilt` is a resting rotation in degrees. Both, and the
 * unmasking entrance, are scroll-driven CSS (.drift and .unmask).
 * `group` is the set the lightbox steps through when this photo is opened.
 */
export default function Photo({
  photo,
  group = [photo],
  className = "",
  imgClassName = "",
  drift = 0,
  tilt = 0,
  caption = true,
  sizes = "(min-width: 768px) 720px, 100vw",
}) {
  const open = usePhotoViewer();
  const label = photo.caption || photo.alt;

  return (
    <div className={`${drift ? "drift" : ""} ${className}`} style={drift ? { "--drift": `${drift}px` } : undefined}>
      <figure className="unmask" style={tilt ? { "--tilt": `${tilt}deg` } : undefined}>
        <button
          type="button"
          onClick={(event) =>
            open(group, Math.max(0, group.indexOf(photo)), event.currentTarget.querySelector("img"))
          }
          className="lift block w-full cursor-zoom-in"
          aria-label={label ? `Open photo: ${label}` : "Open photo"}
        >
          <Picture
            photo={photo}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            className={`block h-auto w-full object-contain drop-shadow-[0_10px_14px_rgba(27,25,22,0.16)] ${imgClassName}`}
          />
        </button>
        {caption && photo.caption ? (
          <figcaption className="mt-3 text-sm text-muted">{photo.caption}</figcaption>
        ) : null}
      </figure>
    </div>
  );
}
