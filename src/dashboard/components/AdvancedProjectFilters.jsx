import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvancedProjectFilters({
  filters,
  onFiltersChange,
  projects = [],
  statusTypes = {},
  priorityTypes = {},
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [quickStats, setQuickStats] = useState({});

  // Calculer le nombre de filtres actifs
  useEffect(() => {
    const count = Object.values(filters).filter(
      (value) =>
        value !== '' &&
        value !== 'all' &&
        (Array.isArray(value) ? value.length > 0 : true)
    ).length;
    setActiveFiltersCount(count);
  }, [filters]);

  // Calculer les statistiques rapides
  useEffect(() => {
    const stats = {
      total: projects.length,
      byStatus: {},
      byPriority: {},
      byTechnology: {},
      avgProgress: 0,
    };

    projects.forEach((project) => {
      // Par statut
      stats.byStatus[project.status] =
        (stats.byStatus[project.status] || 0) + 1;

      // Par priorité
      stats.byPriority[project.priority] =
        (stats.byPriority[project.priority] || 0) + 1;

      // Par technologie
      if (project.technologies) {
        project.technologies.forEach((tech) => {
          stats.byTechnology[tech] = (stats.byTechnology[tech] || 0) + 1;
        });
      }

      // Progression moyenne
      stats.avgProgress += project.progress || 0;
    });

    if (projects.length > 0) {
      stats.avgProgress = Math.round(stats.avgProgress / projects.length);
    }

    setQuickStats(stats);
  }, [projects]);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      status: '',
      priority: '',
      technology: '',
      progressRange: [0, 100],
      dateRange: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const presetFilters = [
    {
      name: 'En cours',
      icon: '🔄',
      color: 'from-blue-500 to-blue-600',
      filters: { status: 'IN_PROGRESS' },
    },
    {
      name: 'Urgents',
      icon: '🚨',
      color: 'from-red-500 to-red-600',
      filters: { priority: 'URGENT' },
    },
    {
      name: 'Terminés',
      icon: '✅',
      color: 'from-green-500 to-green-600',
      filters: { status: 'COMPLETED' },
    },
    {
      name: 'Cette semaine',
      icon: '📅',
      color: 'from-purple-500 to-purple-600',
      filters: { dateRange: 'week' },
    },
  ];

  const technologies = Object.keys(quickStats.byTechnology || {}).sort();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
    >
      {/* Header avec statistiques rapides */}
      <div className="p-6 bg-gradient-to-r from-slate-900/50 to-blue-900/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl">🔍</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Filtres Avancés</h3>
              <p className="text-blue-200 text-sm">
                {projects.length} projet{projects.length > 1 ? 's' : ''} •
                {activeFiltersCount > 0 &&
                  ` ${activeFiltersCount} filtre${
                    activeFiltersCount > 1 ? 's' : ''
                  } actif${activeFiltersCount > 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Bouton Clear */}
            {activeFiltersCount > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={clearAllFilters}
                className="px-4 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-200 text-sm font-medium"
              >
                Effacer ({activeFiltersCount})
              </motion.button>
            )}

            {/* Toggle expansion */}
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-white hover:bg-white/20 transition-all duration-200"
            >
              <motion.svg
                animate={{ rotate: isExpanded ? 180 : 0 }}
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-white font-bold text-lg">
              {quickStats.total}
            </div>
            <div className="text-blue-200 text-xs">Total</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-white font-bold text-lg">
              {quickStats.byStatus?.IN_PROGRESS || 0}
            </div>
            <div className="text-blue-200 text-xs">En cours</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-white font-bold text-lg">
              {quickStats.avgProgress}%
            </div>
            <div className="text-blue-200 text-xs">Progression</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="text-white font-bold text-lg">
              {technologies.length}
            </div>
            <div className="text-blue-200 text-xs">Technologies</div>
          </div>
        </div>
      </div>

      {/* Filtres prédefinis */}
      <div className="p-6 border-b border-white/10">
        <h4 className="text-white font-semibold mb-3">Filtres Rapides</h4>
        <div className="flex flex-wrap gap-3">
          {presetFilters.map((preset, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFiltersChange({ ...filters, ...preset.filters })}
              className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${preset.color} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200`}
            >
              <span className="text-lg">{preset.icon}</span>
              <span className="font-medium">{preset.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filtres détaillés */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Recherche */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Recherche
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nom, client, description..."
                    value={filters.search || ''}
                    onChange={(e) =>
                      handleFilterChange('search', e.target.value)
                    }
                    className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
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
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Statut */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Statut
                  </label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) =>
                      handleFilterChange('status', e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Tous les statuts</option>
                    {Object.entries(statusTypes).map(([key, type]) => (
                      <option key={key} value={key} className="bg-slate-800">
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priorité */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Priorité
                  </label>
                  <select
                    value={filters.priority || ''}
                    onChange={(e) =>
                      handleFilterChange('priority', e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="">Toutes les priorités</option>
                    {Object.entries(priorityTypes).map(([key, type]) => (
                      <option key={key} value={key} className="bg-slate-800">
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Technologies */}
              {technologies.length > 0 && (
                <div>
                  <label className="block text-white font-medium mb-2">
                    Technologies
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <motion.button
                        key={tech}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          handleFilterChange(
                            'technology',
                            filters.technology === tech ? '' : tech
                          )
                        }
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          filters.technology === tech
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {tech}
                        <span className="ml-1 text-xs opacity-75">
                          ({quickStats.byTechnology[tech]})
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tri */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Trier par
                  </label>
                  <select
                    value={filters.sortBy || 'createdAt'}
                    onChange={(e) =>
                      handleFilterChange('sortBy', e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="createdAt" className="bg-slate-800">
                      Date de création
                    </option>
                    <option value="title" className="bg-slate-800">
                      Nom
                    </option>
                    <option value="priority" className="bg-slate-800">
                      Priorité
                    </option>
                    <option value="progress" className="bg-slate-800">
                      Progression
                    </option>
                    <option value="deadline" className="bg-slate-800">
                      Échéance
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Ordre
                  </label>
                  <select
                    value={filters.sortOrder || 'desc'}
                    onChange={(e) =>
                      handleFilterChange('sortOrder', e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="desc" className="bg-slate-800">
                      Décroissant
                    </option>
                    <option value="asc" className="bg-slate-800">
                      Croissant
                    </option>
                  </select>
                </div>
              </div>

              {/* Plage de progression */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Progression ({filters.progressRange?.[0] || 0}% -{' '}
                  {filters.progressRange?.[1] || 100}%)
                </label>
                <div className="px-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={filters.progressRange?.[1] || 100}
                    onChange={(e) =>
                      handleFilterChange('progressRange', [
                        filters.progressRange?.[0] || 0,
                        parseInt(e.target.value),
                      ])
                    }
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer avec résumé */}
      {activeFiltersCount > 0 && (
        <div className="px-6 py-3 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">
              {projects.length} résultat{projects.length > 1 ? 's' : ''} trouvé
              {projects.length > 1 ? 's' : ''}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={clearAllFilters}
              className="text-red-300 hover:text-red-200 transition-colors duration-200"
            >
              Réinitialiser
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
