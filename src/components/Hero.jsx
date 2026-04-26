import useParallax from '../hooks/useParallax';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import LazyImage from './LazyImage';
import { useEffect, useState } from 'react';
import { profile1Image } from '../assets/assets.js';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaRocket, FaHandshake } from 'react-icons/fa';

// --- SECTION EXPERTISES ---
const Expertises = () => (
  <section className="py-24 bg-white text-[#191970] px-6">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif mb-16 border-l-4 border-orange-500 pl-6 text-left font-bold uppercase tracking-tight">
        Expertise & Vision
      </h2>
      <div className="grid md:grid-cols-3 gap-12 text-left">
        {[
          { 
            title: "Assurances Collectives", 
            icon: <FaShieldAlt className="text-orange-500 mb-4" size={28} />,
            desc: "Optimisation des contrats de protection sociale, santé et prévoyance pour les entreprises et leurs salariés." 
          },
          { 
            title: "Stratégie Entrepreneuriale", 
            icon: <FaRocket className="text-orange-500 mb-4" size={28} />,
            desc: "Accompagnement opérationnel pour transformer vos ambitions en succès commerciaux durables." 
          },
          { 
            title: "Gestion de Comptes", 
            icon: <FaHandshake className="text-orange-500 mb-4" size={28} />,
            desc: "Une approche sur mesure basée sur la confiance, la rigueur technique et une réactivité parisienne." 
          }
        ].map((service, i) => (
          <div key={i} className="group cursor-pointer border-b border-slate-100 pb-8 hover:border-orange-500 transition-all">
            {service.icon}
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">{service.title}</h3>
            <p className="text-slate-600 font-light leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- NOUVELLE SECTION : VALEUR AJOUTÉE & MÉTHODOLOGIE ---
const ValueProposition = () => (
  <section className="py-24 bg-slate-50 dark:bg-[#0a0f1d] px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Gauche : Statistiques d'Impact */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Économie Moyenne", value: "15%", sub: "sur vos budgets santé" },
            { label: "Conformité", value: "100%", sub: "Risque URSSAF maîtrisé" },
            { label: "Réactivité", value: "24h", sub: "Délai de réponse moyen" },
            { label: "Portefeuille", value: "50+", sub: "PME accompagnées" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 bg-white dark:bg-slate-900 shadow-sm border-b-4 border-orange-500"
            >
              <div className="text-3xl font-serif font-bold text-[#191970] dark:text-white mb-2">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest font-black text-orange-500 mb-1">{stat.label}</div>
              <div className="text-xs text-slate-400 font-light">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Droite : Processus d'Accompagnement */}
        <div className="space-y-8 text-left">
          <h2 className="text-sm tracking-[0.4em] uppercase text-orange-500 font-bold">Votre parcours partenaire</h2>
          <h3 className="text-4xl font-serif font-bold text-[#191970] dark:text-white leading-tight">
            Une approche structurée pour des <span className="italic font-light">résultats mesurables.</span>
          </h3>
          
          <div className="space-y-6 mt-10">
            {[
              { step: "01", title: "Audit Flash", text: "Analyse gratuite de vos contrats actuels et identification des carences." },
              { step: "02", title: "Ingénierie Sociale", text: "Conception d'une solution sur-mesure alignée sur votre CCN." },
              { step: "03", title: "Pilotage Dédié", text: "Gestion quotidienne des mouvements et reporting de sinistralité." }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 group text-left">
                <span className="text-2xl font-serif font-bold text-orange-500/30 group-hover:text-orange-500 transition-colors">
                  {item.step}
                </span>
                <div>
                  <h4 className="font-bold text-[#191970] dark:text-white uppercase tracking-tighter mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- SECTION QUOTE ---
const Quote = () => (
  <section className="py-24 bg-[#191970] text-white text-center italic font-light px-6">
    <div className="max-w-4xl mx-auto">
      <p className="text-2xl md:text-3xl leading-snug font-serif">
        "L'assurance n'est pas qu'une protection, c'est le levier de sérénité indispensable à toute croissance entrepreneuriale audacieuse."
      </p>
      <div className="mt-8 h-px w-20 bg-orange-500 mx-auto"></div>
    </div>
  </section>
);

export default function Hero() {
  const scrollY = useParallax();
  const [elementRef] = useIntersectionObserver();
  const navigate = useNavigate();

  const backgrounds = ['/paris-business-1.jpg', '/office-modern.jpg', '/meeting-assurance.jpg'];
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
        className="relative min-h-screen flex flex-col justify-center items-center text-center py-24 px-6 overflow-hidden bg-[#191970]"
      >
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
              filter: 'brightness(0.25) contrast(110%)',
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-[#191970] via-transparent to-black/40 z-10" />

        <div className="relative z-20 max-w-5xl">
          <AnimatedSection variant="scaleIn" delay={0.2}>
            <div className="mb-10 flex justify-center">
              <div className="relative">
                <LazyImage
                  src={profile1Image}
                  alt="Jonathan Booto Ndondi"
                  className="w-40 h-40 md:w-60 md:h-60 rounded-full object-cover border-2 border-orange-500/30 shadow-[0_0_50px_rgba(255,140,0,0.15)]"
                  style={{ objectPosition: 'center 10%' }}
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 border-l-2 border-t-2 border-orange-500/20 rounded-full pointer-events-none"
                />
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection variant="slideUp" delay={0.4}>
            <h2 className="text-sm md:text-lg tracking-[0.4em] uppercase mb-4 text-orange-500 font-bold">
              Assurances Collectives • Entrepreneur • Paris
            </h2>
            <h1 className="text-5xl md:text-8xl font-serif font-bold mb-6 text-white leading-tight">
              Jonathan Booto <span className="italic font-light text-slate-200">Ndondi</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              Expert en <span className="text-white font-semibold">gestion de comptes</span> et ingénierie sociale pour les entreprises qui façonnent demain.
            </p>
          </AnimatedSection>

          <AnimatedSection variant="slideUp" delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate('/services')}
                className="px-10 py-4 bg-orange-500 text-white font-bold uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-900/40"
              >
                Solutions Entreprises
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-10 py-4 border border-white/30 text-white font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-[#191970] transition-all backdrop-blur-sm"
              >
                Prendre rendez-vous
              </button>
            </div>
          </AnimatedSection>
        </div>

        <div className="absolute bottom-10 z-20 flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Découvrir</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-px h-10 bg-gradient-to-b from-orange-500 to-transparent"
          />
        </div>
      </section>

      <Expertises />
      <ValueProposition />
      <Quote />
    </>
  );
}
