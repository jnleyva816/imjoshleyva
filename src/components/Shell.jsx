import { useEffect } from "react";
import { ThemeProvider } from "./ThemeProvider";
import PhotoViewer from "./PhotoViewer";
import Topbar from "./Topbar";
import Footer from "./Footer";
import Wallpaper from "./Wallpaper";
import Telemetry from "./Telemetry";
import CommandMenuLoader from "./CommandMenuLoader";
import { trackSpotlight } from "../lib/spotlight";

/** Everything around the content: theme, wallpaper, header, footer, ⌘K. */
export default function Shell({ children }) {
  useEffect(() => trackSpotlight(), []);

  return (
    <ThemeProvider>
      <PhotoViewer>
        <Wallpaper />
        <div id="top" className="veil min-h-screen text-ink">
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-raised focus:px-3 focus:py-2"
          >
            Skip to content
          </a>
          <Topbar />
          <main id="content" className="mx-auto max-w-6xl px-5 pt-20 sm:px-8">
            {children}
          </main>
          <Footer />
          <CommandMenuLoader />
          <Telemetry />
        </div>
      </PhotoViewer>
    </ThemeProvider>
  );
}
