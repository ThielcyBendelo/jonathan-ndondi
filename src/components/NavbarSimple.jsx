import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function NavbarSimple() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavClick = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // Fermer le menu mobile
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-dark-100/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple to-pink bg-clip-text text-transparent">
              Ir Bendelo
            </span>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => handleNavClick('home')}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Accueil
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                À propos
              </button>
              <button
                onClick={() => handleNavClick('services')}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => handleNavClick('skills')}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Compétences
              </button>
              <button
                onClick={() => handleNavClick('projects')}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Projets
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white p-2"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-200 rounded-lg mt-2">
              <button
                onClick={() => handleNavClick('home')}
                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 text-base font-medium transition-colors"
              >
                Accueil
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 text-base font-medium transition-colors"
              >
                À propos
              </button>
              <button
                onClick={() => handleNavClick('services')}
                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 text-base font-medium transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => handleNavClick('skills')}
                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 text-base font-medium transition-colors"
              >
                Compétences
              </button>
              <button
                onClick={() => handleNavClick('projects')}
                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 text-base font-medium transition-colors"
              >
                Projets
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 text-base font-medium transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
