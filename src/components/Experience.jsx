// src/components/Experience.jsx
import React from 'react';
import { motion } from 'framer-motion';
import experienceData from '../data/experienceData';
import { 
  FaBriefcase, 
  FaCode, 
  FaUsers, 
  FaChartLine, 
  FaShieldAlt,
  FaLaptopCode,
  FaRocket,
  FaDatabase
} from "react-icons/fa";

function Experience() {
  // Icon mapping for different roles/companies
  const getCompanyIcon = (company, role) => {
    if (company.includes('Cryptio')) return FaDatabase;
    if (company.includes('StartNoo')) return FaRocket;
    if (company.includes('OPSWAT')) return FaShieldAlt;
    if (role.includes('Full Stack')) return FaCode;
    if (role.includes('Technical Support')) return FaUsers;
    if (role.includes('Application Developer')) return FaLaptopCode;
    if (role.includes('QA')) return FaChartLine;
    return FaBriefcase;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -60,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const timelineVariants = {
    hidden: { height: 0 },
    visible: {
      height: "100%",
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative py-16">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-emerald-500/5 to-amber-500/5 rounded-3xl"></div>
      
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Timeline Container */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 w-1 bg-slate-200 dark:bg-slate-700 transform md:-translate-x-1/2">
            <motion.div
              className="w-full bg-gradient-to-b from-indigo-500 via-emerald-500 to-amber-500 rounded-full"
              variants={timelineVariants}
            />
          </div>

          {/* Experience Items */}
          <div className="space-y-12">
            {experienceData.map((exp, index) => {
              const IconComponent = getCompanyIcon(exp.company, exp.role);
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  className={`relative flex items-center ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  variants={itemVariants}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 w-6 h-6 bg-white dark:bg-slate-900 rounded-full border-4 border-indigo-500 transform -translate-x-1/2 z-10 shadow-lg">
                    <div className="absolute inset-1 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full animate-pulse"></div>
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ml-20 md:ml-0 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
                    <motion.div
                      className="bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-2xl group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Company Icon */}
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl shadow-lg mr-4">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300">
                            {exp.role}
                          </h3>
                          <p className="text-lg font-semibold text-emerald-500">
                            {exp.company}
                          </p>
                        </div>
                      </div>

                      {/* Duration Badge */}
                      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 rounded-full mb-4">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {exp.duration}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors duration-300">
                        {exp.description}
                      </p>

                      {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Achievement Highlights */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {exp.company.includes('Cryptio') && (
                          <>
                            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-medium">
                              Crypto/FinTech
                            </span>
                            <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 rounded-full text-xs font-medium">
                              SQL
                            </span>
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700/30 text-slate-800 dark:text-slate-300 rounded-full text-xs font-medium">
                              Production Support
                            </span>
                          </>
                        )}
                        {exp.role.includes('Full Stack') && (
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                            Full Stack
                          </span>
                        )}
                        {exp.description.includes('Ruby on Rails') && (
                          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-xs font-medium">
                            Ruby on Rails
                          </span>
                        )}
                        {exp.description.includes('WordPress') && (
                          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-medium">
                            WordPress
                          </span>
                        )}
                        {exp.description.includes('cybersecurity') && (
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                            Cybersecurity
                          </span>
                        )}
                        {exp.description.includes('automated testing') && (
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                            Test Automation
                          </span>
                        )}
                        {exp.description.includes('data visualization') && (
                          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-xs font-medium">
                            Data Visualization
                          </span>
                        )}
                      </div>

                      {/* Performance Metrics */}
                      {(exp.description.includes('20%') || exp.description.includes('30%')) && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center space-x-4">
                            <FaChartLine className="text-emerald-500" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Key Impact</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {exp.description.includes('20%') && 'Improved productivity by 20%'}
                                {exp.description.includes('30%') && 'Reduced bugs by 30%'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Mobile Timeline Connector */}
                  <div className="hidden md:block absolute left-1/2 top-1/2 w-8 h-px bg-gradient-to-r from-indigo-500 to-emerald-500 transform -translate-y-1/2 -translate-x-1/2"></div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Summary Card */}
        <motion.div
          className="mt-16 bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-8 text-center transition-all duration-300"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-2xl shadow-lg">
              <FaRocket className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent mb-4">
            Ready for New Challenges
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-center leading-relaxed">
            With diverse experience across full-stack development, cybersecurity, and technical support, 
            I bring a unique blend of technical expertise and problem-solving skills to every project.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">4+ Years Experience</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Multiple Tech Stacks</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Proven Results</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Experience;

