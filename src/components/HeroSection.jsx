// src/components/HeroSection.jsx
import React, { useState } from 'react';
import profile_picture from '../assets/profile_picture.jpg';

function HeroSection() {
  // Define the tabs and their corresponding content
  const tabs = [
    {
      label: 'General',
      content: (
        <>
          Hi, I'm <strong className="text-rust-brown">Josh Leyva</strong>! Follow my socials!!
        </>
      ),
    },
    {
      label: 'Recruiter',
      content: (
        <>
          Hello! I'm <strong className="text-rust-brown">Josh Leyva</strong>, a dedicated software developer specializing in Java, C#, and Rust. With a proven track record of building responsive, user-friendly interfaces and developing robust backend systems, I thrive on solving complex problems and delivering high-quality solutions. Let's connect to discuss how I can contribute to your team's success!
        </>
      ),
    },
    {
      label: 'Developer',
      content: (
        <>
          Hey there! I'm <strong className="text-rust-brown">Josh Leyva</strong>, a passionate developer experienced in Python, C ++, C#, and Rust, and front-end technologies. I enjoy collaborating on innovative projects, optimizing performance, and exploring new technologies to enhance development workflows. Check out my projects and let's build something awesome together!
        </>
      ),
    },
  ];

  // State to manage the active tab
  const [activeTab, setActiveTab] = useState(tabs[0].label); // Default to the first tab

  // Handler to switch tabs
  const handleTabClick = (label) => {
    setActiveTab(label);
  };

  // Find the content for the active tab
  const activeContent = tabs.find((tab) => tab.label === activeTab)?.content;

  return (
    <section className="py-12 bg-pale-cream rounded-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex Container */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-forest-green lg:mr-8 shadow-md">
            <img 
              src={profile_picture}
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="mt-6 lg:mt-0 w-full">
            {/* Name */}
            <h1 className="text-3xl font-bold text-rust-brown text-center lg:text-left">
              Joshua N. Leyva
            </h1>

            {/* Tab Navigation */}
            <div className="mt-4 flex justify-center lg:justify-start space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => handleTabClick(tab.label)}
                  className={`px-3 py-1 rounded-md font-medium focus:outline-none transition-colors ${
                    activeTab === tab.label
                      ? 'bg-forest-green text-white'
                      : 'bg-transparent text-rust-brown hover:bg-forest-green hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Conditional Paragraph */}
            <p className="mt-4 text-base sm:text-lg lg:text-xl text-rust-brown max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              {activeContent}
              {/* "Read more" functionality for longer texts */}
              {/* You can optionally add further toggles here if needed */}
            </p>

            {/* Icon Links */}
            <div className="flex justify-center lg:justify-start space-x-6 mt-6">
              {/* GitHub Link */}
              <a 
                href="https://github.com/jnleyva816" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-rust-brown hover:text-gray-400 transition-colors"
                aria-label="GitHub Profile"
              >
                {/* Inline SVG (GitHub Icon) */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 16 16" 
                  fill="currentColor" 
                  className="w-6 h-6"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 
                           0-.19-.01-.82-.01-1.49-1.78.37-2.22-.43-2.36-.83-.09-.23-.48-.83-.82-1 
                           -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 
                           2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 
                           0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 
                           .67-.21 2.2.82a7.59 7.59 0 0 1 2-.27c.68.003 1.36.092 2 
                           .27 1.53-1.03 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56 
                           .82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 
                           1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 
                           0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>

              {/* LinkedIn Link */}
              <a 
                href="https://www.linkedin.com/in/joshua-leyva-0b9942b6/?trk=opento_sprofile_details" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-rust-brown hover:text-gray-400 transition-colors"
                aria-label="LinkedIn Profile"
              >
                {/* Inline SVG (LinkedIn Icon) */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 16 16"
                  fill="currentColor" 
                  className="w-6 h-6"
                >
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.487 
                           0 16 .57 16 1.146v13.708c0 .633-.526 1.146-1.175 
                           1.146H1.175C.513 16 0 15.43 0 14.854V1.146zm4.943 
                           12.248V5.337H2.542v8.057h2.401zm-1.2-9.18c.837 
                           0 1.357-.555 1.357-1.25-.015-.71-.52-1.249-1.341 
                           -1.249-.821 0-1.357.539-1.357 1.249 0 .695.52 
                           1.25 1.326 1.25h.015zm4.907 9.18V9.359c0-.213.016
                           -.426.078-.576.172-.426.566-.868 1.227-.868.866 
                           0 1.214.654 1.214 1.61v4.072h2.401V9.28c0-2.22-1.186 
                           -3.252-2.77-3.252-1.28 0-1.845.711-2.165 1.203h.016v-1.034H6.22c.
                           03.678 0 8.057 0 8.057h2.401z"/>
                </svg>
              </a>

              {/* LeetCode Link */}
              <a 
                href="https://leetcode.com/jleyva" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-rust-brown hover:text-gray-400 transition-colors"
                aria-label="LeetCode Profile"
              >
                {/* Inline SVG (LeetCode Icon) */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 50 50" 
                  fill="currentColor" 
                  className="w-6 h-6"
                >
                  {/* This is a simple placeholder LeetCode icon path.
                      Replace with your preferred LeetCode icon SVG. */}
                  <path d="M25 2c12.703 0 23 10.297 23 23S37.703 48 25 48 2 37.703 2 25 
                       12.297 2 25 2m0-2C11.192 0 0 11.193 0 25s11.193 25 25 25 25-11.193 
                       25-25S38.807 0 25 0z" />
                  <text 
                    x="50%" 
                    y="58%" 
                    textAnchor="middle" 
                    fill="currentColor"
                    fontSize="14"
                    fontFamily="Arial"
                  >
                    LC
                  </text>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection;

