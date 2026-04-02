import { useState, useEffect, useCallback } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import paymentManagementService from '../services/paymentManagementService';

export default function PaymentNotificationWidget() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [showWidget, setShowWidget] = useState(false);
  const [_hasNewNotifications, setHasNewNotifications] = useState(false);

  const loadNotifications = useCallback(() => {
    const recentStats = paymentManagementService.getPaymentStats('week');
    setStats(recentStats);

    // Créer des notifications pour les transactions récentes si pas encore de notifications
    if (
      notifications.length === 0 &&
      recentStats.recentTransactions.length > 0
    ) {
      const recentNotifications = recentStats.recentTransactions
        .slice(0, 5)
        .map((transaction) => ({
          id: `notif-${transaction.id}`,
          type: 'transaction',
          title:
            transaction.status === 'completed'
              ? '✅ Paiement Complété'
              : '⏳ Paiement En Attente',
          message: `${transaction.clientName || 'Client'} - ${
            transaction.amount
          }${getCurrencySymbol(transaction.currency)}`,
          data: transaction,
          timestamp: transaction.timestamp,
          read: true, // Les anciennes sont marquées comme lues
        }));

      setNotifications(recentNotifications);
    }
  }, [notifications.length]);

  useEffect(() => {
    // Charger les données initiales
    loadNotifications();

    // Écouter les nouvelles transactions
    const handleNewTransaction = (transaction) => {
      const notification = {
        id: `notif-${Date.now()}`,
        type: 'new_payment',
        title: '💰 Nouveau Paiement',
        message: `${transaction.clientName || 'Client'} - ${
          transaction.amount
        }${getCurrencySymbol(transaction.currency)}`,
        data: transaction,
        timestamp: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev.slice(0, 9)]); // Garder max 10 notifications
      setHasNewNotifications(true);

      // Auto-marquer comme lu après 10 secondes
      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
        );
      }, 10000);
    };

    const handleTransactionUpdate = (transaction) => {
      const notification = {
        id: `notif-${Date.now()}`,
        type: 'status_update',
        title: '🔄 Mise à jour',
        message: `Paiement ${transaction.status} - ${transaction.projectName}`,
        data: transaction,
        timestamp: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev.slice(0, 9)]);
      setHasNewNotifications(true);
    };

    paymentManagementService.addEventListener(
      'transaction_added',
      handleNewTransaction
    );
    paymentManagementService.addEventListener(
      'transaction_updated',
      handleTransactionUpdate
    );

    // Mettre à jour les stats toutes les minutes
    const statsInterval = setInterval(loadNotifications, 60000);

    return () => {
      paymentManagementService.removeEventListener(
        'transaction_added',
        handleNewTransaction
      );
      paymentManagementService.removeEventListener(
        'transaction_updated',
        handleTransactionUpdate
      );
      clearInterval(statsInterval);
    };
  }, [loadNotifications]);

  const getCurrencySymbol = (currency) => {
    const symbols = { EUR: '€', USD: '$', CAD: 'C$' };
    return symbols[currency] || currency;
  };

  const formatCurrency = (amount, currency) => {
    return `${parseFloat(amount).toFixed(2)}${getCurrencySymbol(currency)}`;
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setHasNewNotifications(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_payment':
        return '💰';
      case 'status_update':
        return '🔄';
      case 'transaction':
        return '📊';
      default:
        return '📨';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Bouton flottant de notification */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setShowWidget(!showWidget)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 
                   rounded-full flex items-center justify-center shadow-lg hover:shadow-xl 
                   transition-all duration-300 z-40"
      >
        <div className="relative">
          <span className="text-2xl">💳</span>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full 
                         flex items-center justify-center text-white text-xs font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Widget de notifications */}
      <AnimatePresence>
        {showWidget && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed bottom-24 right-6 w-96 bg-slate-800/95 backdrop-blur-lg 
                       rounded-xl border border-white/20 shadow-2xl z-30 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/20 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  💳 Paiements
                </h3>
                <p className="text-sm text-gray-400">
                  {stats &&
                    `${stats.totalTransactions} transactions cette semaine`}
                </p>
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors duration-200"
                  >
                    Tout marquer comme lu
                  </button>
                )}
                <button
                  onClick={() => setShowWidget(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Stats rapides */}
            {stats && (
              <div className="p-4 bg-white/5 border-b border-white/10">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Revenus (7j)</p>
                    <p className="text-white font-semibold">
                      {formatCurrency(stats.totalRevenue, 'EUR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">En attente</p>
                    <p className="text-yellow-400 font-semibold">
                      {formatCurrency(stats.pendingAmount, 'EUR')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des notifications */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-gray-400 text-sm">Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-white/5 transition-colors duration-200 cursor-pointer
                                ${
                                  !notification.read
                                    ? 'bg-purple-500/10 border-l-2 border-l-purple-500'
                                    : ''
                                }`}
                      onClick={() => {
                        setNotifications((prev) =>
                          prev.map((n) =>
                            n.id === notification.id ? { ...n, read: true } : n
                          )
                        );
                        if (unreadCount === 1) setHasNewNotifications(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-white text-sm font-medium truncate">
                              {notification.title}
                            </p>
                            <span className="text-xs text-gray-400 ml-2">
                              {new Date(
                                notification.timestamp
                              ).toLocaleDateString('fr-FR', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm truncate">
                            {notification.message}
                          </p>
                          {notification.data && (
                            <div className="mt-1">
                              <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">
                                {notification.data.projectName}
                              </span>
                            </div>
                          )}
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer avec actions */}
            <div className="p-3 border-t border-white/20 bg-white/5">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowWidget(false);
                    // Rediriger vers la page de gestion des paiements
                    window.location.hash = '#/dashboard/payments';
                  }}
                  className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white 
                           rounded-lg text-sm transition-colors duration-200"
                >
                  📊 Voir tous les paiements
                </button>
                <button
                  onClick={() => {
                    setNotifications([]);
                    setHasNewNotifications(false);
                  }}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white 
                           rounded-lg text-sm transition-colors duration-200"
                >
                  🗑️
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
