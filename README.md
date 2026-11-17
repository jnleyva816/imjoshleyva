<div align="center">

# Joshua Leyva

Senior Solutions Engineer at Cryptio. This is the source for my personal site.

[**joshleyva.dev**](https://joshleyva.dev) · [Photography](https://jnleyvaphotos.vercel.app) · [LinkedIn](https://www.linkedin.com/in/joshua-leyva-0b9942b6/)

![React 19](https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61dafb)
![Vite 8](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-0f172a?logo=tailwindcss&logoColor=38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-14-111?logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000?logo=vercel&logoColor=white)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshots/hero-dark.webp" />
  <img alt="Home page: name, role, audience tabs, portrait and a framed photo" src="docs/screenshots/hero-light.webp" width="900" />
</picture>

</div>

## What's on the page

- **An intro for each kind of visitor.** General, Hiring, and Engineering tabs change the hero copy.
- **Work, projects, education, skills.** All of it is data-driven, so updating the resume means editing one file.
- **Case studies.** Projects with a `caseStudy` in `src/data/projectsData.js` get their own page at `/projects/<slug>`: why, what it does, how it works, decisions, and what's next.
- **Résumé page.** `/resume` is the résumé as a web page that reads well on a phone, with the PDF one click away.
- **Command menu.** Ctrl K or ⌘K (or the button in the header) jumps to sections and pages, copies the email, switches the theme, and opens links. It downloads only when first opened.
- **A little live.** The hero shows my local time and a "Now" line (`now` in `src/content/site.js`). The About section shows my latest Substack posts and Strava running totals once there's something to show.
- **Photos throughout.** Framed shots sit between sections, an endless carousel shows every photo in the folder (it drifts on its own, and you can swipe or drag it), and a lightbox opens on click.
- **Off the clock.** Golf, running, music in Ableton, and the cats and dog, plus a jazz mix that loads only when someone presses play.
- **Contact form.** Messages go straight to my inbox through a Vercel function and Resend, with rate limiting, optional Turnstile, inline field errors, and a mailto fallback.
- **Light and dark.** Follows the system setting by default. The header toggle reveals the new theme in a circle using View Transitions.
- **Lightbox.** Photos grow out of the thumbnail you click, and Prev/Next morphs between them.
- **Plants behind the paper.** A monstera wallpaper (photo by Natalie Kovach on Unsplash) sits fixed behind a translucent page and slowly breathes. The veil strength is `--veil` in `src/index.css`.
- **Subtle motion.** Headings come into focus, photos unmask as they enter, the nav underline glides to the section you are reading, a hairline under the header tracks reading progress, link underlines draw in, and work and project rows glow under the cursor.
- **Motion that respects people.** Animations are tokenised, and `prefers-reduced-motion` turns them off.
- **Accessible by default.** Every photo has alt text (`alts` in `src/content/photos.js`), the nav marks the section you are reading, and Lighthouse accessibility is 100.
- **Installable and printable.** A favicon that follows dark mode, an Apple touch icon and web manifest, and a print view with no controls or photos and link URLs spelled out.
- **Design notes.** `/#studio` shows the type, border, and motion choices side by side.
- **Pre-rendered pages.** The build renders every page to HTML, so text and photos paint before any JavaScript loads and the site reads fine with JavaScript off. React then hydrates it.
- **Page-to-page motion.** Cross-document View Transitions keep the header still and morph a project's title into its case study heading. Hovering a link prerenders the next page (Speculation Rules), so most clicks open instantly.
- **Link previews.** Each page has its own title, description, preview image (`public/og/`, from `npm run og`), and schema.org data (Person, ProfilePage, SoftwareSourceCode, breadcrumbs).
- **For language models.** `/llms.txt` is the whole site as plain text, built from the same data.
- **Ask about me.** Type a question into the ⌘K menu and an AI answers from the site's content only. It stays hidden until an API key is set (see Environment).
- **Camera details.** The lightbox shows camera, lens, and exposure read from each photo's EXIF at build time, for photos exported with their metadata.

<table>
  <tr>
    <td width="50%"><img alt="Work section with promotion" src="docs/screenshots/work-light.webp" /></td>
    <td width="50%"><img alt="Off the clock section with photo carousel" src="docs/screenshots/about-light.webp" /></td>
  </tr>
  <tr>
    <td width="50%"><img alt="Contact form in dark mode" src="docs/screenshots/contact-dark.webp" /></td>
    <td width="50%" align="center">
      <img alt="Mobile, light" src="docs/screenshots/mobile-light.webp" width="45%" />
      <img alt="Mobile, dark" src="docs/screenshots/mobile-dark.webp" width="45%" />
    </td>
  </tr>
</table>

## Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 (pre-rendered at build time, then hydrated), Framer Motion, and View Transitions for pages, the lightbox, and the theme switch |
| Styling | Tailwind CSS v4 with CSS-variable design tokens (`@theme inline`) |
| Type | Fraunces (display), Figtree (body), IBM Plex Mono (labels), self-hosted through Fontsource |
| Build | Vite 8 (Rolldown) |
| Images | `vite-imagetools` turns each photo into AVIF, WebP, and JPEG at four widths |
| Hosting | Vercel: a static site, `api/` serverless functions, Analytics, and Speed Insights |
| Email | [Resend](https://resend.com) REST API, with no SDK |

## Running it locally

You need Node 22.12 or newer.

```bash
git clone git@github.com:jnleyva816/imjoshleyva.git
cd imjoshleyva
npm install
npm run dev        # http://localhost:5173
```

The dev server also serves the `api/` functions through a small Vite plugin, so they work locally if the env vars below are set. In dev every page renders in the browser; `npm run build` pre-renders `/`, `/resume`, and one file per case study, and Vercel serves them at clean URLs. Unknown paths get the 404 page.

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with the local API |
| `npm run build` | Production build into `dist/`, then a server build of `src/entry-server.jsx` that `scripts/prerender.mjs` uses to write each page's HTML, `llms.txt`, and `sitemap.xml` |
| `npm run preview` | Serves the production build |
| `npm run lint` | ESLint (flat config) |
| `npm run resume` | Rebuilds `src/assets/JoshuaLeyvaResume.pdf` from the same job, education, and skills data the site uses, plus `src/content/resume.js`. Needs Chromium (`CHROME=$(command -v chromium)` on NixOS). |
| `npm run og` | Rebuilds the link-preview images in `public/og/` for the résumé and case studies. Needs Chromium like `npm run resume`. |
| `npm test` | Unit tests for the API functions (Node's built-in test runner) |
| `npm run test:e2e` | Playwright smoke and CSP tests against the production build, desktop and mobile |
| `npx @lhci/cli autorun` | Lighthouse against the production build. CI fails below 90 for performance and best practices, and below 95 for accessibility and SEO (`lighthouserc.json`). |

On NixOS, point Playwright at a system Chromium with `CHROME=$(command -v chromium) npm run test:e2e`.

### Environment

Put these in `.env.local` for local work, and in Vercel under Settings → Environment Variables for Production and Preview.

| Variable | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | Resend API key |
| `CONTACT_TO_EMAIL` | yes | Inbox that receives messages |
| `CONTACT_FROM_EMAIL` | no | Defaults to `Portfolio <onboarding@resend.dev>`. Set it after verifying a domain in Resend. |
| `CONTACT_AUTOREPLY` | no | `true` sends senders a short fixed "got your message" reply. Needs `CONTACT_FROM_EMAIL` on a verified domain. |
| `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, `STRAVA_REFRESH_TOKEN` | no | Running totals in About. With Upstash set, a rotated refresh token is kept there. |
| `SUBSTACK_FEED_URL` | no | Defaults to `https://joshualeyva.substack.com/feed`. |
| `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` | no | Turns on "Ask about me" in the ⌘K menu. Anthropic wins if both are set. 10 questions per visitor an hour and 300 a day in total. |
| `ASK_MODEL` | no | Overrides the model: `claude-haiku-4-5` (Anthropic) or `gpt-5-mini` (OpenAI) by default. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | no | Global rate limits for the contact form, the assistant, and CSP reports. The `KV_REST_API_*` names from Vercel's Upstash integration work too. |
| `VITE_TURNSTILE_SITE_KEY` | no | Shows the Cloudflare Turnstile check on the form. It's read at build time. |
| `TURNSTILE_SECRET_KEY` | no | Makes the API require a valid Turnstile token. Set it together with the site key. |

Until a domain is verified, `onboarding@resend.dev` can only deliver to the address that owns the Resend account.

## Security

- **Headers.** `vercel.json` sets a strict Content-Security-Policy, HSTS, `nosniff`, `X-Frame-Options: DENY`, COOP, and a Permissions-Policy that only lets the YouTube embed autoplay. `e2e/csp.spec.js` fails if the page needs something the CSP blocks.
- **Trusted Types and reports.** Trusted Types are required in report-only mode; `src/lib/trustedTypes.js` lets only Vercel's and Turnstile's scripts through, and the tests run with them enforced. Violations post to `api/csp-report.js` and show up in the Vercel logs. Once the logs stay quiet, `require-trusted-types-for` can move into the enforced policy.
- **Contact form.** Same-origin check, honeypot, length limits, escaped HTML, and 5 messages per IP every 10 minutes. The limit is global with Upstash and per-instance without it. Turnstile verification is optional.
- **Privacy.** Fonts are self-hosted, and YouTube loads from `youtube-nocookie.com` only after someone presses play.
- **Upkeep.** Dependabot opens grouped weekly updates, and CI runs lint, unit tests, build, Playwright, and a Lighthouse check on every pull request.

## Editing content

Almost everything is plain data. You shouldn't need to touch components.

| What | Where |
| --- | --- |
| Hero intros, nav, section titles and order, About, music, social links | `src/content/site.js` |
| Jobs, projects and case studies, education, skills | `src/data/*.js` |
| The "Now" line and the clock's time zone | `now` and `timeZone` in `src/content/site.js` |
| Photos | Drop JPEGs into `src/assets/photos/working/`. Captions and order go in `src/content/photos.js`. |
| Portrait | `src/assets/profile_picture.jpg` |

New photos join the carousel automatically. The first few in the list also fill the framed spots between sections.

## Layout

```
.github/                CI workflow and Dependabot
api/
  contact.js            Vercel function: validation, rate limit, Turnstile, Resend call, auto-reply
  writing.js            Latest Substack posts, cached at the edge
  running.js            Strava running totals, cached at the edge
  ask.js                "Ask about me": answers from site content, rate limited
  csp-report.js         Receives CSP and Trusted Types violation reports
  _lib/guard.js         Shared rate limit, client IP, and same-origin check
docs/screenshots/       README images
e2e/                    Playwright smoke and CSP tests
index.html, resume.html, project.html   HTML templates; the build fills them in per page
public/                 Share images, favicon and app icons, manifest, 404 page, theme-init.js, robots.txt, speculation rules
scripts/                Pre-render, résumé PDF, preview images, EXIF plugin
src/
  App.jsx               Home: section order and the #studio route
  pages/                Entry points for /resume and /projects/<slug>
  entry-server.jsx      Renders a page to HTML for the pre-render step
  components/Shell.jsx  Theme, wallpaper, header, footer, and ⌘K around every page
  index.css             Tokens, light and dark themes, marquee, View Transitions
  components/           Hero, Experience, Projects, About, Contact, PhotoCarousel, ...
  content/              Site copy and photo metadata
  data/                 Resume data
  lib/                  Motion presets, photo loading, lightbox, theme, View Transitions, SEO data
tests/                  API unit tests
vercel.json             Security, reporting, and cache headers; clean URLs
vite.config.js          Image pipeline, EXIF, pages, the local /api middleware, and clean URLs
```

## Deploying

`main` deploys to production on Vercel at [joshleyva.dev](https://joshleyva.dev). Every pull request gets a preview deployment, and previews require Vercel Authentication.

### Updating the screenshots

Start the dev server, then capture with headless Chromium through Puppeteer at 1440×900 @2x and 390×844 @3x, in light and dark. Save them as WebP in `docs/screenshots/`.

---

<div align="center">

[joshleyva816@gmail.com](mailto:joshleyva816@gmail.com) · [GitHub](https://github.com/jnleyva816) · [LinkedIn](https://www.linkedin.com/in/joshua-leyva-0b9942b6/) · [Photography](https://jnleyvaphotos.vercel.app)

</div>
