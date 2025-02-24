// src/App.jsx
import React from 'react';
import './App.css';
import TopBar from './components/Topbar';
import HeroSection from './components/HeroSection';
import Skills from './components/Skills';
import LeetCode_heatmap from './components/LeetCode_heatmap';
import MusicPlayer from './components/Music-Player';
import Experience from './components/Experience';
import ProjectList from './components/ProjectList';
import projects from './data/projectsData';

import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center bg-forest-green text-pale-cream font-script">
      {/* Top Navigation Bar */}
      <TopBar />
      
      {/* Spacer */}
      <div className="pt-24"></div>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Separator Line */}
      <div className="w-full h-px bg-warm-yellow my-4 md:w-1/2 lg:w-1/3 mx-auto mt-10"></div>

      {/* Experience Section */}
      <div className="py-10">
        <Experience /> 
      </div>

      <div className="w-full h-px bg-warm-yellow my-4 md:w-1/2 lg:w-1/3 mx-auto"></div>
      
      {/* Skills Section */}
      <div className="py-10">
        <Skills />
      </div>
      
      {/* Separator Line */}
      <div className="w-full h-px bg-warm-yellow my-4 md:w-1/2 lg:w-1/3 mx-auto"></div>
      
      {/* LeetCode Heatmap and Music Player */}
      <div className="py-10 flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-8 w-full px-4">
        {/* LeetCode Heatmap */}
        <div className="w-full lg:w-1/3">
          <LeetCode_heatmap />
        </div>
        
        {/* Music Player */}
        <div className="w-full lg:w-1/3">
          <MusicPlayer />
        </div>
      </div>
      
      {/* Separator Line */}
      <div className="w-full h-px bg-warm-yellow my-4 md:w-1/2 lg:w-1/3 mx-auto"></div>

      {/*Projects Section*/}
      <div className="py-10">
         <ProjectList projects={projects} />
      </div>

      <Analytics />
    </section>

    
  );
}

export default App;

