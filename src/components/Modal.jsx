import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Enhanced backdrop with blur and gradient */}
      <div 
        className="fixed inset-0 bg-gradient-to-b from-dark-navy/80 to-dark-navy/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal content with pale cream background */}
      <div className="relative bg-pale-cream rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all border border-rust-brown/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-rust-brown hover:text-pale-cream transition-colors p-2 rounded-full hover:bg-rust-brown"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="text-rust-brown">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 