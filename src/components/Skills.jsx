import { skills } from '../assets/assets.js';
import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaGitAlt,
} from 'react-icons/fa';
import { SiJavascript } from 'react-icons/si';
import { MdDevices } from 'react-icons/md';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// Map skill label -> icon component
const skillIcons = {
  JavaScript: SiJavascript,
  React: FaReact,
  HTML: FaHtml5,
  CSS: FaCss3Alt,
  'Node.js': FaNodeJs,
  Git: FaGitAlt,
  'Responsive Design': MdDevices,
};

export default function Skills() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.section
      id="skills"
      className="py-20 px-4 bg-black border-0"
      style={{
        fontFamily: 'Saira, Arial, Helvetica, sans-serif',
        zIndex: 1000,
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="container mx-auto">
        <motion.h1
          className="text-4xl md:text-4xl font-extrabold text-center mt-5 bg-gradient-to-r from-red-500 to-red-300 to-red-200 text-transparent bg-clip-text"
          variants={itemVariants}
        >
          Compétences
        </motion.h1>
        <motion.p
          className="text-lg text-center text-gray-400 mb-10"
          variants={itemVariants}
        >
          Compétences techniques et humaines pour des projets réussis.
        </motion.p>
      </div>
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-center mb-4"
        variants={itemVariants}
      >
        <span className="bg-gradient-to-r from-red-500 to-red-300 to-red-200 text-transparent bg-clip-text">
      Négociation, communication de crise, vulgarisation technique, gestion de projet.
        </span>
      </motion.h2>
      <motion.p
        className="text-lg text-center text-gray-400 mb-10"
        variants={itemVariants}
      >
        Soft-Skills, Système & Réseau, Communication, Sécurité
      </motion.p>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
        >
          {skills.map((skill, idx) => {
            const Icon = skillIcons[skill];
            return (
              <motion.div
                key={idx}
                className="group card-base card-interactive card-hover-scale p-4 sm:p-5 text-center select-none"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-dark-200
                                ring-1 ring-white/5 group-hover:ring-[var(--accent-1)]/40 transition-all shadow-inner"
                >
                  {Icon ? (
                    <Icon className="h-6 w-6 text-gray-200 group-hover:drop-shadow-glow" />
                  ) : (
                    <span className="text-gray-300 text-lg">{skill[0]}</span>
                  )}
                </div>
                <span className="text-gray-200 font-medium tracking-wide">
                  {skill}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
    </motion.section>
  );
}

export function SkillsSection() {
  return (
    <motion.section
      id="skills"
      className="py-20 px-4 bg-black border-0"
      style={{
        fontFamily: 'Saira, Arial, Helvetica, sans-serif',
        zIndex: 1000,
      }}
    >
    <Skills />
    </motion.section>
  );
}
