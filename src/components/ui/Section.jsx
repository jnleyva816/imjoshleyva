import Photo from "./Photo";

export default function Section({ id, index, title, lede, photo, children }) {
  return (
    <section id={id} className="reveal border-t border-line py-16 md:py-24">
      <div
        className={`mb-10 md:mb-14 ${
          photo ? "grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16" : ""
        }`}
      >
        <div className="reveal-blur max-w-2xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {index}
          </p>
          <h2 className="font-display text-4xl tracking-[-0.03em] text-ink md:text-5xl">
            {title}
          </h2>
          {lede ? (
            <p className="mt-4 text-lg leading-relaxed text-muted">{lede}</p>
          ) : null}
        </div>
        {photo ? (
          <Photo
            photo={photo}
            className="w-44 justify-self-end sm:w-52 md:w-60"
            drift={20}
            tilt={2.5}
            caption={false}
            sizes="240px"
          />
        ) : null}
      </div>
      {children}
    </section>
  );
}
