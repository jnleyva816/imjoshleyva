// src/components/Experience.jsx
import React from 'react';
import experienceData from '../data/experienceData';

function Experience() {
  return (
    <section className="py-12 rounded-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-center text-pale-cream mb-8">My Experience</h2>
        
        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experienceData.map((exp, index) => (
            <div key={index} className="bg-pale-cream rounded-lg shadow-md p-6 flex">
              {/* Icon */}

              
              {/* Experience Details */}
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-800">{exp.role}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-gray-500 text-sm">{exp.duration}</p>
                <p className="mt-2 text-warm-yellow">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;

