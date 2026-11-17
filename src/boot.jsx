import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/figtree/wght.css";
import "@fontsource-variable/figtree/wght-italic.css";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./index.css";

/** Entry point shared by every HTML page (index, resume, project). */
export function mount(Page) {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <Page />
    </StrictMode>,
  );
}
