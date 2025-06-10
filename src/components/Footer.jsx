import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-100 py-8 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-100">ImJoshLeyva</h3>
            <p className="text-sm text-neutral-300">
              Personal Portfolio Website  <br /> Built with React and TailwindCSS <br /> © 2025 ImJoshLeyva
            </p> 
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-100">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-300 hover:text-primary transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#experience" className="text-neutral-300 hover:text-primary transition-colors duration-200">
                  Experience
                </a>
              </li>
              <li>
                <a href="#projects" className="text-neutral-300 hover:text-primary transition-colors duration-200">
                  Projects
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-neutral-100">Contact Me</h3>
            <p className="text-sm text-neutral-300">
              joshleyva816@gmail.com 
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
