// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import TopBar from './components/Topbar';
import HeroSection from './components/HeroSection';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Footer from './components/Footer';
import { ThemeProvider } from './components/ThemeProvider';
import ThemeToggle from './components/ThemeToggle';

// Lazy load heavy components
const LeetCode_heatmap = lazy(() => import('./components/LeetCode_heatmap'));
const MusicPlayer = lazy(() => import('./components/Music-Player'));
const ProjectList = lazy(() => import('./components/ProjectList'));

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  // Animation variants for sections
  const fadeInUpVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        {/* Background Pattern */}
        <div className="fixed inset-0 opacity-30">
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(99 102 241 / 0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {/* Top Navigation Bar */}
          <TopBar />
          
          {/* Spacer for fixed navbar */}
          <div className="h-24"></div>
          
          {/* Main Container */}
          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20"
            variants={staggerContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Section */}
            <motion.section 
              className="pt-8"
              variants={fadeInUpVariants}
            >
              <HeroSection />
            </motion.section>
            
            {/* Modern Separator */}
            <motion.div 
              className="flex items-center justify-center"
              variants={fadeInUpVariants}
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
              <div className="mx-4 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
            </motion.div>

            {/* Experience Section */}
            <motion.section 
              id="experience"
              className="py-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainerVariants}
            >
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent mb-4"
                  variants={fadeInUpVariants}
                >
                  Professional Experience
                </motion.h2>
                <motion.p 
                  className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed text-center"
                  variants={fadeInUpVariants}
                >
                  My journey in software development and the projects that shaped my career
                </motion.p>
              </div>
              <Experience /> 
            </motion.section>

            {/* Modern Separator */}
            <motion.div 
              className="flex items-center justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
              <div className="mx-4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
            </motion.div>

            {/* Projects Section */}
            <motion.section 
              id="projects" 
              className="relative py-16 lg:py-24"
              variants={staggerContainerVariants}
            >
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent mb-4"
                  variants={fadeInUpVariants}
                >
                  Featured Projects
                </motion.h2>
                <motion.p 
                  className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed text-center"
                  variants={fadeInUpVariants}
                >
                  A showcase of my technical skills and creative problem-solving
                </motion.p>
              </div>
              <Suspense fallback={<div className="text-center text-slate-600 dark:text-slate-300">Loading projects...</div>}>
                <ProjectList />
              </Suspense>
            </motion.section>

            {/* Modern Separator */}
            <motion.div 
              className="flex items-center justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
              <div className="mx-4 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
            </motion.div>

            {/* Education Section */}
            <motion.section 
              id="education"
              className="py-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainerVariants}
            >
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent mb-4"
                  variants={fadeInUpVariants}
                >
                  Education
                </motion.h2>
                <motion.p 
                  className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed text-center"
                  variants={fadeInUpVariants}
                >
                  Academic foundation and continuous learning journey
                </motion.p>
              </div>
              <Education />
            </motion.section>
            
            {/* Modern Separator */}
            <motion.div 
              className="flex items-center justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
              <div className="mx-4 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
            </motion.div>
            
            {/* Skills Section */}
            <motion.section 
              id="skills"
              className="py-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainerVariants}
            >
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent mb-4"
                  variants={fadeInUpVariants}
                >
                  Technical Skills
                </motion.h2>
                <motion.p 
                  className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed text-center"
                  variants={fadeInUpVariants}
                >
                  Technologies and tools I work with to bring ideas to life
                </motion.p>
              </div>
              <Skills />
            </motion.section>
            
            {/* Modern Separator */}
            <motion.div 
              className="flex items-center justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
            >
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
              <div className="mx-4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
            </motion.div>
            
            {/* Interactive Section - LeetCode & Music */}
            <motion.section 
              className="py-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainerVariants}
            >
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent mb-4"
                  variants={fadeInUpVariants}
                >
                  Beyond Code
                </motion.h2>
                <motion.p 
                  className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed text-center"
                  variants={fadeInUpVariants}
                >
                  Problem solving progress and creative inspiration
                </motion.p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* LeetCode Heatmap */}
                <motion.div 
                  className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-2xl"
                  variants={fadeInUpVariants}
                >
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6 text-center">
                    LeetCode Progress
                  </h3>
                  <Suspense fallback={<div className="text-center text-slate-500">Loading...</div>}>
                    <LeetCode_heatmap />
                  </Suspense>
                </motion.div>
                
                {/* Music Player */}
                <motion.div 
                  className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-2xl"
                  variants={fadeInUpVariants}
                >
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6 text-center">
                    Coding Soundtrack
                  </h3>
                  <Suspense fallback={<div className="text-center text-slate-500">Loading...</div>}>
                    <MusicPlayer />
                  </Suspense>
                </motion.div>
              </div>
            </motion.section>

            {/* Bottom Spacer */}
            <div className="h-16"></div>
          </motion.div>
        </div>
        
        {/* Footer */}
        <Footer />

        {/* Theme Toggle Button */}
        <ThemeToggle />

        <Analytics />
        <SpeedInsights />
      </div>
    </ThemeProvider>
  );
}

export default App;

