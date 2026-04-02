import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import projectService from '../services/projectService';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadProject();
  }, [projectId, loadProject]);

  const loadProject = useCallback(() => {
    setLoading(true);
    const projectData = projectService.getProject(projectId);

    if (!projectData) {
      toast.error('Projet introuvable');
      navigate('/admin/projects');
      return;
    }

    setProject(projectData);
    setEditData(projectData);
    setLoading(false);
  }, [projectId, navigate]);

  const handleStatusChange = (newStatus) => {
    const updatedProject = projectService.changeStatus(projectId, newStatus);
    if (updatedProject) {
      setProject(updatedProject);
      toast.success('Statut mis à jour avec succès');
    }
  };

  const handleProgressUpdate = (newProgress) => {
    const updatedProject = projectService.updateProgress(
      projectId,
      newProgress
    );
    if (updatedProject) {
      setProject(updatedProject);
      toast.success('Progression mise à jour');
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = projectService.addComment(projectId, newComment);
    if (comment) {
      loadProject(); // Recharger pour avoir les données à jour
      setNewComment('');
      toast.success('Commentaire ajouté');
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    const updatedProject = projectService.updateProject(projectId, editData);
    if (updatedProject) {
      setProject(updatedProject);
      setEditMode(false);
      toast.success('Projet mis à jour');
    }
  };

  const handleCancel = () => {
    setEditData(project);
    setEditMode(false);
  };

  const getPriorityStyle = (priority) => {
    const styles = {
      LOW: 'text-green-400',
      MEDIUM: 'text-yellow-400',
      HIGH: 'text-orange-400',
      URGENT: 'text-red-400',
    };
    return styles[priority] || 'text-gray-400';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl text-gray-400">Projet introuvable</h2>
        <Link
          to="/admin/projects"
          className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
        >
          ← Retour aux projets
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* En-tête */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/projects"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Retour aux projets
          </Link>

          <div className="h-6 w-px bg-gray-600"></div>

          <div>
            <h1 className="text-2xl font-bold text-white">{project.title}</h1>
            <p className="text-gray-400">ID: {project.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!editMode ? (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg text-gray-300 
                       hover:text-white hover:border-gray-500 transition-colors"
            >
              ✏️ Modifier
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ✅ Sauvegarder
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ❌ Annuler
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Statut et progression rapides */}
      <div className="bg-dark-300 rounded-xl p-6 border border-dark-400 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Statut */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Statut
            </label>
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white"
            >
              {Object.entries(projectService.statusTypes).map(
                ([key, status]) => (
                  <option key={key} value={key}>
                    {status.icon} {status.label}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Progression */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Progression ({project.progress}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={project.progress}
              onChange={(e) => handleProgressUpdate(parseInt(e.target.value))}
              className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Priorité */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Priorité
            </label>
            <div
              className={`px-3 py-2 rounded-lg border ${getPriorityStyle(
                project.priority
              )} border-current/30`}
            >
              {projectService.priorityTypes[project.priority]?.label}
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex space-x-1 mb-6 bg-dark-300 p-1 rounded-xl">
        {[
          { id: 'overview', label: "Vue d'ensemble", icon: '📊' },
          { id: 'timeline', label: 'Timeline', icon: '📅' },
          { id: 'comments', label: 'Commentaires', icon: '💬' },
          { id: 'files', label: 'Fichiers', icon: '📎' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple to-pink text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-dark-400'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.id === 'comments' && project.comments?.length > 0 && (
              <span className="bg-purple/30 text-purple-200 text-xs px-1.5 py-0.5 rounded-full">
                {project.comments.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="bg-dark-300 rounded-2xl p-6 border border-dark-400">
        {activeTab === 'overview' && (
          <OverviewTab
            project={project}
            editMode={editMode}
            editData={editData}
            setEditData={setEditData}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab
            timeline={project.timeline || []}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'comments' && (
          <CommentsTab
            comments={project.comments || []}
            onAddComment={handleAddComment}
            newComment={newComment}
            setNewComment={setNewComment}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'files' && (
          <FilesTab files={project.files || []} projectId={project.id} />
        )}
      </div>
    </div>
  );
}

// Onglet Vue d'ensemble
function OverviewTab({ project, editMode, editData, setEditData, formatDate }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Informations du projet */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Informations du projet
          </h3>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Titre
            </label>
            {editMode ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white"
              />
            ) : (
              <p className="text-gray-300">{project.title}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Description
            </label>
            {editMode ? (
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                rows="4"
                className="w-full px-4 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white"
              />
            ) : (
              <p className="text-gray-300 whitespace-pre-wrap">
                {project.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Budget
            </label>
            {editMode ? (
              <input
                type="number"
                value={editData.budget || ''}
                onChange={(e) =>
                  setEditData({ ...editData, budget: e.target.value })
                }
                className="w-full px-4 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white"
              />
            ) : (
              <p className="text-gray-300">
                {project.budget ? `${project.budget}€` : 'Non défini'}
              </p>
            )}
          </div>
        </div>

        {/* Informations client */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Informations client
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Nom
              </label>
              <p className="text-gray-300">{project.client?.name}</p>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Email
              </label>
              <a
                href={`mailto:${project.client?.email}`}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                {project.client?.email}
              </a>
            </div>

            {project.client?.phone && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Téléphone
                </label>
                <a
                  href={`tel:${project.client.phone}`}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {project.client.phone}
                </a>
              </div>
            )}

            {project.client?.company && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1">
                  Entreprise
                </label>
                <p className="text-gray-300">{project.client.company}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1">
            Créé le
          </label>
          <p className="text-gray-300">{formatDate(project.createdAt)}</p>
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-1">
            Dernière modification
          </label>
          <p className="text-gray-300">{formatDate(project.updatedAt)}</p>
        </div>

        {project.deadline && (
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Date limite
            </label>
            <p className="text-gray-300">{formatDate(project.deadline)}</p>
          </div>
        )}
      </div>

      {/* Technologies */}
      {project.technologies?.length > 0 && (
        <div>
          <h4 className="text-gray-300 text-sm font-medium mb-2">
            Technologies
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-dark-200 rounded-full text-sm text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Onglet Timeline
function TimelineTab({ timeline, formatDate }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Historique du projet</h3>

      {timeline.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          Aucun événement dans la timeline
        </p>
      ) : (
        <div className="space-y-4">
          {timeline.map((event, index) => (
            <div key={event.id || index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-purple rounded-full"></div>
                {index < timeline.length - 1 && (
                  <div className="w-0.5 h-12 bg-dark-400 mt-2"></div>
                )}
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-white font-medium">{event.event}</h4>
                  <span className="text-sm text-gray-400">
                    {formatDate(event.date)}
                  </span>
                </div>

                <p className="text-gray-400 text-sm">{event.description}</p>

                {event.author && (
                  <p className="text-xs text-gray-500 mt-1">
                    Par {event.author}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Onglet Commentaires
function CommentsTab({
  comments,
  onAddComment,
  newComment,
  setNewComment,
  formatDate,
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Commentaires</h3>

      {/* Formulaire d'ajout */}
      <form onSubmit={onAddComment} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire..."
          rows="3"
          className="w-full px-4 py-3 bg-dark-200 border border-dark-400 rounded-lg text-white 
                   placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple/50"
        />

        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-4 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                   hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💬 Ajouter un commentaire
        </button>
      </form>

      {/* Liste des commentaires */}
      {comments.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          Aucun commentaire pour le moment
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-dark-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{comment.author}</span>
                <span className="text-sm text-gray-400">
                  {formatDate(comment.date)}
                </span>
              </div>

              <p className="text-gray-300 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Onglet Fichiers
function FilesTab({ files, _projectId }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Fichiers du projet</h3>

      {files.length === 0 ? (
        <p className="text-gray-400 text-center py-8">Aucun fichier attaché</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="bg-dark-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📎</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {file.size
                      ? `${(file.size / 1024).toFixed(1)} KB`
                      : 'Taille inconnue'}
                  </p>
                </div>
              </div>

              {file.url && (
                <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Télécharger
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
