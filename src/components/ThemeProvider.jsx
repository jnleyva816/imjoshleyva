import { useEffect, useSyncExternalStore } from "react";
import { ThemeContext } from "../lib/theme";
import { withTransition } from "../lib/viewTransition";

// public/theme-init.js sets the "dark" class before first paint, so the class
// on <html> is the source of truth and React just follows it.
const root = () => document.documentElement;
const readDark = () => root().classList.contains("dark");

function subscribe(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function applyTheme(dark) {
  root().classList.toggle("dark", dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#101412" : "#f4f0e8");
}

export const ThemeProvider = ({ children }) => {
  const isDarkMode = useSyncExternalStore(subscribe, readDark, () => false);

  // `origin` is the {x, y} the new theme spreads out from.
  const toggleTheme = (origin) => {
    withTransition(
      () => {
        const next = !readDark();
        try {
          localStorage.setItem("darkMode", JSON.stringify(next));
        } catch {
          /* storage can be blocked; the theme still switches for this visit */
        }
        applyTheme(next);
      },
      {
        kind: "theme",
        before: () => {
          root().style.setProperty("--vt-x", `${origin?.x ?? window.innerWidth}px`);
          root().style.setProperty("--vt-y", `${origin?.y ?? 0}px`);
        },
      },
    );
  };

  // Follow the OS setting until the visitor picks a theme themselves.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      let saved = null;
      try {
        saved = localStorage.getItem("darkMode");
      } catch {
        /* blocked storage: keep following the OS */
      }
      if (saved === null) applyTheme(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext.Provider>;
};
