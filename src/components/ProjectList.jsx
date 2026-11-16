import { useMemo, useState } from "react";
import projectsData from "../data/projectsData";
import Project from "./Project";

const categoriesOf = (projects) => {
  const names = [...new Set(projects.map((project) => project.category).filter(Boolean))];
  return names.length > 1 ? ["All", ...names] : [];
};

export default function ProjectList() {
  const categories = useMemo(() => categoriesOf(projectsData), []);
  const [category, setCategory] = useState("All");

  const projects = projectsData.filter(
    (project) => category === "All" || project.category === category,
  );

  return (
    <div>
      {categories.length > 0 ? (
        <div className="mb-8 flex flex-wrap gap-x-5 gap-y-2" role="tablist" aria-label="Project categories">
          {categories.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={category === name}
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

      {projects.map((project) => (
        <Project key={project.id ?? project.title} project={project} />
      ))}
    </div>
  );
}
