import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import projectService from '../services/projectService';
import ProjectFullscreenLightbox from '../components/ProjectFullscreenLightbox';
import TestimonialsSystem from '../components/TestimonialsSystem';
import AdvancedProjectFilters from '../components/AdvancedProjectFilters';
import ProjectViewSwitcher from '../components/ProjectViewSwitcher';
import AdvancedExportSystem from '../components/AdvancedExportSystem';

export default function ProjectsPage() {
  console.log('🚀 ProjectsPage chargée avec améliorations!');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'details', 'edit', 'timeline'
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxProjectIndex, setLightboxProjectIndex] = useState(0);
  const [currentView, setCurrentView] = useState('grid');
  const [_showExportModal, _setShowExportModal] = useState(false);

  // Définir les fonctions AVANT les useEffect
  const loadProjects = () => {
    const allProjects = projectService.getProjects();
    setProjects(allProjects);
  };

  const loadStats = () => {
    const projectStats = projectService.getProjectStats();
    setStats(projectStats);
  };

  const applyFilters = useCallback(() => {
    // Utiliser le state projects au lieu d'appeler le service
    let filtered = [...projects];

    // Filtrage par recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.name?.toLowerCase().includes(searchLower) ||
          project.description?.toLowerCase().includes(searchLower) ||
          project.clientName?.toLowerCase().includes(searchLower)
      );
    }

    // Filtrage par statut
    if (filters.status) {
      filtered = filtered.filter(
        (project) => project.status === filters.status
      );
    }

    // Filtrage par priorité
    if (filters.priority) {
      filtered = filtered.filter(
        (project) => project.priority === filters.priority
      );
    }

    // Tri
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];

      if (filters.sortOrder === 'desc') {
        return aValue > bValue ? -1 : 1;
      }
      return aValue < bValue ? -1 : 1;
    });

    setFilteredProjects(filtered);
  }, [projects, filters]);

  // useEffect pour charger les projets au montage
  useEffect(() => {
    loadProjects();
    loadStats();
  }, []);

  // useEffect pour appliquer les filtres quand ils changent
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const _handleStatusChange = (projectId, newStatus, comment = '') => {
    projectService.changeStatus(projectId, newStatus, comment);
    loadProjects();
    loadStats();
    toast.success('Statut mis à jour avec succès');
  };

  const _handleProgressUpdate = (projectId, progress) => {
    projectService.updateProgress(projectId, progress);
    loadProjects();
    toast.success('Progression mise à jour');
  };

  const openModal = (type, project = null) => {
    setModalType(type);
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    setModalType('');
  };

  // Fonctions Lightbox
  const openLightbox = (projectIndex) => {
    setLightboxProjectIndex(projectIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextProject = () => {
    setLightboxProjectIndex((prev) =>
      prev < filteredProjects.length - 1 ? prev + 1 : 0
    );
  };

  const prevProject = () => {
    setLightboxProjectIndex((prev) =>
      prev > 0 ? prev - 1 : filteredProjects.length - 1
    );
  };

  if (!stats) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-300 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-dark-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* Header avec statistiques */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">IR</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🎨 Gestion des Projets MODERNISÉ ✨
              </h1>
              <p className="text-slate-300">
                Gérez tous vos projets clients avec un suivi avancé
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => openLightbox(0)}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105 animate-pulse"
            >
              🚀 TEST LIGHTBOX
            </button>
            <button
              onClick={() => _setShowExportModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              📤 Export Avancé
            </button>
            <button
              onClick={() => openModal('create')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              ➕ Nouveau Projet
            </button>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatsCard title="Total" value={stats.total} icon="📋" color="blue" />
          <StatsCard
            title="En cours"
            value={stats.byStatus.IN_PROGRESS || 0}
            icon="🔄"
            color="blue"
          />
          <StatsCard
            title="Terminés"
            value={stats.byStatus.COMPLETED || 0}
            icon="✅"
            color="green"
          />
          <StatsCard
            title="Urgents"
            value={stats.urgentProjects}
            icon="🚨"
            color="red"
          />
          <StatsCard
            title="Budget Total"
            value={`€${stats.totalBudget.toLocaleString()}`}
            icon="💰"
            color="purple"
          />
        </div>
      </header>

      {/* Filtres avancés */}
      <div className="mb-8">
        <AdvancedProjectFilters
          filters={filters}
          onFiltersChange={setFilters}
          projects={filteredProjects}
          statusTypes={projectService.statusTypes}
          priorityTypes={projectService.priorityTypes}
        />
      </div>

      {/* Système de vues multiples */}
      <div className="mb-8">
        <ProjectViewSwitcher
          currentView={currentView}
          onViewChange={setCurrentView}
          projects={filteredProjects}
          onProjectSelect={(project) => openModal('details', project)}
          onOpenLightbox={(project) => {
            const index = filteredProjects.findIndex(
              (p) => p.id === project.id
            );
            openLightbox(index);
          }}
        />
      </div>

      {/* Message si aucun projet */}
      {filteredProjects.length === 0 && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Aucun projet trouvé
          </h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            {filters.search || filters.status || filters.priority
              ? 'Essayez de modifier vos filtres pour afficher plus de projets'
              : 'Commencez par créer votre premier projet pour voir vos réalisations'}
          </p>
          <button
            onClick={() => openModal('create')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            ➕ Créer mon premier projet
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProjectModal
          type={modalType}
          project={selectedProject}
          onClose={closeModal}
          onUpdate={() => {
            loadProjects();
            loadStats();
          }}
        />
      )}

      {/* Lightbox Plein Écran */}
      <ProjectFullscreenLightbox
        project={filteredProjects[lightboxProjectIndex]}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextProject}
        onPrev={prevProject}
        totalCount={filteredProjects.length}
        currentIndex={lightboxProjectIndex}
      />

      {/* Section Témoignages */}
      <div className="mt-16">
        <TestimonialsSystem />
      </div>
    </div>
  );
}

