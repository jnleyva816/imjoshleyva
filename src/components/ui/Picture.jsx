const types = {
  avif: "image/avif",
  webp: "image/webp",
  jpeg: "image/jpeg",
  png: "image/png",
};

/**
 * Renders a photo from lib/photos as <picture>, so browsers pick AVIF or
 * WebP at the right width. `sizes` is the rendered width of the image.
 */
export default function Picture({ photo, sizes, className = "", ...props }) {
  return (
    <picture className="contents">
      {Object.entries(photo.sources ?? {}).map(([format, srcSet]) => (
        <source key={format} type={types[format]} srcSet={srcSet} sizes={sizes} />
      ))}
      <img
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.caption}
        className={className}
        {...props}
      />
    </picture>
  );
}
