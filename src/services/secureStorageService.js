// 🔐 Service de sécurité localStorage amélioré
class SecureStorageService {
  constructor() {
    this.prefix = 'monsite_secure_';
    this.encryptionKey = this.getOrCreateKey();
  }

  // Générer ou récupérer la clé de chiffrement
  getOrCreateKey() {
    let key = sessionStorage.getItem('app_key');
    if (!key) {
      key = this.generateSecureKey();
      sessionStorage.setItem('app_key', key);
    }
    return key;
  }

  // Générer une clé sécurisée
  generateSecureKey() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  }

  // Chiffrement simple (XOR avec clé)
  encrypt(data) {
    const jsonString = JSON.stringify(data);
    const key = this.encryptionKey;
    let encrypted = '';

    for (let i = 0; i < jsonString.length; i++) {
      const keyChar = key[i % key.length];
      const encryptedChar = String.fromCharCode(
        jsonString.charCodeAt(i) ^ keyChar.charCodeAt(0)
      );
      encrypted += encryptedChar;
    }

    return btoa(encrypted); // Base64 encode
  }

  // Déchiffrement
  decrypt(encryptedData) {
    try {
      const encrypted = atob(encryptedData); // Base64 decode
      const key = this.encryptionKey;
      let decrypted = '';

      for (let i = 0; i < encrypted.length; i++) {
        const keyChar = key[i % key.length];
        const decryptedChar = String.fromCharCode(
          encrypted.charCodeAt(i) ^ keyChar.charCodeAt(0)
        );
        decrypted += decryptedChar;
      }

      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Erreur de déchiffrement:', error);
      return null;
    }
  }

  // Stocker de manière sécurisée
  setSecureItem(key, data) {
    try {
      const encrypted = this.encrypt(data);
      const fullKey = this.prefix + key;
      localStorage.setItem(fullKey, encrypted);

      // Ajouter timestamp et checksum
      const metadata = {
        timestamp: Date.now(),
        checksum: this.generateChecksum(encrypted),
      };
      localStorage.setItem(fullKey + '_meta', JSON.stringify(metadata));

      return true;
    } catch (error) {
      console.error('Erreur stockage sécurisé:', error);
      return false;
    }
  }

  // Récupérer de manière sécurisée
  getSecureItem(key) {
    try {
      const fullKey = this.prefix + key;
      const encrypted = localStorage.getItem(fullKey);
      const metadata = JSON.parse(
        localStorage.getItem(fullKey + '_meta') || '{}'
      );

      if (!encrypted) return null;

      // Vérifier l'intégrité
      if (
        metadata.checksum &&
        metadata.checksum !== this.generateChecksum(encrypted)
      ) {
        console.warn('Intégrité des données compromise pour:', key);
        this.removeSecureItem(key);
        return null;
      }

      // Vérifier l'expiration (24h par défaut)
      if (
        metadata.timestamp &&
        Date.now() - metadata.timestamp > 24 * 60 * 60 * 1000
      ) {
        console.info('Données expirées pour:', key);
        this.removeSecureItem(key);
        return null;
      }

      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Erreur récupération sécurisée:', error);
      return null;
    }
  }

  // Supprimer un élément sécurisé
  removeSecureItem(key) {
    const fullKey = this.prefix + key;
    localStorage.removeItem(fullKey);
    localStorage.removeItem(fullKey + '_meta');
  }

  // Générer un checksum simple
  generateChecksum(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  // Nettoyer les données expirées
  cleanExpiredData() {
    const keys = Object.keys(localStorage);
    const expiredKeys = [];

    keys.forEach((key) => {
      if (key.startsWith(this.prefix) && key.endsWith('_meta')) {
        try {
          const metadata = JSON.parse(localStorage.getItem(key));
          if (
            metadata.timestamp &&
            Date.now() - metadata.timestamp > 24 * 60 * 60 * 1000
          ) {
            const baseKey = key.replace('_meta', '');
            expiredKeys.push(baseKey);
            expiredKeys.push(key);
          }
        } catch {
          // Supprimer les métadonnées corrompues
          expiredKeys.push(key);
        }
      }
    });

    expiredKeys.forEach((key) => localStorage.removeItem(key));
    return expiredKeys.length;
  }

  // Obtenir les statistiques de sécurité
  getSecurityStats() {
    const keys = Object.keys(localStorage);
    const secureItems = keys.filter((key) => key.startsWith(this.prefix));

    return {
      totalSecureItems: secureItems.length / 2, // Diviser par 2 car chaque item a ses métadonnées
      encryptionActive: true,
      lastCleanup: this.getSecureItem('last_cleanup') || null,
      storageUsage: this.calculateStorageUsage(),
    };
  }

  // Calculer l'utilisation du stockage
  calculateStorageUsage() {
    let totalSize = 0;
    for (let key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    return {
      used: totalSize,
      usedKB: Math.round((totalSize / 1024) * 100) / 100,
      limit: 5120, // 5MB limit approximatif
      percentage: Math.round((totalSize / (5120 * 1024)) * 100),
    };
  }
}

// Instance singleton
const secureStorageService = new SecureStorageService();

export default secureStorageService;
