import { useState, useEffect } from 'react';
import dataService from '../../services/dataService';
import ExportModal from '../components/ExportModal';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    setClients(dataService.getClients());
  }, []);

  const updateStatus = (id, newStatus) => {
    dataService.updateClient(id, { status: newStatus });
    setClients(dataService.getClients());
  };

  const deleteClient = (id) => {
    if (confirm('Supprimer ce client ?')) {
      dataService.deleteClient(id);
      setClients(dataService.getClients());
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-white font-semibold">
          Demandes de Projets ({clients.length})
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
            onClick={() => setClients(dataService.getClients())}
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

      <div className="bg-dark-300 rounded-lg p-4 overflow-x-auto">
        {clients.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Aucune demande de projet pour le moment
          </p>
        ) : (
          <table className="w-full text-left text-gray-200 min-w-[800px]">
            <thead>
              <tr className="border-b border-dark-200">
                <th className="pb-2">Nom</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Entreprise</th>
                <th className="pb-2">Projet</th>
                <th className="pb-2">Budget</th>
                <th className="pb-2">Statut</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-dark-200">
                  <td className="py-3">{c.name}</td>
                  <td className="py-3">{c.email}</td>
                  <td className="py-3">{c.company || '-'}</td>
                  <td className="py-3">{c.projectType || '-'}</td>
                  <td className="py-3">{c.budget || '-'}</td>
                  <td className="py-3">
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className="bg-dark-200 text-white px-2 py-1 rounded text-sm"
                    >
                      <option value="nouveau">Nouveau</option>
                      <option value="en_cours">En cours</option>
                      <option value="termine">Terminé</option>
                    </select>
                  </td>
                  <td className="py-3 text-sm text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => deleteClient(c.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal d'export */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={clients}
        type="clients"
      />
    </div>
  );
}
