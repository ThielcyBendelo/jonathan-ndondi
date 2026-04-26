import { about } from '../assets/assets.js';
import { profileImage as rebecca } from '../assets/assets.js';
import { motion } from 'framer-motion';
import LazyImage from './LazyImage';
import PortfolioSection from "../components/PortfolioSection";
import GoogleMapsSection from './GoogleMapsSection';

export default function About() {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <>
      <section id="about" className="bg-slate-50 py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Colonne Image - Style Portrait de Prestige */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 border-[12px] border-white shadow-2xl overflow-hidden group">
                <LazyImage
                  src={rebecca}
                  alt="Rebecca Kulufio"
                  className="w-full h-[500px] md:h-[650px] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  style={{ objectPosition: 'center 10%' }}
                />
              </div>
              {/* Élément décoratif Ambre/Or */}
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-amber-600 -z-0 hidden md:block opacity-20"></div>
            </motion.div>

            {/* Colonne Texte - Triple Identité */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            >
              <motion.h4 variants={textVariants} className="text-sm tracking-[0.4em] uppercase text-amber-600 mb-4 font-bold">
                Le leadership au féminin
              </motion.h4>
              
              <motion.h2 variants={textVariants} className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                Défendre, <span className="italic text-amber-600">Guider</span> & Transmettre.
              </motion.h2>

              <motion.p variants={textVariants} className="text-lg text-slate-600 leading-relaxed mb-10 font-light italic border-l-4 border-amber-600 pl-6">
                "{about}"
              </motion.p>

              {/* Grille des piliers d'engagement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t border-slate-200 pt-10">
                <motion.div variants={textVariants}>
                  <h5 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-3">Expertise Juridique</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Avocate engagée, j'accompagne mes clients avec une rigueur absolue, assurant la protection de leurs intérêts et la conformité de leurs ambitions.
                  </p>
                </motion.div>

                <motion.div variants={textVariants}>
                  <h5 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-3">Vision Entrepreneuriale</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Coach et mentor, je transforme le potentiel des femmes africaines en leadership concret, favorisant l'émergence d'une nouvelle génération d'impact.
                  </p>
                </motion.div>

                <motion.div variants={textVariants}>
                  <h5 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-3">Plume & Éducation</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Auteur de livres dédiés à la jeunesse, je transmets des valeurs de résilience et d'excellence pour forger les citoyens de demain.
                  </p>
                </motion.div>

                <motion.div variants={textVariants} className="bg-amber-600 p-6 text-white self-center shadow-xl shadow-amber-900/20">
                  <p className="text-xs uppercase tracking-widest mb-2 font-bold">Besoin d'un accompagnement ?</p>
                  <a href="/contact" className="text-sm border-b border-white/50 hover:border-white transition-all pb-1 italic font-medium">
                    Planifier une séance de diagnostic →
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Section Maps - Localisation du Cabinet */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <h3 className="text-3xl font-serif italic text-slate-900">Le Cabinet & l'Espace Coaching</h3>
          <p className="text-amber-600 text-sm mt-2 font-bold tracking-widest uppercase">Kinshasa, République Démocratique du Congo</p>
        </div>
        <PortfolioSection />
        <GoogleMapsSection />
      </section>
    </>
  );
}
