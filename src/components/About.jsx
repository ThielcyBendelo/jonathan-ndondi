import { about } from '../assets/assets.js';
import {
  profile1Image as profileImg,
  programmationImage as bgImage,
} from '../assets/assets.js';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import LazyImage from './LazyImage';
import GoogleMapsSection from './GoogleMapsSection';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <>
      <motion.section
        id="about"
        className="relative py-20 px-4 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.15)',
            opacity: 0.6,
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            variants={imageVariants}
            whileHover={{
              scale: 1.08,
              rotate: [0, -3, 3, 0],
              transition: { duration: 0.3 },
            }}
          >
            <LazyImage
              src={profileImg}
              alt="Profil"
              className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover mb-10 shadow-lg border-4 border-purple hover:scale-105 transition-transform duration-300"
              placeholder={
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-purple/20 to-pink/20 animate-pulse border-4 border-purple mb-10 shadow-lg" />
              }
            />
          </motion.div>
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-6"
            variants={textVariants}
          >
            <span className="text-2xl font-bold mb-3 bg-gradient-to-r from-red-500 to-red-300 to-red-200 text-transparent bg-clip-text">
              À propos de moi
            </span>
          </motion.h2>
          <motion.p
            className="text-lg text-gray-300 text-center leading-relaxed max-w-4xl mb-6"
            variants={textVariants}
          >
            {about}
          </motion.p>
          <motion.div
            className="text-base md:text-lg text-gray-200 border-t border-gray-700  text-center max-w-2xl space-y-4"
            variants={textVariants}
          >
            <p className='"border border-purple/40"'>
              <strong>Expertise complète :</strong> Louiscar.CRP offre une gamme complète de services en relations publiques et en maintenance système, assurant la visibilité de votre marque tout en garantissant la performance et la sécurité de vos infrastructures IT.
            </p>
            <p className='"border border-purple/40"'>
              <strong>Mes cértifications:</strong> Je suis certifié en gestion de projet (PMP), en sécurité informatique (CEH), et en administration système (Linux+), ce qui me permet d’apporter une expertise technique solide à mes fonctions de chargé de relations publiques.
            </p>
            <p className='"border border-purple/40"'>
              <strong>Accompagnement personnalisé :</strong> J'accompagne chaque client dans la définition de sa stratégie de communication et de maintenance, en proposant des solutions sur mesure adaptées à leurs besoins spécifiques et à leur secteur d’activité.
            </p>
            <p className='"border border-purple/40"'>
              <strong>Engagement qualité :</strong> Je respecte les délais et les budgets, tout en assurant une communication transparente et régulière avec mes clients pour garantir leur satisfaction à chaque étape du projet.
            </p>
            <p>
              <strong>Contactez-moi</strong> pour un devis gratuit, une démonstration, ou un rendez-vous dans nos bureaux à Kinshasa. Votre transformation digitale commence ici !
            </p>
          </motion.div>
        </div>
      </motion.section>
      <GoogleMapsSection />
    </>
  );
}
