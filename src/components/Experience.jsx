import { experiences } from '../assets/assets.js';
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaHome,
  FaHandshake,
  FaGraduationCap,
} from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const roleIcon = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'internship':
    case 'stage':
      return FaGraduationCap;
    case 'contract':
    case 'freelance':
      return FaHandshake;
    case 'remote':
      return FaHome;
    case 'full-time':
    default:
      return FaBriefcase;
  }
};

export default function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.section
      id="experience"
      className="py-20 px-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-2"
          variants={itemVariants}
        >
          <span className="bg-gradient-to-r from-purple to-pink text-transparent bg-clip-text">
            Expérience
          </span>
        </motion.h2>
        <motion.p
          className="text-lg text-center text-gray-400 mb-10"
          variants={itemVariants}
        >
          Parcours professionnel et missions réalisées
        </motion.p>
        <motion.div className="space-y-6" variants={containerVariants}>
          {experiences.map((exp, idx) => {
            const Icon = roleIcon(exp.type);
            return (
              <motion.div
                key={idx}
                className="group card-base card-interactive p-6"
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  x: 10,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-300 ring-1 ring-white/5 shadow-inner">
                      <Icon className="h-5 w-5 text-red-500 group-hover:drop-shadow-glow" />
                    </div>
                    <h3 className="text-xl font-bold text-red-500 to-red-300 to-red-200">{exp.role}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-2">
                      <FaBuilding className="h-4 w-4 text-gray-300" />
                      <span className="text-blue-800">{exp.company}</span>
                    </div>
                    <div className="hidden md:block text-gray-600">•</div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="h-4 w-4 text-gray-300" />
                      <span>{exp.year}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {exp.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
