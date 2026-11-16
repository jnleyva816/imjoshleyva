/**
 * Copy, links, and section order.
 * Layout components read this file. Change wording and order here.
 */
const site = {
  name: "Joshua Leyva",
  title: "Senior Solutions Engineer at Cryptio",
  email: "joshleyva816@gmail.com",
  photography: "https://jnleyvaphotos.vercel.app",
  nav: [
    { href: "#work", label: "Work" },
    { href: "#projects", label: "Projects" },
    { href: "#education", label: "Education" },
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
    { href: "https://jnleyvaphotos.vercel.app", label: "Photography" },
  ],
  about: {
    paragraphs: [
      "I live in Florida with my wife, Wren, our cats Wasabi and Sabine, and Java, a French bulldog. All three show up in a lot of my photos.",
      "Florida means golf all year, and I'm training for races with a sub-3:30 marathon as the goal. When I'm not coding, I'm making music in Ableton Live.",
    ],
    facts: [
      { label: "Training for", value: "A sub-3:30 marathon" },
      { label: "On the course", value: "Year-round. It's Florida." },
      { label: "Making", value: "Music in Ableton Live" },
      { label: "Behind the camera", value: "Cars, plants, and a lot of Java, Wasabi, and Sabine" },
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
      id: "general",
      label: "General",
      copy: "I'm Josh. I work where software meets the people using it: production systems, customer problems, and fixes that have to be careful. Outside of work, I'm on a golf course, out on a training run, or taking photos of my dog.",
    },
    {
      id: "hiring",
      label: "Hiring",
      copy: "Senior Solutions Engineer at Cryptio, promoted from L2 support on its crypto accounting platform. Before that, a Rails migration at StartNoo and a few years at OPSWAT across support, internal tools, and test automation.",
    },
    {
      id: "engineering",
      label: "Engineering",
      copy: "Rails, React, Java, and a lot of SQL. I like the unglamorous parts: migrations, failing tests, and queries that do not surprise anyone later.",
    },
  ],
  // Keys starting with "photos:" are full-width photo breaks between sections.
  sectionOrder: [
    "work",
    "photos:after-work",
    "projects",
    "education",
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
    education: {
      id: "education",
      index: "03",
      title: "Education",
      lede: "Computer science at Florida Polytechnic, finished December 2023.",
    },
    skills: {
      id: "skills",
      index: "04",
      title: "Skills",
      lede: "Tools I actually reach for. Years, not percentages.",
    },
    aside: {
      id: "aside",
      index: "05",
      title: "Off the clock",
      lede: "Golf, running, music, and life at home.",
    },
    contact: {
      id: "contact",
      index: "06",
      title: "Contact",
      lede: "A role, a project, or a question about something on this page. It comes straight to my inbox, and I reply within a couple of days.",
    },
  },
};

export default site;
