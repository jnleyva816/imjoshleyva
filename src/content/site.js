/**
 * Copy, links, and section order.
 * Layout components read this file. Change wording and order here.
 */
const site = {
  name: "Joshua Leyva",
  title: "Software developer",
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
      copy: "I'm Josh. I work on production systems, mostly the part where something is already in a customer's hands and the fix has to be careful.",
    },
    {
      id: "hiring",
      label: "Hiring",
      copy: "L2 technical support at Cryptio, on a crypto accounting platform. Before that, a Rails migration at StartNoo and a few years at OPSWAT across support, internal tools, and test automation.",
    },
    {
      id: "engineering",
      label: "Engineering",
      copy: "Rails, React, Java, and a lot of SQL. I like the unglamorous parts: migrations, failing tests, and queries that do not surprise anyone later.",
    },
  ],
  sectionOrder: ["work", "projects", "education", "skills", "aside"],
  sections: {
    work: {
      id: "work",
      index: "01",
      title: "Work",
      lede: "Production support now. Product engineering and cybersecurity tooling before that.",
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
