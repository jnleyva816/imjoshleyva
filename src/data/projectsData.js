import portfolioImage from "../assets/portfolio.jpg";
import jobTrackerImage from "../assets/nextmove_logo.png";

const projects = [
  {
    id: 1,
    title: "Personal site",
    description:
      "This page. Editorial layout, a single moss accent, and the copy kept in data files so a new job is a few lines, not a new component.",
    imageUrl: portfolioImage,
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
  {
    id: 2,
    title: "NextMove",
    description:
      "A job application tracker. Spring Boot and Postgres underneath, React on top, with auth, filters, and a small status dashboard.",
    imageUrl: jobTrackerImage,
    technologies: ["React", "Spring Boot", "PostgreSQL", "JWT"],
    demo: "https://job-application-tracker-docs.vercel.app",
    github: "https://github.com/jnleyva816/NextMove",
    category: "Web",
    year: "2025",
    status: "Shipped",
    longDescription:
      "NextMove is for keeping track of applications without a spreadsheet. The API is Spring Boot, the data is Postgres, and sign-in uses JWT. The interface is React.",
    features: [
      "Sign in with JWT",
      "Create, update, and filter applications",
      "Status dashboard",
      "Export to PDF and CSV",
      "Docker for the local stack",
    ],
  },
];

export default projects;
