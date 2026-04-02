import { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaGithub,
  FaExpand,
  FaCompress,
  FaDownload,
} from 'react-icons/fa';
import audioService from '../services/audioService';
import analyticsService from '../services/analyticsService';

const ProjectLightbox = ({
  isOpen,
  onClose,
  projects,
  currentIndex,
  onNavigate,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [openTime] = useState(Date.now());

  const currentProject = projects[currentIndex];

  // Navigation avec useCallback pour éviter les warnings de dépendance
  const handleNext = useCallback(() => {
    const newIndex = currentIndex < projects.length - 1 ? currentIndex + 1 : 0;
    onNavigate(newIndex);
    analyticsService.trackEvent('project_lightbox_navigate', {
      direction: 'next',
      projectId: projects[newIndex].id,
      category: 'portfolio',
    });
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, [currentIndex, projects, onNavigate]);

  const handlePrevious = useCallback(() => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : projects.length - 1;
    onNavigate(newIndex);
    analyticsService.trackEvent('project_lightbox_navigate', {
      direction: 'previous',
      projectId: projects[newIndex].id,
      category: 'portfolio',
    });
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, [currentIndex, projects, onNavigate]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    analyticsService.trackEvent('project_lightbox_fullscreen', {
      enabled: !isFullscreen,
      category: 'portfolio',
    });
  }, [isFullscreen]);

  const handleClose = useCallback(() => {
    analyticsService.trackEvent('project_lightbox_close', {
      projectId: currentProject?.id,
      timeSpent: Math.round((Date.now() - openTime) / 1000),
      category: 'portfolio',
    });
    onClose();
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    setIsFullscreen(false);
  }, [currentProject?.id, openTime, onClose]);

  // Gérer les touches du clavier
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, handleNext, handlePrevious, handleClose, toggleFullscreen]);

  // Bloquer le scroll du body quand la lightbox est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fonctions de zoom
  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3));
    audioService.playClick();
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
    audioService.playClick();
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    audioService.playClick();
  };

  if (!isOpen || !currentProject) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm ${
          isFullscreen ? 'bg-black' : ''
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleClose}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {/* Contrôles en haut */}
          <motion.div
            className={`absolute top-4 left-4 right-4 flex justify-between items-center z-50 ${
              isFullscreen ? 'opacity-0 hover:opacity-100' : ''
            } transition-opacity duration-300`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Info projet */}
            <div className="text-white">
              <h2 className="text-xl font-bold">{currentProject.title}</h2>
              <p className="text-gray-300 text-sm">
                {currentIndex + 1} / {projects.length}
              </p>
            </div>

            {/* Boutons contrôles */}
            <div className="flex items-center gap-2">
              {/* Zoom */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  zoomOut();
                }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                title="Zoom arrière"
              >
                <span className="text-lg">-</span>
              </button>

              <span className="text-white text-sm px-2">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  zoomIn();
                }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                title="Zoom avant"
              >
                <span className="text-lg">+</span>
              </button>

              {/* Reset zoom */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetZoom();
                }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                title="Reset zoom"
              >
                1:1
              </button>

              {/* Plein écran */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>

              {/* Fermer */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-white transition-colors"
                title="Fermer"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>

          {/* Navigation précédent */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 
                     rounded-full text-white transition-all z-40 hover:scale-110"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            title="Projet précédent"
          >
            <FaChevronLeft className="text-xl" />
          </motion.button>

          {/* Navigation suivant */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 
                     rounded-full text-white transition-all z-40 hover:scale-110"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            title="Projet suivant"
          >
            <FaChevronRight className="text-xl" />
          </motion.button>

          {/* Contenu principal */}
          <motion.div
            className="max-w-7xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full max-h-[90vh] overflow-hidden">
              {/* Image principale */}
              <div className="lg:col-span-2 flex items-center justify-center bg-white/5 rounded-xl overflow-hidden">
                <motion.img
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="max-w-full max-h-full object-contain cursor-move"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  }}
                  drag={zoomLevel > 1}
                  dragConstraints={{
                    left: -100,
                    right: 100,
                    top: -100,
                    bottom: 100,
                  }}
                  onDragStart={() => audioService.playClick()}
                  whileHover={{
                    scale: zoomLevel > 1 ? zoomLevel : zoomLevel * 1.02,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              {/* Détails du projet */}
              <motion.div
                className="bg-dark-200/80 backdrop-blur-sm rounded-xl p-6 overflow-y-auto"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-2xl font-bold text-white mb-2">
                  {currentProject.title}
                </h1>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {currentProject.description}
                </p>

                {/* Technologies */}
                {currentProject.technologies && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Technologies utilisées
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentProject.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple/20 text-purple-300 rounded-full text-sm
                                   border border-purple/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fonctionnalités */}
                {currentProject.features && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Fonctionnalités clés
                    </h3>
                    <ul className="space-y-2">
                      {currentProject.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-300"
                        >
                          <span className="w-2 h-2 bg-purple rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Liens d'action */}
                <div className="flex gap-3 mt-auto">
                  {currentProject.github && (
                    <a
                      href={currentProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        analyticsService.trackEvent('project_github_click', {
                          projectId: currentProject.id,
                          category: 'portfolio',
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 
                               text-white rounded-lg transition-colors"
                    >
                      <FaGithub />
                      Code
                    </a>
                  )}

                  {currentProject.demo && (
                    <a
                      href={currentProject.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        analyticsService.trackEvent('project_demo_click', {
                          projectId: currentProject.id,
                          category: 'portfolio',
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple to-pink 
                               text-white rounded-lg transition-all hover:scale-105"
                    >
                      <FaExternalLinkAlt />
                      Démo
                    </a>
                  )}

                  <button
                    onClick={() => {
                      // Simuler téléchargement ou partage
                      analyticsService.trackEvent('project_download_click', {
                        projectId: currentProject.id,
                        category: 'portfolio',
                      });
                      audioService.playSuccess();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 
                             text-white rounded-lg transition-colors"
                  >
                    <FaDownload />
                    Info
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectLightbox;
