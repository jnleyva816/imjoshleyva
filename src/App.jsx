// src/App.jsx
import React from 'react';
import './App.css';
import { motion } from 'framer-motion';
import TopBar from './components/Topbar';
import HeroSection from './components/HeroSection';
import Skills from './components/Skills';
import LeetCode_heatmap from './components/LeetCode_heatmap';
import MusicPlayer from './components/Music-Player';
import Experience from './components/Experience';
import Education from './components/Education';
import ProjectList from './components/ProjectList';
import projects from './data/projectsData';
import Footer from './components/Footer';

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center bg-forest-green text-pale-cream font-script">
      {/* Top Navigation Bar */}
      <TopBar />
      
      {/* Spacer */}
      <div className="pt-24"></div>
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroSection />
      </motion.div>
      
      {/* Separator Line */}
      <div className="w-full h-px bg-warm-yellow my-4 md:w-1/2 lg:w-1/3 mx-auto mt-10"></div>

      {/* Experience Section */}
      <motion.div 
        className="py-10" 
        id="experience"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Experience /> 
      </motion.div>

      {/* Separator Line */}
      <div className="w-full h-px bg-warm-yellow my-4 md:w-1/2 lg:w-1/3 mx-auto"></div>

      {/*Projects Section*/}
      <motion.div 
        className="py-10" 
        id="projects"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <ProjectList projects={projects} />
      </motion.div>

      {/* Separator Line */}
      <div className="w-full h-px bg-warm-yellow my-4 md:w-1/2 lg:w-1/3 mx-auto"></div>

      {/* Education Section */}
      <motion.div 
        className="py-10" 
        id="education"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Education />
      </motion.div>
      
      {/* Separator Line */}
      <div className="w-full h-px bg-warm-yellow my-4 md:w-1/2 lg:w-1/3 mx-auto"></div>
      
      {/* Skills Section */}
      <motion.div 
        className="py-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Skills />
      </motion.div>
      
      {/* Separator Line */}
      <div className="w-full h-px bg-warm-yellow my-4 md:w-1/2 lg:w-1/3 mx-auto"></div>
      
      {/* LeetCode Heatmap and Music Player */}
      <motion.div 
        className="py-10 flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8 w-full px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* LeetCode Heatmap */}
        <div className="w-full lg:w-1/3">
          <LeetCode_heatmap />
        </div>
        
        {/* Music Player */}
        <div className="w-full lg:w-1/3">
          <MusicPlayer />
        </div>
      </motion.div>
      
      {/* Footer */}
      <Footer />

      <Analytics />
      <SpeedInsights />
    </section>
  );
}

export default App;

