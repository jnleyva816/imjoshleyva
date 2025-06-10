import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaGithub, FaExternalLinkAlt, FaCode, FaCalendar, FaTag, FaStar } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, project }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => {
              console.log('Backdrop clicked');
              onClose();
            }}
          />
          
          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl z-10"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative p-6 md:p-8 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                    {project.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    {project.description}
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Close button clicked');
                    onClose();
                  }}
                  className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl transition-all duration-300 group"
                  aria-label="Close modal"
                >
                  <FaTimes className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Project Meta */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {project.category && (
                  <div className="flex items-center space-x-2">
                    <FaTag className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {project.category}
                    </span>
                  </div>
                )}
                {project.year && (
                  <div className="flex items-center space-x-2">
                    <FaCalendar className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {project.year}
                    </span>
                  </div>
                )}
                {project.featured && (
                  <div className="flex items-center space-x-2">
                    <FaStar className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      Featured Project
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* Project Image */}
              {project.imageUrl && (
                <div className="mb-8">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              )}

              {/* Technologies */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-medium border border-indigo-200 dark:border-indigo-800 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-emerald-500 hover:text-white transition-all duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features or Additional Details */}
              {project.features && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {project.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3"
                      >
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700 dark:text-slate-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Long Description */}
              {project.longDescription && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                    Project Overview
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {project.longDescription}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-900 text-white font-semibold rounded-xl hover:from-slate-800 hover:to-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                  >
                    <FaGithub className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    View Source Code
                  </a>
                )}
                
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                  >
                    <FaExternalLinkAlt className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    Live Demo
                  </a>
                )}

                {project.documentation && (
                  <a
                    href={project.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                  >
                    <FaCode className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    Documentation
                  </a>
                )}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-tr-3xl -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-bl-3xl -z-10 pointer-events-none"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal; 