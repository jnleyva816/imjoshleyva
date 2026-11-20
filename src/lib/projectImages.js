/**
 * Project screenshots from src/assets/projects, resized at build time like the
 * photos. A project opts in with `image: { file, alt }` in projectsData.js;
 * the content check makes sure the file exists.
 */
const files = import.meta.glob("../assets/projects/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
  query: { w: "640;960;1440", format: "avif;webp;jpg", as: "picture" },
});

const byFile = Object.fromEntries(
  Object.entries(files).map(([path, picture]) => [path.split("/").pop(), picture]),
);

/** The project's screenshot in the shape <Picture> takes, or null. */
export function projectImage(project) {
  const picture = project.image && byFile[project.image.file];
  if (!picture) return null;
  return {
    src: picture.img.src,
    width: picture.img.w,
    height: picture.img.h,
    sources: picture.sources,
    alt: project.image.alt,
  };
}
