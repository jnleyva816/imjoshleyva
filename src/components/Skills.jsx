import React, { useState } from 'react';
import { motion } from 'framer-motion';

import {
  FaJsSquare,
  FaPython,
  FaJava,
  FaReact,
  FaNodeJs,
  FaAws,
  FaMicrosoft,
  FaGoogle,
  FaJedi,
  FaRust,
  FaCode,
  FaCogs,
  FaCloud,
  FaDatabase,
  FaMobile,
  FaTools
} from 'react-icons/fa';
import { TbBrandCpp } from "react-icons/tb";
import { SiSelenium, SiRubyonrails, SiSpring, SiPostgresql, SiMongodb, SiMysql, SiRedis, SiDocker, SiKubernetes, SiGit, SiIntellijidea, SiAndroid, SiFlutter } from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';
import { DiRuby } from "react-icons/di";

const skillsData = {
  'Programming Languages': {
    icon: <FaCode className="w-6 h-6" />,
    color: 'from-blue-500 to-purple-600',
    skills: [   
      { name: 'Java', icon: <FaJava className="w-8 h-8 text-red-500" />, level: 95, experience: '4+ years' },
      { name: 'Rust', icon: <FaRust className="w-8 h-8 text-orange-500" />, level: 85, experience: '2+ years' }, 
      { name: 'C++', icon: <TbBrandCpp className="w-8 h-8 text-blue-700" />, level: 80, experience: '3+ years' },
      { name: 'Ruby', icon: <DiRuby className="w-8 h-8 text-red-500" />, level: 90, experience: '3+ years' },
      { name: 'JavaScript', icon: <FaJsSquare className="w-8 h-8 text-yellow-500" />, level: 92, experience: '4+ years' },
      { name: 'Python', icon: <FaPython className="w-8 h-8 text-blue-500" />, level: 88, experience: '3+ years' },
    ]
  },
  'Frameworks & Libraries': {
    icon: <FaCogs className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600',
    skills: [
      { name: 'React', icon: <FaReact className="w-8 h-8 text-blue-400" />, level: 95, experience: '3+ years' },
      { name: 'Node.js', icon: <FaNodeJs className="w-8 h-8 text-green-500" />, level: 90, experience: '3+ years' },
      { name: 'Jest', icon: <FaJedi className="w-8 h-8 text-purple-500" />, level: 85, experience: '2+ years' },
      { name: 'Selenium', icon: <SiSelenium className="w-8 h-8 text-green-500" />, level: 88, experience: '2+ years' },
      { name: 'Ruby on Rails', icon: <SiRubyonrails className="w-8 h-8 text-red-500" />, level: 92, experience: '3+ years' },
      { name: 'Spring', icon: <SiSpring className="w-8 h-8 text-green-500" />, level: 87, experience: '2+ years' },
    ]
  },
  'Cloud & DevOps': {
    icon: <FaCloud className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-600',
    skills: [
      { name: 'AWS', icon: <FaAws className="w-8 h-8 text-orange-500" />, level: 90, experience: '3+ years' },
      { name: 'Azure', icon: <FaMicrosoft className="w-8 h-8 text-blue-600" />, level: 82, experience: '2+ years' },
      { name: 'Google Cloud', icon: <FaGoogle className="w-8 h-8 text-blue-500" />, level: 78, experience: '1+ years' },
      { name: 'Docker', icon: <SiDocker className="w-8 h-8 text-blue-500" />, level: 85, experience: '2+ years' },
      { name: 'Kubernetes', icon: <SiKubernetes className="w-8 h-8 text-blue-600" />, level: 75, experience: '1+ years' },
    ]
  },
  'Databases': {
    icon: <FaDatabase className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-600',
    skills: [
      { name: 'PostgreSQL', icon: <SiPostgresql className="w-8 h-8 text-blue-600" />, level: 90, experience: '3+ years' },
      { name: 'MongoDB', icon: <SiMongodb className="w-8 h-8 text-green-600" />, level: 85, experience: '2+ years' },
      { name: 'MySQL', icon: <SiMysql className="w-8 h-8 text-blue-500" />, level: 88, experience: '3+ years' },
      { name: 'Redis', icon: <SiRedis className="w-8 h-8 text-red-500" />, level: 80, experience: '2+ years' },
    ]
  },
  'Tools & Mobile': {
    icon: <FaTools className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-600',
    skills: [
      { name: 'Git', icon: <SiGit className="w-8 h-8 text-orange-500" />, level: 95, experience: '4+ years' },
      { name: 'VS Code', icon: <VscCode className="w-8 h-8 text-blue-500" />, level: 98, experience: '4+ years' },
      { name: 'IntelliJ', icon: <SiIntellijidea className="w-8 h-8 text-purple-500" />, level: 92, experience: '3+ years' },
      { name: 'Android Dev', icon: <SiAndroid className="w-8 h-8 text-green-500" />, level: 85, experience: '2+ years' },
      { name: 'Flutter', icon: <SiFlutter className="w-8 h-8 text-blue-400" />, level: 80, experience: '1+ years' },
    ]
  }
};

