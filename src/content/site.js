/**
 * Copy, links, and section order.
 * Layout components read this file. Change wording and order here.
 *
 * Your job title comes from the first entry in src/data/experienceData.js,
 * so a new role is one edit there.
 */
import experience from "../data/experienceData.js";

const [current] = experience;

const site = {
  name: "Joshua Leyva",
  role: current.role,
  company: current.company,
  title: `${current.role} at ${current.company}`,
  email: "joshleyva816@gmail.com",
  // Shown next to the title as a live clock.
  timeZone: { id: "America/New_York", place: "Florida" },
  // A line or two about what you're up to. Update `updated` when you edit it.
  now: {
    text: "Settling into the solutions engineer role at Cryptio and building mileage toward a sub-3:30 marathon.",
    updated: "November 2026",
  },
  photography: "https://jnleyvaphotos.vercel.app",
  nav: [
    { href: "#work", label: "Work" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#aside", label: "About" },
    { href: "#contact", label: "Contact" },
    { href: "https://jnleyvaphotos.vercel.app", label: "Photography", external: true },
  ],
  // Handled by api/contact.js, which needs RESEND_API_KEY and CONTACT_TO_EMAIL
  // set in the Vercel project.
  contact: {
    endpoint: "/api/contact",
  },
  social: [
    { href: "https://github.com/jnleyva816", label: "GitHub" },
    {
      href: "https://www.linkedin.com/in/joshua-leyva-0b9942b6/",
      label: "LinkedIn",
    },
    { href: "https://www.strava.com/athletes/147050581", label: "Strava" },
    { href: "https://substack.com/@joshualeyva", label: "Substack" },
    { href: "https://jnleyvaphotos.vercel.app", label: "Photography" },
  ],
  about: {
    paragraphs: [
      "I live in Florida with my wife, two cats, and a French bulldog. The pets show up in a lot of my photos.",
      "Florida means golf all year, and I'm training for races with a sub-3:30 marathon as the goal. When I'm not coding, I'm making music in Ableton Live.",
    ],
    facts: [
      { label: "Training for", value: "A sub-3:30 marathon" },
      { label: "Training log", value: "My runs on Strava", href: "https://www.strava.com/athletes/147050581" },
      { label: "On the course", value: "Year-round. It's Florida." },
      { label: "Making", value: "Music in Ableton Live" },
      { label: "Writing", value: "My Substack", href: "https://substack.com/@joshualeyva" },
      { label: "Behind the camera", value: "Cars, plants, and a lot of the pets" },
      { label: "In the mug", value: "Coffee, or tea" },
    ],
  },
  // YouTube video ID. The uploader must allow embedding; leave empty to hide.
  music: {
    youtube: "WdMDgpAD4XM",
    title: "low cortisol jazz for deep concentration",
    artist: "SILEO",
    note: "What's on while I work.",
  },
  audiences: [
    {
      id: "hiring",
      label: "Hiring",
      copy: "Senior Solutions Engineer at Cryptio, promoted from L2 support on its crypto accounting platform. Before that, a Rails migration at StartNoo and a few years at OPSWAT across support, internal tools, and test automation.",
      // The buttons under the intro change with the tab: one or two each.
      links: [
        { label: "Résumé", href: "/resume" },
        { label: "LinkedIn", href: "https://www.linkedin.com/in/joshua-leyva-0b9942b6/" },
      ],
    },
    {
      id: "engineering",
      label: "Engineering",
      copy: "Rails, React, Java, and a lot of SQL. I like the unglamorous parts: migrations, failing tests, and queries that do not surprise anyone later.",
      links: [
        { label: "Case studies", href: "#projects" },
        { label: "GitHub", href: "https://github.com/jnleyva816" },
      ],
    },
    {
      id: "general",
      label: "General",
      copy: "I'm Josh. I work where software meets the people using it: production systems, customer problems, and fixes that have to be careful. Outside of work, I'm on a golf course, out on a training run, or taking photos of my dog.",
      links: [
        { label: "Photos", href: "#aside" },
        { label: "Photography site", href: "https://jnleyvaphotos.vercel.app" },
      ],
    },
  ],
  // Keys starting with "photos:" are full-width photo breaks between sections.
  sectionOrder: [
    "work",
    "photos:after-work",
    "projects",
    "skills",
    "photos:after-skills",
    "aside",
    "contact",
  ],
  sections: {
    work: {
      id: "work",
      index: "01",
      title: "Work",
      lede: "Solutions engineering now, after production support at the same company. Product engineering and cybersecurity tooling before that.",
    },
    projects: {
      id: "projects",
      index: "02",
      title: "Projects",
      lede: "Things I've built and still stand behind.",
    },
    skills: {
      id: "skills",
      index: "03",
      title: "Skills & education",
      lede: "Tools I actually reach for, in years rather than percentages, and the degree behind them.",
    },
    aside: {
      id: "aside",
      index: "04",
      title: "Off the clock",
      lede: "Golf, running, music, and life at home.",
    },
    contact: {
      id: "contact",
      index: "05",
      title: "Contact",
      lede: "A role, a project, or a question about something on this page. It comes straight to my inbox, and I reply within a couple of days.",
    },
  },
};

export default site;
