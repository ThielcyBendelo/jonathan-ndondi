import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, FaTimes, FaChevronDown, FaBalanceScale, 
  FaLightbulb, FaBookOpen, FaUsers, FaFeather, 
  FaBriefcase, FaHandshake, FaHistory, FaGavel, FaMicrophoneAlt, FaHome, FaUserTie
} from 'react-icons/fa';

export default function NavbarSecured({ theme, toggleTheme, isAuthenticated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  // Menu réorganisé pour Avocate / Coach / Auteur
  const menuCategories = [
    {
      label: "Expertises",
      items: [
        
        { label: "Cabinet Juridique", href: "/testimonials", icon: <FaBalanceScale /> },
        { label: "Coaching Business", href: "/skills", icon: <FaUserTie /> },
        { label: "Conférences", href: "/work", icon: <FaMicrophoneAlt /> },
         { label: "Ma vision", href: "/about", icon: < FaLightbulb/> },
          { label: "Techniques", href: "/services", icon: <FaGavel /> },
          { label: "Parcours", href: "/experience", icon: <FaHistory /> },
      ]
    },
    {
      label: "Impact & Publications",
      items: [
        { label: "Mon Accueil", href: "/", icon: <FaHome /> },
        { label: "Mes Livres", href: "/projects", icon: <FaBookOpen /> },
        { label: "Blog Impact", href: "/blog", icon: <FaFeather /> },
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
      scrolled ? 'bg-slate-950/95 backdrop-blur-md py-3 shadow-2xl' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
        
        {/* Logo Professionnel */}
        <div className="cursor-pointer group" onClick={() => navigate('/')}>
          <span className="text-xl md:text-2xl font-serif font-bold tracking-[0.2em] uppercase italic">
            Kulufio<span className="text-amber-500 font-light not-italic"> Rebecca</span>
          </span>
          <p className="text-[8px] tracking-[0.3em] uppercase text-slate-400 group-hover:text-white transition-colors">Avocate & Mentor</p>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex gap-8 border-r border-slate-800 pr-8">
            {menuCategories.map((category) => (
              <div key={category.label} className="relative group py-2">
                <button className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-300 group-hover:text-amber-400 transition-colors font-bold">
                  {category.label} <FaChevronDown size={8} className="group-hover:rotate-180 transition-transform" />
                </button>
                {/* Dropdown Style Luxe */}
                <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900 border border-amber-900/20 rounded-sm shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <div className="p-2">
                    {category.items.map((item) => (
                      <Link key={item.href} to={item.href} className="flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all border-b border-white/5 last:border-0">
                        <span className="text-amber-500">{item.icon}</span>
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
            className="text-[10px] uppercase tracking-widest bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 font-bold transition-all shadow-lg shadow-amber-900/20"
          >
            Prendre RDV
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden z-50 p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 w-full h-screen bg-[#0a0a0a] z-40 flex flex-col md:hidden text-white overflow-y-auto"
          >
            <div className="flex flex-col px-8 py-24 gap-6">
              <span className="text-[10px] tracking-[0.5em] uppercase text-amber-600 mb-4 font-bold">Explorer</span>
              {menuCategories.map((category, idx) => (
                <div key={category.label} className="w-full border-b border-white/5 pb-4">
                  <button onClick={() => toggleCategory(category.label)} className="flex items-center justify-between w-full py-2">
                    <div className="flex items-center gap-4">
                      <span className="text-[9px] font-mono text-amber-800">0{idx + 1}</span>
                      <p className={`text-2xl font-serif ${activeCategory === category.label ? 'text-amber-400 italic' : 'text-slate-500'}`}>{category.label}</p>
                    </div>
                    <motion.div animate={{ rotate: activeCategory === category.label ? 180 : 0 }}><FaChevronDown size={14} /></motion.div>
                  </button>
                  <AnimatePresence>
                    {activeCategory === category.label && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="flex flex-col gap-4 pl-10 pt-4 pb-2">
                          {category.items.map((item) => (
                            <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg text-slate-300 hover:text-amber-400 transition-colors">
                              {item.icon} <span className="text-sm uppercase tracking-tighter">— {item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
