import { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import paypalWebhookService from '../services/paypalWebhookService';
import paymentManagementService from '../services/paymentManagementService';

export default function PayPalStatusTracker() {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [recentConfirmations, setRecentConfirmations] = useState([]);
  const [webhookStats, setWebhookStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    loadData();

    // Écouter les mises à jour de transactions
    const handleTransactionUpdate = () => {
      loadData();
    };

    paymentManagementService.addEventListener(
      'transaction_updated',
      handleTransactionUpdate
    );

    // Démarrer le rafraîchissement automatique
    if (autoRefresh) {
      intervalRef.current = setInterval(loadData, 10000); // Toutes les 10 secondes
    }

    return () => {
      paymentManagementService.removeEventListener(
        'transaction_updated',
        handleTransactionUpdate
      );
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh]);

  const loadData = () => {
    // Charger les transactions en attente
    const pending = paymentManagementService.getTransactionsByStatus('pending');
    setPendingTransactions(pending);

    // Charger les confirmations récentes (dernières 24h)
    const recent = paymentManagementService
      .getAllTransactions()
      .filter((t) => {
        if (t.status !== 'completed') return false;
        const transactionTime = new Date(t.updatedAt || t.timestamp);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return transactionTime > oneDayAgo;
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.timestamp) -
          new Date(a.updatedAt || a.timestamp)
      )
      .slice(0, 5);

    setRecentConfirmations(recent);

    // Charger les stats de webhook
    const stats = paypalWebhookService.getWebhookStats();
    setWebhookStats(stats);
  };

  const handleManualCheck = async (transaction) => {
    try {
      console.log(
        '🔍 Vérification manuelle de la transaction:',
        transaction.id
      );

      // En production, ceci ferait un appel à l'API PayPal
      // Pour l'instant, on simule
      const result = await paypalWebhookService.checkPaymentStatus(
        transaction.id
      );

      if (result.status === 'completed') {
        // Mettre à jour la transaction
        paymentManagementService.updateTransactionStatus(
          transaction.id,
          'completed',
          result.transactionId
        );

        if (window.toast) {
          window.toast.success(
            `✅ Transaction ${transaction.id.substring(0, 8)}... confirmée !`
          );
        }
      }

      loadData(); // Recharger les données
    } catch (error) {
      console.error('❌ Erreur vérification manuelle:', error);
      if (window.toast) {
        window.toast.error('❌ Erreur lors de la vérification');
      }
    }
  };

  const simulateConfirmation = (transaction) => {
    // Fonction pour tester le système
    paypalWebhookService.simulateWebhook(transaction.id, 'completed');
  };

  const formatCurrency = (amount, currency) => {
    const symbols = { EUR: '€', USD: '$', CAD: 'C$' };
    return `${parseFloat(amount).toFixed(2)}${symbols[currency] || currency}`;
  };

  const getTimeSince = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}j`;
  };

  if (!isVisible) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsVisible(true)}
        className="fixed bottom-24 left-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 
                   rounded-full flex items-center justify-center shadow-lg hover:shadow-xl 
                   transition-all duration-300 z-40"
      >
        <div className="relative">
          <span className="text-2xl">⚡</span>
          {pendingTransactions.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full 
                         flex items-center justify-center text-white text-xs font-bold"
            >
              {pendingTransactions.length > 9
                ? '9+'
                : pendingTransactions.length}
            </motion.div>
          )}
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -400 }}
      className="fixed bottom-24 left-6 w-96 bg-slate-800/95 backdrop-blur-lg 
                 rounded-xl border border-white/20 shadow-2xl z-30 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            ⚡ Suivi PayPal
          </h3>
          <p className="text-sm text-gray-400">
            {pendingTransactions.length} en attente •{' '}
            {recentConfirmations.length} récentes
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${
              autoRefresh
                ? 'bg-green-600 text-white'
                : 'bg-gray-600 text-gray-300'
            }`}
            title={
              autoRefresh ? 'Auto-refresh activé' : 'Auto-refresh désactivé'
            }
          >
            🔄
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Stats de webhook */}
      {webhookStats && (
        <div className="p-3 bg-white/5 border-b border-white/10">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <p className="text-gray-400">Traités</p>
              <p className="text-white font-semibold">
                {webhookStats.totalProcessed}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Succès</p>
              <p className="text-green-400 font-semibold">
                {webhookStats.successCount}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400">Annulés</p>
              <p className="text-orange-400 font-semibold">
                {webhookStats.cancelledCount}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transactions en attente */}
      <div className="max-h-48 overflow-y-auto border-b border-white/10">
        <div className="p-3">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            ⏳ En attente de confirmation ({pendingTransactions.length})
            <button
              onClick={loadData}
              className="text-blue-400 hover:text-blue-300 text-xs"
              title="Actualiser"
            >
              🔄
            </button>
          </h4>

          {pendingTransactions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Aucune transaction en attente
            </p>
          ) : (
            <div className="space-y-2">
              {pendingTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-3 border border-orange-500/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-medium">
                        {transaction.clientName || 'Client'}
                      </span>
                    </div>
                    <span className="text-orange-400 text-xs">
                      {getTimeSince(transaction.timestamp)}
                    </span>
                  </div>

                  <div className="text-xs text-gray-400 mb-2">
                    {transaction.projectName} •{' '}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleManualCheck(transaction)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors duration-200"
                    >
                      🔍 Vérifier
                    </button>
                    {import.meta.env.DEV && (
                      <button
                        onClick={() => simulateConfirmation(transaction)}
                        className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors duration-200"
                      >
                        🧪 Simuler
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmations récentes */}
      <div className="max-h-40 overflow-y-auto">
        <div className="p-3">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            ✅ Confirmées récemment ({recentConfirmations.length})
          </h4>

          {recentConfirmations.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Aucune confirmation récente
            </p>
          ) : (
            <div className="space-y-2">
              {recentConfirmations.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-3 border border-green-500/20"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-white text-sm font-medium">
                        {transaction.clientName || 'Client'}
                      </span>
                    </div>
                    <span className="text-green-400 text-xs">
                      {getTimeSince(
                        transaction.updatedAt || transaction.timestamp
                      )}
                    </span>
                  </div>

                  <div className="text-xs text-gray-400 mb-1">
                    {transaction.projectName} •{' '}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </div>

                  {transaction.paypalTransactionId && (
                    <div className="text-xs text-gray-500 font-mono">
                      PayPal: {transaction.paypalTransactionId.substring(0, 12)}
                      ...
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer avec actions */}
      <div className="p-3 border-t border-white/20 bg-white/5">
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => {
              setIsVisible(false);
              window.location.hash = '#/dashboard/payments';
            }}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                       rounded-lg transition-colors duration-200"
          >
            📊 Voir tous les paiements
          </button>
          {import.meta.env.DEV && (
            <button
              onClick={() => {
                console.log('🧪 Commandes de test PayPal:');
                console.log('- paypalTest.simulateSuccess("TXN-123")');
                console.log('- paypalTest.simulateCancel("TXN-123")');
              }}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white 
                         rounded-lg transition-colors duration-200"
              title="Afficher les commandes de test"
            >
              🧪
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
