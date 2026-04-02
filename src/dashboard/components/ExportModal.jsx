import { useState } from 'react';
import exportService from '../services/exportService';
import { toast } from 'react-toastify';

export default function ExportModal({ isOpen, onClose, data, type }) {
  const [exportType, setExportType] = useState('csv');
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: '',
    projectType: '',
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!data || data.length === 0) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    setIsExporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulation loading

      if (hasFilters()) {
        exportService.exportWithFilters(data, filters, exportType);
      } else {
        if (type === 'clients') {
          if (exportType === 'csv') {
            exportService.exportClientsToCSV(data);
          } else {
            exportService.exportClientsToPDF(data);
          }
        } else if (type === 'subscribers') {
          if (exportType === 'csv') {
            exportService.exportSubscribersToCSV(data);
          } else {
            exportService.exportSubscribersToPDF(data);
          }
        }
      }

      toast.success(`Export ${exportType.toUpperCase()} réussi !`);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast.error("Erreur lors de l'export");
    } finally {
      setIsExporting(false);
    }
  };

  const hasFilters = () => {
    return (
      filters.dateFrom ||
      filters.dateTo ||
      filters.status ||
      filters.projectType
    );
  };

  const getFilteredCount = () => {
    if (!hasFilters()) return data.length;

    let count = data.length;
    // Simulation du comptage avec filtres (logique simplifiée)
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-300 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Exporter {type === 'clients' ? 'les Clients' : 'les Abonnés'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Type d'export */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-3 font-medium">
            Format d'export
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setExportType('csv')}
              className={`p-3 rounded-lg border transition-all ${
                exportType === 'csv'
                  ? 'border-purple bg-purple/20 text-white'
                  : 'border-dark-400 bg-dark-200 text-gray-300 hover:border-purple/50'
              }`}
            >
              <div className="flex items-center gap-2">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="font-medium">CSV</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Tableur Excel</p>
            </button>

            <button
              onClick={() => setExportType('pdf')}
              className={`p-3 rounded-lg border transition-all ${
                exportType === 'pdf'
                  ? 'border-purple bg-purple/20 text-white'
                  : 'border-dark-400 bg-dark-200 text-gray-300 hover:border-purple/50'
              }`}
            >
              <div className="flex items-center gap-2">
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
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">PDF</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Document imprimable</p>
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-3 font-medium">
            Filtres (optionnel)
          </label>

          <div className="space-y-4">
            {/* Filtre par date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Du</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateFrom: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Au</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white text-sm"
                />
              </div>
            </div>

            {/* Filtre par statut */}
            <div>
              <label className="block text-gray-400 text-sm mb-1">Statut</label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white text-sm"
              >
                <option value="">Tous les statuts</option>
                <option value="nouveau">Nouveau</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
                {type === 'subscribers' && <option value="actif">Actif</option>}
              </select>
            </div>

            {/* Filtre par type de projet (clients seulement) */}
            {type === 'clients' && (
              <div>
                <label className="block text-gray-400 text-sm mb-1">
                  Type de projet
                </label>
                <select
                  value={filters.projectType}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      projectType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white text-sm"
                >
                  <option value="">Tous les types</option>
                  <option value="site-web">Site Web</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="application">Application Web</option>
                  <option value="mobile">Application Mobile</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Résumé de l'export */}
        <div className="mb-6 p-4 bg-dark-200 rounded-lg border border-dark-400">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-purple"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9z"
              />
            </svg>
            <span className="text-gray-300 font-medium">
              Aperçu de l'export
            </span>
          </div>
          <div className="text-sm text-gray-400">
            <p>
              <strong className="text-white">{getFilteredCount()}</strong>{' '}
              éléments seront exportés
            </p>
            <p>
              Format:{' '}
              <strong className="text-white">{exportType.toUpperCase()}</strong>
            </p>
            {hasFilters() && (
              <p className="text-yellow-400 mt-1">⚠️ Filtres appliqués</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-dark-400 text-gray-300 rounded-lg hover:bg-dark-500 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                     hover:shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
          >
            {isExporting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Export...
              </div>
            ) : (
              `Exporter ${exportType.toUpperCase()}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
