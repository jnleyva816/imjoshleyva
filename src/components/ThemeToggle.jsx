import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink ${className}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? "Light" : "Dark"}
    </button>
  );
}
