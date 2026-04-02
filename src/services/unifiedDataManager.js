// 🗄️ Service de Gestion des Données Unifié et Sécurisé
import secureStorageService from './secureStorageService';

class UnifiedDataManager {
  constructor() {
    this.namespace = 'irbendelo_';
    this.version = '1.0.0';
    this.maxStorageSize = 4 * 1024 * 1024; // 4MB limite sécurité

    // Configuration des collections de données
    this.collections = {
      auth: {
        key: 'auth_v1',
        encrypted: true,
        maxSize: 10 * 1024, // 10KB
        backup: true,
      },
      clients: {
        key: 'clients_v1',
        encrypted: false,
        maxSize: 1024 * 1024, // 1MB
        backup: true,
        compress: true,
      },
      subscribers: {
        key: 'subscribers_v1',
        encrypted: false,
        maxSize: 512 * 1024, // 512KB
        backup: true,
        compress: true,
      },
      payments: {
        key: 'payments_v1',
        encrypted: true,
        maxSize: 1024 * 1024, // 1MB
        backup: true,
        compress: true,
      },
      settings: {
        key: 'settings_v1',
        encrypted: false,
        maxSize: 50 * 1024, // 50KB
        backup: true,
      },
      cache: {
        key: 'cache_v1',
        encrypted: false,
        maxSize: 1024 * 1024, // 1MB
        backup: false,
        compress: true,
        expires: 24 * 60 * 60 * 1000, // 24h
      },
    };

    this.initializeStorage();
  }

  // ===== INITIALISATION =====

  async initializeStorage() {
    try {
      await this.checkVersion();
      await this.validateIntegrity();
      await this.cleanExpiredData();
      console.log('UDM: Stockage initialisé ✅');
    } catch (error) {
      console.error('UDM: Erreur initialisation:', error);
      await this.recoverFromError();
    }
  }

  // Vérifier et migrer les versions
  async checkVersion() {
    const currentVersion = this.getMetadata('version');

    if (!currentVersion) {
      // Première installation - migrer anciennes données
      await this.migrateFromLegacyStorage();
      this.setMetadata('version', this.version);
      this.setMetadata('created', Date.now());
    } else if (currentVersion !== this.version) {
      // Migration nécessaire
      await this.migrateVersion(currentVersion, this.version);
      this.setMetadata('version', this.version);
    }
  }

  // ===== OPÉRATIONS CRUD =====

  // Créer/Mettre à jour une donnée
  async setData(collection, key, data, _options = {}) {
    try {
      const config = this.collections[collection];
      if (!config) throw new Error(`Collection inconnue: ${collection}`);

      // Validation taille
      const dataString = JSON.stringify(data);
      if (dataString.length > config.maxSize) {
        throw new Error(
          `Données trop volumineuses pour ${collection} (max ${this.formatSize(
            config.maxSize
          )})`
        );
      }

      // Préparer les données
      let processedData = data;

      // Compression si activée
      if (config.compress) {
        processedData = await this.compressData(data);
      }

      // Ajout métadonnées
      const record = {
        data: processedData,
        timestamp: Date.now(),
        version: this.version,
        compressed: !!config.compress,
        checksum: this.generateChecksum(dataString),
      };

      // Stockage selon chiffrement
      const fullKey = this.namespace + config.key;

      if (config.encrypted) {
        await secureStorageService.setSecureItem(fullKey, record);
      } else {
        localStorage.setItem(fullKey, JSON.stringify(record));
      }

      // Backup si configuré
      if (config.backup) {
        await this.createBackup(collection, key, record);
      }

      // Indexation
      await this.updateIndex(collection, key);

      console.log(`UDM: Données sauvegardées - ${collection}:${key}`);
      return true;
    } catch (error) {
      console.error(`UDM: Erreur sauvegarde ${collection}:`, error);
      throw error;
    }
  }

