import { useEffect, useLayoutEffect, useRef, useState } from "react";
import site from "../content/site";
import useActiveSection from "../lib/useActiveSection";
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

  const active = useActiveSection(
    site.nav.filter((item) => item.href.startsWith("#")).map((item) => item.href.slice(1)),
  );
  const isCurrent = (item) => item.href === `#${active}`;
  const navRef = useRef(null);
  const barRef = useRef(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const bar = barRef.current;
    if (!nav || !bar) return undefined;

    const place = () => {
      const link = nav.querySelector('a[aria-current="location"]');
      if (!link) {
        bar.style.opacity = "0";
        return;
      }
      const appearing = bar.style.opacity !== "1";
      bar.style.transitionProperty = appearing ? "opacity" : "transform, width, opacity";
      bar.style.transform = `translateX(${link.offsetLeft}px)`;
      bar.style.width = `${link.offsetWidth}px`;
      bar.style.top = `${link.offsetTop + link.offsetHeight}px`;
      bar.style.opacity = "1";
    };

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

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

        <nav ref={navRef} className="relative hidden items-center gap-7 md:flex" aria-label="Primary">
          <span
            ref={barRef}
            aria-hidden="true"
            className="nav-bar pointer-events-none absolute left-0 h-px bg-moss opacity-0"
          />
          {site.nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={isCurrent(item) ? "location" : undefined}
              className={`pb-0.5 text-sm transition-colors hover:text-ink ${
                isCurrent(item) ? "text-ink" : "text-muted"
              }`}
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
      <div aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-[-1px] h-px bg-moss/60" />

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
                aria-current={isCurrent(item) ? "location" : undefined}
                className={`w-fit border-b text-base text-ink ${
                  isCurrent(item) ? "border-moss" : "border-transparent"
                }`}
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
