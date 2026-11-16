import { captions, placements } from "../content/photos";

const files = import.meta.glob(
  "../assets/photos/working/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" },
);

const spots = [
  ["hero", 1],
  ["work", 1],
  ["after-work", 2],
  ["education", 1],
  ["after-skills", 1],
];

const all = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([path, src]) => {
    const name = path.split("/").pop();
    return { name, src, caption: captions[name] ?? "" };
  });

const byName = new Map(all.map((photo) => [photo.name, photo]));
const pinned = new Set(Object.values(placements).flat());
const pool = all.filter((photo) => !pinned.has(photo.name));

const assigned = {};
for (const [spot, count] of spots) {
  assigned[spot] = placements[spot]
    ? placements[spot].map((name) => byName.get(name)).filter(Boolean)
    : pool.splice(0, count);
}
export function photosFor(spot) {
  return assigned[spot] ?? [];
}

export function allPhotos() {
  return all;
}