  // Récupérer une donnée
  async getData(collection, key = null) {
    try {
      const config = this.collections[collection];
      if (!config) throw new Error(`Collection inconnue: ${collection}`);

      const fullKey = this.namespace + config.key;
      let record;

      // Récupération selon chiffrement
      if (config.encrypted) {
        record = await secureStorageService.getSecureItem(fullKey);
      } else {
        const stored = localStorage.getItem(fullKey);
        record = stored ? JSON.parse(stored) : null;
      }

      if (!record) return null;

      // Validation checksum
      if (record.checksum) {
        const currentChecksum = this.generateChecksum(
          JSON.stringify(record.data)
        );
        if (currentChecksum !== record.checksum) {
          console.warn(
            `UDM: Checksum invalide pour ${collection}, tentative recovery`
          );
          return await this.recoverData(collection, key);
        }
      }

      // Décompression si nécessaire
      let data = record.data;
      if (record.compressed) {
        data = await this.decompressData(data);
      }

      // Vérifier expiration
      if (config.expires && Date.now() - record.timestamp > config.expires) {
        await this.deleteData(collection, key);
        return null;
      }

      return key ? data[key] || null : data;
    } catch (error) {
      console.error(`UDM: Erreur récupération ${collection}:`, error);
      return await this.recoverData(collection, key);
    }
  }

  // Supprimer une donnée
  async deleteData(collection, key = null) {
    try {
      const config = this.collections[collection];
      if (!config) throw new Error(`Collection inconnue: ${collection}`);

      if (key) {
        // Supprimer un élément spécifique
        const data = (await this.getData(collection)) || {};
        delete data[key];
        return await this.setData(collection, null, data);
      } else {
        // Supprimer toute la collection
        const fullKey = this.namespace + config.key;

        if (config.encrypted) {
          await secureStorageService.removeSecureItem(fullKey);
        } else {
          localStorage.removeItem(fullKey);
        }

        await this.removeFromIndex(collection);
        console.log(`UDM: Collection ${collection} supprimée`);
        return true;
      }
    } catch (error) {
      console.error(`UDM: Erreur suppression ${collection}:`, error);
      throw error;
    }
  }

  // ===== COMPRESSION =====

  async compressData(data) {
    try {
      const jsonString = JSON.stringify(data);

      // Compression simple pour éviter dépendance externe
      return {
        compressed: true,
        data: this.simpleCompress(jsonString),
        originalSize: jsonString.length,
      };
    } catch (error) {
      console.warn('UDM: Échec compression, stockage raw:', error);
      return data;
    }
  }

  async decompressData(compressedData) {
    try {
      if (compressedData.compressed) {
        const decompressed = this.simpleDecompress(compressedData.data);
        return JSON.parse(decompressed);
      }
      return compressedData;
    } catch (error) {
      console.error('UDM: Erreur décompression:', error);
      throw error;
    }
  }

  // Compression simple (RLE basique)
  simpleCompress(str) {
    return str.split('').reduce((acc, char, i, arr) => {
      if (i === 0 || char !== arr[i - 1]) {
        acc.push([char, 1]);
      } else {
        acc[acc.length - 1][1]++;
      }
      return acc;
    }, []);
  }

  simpleDecompress(compressed) {
    return compressed.map(([char, count]) => char.repeat(count)).join('');
  }

  // ===== BACKUP & RECOVERY =====

  async createBackup(collection, key, record) {
    try {
      const backupKey = `${this.namespace}backup_${collection}_${Date.now()}`;
      const backup = {
        collection,
        key,
        record,
        timestamp: Date.now(),
      };

      localStorage.setItem(backupKey, JSON.stringify(backup));

      // Limiter nombre de backups (garder 10 max par collection)
      await this.cleanOldBackups(collection);
    } catch (error) {
      console.warn('UDM: Échec backup:', error);
    }
  }

  async recoverData(collection, key) {
    try {
      console.log(`UDM: Tentative recovery ${collection}:${key}`);

      // Chercher backup le plus récent
      const backups = this.getBackups(collection);
      if (backups.length === 0) return null;

      const latestBackup = backups[backups.length - 1];
      const data = latestBackup.record.compressed
        ? await this.decompressData(latestBackup.record.data)
        : latestBackup.record.data;

      console.log('UDM: Recovery réussie depuis backup');
      return key ? data[key] || null : data;
    } catch (error) {
      console.error('UDM: Échec recovery:', error);
      return null;
    }
  }

  // ===== MIGRATION =====

