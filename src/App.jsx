import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ThemeProvider } from "./components/ThemeProvider";
import PhotoViewer from "./components/PhotoViewer";
import Topbar from "./components/Topbar";
import HeroSection from "./components/HeroSection";
import Section from "./components/ui/Section";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Skills from "./components/Skills";
import ProjectList from "./components/ProjectList";
import PhotoBreak from "./components/PhotoBreak";
import PhotoCarousel from "./components/PhotoCarousel";
import Listening from "./components/Listening";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import DesignLab from "./components/DesignLab";
import site from "./content/site";
import { photosFor } from "./lib/photos";

const blocks = {
  work: <Experience />,
  projects: <ProjectList />,
  education: <Education />,
  skills: <Skills />,
  aside: (
    <div className="space-y-14">
      <About />
      <PhotoCarousel />
      <div className="max-w-xl">
        <Listening />
      </div>
    </div>
  ),
  contact: <Contact />,
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

function renderBlock(key) {
  if (key.startsWith("photos:")) {
    const spot = key.slice("photos:".length);
    return <PhotoBreak key={key} spot={spot} />;
  }

  const section = site.sections[key];
  if (!section || !blocks[key]) return null;

  return (
    <Section
      key={key}
      id={section.id}
      index={section.index}
      title={section.title}
      lede={section.lede}
      photo={photosFor(key)[0]}
    >
      {blocks[key]}
    </Section>
  );
}

export default function App() {
  const studio = useHash() === "#studio";

  return (
    <ThemeProvider>
      <PhotoViewer>
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
                {site.sectionOrder.map(renderBlock)}
              </>
            )}
          </main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </div>
      </PhotoViewer>
    </ThemeProvider>
  );
}
