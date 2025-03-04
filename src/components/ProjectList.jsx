import React from 'react';
import Project from './Project';

const ProjectsList = ({ projects }) => {
  return (
    <>
    <h2 className="text-3xl font-bold text-center text-pale-cream mb-8">My Recent Projects</h2>
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {projects.map((project, index) => (
        <Project key={index} project={project} />
      ))}
    </div>
    </>
  );
};

export default ProjectsList;
