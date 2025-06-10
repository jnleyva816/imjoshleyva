import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import { FaExternalLinkAlt, FaCode, FaEye, FaRocket, FaLaptopCode, FaGithub, FaStar } from 'react-icons/fa';

const Project = ({ project, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Get project icon based on type
  const getProjectIcon = (title) => {
    if (title.toLowerCase().includes('portfolio') || title.toLowerCase().includes('personal')) return FaRocket;
    if (title.toLowerCase().includes('tracker') || title.toLowerCase().includes('app')) return FaLaptopCode;
    return FaCode;
  };

  const IconComponent = getProjectIcon(project.title);

  return (
    <>
      <motion.div 
        className="group relative overflow-hidden bg-white/10 dark:bg-slate-900/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-2xl cursor-pointer h-full"
        onClick={() => setIsModalOpen(true)}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Project Image */}
        <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-t-xl">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={project.imageUrl}
            alt={project.title}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Project Icon */}
          <div className="absolute top-4 left-4 p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-lg transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <IconComponent className="w-5 h-5 text-indigo-500" />
          </div>

          {/* Quick Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2 transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.github, '_blank');
              }}
              className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-indigo-500 hover:text-white transition-all duration-300"
              aria-label="View on GitHub"
            >
              <FaGithub className="w-4 h-4" />
            </button>
            {project.demo && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.demo, '_blank');
                }}
                className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg hover:bg-emerald-500 hover:text-white transition-all duration-300"
                aria-label="View live demo"
              >
                <FaExternalLinkAlt className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* View Details Button */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150">
            <motion.button
              className="inline-flex items-center px-4 py-2 bg-white/95 backdrop-blur-sm text-neutral-800 font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEye className="w-4 h-4 mr-2" />
              View Details
            </motion.button>
          </div>
        </div>

        {/* Project Details */}
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs md:text-sm font-medium border border-indigo-200 dark:border-indigo-800 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-emerald-500 hover:text-white transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project Stats */}
          <div className="mt-auto">
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {project.status || 'Completed'}
                  </span>
                </div>
                {project.featured && (
                  <div className="flex items-center space-x-1">
                    <FaStar className="w-3 h-3 text-amber-500" />
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Featured</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500">
                {project.year || '2024'}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </motion.div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          console.log('Project onClose called, setting modal to false'); // Debug log
          setIsModalOpen(false);
        }} 
        project={project} 
      />
    </>
  );
};

export default Project;
