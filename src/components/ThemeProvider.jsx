import { useEffect, useLayoutEffect, useState } from "react";
import { ThemeContext } from "../lib/theme";
import { withTransition } from "../lib/viewTransition";

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // `origin` is the {x, y} the new theme spreads out from.
  const toggleTheme = (origin) => {
    const root = document.documentElement;
    withTransition(
      () =>
        setIsDarkMode((prev) => {
          const newMode = !prev;
          localStorage.setItem('darkMode', JSON.stringify(newMode));
          return newMode;
        }),
      {
        kind: "theme",
        before: () => {
          root.style.setProperty("--vt-x", `${origin?.x ?? window.innerWidth}px`);
          root.style.setProperty("--vt-y", `${origin?.y ?? 0}px`);
        },
      },
    );
  };

  // Layout effect so the class lands inside the View Transition's update.
  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDarkMode ? "#101412" : "#f4f0e8");
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const saved = localStorage.getItem('darkMode');
      if (saved === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
