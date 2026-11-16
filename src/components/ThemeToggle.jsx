import { useTheme } from "../lib/theme";

export default function ThemeToggle({ className = "" }) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        toggleTheme({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
      }}
      className={`font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink ${className}`}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? "Light" : "Dark"}
    </button>
  );
}
