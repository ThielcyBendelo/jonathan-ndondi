import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaTachometerAlt, FaBars, FaTimes, FaVolumeUp, FaVolumeMute, FaMoon, 
  FaSun , FaHome, FaProjectDiagram, FaCogs, FaInfoCircle, FaPhone, FaChevronDown, FaTools, FaDraftingCompass 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '../services/authService';
import audioService from '../services/audioService';
import notificationService from '../services/notificationService';

export default function NavbarSecured() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(audioService.isEnabled());
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    authService.initialize().then(() => {
      setIsAuthenticated(authService.isLoggedIn());
    });
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Organisation des menus par catégories
  const menuCategories = [
    {
      label: 'Navigation',
      items: [
        { href: '/', label: 'Accueil', icon: <FaHome /> },
        { href: '/about', label: 'L\'Agence', icon: <FaInfoCircle /> },
        { href: '/experience', label: 'Parcours', icon: <FaProjectDiagram /> },
        { href: '/contact', label: 'Contact', icon: <FaPhone /> },
      ]
    },
    {
      label: 'Expertises',
      items: [
        { href: '/services', label: 'Nos Services', icon: <FaCogs /> },
        { href: '/projects', label: 'Portfolio Projets', icon: <FaDraftingCompass /> },
        { href: '/skills', label: 'Technique BIM', icon: <FaTools /> },
      ]
    }
  ];

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    notificationService.info(`Mode ${newTheme === 'dark' ? 'sombre' : 'clair'} activé`);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-slate-950/95 backdrop-blur-md py-3 shadow-2xl' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
        
        {/* Logo */}
        <div className="cursor-pointer group" onClick={() => navigate('/')}>
          <span className="text-xl md:text-2xl font-serif font-bold tracking-[0.3em] uppercase italic">
            Mon<span className="text-slate-500 font-light not-italic"> Portfolio</span>
          </span>
        </div>

        {/* Desktop Navigation avec Sous-menus */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8 border-r border-slate-800 pr-8">
            {menuCategories.map((category) => (
              <div key={category.label} className="relative group py-2">
                <button className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-300 group-hover:text-white transition-colors uppercase font-bold">
                  {category.label} <FaChevronDown size={8} className="group-hover:rotate-180 transition-transform" />
                </button>

                {/* Sous-menu Dropdown */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-sm shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <div className="p-2">
                    {category.items.map((item) => (
                      <Link 
                        key={item.href} 
                        to={item.href} 
                        className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                      >
                        <span className="text-slate-600">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Outils & Auth */}
          <div className="flex items-center gap-5">
  <button 
    onClick={toggleTheme} 
    className="text-slate-400 hover:text-white transition-all duration-300 transform hover:scale-110"
    aria-label="Changer le mode"
  >
    {theme === 'dark' ? (
      <FaMoon size={18} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
    ) : (
      <FaSun size={18} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]" />
    )}
  </button>
  
  {/* Le reste de vos éléments (Espace Client, etc.) */}
</div>
          <div>
            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="text-[10px] uppercase tracking-widest bg-white text-black px-6 py-2 font-bold hover:bg-slate-200 transition-all">
                Espace Client
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="text-[10px] uppercase tracking-widest bg-white text-black px-6 py-2 font-bold hover:bg-slate-200 transition-all">
                Espace Client
              </button>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden z-50 p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 w-full h-screen bg-slate-950 z-40 flex flex-col md:hidden text-white overflow-y-auto"
          >
            <div className="flex flex-col justify-center items-start px-12 py-20 min-h-full gap-10">
              {menuCategories.map((category) => (
                <div key={category.label} className="w-full">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-slate-600 mb-6 font-bold">{category.label}</p>
                  <div className="flex flex-col gap-6">
                    {category.items.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 text-3xl font-serif italic text-white"
                      >
                        <span className="text-lg text-slate-700">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="mt-6 pt-8 border-t border-slate-900 w-full">
                <button onClick={toggleTheme} className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                  Apparence: {theme === 'dark' ? 'Sombre' : 'Clair'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
