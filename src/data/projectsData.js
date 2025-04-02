import React from 'react';
import portfolioImage from '../assets/portfolio.jpg';
import jobTrackerImage from '../assets/job_app_tracker.png';


const projects = [
  {
    title: "Imjoshleyva.vercel.app",
    description: "Personal Portfolio hosted on Vercel.",
    imageUrl: portfolioImage,
    technologies: ["React", "TailwindCSS", "MongoDB", "Vercel"],
    liveUrl: "https://imjoshleyva.vercel.app",
    codeUrl: "https://github.com/jnleyva816/imjoshleyva"
  },
  {
    title: "Job Application Tracker",
    description: "Full Stack Job Application Tracker built with Spring Boot backend and React frontend.",
    imageUrl: jobTrackerImage,
    technologies: ["React", "Spring Boot", "Java", "PostgreSQL"],
    liveUrl: "https://job-application-tracker-docs.vercel.app",
    codeUrl: "https://github.com/jnleyva816/job-application-tracker"
  },
  // {
  //   title: "Project 2",
  //   description: "This is a description of Project 2.",
  //   imageUrl: "https://via.placeholder.com/150",
  //   technologies: ["Vue.js", "Firebase", "Sass"],
  //   liveUrl: "https://project2.com",
  //   codeUrl: "https://github.com/user/project2"
  // },
  // Add more projects as needed
];

export default projects;
