import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiEagleEmblem } from 'react-icons/gi';
import ThemeToggle from './ThemeToggle';

export default function NavbarClean() {
  console.log('NavbarClean component loaded');
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    console.log('Menu toggle clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  const handleNavClick = (targetId) => {
    // Navigation fluide vers la section
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    // Fermer le menu mobile après navigation
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-dark-100/95 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <GiEagleEmblem className="text-purple-500 text-3xl" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
           B.com
            </span>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {[
                { id: 'home', label: 'Accueil' },
                { id: 'about', label: 'À propos' },
                { id: 'services', label: 'Services' },
                { id: 'skills', label: 'Compétences' },
                { id: 'experience', label: 'Expérience' },
                { id: 'work', label: 'Travail' },
                { id: 'projects', label: 'Projets' },
                { id: 'contact', label: 'Contact' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  {item.label}
                </button>
              ))}

              {/* Bouton Dashboard Modernisé */}
              <Link
                to="/dashboard"
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-1">
                  <span className="text-base">⚡</span>
                  <span>Admin</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              {/* Toggle de thème */}
              <ThemeToggle />
            </div>
          </div>

          {/* Section Mobile - Toggle de thème + Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />

            {/* Bouton Menu Mobile */}
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white p-2"
            >
              <div className="flex flex-col space-y-1">
                <span
                  className={`block w-6 h-0.5 bg-current transition-transform origin-center ${
                    isOpen ? 'rotate-45 translate-y-1.5' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-current transition-opacity ${
                    isOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-current transition-transform origin-center ${
                    isOpen ? '-rotate-45 -translate-y-1.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-200/95 backdrop-blur-sm rounded-lg mt-2">
              {[
                { id: 'home', label: 'Accueil' },
                { id: 'about', label: 'À propos' },
                { id: 'services', label: 'Services' },
                { id: 'skills', label: 'Compétences' },
                { id: 'experience', label: 'Expérience' },
                { id: 'work', label: 'Travail' },
                { id: 'projects', label: 'Projets' },
                { id: 'contact', label: 'Contact' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="block w-full text-left text-gray-300 hover:text-white hover:bg-purple-500/20 px-3 py-2 text-base font-medium rounded-lg transition-all duration-300"
                >
                  {item.label}
                </button>
              ))}

              {/* Bouton Dashboard Mobile Optimisé */}
              <Link
                to="/dashboard"
                className="group relative block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 mt-4 overflow-hidden"
                onClick={() => setIsOpen(false)}
              >
                <span className="relative z-10 flex items-center justify-center space-x-1">
                  <span className="text-base">⚡</span>
                  <span>Admin</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
