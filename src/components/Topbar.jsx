import { useEffect, useState } from "react";
import site from "../content/site";
import ThemeToggle from "./ThemeToggle";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-200 ${
        open
          ? "border-line bg-paper"
          : scrolled
            ? "border-line bg-paper/90 backdrop-blur-md"
            : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="font-display text-lg tracking-tight text-ink">
          {site.name}
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {site.nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-ink"
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>

        <button
          type="button"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-line bg-paper px-5 py-4 md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-3">
            {site.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={close}
                className="text-base text-ink"
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {item.label}
              </a>
            ))}
            <ThemeToggle className="w-fit pt-2" />
          </div>
        </nav>
      ) : null}
    </header>
  );
}
