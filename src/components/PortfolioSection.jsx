import React from "react";
import { FaGraduationCap, FaHandsHelping, FaGlobeAfrica, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

const engagements = [
  {
    title: "Éveil de la Jeunesse",
    icon: <FaGraduationCap />,
    image: "https://unsplash.com",
    description: "Programmes de mentorat dans les universités pour préparer les étudiants aux réalités du marché juridique et entrepreneurial.",
    impact: "+500 jeunes coachés",
    tag: "Éducation",
  },
  {
    title: "Autonomisation des Femmes",
    icon: <FaHandsHelping />,
    image: "https://unsplash.com",
    description: "Accompagnement de femmes entrepreneures dans la structuration légale de leurs projets à fort impact social.",
    impact: "30+ Entreprises créées",
    tag: "Leadership",
  },
  {
    title: "Rayonnement Africain",
    icon: <FaGlobeAfrica />,
    image: "https://unsplash.com",
    description: "Conférences et plaidoyers pour une jeunesse africaine consciente de ses droits et actrice du changement continental.",
    impact: "Interventions Pan-Africaines",
    tag: "Impact Social",
  },
];

function PortfolioSection() {
  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-950" id="engagement">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête Impact */}
        <div className="text-center mb-20">
          <h2 className="text-amber-600 text-sm uppercase tracking-[0.4em] font-bold mb-4">Engagement & Jeunesse</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold italic dark:text-white">
            Bâtir l'Héritage <span className="font-light not-italic text-slate-500">par la Transmission</span>
          </h3>
          <p className="mt-6 text-slate-500 max-w-2xl mx-auto italic">
            "Mon engagement ne s'arrête pas au prétoire ; il se poursuit sur le terrain, aux côtés de ceux qui feront l'Afrique de demain."
          </p>
        </div>

        {/* Grille d'impact */}
        <div className="grid gap-12 md:grid-cols-3">
          {engagements.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="group flex flex-col h-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-sm overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              {/* Image avec Overlay Impact */}
              <div className="relative h-64 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 bg-amber-600 text-white text-[10px] px-3 py-1 font-bold uppercase tracking-widest">
                  {item.tag}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="text-amber-600 text-2xl mb-4">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-amber-600 transition-colors uppercase tracking-tight">
                  {item.title}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 font-light">
                  {item.description}
                </p>
                
                <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-600 italic tracking-wide">{item.impact}</span>
                  <FaChevronRight className="text-slate-300 group-hover:text-amber-600 group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PortfolioSection;
