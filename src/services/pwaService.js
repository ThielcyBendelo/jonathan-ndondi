// Service pour gérer la PWA
class PWAService {
  constructor() {
    this.swRegistration = null;
    this.isOnline = navigator.onLine;
    this.installPrompt = null;
    this.callbacks = {
      onInstallable: [],
      onInstalled: [],
      onUpdateAvailable: [],
      onOffline: [],
      onOnline: [],
    };

    this.init();
  }

  async init() {
    // Vérifier le support des Service Workers
    if ('serviceWorker' in navigator) {
      try {
        await this.registerServiceWorker();
        this.setupEventListeners();
        this.checkInstallability();
      } catch (error) {
        console.error('PWA: Erreur initialisation:', error);
      }
    }
  }

  // Enregistrer le Service Worker
  async registerServiceWorker() {
    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('PWA: Service Worker enregistré:', this.swRegistration);

      // Gérer les mises à jour
      this.swRegistration.addEventListener('updatefound', () => {
        const newWorker = this.swRegistration.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Nouvelle version disponible
              this.triggerCallbacks('onUpdateAvailable', newWorker);
            } else {
              // Première installation
              this.triggerCallbacks('onInstalled');
            }
          }
        });
      });
    } catch (error) {
      console.error('PWA: Erreur enregistrement SW:', error);
      throw error;
    }
  }

  // Configuration des event listeners
  setupEventListeners() {
    // Statut réseau
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.triggerCallbacks('onOnline');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.triggerCallbacks('onOffline');
    });

    // Prompt d'installation
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e;
      this.triggerCallbacks('onInstallable', e);
    });

    // App installée
    window.addEventListener('appinstalled', () => {
      this.installPrompt = null;
      this.triggerCallbacks('onInstalled');
    });

    // Messages du Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, payload } = event.data;

      switch (type) {
        case 'NEW_VERSION_AVAILABLE':
          this.triggerCallbacks('onUpdateAvailable', payload);
          break;
        default:
          console.log('PWA: Message SW:', type, payload);
      }
    });
  }

  // Vérifier si l'app peut être installée
  checkInstallability() {
    // Vérifier si déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA: Application déjà installée');
      return false;
    }

    // Vérifier le support
    if ('getInstalledRelatedApps' in navigator) {
      navigator.getInstalledRelatedApps().then((relatedApps) => {
        if (relatedApps.length > 0) {
          console.log('PWA: App déjà installée via store');
        }
      });
    }

    return true;
  }

  // Installer l'application
  async installApp() {
    if (!this.installPrompt) {
      throw new Error('Installation non disponible');
    }

    try {
      const result = await this.installPrompt.prompt();
      console.log('PWA: Résultat installation:', result);

      if (result.outcome === 'accepted') {
        this.installPrompt = null;
        return true;
      }

      return false;
    } catch (error) {
      console.error('PWA: Erreur installation:', error);
      throw error;
    }
  }

  // Mettre à jour l'application
  async updateApp() {
    if (!this.swRegistration || !this.swRegistration.waiting) {
      throw new Error('Aucune mise à jour disponible');
    }

    try {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    } catch (error) {
      console.error('PWA: Erreur mise à jour:', error);
      throw error;
    }
  }

  // Obtenir des informations sur le cache
  async getCacheInfo() {
    if (!this.swRegistration) return null;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.payload);
      };

      this.swRegistration.active.postMessage({ type: 'GET_CACHE_SIZE' }, [
        messageChannel.port2,
      ]);
    });
  }

  // Vider le cache
  async clearCache() {
    if (!this.swRegistration) return;

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = () => {
        resolve();
      };

      this.swRegistration.active.postMessage({ type: 'CLEAR_CACHE' }, [
        messageChannel.port2,
      ]);
    });
  }

  // Statut de l'application
  getAppStatus() {
    return {
      isOnline: this.isOnline,
      isInstallable: !!this.installPrompt,
      isInstalled: window.matchMedia('(display-mode: standalone)').matches,
      hasServiceWorker: !!this.swRegistration,
      hasUpdate: !!(this.swRegistration && this.swRegistration.waiting),
    };
  }

  // Gestion des callbacks
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      const index = this.callbacks[event].indexOf(callback);
      if (index > -1) {
        this.callbacks[event].splice(index, 1);
      }
    }
  }

  triggerCallbacks(event, data = null) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`PWA: Erreur callback ${event}:`, error);
        }
      });
    }
  }

  // Précharger des ressources
  async preloadResources(urls) {
    if (!this.swRegistration) return;

    try {
      const cache = await caches.open('dynamic-preload');
      await cache.addAll(urls);
      console.log('PWA: Ressources préchargées:', urls.length);
    } catch (error) {
      console.error('PWA: Erreur préchargement:', error);
    }
  }

  // Partage natif
  async shareContent(data) {
    if ('share' in navigator) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('PWA: Erreur partage:', error);
        }
        return false;
      }
    }
    return false;
  }

  // Notifications
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  showNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      });
    }
    return null;
  }
}

// Instance singleton
const pwaService = new PWAService();

export default pwaService;
