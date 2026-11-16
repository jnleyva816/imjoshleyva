import { Suspense, lazy, useMemo, useState } from "react";
import projectsData from "../data/projectsData";
import Project from "./Project";

const LeetCode = lazy(() => import("./LeetCode_heatmap"));
const MusicPlayer = lazy(() => import("./Music-Player"));

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

export function Aside() {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <h3 className="font-display text-2xl text-ink">LeetCode</h3>
        <p className="mt-2 text-sm text-muted">jleyva</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-raised p-3">
          <Suspense fallback={<p className="text-sm text-muted">Loading practice graph.</p>}>
            <LeetCode />
          </Suspense>
        </div>
      </div>
      <div>
        <h3 className="font-display text-2xl text-ink">Listening</h3>
        <p className="mt-2 text-sm text-muted">A lo-fi loop. It stays off until you press play.</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-line bg-raised">
          <Suspense fallback={<p className="p-4 text-sm text-muted">Loading player.</p>}>
            <MusicPlayer />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
