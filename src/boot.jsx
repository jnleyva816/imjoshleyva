import "./lib/trustedTypes";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/figtree/wght.css";
import "@fontsource-variable/figtree/wght-italic.css";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./index.css";

/** Entry point shared by every HTML page (index, resume, project). */
export function mount(Page) {
  const root = document.getElementById("root");
  const page = (
    <StrictMode>
      <Page />
    </StrictMode>
  );
  // Built pages arrive pre-rendered; `vite dev` serves an empty #root.
  if (root.hasChildNodes()) hydrateRoot(root, page);
  else createRoot(root).render(page);
}
