import { allPhotos } from "../lib/photos";
import { usePhotoViewer } from "../lib/photoViewer";
import site from "../content/site";

const SECONDS_PER_PHOTO = 6;

function Strip({ photos, hidden, onOpen }) {
  return (
    <ul className="flex shrink-0 items-center gap-6 pr-6 md:gap-8 md:pr-8" aria-hidden={hidden || undefined}>
      {photos.map((photo, index) => (
        <li key={photo.name} className="shrink-0">
          <button
            type="button"
            tabIndex={hidden ? -1 : undefined}
            onClick={() => onOpen(index)}
            className="block cursor-zoom-in"
            aria-label={photo.caption ? `Open photo: ${photo.caption}` : "Open photo"}
          >
            <img
              src={photo.src}
              alt={photo.caption}
              loading="lazy"
              decoding="async"
              className="h-56 w-auto max-w-none drop-shadow-[0_10px_14px_rgba(27,25,22,0.16)] md:h-72"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function PhotoCarousel() {
  const open = usePhotoViewer();
  const photos = allPhotos();
  if (photos.length === 0) return null;

  const onOpen = (index) => open(photos, index);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl text-ink">Recent frames</h3>
        <a className="text-link text-sm text-muted" href={site.photography} target="_blank" rel="noopener noreferrer">
          Full portfolio ↗
        </a>
      </div>
      <div
        className="marquee -mx-5 mt-6 overflow-hidden py-6 sm:-mx-8"
        style={{ "--marquee-duration": `${photos.length * SECONDS_PER_PHOTO}s` }}
      >
        <div className="marquee-track flex w-max">
          <Strip photos={photos} onOpen={onOpen} />
          <Strip photos={photos} hidden onOpen={onOpen} />
        </div>
      </div>
    </div>
  );
}
