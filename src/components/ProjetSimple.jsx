import React from 'react';
import { motion } from 'framer-motion';
import repo1 from '../assets/repo1.jpeg'; 
import repo2 from '../assets/repo2.jpeg'; 
import { FaChartLine, FaShieldAlt, FaArrowRight, FaBuilding, FaCheckCircle } from 'react-icons/fa';

const projects = [
  {
    id: 1,
    title: "Optimisation de Branche Santé",
    client: "PME Technologique - Paris",
    impact: "-15% de charges sociales",
    category: "Assurances Collectives",
    description: "Refonte complète du régime de frais de santé obligatoire. Mise en conformité avec la nouvelle CCN et déploiement d'un panier de soins haute performance.",
    metrics: ["Audit CCN complet", "Négociation assureur", "Accompagnement RH"],
    icon: <FaShieldAlt />,
    image: repo1, // Insérez votre image ici
  },
  {
    id: 2,
    title: "Audit de Prévoyance Cadre",
    client: "Cabinet de Conseil - Île-de-France",
    impact: "Zéro Risque URSSAF",
    category: "Expertise Conseil",
    description: "Mise en sécurité juridique des contrats de prévoyance suite à une fusion-acquisition. Alignement des garanties et sécurisation du passif social.",
    metrics: ["Sécurisation juridique", "Standardisation groupe", "Économie d'échelle"],
    icon: <FaChartLine />,
    image: repo2,  // Insérez votre image ici
  }
];

export default function ProjectsImpact() {
  return (
    <section id="projects" className="py-24 bg-white dark:bg-[#0f172a] px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête Institutionnel */}
        <div className="text-left mb-20 border-l-8 border-orange-500 pl-8">
          <h2 className="text-orange-500 uppercase tracking-[0.4em] text-sm font-bold mb-4">Réalisations & Valeur Ajoutée</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#191970] dark:text-white">
            Projets <span className="font-light italic text-orange-500">& Impact</span>
          </h3>
        </div>

        {/* Grille des Projets */}
        <div className="grid grid-cols-1 gap-16">
          {projects.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-900 overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 group"
            >
              {/* 1. Visuel de Gauche : Résultat & Icône */}
              <div className="lg:w-1/4 bg-[#191970] p-10 flex flex-col justify-center items-center text-center text-white relative">
                <div className="text-4xl text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                  {project.icon}
                </div>
                <span className="text-[9px] uppercase tracking-widest text-orange-300 font-bold mb-2">Résultat</span>
                <div className="text-xl font-serif font-bold italic">{project.impact}</div>
              </div>

              {/* 2. Image du Projet (NOUVEAU) */}
              <div className="lg:w-1/3 h-64 lg:h-auto relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#191970]/20 group-hover:bg-transparent transition-colors"></div>
              </div>

              {/* 3. Contenu Technique */}
              <div className="lg:w-2/3 p-10 flex flex-col justify-between bg-white dark:bg-slate-900">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-orange-500/10 text-orange-600 text-[10px] px-3 py-1 font-bold uppercase tracking-widest rounded-full">
                      {project.category}
                    </span>
                    <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
                      <FaBuilding className="text-orange-500" /> {project.client}
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-serif font-bold text-[#191970] dark:text-white mb-4">
                    {project.title}
                  </h4>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    {project.metrics.map((metric, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter text-slate-500">
                        <FaCheckCircle className="text-orange-500" /> {metric}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button className="flex items-center gap-3 text-[#191970] dark:text-orange-500 text-xs font-bold uppercase tracking-widest hover:gap-5 transition-all">
                    Analyse détaillée <FaArrowRight />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ... (Le reste du composant stats et CTA reste identique) */}
      </div>
    </section>
  );
}
