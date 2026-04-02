/**
 * 🛡️ API Security Interceptors
 * Ajoute des headers de sécurité et gère les erreurs de sécurité
 */

export class SecureAPIClient {
  constructor(baseURL = '', timeout = 30000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.csrfToken = null;
    this.authToken = null;
  }

  /**
   * Initialiser le client API avec les tokens
   */
  initialize(csrfToken = null, authToken = null) {
    this.csrfToken = csrfToken || this.generateCSRFToken();
    this.authToken = authToken;
    this.storeCSRFToken(this.csrfToken);
  }

  /**
   * Générer un CSRF token
   */
  generateCSRFToken() {
    const token = Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    return token;
  }

  /**
   * Stocker le CSRF token en local storage
   */
  storeCSRFToken(token) {
    try {
      localStorage.setItem('csrf-token', token);
    } catch (e) {
      console.warn('❌ Erreur lors du stockage du CSRF token:', e);
    }
  }

  /**
   * Récupérer le CSRF token
   */
  getCSRFToken() {
    return (
      this.csrfToken ||
      localStorage.getItem('csrf-token') ||
      this.generateCSRFToken()
    );
  }

  /**
   * Construire les headers sécurisés
   */
  buildHeaders(additionalHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': this.getCSRFToken(),
      ...additionalHeaders,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * Effectuer une requête avec gestion des erreurs
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(options.headers);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Vérifier si la réponse est OK
      if (!response.ok) {
        throw new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response
        );
      }

      // Parser la réponse JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return {
          success: true,
          data,
          status: response.status,
        };
      }

      return {
        success: true,
        data: null,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new APIError('Requête expirée', 408);
      }

      if (error instanceof APIError) {
        throw error;
      }

      throw new APIError(
        error.message || 'Erreur réseau',
        0,
        null,
        error
      );
    }
  }
}

/**
 * Classe d'erreur personnalisée pour les erreurs API
 */
export class APIError extends Error {
  constructor(
    message,
    statusCode = 0,
    response = null,
    originalError = null
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.response = response;
    this.originalError = originalError;

    // Messages d'erreur localisés
    this.userMessage = this.getUserMessage(statusCode, message);
  }

  getUserMessage(statusCode, message) {
    const errorMap = {
      400: 'Requête invalide. Vérifiez vos données.',
      401: 'Non authentifié. Connectez-vous.',
      403: 'Accès refusé.',
      404: 'Ressource non trouvée.',
      408: 'Requête expirée. Réessayez.',
      429: 'Trop de requêtes. Attendez avant de réessayer.',
      500: 'Erreur serveur. Réessayez plus tard.',
      503: 'Service indisponible. Réessayez plus tard.',
    };

    return errorMap[statusCode] || message || 'Une erreur est survenue';
  }
}

/**
 * Interceptor pour ajouter des tokens à chaque requête
 */
export const setupAPIInterceptors = (apiClient) => {
  // Avant chaque requête
  const originalRequest = apiClient.request.bind(apiClient);

  apiClient.request = async function (endpoint, options = {}) {
    // Ajouter les headers de sécurité
    options.headers = this.buildHeaders(options.headers);

    // Ajouter les logs de sécurité en développement
    if (import.meta.env.DEV) {
      console.log('🔒 API Request:', {
        method: options.method || 'GET',
        endpoint,
        hasCSRF: !!options.headers['X-CSRF-Token'],
        hasAuth: !!options.headers['Authorization'],
      });
    }

    try {
      const response = await originalRequest(endpoint, options);
      return response;
    } catch (error) {
      // Gérer les erreurs d'authentification
      if (error.statusCode === 401) {
        // Rafraîchir le token ou rediriger vers la connexion
        window.location.href = '/login';
      }

      throw error;
    }
  };

  return apiClient;
};

/**
 * Instance globale du client API sécurisé
 */
export const secureAPIClient = new SecureAPIClient(
  import.meta.env.VITE_API_URL || ''
);

// Initialiser les interceptors
setupAPIInterceptors(secureAPIClient);

export default secureAPIClient;
