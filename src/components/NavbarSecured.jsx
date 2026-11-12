import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, FaTimes, FaChevronDown, FaShieldAlt, 
  FaLightbulb, FaChartLine, FaUsers, FaPenNib, 
  FaBriefcase, FaHandshake, FaFileContract, FaBuilding, FaHome, FaUserTie
} from 'react-icons/fa';

export default function NavbarSecured({ theme, toggleTheme, isAuthenticated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  // Menu réorganisé pour Chargé de comptes Assurances & Entrepreneur
  const menuCategories = [
    {
      label: "Solutions Assurances",
      items: [
        { label: "Assurances Collectives", href: "/services", icon: <FaUsers /> },
        { label: "Audit & Risques", href: "/testimonials", icon: <FaShieldAlt /> },
        { label: "Gestion de Comptes", href: "/work", icon: <FaFileContract /> },
        { label: "Accompagnement PME", href: "/skills", icon: <FaBuilding /> },
      ]
    },
    {
      label: "Entrepreneuriat",
      items: [
        { label: "Mon Accueil", href: "/", icon: <FaHome /> },
        { label: "About", href: "/about", icon: <FaLightbulb /> },
        { label: "Parcours", href: "/experience", icon: <FaFileContract /> },
        { label: "Projets & Impact", href: "/projects", icon: <FaChartLine /> },
        // { label: "Blog Business", href: "/blog", icon: <FaPenNib /> },
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleCategory = (label) => {
    setActiveCategory(activeCategory === label ? null : label);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[#191970]/95 backdrop-blur-md py-3 shadow-2xl' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
        
        {/* Logo Style Parisien */}
        <div className="cursor-pointer group" onClick={() => navigate('/')}>
          <span className="text-xl md:text-2xl font-serif font-bold tracking-[0.2em] uppercase">
            Booto<span className="text-orange-500 font-light italic"> Jonathan</span>
          </span>
          <p className="text-[8px] tracking-[0.3em] uppercase text-white/70 group-hover:text-orange-400 transition-colors">
            Assurances Collectives & Entrepreneur
          </p>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8 border-r border-white/10 pr-8">
            {menuCategories.map((category) => (
              <div key={category.label} className="relative group py-2">
                <button className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/90 group-hover:text-orange-400 transition-colors font-bold">
                  {category.label} <FaChevronDown size={8} className="group-hover:rotate-180 transition-transform" />
                </button>
                
                {/* Dropdown Bleu Minuit & Orange */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#191970] border border-orange-500/20 rounded-sm shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <div className="p-2">
                    {category.items.map((item) => (
                      <Link key={item.href} to={item.href} className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest text-white/70 hover:text-white hover:bg-orange-500/10 transition-all border-b border-white/5 last:border-0">
                        <span className="text-orange-500">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => navigate('/contact')} 
            className="text-[10px] uppercase tracking-widest bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 font-bold transition-all shadow-lg shadow-orange-900/40"
          >
            Demander un Audit
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden z-50 p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

           {/* Mobile Menu Overlay (Tiroir latéral droit à largeur réduite) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 1. Fond sombre semi-transparent (Backdrop) pour fermer au clic à l'extérieur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
            />

            {/* 2. Panneau du menu mobile à largeur réduite (288px / max 80% de l'écran) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 w-72 max-w-[80vw] h-screen bg-[#191970] border-l border-orange-500/30 shadow-2xl z-50 flex flex-col justify-between md:hidden text-white overflow-y-auto"
            >
              {/* Partie haute : Catégories de navigation */}
              <div className="flex flex-col px-6 pt-24 pb-8 gap-5">
                <span className="text-[10px] tracking-[0.5em] uppercase text-orange-500 mb-2 font-bold">
                  Menu
                </span>

                {menuCategories.map((category, idx) => (
                  <div key={category.label} className="w-full border-b border-white/10 pb-4">
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.label)}
                      className="flex items-center justify-between w-full py-1.5 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-mono text-orange-500">0{idx + 1}</span>
                        <p
                          className={`text-xl font-serif ${
                            activeCategory === category.label
                              ? 'text-orange-400 italic'
                              : 'text-white/80'
                          }`}
                        >
                          {category.label}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: activeCategory === category.label ? 180 : 0 }}
                        className="text-white/60"
                      >
                        <FaChevronDown size={12} />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {activeCategory === category.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-3.5 pl-6 pt-3 pb-1">
                            {category.items.map((item) => (
                              <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2.5 text-white/80 hover:text-orange-400 transition-colors"
                              >
                                <span className="text-orange-500 text-xs">{item.icon}</span>
                                <span className="text-xs uppercase tracking-wider">
                                  {item.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Partie basse : Footer du menu mobile */}
              <div className="px-6 py-6 bg-[#121254] border-t border-white/10 mt-auto">
                <p className="text-[10px] uppercase tracking-[0.25em] text-orange-400 font-bold mb-1">
                  Assurances Collectives
                </p>
                <p className="text-xs text-white/70 font-light mb-4">
                  Cabinet & Conseil • Paris
                </p>

                <a
                  href="https://wa.me/33650092569"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center transition-colors"
                >
                  Contact Direct
                </a>

                <p className="text-[10px] text-white/40 text-center mt-4">
                  © {new Date().getFullYear()} Jonathan Booto Ndondi
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
