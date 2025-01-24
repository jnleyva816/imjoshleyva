import React from 'react';

import {
  FaJsSquare,
  FaPython,
  FaJava,
  FaReact,
  FaNodeJs,
  FaAws,
  FaMicrosoft,
  FaGoogle,
  FaJedi, // Alternative for Jest
  FaRust,
} from 'react-icons/fa';
import { TbBrandCpp } from "react-icons/tb";
import { SiSelenium,SiRubyonrails, SiSpring } from 'react-icons/si';
import { DiRuby } from "react-icons/di";

const skillsData = {
  'Programming Languages': [   
    { name: 'Java', icon: <FaJava className="w-8 h-8 text-red-500" /> },
    { name: 'Rust', icon: <FaRust className="w-8 h-8 text-orange-500" /> }, 
    { name: 'C++', icon: <TbBrandCpp className="w-8 h-8 text-blue-700" /> },
    { name: 'Ruby', icon: <DiRuby className="w-8 h-8 text-red-500" /> },
    { name: 'JavaScript', icon: <FaJsSquare className="w-8 h-8 text-yellow-500" /> },
    { name: 'Python', icon: <FaPython className="w-8 h-8 text-blue-500" /> },
  ],
  'Frameworks & Testing': [
    { name: 'React', icon: <FaReact className="w-8 h-8 text-blue-400" /> },
    { name: 'Node.js', icon: <FaNodeJs className="w-8 h-8 text-green-500" /> },
    { name: 'Jest', icon: <FaJedi className="w-8 h-8 text-purple-500" /> },
    { name: 'Selenium', icon: <SiSelenium className="w-8 h-8 text-green-500" /> },
    { name: 'Ruby on Rails', icon: <SiRubyonrails className="w-8 h-8 text-red-500" /> },
    { name: 'Spring', icon: <SiSpring className="w-8 h-8 text-green-500" /> },
  ],
  'Cloud Services': [
    { name: 'AWS', icon: <FaAws className="w-8 h-8 text-orange-500" /> },
    { name: 'Azure', icon: <FaMicrosoft className="w-8 h-8 text-blue-600" /> },
    { name: 'Google Cloud', icon: <FaGoogle className="w-8 h-8 text-blue-500" /> },
  ],
};


function Skills() {
  return (
    <section className="py-12 bg-warm-yellow rounded-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-pale-cream mb-8">My Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(skillsData).map(([category, skills]) => (
            <div key={category} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">{category}</h3>
              <ul className="space-y-4">
                {skills.map((skill) => (
                  <li key={skill.name} className="flex items-center space-x-4">
                    {skill.icon}
                    <span className="text-gray-600">{skill.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
