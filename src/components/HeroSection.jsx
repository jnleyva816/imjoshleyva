import React, { useState } from 'react';
import { motion } from 'framer-motion';
import profile_picture from '../assets/profile_picture.jpg';
import resume from '../assets/JoshuaLeyvaResume.pdf';
import { GrDownload } from "react-icons/gr";
import { FaGithub, FaLinkedin, FaCode } from "react-icons/fa";

function HeroSection() {
  const tabs = [
    {
      label: 'General',
      icon: '👋',
      content: (
        <>
          Hi, I'm <strong className="text-primary font-semibold">Josh Leyva</strong>! Welcome to my digital space where creativity meets technology. Let's connect and explore the possibilities together!
        </>
      ),
    },
    {
      label: 'Recruiter',
      icon: '💼',
      content: (
        <>
          Hello! I'm <strong className="text-primary font-semibold">Josh Leyva</strong>, a dedicated software developer specializing in Java, C#, and Rust. With a proven track record of building responsive, user-friendly interfaces and developing robust backend systems, I thrive on solving complex problems and delivering high-quality solutions. Let's connect to discuss how I can contribute to your team's success!
        </>
      ),
    },
    {
      label: 'Developer',
      icon: '🚀',
      content: (
        <>
          Hey there! I'm <strong className="text-primary font-semibold">Josh Leyva</strong>, a passionate developer experienced in Python, C++, C#, and Rust, along with modern front-end technologies. I enjoy collaborating on innovative projects, optimizing performance, and exploring new technologies to enhance development workflows. Check out my projects and let's build something awesome together!
        </>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].label);

  const handleTabClick = (label) => {
    setActiveTab(label);
  };

  const activeContent = tabs.find((tab) => tab.label === activeTab)?.content;
  const activeIcon = tabs.find((tab) => tab.label === activeTab)?.icon;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const socialLinks = [
    {
      href: "https://github.com/jnleyva816",
      icon: FaGithub,
      label: "GitHub Profile",
      color: "hover:text-neutral-800"
    },
    {
      href: "https://www.linkedin.com/in/joshua-leyva-0b9942b6/?trk=opento_sprofile_details",
      icon: FaLinkedin,
      label: "LinkedIn Profile",
      color: "hover:text-blue-600"
    },
    {
      href: "https://leetcode.com/jleyva",
      icon: FaCode,
      label: "LeetCode Profile",
      color: "hover:text-orange-500"
    }
  ];

  return (
    <motion.section 
      className="relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-emerald-500/5 to-amber-500/5 rounded-3xl"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-8 md:p-12 lg:p-16 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Profile Image */}
            <motion.div 
              className="lg:col-span-4 flex justify-center lg:justify-start"
              variants={itemVariants}
            >
              <div className="relative">
                {/* Animated rings */}
                <div 
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 p-1"
                  style={{
                    animation: 'spin 8s linear infinite'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900"></div>
                </div>
                <div 
                  className="absolute inset-2 rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 p-1"
                  style={{
                    animation: 'spin 6s linear infinite reverse'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white dark:bg-slate-900"></div>
                </div>
                
                {/* Profile Picture */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
                  <img
                    src={profile_picture}
                    alt="Joshua N. Leyva"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    loading="eager"
                    decoding="async"
                  />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
                  <span className="text-2xl">{activeIcon}</span>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Name and Title */}
              <motion.div 
                className="text-center lg:text-left"
                variants={itemVariants}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">Joshua N. Leyva</span>
                </h1>
                <div className="flex items-center justify-center lg:justify-start space-x-4 text-lg md:text-xl text-slate-600 dark:text-slate-300">
                  <span>Software Developer</span>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  <span>Problem Solver</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>Tech Enthusiast</span>
                </div>
              </motion.div>

              {/* Interactive Tabs */}
              <motion.div 
                className="space-y-6"
                variants={itemVariants}
              >
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab.label}
                      onClick={() => handleTabClick(tab.label)}
                      className={`px-6 py-3 rounded-2xl font-medium text-sm md:text-base transition-all duration-300 transform ${
                        activeTab === tab.label
                          ? 'bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-lg scale-105'
                          : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:scale-105 hover:shadow-md'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </motion.button>
                  ))}
                </div>

                {/* Tab Content */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/20 dark:border-white/10"
                >
                  <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed text-center lg:text-left">
                    {activeContent}
                  </p>
                </motion.div>
              </motion.div>

              {/* Resume Download Button */}
              {activeTab === 'Recruiter' && (
                <motion.div 
                  className="flex justify-center lg:justify-start"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.a
                    href={resume}
                    download="JoshuaLeyvaResume.pdf"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-3">Download Resume</span>
                    <GrDownload className="text-lg group-hover:translate-y-1 transition-transform duration-300" />
                  </motion.a>
                </motion.div>
              )}

              {/* Social Links */}
              <motion.div 
                className="flex justify-center lg:justify-start space-x-6"
                variants={itemVariants}
              >
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl text-slate-600 dark:text-slate-400 ${social.color} transition-all duration-300 shadow-md hover:shadow-lg group`}
                      aria-label={social.label}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    </motion.a>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-8 w-4 h-4 bg-indigo-500/30 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-12 w-6 h-6 bg-emerald-500/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-16 w-3 h-3 bg-amber-500/30 rounded-full animate-pulse delay-500"></div>
    </motion.section>
  );
}

export default HeroSection;
