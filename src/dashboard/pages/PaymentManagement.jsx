import { useState, useEffect, useMemo, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import paymentManagementService from '../services/paymentManagementService';
import ExportButtons from '../components/ExportButtons';
import invoicePDFService from '../../services/invoicePDFService.js';

export default function PaymentManagement() {
  // États principaux
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // États pour les filtres et recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCurrency, setSelectedCurrency] = useState('all');
  const [selectedPaymentType, setSelectedPaymentType] = useState('all');
  const [timeframe, setTimeframe] = useState('month');

  // États pour l'interface
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [generatingInvoice, setGeneratingInvoice] = useState(null);

  const loadPaymentData = useCallback(async () => {
    setLoading(true);
    try {
      const allTransactions = paymentManagementService.getAllTransactions();
      const paymentStats = paymentManagementService.getPaymentStats(timeframe);

      setTransactions(allTransactions);
      setStats(paymentStats);
    } catch (error) {
      console.error('Erreur chargement données paiement:', error);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  // Fonctions de gestion des factures
  const generateInvoice = async (transaction) => {
    try {
      setGeneratingInvoice(transaction.id);

      const result = await invoicePDFService.getInvoiceBase64(transaction);

      if (result.success) {
        // Mettre à jour la transaction avec la facture
        paymentManagementService.updateTransaction(transaction.id, {
          invoice: {
            filename: result.filename,
            generatedAt: new Date().toISOString(),
            base64: result.base64,
          },
        });

        // Recharger les données
        loadPaymentData();

        console.log('✅ Facture générée:', result.filename);
        alert('Facture générée avec succès !');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Erreur génération facture:', error);
      alert('Erreur lors de la génération de la facture');
    } finally {
      setGeneratingInvoice(null);
    }
  };

  const downloadInvoice = async (transaction) => {
    try {
      if (transaction.invoice?.base64) {
        // Télécharger la facture stockée
        const link = document.createElement('a');
        link.href = transaction.invoice.base64;
        link.download = transaction.invoice.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Générer et télécharger
        await invoicePDFService.downloadInvoice(transaction);
      }
    } catch (error) {
      console.error('❌ Erreur téléchargement facture:', error);
      alert('Erreur lors du téléchargement de la facture');
    }
  };

  const previewInvoice = async (transaction) => {
    try {
      if (transaction.invoice?.base64) {
        // Utiliser la facture stockée
        const newWindow = window.open();
        newWindow.document.write(
          `<iframe src="${transaction.invoice.base64}" width="100%" height="100%" style="border:none;"></iframe>`
        );
        newWindow.document.title = `Prévisualisation - ${transaction.invoice.filename}`;
      } else {
        // Régénérer la facture
        await invoicePDFService.previewInvoice(transaction);
      }
    } catch (error) {
      console.error('❌ Erreur prévisualisation:', error);
      alert('Erreur lors de la prévisualisation de la facture');
    }
  };

  // Charger les données au montage
  useEffect(() => {
    loadPaymentData();

    // Écouter les mises à jour en temps réel
    const handleTransactionUpdate = () => loadPaymentData();

    paymentManagementService.addEventListener(
      'transaction_added',
      handleTransactionUpdate
    );
    paymentManagementService.addEventListener(
      'transaction_updated',
      handleTransactionUpdate
    );
    paymentManagementService.addEventListener(
      'transaction_deleted',
      handleTransactionUpdate
    );

    return () => {
      paymentManagementService.removeEventListener(
        'transaction_added',
        handleTransactionUpdate
      );
      paymentManagementService.removeEventListener(
        'transaction_updated',
        handleTransactionUpdate
      );
      paymentManagementService.removeEventListener(
        'transaction_deleted',
        handleTransactionUpdate
      );
    };
  }, [timeframe, loadPaymentData]);

  // Filtrer et trier les transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Recherche textuelle
    if (searchQuery) {
      filtered = paymentManagementService.searchTransactions(searchQuery);
    }

    // Filtres
    const filters = {};
    if (selectedStatus !== 'all') filters.status = selectedStatus;
    if (selectedCurrency !== 'all') filters.currency = selectedCurrency;
    if (selectedPaymentType !== 'all')
      filters.paymentType = selectedPaymentType;

    if (Object.keys(filters).length > 0) {
      filtered = paymentManagementService.searchTransactions(
        searchQuery,
        filters
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'amount') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [
    transactions,
    searchQuery,
    selectedStatus,
    selectedCurrency,
    selectedPaymentType,
    sortBy,
    sortOrder,
  ]);

  // Gestionnaires d'événements
  const handleStatusChange = async (transactionId, newStatus) => {
    const success = paymentManagementService.updateTransactionStatus(
      transactionId,
      newStatus
    );
    if (success) {
      await loadPaymentData();
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (
      window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')
    ) {
      const success = paymentManagementService.deleteTransaction(transactionId);
      if (success) {
        await loadPaymentData();
        setSelectedTransaction(null);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'failed':
        return 'text-red-400 bg-red-400/10';
      case 'cancelled':
        return 'text-gray-400 bg-gray-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'failed':
        return '❌';
      case 'cancelled':
        return '🚫';
      default:
        return '❓';
    }
  };

  const formatCurrency = (amount, currency) => {
    const symbols = { EUR: '€', USD: '$', CAD: 'C$' };
    return `${parseFloat(amount).toFixed(2)}${symbols[currency] || currency}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💰 Gestion des Paiements
          </h1>
          <p className="text-gray-400">
            Suivez et gérez tous vos paiements et transactions
          </p>
        </div>

        {/* Statistiques rapides */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Revenus Total</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(stats.totalRevenue, 'EUR')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💸</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Transactions</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalTransactions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">En Attente</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(stats.pendingAmount, 'EUR')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Montant Moyen</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(stats.averageAmount, 'EUR')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Barre d'outils */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Recherche */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">
                  🔍
                </span>
              </div>
            </div>

            {/* Filtres rapides */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white 
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white 
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="completed">Complété</option>
                <option value="failed">Échoué</option>
                <option value="cancelled">Annulé</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                         transition-colors duration-200 flex items-center gap-2"
              >
                <span>🔧</span>
                Filtres
              </button>

              <ExportButtons
                onExport={(format) => {
                  const data = paymentManagementService.exportData(
                    format,
                    timeframe
                  );
                  const filename = `paiements_${timeframe}_${
                    new Date().toISOString().split('T')[0]
                  }`;

                  if (format === 'json') {
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${filename}.json`;
                    a.click();
                  } else if (format === 'csv') {
                    const blob = new Blob([data], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${filename}.csv`;
                    a.click();
                  }
                }}
              />
            </div>
          </div>

          {/* Filtres avancés */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/20 flex gap-4 flex-wrap"
              >
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white 
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Toutes devises</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>

                <select
                  value={selectedPaymentType}
                  onChange={(e) => setSelectedPaymentType(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white 
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tous les types</option>
                  <option value="full">Paiement complet</option>
                  <option value="deposit">Acompte</option>
                  <option value="installment">Échelonné</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white 
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="timestamp">Trier par date</option>
                  <option value="amount">Trier par montant</option>
                  <option value="projectName">Trier par projet</option>
                  <option value="clientEmail">Trier par client</option>
                </select>

                <button
                  onClick={() =>
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                  }
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white 
                           hover:bg-white/20 transition-colors duration-200 flex items-center gap-2"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                  {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Liste des transactions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              📋 Transactions ({filteredTransactions.length})
            </h2>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Aucune transaction
              </h3>
              <p className="text-gray-400">
                {searchQuery || selectedStatus !== 'all'
                  ? 'Aucune transaction ne correspond aux critères de recherche.'
                  : 'Aucune transaction trouvée pour cette période.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Projet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Montant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredTransactions.map((transaction) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white font-mono">
                          {transaction.id?.substring(0, 12)}...
                        </div>
                        <div className="text-xs text-gray-400">
                          {transaction.paymentType}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">
                          {transaction.clientName || 'Non spécifié'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {transaction.clientEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white max-w-xs truncate">
                          {transaction.projectName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-white">
                          {formatCurrency(
                            transaction.amount,
                            transaction.currency
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          <span className="mr-1">
                            {getStatusIcon(transaction.status)}
                          </span>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(transaction.timestamp).toLocaleDateString(
                          'fr-FR'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedTransaction(transaction)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                            title="Voir détails"
                          >
                            👁️
                          </button>

                          {/* Boutons de facture */}
                          {transaction.invoice ? (
                            <>
                              <button
                                onClick={() => previewInvoice(transaction)}
                                className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                                title="Prévisualiser la facture"
                              >
                                📄
                              </button>
                              <button
                                onClick={() => downloadInvoice(transaction)}
                                className="text-green-400 hover:text-green-300 transition-colors duration-200"
                                title="Télécharger la facture"
                              >
                                💾
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => generateInvoice(transaction)}
                              disabled={generatingInvoice === transaction.id}
                              className="text-orange-400 hover:text-orange-300 transition-colors duration-200 disabled:opacity-50"
                              title="Générer une facture"
                            >
                              {generatingInvoice === transaction.id
                                ? '⏳'
                                : '📋'}
                            </button>
                          )}

                          {transaction.status === 'pending' && (
                            <button
                              onClick={() =>
                                handleStatusChange(transaction.id, 'completed')
                              }
                              className="text-green-400 hover:text-green-300 transition-colors duration-200"
                              title="Marquer comme complété"
                            >
                              ✅
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleDeleteTransaction(transaction.id)
                            }
                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails de transaction */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  Détails de la Transaction
                </h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      ID Transaction
                    </label>
                    <p className="text-white font-mono text-sm">
                      {selectedTransaction.id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Statut
                    </label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        selectedTransaction.status
                      )}`}
                    >
                      <span className="mr-1">
                        {getStatusIcon(selectedTransaction.status)}
                      </span>
                      {selectedTransaction.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Client
                    </label>
                    <p className="text-white">
                      {selectedTransaction.clientName || 'Non spécifié'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {selectedTransaction.clientEmail}
                    </p>
                    {selectedTransaction.clientPhone && (
                      <p className="text-gray-400 text-sm">
                        {selectedTransaction.clientPhone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Projet
                    </label>
                    <p className="text-white">
                      {selectedTransaction.projectName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Montant
                    </label>
                    <p className="text-white text-lg font-semibold">
                      {formatCurrency(
                        selectedTransaction.amount,
                        selectedTransaction.currency
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Type de Paiement
                    </label>
                    <p className="text-white capitalize">
                      {selectedTransaction.paymentType}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Date de Création
                    </label>
                    <p className="text-white">
                      {new Date(selectedTransaction.timestamp).toLocaleString(
                        'fr-FR'
                      )}
                    </p>
                  </div>
                  {selectedTransaction.timeline && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Délai
                      </label>
                      <p className="text-white">
                        {selectedTransaction.timeline}
                      </p>
                    </div>
                  )}
                  {selectedTransaction.paypalTransactionId && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        ID Transaction PayPal
                      </label>
                      <p className="text-white font-mono text-sm">
                        {selectedTransaction.paypalTransactionId}
                      </p>
                    </div>
                  )}
                </div>

                {selectedTransaction.projectDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Description du Projet
                    </label>
                    <p className="text-white bg-white/5 p-3 rounded-lg">
                      {selectedTransaction.projectDescription}
                    </p>
                  </div>
                )}

                {selectedTransaction.paypalLink && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Lien PayPal
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={selectedTransaction.paypalLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      />
                      <button
                        onClick={() =>
                          window.open(selectedTransaction.paypalLink, '_blank')
                        }
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200"
                      >
                        Ouvrir
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-white/20">
                  {selectedTransaction.status === 'pending' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedTransaction.id, 'completed');
                        setSelectedTransaction(null);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                    >
                      ✅ Marquer comme complété
                    </button>
                  )}
                  {selectedTransaction.status === 'pending' && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedTransaction.id, 'failed');
                        setSelectedTransaction(null);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                      ❌ Marquer comme échoué
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleDeleteTransaction(selectedTransaction.id);
                      setSelectedTransaction(null);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
