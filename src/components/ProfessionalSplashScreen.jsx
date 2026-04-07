import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { logoImages } from '../assets/assets.js';

export default function ProfessionalSplashScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const loadingSteps = useMemo(() => [
    { label: 'ANALYSE DU SITE', duration: 800 },
    { label: 'CHARGEMENT DES PLANS 2D/3D', duration: 1000 },
    { label: 'RENDU DES MATÉRIAUX', duration: 700 },
    { label: 'FINALISATION DE LA MAQUETTE', duration: 500 },
  ], []);

  useEffect(() => {
    let progressInterval;
    let stepTimeout;

    if (currentStep < loadingSteps.length) {
      const step = loadingSteps[currentStep];
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const target = (currentStep + 1) * (100 / loadingSteps.length);
          if (prev >= target) {
            clearInterval(progressInterval);
            return target;
          }
          return prev + 0.5;
        });
      }, 20);

      stepTimeout = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, step.duration);
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#111111] text-white font-sans"
        >
          {/* Logo Central - Plus sobre */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <img src={logoImages} alt="Logo" className="h-20 w-auto grayscale brightness-200" />
          </motion.div>

          {/* Container de progression minimaliste */}
          <div className="w-64 md:w-80">
            <div className="flex justify-between items-end mb-2">
              <div className="overflow-hidden h-5">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentStep}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-[10px] uppercase tracking-[0.2em] text-gray-400 block"
                  >
                    {loadingSteps[currentStep]?.label}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[10px] tabular-nums text-gray-500">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Barre de progression : Filiforme et élégante */}
            <div className="h-[1px] w-full bg-gray-800 relative">
              <motion.div
                className="absolute left-0 top-0 h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>

          {/* Grille de fond subtile (Rappel des plans techniques) */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
             <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
