// Runs before first paint so dark-mode visitors never see a light flash.
// Mirrors the logic in src/components/ThemeProvider.jsx.
(function () {
  try {
    var saved = localStorage.getItem("darkMode");
    var dark = saved !== null ? JSON.parse(saved) : matchMedia("(prefers-color-scheme: dark)").matches;
    if (!dark) return;
    document.documentElement.classList.add("dark");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", "#101412");
  } catch {
    /* storage can be blocked; fall back to the light theme */
  }
})();
