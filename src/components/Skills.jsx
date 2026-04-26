import { motion } from 'framer-motion';
import { 
  FaShieldAlt, FaRocket, FaHandshake, FaChartBar, 
  FaUserTie, FaBuilding, FaSearchDollar, FaFileContract, 
  FaUsers, FaLightbulb, FaBriefcase, FaMicrophoneAlt 
} from 'react-icons/fa';

// Catégories de compétences pour Accompagnement PME & Entrepreneuriat
const skillCategories = [
  {
    title: "Ingénierie Sociale & Protection",
    skills: [
      { name: "Audit de Protection Sociale", icon: FaShieldAlt },
      { name: "Mise en conformité CCN", icon: FaFileContract },
      { name: "Optimisation de Branche", icon: FaSearchDollar },
      { name: "Santé & Prévoyance Collective", icon: FaBuilding }
    ]
  },
  {
    title: "Accompagnement du Dirigeant",
    skills: [
      { name: "Protection du Chef d'Entreprise", icon: FaUserTie },
      { name: "Conseil en Stratégie Business", icon: FaRocket },
      { name: "Épargne Salariale & Retraite", icon: FaChartBar },
      { name: "Négociation Grands Comptes", icon: FaHandshake }
    ]
  },
  {
    title: "Expertise Opérationnelle",
    skills: [
      { name: "Gestion des Mouvements RH", icon: FaUsers },
      { name: "Veille Réglementaire URSSAF", icon: FaBriefcase },
      { name: "Pilotage de Sinistralité", icon: FaChartBar },
      { name: "Audit de Charges Sociales", icon: FaSearchDollar }
    ]
  },
  {
    title: "Soft Skills & Leadership",
    skills: [
      { name: "Communication Stratégique", icon: FaLightbulb },
      { name: "Prise de Parole (Keynote)", icon: FaMicrophoneAlt },
      { name: "Gestion de la Relation Client", icon: FaHandshake },
      { name: "Vision Entrepreneuriale", icon: FaRocket }
    ]
  }
];

export default function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="skills" className="py-24 bg-white dark:bg-[#0f172a] transition-colors duration-500 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Institutionnel - Style Cabinet d'Expertise */}
        <div className="mb-20 text-center md:text-left border-l-8 border-orange-500 pl-8">
          <h2 className="text-sm tracking-[0.4em] uppercase text-slate-400 font-bold mb-2">Expertises PME</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#191970] dark:text-white uppercase tracking-tighter">
            Conseil <span className="font-light italic text-orange-500">& Performance</span>
          </h3>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-light max-w-3xl mt-6">
            L'alliance stratégique entre l'ingénierie des assurances et l'accompagnement entrepreneurial pour sécuriser votre croissance et valoriser votre capital humain.
          </p>
        </div>

        {/* Grille par catégories */}
        <div className="space-y-20">
          {skillCategories.map((category, catIdx) => (
            <motion.div 
              key={catIdx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-orange-600 mb-10 border-b border-slate-200 dark:border-slate-800 pb-4">
                {category.title}
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {category.skills.map((skill, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="group flex flex-col items-center md:items-start p-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-[#191970] transition-all duration-500 shadow-sm hover:shadow-2xl"
                  >
                    <div className="text-3xl mb-6 text-orange-500 group-hover:text-white transition-colors duration-500">
                      <skill.icon />
                    </div>
                    <span className="text-[11px] uppercase tracking-widest font-bold text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors duration-500 text-center md:text-left">
                      {skill.name}
                    </span>
                    <div className="mt-4 h-px w-8 bg-orange-500 group-hover:w-full group-hover:bg-orange-400 transition-all duration-500"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Signature Finale - Style Expertise Parisienne */}
        <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold">
            Audit • Protection • Croissance | Rebecca Kulufio - Paris
          </p>
        </div>
      </div>
    </section>
  );
}
