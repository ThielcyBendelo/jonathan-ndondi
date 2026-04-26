import useParallax from '../hooks/useParallax';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import LazyImage from './LazyImage';
import { useEffect, useState } from 'react';
import { profile1Image } from '../assets/assets.js';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { useNavigate } from 'react-router-dom';
import { FaBalanceScale, FaLightbulb, FaBookOpen } from 'react-icons/fa';

// --- SECTION EXPERTISES (MAJ : Avocate / Coach / Auteur) ---
const Expertises = () => (
  <section className="py-24 bg-white text-slate-900 px-6">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif mb-16 border-l-4 border-amber-600 pl-6 text-left">Piliers d'Impact</h2>
      <div className="grid md:grid-cols-3 gap-12 text-left">
        {[
          { 
            title: "Défense Juridique", 
            icon: <FaBalanceScale className="text-amber-600 mb-4" size={24} />,
            desc: "Protection de vos droits et conseils stratégiques au sein de notre cabinet d'avocats." 
          },
          { 
            title: "Coaching Entrepreneurial", 
            icon: <FaLightbulb className="text-amber-600 mb-4" size={24} />,
            desc: "Accompagnement des femmes et entrepreneurs pour bâtir des projets à fort impact." 
          },
          { 
            title: "Édition & Littérature", 
            icon: <FaBookOpen className="text-amber-600 mb-4" size={24} />,
            desc: "Ouvrages dédiés à l'éveil de la jeunesse africaine et au leadership féminin." 
          }
        ].map((service, i) => (
          <div key={i} className="group cursor-pointer border-b border-slate-100 pb-8 hover:border-amber-600 transition-all">
            {service.icon}
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">{service.title}</h3>
            <p className="text-slate-600 font-light leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- SECTION QUOTE (MAJ : Vision Afrique/Femmes) ---
const Quote = () => (
  <section className="py-24 bg-slate-950 text-white text-center italic font-light px-6">
    <div className="max-w-4xl mx-auto">
      <p className="text-2xl md:text-3xl leading-snug font-serif">
        "Le véritable leadership réside dans la capacité à transformer les lois en justice, les idées en entreprises et la jeunesse en héritage pour l'Afrique."
      </p>
      <div className="mt-8 h-px w-20 bg-amber-600 mx-auto"></div>
    </div>
  </section>
);

export default function Hero() {
  const scrollY = useParallax();
  const [elementRef] = useIntersectionObserver();
  const navigate = useNavigate();

  // Suggestion : Utilisez des images de cabinet de droit, de conférences ou de bibliothèques élégantes
  const backgrounds = ['/background1.jpeg', '/background2.jpeg', '/background3.jpeg'];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [backgrounds.length]);

  return (
    <>
      <section
        ref={elementRef}
        id="home"
        className="relative min-h-screen flex flex-col justify-center items-center text-center py-24 px-6 overflow-hidden bg-slate-950"
      >
        {/* Background Dynamique */}
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${backgrounds[bgIndex]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.3) contrast(110%)',
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          />
        </AnimatePresence>

        {/* Overlay Signature */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/60 z-10" />

        <div className="relative z-20 max-w-5xl">
          {/* Portrait Premium */}
          <AnimatedSection variant="scaleIn" delay={0.2}>
            <div className="mb-10 flex justify-center">
              <div className="relative">
                <LazyImage
                  src={profile1Image}
                  alt="Rebecca Kulufio"
                  className="w-40 h-40 md:w-60 md:h-60 rounded-full object-cover transition-all duration-1000 border-2 border-amber-600/30 shadow-[0_0_50px_rgba(217,119,6,0.2)]"
                  style={{ objectPosition: 'center 10%' }}
                />
                {/* Cercle Ornemental Doré */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 border-r-2 border-b-2 border-amber-600/20 rounded-full pointer-events-none"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Titre & Identité Multi-facettes */}
          <AnimatedSection variant="slideUp" delay={0.4}>
            <h2 className="text-sm md:text-lg tracking-[0.4em] uppercase mb-4 text-amber-500 font-medium">
              Avocate • Coach • Auteur
            </h2>
            
            <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 text-white leading-tight">
              Rebecca <span className="italic font-light text-slate-200">Kulufio</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              Défendre vos intérêts juridiques et éveiller le potentiel de la 
              <span className="text-white font-semibold italic"> jeunesse africaine </span> 
              et des femmes entrepreneures.
            </p>
          </AnimatedSection>

          {/* Actions Ciblées */}
          <AnimatedSection variant="slideUp" delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate('/services')}
                className="px-10 py-4 bg-amber-600 text-white font-bold uppercase text-xs tracking-widest hover:bg-amber-700 transition-all shadow-xl shadow-amber-900/40"
              >
                Expertises & Services
              </button>
              
              <button
                onClick={() => navigate('/books')}
                className="px-10 py-4 border border-white/30 text-white font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all backdrop-blur-sm"
              >
                Découvrir mes Livres
              </button>
            </div>
          </AnimatedSection>
        </div>

        {/* Scroll Indicator Amélioré */}
        <div className="absolute bottom-10 z-20 flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-slate-500">Explorer</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-10 bg-gradient-to-b from-amber-600 to-transparent"
          />
        </div>
      </section>

      <Expertises />
      <Quote />
    </>
  );
}
