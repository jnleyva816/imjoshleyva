import React from 'react';

const Education = () => {
  const relevantCoursework = [
    "Data Structures & Algorithms",
    "Algorithm Design & Analysis",
    "System Design",
    "AI Model Building",
    "Mobile Application Development",
    "UI/UX Design"
  ];

  return (
    <div id="education" className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="flex flex-col space-y-6 sm:space-y-10 items-stretch">
        <h2 className="text-3xl sm:text-3xl font-bold text-center text-pale-cream">
          Education
        </h2>
        
        <a href="https://floridapoly.edu" target="_blank" rel="noopener noreferrer" className="block">
          <div className="max-w-4xl mx-auto bg-pale-cream rounded-xl shadow-xl overflow-hidden border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="p-6 sm:p-10">
              <div className="flex items-center space-x-4 sm:space-x-6 mb-6 sm:mb-8">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-warm-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09v6.36c0 .73.59 1.32 1.32 1.32.73 0 1.32-.59 1.32-1.32V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
                <h3 className="text-2xl sm:text-3xl font-bold text-forest-green">
                  Florida Polytechnic University
                </h3>
              </div>
              
              <div className="flex flex-col space-y-4 sm:space-y-6">
                <p className="text-xl sm:text-2xl font-semibold text-forest-green">
                  Bachelor of Science in Computer Science
                </p>
                <p className="text-base sm:text-lg text-gray-600">
                  Concentration: Software Engineering & Artificial Intelligence
                </p>
                <p className="text-base sm:text-lg text-gray-500">
                  Graduated: December 2023
                </p>

                <div className="mt-6 sm:mt-8">
                  <h4 className="text-lg sm:text-xl font-semibold text-forest-green mb-4">
                    Relevant Coursework
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {relevantCoursework.map((course, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-white/50 rounded-lg p-3">
                        <svg className="w-5 h-5 text-warm-yellow" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                        </svg>
                        <span className="text-gray-700">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Education;
