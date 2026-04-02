import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import analyticsService from '../services/analyticsService';

const ScrollProgressIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fonction pour calculer le pourcentage de scroll
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setScrollProgress(progress);
      setIsVisible(scrollTop > 100); // Afficher après 100px de scroll

      // Analytics : tracker les milestones de scroll
      if (progress >= 25 && progress < 26) {
        analyticsService.trackEvent('scroll_milestone', {
          milestone: '25%',
          category: 'engagement',
        });
      } else if (progress >= 50 && progress < 51) {
        analyticsService.trackEvent('scroll_milestone', {
          milestone: '50%',
          category: 'engagement',
        });
      } else if (progress >= 75 && progress < 76) {
        analyticsService.trackEvent('scroll_milestone', {
          milestone: '75%',
          category: 'engagement',
        });
      } else if (progress >= 90 && progress < 91) {
        analyticsService.trackEvent('scroll_milestone', {
          milestone: '90%',
          category: 'engagement',
        });
      }
    };

    // Utiliser requestAnimationFrame pour des performances optimales
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    updateScrollProgress(); // Initial call

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Barre de progression principale */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background de la barre */}
        <div className="w-full h-full bg-dark-400/30 backdrop-blur-sm">
          {/* Barre de progression avec gradient */}
          <motion.div
            className="h-full bg-gradient-to-r from-purple via-pink to-blue 
                       shadow-lg shadow-purple/20"
            style={{
              width: `${scrollProgress}%`,
              background: `linear-gradient(90deg, 
                #8b5cf6 0%, 
                #ec4899 35%, 
                #3b82f6 70%, 
                #8b5cf6 100%
              )`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${scrollProgress}%` }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          />

          {/* Effet de brillance qui se déplace */}
          <motion.div
            className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r 
                       from-transparent via-white/30 to-transparent"
            animate={{
              x: scrollProgress > 5 ? `${scrollProgress * 4}px` : '-100px',
            }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Indicateur de pourcentage (optionnel, apparaît au hover) */}
      <motion.div
        className="fixed top-4 right-4 z-[60] bg-dark-300/90 backdrop-blur-md 
                   rounded-full px-3 py-1 text-xs font-medium text-white
                   border border-purple/30 shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isVisible && scrollProgress > 10 ? 1 : 0,
          scale: isVisible && scrollProgress > 10 ? 1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
      >
        <motion.span
          key={Math.floor(scrollProgress)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {Math.floor(scrollProgress)}%
        </motion.span>
      </motion.div>

      {/* Indicateurs de sections (dots) */}
      <motion.div
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-[55]
                   space-y-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {[
          { id: 'home', label: 'Accueil', range: [0, 15] },
          { id: 'about', label: 'À propos', range: [15, 30] },
          { id: 'services', label: 'Services', range: [30, 45] },
          { id: 'skills', label: 'Compétences', range: [45, 60] },
          { id: 'experience', label: 'Expérience', range: [60, 75] },
          { id: 'projects', label: 'Projets', range: [75, 90] },
          { id: 'contact', label: 'Contact', range: [90, 100] },
        ].map((section) => {
          const isActive =
            scrollProgress >= section.range[0] &&
            scrollProgress < section.range[1];

          return (
            <motion.button
              key={section.id}
              onClick={() => {
                const element = document.getElementById(section.id);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  analyticsService.trackEvent('scroll_indicator_click', {
                    section: section.id,
                    category: 'navigation',
                  });
                }
              }}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 group
                         hover:scale-125 relative ${
                           isActive
                             ? 'bg-gradient-to-r from-purple to-pink border-purple shadow-lg shadow-purple/30'
                             : 'bg-transparent border-gray-500 hover:border-purple'
                         }`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Tooltip au hover */}
              <motion.div
                className="absolute right-6 top-1/2 transform -translate-y-1/2
                           bg-dark-300/95 backdrop-blur-md text-white text-xs
                           px-2 py-1 rounded whitespace-nowrap pointer-events-none
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                initial={{ x: 10, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
              >
                {section.label}
              </motion.div>

              {/* Pulse effect pour la section active */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-purple/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </>
  );
};

export default ScrollProgressIndicator;
