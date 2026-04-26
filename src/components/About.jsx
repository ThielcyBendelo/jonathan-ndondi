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
      <section id="about" className="bg-white py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Colonne Image - Style Business Premium */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 border-[12px] border-slate-50 shadow-2xl overflow-hidden group">
                <LazyImage
                  src={rebecca}
                  alt="Rebecca Kulufio"
                  className="w-full h-[500px] md:h-[650px] object-cover hover:scale-105 transition-all duration-1000"
                  style={{ objectPosition: 'center 10%' }}
                />
              </div>
              {/* Élément décoratif Orange */}
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-orange-500 -z-0 hidden md:block opacity-10"></div>
            </motion.div>

            {/* Colonne Texte - Expertise & Vision */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            >
              <motion.h4 variants={textVariants} className="text-sm tracking-[0.4em] uppercase text-orange-500 mb-4 font-bold">
                Expertise & Leadership
              </motion.h4>
              
              <motion.h2 variants={textVariants} className="text-4xl md:text-6xl font-serif font-bold text-[#191970] mb-8 leading-tight">
                Sécuriser, <span className="italic text-orange-500">Anticiper</span> & Entreprendre.
              </motion.h2>

              <motion.p variants={textVariants} className="text-lg text-slate-600 leading-relaxed mb-10 font-light italic border-l-4 border-orange-500 pl-6">
                "Chargée de comptes spécialisée en assurances collectives, j'allie rigueur technique et vision entrepreneuriale pour protéger le capital le plus précieux des entreprises : l'humain."
              </motion.p>

              {/* Grille des piliers de compétences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t border-slate-100 pt-10">
                <motion.div variants={textVariants}>
                  <h5 className="font-bold text-[#191970] uppercase tracking-widest text-xs mb-3">Assurances Collectives</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Spécialiste en ingénierie sociale, j'optimise vos contrats santé et prévoyance pour garantir une protection sur-mesure à vos collaborateurs.
                  </p>
                </motion.div>

                <motion.div variants={textVariants}>
                  <h5 className="font-bold text-[#191970] uppercase tracking-widest text-xs mb-3">Gestion de Comptes</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Un accompagnement de proximité pour les entreprises parisiennes, alliant réactivité administrative et conseil stratégique de haut niveau.
                  </p>
                </motion.div>

                <motion.div variants={textVariants}>
                  <h5 className="font-bold text-[#191970] uppercase tracking-widest text-xs mb-3">Esprit Entrepreneur</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Résidente à Paris et entrepreneure, je comprends vos enjeux de croissance et transforme vos obligations légales en leviers de performance.
                  </p>
                </motion.div>

                <motion.div variants={textVariants} className="bg-[#191970] p-6 text-white self-center shadow-xl shadow-blue-900/20">
                  <p className="text-xs uppercase tracking-widest mb-2 font-bold text-orange-400">Une question technique ?</p>
                  <a href="/contact" className="text-sm border-b border-orange-500/50 hover:border-orange-500 transition-all pb-1 italic font-medium">
                    Planifier un audit de vos contrats →
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Section Localisation - Paris */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <h3 className="text-3xl font-serif italic text-[#191970]">Proximité & Réactivité</h3>
          <p className="text-orange-500 text-sm mt-2 font-bold tracking-widest uppercase">Basée à Paris, Île-de-France</p>
        </div>
        <PortfolioSection />
        <GoogleMapsSection />
      </section>
    </>
  );
}
