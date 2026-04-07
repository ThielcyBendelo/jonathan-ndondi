import { about } from '../assets/assets.js';
import { profile1Image as ibramus } from '../assets/assets.js';
import { motion } from 'framer-motion';
import LazyImage from './LazyImage';
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
            
            {/* Colonne Image - Style Portrait Galerie */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 border-[12px] border-white shadow-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                <LazyImage
                  src={ibramus}
                  alt="Ibrahim Muswema"
                  className="w-full h-[500px] md:h-[650px] object-cover"
                  style={{ objectPosition: 'center 10%' }}
                />
              </div>
              {/* Carré décoratif architectural en arrière-plan */}
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-slate-900 -z-0 hidden md:block"></div>
            </motion.div>

            {/* Colonne Texte - Vision de l'Architecte */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            >
              <motion.h4 variants={textVariants} className="text-sm tracking-[0.4em] uppercase text-slate-400 mb-4 font-bold">
                L'Homme derrière la structure
              </motion.h4>
              
              <motion.h2 variants={textVariants} className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-8 leading-tight">
                Bâtir avec <span className="italic text-slate-500">Précision</span> & Héritage.
              </motion.h2>

              <motion.p variants={textVariants} className="text-lg text-slate-600 leading-relaxed mb-10 font-light italic">
                "{about}"
              </motion.p>

              {/* Grille de compétences clés */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t border-slate-200 pt-10">
                <motion.div variants={textVariants}>
                  <h5 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-3">Expertise Complète</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    De la conception bioclimatique à la maîtrise d'œuvre complexe, LEGACY Architects assure une fusion entre esthétique moderne et normes techniques rigoureuses.
                  </p>
                </motion.div>

                <motion.div variants={textVariants}>
                  <h5 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-3">Engagement Qualité</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Chaque projet est traité comme une œuvre unique, respectant strictement les budgets et les délais, avec une transparence totale envers nos partenaires.
                  </p>
                </motion.div>

                <motion.div variants={textVariants}>
                  <h5 className="font-bold text-slate-900 uppercase tracking-widest text-xs mb-3">Diplômes & Vision</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Architecte certifié, j'intègre des solutions durables et innovantes pour répondre aux défis urbains contemporains à Kinshasa et ailleurs.
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    En tant qu'Architecte Associé de LEGACY ARCHITECTS, ma mission est de créer des espaces qui inspirent et perdurent à travers le temps.
                  </p>
                </motion.div>

                <motion.div variants={textVariants} className="bg-slate-900 p-6 text-white self-center">
                  <p className="text-xs uppercase tracking-widest mb-2 font-bold">Prêt pour votre projet ?</p>
                  <a href="/contact" className="text-sm border-b border-white/50 hover:border-white transition-all pb-1 italic">
                    Demander une consultation →
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Section Maps avec un titre propre */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <h3 className="text-2xl font-serif italic text-slate-900">Retrouvez-nous au bureau</h3>
          <p className="text-slate-500 text-sm mt-2">Kinshasa, République Démocratique du Congo</p>
        </div>
        <GoogleMapsSection />
      </section>
    </>
  );
}
