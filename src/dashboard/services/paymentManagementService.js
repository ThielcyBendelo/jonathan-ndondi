/**
 * Service de gestion des paiements pour le dashboard
 * Centralise toutes les opérations liées aux paiements
 */
class PaymentManagementService {
  constructor() {
    this.storageKey = 'payment_transactions';
    this.settingsKey = 'payment_settings';
    this.listeners = new Map();
    this.initializeService();
  }

  /**
   * Initialise le service avec les données par défaut
   */
  initializeService() {
    // Créer le stockage par défaut si inexistant
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }

    if (!localStorage.getItem(this.settingsKey)) {
      const defaultSettings = {
        defaultCurrency: 'EUR',
        emailNotifications: true,
        autoInvoice: true,
        paypalEmail: 'bendelothielcy@gmail.com',
        vatRate: 0, // 0% pour l'instant
        companyInfo: {
          name: 'Thiélcy Bendelo - Développeur Web',
          email: 'thielsybendelo@gmail.com',
          website: window.location.origin,
        },
      };
      localStorage.setItem(this.settingsKey, JSON.stringify(defaultSettings));
    }
  }

  /**
   * Récupère toutes les transactions
   */
  getAllTransactions() {
    try {
      const transactions = JSON.parse(
        localStorage.getItem(this.storageKey) || '[]'
      );
      // Trier par date décroissante (plus récent en premier)
      return transactions.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    } catch (error) {
      console.error('Erreur lecture transactions:', error);
      return [];
    }
  }

  /**
   * Ajoute une nouvelle transaction
   */
  addTransaction(transactionData) {
    try {
      const transactions = this.getAllTransactions();
      const newTransaction = {
        id: this.generateTransactionId(),
        ...transactionData,
        timestamp: new Date().toISOString(),
        status: transactionData.status || 'pending',
        createdAt: new Date().toISOString(),
      };

      transactions.unshift(newTransaction); // Ajouter en premier
      localStorage.setItem(this.storageKey, JSON.stringify(transactions));

      // Notifier les écouteurs
      this.notifyListeners('transaction_added', newTransaction);

      return newTransaction;
    } catch (error) {
      console.error('Erreur ajout transaction:', error);
      return null;
    }
  }

  /**
   * Met à jour le statut d'une transaction
   */
  updateTransactionStatus(
    transactionId,
    newStatus,
    paypalTransactionId = null
  ) {
    try {
      const transactions = this.getAllTransactions();
      const transactionIndex = transactions.findIndex(
        (t) => t.id === transactionId
      );

      if (transactionIndex === -1) {
        console.warn('Transaction non trouvée:', transactionId);
        return false;
      }

      transactions[transactionIndex].status = newStatus;
      transactions[transactionIndex].updatedAt = new Date().toISOString();

      if (paypalTransactionId) {
        transactions[transactionIndex].paypalTransactionId =
          paypalTransactionId;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(transactions));

      // Notifier les écouteurs
      this.notifyListeners(
        'transaction_updated',
        transactions[transactionIndex]
      );

      return true;
    } catch (error) {
      console.error('Erreur mise à jour transaction:', error);
      return false;
    }
  }

  /**
   * Supprime une transaction
   */
  deleteTransaction(transactionId) {
    try {
      const transactions = this.getAllTransactions();
      const filteredTransactions = transactions.filter(
        (t) => t.id !== transactionId
      );

      localStorage.setItem(
        this.storageKey,
        JSON.stringify(filteredTransactions)
      );

      // Notifier les écouteurs
      this.notifyListeners('transaction_deleted', { id: transactionId });

      return true;
    } catch (error) {
      console.error('Erreur suppression transaction:', error);
      return false;
    }
  }

  /**
   * Calcule les statistiques de paiement
   */
  getPaymentStats(timeframe = 'month') {
    const transactions = this.getAllTransactions();
    const now = new Date();
    let startDate;

    // Définir la période
    switch (timeframe) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'quarter': {
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      }
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Filtrer les transactions dans la période
    const periodTransactions = transactions.filter(
      (t) => new Date(t.timestamp) >= startDate
    );

    // Calculer les statistiques
    const stats = {
      totalTransactions: periodTransactions.length,
      totalRevenue: 0,
      pendingAmount: 0,
      completedAmount: 0,
      averageAmount: 0,
      currencyBreakdown: {},
      statusBreakdown: {
        pending: 0,
        completed: 0,
        failed: 0,
        cancelled: 0,
      },
      paymentTypeBreakdown: {
        full: 0,
        deposit: 0,
        installment: 0,
      },
      recentTransactions: periodTransactions.slice(0, 5),
      timeframe: timeframe,
      period: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      },
    };

    // Calculer les montants et répartitions
    periodTransactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount) || 0;

      stats.totalRevenue += amount;

      // Par statut
      if (transaction.status === 'completed') {
        stats.completedAmount += amount;
      } else if (transaction.status === 'pending') {
        stats.pendingAmount += amount;
      }

      stats.statusBreakdown[transaction.status] =
        (stats.statusBreakdown[transaction.status] || 0) + 1;

      // Par type de paiement
      stats.paymentTypeBreakdown[transaction.paymentType] =
        (stats.paymentTypeBreakdown[transaction.paymentType] || 0) + 1;

      // Par devise
      const currency = transaction.currency || 'EUR';
      if (!stats.currencyBreakdown[currency]) {
        stats.currencyBreakdown[currency] = { count: 0, amount: 0 };
      }
      stats.currencyBreakdown[currency].count++;
      stats.currencyBreakdown[currency].amount += amount;
    });

    // Calculer la moyenne
    stats.averageAmount =
      stats.totalTransactions > 0
        ? stats.totalRevenue / stats.totalTransactions
        : 0;

    return stats;
  }

  /**
   * Récupère les transactions par statut
   */
  getTransactionsByStatus(status) {
    return this.getAllTransactions().filter((t) => t.status === status);
  }

  /**
   * Recherche dans les transactions
   */
  searchTransactions(query, filters = {}) {
    let transactions = this.getAllTransactions();

    // Recherche textuelle
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      transactions = transactions.filter(
        (t) =>
          t.projectName?.toLowerCase().includes(lowercaseQuery) ||
          t.clientEmail?.toLowerCase().includes(lowercaseQuery) ||
          t.clientName?.toLowerCase().includes(lowercaseQuery) ||
          t.id?.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Filtres
    if (filters.status) {
      transactions = transactions.filter((t) => t.status === filters.status);
    }

    if (filters.currency) {
      transactions = transactions.filter(
        (t) => t.currency === filters.currency
      );
    }

    if (filters.paymentType) {
      transactions = transactions.filter(
        (t) => t.paymentType === filters.paymentType
      );
    }

    if (filters.dateFrom) {
      transactions = transactions.filter(
        (t) => new Date(t.timestamp) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      transactions = transactions.filter(
        (t) => new Date(t.timestamp) <= new Date(filters.dateTo)
      );
    }

    return transactions;
  }

  /**
   * Exporte les données de paiement
   */
  exportData(format = 'json', timeframe = 'all') {
    const transactions =
      timeframe === 'all'
        ? this.getAllTransactions()
        : this.getPaymentStats(timeframe).recentTransactions;

    const stats = this.getPaymentStats(timeframe);

    const exportData = {
      transactions,
      stats,
      exportDate: new Date().toISOString(),
      totalTransactions: transactions.length,
    };

    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    } else if (format === 'csv') {
      return this.convertToCSV(transactions);
    }

    return exportData;
  }

  /**
   * Convertit les transactions en CSV
   */
  convertToCSV(transactions) {
    if (transactions.length === 0) return '';

    const headers = [
      'ID',
      'Date',
      'Client',
      'Email',
      'Projet',
      'Montant',
      'Devise',
      'Type',
      'Statut',
      'PayPal ID',
    ];

    const rows = transactions.map((t) => [
      t.id,
      new Date(t.timestamp).toLocaleDateString('fr-FR'),
      t.clientName || '',
      t.clientEmail || '',
      t.projectName || '',
      t.amount || '',
      t.currency || '',
      t.paymentType || '',
      t.status || '',
      t.paypalTransactionId || '',
    ]);

    return [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');
  }

  /**
   * Système d'événements pour notifier les composants
   */
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error('Erreur callback listener:', error);
        }
      });
    }
  }

  /**
   * Génère un ID unique pour les transactions
   */
  generateTransactionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-${timestamp}-${random}`;
  }

  /**
   * Récupère les paramètres de paiement
   */
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.settingsKey) || '{}');
    } catch (error) {
      console.error('Erreur lecture paramètres:', error);
      return {};
    }
  }

  /**
   * Met à jour les paramètres de paiement
   */
  updateSettings(newSettings) {
    try {
      const currentSettings = this.getSettings();
      const updatedSettings = { ...currentSettings, ...newSettings };
      localStorage.setItem(this.settingsKey, JSON.stringify(updatedSettings));

      // Notifier les écouteurs
      this.notifyListeners('settings_updated', updatedSettings);

      return true;
    } catch (error) {
      console.error('Erreur mise à jour paramètres:', error);
      return false;
    }
  }
}

// Instance singleton
const paymentManagementService = new PaymentManagementService();
export default paymentManagementService;
