// Service de notifications pour le dashboard admin
// Gère les notifications, alertes et badges de notification

class NotificationService {
  constructor() {
    this.listeners = [];
    this.notifications = this.getStoredNotifications();
  }

  // Clés localStorage
  STORAGE_KEYS = {
    NOTIFICATIONS: 'monsite_notifications',
    LAST_CHECK: 'monsite_last_notification_check',
    SETTINGS: 'monsite_notification_settings',
  };

  // Types de notifications
  TYPES = {
    NEW_CLIENT: 'new_client',
    NEW_SUBSCRIBER: 'new_subscriber',
    STATUS_CHANGE: 'status_change',
    SYSTEM: 'system',
  };

  // Ajouter une notification
  addNotification(type, title, message, data = {}) {
    const notification = {
      id: Date.now(),
      type,
      title,
      message,
      data,
      timestamp: new Date().toISOString(),
      read: false,
      priority: data.priority || 'normal', // low, normal, high
    };

    this.notifications.unshift(notification);

    // Limiter à 100 notifications max
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }

    this.saveNotifications();
    this.notifyListeners();

    return notification;
  }

  // Obtenir toutes les notifications
  getNotifications() {
    return this.notifications;
  }

  // Obtenir les notifications non lues
  getUnreadNotifications() {
    return this.notifications.filter((n) => !n.read);
  }

  // Obtenir le nombre de notifications non lues
  getUnreadCount() {
    return this.getUnreadNotifications().length;
  }

  // Marquer une notification comme lue
  markAsRead(notificationId) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.saveNotifications();
    this.notifyListeners();
  }

  // Supprimer une notification
  deleteNotification(notificationId) {
    this.notifications = this.notifications.filter(
      (n) => n.id !== notificationId
    );
    this.saveNotifications();
    this.notifyListeners();
  }

  // Supprimer toutes les notifications
  clearAll() {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  // Supprimer les notifications anciennes (plus de 30 jours)
  clearOldNotifications() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    this.notifications = this.notifications.filter(
      (n) => new Date(n.timestamp) > thirtyDaysAgo
    );

    this.saveNotifications();
    this.notifyListeners();
  }

  // Vérifier les nouvelles données et créer des notifications
  checkForNewData() {
    const lastCheck = this.getLastCheck();
    const now = new Date();

    // Import du service de données (simulation)
    if (typeof window !== 'undefined' && window.dataService) {
      const clients = window.dataService.getClients();
      const subscribers = window.dataService.getSubscribers();

      // Vérifier nouveaux clients
      const newClients = clients.filter(
        (c) => new Date(c.createdAt) > lastCheck
      );

      newClients.forEach((client) => {
        this.addNotification(
          this.TYPES.NEW_CLIENT,
          'Nouvelle demande de projet',
          `${client.name} a soumis une demande de projet`,
          { clientId: client.id, priority: 'high' }
        );
      });

      // Vérifier nouveaux abonnés
      const newSubscribers = subscribers.filter(
        (s) => new Date(s.subscribedAt) > lastCheck
      );

      newSubscribers.forEach((subscriber) => {
        this.addNotification(
          this.TYPES.NEW_SUBSCRIBER,
          'Nouvel abonné newsletter',
          `${subscriber.email} s'est abonné à la newsletter`,
          { subscriberId: subscriber.id, priority: 'normal' }
        );
      });
    }

    this.setLastCheck(now);
  }

  // Notification pour changement de statut client
  notifyStatusChange(clientId, oldStatus, newStatus, clientName) {
    const statusLabels = {
      nouveau: 'Nouveau',
      en_cours: 'En cours',
      termine: 'Terminé',
    };

    this.addNotification(
      this.TYPES.STATUS_CHANGE,
      'Statut client modifié',
      `${clientName}: ${statusLabels[oldStatus]} → ${statusLabels[newStatus]}`,
      { clientId, oldStatus, newStatus, priority: 'normal' }
    );
  }

  // Notification système
  notifySystem(title, message, priority = 'normal') {
    this.addNotification(this.TYPES.SYSTEM, title, message, { priority });
  }

  // Écouter les changements de notifications
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  // Notifier tous les listeners
  notifyListeners() {
    this.listeners.forEach((callback) => {
      try {
        callback({
          notifications: this.notifications,
          unreadCount: this.getUnreadCount(),
        });
      } catch (error) {
        console.error('Erreur dans le listener de notification:', error);
      }
    });
  }

  // Obtenir les paramètres de notification
  getSettings() {
    const stored = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
    return stored
      ? JSON.parse(stored)
      : {
          enabled: true,
          showToasts: true,
          sound: false,
          autoCheck: true,
          checkInterval: 30000, // 30 secondes
        };
  }

  // Sauvegarder les paramètres
  saveSettings(settings) {
    localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Utilitaires privés
  getStoredNotifications() {
    const stored = localStorage.getItem(this.STORAGE_KEYS.NOTIFICATIONS);
    return stored ? JSON.parse(stored) : [];
  }

  saveNotifications() {
    localStorage.setItem(
      this.STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(this.notifications)
    );
  }

  getLastCheck() {
    const stored = localStorage.getItem(this.STORAGE_KEYS.LAST_CHECK);
    return stored
      ? new Date(stored)
      : new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago
  }

  setLastCheck(date) {
    localStorage.setItem(this.STORAGE_KEYS.LAST_CHECK, date.toISOString());
  }

  // Formatage des dates pour l'affichage
  formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) {
      return "À l'instant";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} min`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours}h`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days}j`;
    } else {
      return time.toLocaleDateString('fr-FR');
    }
  }

  // Obtenir l'icône selon le type
  getNotificationIcon(type) {
    const icons = {
      [this.TYPES.NEW_CLIENT]: '👤',
      [this.TYPES.NEW_SUBSCRIBER]: '📧',
      [this.TYPES.STATUS_CHANGE]: '🔄',
      [this.TYPES.SYSTEM]: '⚙️',
    };
    return icons[type] || '📢';
  }

  // Obtenir la couleur selon la priorité
  getPriorityColor(priority) {
    const colors = {
      low: 'text-gray-400',
      normal: 'text-blue-400',
      high: 'text-red-400',
    };
    return colors[priority] || colors.normal;
  }

  // Initialiser le service (à appeler au démarrage de l'app)
  init() {
    // Nettoyer les anciennes notifications au démarrage
    this.clearOldNotifications();

    // Exposer le service globalement pour les autres composants
    if (typeof window !== 'undefined') {
      window.notificationService = this;
    }

    // Démarrer la vérification automatique si activée
    const settings = this.getSettings();
    if (settings.autoCheck) {
      this.startAutoCheck(settings.checkInterval);
    }
  }

  // Démarrer la vérification automatique
  startAutoCheck(interval = 30000) {
    if (this.autoCheckInterval) {
      clearInterval(this.autoCheckInterval);
    }

    this.autoCheckInterval = setInterval(() => {
      this.checkForNewData();
    }, interval);
  }

  // Arrêter la vérification automatique
  stopAutoCheck() {
    if (this.autoCheckInterval) {
      clearInterval(this.autoCheckInterval);
      this.autoCheckInterval = null;
    }
  }
}

export default new NotificationService();
