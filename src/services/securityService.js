// 🛡️ Service de sécurité avancé pour validation et protection
import DOMPurify from 'dompurify';

class SecurityService {
  constructor() {
    this.securityPolicies = {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedFileTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      maxFilesPerUpload: 5,
      rateLimitRequests: 10, // Requests per minute
      sessionTimeout: 60 * 60 * 1000, // 1 hour
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
    };

    this.rateLimitStorage = new Map();
    this.loginAttempts = new Map();
    this.initializeDOMPurify();
  }

  // Configurer DOMPurify
  initializeDOMPurify() {
    DOMPurify.setConfig({
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'a', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'title', 'target'],
      KEEP_CONTENT: true,
      SAFE_FOR_TEMPLATES: true,
    });
  }

  // ===== SANITISATION HTML AVEC DOMPurify =====

  // Nettoyer HTML dangereux (XSS prevention)
  sanitizeHTML(html) {
    return DOMPurify.sanitize(html);
  }

  // Nettoyer complètement - ne garder que le texte
  sanitizeText(text) {
    if (!text) return '';
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  }

  // ===== VALIDATION ET SANITISATION =====

  // Nettoyer et valider les entrées utilisateur
  sanitizeInput(input, type = 'text') {
    if (!input) return '';

    let sanitized = input.toString().trim();

    switch (type) {
      case 'email':
        sanitized = sanitized.toLowerCase();
        sanitized = sanitized.replace(/[<>]/g, '');
        break;
      case 'name':
        // Supprimer les caractères dangereux mais garder les accents
        sanitized = sanitized.replace(/[<>"'%;()&+]/g, '');
        break;
      case 'message':
        // Utiliser DOMPurify pour nettoyer
        sanitized = this.sanitizeText(sanitized);
        break;
      case 'phone':
        // Garder seulement les chiffres, espaces, +, -, ()
        sanitized = sanitized.replace(/[^0-9\s+\-()]/g, '');
        break;
    }

    return sanitized;
  }

  // ===== VALIDATEURS SPÉCIFIQUES =====

  // Valider email
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    return {
      isValid,
      sanitized: this.sanitizeInput(email, 'email'),
      error: isValid ? null : 'Email invalide',
    };
  }

  // Valider URL
  validateURL(url) {
    try {
      new URL(url);
      return {
        isValid: true,
        sanitized: url,
        error: null,
      };
    } catch {
      return {
        isValid: false,
        sanitized: '',
        error: 'URL invalide',
      };
    }
  }

  // Valider téléphone
  validatePhone(phone) {
    const phoneRegex = /^[\d\s+\-()]{10,}$/;
    const isValid = phoneRegex.test(phone.replace(/\s/g, ''));
    return {
      isValid,
      sanitized: this.sanitizeInput(phone, 'phone'),
      error: isValid ? null : 'Numéro de téléphone invalide',
    };
  }

  // Valider un champ texte
  validateText(text, options = {}) {
    const {
      minLength = 2,
      maxLength = 500,
      required = true,
      type = 'text',
    } = options;

    const sanitized = this.sanitizeInput(text, type);
    const errors = [];

    if (required && sanitized.length === 0) {
      errors.push('Ce champ est requis');
    }

    if (sanitized.length < minLength && sanitized.length > 0) {
      errors.push(`Minimum ${minLength} caractères`);
    }

    if (sanitized.length > maxLength) {
      errors.push(`Maximum ${maxLength} caractères`);
    }

    return {
      isValid: errors.length === 0,
      sanitized,
      errors,
    };
  }

  // Valider un formulaire complet
  validateFormData(formData, schema) {
    const errors = {};
    const sanitized = {};

    Object.keys(schema).forEach((field) => {
      const fieldSchema = schema[field];
      const value = formData[field] || '';

      if (fieldSchema.type === 'email') {
        const result = this.validateEmail(value);
        if (!result.isValid) {
          errors[field] = result.error;
        }
        sanitized[field] = result.sanitized;
      } else if (fieldSchema.type === 'phone') {
        const result = this.validatePhone(value);
        if (!result.isValid) {
          errors[field] = result.error;
        }
        sanitized[field] = result.sanitized;
      } else if (fieldSchema.type === 'text') {
        const result = this.validateText(value, fieldSchema);
        if (!result.isValid) {
          errors[field] = result.errors[0];
        }
        sanitized[field] = result.sanitized;
      } else if (fieldSchema.type === 'password') {
        const result = this.validatePasswordStrength(value);
        if (!result.isValid) {
          errors[field] = `Mot de passe trop faible (${result.strength})`;
        }
        sanitized[field] = value;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitized,
    };
  }

  // Valider et nettoyer les fichiers
  validateFile(file) {
    const errors = [];

    // Vérifier la taille
    if (file.size > this.securityPolicies.maxFileSize) {
      errors.push(
        `Fichier trop volumineux: ${file.name} (max ${this.formatFileSize(
          this.securityPolicies.maxFileSize
        )})`
      );
    }

    // Vérifier le type MIME
    if (!this.securityPolicies.allowedFileTypes.includes(file.type)) {
      errors.push(`Type de fichier non autorisé: ${file.name} (${file.type})`);
    }

    // Vérifier le nom du fichier
    if (this.hasUnsafeFileName(file.name)) {
      errors.push(`Nom de fichier dangereux: ${file.name}`);
    }

    // Vérifier l'extension vs type MIME
    if (!this.isExtensionMatchingMime(file.name, file.type)) {
      errors.push(`Extension et type MIME incohérents: ${file.name}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedName: this.sanitizeFileName(file.name),
    };
  }

  // Nettoyer le nom de fichier
  sanitizeFileName(fileName) {
    return fileName
      .replace(/[^a-zA-Z0-9.\-_]/g, '_') // Remplacer caractères dangereux
      .replace(/_{2,}/g, '_') // Éviter les underscores multiples
      .substring(0, 100); // Limiter la longueur
  }

  // Vérifier si le nom du fichier est dangereux
  hasUnsafeFileName(fileName) {
    const dangerousPatterns = [
      /\.\./, // Directory traversal
      /[<>:"|?*]/, // Caractères interdits Windows
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Noms réservés Windows
      /\.(exe|bat|cmd|scr|pif|com|lnk|jar)$/i, // Extensions dangereuses
    ];

    return dangerousPatterns.some((pattern) => pattern.test(fileName));
  }

  // Vérifier cohérence extension/MIME
  isExtensionMatchingMime(fileName, mimeType) {
    const extension = fileName.split('.').pop().toLowerCase();
    const mimeMap = {
      jpg: ['image/jpeg'],
      jpeg: ['image/jpeg'],
      png: ['image/png'],
      gif: ['image/gif'],
      webp: ['image/webp'],
      pdf: ['application/pdf'],
      txt: ['text/plain'],
      doc: ['application/msword'],
      docx: [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
    };

    const allowedMimes = mimeMap[extension];
    return allowedMimes ? allowedMimes.includes(mimeType) : false;
  }

  // ===== PROTECTION CONTRE LES ATTAQUES =====

  // Rate limiting
  checkRateLimit(identifier) {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    if (!this.rateLimitStorage.has(identifier)) {
      this.rateLimitStorage.set(identifier, []);
    }

    const requests = this.rateLimitStorage.get(identifier);

    // Nettoyer les anciennes requêtes
    const recentRequests = requests.filter((time) => time > windowStart);
    this.rateLimitStorage.set(identifier, recentRequests);

    // Vérifier la limite
    if (recentRequests.length >= this.securityPolicies.rateLimitRequests) {
      return {
        allowed: false,
        retryAfter: Math.ceil((recentRequests[0] + 60000 - now) / 1000),
      };
    }

    // Ajouter la requête actuelle
    recentRequests.push(now);
    this.rateLimitStorage.set(identifier, recentRequests);

    return { allowed: true };
  }

  // Protection contre les attaques de force brute
  checkLoginAttempts(identifier) {
    const now = Date.now();

    if (!this.loginAttempts.has(identifier)) {
      this.loginAttempts.set(identifier, {
        count: 0,
        lastAttempt: now,
        lockedUntil: 0,
      });
    }

    const attempts = this.loginAttempts.get(identifier);

    // Vérifier si encore verrouillé
    if (attempts.lockedUntil > now) {
      return {
        allowed: false,
        lockedUntil: attempts.lockedUntil,
        remainingTime: Math.ceil((attempts.lockedUntil - now) / 1000),
      };
    }

    // Reset si plus de 15 minutes depuis la dernière tentative
    if (now - attempts.lastAttempt > this.securityPolicies.lockoutDuration) {
      attempts.count = 0;
    }

    return { allowed: true, attempts: attempts.count };
  }

  // Enregistrer une tentative de connexion échouée
  recordFailedLogin(identifier) {
    const now = Date.now();

    if (!this.loginAttempts.has(identifier)) {
      this.loginAttempts.set(identifier, {
        count: 0,
        lastAttempt: now,
        lockedUntil: 0,
      });
    }

    const attempts = this.loginAttempts.get(identifier);
    attempts.count++;
    attempts.lastAttempt = now;

    // Verrouiller si trop de tentatives
    if (attempts.count >= this.securityPolicies.maxLoginAttempts) {
      attempts.lockedUntil = now + this.securityPolicies.lockoutDuration;
    }

    this.loginAttempts.set(identifier, attempts);
  }

  // Reset des tentatives de connexion (après succès)
  resetLoginAttempts(identifier) {
    if (this.loginAttempts.has(identifier)) {
      this.loginAttempts.set(identifier, {
        count: 0,
        lastAttempt: Date.now(),
        lockedUntil: 0,
      });
    }
  }

  // ===== VALIDATION AVANCÉE =====

  // Vérifier la force du mot de passe
  validatePasswordStrength(password) {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noCommon: !this.isCommonPassword(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    return {
      isValid: score >= 4,
      score,
      maxScore: 6,
      checks,
      strength: this.getPasswordStrengthLevel(score),
    };
  }

  // Vérifier si le mot de passe est commun
  isCommonPassword(password) {
    const commonPasswords = [
      'password',
      '123456',
      '123456789',
      'qwerty',
      'abc123',
      'password123',
      'admin',
      'letmein',
      'welcome',
      'monkey',
    ];
    return commonPasswords.includes(password.toLowerCase());
  }

  // Obtenir le niveau de force du mot de passe
  getPasswordStrengthLevel(score) {
    if (score <= 2) return 'Très faible';
    if (score <= 3) return 'Faible';
    if (score <= 4) return 'Moyen';
    if (score <= 5) return 'Fort';
    return 'Très fort';
  }

  // ===== UTILITAIRES =====

  // Formater la taille des fichiers
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Générer un token sécurisé
  generateSecureToken(length = 32) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomArray = new Uint8Array(length);
    crypto.getRandomValues(randomArray);

    for (let i = 0; i < length; i++) {
      result += chars[randomArray[i] % chars.length];
    }

    return result;
  }

  // Obtenir les statistiques de sécurité
  getSecurityReport() {
    return {
      rateLimitRequests: this.rateLimitStorage.size,
      blockedIPs: Array.from(this.loginAttempts.entries()).filter(
        ([, data]) => data.lockedUntil > Date.now()
      ).length,
      totalLoginAttempts: Array.from(this.loginAttempts.values()).reduce(
        (sum, data) => sum + data.count,
        0
      ),
      securityPolicies: this.securityPolicies,
      timestamp: new Date().toISOString(),
    };
  }
}

// Instance singleton
const securityService = new SecurityService();

export default securityService;
