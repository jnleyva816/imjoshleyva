import React, { useState } from 'react';
import Modal from './Modal';

const Project = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="border border-warm-yellow rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-dark-navy"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-contain bg-gray-100"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-warm-yellow">{project.title}</h3>
          <p className="text-warm-brown/90 mb-4">{project.description}</p>
          <div className="mb-4">
            <strong className="text-warm-yellow">Technologies:</strong>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="bg-warm-yellow text-white px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-warm-yellow transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                Live Demo
              </a>
            )}
            {project.codeUrl && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-warm-yellow transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                View Code
              </a>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-warm-brown">{project.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-64 object-contain bg-gray-100 rounded-lg"
              />
              {project.additionalImages && project.additionalImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {project.additionalImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full h-32 object-contain bg-gray-100 rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <p className="text-warm-brown text-lg">{project.description}</p>
              
              <div>
                <h3 className="text-xl font-bold text-warm-brown mb-2">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-warm-yellow text-white px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.features && (
                <div>
                  <h3 className="text-xl font-bold text-warm-brown mb-2">Key Features</h3>
                  <ul className="list-disc list-inside text-warm-brown space-y-1">
                    {project.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-warm-yellow text-white px-6 py-2 rounded-full hover:bg-warm-yellow hover:text-warm-brown transition-colors duration-300"
                  >
                    Live Demo
                  </a>
                )}
                {project.codeUrl && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-warm-yellow text-white px-6 py-2 rounded-full hover:bg-warm-yellow hover:text-warm-brown transition-colors duration-300"
                  >
                    View Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Project;
