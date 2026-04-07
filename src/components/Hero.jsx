import useParallax from '../hooks/useParallax';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import LazyImage from './LazyImage';
import { useEffect, useState } from 'react';
import notificationService from '../services/notificationService';
import { profile1Image } from '../assets/assets.js';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { useNavigate } from 'react-router-dom';

// --- SECTION SERVICES ---
const Services = () => (
  <section className="py-24 bg-white text-slate-900 px-6">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif mb-16 border-l-4 border-slate-900 pl-6 text-left">Nos Domaines d'Expertise</h2>
      <div className="grid md:grid-cols-3 gap-12 text-left">
        {[
          { title: "Conception Architecturale", desc: "Plans détaillés et vision spatiale innovante pour projets résidentiels et commerciaux." },
          { title: "Suivi de Chantier", desc: "Expertise technique et coordination rigoureuse pour garantir la conformité de l'exécution." },
          { title: "Design d'Intérieur", desc: "Optimisation esthétique et fonctionnelle des espaces de vie et de travail." }
        ].map((service, i) => (
          <div key={i} className="group cursor-pointer border-b border-slate-200 pb-6">
            <h3 className="text-xl font-bold mb-4 group-hover:text-slate-500 transition-colors uppercase tracking-widest">0{i+1}. {service.title}</h3>
            <p className="text-slate-600 font-light leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- SECTION QUOTE ---
const Quote = () => (
  <section className="py-24 bg-slate-950 text-white text-center italic font-light px-6">
    <div className="max-w-4xl mx-auto">
      <p className="text-2xl md:text-3xl leading-snug">
        "L'architecture est le témoin invisible de l'histoire. Chez LEGACY, nous concevons des structures qui traversent le temps."
      </p>
      <div className="mt-8 h-px w-20 bg-slate-500 mx-auto"></div>
    </div>
  </section>
);

export default function Hero() {
  const scrollY = useParallax();
  const [elementRef] = useIntersectionObserver();
  const navigate = useNavigate();

  const backgrounds = ['/background10.jpeg', '/background8.jpeg'];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [backgrounds.length]);

  return (
    <>
      <section
        ref={elementRef}
        id="home"
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-slate-950"
      >
        {/* Background avec Parallaxe doux */}
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${backgrounds[bgIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.25) grayscale(20%)',
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          />
        </AnimatePresence>

        {/* Overlay dégradé professionnel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-slate-950 z-10" />

        <div className="relative z-20 max-w-5xl">
          {/* Identité visuelle - Cercle Architectural */}
          <AnimatedSection variant="scaleIn" delay={0.2}>
            <div className="mb-10 flex justify-center">
              <div className="relative group">
                <LazyImage
                  src={profile1Image}
                  alt="Ibrahim Muswema"
                  className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-700 border-2 border-slate-700 shadow-2xl"
                  style={{ objectPosition: 'center 10%' }}
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 border-t-2 border-l-2 border-slate-500/30 rounded-full pointer-events-none"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Titre & Hiérarchie */}
          <AnimatedSection variant="slideUp" delay={0.4}>
            <h2 className="text-sm md:text-lg tracking-[0.3em] uppercase mb-4 text-slate-400 font-light">
              Architecte Principal & Entrepreneur
            </h2>
            
            <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 text-white leading-tight">
              Ibrahim <span className="text-slate-500">Muswema</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light italic leading-relaxed">
              "Bâtir l'héritage de demain à travers une architecture de précision."
              <br />
              <span className="text-sm font-semibold not-italic text-white tracking-widest uppercase mt-2 block">
                LEGACY Architects & Co
              </span>
            </p>
          </AnimatedSection>

          {/* Call to Actions */}
          <AnimatedSection variant="slideUp" delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate('/projects')}
                className="px-10 py-4 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-slate-200 transition-colors"
              >
                Explorer le Portfolio
              </button>
              
              <button
                onClick={() => navigate('/contact')}
                className="px-10 py-4 border border-white text-white font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all"
              >
                Consultation Privée
              </button>
            </div>
          </AnimatedSection>
        </div>

        {/* Indicateur de scroll */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 z-20 w-px h-12 bg-gradient-to-b from-white to-transparent"
        />
      </section>

      {/* Ajout des sections spécifiques demandées */}
      <Services />
      <Quote />
    </>
  );
}
