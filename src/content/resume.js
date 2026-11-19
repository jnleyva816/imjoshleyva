/**
 * Resume-only copy. Jobs, education, and skills come from src/data/*, the
 * same files the site uses. Run `npm run resume` after changing anything.
 */
const resume = {
  name: "Joshua N. Leyva",
  headline: "Senior Solutions Engineer",
  contact: [
    "joshleyva816@gmail.com",
    "joshleyva.dev",
    "linkedin.com/in/joshua-leyva-0b9942b6",
    "github.com/jnleyva816",
  ],
  summary:
    "Solutions engineer with a software background. I work on production systems and customer problems: querying production data with SQL, explaining what broke, and shipping careful fixes. Earlier, full-stack development and QA on cybersecurity software.",
  projects: [
    {
      name: "Folio",
      link: "github.com/jnleyva816/Digital-Zine",
      text: "Digital photo zines built with Next.js, PostgreSQL, and Stripe. Photos flip to show their EXIF or Fujifilm film recipe, read from the camera's maker notes. Built test-first with Vitest and Playwright.",
    },
    {
      name: "TCG inventory",
      link: "github.com/jnleyva816/Odoo_TCG",
      text: "Inventory manager for a personal Pokémon card collection, built with FastAPI, React, and Odoo. Scan a barcode to adjust stock, search with typo tolerance, print shelf labels, and sync with Odoo.",
    },
    {
      name: "Personal site",
      link: "joshleyva.dev",
      text: "React, Tailwind, and Vite, with a Vercel function and Resend for the contact form. CI runs lint, unit, browser, and Lighthouse checks.",
    },
    {
      name: "Google Maps Lead Scraper",
      link: "",
      text: "Rust tool that scrapes Google Maps for keywords and extracts business information for lead generation, with automated email generation and sending.",
    },
  ],
  educationNote: "Dean's List, multiple semesters. Top 10% of the class. Capstone recognized for outstanding achievement. Innovation award for best AI project.",
};

export default resume;
