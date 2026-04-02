import { useEffect } from 'react';

/**
 * Hook pour précharger intelligemment les composants
 * Utilise requestIdleCallback pour charger pendant les temps morts
 */
export const usePreloadComponents = () => {
  useEffect(() => {
    // Fonction pour précharger un composant
    const preloadComponent = (importFn) => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          importFn().catch(() => {
            // Ignore les erreurs de préchargement
          });
        });
      } else {
        // Fallback pour les navigateurs sans requestIdleCallback
        setTimeout(() => {
          importFn().catch(() => {
            // Ignore les erreurs de préchargement
          });
        }, 2000);
      }
    };

    // Précharger les composants après le chargement initial
    const timer = setTimeout(() => {
      preloadComponent(() => import('../components/Skills'));
      preloadComponent(() => import('../components/Experience'));
      preloadComponent(() => import('../components/ProjetSimple'));
      preloadComponent(() => import('../components/Work'));
      preloadComponent(() => import('../components/Contact'));
    }, 1000); // Attendre 1 seconde après le montage

    return () => clearTimeout(timer);
  }, []);
};

export default usePreloadComponents;
