import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import ResumePage from "./components/ResumePage";
import ProjectPage from "./components/ProjectPage";

export { pages, siteDigest, ORIGIN } from "./lib/seo";

const pageFor = (path) => (path === "/" ? App : path === "/resume" ? ResumePage : ProjectPage);

/** The markup for #root on `path`, used by scripts/prerender.mjs. */
export function render(path) {
  globalThis.__SSR_PATH__ = path;
  try {
    const Page = pageFor(path);
    return renderToString(
      <StrictMode>
        <Page />
      </StrictMode>,
    );
  } finally {
    delete globalThis.__SSR_PATH__;
  }
}