// Composant carte de statistiques
function StatsCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    green: 'from-green-500/20 to-green-600/20 text-green-400',
    red: 'from-red-500/20 to-red-600/20 text-red-400',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400',
    orange: 'from-orange-500/20 to-orange-600/20 text-orange-400',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} p-4 rounded-lg border border-dark-400`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-lg`}
        >
          {icon}
        </div>
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-white text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Composant carte de projet
function ProjectCard({
  project,
  onStatusChange,
  _onProgressUpdate,
  onOpenDetails,
  onOpenTimeline,
  onOpenLightbox,
}) {
  const status = projectService.statusTypes[project.status];
  const priority = projectService.priorityTypes[project.priority];

  const statusColors = {
    yellow: 'bg-yellow-500/20 text-yellow-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    green: 'bg-green-500/20 text-green-400',
    red: 'bg-red-500/20 text-red-400',
    orange: 'bg-orange-500/20 text-orange-400',
    gray: 'bg-gray-500/20 text-gray-400',
  };

  return (
    <div className="bg-dark-300 rounded-2xl p-6 border border-dark-400 hover:border-purple/30 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Info principale */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">
              {project.title}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                statusColors[status.color]
              }`}
            >
              {status.icon} {status.label}
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                statusColors[priority.color]
              }`}
            >
              {priority.label}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
            <span>👤 {project.client.name}</span>
            <span>📧 {project.client.email}</span>
            <span>
              📅 {new Date(project.createdAt).toLocaleDateString('fr-FR')}
            </span>
            {project.budget && <span>💰 {project.budget}</span>}
          </div>

          {/* Barre de progression */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Progression</span>
              <span className="text-white font-medium">
                {project.progress}%
              </span>
            </div>
            <div className="w-full bg-dark-400 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple to-pink h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {project.description && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col lg:flex-row gap-2">
          <button
            onClick={onOpenLightbox}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            🎨 Showcase
          </button>
          <button
            onClick={onOpenDetails}
            className="px-4 py-2 bg-dark-400 text-white rounded-lg hover:bg-dark-200 transition-colors"
          >
            Détails
          </button>
          <button
            onClick={onOpenTimeline}
            className="px-4 py-2 bg-dark-400 text-white rounded-lg hover:bg-dark-200 transition-colors"
          >
            Timeline
          </button>

          {/* Quick status change */}
          <select
            value={project.status}
            onChange={(e) => onStatusChange(project.id, e.target.value)}
            className="px-3 py-2 bg-dark-400 border border-dark-400 rounded-lg text-white text-sm"
          >
            {Object.entries(projectService.statusTypes).map(([key, type]) => (
              <option key={key} value={key}>
                {type.icon} {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Modal de projet
function ProjectModal({ type, project, onClose, onUpdate }) {
  const [_activeTab, _setActiveTab] = useState('details');

  if (type === 'timeline') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-300 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Timeline - {project.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {project.timeline.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-purple rounded-full"></div>
                  {index < project.timeline.length - 1 && (
                    <div className="w-px h-16 bg-dark-400 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{event.event}</h4>
                    <span className="text-sm text-gray-400">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-1">
                    {event.description}
                  </p>
                  <span className="text-xs text-gray-500">
                    Par {event.author}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-300 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {project ? `Projet - ${project.title}` : 'Nouveau Projet'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {project && (
          <ProjectDetails
            project={project}
            onUpdate={onUpdate}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

// Composant détails de projet
function ProjectDetails({ project, onUpdate, _onClose }) {
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsAddingComment(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      projectService.addComment(project.id, newComment);
      setNewComment('');
      onUpdate();
      toast.success('Commentaire ajouté');
    } finally {
      setIsAddingComment(false);
    }
  };

  const status = projectService.statusTypes[project.status];
  const priority = projectService.priorityTypes[project.priority];

  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Informations Client
            </h3>
            <div className="bg-dark-200 p-4 rounded-lg space-y-2">
              <p>
                <span className="text-gray-400">Nom :</span>{' '}
                <span className="text-white">{project.client.name}</span>
              </p>
              <p>
                <span className="text-gray-400">Email :</span>{' '}
                <span className="text-white">{project.client.email}</span>
              </p>
              {project.client.phone && (
                <p>
                  <span className="text-gray-400">Téléphone :</span>{' '}
                  <span className="text-white">{project.client.phone}</span>
                </p>
              )}
              {project.client.company && (
                <p>
                  <span className="text-gray-400">Entreprise :</span>{' '}
                  <span className="text-white">{project.client.company}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Détails du Projet
            </h3>
            <div className="bg-dark-200 p-4 rounded-lg space-y-2">
              <p>
                <span className="text-gray-400">Statut :</span>{' '}
                <span className="text-white">
                  {status.icon} {status.label}
                </span>
              </p>
              <p>
                <span className="text-gray-400">Priorité :</span>{' '}
                <span className="text-white">{priority.label}</span>
              </p>
              <p>
                <span className="text-gray-400">Progression :</span>{' '}
                <span className="text-white">{project.progress}%</span>
              </p>
              {project.budget && (
                <p>
                  <span className="text-gray-400">Budget :</span>{' '}
                  <span className="text-white">{project.budget}</span>
                </p>
              )}
              {project.deadline && (
                <p>
                  <span className="text-gray-400">Échéance :</span>{' '}
                  <span className="text-white">
                    {new Date(project.deadline).toLocaleDateString('fr-FR')}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
          <div className="bg-dark-200 p-4 rounded-lg">
            <p className="text-gray-300">{project.description}</p>
          </div>
        </div>
      )}

      {/* Technologies */}
      {project.technologies && project.technologies.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple/20 text-purple-300 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Commentaires */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Commentaires ({project.comments.length})
        </h3>

        {/* Ajouter un commentaire */}
        <div className="mb-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white 
                     focus:outline-none focus:ring-2 focus:ring-purple/50 resize-none"
            rows="3"
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim() || isAddingComment}
            className="mt-2 px-4 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                     hover:shadow-lg transition-all disabled:opacity-50"
          >
            {isAddingComment ? 'Ajout...' : 'Ajouter un commentaire'}
          </button>
        </div>

        {/* Liste des commentaires */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {project.comments.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Aucun commentaire pour le moment
            </p>
          ) : (
            project.comments.map((comment) => (
              <div key={comment.id} className="bg-dark-200 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-white">
                    {comment.author}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(comment.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-gray-300">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
