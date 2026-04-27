import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoImages } from '../assets/assets.js';

export default function ProfessionalSplashScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Étapes version Assurances & Entrepreneuriat
  const loadingSteps = useMemo(() => [
    { label: 'ANALYSE DE LA PROTECTION SOCIALE', duration: 800 },
    { label: 'AUDIT DE CONFORMITÉ CCN', duration: 1000 },
    { label: 'OPTIMISATION DU CAPITAL HUMAIN', duration: 700 },
    { label: 'SÉCURISATION DES ACTIFS', duration: 500 },
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
          return prev + 1.2; // Légèrement plus nerveux
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f172a] text-white font-sans"
        >
          {/* Logo Central avec lueur Orange */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 relative"
          >
            <img src={logoImages} alt="Logo" className="h-20 w-auto brightness-110" />
            <div className="absolute -inset-8 bg-orange-500/10 blur-3xl rounded-full" />
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
                    className="text-[9px] uppercase tracking-[0.3em] text-orange-500 font-black block"
                  >
                    {loadingSteps[currentStep]?.label || 'Lancement...'}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[10px] tabular-nums text-slate-500 font-bold">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Barre de progression : Orange sur Bleu Sombre */}
            <div className="h-[2px] w-full bg-slate-800 relative">
              <motion.div
                className="absolute left-0 top-0 h-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>

          {/* Slogan Business */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="absolute bottom-12 text-[10px] uppercase tracking-[0.5em] text-slate-400 font-medium"
          >
            Audit • Protection • Croissance
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
