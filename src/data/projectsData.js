import React from 'react';
import portfolioImage from '../assets/portfolio.jpg';
import jobTrackerImage from '../assets/job_app_tracker.png';

const projects = [
  {
    id: 1,
    title: "Personal Portfolio Website",
    description: "A modern, responsive portfolio website built with React and Tailwind CSS, featuring smooth animations, glassmorphism design, and optimized performance. Deployed on Vercel with continuous integration.",
    imageUrl: portfolioImage,
    technologies: ["React", "Tailwind CSS", "Framer Motion", "Vite", "Vercel", "JavaScript", "HTML5", "CSS3"],
    demo: "https://imjoshleyva.vercel.app",
    github: "https://github.com/jnleyva816/imjoshleyva",
    category: "Web Applications",
    year: "2024",
    featured: true,
    status: "Live",
    longDescription: "This portfolio website represents a culmination of modern web development practices, showcasing both technical skills and design sensibility. Built with React and Tailwind CSS, it features an extensive glassmorphism design system, smooth scroll animations powered by Framer Motion, and comprehensive responsive design that works flawlessly across all device types.",
    features: [
      "Responsive design optimized for all devices",
      "Smooth scroll animations and micro-interactions",
      "Modern glassmorphism and gradient design system",
      "Interactive project showcases with detailed modals",
      "Performance optimized with lazy loading",
      "SEO optimized with meta tags and structured data",
      "Accessible design following WCAG guidelines",
      "Custom timeline component for experience section"
    ]
  },
  {
    id: 2,
    title: "NextMove",
    description: "A comprehensive full-stack application for tracking job applications with advanced filtering, analytics, and progress monitoring. Built with Spring Boot backend and React frontend, featuring real-time updates and data visualization.",
    imageUrl: jobTrackerImage,
    technologies: ["React", "Spring Boot", "Java", "PostgreSQL", "REST API", "JWT", "Material-UI", "Docker"],
    demo: "https://job-application-tracker-docs.vercel.app",
    github: "https://github.com/jnleyva816/job-application-tracker",
    category: "Web Applications",
    year: "2025",
    featured: true,
    status: "Completed",
    longDescription: "NextMove is a sophisticated job application tracking system designed to help job seekers manage their application process efficiently. The application features a robust Spring Boot backend with PostgreSQL database, providing secure user authentication, comprehensive CRUD operations, and advanced analytics capabilities.",
    features: [
      "User authentication and authorization with JWT",
      "CRUD operations for job applications management",
      "Advanced filtering and search functionality",
      "Interactive dashboard with progress analytics",
      "Real-time status updates and notifications",
      "Data export functionality (PDF, CSV)",
      "Responsive design with Material-UI components",
      "RESTful API with comprehensive documentation",
      "Database optimization with PostgreSQL",
      "Containerized deployment with Docker"
    ]
  },
  // {
  //   title: "Project 2",
  //   description: "This is a description of Project 2.",
  //   imageUrl: "https://via.placeholder.com/150",
  //   technologies: ["Vue.js", "Firebase", "Sass"],
  //   demo: "https://project2.com",
  //   github: "https://github.com/user/project2"
  // },
  // Add more projects as needed
];

export default projects;
