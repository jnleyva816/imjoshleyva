// Vite plugin: `import exif from "virtual:photo-exif"` gives each working
// photo's camera settings, read from the original file at build time (the
// served copies have their metadata stripped). Photos without EXIF are left
// out, so the lightbox shows nothing for them.
import fs from "node:fs/promises";
import path from "node:path";
import exifr from "exifr";

const ID = "virtual:photo-exif";
const RESOLVED = `\0${ID}`;
const PICK = ["Make", "Model", "LensModel", "FocalLength", "FNumber", "ExposureTime", "ISO"];

const trim = (value) => (typeof value === "string" ? value.replace(/\0/g, "").trim() : "");

function shutter(seconds) {
  if (!seconds) return "";
  return seconds >= 1 ? `${Number(seconds.toFixed(1))}s` : `1/${Math.round(1 / seconds)}s`;
}

/** "FUJIFILM X-T5 · XF33mmF1.4 R LM WR · 33mm · ƒ/2 · 1/250s · ISO 400" in parts. */
export function describeExif(tags = {}) {
  const make = trim(tags.Make);
  const model = trim(tags.Model);
  const camera = model.toLowerCase().startsWith(make.toLowerCase()) ? model : [make, model].filter(Boolean).join(" ");
  const settings = [
    tags.FocalLength ? `${Math.round(tags.FocalLength)}mm` : "",
    tags.FNumber ? `ƒ/${Number(tags.FNumber.toFixed(1))}` : "",
    shutter(tags.ExposureTime),
    tags.ISO ? `ISO ${tags.ISO}` : "",
  ].filter(Boolean);
  const parts = { camera, lens: trim(tags.LensModel), settings };
  return camera || settings.length ? parts : null;
}

export default function photoExif({ dir }) {
  return {
    name: "photo-exif",
    resolveId(id) {
      return id === ID ? RESOLVED : null;
    },
    async load(id) {
      if (id !== RESOLVED) return null;
      const folder = path.resolve(dir);
      this.addWatchFile(folder);
      const entries = {};
      for (const name of (await fs.readdir(folder)).sort()) {
        if (!/\.(jpe?g|tiff?|heic|png|webp|avif)$/i.test(name)) continue;
        const tags = await exifr.parse(path.join(folder, name), { pick: PICK }).catch(() => null);
        const described = tags && describeExif(tags);
        if (described) entries[name] = described;
      }
      return `export default ${JSON.stringify(entries)};`;
    },
  };
}