function Skills() {
  const [activeCategory, setActiveCategory] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const categoryVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const skillVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: (level) => ({
      width: `${level}%`,
      transition: {
        duration: 1.5,
        ease: "easeOut",
        delay: 0.5
      }
    })
  };

  return (
    <section className="relative py-16 lg:py-24">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-emerald-500/5 to-amber-500/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.1),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.1),transparent_40%)]"></div>
      
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          variants={categoryVariants}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl mb-6 shadow-xl">
            <FaCode className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-500 via-emerald-500 to-amber-500 bg-clip-text text-transparent mb-4">
            Technical Skills & Expertise
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 mx-auto rounded-full"></div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mt-6 max-w-3xl mx-auto">
            A comprehensive toolkit built through years of hands-on development experience
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {Object.entries(skillsData).map(([category, categoryData], categoryIndex) => (
            <motion.div
              key={category}
              variants={categoryVariants}
              className="group relative"
              onHoverStart={() => setActiveCategory(category)}
              onHoverEnd={() => setActiveCategory(null)}
            >
              <div className="relative p-8 rounded-3xl bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
                
                {/* Category Header */}
                <div className="relative z-10 mb-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${categoryData.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {categoryData.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300">
                        {category}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                          {categoryData.skills.length} Technologies
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills List */}
                <div className="relative z-10 space-y-6">
                  {categoryData.skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      custom={index}
                      variants={skillVariants}
                      className="group/skill"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 group-hover/skill:scale-110 transition-transform duration-300">
                            {skill.icon}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover/skill:text-indigo-500 dark:group-hover/skill:text-indigo-400 transition-colors duration-300">
                              {skill.name}
                            </span>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {skill.experience}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-100">
                            {skill.level}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          custom={skill.level}
                          variants={progressVariants}
                          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${categoryData.color} rounded-full`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Category Stats */}
                <div className="relative z-10 mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {Math.round(categoryData.skills.reduce((acc, skill) => acc + skill.level, 0) / categoryData.skills.length)}%
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Avg Proficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {categoryData.skills.length}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Technologies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {Math.max(...categoryData.skills.map(s => parseInt(s.experience)))}+
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">Years Exp</div>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${categoryData.color} blur-xl -z-10`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills Summary */}
        <motion.div
          variants={categoryVariants}
          className="mt-16 text-center"
        >
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">25+</span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Technologies</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Mastered</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">4+</span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Years</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Experience</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">5</span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Categories</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Expertise</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">90%</span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100">Proficiency</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Average</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 -left-8 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-8 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/4 w-12 h-12 bg-amber-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </motion.div>
    </section>
  );
}

export default Skills;
