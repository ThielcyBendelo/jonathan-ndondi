class AnalyticsService {
  constructor() {
    this.consent = this.getStoredConsent();
    this.sessionId = this.generateSessionId();
    this.pageLoadTime = Date.now();
    this.events = [];
    this.isInitialized = false;
  }

  // Générer un ID de session unique
  generateSessionId() {
    return (
      'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  // Récupérer le consentement stocké
  getStoredConsent() {
    try {
      const stored = localStorage.getItem('analytics-consent');
      return stored !== null ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // Sauvegarder le consentement
  saveConsent(consent) {
    try {
      localStorage.setItem(
        'analytics-consent',
        JSON.stringify({
          granted: consent,
          timestamp: Date.now(),
          version: '1.0',
        })
      );
      this.consent = {
        granted: consent,
        timestamp: Date.now(),
        version: '1.0',
      };
    } catch {
      // Ignore errors
    }
  }

  // Demander le consentement (banner RGPD)
  requestConsent() {
    return new Promise((resolve) => {
      if (this.consent !== null) {
        resolve(this.consent.granted);
        return;
      }

      // Créer un banner de consentement simple
      const banner = document.createElement('div');
      banner.innerHTML = `
        <div style="
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          color: white;
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          max-width: 400px;
          z-index: 9999;
          font-family: system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.5;
        ">
          <div style="margin-bottom: 15px;">
            <strong>🍪 Cookies & Analytics</strong><br>
            Nous utilisons des analytics anonymes pour améliorer votre expérience. 
            Aucune donnée personnelle n'est collectée.
          </div>
          <div style="display: flex; gap: 10px;">
            <button id="analytics-accept" style="
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 8px 16px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 12px;
            ">Accepter</button>
            <button id="analytics-decline" style="
              background: transparent;
              border: 1px solid rgba(255,255,255,0.3);
              color: white;
              padding: 8px 16px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 12px;
            ">Refuser</button>
          </div>
        </div>
      `;

      document.body.appendChild(banner);

      // Gérer les clics
      document.getElementById('analytics-accept').onclick = () => {
        this.saveConsent(true);
        document.body.removeChild(banner);
        resolve(true);
      };

      document.getElementById('analytics-decline').onclick = () => {
        this.saveConsent(false);
        document.body.removeChild(banner);
        resolve(false);
      };
    });
  }

  // Initialiser le service
  async init() {
    if (this.isInitialized) return;

    const hasConsent = await this.requestConsent();

    if (hasConsent) {
      this.startTracking();
    }

    this.isInitialized = true;
  }

  // Démarrer le tracking
  startTracking() {
    // Tracker la page vue
    this.trackPageView();

    // Tracker le temps passé
    this.trackTimeOnPage();

    // Tracker les interactions
    this.trackUserInteractions();
  }

  // Tracker une page vue
  trackPageView() {
    if (!this.consent?.granted) return;

    const pageData = {
      type: 'page_view',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      page: window.location.pathname,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
    };

    this.logEvent(pageData);
  }

  // Tracker le temps passé sur la page
  trackTimeOnPage() {
    if (!this.consent?.granted) return;

    window.addEventListener('beforeunload', () => {
      const timeSpent = Date.now() - this.pageLoadTime;
      this.logEvent({
        type: 'time_on_page',
        timestamp: Date.now(),
        sessionId: this.sessionId,
        timeSpent: timeSpent,
        page: window.location.pathname,
      });
    });
  }

  // Tracker les interactions utilisateur
  trackUserInteractions() {
    if (!this.consent?.granted) return;

    // Tracker les clics sur les liens de navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        this.trackEvent('navigation_click', {
          target: link.getAttribute('href'),
          text: link.textContent.trim(),
        });
      }

      // Tracker les clics sur les boutons
      const button = e.target.closest('button');
      if (button) {
        this.trackEvent('button_click', {
          text: button.textContent.trim().substring(0, 50),
          className: button.className,
        });
      }
    });

    // Tracker le scroll
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100
      );
      if (currentScroll > maxScroll) {
        maxScroll = currentScroll;
        if ([25, 50, 75, 90].includes(currentScroll)) {
          this.trackEvent('scroll_depth', { depth: currentScroll });
        }
      }
    });
  }

  // Tracker un événement personnalisé
  trackEvent(eventName, data = {}) {
    if (!this.consent?.granted) return;

    const eventData = {
      type: 'custom_event',
      event: eventName,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      page: window.location.pathname,
      ...data,
    };

    this.logEvent(eventData);
  }

  // Logger un événement (console pour développement, peut être envoyé à un service)
  logEvent(eventData) {
    this.events.push(eventData);

    // En développement, logger dans la console
    if (import.meta.env.DEV) {
      console.log('📊 Analytics:', eventData);
    }

    // Ici, vous pourriez envoyer les données à votre service d'analytics
    // this.sendToAnalyticsService(eventData);

    // Nettoyer les anciens événements (garder seulement les 100 derniers)
    if (this.events.length > 100) {
      this.events = this.events.slice(-100);
    }
  }

  // Méthodes publiques pour tracker des événements spécifiques
  trackFormSubmission(formName, success = true) {
    this.trackEvent('form_submission', { formName, success });
  }

  trackDownload(fileName) {
    this.trackEvent('download', { fileName });
  }

  trackVideoPlay(videoTitle) {
    this.trackEvent('video_play', { videoTitle });
  }

  trackSearch(query, results) {
    this.trackEvent('search', { query, results });
  }

  // Obtenir les statistiques de session
  getSessionStats() {
    return {
      sessionId: this.sessionId,
      eventsCount: this.events.length,
      timeSpent: Date.now() - this.pageLoadTime,
      consent: this.consent,
    };
  }

  // Révoquer le consentement
  revokeConsent() {
    this.saveConsent(false);
    this.events = [];
  }
}

export default new AnalyticsService();
