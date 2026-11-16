import Photo from "./ui/Photo";
import { photosFor } from "../lib/photos";

export default function PhotoGallery() {
  const photos = photosFor("gallery");
  if (photos.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="font-display text-2xl text-ink">From the desk</h3>
      <div className="-mx-5 mt-6 overflow-x-auto px-5 pb-12 pt-2 sm:-mx-8 sm:px-8 [scrollbar-width:thin]">
        <ul className="flex snap-x snap-mandatory items-end gap-6 md:gap-8">
          {photos.map((photo, index) => (
            <li key={photo.name} className="shrink-0 snap-start">
              <Photo
                photo={photo}
                group={photos}
                imgClassName="!h-56 !w-auto max-w-[75vw] md:!h-72"
                delay={Math.min(index, 6) * 0.06}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
