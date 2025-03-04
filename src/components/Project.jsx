import React from 'react';

const Project = ({ project }) => {
  return (
    <div className="border border-warm-yellow rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={project.imageUrl}
        alt={project.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-warm-yellow mb-4">{project.description}</p>
        <div className="mb-4">
          <strong className="text-pale-cream">Technologies:</strong>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
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
              className="text-warm-yellow hover:text-blue-700 transition-colors duration-300"
            >
              Live Demo
            </a>
          )}
          {project.codeUrl && (
            <a
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm-yellow hover:text-blue-700 transition-colors duration-300"
            >
              View Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Project;
