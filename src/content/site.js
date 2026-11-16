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
    { href: "https://jnleyvaphotos.vercel.app", label: "Photography", external: true },
  ],
  social: [
    { href: "https://github.com/jnleyva816", label: "GitHub" },
    {
      href: "https://www.linkedin.com/in/joshua-leyva-0b9942b6/",
      label: "LinkedIn",
    },
    { href: "https://leetcode.com/jleyva", label: "LeetCode" },
  ],
  audiences: [
    {
      id: "general",
      label: "General",
      copy: "I'm Josh. I work where software meets the people using it: production systems, customer problems, and fixes that have to be careful.",
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
      lede: "Two things I shipped and still stand behind.",
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
      title: "On the side",
      lede: "Practice problems, and a track I keep on while I work.",
    },
  },
};

export default site;
