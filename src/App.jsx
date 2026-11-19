import { useEffect } from "react";
import Shell from "./components/Shell";
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
import Lately from "./components/Lately";
import Contact from "./components/Contact";
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
      <Lately />
      <PhotoCarousel />
      <div className="max-w-xl">
        <Listening />
      </div>
    </div>
  ),
  contact: <Contact />,
};

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

// The browser tries to jump to /#skills before React has drawn #skills, so
// arriving from another page with a hash would otherwise land at the top.
function useScrollToHashOnLoad() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return undefined;
    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);
}

export default function App() {
  useScrollToHashOnLoad();

  return (
    <Shell>
      <HeroSection />
      {site.sectionOrder.map(renderBlock)}
    </Shell>
  );
}
