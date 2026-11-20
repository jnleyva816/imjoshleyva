import { useMemo, useState } from "react";
import projectsData from "../data/projectsData";
import Project from "./Project";

const categoriesOf = (projects) => {
  const names = [...new Set(projects.map((project) => project.category).filter(Boolean))];
  return names.length > 1 ? ["All", ...names] : [];
};

/**
 * The category filter shows only when there's more than one category. It's a
 * set of toggle buttons (aria-pressed), not tabs: it filters one list in
 * place rather than switching between panels.
 */
export default function ProjectList() {
  const categories = useMemo(() => categoriesOf(projectsData), []);
  const [category, setCategory] = useState("All");

  const projects = projectsData.filter(
    (project) => category === "All" || project.category === category,
  );

  return (
    <div>
      {categories.length > 0 ? (
        <div className="mb-8 flex flex-wrap gap-x-5 gap-y-2" role="group" aria-label="Filter projects by category">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={category === name}
              aria-controls="project-list"
              onClick={() => setCategory(name)}
              className={`border-b pb-1 text-sm ${
                category === name
                  ? "border-moss text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      ) : null}

      <div id="project-list">
        {projects.map((project) => (
          <Project key={project.id ?? project.title} project={project} />
        ))}
      </div>
    </div>
  );
}
