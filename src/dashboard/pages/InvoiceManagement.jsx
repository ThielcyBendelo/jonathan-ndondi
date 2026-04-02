import React, { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentPlusIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import paymentManagementService from '../services/paymentManagementService.js';
import invoicePDFService from '../../services/invoicePDFService.js';

/**
 * Composant de gestion des factures
 * Affiche toutes les factures générées avec options de visualisation/téléchargement
 */
const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Charge toutes les transactions avec factures
   */
  const loadInvoices = () => {
    try {
      setLoading(true);
      const allTransactions = paymentManagementService.getAllTransactions();

      // Filtrer seulement les transactions avec factures
      const transactionsWithInvoices = allTransactions.filter(
        (transaction) => transaction.invoice && transaction.invoice.filename
      );

      setInvoices(transactionsWithInvoices);
      console.log('📋 Factures chargées:', transactionsWithInvoices.length);
    } catch (error) {
      console.error('❌ Erreur chargement factures:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtre les factures selon les critères
   */
  const filterInvoices = useCallback(() => {
    let filtered = [...invoices];

    // Filtrage par recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.clientName?.toLowerCase().includes(term) ||
          invoice.clientEmail?.toLowerCase().includes(term) ||
          invoice.projectName?.toLowerCase().includes(term) ||
          invoice.invoice?.filename?.toLowerCase().includes(term)
      );
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter);
    }

    // Filtrage par date
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(
            (invoice) => new Date(invoice.invoice.generatedAt) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(
            (invoice) => new Date(invoice.invoice.generatedAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(
            (invoice) => new Date(invoice.invoice.generatedAt) >= filterDate
          );
          break;
      }
    }

    // Trier par date de génération (plus récent en premier)
    filtered.sort(
      (a, b) =>
        new Date(b.invoice?.generatedAt || b.timestamp) -
        new Date(a.invoice?.generatedAt || a.timestamp)
    );

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, dateFilter]);

  // Charger les factures au montage
  useEffect(() => {
    loadInvoices();
  }, []);

  // Filtrer les factures quand les filtres changent
  useEffect(() => {
    filterInvoices();
  }, [filterInvoices]);

  /**
   * Prévisualise une facture
   */
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
        const result = await invoicePDFService.previewInvoice(transaction);
        if (!result.success) {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      console.error('❌ Erreur prévisualisation:', error);
      alert('Erreur lors de la prévisualisation de la facture');
    }
  };

  /**
   * Télécharge une facture
   */
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
        // Régénérer et télécharger
        await invoicePDFService.downloadInvoice(transaction);
      }
    } catch (error) {
      console.error('❌ Erreur téléchargement:', error);
      alert('Erreur lors du téléchargement de la facture');
    }
  };

  /**
   * Génère une facture manuelle pour une transaction
   */
  const generateManualInvoice = async (transaction) => {
    try {
      setIsGenerating(true);

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

        // Recharger les factures
        loadInvoices();

        console.log('✅ Facture générée manuellement:', result.filename);
        alert('Facture générée avec succès !');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Erreur génération manuelle:', error);
      alert('Erreur lors de la génération de la facture');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Formate une date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Obtient la couleur du statut
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Chargement des factures...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-indigo-600 mr-3" />
            Gestion des Factures
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredInvoices.length} facture
            {filteredInvoices.length !== 1 ? 's' : ''}
            {invoices.length !== filteredInvoices.length &&
              ` sur ${invoices.length} au total`}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par client, projet, facture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filtre statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Payé</option>
            <option value="pending">En attente</option>
            <option value="failed">Échoué</option>
            <option value="cancelled">Annulé</option>
          </select>

          {/* Filtre date */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
        </div>
      </div>

      {/* Liste des factures */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <DocumentIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {invoices.length === 0
              ? 'Aucune facture générée'
              : 'Aucune facture trouvée'}
          </h3>
          <p className="text-gray-500">
            {invoices.length === 0
              ? 'Les factures sont générées automatiquement lors des paiements confirmés.'
              : 'Essayez de modifier vos critères de recherche.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date génération
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredInvoices.map((transaction) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-indigo-600 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.invoice?.filename || 'Facture'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.clientName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.clientEmail}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {transaction.projectName}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <CurrencyEuroIcon className="h-4 w-4 mr-1" />
                          {parseFloat(transaction.amount).toFixed(2)}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {transaction.invoice?.generatedAt
                            ? formatDate(transaction.invoice.generatedAt)
                            : 'Non générée'}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Prévisualiser */}
                          <button
                            onClick={() => previewInvoice(transaction)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                            title="Prévisualiser"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>

                          {/* Télécharger */}
                          <button
                            onClick={() => downloadInvoice(transaction)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors"
                            title="Télécharger"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>

                          {/* Régénérer si pas de facture */}
                          {!transaction.invoice && (
                            <button
                              onClick={() => generateManualInvoice(transaction)}
                              disabled={isGenerating}
                              className="text-orange-600 hover:text-orange-900 p-1 rounded-full hover:bg-orange-50 transition-colors disabled:opacity-50"
                              title="Générer la facture"
                            >
                              <DocumentPlusIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message d'information si aucune facture automatique */}
      {invoices.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Génération automatique des factures
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Les factures sont automatiquement générées lors de la
                confirmation des paiements PayPal. Vous pouvez également générer
                manuellement des factures depuis la liste des transactions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;
