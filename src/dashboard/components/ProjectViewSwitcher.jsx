import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectViewSwitcher({
  currentView,
  onViewChange,
  projects = [],
  onProjectSelect,
  onOpenLightbox,
}) {
  const [hoveredProject, setHoveredProject] = useState(null);

  const views = [
    { id: 'grid', name: 'Grille', icon: '⊞', description: 'Vue en cartes' },
    { id: 'list', name: 'Liste', icon: '☰', description: 'Vue détaillée' },
    { id: 'kanban', name: 'Kanban', icon: '📋', description: 'Tableau agile' },
    {
      id: 'timeline',
      name: 'Timeline',
      icon: '📅',
      description: 'Vue chronologique',
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: '📊',
      description: 'Graphiques',
    },
    {
      id: 'gallery',
      name: 'Galerie',
      icon: '🖼️',
      description: 'Mode portfolio',
    },
  ];

  const statusColumns = {
    PENDING: {
      label: 'En attente',
      color: 'from-yellow-500 to-orange-500',
      icon: '⏳',
    },
    IN_PROGRESS: {
      label: 'En cours',
      color: 'from-blue-500 to-cyan-500',
      icon: '🔄',
    },
    REVIEW: {
      label: 'En révision',
      color: 'from-purple-500 to-pink-500',
      icon: '👀',
    },
    COMPLETED: {
      label: 'Terminé',
      color: 'from-green-500 to-emerald-500',
      icon: '✅',
    },
    CANCELLED: {
      label: 'Annulé',
      color: 'from-red-500 to-red-600',
      icon: '❌',
    },
  };

  const getProjectsByStatus = (status) => {
    return projects.filter((project) => project.status === status);
  };

  const ProjectCard = ({ project, compact = false, showImage = false }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5, shadow: '0 20px 40px rgba(0,0,0,0.3)' }}
      onHoverStart={() => setHoveredProject(project.id)}
      onHoverEnd={() => setHoveredProject(null)}
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        compact ? 'p-4' : 'p-6'
      }`}
      onClick={() => onProjectSelect(project)}
    >
      {/* Image si mode galerie */}
      {showImage && project.image && (
        <div className="relative mb-4 rounded-xl overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenLightbox(project);
            }}
            className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3
            className={`font-bold text-white ${
              compact ? 'text-sm' : 'text-lg'
            } line-clamp-2`}
          >
            {project.title}
          </h3>
          <p
            className={`text-white/60 ${compact ? 'text-xs' : 'text-sm'} mt-1`}
          >
            {project.client?.name}
          </p>
        </div>

        {!compact && (
          <div className="flex flex-col items-end space-y-1">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                statusColumns[project.status]?.color
                  ? `bg-gradient-to-r ${
                      statusColumns[project.status].color
                    } text-white`
                  : 'bg-gray-500/20 text-gray-300'
              }`}
            >
              {statusColumns[project.status]?.icon}{' '}
              {statusColumns[project.status]?.label}
            </span>
            {project.priority && (
              <span className="px-2 py-1 text-xs bg-white/10 text-white/70 rounded-full">
                {project.priority}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progression */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-white/70 text-xs">Progression</span>
          <span className="text-white font-medium text-sm">
            {project.progress}%
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {project.technologies.slice(0, compact ? 2 : 4).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/10 text-white/70 rounded-md text-xs"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > (compact ? 2 : 4) && (
            <span className="px-2 py-1 bg-white/10 text-white/50 rounded-md text-xs">
              +{project.technologies.length - (compact ? 2 : 4)}
            </span>
          )}
        </div>
      )}

      {/* Actions au hover */}
      <AnimatePresence>
        {hoveredProject === project.id && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex gap-2 mt-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenLightbox(project);
              }}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
            >
              🎨 Showcase
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="py-2 px-3 bg-white/10 backdrop-blur-sm text-white rounded-lg text-sm hover:bg-white/20 transition-all duration-200"
            >
              📋
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        );

      case 'list':
        return (
          <div className="space-y-4">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                layout
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {project.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          statusColumns[project.status]?.color
                            ? `bg-gradient-to-r ${
                                statusColumns[project.status].color
                              } text-white`
                            : 'bg-gray-500/20 text-gray-300'
                        }`}
                      >
                        {statusColumns[project.status]?.icon}{' '}
                        {statusColumns[project.status]?.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-white/70">
                      <span>👤 {project.client?.name}</span>
                      <span>📧 {project.client?.email}</span>
                      <span>
                        📅{' '}
                        {new Date(project.createdAt).toLocaleDateString(
                          'fr-FR'
                        )}
                      </span>
                      {project.budget && <span>💰 {project.budget}</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {project.progress}%
                      </div>
                      <div className="text-xs text-white/50">Progression</div>
                    </div>
                    <button
                      onClick={() => onOpenLightbox(project)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      🎨 Showcase
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'kanban':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {Object.entries(statusColumns).map(([status, config]) => {
              const statusProjects = getProjectsByStatus(status);
              return (
                <div key={status} className="space-y-4">
                  <div
                    className={`bg-gradient-to-r ${config.color} p-4 rounded-2xl`}
                  >
                    <h3 className="font-bold text-white text-center">
                      {config.icon} {config.label}
                    </h3>
                    <p className="text-white/80 text-center text-sm">
                      {statusProjects.length} projet
                      {statusProjects.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="space-y-3 min-h-[400px]">
                    {statusProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} compact />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'gallery':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} showImage />
            ))}
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-6">
            {projects
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-6 ${
                    index % 2 === 0 ? '' : 'flex-row-reverse'
                  }`}
                >
                  <div className="flex-1">
                    <ProjectCard project={project} />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                    {index < projects.length - 1 && (
                      <div className="w-px h-24 bg-gradient-to-b from-blue-500/50 to-transparent" />
                    )}
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-white font-medium">
                      {new Date(project.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-white/60 text-sm">Création</div>
                  </div>
                </motion.div>
              ))}
          </div>
        );

      case 'analytics':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique par statut */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                Répartition par Statut
              </h3>
              <div className="space-y-4">
                {Object.entries(statusColumns).map(([status, config]) => {
                  const count = getProjectsByStatus(status).length;
                  const percentage =
                    projects.length > 0 ? (count / projects.length) * 100 : 0;
                  return (
                    <div
                      key={status}
                      className="flex items-center justify-between"
                    >
                      <span className="text-white text-sm">
                        {config.icon} {config.label}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-white/10 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${config.color} h-2 rounded-full transition-all duration-1000`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium w-12 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progression moyenne */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Performance</h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {Math.round(
                      projects.reduce((acc, p) => acc + p.progress, 0) /
                        projects.length || 0
                    )}
                    %
                  </div>
                  <div className="text-white/60">Progression Moyenne</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-white/70 text-sm">
                    <span>Projets Terminés</span>
                    <span>{getProjectsByStatus('COMPLETED').length}</span>
                  </div>
                  <div className="flex justify-between text-white/70 text-sm">
                    <span>En Cours</span>
                    <span>{getProjectsByStatus('IN_PROGRESS').length}</span>
                  </div>
                  <div className="flex justify-between text-white/70 text-sm">
                    <span>Budget Total</span>
                    <span>
                      €
                      {projects
                        .reduce((acc, p) => {
                          const budget =
                            p.budget?.replace(/[€,\s]/g, '') || '0';
                          return acc + parseInt(budget);
                        }, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de vue */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Mode d'Affichage</h3>
          <span className="text-white/60 text-sm">
            {projects.length} projet{projects.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {views.map((view) => (
            <motion.button
              key={view.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewChange(view.id)}
              className={`p-4 rounded-xl text-center transition-all duration-200 ${
                currentView === view.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              <div className="text-2xl mb-2">{view.icon}</div>
              <div className="text-sm font-medium">{view.name}</div>
              <div className="text-xs opacity-70 mt-1">{view.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Contenu de la vue */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
