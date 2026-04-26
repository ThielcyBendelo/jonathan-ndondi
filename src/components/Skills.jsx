import { motion } from 'framer-motion';
import { 
  FaBalanceScale, FaGem, FaChalkboardTeacher, FaHandshake, 
  FaUserTie, FaRocket, FaGlobeAfrica, FaBook, 
  FaFemale, FaChartLine, FaGavel, FaHeartbeat, FaUsers, FaLightbulb 
} from 'react-icons/fa';

// Catégories de compétences pour Coach & Mentor
const skillCategories = [
  {
    title: "Accompagnement Stratégique",
    skills: [
      { name: "Business Mentoring", icon: FaRocket },
      { name: "Leadership Féminin", icon: FaFemale },
      { name: "Stratégie de Croissance", icon: FaChartLine },
      { name: "Éveil de la Jeunesse", icon: FaGlobeAfrica }
    ]
  },
  {
    title: "Expertise Juridique & Conformité",
    skills: [
      { name: "Droit des Affaires", icon: FaGavel },
      { name: "Structuration Légale", icon: FaBalanceScale },
      { name: "Protection des Droits", icon: FaHandshake },
      { name: "Conseil Éthique", icon: FaUserTie }
    ]
  },
  {
    title: "Outils de Transformation",
    skills: [
      { name: "Ateliers de Groupe", icon: FaUsers },
      { name: "Conférences Impact", icon: FaChalkboardTeacher },
      { name: "Édition & Écriture", icon: FaBook },
      { name: "Intelligence Émotionnelle", icon: FaHeartbeat }
    ]
  },
  {
    title: "Soft Skills & Vision",
    skills: [
      { name: "Prise de Parole", icon: FaLightbulb },
      { name: "Résilience Entrepreneuriale", icon: FaGem },
      { name: "Négociation Stratégique", icon: FaHandshake },
      { name: "Gestion du Changement", icon: FaUserTie }
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
    <section id="skills" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-500 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Style Cabinet & Mentorat */}
        <div className="mb-20 text-center md:text-left border-l-8 border-amber-600 pl-8">
          <h2 className="text-sm tracking-[0.4em] uppercase text-slate-400 font-bold mb-2">Expertises</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white italic">
            Savoir-faire <span className="font-light not-italic text-amber-600">& Impact</span>
          </h3>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-light max-w-2xl mt-6">
            L'alliance unique entre la rigueur du droit, la puissance du coaching et la vision d'auteur pour transformer votre potentiel en héritage.
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
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-amber-600 mb-10 border-b border-slate-200 dark:border-slate-800 pb-4">
                {category.title}
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {category.skills.map((skill, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="group flex flex-col items-center md:items-start p-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-amber-600 transition-all duration-500"
                  >
                    <div className="text-3xl mb-6 text-amber-600 group-hover:text-white transition-colors duration-500">
                      <skill.icon />
                    </div>
                    <span className="text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 group-hover:text-white transition-colors duration-500 text-center md:text-left">
                      {skill.name}
                    </span>
                    <div className="mt-4 h-px w-8 bg-amber-600 group-hover:w-full group-hover:bg-white transition-all duration-500"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Signature Finale */}
        <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">
            Défense • Mentorat • Transmission | Rebecca Kulufio
          </p>
        </div>
      </div>
    </section>
  );
}
