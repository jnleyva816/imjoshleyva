/**
 * Projects on the home page. A project with a `caseStudy` also gets its own
 * page at /projects/<slug>.
 *
 * image  optional screenshot: { file, alt }, with the file in
 *        src/assets/projects. Shown on the card and atop the case study.
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
    id: 3,
    slug: "folio",
    title: "Folio",
    description:
      "Digital photo zines. Collect photos on a private board, sequence them into a full-bleed zine, and publish it. Each card flips over to show the camera settings or the Fujifilm film recipe behind the shot.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Stripe"],
    demo: "https://folio-digital-zine.app",
    github: "https://github.com/jnleyva816/Digital-Zine",
    image: {
      file: "folio.jpg",
      alt: "Folio's home page: the headline \"Your best photographs, bound into a zine\" beside a photo card flipped to show its camera settings and Fujifilm recipe",
    },
    category: "Web",
    year: "2026",
    status: "Live",
    caseStudy: {
      timeline: "November 2026 – present",
      role: "Solo: product, design, full stack",
      summary:
        "A place to turn a camera roll into a photo zine. Creators gather photos on a Vision Board, arrange them into pages, and publish a zine anyone can read, with the settings behind every photo one tap away.",
      why: [
        "I shoot Fujifilm, and half the fun is the film recipe: the in-camera settings that give a photo its look. Sharing photos online usually strips that away. I wanted a format where the photo and the recipe travel together.",
        "Zines are a good fit. They are small, sequenced, and personal, and a digital one can be published in minutes instead of printed.",
      ],
      features: [
        "A private Vision Board for collecting photos before they go anywhere",
        "A zine editor for sequencing photos into full-bleed pages",
        "A public page for each zine, where every card flips to show its EXIF or Fujifilm recipe",
        "Recipes read straight from Fujifilm maker notes in the photo file",
        "A free plan with one board and one zine, and a Pro plan with unlimited boards, unlimited zines, and PDF export",
        "Upload limits and board storage shown up front, before anything fails",
      ],
      how: [
        "Next.js 15 with the App Router and React 19, PostgreSQL through Prisma, and Auth.js for sign-in.",
        "Uploads go straight to S3-compatible storage through presigned URLs. A pg-boss worker turns each one into AVIF copies with sharp, then deletes the original.",
        "PDFs are rendered server-side with @react-pdf/renderer. Pro billing runs on Stripe subscriptions, with sales tax from Stripe Tax.",
      ],
      decisions: [
        {
          title: "Test-driven from the first commit",
          text: "Every feature starts with a failing test: Vitest for units, components, and API routes against a real Postgres, and Playwright for the browser. CI runs all of it on every pull request.",
        },
        {
          title: "Read the recipe from the file",
          text: "Fujifilm stores film simulation, grain, dynamic range, and white balance in its maker notes. Parsing those means creators don't retype settings their camera already recorded.",
        },
        {
          title: "Keep only what gets shown",
          text: "Originals are converted to AVIF and dropped, which keeps storage costs predictable and lets quotas stay generous.",
        },
      ],
    },
  },
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
    image: {
      file: "personal-site.jpg",
      alt: "This site's home page: name, audience tabs, intro copy, and a portrait over a faint plant wallpaper",
    },
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
