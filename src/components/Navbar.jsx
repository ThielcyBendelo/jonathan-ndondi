import { useState, useEffect } from 'react';
import { GiEagleEmblem } from 'react-icons/gi';
import notificationService from '../services/notificationService';
import audioService from '../services/audioService';
import analyticsService from '../services/analyticsService';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(audioService.isEnabled());
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) return stored;
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      )
        return 'dark';
    } catch {
      // ignore errors (e.g., SSR or private mode)
    }
    return 'light';
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    } catch {
      // ignore write errors
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    audioService.playClick();
    analyticsService.trackEvent('theme_toggle', {
      theme: newTheme,
      category: 'user_interface',
    });
    notificationService.info(
      `Mode ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`,
      { autoClose: 2000, icon: newTheme === 'dark' ? '🌙' : '☀️' }
    );
  };

  const toggleAudio = async () => {
    const newState = audioService.toggle();
    setAudioEnabled(newState);

    analyticsService.trackEvent('audio_toggle', {
      enabled: newState,
      category: 'user_preferences',
    });

    if (newState) {
      audioService.playSuccess();
      notificationService.success('🔊 Sons activés', { autoClose: 2000 });
    } else {
      notificationService.info('🔇 Sons désactivés', { autoClose: 2000 });
    }
  };

  const toggleMenu = () => {
    console.log('🔥 Toggle menu called, current isOpen:', isOpen);
    const newState = !isOpen;
    setIsOpen(newState);
    console.log('🚀 New isOpen state:', newState);

    // Force re-render check
    setTimeout(() => {
      console.log('🔍 State after timeout:', isOpen);
    }, 100);

    audioService.playClick();
    analyticsService.trackEvent('mobile_menu_toggle', {
      isOpen: newState,
      category: 'navigation',
    });
  };

  const handleNavClick = (section, e) => {
    e.preventDefault();
    console.log('Nav clicked:', section);

    // Fermer le menu mobile
    if (isOpen) {
      setIsOpen(false);
      console.log('Menu closed');
    }

    audioService.playNavigate();

    // Tracker la navigation
    analyticsService.trackEvent('navigation_click', {
      section: section.replace('#', ''),
      category: 'navigation',
    });

    // Attendre que le menu se ferme avant de scroller (mobile)
    const scrollToSection = () => {
      const element = document.getElementById(section.replace('#', ''));
      if (element) {
        // Offset pour compenser la navbar fixe
        const yOffset = -80;
        const y =
          element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth',
        });

        // Notification de navigation (subtile)
        if (section !== '#home') {
          notificationService.navigate(section.replace('#', ''));
        }
      } else {
        console.log('Element not found:', section);
      }
    };

    // Délai pour laisser le menu mobile se fermer
    if (isOpen) {
      setTimeout(scrollToSection, 100);
    } else {
      scrollToSection();
    }
  };

  // Navigation items
  const navItems = [
    { href: '#home', label: 'Accueil', icon: '🏠' },
    { href: '#about', label: 'À propos', icon: '👤' },
    { href: '#services', label: 'Services', icon: '⚡' },
    { href: '#skills', label: 'Compétences', icon: '🚀' },
    { href: '#experience', label: 'Expérience', icon: '💼' },
    { href: '#projects', label: 'Projets', icon: '🛠️' },
    { href: '#work', label: 'Travail', icon: '💻' },
    { href: '#testimonials', label: 'Témoignages', icon: '⭐' },
    { href: '#contact', label: 'Contact', icon: '📞' },
    { href: '/blog', label: 'Blog', icon: '📝' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-dark-100/80 backdrop-blur z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <GiEagleEmblem className="text-3xl text-[var(--accent-1)]" />
            <span className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-transparent bg-clip-text">
              Ir Bendelo
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              item.href.startsWith('#') ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(item.href, e)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              )
            ))}
          </div>

          {/* Controls (Theme, Audio, Mobile Menu) */}
          <div className="flex items-center gap-3">
            {/* Audio toggle */}
            <button
              onClick={toggleAudio}
              onMouseEnter={() => audioService.playHover()}
              aria-label="Basculer sons"
              className="p-2 rounded-md text-gray-300 hover:text-white transition-colors"
              title={audioEnabled ? 'Désactiver les sons' : 'Activer les sons'}
            >
              {audioEnabled ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12a3 3 0 013-3m-3 3a3 3 0 01-3-3m3 3v4l-6-4H3a1 1 0 01-1-1V8a1 1 0 011-1h3l6-4v4"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1V8a1 1 0 011-1h1.586l4.707-4.707C10.923 1.663 12 2.109 12 3v18c0 .891-1.077 1.337-1.707.707L5.586 17M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              )}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              onMouseEnter={() => audioService.playHover()}
              aria-label="Basculer thème"
              className="p-2 rounded-md text-gray-300 hover:text-white transition-colors"
            >
              {theme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364 6.364l-1.414-1.414M7.05 6.636L5.636 5.222m12.728 0l-1.414 1.414M7.05 17.364l-1.414 1.414M12 7a5 5 0 100 10 5 5 0 000-10z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  />
                </svg>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white transition-colors relative z-50"
              onClick={() => {
                console.log('🎯 Button clicked directly!');
                toggleMenu();
              }}
              onMouseEnter={() => audioService.playHover()}
              aria-label="Toggle menu"
              type="button"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 12h16"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 18h16"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-200/95 backdrop-blur-md border-t border-purple/20 absolute top-16 left-0 right-0 z-40">
          <div className="text-center py-2 text-xs text-green-400">
            🟢 Menu ouvert - État: {isOpen.toString()}
          </div>
          <div className="px-2 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              (
                item.href.startsWith('#') ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      console.log('Mobile menu item clicked:', item.label);
                      handleNavClick(item.href, e);
                    }}
                    onMouseEnter={() => audioService.playHover()}
                    className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl
                             text-gray-300 hover:text-white 
                             bg-transparent hover:bg-gradient-to-r hover:from-purple/20 hover:to-pink/20
                             border border-transparent hover:border-purple/30
                             transition-all duration-300 hover:scale-105
                             w-full text-left"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </a>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl
                             text-gray-300 hover:text-white 
                             bg-transparent hover:bg-gradient-to-r hover:from-purple/20 hover:to-pink/20
                             border border-transparent hover:border-purple/30
                             transition-all duration-300 hover:scale-105
                             w-full text-left"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </a>
                )
              )
            ))}

            {/* Separator */}
            <hr className="border-purple/20 my-4 mx-4" />

            {/* Mobile Theme and Audio controls */}
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  toggleTheme();
                  // Ne pas fermer le menu pour les contrôles
                }}
                onMouseEnter={() => audioService.playHover()}
                className="p-3 rounded-xl bg-gradient-to-r from-purple/20 to-pink/20 
                         text-gray-300 hover:text-white border border-purple/30
                         transition-all duration-300 hover:scale-110"
                title={`Mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              <button
                onClick={() => {
                  toggleAudio();
                  // Ne pas fermer le menu pour les contrôles
                }}
                onMouseEnter={() => audioService.playHover()}
                className="p-3 rounded-xl bg-gradient-to-r from-purple/20 to-pink/20 
                         text-gray-300 hover:text-white border border-purple/30
                         transition-all duration-300 hover:scale-110"
                title={audioEnabled ? 'Désactiver sons' : 'Activer sons'}
              >
                {audioEnabled ? '🔊' : '🔇'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
