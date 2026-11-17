import Shell from "./Shell";
import CaseStudy from "./CaseStudy";
import projects from "../data/projectsData";

const slug = window.location.pathname.replace(/\/+$/, "").split("/").pop();
const studies = projects.filter((project) => project.caseStudy);
const project = studies.find((item) => item.slug === slug);

function setMeta(name, content) {
  document.querySelector(`meta[name="${name}"]`)?.setAttribute("content", content);
  document.querySelector(`meta[property="og:${name}"]`)?.setAttribute("content", content);
}

if (project) {
  document.title = `${project.title} · Joshua Leyva`;
  setMeta("description", project.caseStudy.summary);
  setMeta("title", document.title);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", `https://joshleyva.dev/projects/${project.slug}`);
}

export default function ProjectPage() {
  return (
    <Shell>
      {project ? (
        <CaseStudy project={project} others={studies.filter((item) => item !== project)} />
      ) : (
        <div className="py-24">
          <h1 className="font-display text-5xl tracking-tight text-ink">No such project</h1>
          <p className="mt-4 text-lg text-muted">
            It may have moved.{" "}
            <a className="text-link" href="/#projects">
              See all projects
            </a>
            .
          </p>
        </div>
      )}
    </Shell>
  );
}

