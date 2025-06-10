// src/components/Topbar.jsx
import React, { useState } from 'react';
import portfolio from '/portfolio.svg';

function Topbar() {
  // State to manage mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };  

  return (
    <nav className="fixed top-0 w-full z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="text-xl font-bold text-slate-800 dark:text-slate-200">
              <img src={portfolio} alt="Portfolio" className="h-8 w-8" /> 
            </a>
          </div>
          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8 items-center">
            <a
              href="#"
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#experience"
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Experience
            </a>
            <a
              href="#projects"
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Projects
            </a>
            <a
              href="https://jnleyvaphotos.vercel.app"
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Photography
            </a>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {/* Hamburger Icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  // Close Icon
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  // Hamburger Icon
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="block text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="#experience"
              className="block text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            >
              Experience
            </a>
            <a
              href="#projects"
              className="block text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            >
              Projects
            </a>
            <a
              href="https://jnleyvaphotos.vercel.app"
              className="block text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Photography
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Topbar;

