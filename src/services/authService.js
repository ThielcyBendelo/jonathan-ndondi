/**
 * 🔐 Service d'authentification sécurisé
 * Gère le login, logout, tokens et sessions
 */

import secureAPIClient from '../utils/secureAPIClient';
import securityService from './securityService';
import roleService from './roleService';


// 🧪 MODE TEST - Utiliser mock data si pas de backend
const USE_MOCK_AUTH = true; // ← À mettre à FALSE quand le backend est prêt

// Email admin personnalisé
const ADMIN_EMAIL = "bendelothielcy@gmail.com";

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authToken = null;
    this.refreshInterval = null;
    this.sessionTimeout = 60 * 60 * 1000; // 1 hour
  }

  /**
   * 🧪 Mock data pour développement (quand pas de backend)
   */
  mockLogin(email, password) {
    // Credentials de test
    const testUsers = {
      'admin@example.com': {
        email: 'admin@example.com',
        password: 'Admin@12345',
        name: 'Administrator',
        role: 'admin',
        id: 1,
      },
      'user@example.com': {
        email: 'user@example.com',
        password: 'User@12345',
        name: 'Regular User',
        role: 'user',
        id: 2,
      },
      'test@example.com': {
        email: 'test@example.com',
        password: 'Test@12345',
        name: 'Test User',
        role: 'user',
        id: 3,
      },
      // Ajout de l'admin personnalisé
      [ADMIN_EMAIL]: {
        email: ADMIN_EMAIL,
        password: 'bendelo1996$$$$$',
        name: 'Admin Bendelo',
        role: 'admin',
        id: 99,
      },
    };

    const user = testUsers[email];
    
    if (!user || user.password !== password) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Forcer le rôle admin si email correspond
    let role = user.role;
    if (user.email === ADMIN_EMAIL) {
      role = 'admin';
    }

    // Générer un mock token
    const token = 'mock_token_' + Math.random().toString(36).substr(2, 9);
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role,
      },
    };
  }

  /**
   * 🧪 Mock register
   */
  mockRegister(email, password, name) {
    // Générer un ID fictif
    const id = Math.floor(Math.random() * 10000);
    const token = 'mock_token_' + Math.random().toString(36).substr(2, 9);

    return {
      token,
      user: {
        id,
        email,
        name,
        role: 'user',
      },
    };
  }

  /**
   * Initialiser le service auth au démarrage
   */
  async initialize() {
    const token = this.getStoredToken();
    console.log('[authService] INIT: token récupéré =', token);
    if (token) {
      try {
        // Vérifier si le token est valide
        const user = await this.validateToken(token);
        this.authToken = token;
        this.currentUser = user;
        this.isAuthenticated = true;
        this.startRefreshInterval();
        console.log('[authService] INIT: utilisateur récupéré =', user);
      } catch (error) {
        console.warn('Token validation failed:', error);
        this.clearAuth();
      }
    } else {
      console.log('[authService] INIT: aucun token trouvé, utilisateur non connecté');
    }
  }

  /**
   * Login sécurisé
   */
  async login(email, password) {
    // Valider les entrées
    const emailResult = securityService.validateEmail(email);
    if (!emailResult.isValid) {
      throw new Error(emailResult.error);
    }

    // Vérifier le rate limiting pour login
    const rateLimit = securityService.checkLoginAttempts(emailResult.sanitized);
    if (!rateLimit.allowed) {
      throw new Error(
        `Compte temporairement verrouillé. Réessayez dans ${rateLimit.remainingTime}s`
      );
    }

    // Valider la force du mot de passe (vérification côté client)
    if (!password || password.length < 6) {
      throw new Error('Mot de passe requis (minimum 6 caractères)');
    }

    try {
      // 🧪 Utiliser mock si pas de backend
      if (USE_MOCK_AUTH) {
        const mockResponse = this.mockLogin(emailResult.sanitized, password);
        this.authToken = mockResponse.token;
        this.currentUser = mockResponse.user;
        this.isAuthenticated = true;
        roleService.setCurrentUser(mockResponse.user);
        this.storeToken(mockResponse.token);
        securityService.resetLoginAttempts(emailResult.sanitized);
        this.startRefreshInterval();
        console.log('✅ Mock Login successful for:', mockResponse.user.email);
        return mockResponse;
      }

      // Appel API sécurisé (quand backend est prêt)
      const response = await secureAPIClient.post('/api/auth/login', {
        email: emailResult.sanitized,
        password: password, // Le backend doit hasher !
      });

      // Extraire token et user
      const { token, user } = response.data;

      if (!token) {
        throw new Error('Token manquant dans la réponse');
      }

      // Succès - Mettre à jour l'état
      this.authToken = token;
      this.currentUser = user;
      this.isAuthenticated = true;

      // ✅ Mettre à jour le rôle utilisateur
      roleService.setCurrentUser(user);

      // Stocker le token de manière sécurisée
      this.storeToken(token);

      // Reset des tentatives
      securityService.resetLoginAttempts(emailResult.sanitized);

      // Démarrer le refresh automatique
      this.startRefreshInterval();

      console.log('✅ Login successful for:', user.email, '| Role:', user.role);
      return { token, user };
    } catch (error) {
      // Enregistrer tentative échouée
      securityService.recordFailedLogin(emailResult.sanitized);

      console.error('❌ Login failed:', error);
      throw error;
    }
  }

  /**
   * Register sécurisé
   */
  async register(email, password, name) {
    // Valider les entrées
    const emailResult = securityService.validateEmail(email);
    if (!emailResult.isValid) {
      throw new Error(emailResult.error);
    }

    const nameResult = securityService.validateText(name, {
      minLength: 2,
      maxLength: 50,
      required: true,
    });
    if (!nameResult.isValid) {
      throw new Error(nameResult.errors[0]);
    }

    // Valider la force du mot de passe
    const pwdResult = securityService.validatePasswordStrength(password);
    if (!pwdResult.isValid) {
      throw new Error(`Mot de passe trop faible: ${pwdResult.strength}`);
    }

    // Appel API sécurisé
    if (USE_MOCK_AUTH) {
      // 🧪 Mock register
      const mockResponse = this.mockRegister(
        emailResult.sanitized,
        password,
        nameResult.sanitized
      );
      this.authToken = mockResponse.token;
      this.currentUser = mockResponse.user;
      this.isAuthenticated = true;
      roleService.setCurrentUser(mockResponse.user);
      this.storeToken(mockResponse.token);
      this.startRefreshInterval();
      console.log('✅ Mock Register successful for:', mockResponse.user.email);
      return mockResponse;
    }

    // API réelle (quand backend est prêt)
    const response = await secureAPIClient.post('/api/auth/register', {
      email: emailResult.sanitized,
      password: password,
      name: nameResult.sanitized,
    });

    return response.data;
  }

  /**
   * Logout sécurisé
   */
  async logout() {
    try {
      // 🧪 Ignorer l'API si en mode mock
      if (!USE_MOCK_AUTH) {
        // Notifier le serveur
        await secureAPIClient.post('/api/auth/logout', {});
      }
    } catch (error) {
      console.warn('Logout API error:', error);
      // Continuer même si l'API échoue
    } finally {
      // Nettoyer les données locales
      this.clearAuth();
    }
  }

  /**
   * Stocker le token de manière sécurisée
   */
  storeToken(token) {
    // ✅ Option 1: SessionStorage (recommandé pour SPA)
    // Avantage: Supprimé à la fermeture du navigateur
    // Inconvénient: Non persistent across navigators
    try {
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('tokenExpiry', Date.now() + this.sessionTimeout);
    } catch (error) {
      console.warn('SessionStorage error:', error);
    }

    // ❌ JAMAIS localStorage pour les tokens sensibles
    // Raison: Vulnérable aux attaques XSS
  }

  /**
   * Récupérer le token stocké
   */
  getStoredToken() {
    try {
      const token = sessionStorage.getItem('authToken');
      const expiry = parseInt(sessionStorage.getItem('tokenExpiry'), 10);

      // Vérifier l'expiration
      if (token && expiry && Date.now() > expiry) {
        this.clearAuth();
        return null;
      }

      return token;
    } catch (error) {
      console.warn('Get stored token error:', error);
      return null;
    }
  }

  /**
   * Récupérer le token courant
   */
  getToken() {
    return this.authToken || this.getStoredToken();
  }

  /**
   * Valider le token avec le serveur
   */
  async validateToken(token) {
    if (USE_MOCK_AUTH) {
      // En mode mock, retourne simplement l'utilisateur courant
      if (this.currentUser) {
        return this.currentUser;
      }
      // Si pas d'utilisateur courant, retourne un utilisateur admin fictif pour test
      return {
        id: 99,
        email: ADMIN_EMAIL,
        name: 'Admin Bendelo',
        role: 'admin',
      };
    }
    try {
      const response = await secureAPIClient.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch {
      throw new Error('Token invalide');
    }
  }

  /**
   * Rafraîchir le token
   */
  async refreshToken() {
    try {
      const response = await secureAPIClient.post('/api/auth/refresh', {});

      const { token } = response.data;
      this.authToken = token;
      this.storeToken(token);

      console.log('✅ Token refreshed');
      return token;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      this.clearAuth();
      throw error;
    }
  }

  /**
   * Démarrer le refresh automatique du token
   */
  startRefreshInterval() {
    // Rafraîchir 5 minutes avant l'expiration
    const refreshBefore = 5 * 60 * 1000;
    const interval = this.sessionTimeout - refreshBefore;

    this.refreshInterval = setInterval(() => {
      if (this.isAuthenticated) {
        this.refreshToken().catch(() => {
          // Si le refresh échoue, logout
          this.logout();
        });
      }
    }, interval);
  }

  /**
   * Arrêter le refresh automatique
   */
  stopRefreshInterval() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * Nettoyer l'authentification
   */
  clearAuth() {
    this.authToken = null;
    this.currentUser = null;
    this.isAuthenticated = false;
    this.stopRefreshInterval();

    // ✅ Nettoyer aussi les rôles
    roleService.clear();

    try {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('tokenExpiry');
    } catch (error) {
      console.warn('Clear auth storage error:', error);
    }

    console.log('🔓 Authentication cleared');
  }

  /**
   * Vérifier si utilisateur est authentifié
   */
  isLoggedIn() {
    return this.isAuthenticated && this.authToken !== null;
  }

  /**
   * Obtenir l'utilisateur courant
   */
  getCurrentUser() {
    // Si l'utilisateur courant a l'email admin, forcer le rôle admin
    if (this.currentUser && this.currentUser.email === ADMIN_EMAIL) {
      return { ...this.currentUser, role: 'admin' };
    }
    return this.currentUser;
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(profileData) {
    try {
      const response = await secureAPIClient.put('/api/auth/profile', profileData);

      // Mettre à jour les données locales
      this.currentUser = response.data;

      return response.data;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(currentPassword, newPassword) {
    // Valider les entrées
    if (!currentPassword || currentPassword.length < 6) {
      throw new Error('Mot de passe actuel requis');
    }

    const newPwdResult = securityService.validatePasswordStrength(newPassword);
    if (!newPwdResult.isValid) {
      throw new Error(`Nouveau mot de passe faible: ${newPwdResult.strength}`);
    }

    try {
      await secureAPIClient.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
      });

      console.log('✅ Password changed successfully');
    } catch (error) {
      console.error('❌ Password change failed:', error);
      throw error;
    }
  }

  /**
   * Demander la réinitialisation du mot de passe
   */
  async requestPasswordReset(email) {
    const emailResult = securityService.validateEmail(email);
    if (!emailResult.isValid) {
      throw new Error(emailResult.error);
    }

    try {
      const response = await secureAPIClient.post('/api/auth/forgot-password', {
        email: emailResult.sanitized,
      });

      console.log('✅ Password reset email sent');
      return response.data;
    } catch (error) {
      console.error('❌ Password reset request failed:', error);
      throw error;
    }
  }

  /**
   * Réinitialiser le mot de passe avec token
   */
  async resetPassword(resetToken, newPassword) {
    const pwdResult = securityService.validatePasswordStrength(newPassword);
    if (!pwdResult.isValid) {
      throw new Error(`Mot de passe faible: ${pwdResult.strength}`);
    }

    try {
      const response = await secureAPIClient.post('/api/auth/reset-password', {
        token: resetToken,
        newPassword,
      });

      console.log('✅ Password reset successful');
      return response.data;
    } catch (error) {
      console.error('❌ Password reset failed:', error);
      throw error;
    }
  }

  /**
   * Valider la force du mot de passe (utilisation publique)
   */
  validatePasswordStrength(password) {
    return securityService.validatePasswordStrength(password);
  }

  /**
   * Obtenir les statistiques de sécurité
   */
  getSecurityStats() {
    return {
      isAuthenticated: this.isAuthenticated,
      hasToken: !!this.authToken,
      tokenExpiresIn: sessionStorage.getItem('tokenExpiry')
        ? parseInt(sessionStorage.getItem('tokenExpiry'), 10) - Date.now()
        : null,
      user: this.currentUser ? { email: this.currentUser.email } : null,
    };
  }
}

// Instance singleton
const authService = new AuthService();

export default authService;
