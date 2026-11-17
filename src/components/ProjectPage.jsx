import Shell from "./Shell";
import CaseStudy from "./CaseStudy";
import projects from "../data/projectsData";
import { currentPath } from "../lib/paths";

const studies = projects.filter((project) => project.caseStudy);

export default function ProjectPage() {
  const slug = currentPath().replace(/\/+$/, "").split("/").pop();
  const project = studies.find((item) => item.slug === slug);

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
