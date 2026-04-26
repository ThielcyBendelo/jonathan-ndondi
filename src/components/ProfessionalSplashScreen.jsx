import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoImages } from '../assets/assets.js';

export default function ProfessionalSplashScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Étapes de chargement version Cabinet & Mentorat
  const loadingSteps = useMemo(() => [
    { label: 'ANALYSE DU CADRE JURIDIQUE', duration: 800 },
    { label: 'PRÉPARATION DU DOSSIER STRATÉGIQUE', duration: 1000 },
    { label: 'ÉVALUATION DU POTENTIEL D\'IMPACT', duration: 700 },
    { label: 'FINALISATION DE L\'EXPÉRIENCE', duration: 500 },
  ], []);

  useEffect(() => {
    let progressInterval;
    let stepTimeout;

    if (currentStep < loadingSteps.length) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const target = (currentStep + 1) * (100 / loadingSteps.length);
          if (prev >= target) {
            clearInterval(progressInterval);
            return target;
          }
          return prev + 0.8; // Progression un peu plus rapide
        });
      }, 20);

      stepTimeout = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, loadingSteps[currentStep].duration);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => onComplete && onComplete(), 600);
      }, 400);
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [currentStep, onComplete, loadingSteps]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] text-white font-sans"
        >
          {/* Logo Central avec lueur Ambre */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 relative"
          >
            <img src={logoImages} alt="Logo" className="h-24 w-auto brightness-125" />
            <div className="absolute -inset-4 bg-amber-600/10 blur-3xl rounded-full" />
          </motion.div>

          {/* Container de progression */}
          <div className="w-64 md:w-80 relative z-10">
            <div className="flex justify-between items-end mb-3">
              <div className="overflow-hidden h-5">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentStep}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-[9px] uppercase tracking-[0.3em] text-amber-600 font-bold block"
                  >
                    {loadingSteps[currentStep]?.label}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[10px] tabular-nums text-gray-500 font-light">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Barre de progression : Style Luxe (Ambre sur Ardoise) */}
            <div className="h-[2px] w-full bg-gray-900 relative">
              <motion.div
                className="absolute left-0 top-0 h-full bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>

          {/* Slogan subtil en bas */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="absolute bottom-12 text-[10px] uppercase tracking-[0.5em] text-gray-400"
          >
            Défendre • Guider • Transmettre
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
