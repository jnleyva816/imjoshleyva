import { useEffect, useRef, useState } from "react";
import site from "../content/site";
import useActiveSection from "../lib/useActiveSection";
import { homeHref, onHome } from "../lib/paths";
import ThemeToggle from "./ThemeToggle";
import { openCommandMenu, useShortcutLabel } from "../lib/commandMenu";

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shortcutLabel = useShortcutLabel();
  const mobileNav = useRef(null);

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

  // The menu is a native popover: the button opens it without any script,
  // and Escape or a click outside closes it and returns focus.
  const close = () => mobileNav.current?.hidePopover?.();
  const onToggle = (event) => {
    const isOpen = event.newState === "open";
    setOpen(isOpen);
    if (isOpen) mobileNav.current?.querySelector("a, button")?.focus();
  };

  return (
    <header
      className={`vt-header fixed inset-x-0 top-0 z-40 border-b transition-colors duration-200 ${
        open
          ? "border-line bg-paper"
          : scrolled
            ? "border-line bg-paper/90 backdrop-blur-md"
            : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href={onHome() ? "#top" : "/"} className="font-display text-lg tracking-tight text-ink">
          {site.name}
        </a>

        <nav className="relative hidden items-center gap-7 md:flex" aria-label="Primary">
          {site.nav.map((item) => (
            <a
              key={item.label}
              href={homeHref(item.href)}
              aria-current={isCurrent(item) ? "location" : undefined}
              className={`pb-0.5 text-sm transition-colors hover:text-ink ${
                isCurrent(item) ? "nav-current text-ink" : "text-muted"
              }`}
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={openCommandMenu}
            aria-label="Open command menu"
            aria-keyshortcuts="Control+K Meta+K"
            className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted transition-colors hover:border-moss hover:text-ink"
          >
            {shortcutLabel}
          </button>
          <ThemeToggle />
          {/* After the links: an anchor has to come before what it positions. */}
          <span aria-hidden="true" className="nav-bar pointer-events-none absolute h-px bg-moss" />
        </nav>

        <button
          type="button"
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted md:hidden"
          popoverTarget="mobile-nav"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <div aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-[-1px] h-px bg-moss/60" />

      <nav
        id="mobile-nav"
        ref={mobileNav}
        popover="auto"
        onToggle={onToggle}
        className="mobile-nav md:hidden"
        aria-label="Mobile"
      >
        <div className="flex flex-col gap-3">
          {site.nav.map((item) => (
            <a
              key={item.label}
              href={homeHref(item.href)}
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
          <button
            type="button"
            onClick={() => {
              close();
              openCommandMenu();
            }}
            className="w-fit text-left text-base text-ink"
          >
            Quick menu
          </button>
          <ThemeToggle className="w-fit pt-2" />
        </div>
      </nav>
    </header>
  );
}
