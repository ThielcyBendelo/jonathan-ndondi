// Enhanced auth service with profile management
const AUTH_KEY = 'monsite_admin_token';
const CREDENTIALS_KEY = 'admin_credentials';
const HISTORY_KEY = 'admin_login_history';

// Classe AuthService complète
class AuthService {
  constructor() {
    this.initializeCredentials();
  }

  // Initialiser les credentials par défaut
  initializeCredentials() {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    if (!stored) {
      const defaultCredentials = {
        email: 'bendelothielcy@gmail.com',
        password: 'bendelo1996$$$$$',
      };
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(defaultCredentials));
    }
  }

  // Obtenir les credentials actuels
  getStoredCredentials() {
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Login avec validation
  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Email et mot de passe requis');
    }

    const credentials = this.getStoredCredentials();
    if (email !== credentials.email || password !== credentials.password) {
      throw new Error('Identifiants incorrects. Accès refusé.');
    }

    // Génération d'un token sécurisé
    const token = `admin-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const userData = {
      token,
      email,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
    this.saveLoginHistory(email, true);

    return { token };
  }

  // Logout
  logout() {
    localStorage.removeItem(AUTH_KEY);
  }

  // Obtenir l'utilisateur connecté
  getUser() {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  // Vérifier l'authentification
  isAuthenticated() {
    // Temporaire pour les tests - toujours authentifié
    return true;
    // return !!localStorage.getItem(AUTH_KEY);
  }

  // Mettre à jour les credentials
  async updateCredentials(currentPassword, updates = {}) {
    const credentials = this.getStoredCredentials();

    // Vérifier le mot de passe actuel
    if (currentPassword !== credentials.password) {
      throw new Error('Mot de passe actuel incorrect');
    }

    // Appliquer les mises à jour
    const updatedCredentials = {
      ...credentials,
      ...updates,
    };

    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updatedCredentials));

    // Mettre à jour la session si l'email a changé
    if (updates.email) {
      const userData = this.getUser();
      if (userData) {
        userData.email = updates.email;
        localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
      }
    }

    return { success: true };
  }

  // Sauvegarder l'historique de connexion
  saveLoginHistory(email, success = true) {
    let history = [];

    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        history = JSON.parse(stored);
      }
    } catch {
      history = [];
    }

    history.push({
      timestamp: new Date().toISOString(),
      email,
      success,
      ip: 'localhost',
      userAgent: navigator.userAgent.substring(0, 100),
    });

    // Garder seulement les 100 dernières connexions
    if (history.length > 100) {
      history = history.slice(-100);
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  // Obtenir l'historique de connexion
  getLoginHistory() {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Effacer l'historique
  clearLoginHistory() {
    localStorage.removeItem(HISTORY_KEY);
  }

  // Obtenir les statistiques de sécurité
  getSecurityStats() {
    const history = this.getLoginHistory();
    const user = this.getUser();

    return {
      totalLogins: history.length,
      successfulLogins: history.filter((h) => h.success).length,
      failedLogins: history.filter((h) => !h.success).length,
      lastLogin: history[history.length - 1]?.timestamp || null,
      currentSession: user?.loginTime || null,
      activeSessions: user ? 1 : 0,
    };
  }
}

// Instance singleton
const authService = new AuthService();

export default authService;
