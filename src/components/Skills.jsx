import { motion } from 'framer-motion';
import { 
  FaDraftingCompass, FaCity, FaCube, FaShieldAlt, 
  FaUsers, FaLightbulb, FaTools, FaFileContract 
} from 'react-icons/fa';

// Catégories de compétences pour un Architecte Principal
const skillCategories = [
  {
    title: "Conception & Urbanisme",
    skills: [
      { name: "Design Architectural", icon: FaDraftingCompass },
      { name: "Urbanisme Durable", icon: FaCity },
      { name: "Aménagement d'Intérieur", icon: FaLightbulb },
      { name: "Analyse Foncière", icon: FaFileContract }
    ]
  },
  {
    title: "Expertise Technique & Numérique",
    skills: [
      { name: "Modélisation BIM", icon: FaCube },
      { name: "Infrastructure IT / CAO", icon: FaTools },
      { name: "Sécurité & Data Architecture", icon: FaShieldAlt },
      { name: "Maintenance Systèmes", icon: FaTools }
    ]
  },
  {
    title: "Logiciels Maitrisés",
    skills: [
      { name: "AUTOCAD", icon: FaDraftingCompass },
      { name: "MICROSOFT OFFICE", icon: FaFileContract },
      { name: "REVIT", icon: FaCube },
      { name: "SketchUp", icon: FaDraftingCompass },
      { name: "LUMION", icon: FaCube },
      { name: "VISION BIM", icon: FaTools },
  
    ]
  },
  {
    title: "Direction & Soft-Skills",
    skills: [
      { name: "Négociation & Stratégie", icon: FaUsers },
      { name: "Communication de Crise", icon: FaShieldAlt },
      { name: "Gestion de Projet (PMP)", icon: FaFileContract },
      { name: "Vulgarisation Technique", icon: FaLightbulb }
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
        
        {/* Header Style Studio */}
        <div className="mb-20 text-center md:text-left border-l-8 border-slate-900 dark:border-white pl-8">
          <h2 className="text-sm tracking-[0.4em] uppercase text-slate-400 font-bold mb-2">Expertises</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white italic">
            Compétences <span className="font-light not-italic text-slate-500">& Maîtrise</span>
          </h3>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-light max-w-2xl mt-6">
            L'alliance entre la vision spatiale de l'architecte et la rigueur de l'ingénierie numérique.
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
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-900 dark:text-white mb-10 border-b border-slate-200 dark:border-slate-800 pb-4">
                {category.title}
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {category.skills.map((skill, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="group flex flex-col items-center md:items-start p-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-900 dark:hover:bg-white transition-all duration-500"
                  >
                    <div className="text-3xl mb-6 text-slate-900 dark:text-white group-hover:text-white dark:group-hover:text-black transition-colors duration-500">
                      <skill.icon />
                    </div>
                    <span className="text-xs uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-300 dark:group-hover:text-slate-600 transition-colors duration-500">
                      {skill.name}
                    </span>
                    <div className="mt-4 h-px w-8 bg-slate-300 dark:bg-slate-700 group-hover:w-full group-hover:bg-white dark:group-hover:bg-black transition-all duration-500"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Signature Finale */}
        <div className="mt-24 pt-12 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-400">
            Ingénierie & Design certifiés | LEGACY Architects & co.
          </p>
        </div>
      </div>
    </section>
  );
}
