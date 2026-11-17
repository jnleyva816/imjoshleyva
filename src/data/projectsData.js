/**
 * Projects on the home page. A project with a `caseStudy` also gets its own
 * page at /projects/<slug>.
 *
 * caseStudy sections are plain paragraphs or lists of short points:
 *   summary   one or two sentences, shown under the title
 *   why       what the project is for
 *   features  what it does, for someone using it
 *   how       how it works under the hood
 *   decisions choices worth explaining
 *   next      what's still open
 */
const projects = [
  {
    id: 2,
    slug: "tcg-inventory",
    title: "TCG inventory",
    description:
      "Inventory manager for my own Pokémon card collection. Scan a card's barcode to adjust stock, search instantly even with typos, print shelf labels, and keep everything in sync with Odoo.",
    technologies: ["Python", "FastAPI", "React", "Odoo", "Docker"],
    github: "https://github.com/jnleyva816/Odoo_TCG",
    category: "Web",
    year: "2026",
    status: "Personal use",
    caseStudy: {
      timeline: "January – March 2026",
      role: "Solo: design, backend, frontend, ML, deployment",
      summary:
        "A self-hosted system for tracking my Pokémon card collection: what I have, where it is, and what it's worth. Odoo holds the data; a fast React app on top makes the everyday work quick.",
      why: [
        "A collection spread across dozens of sets gets hard to track. I wanted to scan a card and have the count change, find any card in a second, and see prices without opening a spreadsheet.",
        "Odoo already does inventory, products, and logins well, but its screens are slow for scanning one card after another. So Odoo stays the source of truth, and this app is the fast front door to it.",
      ],
      features: [
        "Scan a barcode, or point the camera at a card, to adjust stock",
        "Typo-tolerant search across every card, as you type",
        "Shelf labels printed straight to a Brother QL label printer",
        "Prices synced from TCGplayer, with price history",
        "Whole sets imported from a single command",
        "Installs on a phone as an app, with an Android build too",
      ],
      how: [
        "React frontend, FastAPI backend, and Odoo behind both. Logins check against Odoo, and the backend issues short-lived JWTs, so there is no second user database to keep in sync.",
        "Meilisearch handles instant search, Redis handles caching and rate limiting, and Celery runs the slower jobs like price syncs.",
        "The camera scanner works in two steps: a YOLO model finds the card in the frame, then MobileNetV3 embeddings and a FAISS index find the closest match among known cards.",
        "It runs in Docker on my home server. A push to GitHub triggers a webhook that pulls and rebuilds the containers.",
      ],
      decisions: [
        {
          title: "Odoo as the source of truth",
          text: "Products, stock, and users live in one place. The app stays thin and can be rebuilt without migrating anything.",
        },
        {
          title: "Feature flags for every page",
          text: "Scanner, label printing, and the newer dashboards switch on with environment variables, so half-finished work ships without getting in the way.",
        },
        {
          title: "Production habits on a hobby project",
          text: "Security headers, rate limiting, audit logs, health checks, and CI with linting and tests. It is the same care I give production systems at work.",
        },
      ],
      next: [
        "A portfolio dashboard for collection value over time",
        "A public showcase of the collection",
        "Listing cards on eBay straight from inventory",
      ],
    },
  },
  {
    id: 1,
    slug: "personal-site",
    title: "Personal site",
    description:
      "This page. Editorial layout, a single moss accent, and the copy kept in data files so a new job is a few lines, not a new component.",
    technologies: ["React", "Tailwind", "Vite"],
    demo: "https://joshleyva.dev",
    github: "https://github.com/jnleyva816/imjoshleyva",
    category: "Web",
    year: "2026",
    status: "In progress",
    caseStudy: {
      timeline: "2025 – present",
      role: "Solo: design and build",
      summary:
        "The site you're on. A one-page portfolio that reads like a printed page, loads fast, and is tested like a product rather than a side project.",
      why: [
        "I wanted one place that shows the work, the person, and the photos, and that stays easy to update. A new job or project should be a few lines in a data file, not a new component.",
      ],
      features: [
        "Intro copy that changes for general visitors, hiring managers, and engineers",
        "Photos in AVIF and WebP at the right size for each screen, with a lightbox",
        "Light and dark themes, with a circular reveal when you switch",
        "A contact form that lands in my inbox",
        "A résumé PDF generated from the same data as the site",
        "A command menu: press Ctrl K or ⌘K anywhere",
      ],
      how: [
        "React 19 and Vite 8, styled with Tailwind v4 design tokens. Fonts are self-hosted, and photos are resized at build time.",
        "The contact form posts to a Vercel function that sends through Resend, with rate limiting and an optional Cloudflare Turnstile check.",
        "A strict Content-Security-Policy and the usual security headers are set in vercel.json and checked by a browser test.",
      ],
      decisions: [
        {
          title: "Content in data files",
          text: "Jobs, projects, skills, and copy live in plain JavaScript files that the components read. The résumé PDF is built from the same files, so the two never drift apart.",
        },
        {
          title: "Every change is checked",
          text: "Pull requests run lint, unit tests, Playwright tests on desktop and mobile, and Lighthouse. Main is protected, so nothing merges red.",
        },
        {
          title: "Motion that stays out of the way",
          text: "Animations are short and subtle, and all of them turn off for people who ask their system for reduced motion.",
        },
      ],
      next: ["Photo captions", "Longer write-ups on Substack"],
    },
  },
];

export default projects;
