import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-pale-cream py-8 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ImJoshLeyva</h3>
            <p className="text-sm">
              Personal Portfolio Website  <br /> Built with React and TailwindCSS <br /> © 2025 ImJoshLeyva
            </p> 
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="#experience" className="text-gray-300 hover:text-white">
                  Experience
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-300 hover:text-white">
                  Projects
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Me</h3>
            <p className="text-sm">
              joshleyva816@gmail.com 
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
