import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvancedExportSystem({ projects = [], onClose }) {
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [selectedFields, setSelectedFields] = useState([
    'title',
    'client',
    'status',
    'progress',
    'createdAt',
  ]);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const exportFormats = [
    {
      id: 'excel',
      name: 'Excel (.xlsx)',
      icon: '📊',
      description: 'Tableur avec formatage avancé',
      color: 'from-green-500 to-green-600',
      features: ['Graphiques', 'Filtres', 'Formatage conditionnel'],
    },
    {
      id: 'pdf',
      name: 'PDF Report',
      icon: '📄',
      description: 'Rapport professionnel PDF',
      color: 'from-red-500 to-red-600',
      features: ['Mise en page', 'Graphiques', 'Logo entreprise'],
    },
    {
      id: 'json',
      name: 'JSON Data',
      icon: '🔧',
      description: 'Données structurées JSON',
      color: 'from-blue-500 to-blue-600',
      features: ['API-ready', 'Structure complète', 'Métadonnées'],
    },
    {
      id: 'csv',
      name: 'CSV Simple',
      icon: '📝',
      description: 'Fichier CSV standard',
      color: 'from-gray-500 to-gray-600',
      features: ['Léger', 'Compatible universel', 'Import facile'],
    },
  ];

  const availableFields = [
    { id: 'title', name: 'Titre du projet', category: 'Basique' },
    { id: 'description', name: 'Description', category: 'Basique' },
    { id: 'client', name: 'Informations client', category: 'Client' },
    { id: 'status', name: 'Statut', category: 'Basique' },
    { id: 'priority', name: 'Priorité', category: 'Basique' },
    { id: 'progress', name: 'Progression (%)', category: 'Basique' },
    { id: 'budget', name: 'Budget', category: 'Financier' },
    { id: 'createdAt', name: 'Date de création', category: 'Temporel' },
    { id: 'deadline', name: 'Échéance', category: 'Temporel' },
    { id: 'technologies', name: 'Technologies', category: 'Technique' },
    { id: 'features', name: 'Fonctionnalités', category: 'Technique' },
    { id: 'timeline', name: 'Historique', category: 'Avancé' },
    { id: 'comments', name: 'Commentaires', category: 'Avancé' },
    { id: 'testimonial', name: 'Témoignage', category: 'Avancé' },
  ];

  const fieldCategories = [...new Set(availableFields.map((f) => f.category))];

  const handleFieldToggle = (fieldId) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const selectAllFields = () => {
    setSelectedFields(availableFields.map((f) => f.id));
  };

  const selectNoneFields = () => {
    setSelectedFields([]);
  };

  const simulateExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulation du processus d'export
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setExportProgress(i);
    }

    // Simulation de la génération du fichier
    const exportData = generateExportData();
    downloadFile(exportData, selectedFormat);

    setExportComplete(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(false);
      setExportProgress(0);
    }, 2000);
  };

  const generateExportData = () => {
    const filteredProjects = projects.map((project) => {
      const exportProject = {};

      selectedFields.forEach((fieldId) => {
        switch (fieldId) {
          case 'title':
            exportProject.titre = project.title;
            break;
          case 'description':
            exportProject.description = project.description;
            break;
          case 'client':
            exportProject.client_nom = project.client?.name;
            exportProject.client_email = project.client?.email;
            exportProject.client_telephone = project.client?.phone;
            exportProject.client_entreprise = project.client?.company;
            break;
          case 'status':
            exportProject.statut = project.status;
            break;
          case 'priority':
            exportProject.priorite = project.priority;
            break;
          case 'progress':
            exportProject.progression = `${project.progress}%`;
            break;
          case 'budget':
            exportProject.budget = project.budget;
            break;
          case 'createdAt':
            exportProject.date_creation = new Date(
              project.createdAt
            ).toLocaleDateString('fr-FR');
            break;
          case 'deadline':
            exportProject.echeance = project.deadline
              ? new Date(project.deadline).toLocaleDateString('fr-FR')
              : '';
            break;
          case 'technologies':
            exportProject.technologies = project.technologies?.join(', ') || '';
            break;
          case 'features':
            exportProject.fonctionnalites = project.features?.join(', ') || '';
            break;
          case 'timeline':
            exportProject.historique = project.timeline?.length || 0;
            break;
          case 'comments':
            exportProject.commentaires = project.comments?.length || 0;
            break;
          case 'testimonial':
            exportProject.temoignage = project.testimonial?.content || '';
            break;
          default:
            break;
        }
      });

      return exportProject;
    });

    return {
      metadata: {
        generated_at: new Date().toISOString(),
        generator: 'Ir Bendelo Dashboard Pro',
        total_projects: projects.length,
        selected_fields: selectedFields.length,
        format: selectedFormat,
      },
      projects: filteredProjects,
    };
  };

  const downloadFile = (data, format) => {
    let content, filename, mimeType;

    switch (format) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = `projets_ir_bendelo_${
          new Date().toISOString().split('T')[0]
        }.json`;
        mimeType = 'application/json';
        break;

      case 'csv': {
        const csvHeaders = Object.keys(data.projects[0] || {}).join(',');
        const csvRows = data.projects
          .map((project) =>
            Object.values(project)
              .map((value) => `"${value || ''}"`)
              .join(',')
          )
          .join('\n');
        content = `${csvHeaders}\n${csvRows}`;
        filename = `projets_ir_bendelo_${
          new Date().toISOString().split('T')[0]
        }.csv`;
        mimeType = 'text/csv';
        break;
      }

      case 'excel':
        // Simulation - en réalité, on utiliserait une lib comme xlsx
        content = JSON.stringify(data, null, 2);
        filename = `projets_ir_bendelo_${
          new Date().toISOString().split('T')[0]
        }.xlsx`;
        mimeType =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;

      case 'pdf':
        // Simulation - en réalité, on utiliserait une lib comme jsPDF
        content = JSON.stringify(data, null, 2);
        filename = `rapport_projets_ir_bendelo_${
          new Date().toISOString().split('T')[0]
        }.pdf`;
        mimeType = 'application/pdf';
        break;

      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl">📤</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Export Avancé</h2>
                <p className="text-blue-200">
                  Exportez {projects.length} projet
                  {projects.length > 1 ? 's' : ''} dans le format de votre choix
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-white hover:bg-white/20 transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-120px)]">
          {/* Sélection du format */}
          <div className="lg:w-1/2 p-6 border-r border-white/10">
            <h3 className="text-xl font-bold text-white mb-6">
              Format d'Export
            </h3>

            <div className="grid gap-4">
              {exportFormats.map((format) => (
                <motion.div
                  key={format.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    selectedFormat === format.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${format.color} rounded-xl flex items-center justify-center text-xl`}
                    >
                      {format.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">
                        {format.name}
                      </h4>
                      <p className="text-white/60 text-sm mb-2">
                        {format.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {format.features.map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 text-white/70 rounded-md text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedFormat === format.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-white/30'
                      }`}
                    >
                      {selectedFormat === format.id && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sélection des champs */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                Champs à Exporter
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={selectAllFields}
                  className="px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all duration-200 text-sm"
                >
                  Tout
                </button>
                <button
                  onClick={selectNoneFields}
                  className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-200 text-sm"
                >
                  Aucun
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {fieldCategories.map((category) => (
                <div key={category}>
                  <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {availableFields
                      .filter((field) => field.category === category)
                      .map((field) => (
                        <motion.label
                          key={field.id}
                          whileHover={{ x: 5 }}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all duration-200"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFields.includes(field.id)}
                            onChange={() => handleFieldToggle(field.id)}
                            className="w-4 h-4 text-blue-600 bg-transparent border-white/30 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                          />
                          <span className="text-white text-sm">
                            {field.name}
                          </span>
                        </motion.label>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-white/70 text-sm">
              {selectedFields.length} champ
              {selectedFields.length > 1 ? 's' : ''} sélectionné
              {selectedFields.length > 1 ? 's' : ''} • Format:{' '}
              {exportFormats.find((f) => f.id === selectedFormat)?.name}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-200"
              >
                Annuler
              </button>

              <motion.button
                onClick={simulateExport}
                disabled={selectedFields.length === 0 || isExporting}
                whileHover={{ scale: selectedFields.length > 0 ? 1.05 : 1 }}
                whileTap={{ scale: selectedFields.length > 0 ? 0.95 : 1 }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedFields.length === 0
                    ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg'
                }`}
              >
                {isExporting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Export... {exportProgress}%</span>
                  </div>
                ) : exportComplete ? (
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span>Terminé !</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>📤</span>
                    <span>Exporter</span>
                  </div>
                )}
              </motion.button>
            </div>
          </div>

          {/* Barre de progression */}
          <AnimatePresence>
            {isExporting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${exportProgress}%` }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
