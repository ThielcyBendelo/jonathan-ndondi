import { useState, useEffect } from 'react';
import dataService from '../../services/dataService';
import ExportModal from '../components/ExportModal';

export default function Subscribers() {
  const [subs, setSubs] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    setSubs(dataService.getSubscribers());
  }, []);

  const deleteSubscriber = (id) => {
    if (confirm('Supprimer cet abonné ?')) {
      dataService.deleteSubscriber(id);
      setSubs(dataService.getSubscribers());
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-white font-semibold">
          Abonnés Newsletter ({subs.length})
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                     hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exporter
          </button>

          <button
            onClick={() => setSubs(dataService.getSubscribers())}
            className="px-4 py-2 bg-dark-400 text-gray-300 rounded-lg hover:bg-dark-500 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Actualiser
          </button>
        </div>
      </div>

      <div className="bg-dark-300 rounded-lg p-4">
        {subs.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Aucun abonné pour le moment
          </p>
        ) : (
          <div className="space-y-2">
            {subs.map((s) => (
              <div
                key={s.id}
                className="py-3 px-4 bg-dark-200 rounded-lg flex justify-between items-center"
              >
                <div>
                  <span className="text-white">{s.email}</span>
                  <span className="text-sm text-gray-400 ml-4">
                    Abonné le {new Date(s.subscribedAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => deleteSubscriber(s.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'export */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={subs}
        type="subscribers"
      />
    </div>
  );
}
