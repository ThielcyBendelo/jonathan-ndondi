import { about } from '../assets/assets.js';
import { profileImage as jonathan } from '../assets/assets.js';
import { motion } from 'framer-motion';
import LazyImage from './LazyImage';
import GoogleMapsSection from './GoogleMapsSection';
import { FaGraduationCap, FaUniversity, FaAward } from 'react-icons/fa';

export default function About() {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Vos diplômes réels basés sur votre parcours assurance/juridique
  const educations = [
    {
      degree: "Master 2 Management de l’Assurance (Aspect technique, commercial et managérial de l’assurance).",
      institution: "École Nationale d’Assurance/Conservatoire Nationale des Arts et Métiers.",
      year: "2021-2022 ",
      projets: "Création d’un site internet de prévention contre les risques cyber au profit des TPE/PME."
    },
    {
      degree: "Master 2 Droit des assurances (Assurance de dommages et de personnes).",
      institution: "Université de Montpellier.",
      year: "2020-2021",
      projets: "L’article L.121-10 du Code des assurances : Analyses et perspectives » (Prix du meilleur mémoire)"
    },
    {
      degree: "Certification Expert en Protection Sociale",
      institution: "Organisme de Formation Pro",
      year: "2021",
      projets: "Ingénierie des dispositifs de santé, prévoyance et épargne salariale."
    }
  ];

  return (
    <>
      <section id="about" className="bg-white py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Colonne Image */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative z-10 border-[12px] border-slate-50 shadow-2xl overflow-hidden group">
                <LazyImage
                  src={jonathan}
                  alt="Jonathan Booto"
                  className="w-full h-[500px] md:h-[650px] object-cover hover:scale-105 transition-all duration-1000"
                  style={{ objectPosition: 'center 10%' }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-orange-500 -z-0 hidden md:block opacity-10"></div>
            </motion.div>

            {/* Colonne Texte */}
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

              {/* Grille des piliers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left border-t border-slate-100 pt-10">
                <motion.div variants={textVariants}>
                  <h5 className="font-bold text-[#191970] uppercase tracking-widest text-xs mb-3">Assurances Collectives</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Spécialiste en ingénierie sociale, j'optimise vos contrats santé et prévoyance pour garantir une protection sur-mesure.
                  </p>
                </motion.div>

                <motion.div variants={textVariants}>
                  <h5 className="font-bold text-[#191970] uppercase tracking-widest text-xs mb-3">Gestion de Comptes</h5>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Un accompagnement de proximité pour les entreprises parisiennes, alliant réactivité et conseil stratégique.
                  </p>
                </motion.div>
                
                {/* CTA Intégré */}
                <motion.div variants={textVariants} className="md:col-span-2 bg-[#191970] p-6 text-white shadow-xl shadow-blue-900/20">
  <p className="text-xs uppercase tracking-widest mb-2 font-bold text-orange-400">Une question technique ?</p>
  <a 
    href="https://wa.me/0033650092569." 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-sm border-b border-orange-500/50 hover:border-orange-500 transition-all pb-1 italic font-medium flex items-center gap-2 w-fit"
  >
    Planifier un audit de vos contrat →
  </a>
</motion.div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- NOUVELLE SECTION : FORMATIONS & DIPLÔMES --- */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3">
              <h4 className="text-xs uppercase tracking-[0.4em] text-orange-500 font-bold mb-4">Parcours Académique</h4>
              <h3 className="text-3xl font-serif font-bold text-[#191970] mb-6">Fondations <br /><span className="italic font-light">et Certifications</span></h3>
              <div className="text-4xl text-[#191970]/10"><FaGraduationCap /></div>
            </div>
            
            <div className="md:w-2/3 grid gap-6 w-full">
              {educations.map((edu, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 10 }}
                  className="bg-white p-8 border-l-4 border-[#191970] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                >
                  <div className="flex gap-4 items-start">
                    <div className="mt-1 text-orange-500"><FaUniversity size={18} /></div>
                    <div>
                      <h5 className="font-bold text-[#191970] uppercase tracking-tight">{edu.degree}</h5>
                      <p className="text-sm text-slate-500 mt-1">{edu.institution}</p>
                      <p className="text-xs text-slate-400 mt-2 italic">{edu.projets}</p>
                    </div>
                  </div>
                  <div className="px-4 py-1 bg-slate-100 text-[#191970] text-[10px] font-bold tracking-widest rounded-full border border-slate-200">
                    {edu.year}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Localisation */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-12">
          <h3 className="text-3xl font-serif italic text-[#191970]">Proximité & Réactivité</h3>
          <p className="text-orange-500 text-sm mt-2 font-bold tracking-widest uppercase">Basée à Paris, Île-de-France</p>
        </div>
        <GoogleMapsSection />
      </section>
    </>
  );
}