  async migrateFromLegacyStorage() {
    console.log('UDM: Migration depuis ancien stockage...');

    const migrations = [
      // Clients
      {
        from: 'monsite_clients',
        to: 'clients',
        transform: (data) => data, // Pas de transformation nécessaire
      },

      // Subscribers
      {
        from: 'monsite_subscribers',
        to: 'subscribers',
        transform: (data) => data,
      },

      // Auth
      {
        from: 'admin_credentials',
        to: 'auth',
        transform: (data) => ({
          credentials: data,
          migratedAt: Date.now(),
        }),
      },

      // Payments
      {
        from: 'payment_transactions',
        to: 'payments',
        transform: (data) => ({
          transactions: data,
          migratedAt: Date.now(),
        }),
      },

      // Settings
      {
        from: 'theme',
        to: 'settings',
        transform: (theme) => ({
          theme,
          migratedAt: Date.now(),
        }),
      },
    ];

    let migratedCount = 0;

    for (const migration of migrations) {
      try {
        const oldData = localStorage.getItem(migration.from);
        if (oldData) {
          const parsedData = JSON.parse(oldData);
          const transformedData = migration.transform(parsedData);

          await this.setData(migration.to, null, transformedData);

          // Marquer ancien stockage comme migré (ne pas supprimer immédiatement)
          localStorage.setItem(
            `${migration.from}_migrated`,
            Date.now().toString()
          );

          migratedCount++;
          console.log(`UDM: Migré ${migration.from} → ${migration.to}`);
        }
      } catch (error) {
        console.error(`UDM: Échec migration ${migration.from}:`, error);
      }
    }

    console.log(
      `UDM: Migration terminée - ${migratedCount} collections migrées`
    );
  }

  // ===== UTILITAIRES =====

  generateChecksum(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Métadonnées système
  setMetadata(key, value) {
    localStorage.setItem(`${this.namespace}meta_${key}`, JSON.stringify(value));
  }

  getMetadata(key) {
    const stored = localStorage.getItem(`${this.namespace}meta_${key}`);
    return stored ? JSON.parse(stored) : null;
  }

  // Statistiques d'utilisation
  getStorageStats() {
    let totalSize = 0;
    let itemCount = 0;
    const collections = {};

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.namespace)) {
        const item = localStorage.getItem(key);
        const size = item ? item.length : 0;
        totalSize += size;
        itemCount++;

        // Analyser par collection
        const collection = key.replace(this.namespace, '').split('_')[0];
        if (!collections[collection]) {
          collections[collection] = { count: 0, size: 0 };
        }
        collections[collection].count++;
        collections[collection].size += size;
      }
    });

    return {
      totalSize,
      totalSizeFormatted: this.formatSize(totalSize),
      itemCount,
      collections,
      usage: ((totalSize / this.maxStorageSize) * 100).toFixed(2) + '%',
      available: this.formatSize(this.maxStorageSize - totalSize),
    };
  }

  // ===== API PUBLIQUE SIMPLIFIÉE =====

  // Clients
  async saveClient(clientData) {
    const clients = (await this.getData('clients')) || {};
    const id = Date.now().toString();
    clients[id] = { ...clientData, id, createdAt: Date.now() };
    await this.setData('clients', null, clients);
    return clients[id];
  }

  async getClients() {
    const clients = (await this.getData('clients')) || {};
    return Object.values(clients);
  }

  // Subscribers
  async saveSubscriber(email) {
    const subscribers = (await this.getData('subscribers')) || {};
    const id = Date.now().toString();
    subscribers[id] = { email, id, createdAt: Date.now() };
    await this.setData('subscribers', null, subscribers);
    return subscribers[id];
  }

  async getSubscribers() {
    const subscribers = (await this.getData('subscribers')) || {};
    return Object.values(subscribers);
  }

  // Auth
  async saveAuth(authData) {
    return await this.setData('auth', 'credentials', authData);
  }

  async getAuth() {
    return await this.getData('auth', 'credentials');
  }

  // Export/Import complet
  async exportAllData() {
    const exportData = {
      version: this.version,
      timestamp: Date.now(),
      collections: {},
    };

    for (const [name] of Object.entries(this.collections)) {
      try {
        exportData.collections[name] = await this.getData(name);
      } catch (error) {
        console.warn(`UDM: Échec export ${name}:`, error);
      }
    }

    return exportData;
  }

  async importAllData(importData) {
    if (!importData.collections) {
      throw new Error("Format d'import invalide");
    }

    // Backup avant import
    const currentData = await this.exportAllData();
    this.setMetadata('import_backup', currentData);

    let importedCount = 0;

    for (const [name, data] of Object.entries(importData.collections)) {
      try {
        if (this.collections[name] && data) {
          await this.setData(name, null, data);
          importedCount++;
        }
      } catch (error) {
        console.error(`UDM: Échec import ${name}:`, error);
      }
    }

    console.log(`UDM: Import terminé - ${importedCount} collections importées`);
    return importedCount;
  }
}

// Instance singleton
const unifiedDataManager = new UnifiedDataManager();

export default unifiedDataManager;
