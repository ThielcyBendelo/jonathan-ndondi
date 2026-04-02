import { useEffect, useState } from 'react';
import { fetchTransactions, calculateStats } from '../services/transactionApi';

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ total: 0, byProject: {}, count: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions()
      .then((data) => {
        setTransactions(data);
        setStats(calculateStats(data));
      })
      .catch(() => setError('Impossible de charger les transactions'));
  }, []);

  // Import dynamique pour éviter les problèmes SSR
  // Colonnes personnalisables pour l'export
  const exportColumns = [
    { key: 'date', label: 'Date' },
    { key: 'client', label: 'Client' },
    { key: 'project', label: 'Projet' },
    { key: 'amount', label: 'Montant (€)' },
    { key: 'currency', label: 'Devise' },
    { key: 'type', label: 'Type' },
    { key: 'description', label: 'Description' },
  ];

  // Filtres dynamiques
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    type: '',
    client: '',
    project: '',
  });

  // Style PDF personnalisé
  const pdfOptions = {
    logoUrl: '/public/images/logo.png', // Chemin à adapter selon votre logo
    mainColor: '#8B5CF6',
    secondaryColor: '#f8fafc',
    footerText: 'Rapport généré par le Dashboard Admin - Bendelo Thielcy',
    title: 'Rapport des Transactions',
    filename: 'transactions_finance',
  };

  // Export CSV avec colonnes et filtres
  const handleExportCSV = async () => {
    const { default: exportService } = await import(
      '../dashboard/services/exportService'
    );
    exportService.exportWithFilters(
      transactions,
      filters,
      'csv',
      exportColumns,
      { filename: 'transactions_finance' }
    );
  };

  // Export PDF avec colonnes, filtres et style
  const handleExportPDF = async () => {
    const { default: exportService } = await import(
      '../dashboard/services/exportService'
    );
    exportService.exportWithFilters(
      transactions,
      filters,
      'pdf',
      exportColumns,
      pdfOptions
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-200 to-dark-300 px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Comptabilité & Finance
      </h1>
      {error && <div className="mb-4 text-red-400">{error}</div>}
      <div className="mb-8 p-6 bg-dark-300/80 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Statistiques</h2>
        <p className="text-white">
          Chiffre d'affaires total :{' '}
          <span className="font-bold text-green-400">{stats.total} €</span>
        </p>
        <p className="text-white">
          Nombre de transactions :{' '}
          <span className="font-bold">{stats.count}</span>
        </p>
        <div className="mt-4">
          <h3 className="text-lg text-purple mb-2">Par projet :</h3>
          <ul className="text-white">
            {Object.entries(stats.byProject).map(([project, amount]) => (
              <li key={project}>
                {project} :{' '}
                <span className="font-bold text-green-400">{amount} €</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Filtres d'export */}
        <div className="mt-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              Date début
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters((f) => ({ ...f, dateFrom: e.target.value }))
              }
              className="px-2 py-1 rounded bg-dark-400 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Date fin</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters((f) => ({ ...f, dateTo: e.target.value }))
              }
              className="px-2 py-1 rounded bg-dark-400 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters((f) => ({ ...f, type: e.target.value }))
              }
              className="px-2 py-1 rounded bg-dark-400 text-white"
            >
              <option value="">Tous</option>
              <option value="full">Paiement complet</option>
              <option value="deposit">Acompte</option>
              <option value="installment">Échelonné</option>
              <option value="quote">Devis</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Client</label>
            <input
              type="text"
              value={filters.client}
              onChange={(e) =>
                setFilters((f) => ({ ...f, client: e.target.value }))
              }
              placeholder="Nom ou email"
              className="px-2 py-1 rounded bg-dark-400 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Projet</label>
            <input
              type="text"
              value={filters.project}
              onChange={(e) =>
                setFilters((f) => ({ ...f, project: e.target.value }))
              }
              placeholder="Nom projet"
              className="px-2 py-1 rounded bg-dark-400 text-white"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all"
          >
            Exporter CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all"
          >
            Exporter PDF
          </button>
        </div>
      </div>
      <div className="bg-dark-300/80 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">
          Transactions récentes
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-dark-400 text-gray-200">
              {exportColumns.map((col) => (
                <th key={col.key} className="py-2 px-4">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-gray-700">
                {exportColumns.map((col) => (
                  <td
                    key={col.key}
                    className={
                      col.key === 'amount'
                        ? 'py-2 px-4 text-green-400'
                        : 'py-2 px-4 text-white'
                    }
                  >
                    {t[col.key] || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
