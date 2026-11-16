import { Suspense, useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ThemeProvider } from "./components/ThemeProvider";
import Topbar from "./components/Topbar";
import HeroSection from "./components/HeroSection";
import Section from "./components/ui/Section";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Skills from "./components/Skills";
import ProjectList, { Aside } from "./components/ProjectList";
import Footer from "./components/Footer";
import DesignLab from "./components/DesignLab";
import site from "./content/site";

const blocks = {
  work: <Experience />,
  projects: <ProjectList />,
  education: <Education />,
  skills: <Skills />,
  aside: (
    <Suspense fallback={<p className="text-sm text-muted">Loading.</p>}>
      <Aside />
    </Suspense>
  ),
};

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return hash;
}

export default function App() {
  const studio = useHash() === "#studio";

  return (
    <ThemeProvider>
      <div id="top" className="min-h-screen bg-paper text-ink">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-raised focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Topbar />
        <main id="content" className="mx-auto max-w-6xl px-5 pt-20 sm:px-8">
          {studio ? (
            <DesignLab />
          ) : (
            <>
              <HeroSection />
              {site.sectionOrder.map((key) => {
                const section = site.sections[key];
                if (!section || !blocks[key]) return null;
                return (
                  <Section
                    key={key}
                    id={section.id}
                    index={section.index}
                    title={section.title}
                    lede={section.lede}
                  >
                    {blocks[key]}
                  </Section>
                );
              })}
            </>
          )}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </div>
    </ThemeProvider>
  );
}
