import useParallax from '../hooks/useParallax';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

import LazyImage from './LazyImage';
import { useEffect, useState } from 'react';
import notificationService from '../services/notificationService';
import { profile1Image } from '../assets/assets.js';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { useNavigate } from 'react-router-dom';
export default function Hero() {
  const scrollY = useParallax();
  const [elementRef] = useIntersectionObserver();
  const navigate = useNavigate();

  // Tableau des backgrounds
  const backgrounds = [
    '/background7.png',
    '/background8.png',
    '/background9.jpeg',
  ];
  const [bgIndex, setBgIndex] = useState(0);

  // Slider automatique
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 4000); // Change toutes les 4 secondes
    return () => clearInterval(timer);
  }, [backgrounds.length]);

  // Notification de bienvenue après un délai
  useEffect(() => {
    const timer = setTimeout(() => {
      notificationService.welcome();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={elementRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20 overflow-hidden"
    >
      {/* Background image slider */}
      <div
        className="absolute inset-0 w-full h-full transition-all duration-1000"
        style={{
          backgroundImage: `url(${backgrounds[bgIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.3)',
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-100/90 to-dark-100/70 z-10" />

      {/* Particules flottantes animées */}
      <div className="absolute inset-0 z-15 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-20">
        {/* Profile Image avec animation sophistiquée */}
        <AnimatedSection variant="scaleIn" delay={0.2}>
          <div className="mb-8 flex justify-center">
            <motion.div
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { type: 'spring', stiffness: 300 },
              }}
              className="relative"
            >
              <LazyImage
                src={profile1Image}
                alt="Louiscar Ingeba"
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-purple shadow-neon-purple relative z-10"
                priority={true}
                placeholder={
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-purple to-pink animate-pulse border-4 border-purple" />
                }
              />
              {/* Cercle animé autour de la photo */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-blue-400 to-purple-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-[-8px] rounded-full border border-purple-400/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Titre d'accueil avec animations staggered */}
        <AnimatedSection variant="slideUp" delay={0.4}>
          <div className="mb-8 text-center">
            <motion.h2
              className="text-2xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-red-500 to-red-300 to-red-200 text-transparent bg-clip-text"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Louiscar Ingeba
            </motion.h2>

            <motion.p
              className="text-lg md:text-2xl text-gray-400 mb-5 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Chargé Relations Publiques & Maintenance Système d'une agence de Développement informatiques                       <span>"MUAMOKEL AGENCY"</span> & Entrpreneur.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8, type: 'spring' }}
            >
              <motion.p
                className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Spécialisé en gestion de projets et support technique.

              </motion.p>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Boutons avec animations micro-interactions */}
        <AnimatedSection variant="slideUp" delay={1.0}>
          <motion.div
            className="flex gap-4 justify-center"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              type="button"
              onClick={() => navigate('/contact')}
              className="group relative px-8 py-3 bg-gradient-to-r from-purple to-pink text-white rounded-lg overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 font-semibold">Me contacter</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              type="button"
              onClick={() => navigate('/projects')}
              className="group relative px-8 py-3 bg-dark-300 text-white rounded-lg border border-purple overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 font-semibold">Mes Projets</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0.5, originY: 0.5 }}
              />
            </motion.button>
          </motion.div>
        </AnimatedSection>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce w-6 h-6 border-2 border-purple rounded-full"></div>
      </div>
    </section>
  );
}
