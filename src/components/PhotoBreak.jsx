import Photo from "./ui/Photo";
import { photosFor } from "../lib/photos";

export default function PhotoBreak({ spot }) {
  const photos = photosFor(spot);
  if (photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <div className="border-t border-line py-16 md:py-24">
        <Photo photo={photos[0]} className="mx-auto max-w-3xl" drift={24} />
      </div>
    );
  }

  const [first, second, ...rest] = photos;
  const group = photos;

  return (
    <div className="border-t border-line py-16 md:py-24">
      <div className="grid grid-cols-12 items-start gap-6">
        <Photo
          photo={first}
          group={group}
          className="col-span-12 sm:col-span-7"
          drift={18}
          tilt={-1.5}
        />
        <Photo
          photo={second}
          group={group}
          className="col-span-9 col-start-4 sm:col-span-4 sm:col-start-9 sm:mt-24"
          drift={-28}
          tilt={2}
          delay={0.1}
        />
        {rest.map((photo, index) => (
          <Photo
            key={photo.name}
            photo={photo}
            group={group}
            className="col-span-6 sm:col-span-4"
            delay={0.1 * (index + 2)}
          />
        ))}
      </div>
    </div>
  );
}
