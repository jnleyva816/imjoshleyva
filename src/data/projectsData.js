const projects = [
  {
    id: 1,
    title: "Personal site",
    description:
      "This page. Editorial layout, a single moss accent, and the copy kept in data files so a new job is a few lines, not a new component.",
    technologies: ["React", "Tailwind", "Vite"],
    demo: "https://imjoshleyva.vercel.app",
    github: "https://github.com/jnleyva816/imjoshleyva",
    category: "Web",
    year: "2026",
    status: "In progress",
    longDescription:
      "A rewrite of the old glass portfolio. Motion is a short fade. Color and type live in CSS variables. Section order and the three introductions live in one content file.",
    features: [
      "Copy, navigation, and section order in src/content/site.js",
      "Theme tokens in src/index.css",
      "Dark mode that follows the system until you pick one",
      "Project details in a dialog",
    ],
  },
];

export default projects;
