// 💾 Service de gestion centralisée des données
class DataManagementService {
  constructor() {
    this.version = '1.0.0';
    this.namespace = 'monsite_';
    this.compressionThreshold = 1024; // 1KB
    this.maxStorageSize = 4 * 1024 * 1024; // 4MB limit

    this.dataSchema = {
      version: '1.0.0',
      tables: {
        clients: {
          key: 'clients',
          fields: [
            'id',
            'name',
            'email',
            'phone',
            'company',
            'projectType',
            'budget',
            'message',
            'status',
            'createdAt',
          ],
          indexes: ['email', 'status', 'createdAt'],
        },
        subscribers: {
          key: 'subscribers',
          fields: ['id', 'email', 'subscribedAt', 'status'],
          indexes: ['email', 'status'],
        },
        transactions: {
          key: 'transactions',
          fields: [
            'id',
            'amount',
            'currency',
            'status',
            'paymentId',
            'clientId',
            'createdAt',
          ],
          indexes: ['status', 'clientId', 'createdAt'],
        },
        projects: {
          key: 'projects',
          fields: [
            'id',
            'title',
            'description',
            'status',
            'clientId',
            'priority',
            'createdAt',
          ],
          indexes: ['status', 'clientId', 'priority'],
        },
        messages: {
          key: 'messages',
          fields: [
            'id',
            'name',
            'email',
            'subject',
            'message',
            'status',
            'createdAt',
          ],
          indexes: ['status', 'email', 'createdAt'],
        },
        analytics: {
          key: 'analytics',
          fields: ['id', 'event', 'page', 'data', 'timestamp'],
          indexes: ['event', 'page', 'timestamp'],
        },
      },
    };

    this.init();
  }

  // Initialisation du service
  async init() {
    try {
      await this.checkStorageSpace();
      await this.migrateDataIfNeeded();
      await this.setupIndexes();
      this.setupAutoCleanup();
      console.log('DataManagement: Initialisé ✅');
    } catch (error) {
      console.error('DataManagement: Erreur initialisation:', error);
    }
  }

  // ===== GESTION DU STOCKAGE =====

  // Vérifier l'espace de stockage
  async checkStorageSpace() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || this.maxStorageSize;

      console.log(
        `Storage: ${this.formatBytes(used)} / ${this.formatBytes(
          quota
        )} (${Math.round((used / quota) * 100)}%)`
      );

      if (used > quota * 0.8) {
        console.warn(
          'DataManagement: Stockage bientôt plein, nettoyage requis'
        );
        await this.cleanupOldData();
      }

      return { used, quota, percentage: (used / quota) * 100 };
    }

    return this.estimateLocalStorageUsage();
  }

  // Estimer l'utilisation localStorage
  estimateLocalStorageUsage() {
    let totalSize = 0;
    const keys = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.namespace)) {
        const item = localStorage.getItem(key);
        totalSize += key.length + (item ? item.length : 0);
        keys.push(key);
      }
    }

    return {
      used: totalSize,
      quota: this.maxStorageSize,
      percentage: (totalSize / this.maxStorageSize) * 100,
      keys: keys.length,
    };
  }

  // ===== COMPRESSION =====

  // Compresser les données (algorithme LZ simple)
  compress(data) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }

    if (data.length < this.compressionThreshold) {
      return { compressed: false, data };
    }

    try {
      // Compression LZ77 simplifiée
      const compressed = this.lzCompress(data);
      return {
        compressed: true,
        data: compressed,
        originalSize: data.length,
        compressedSize: compressed.length,
        ratio: Math.round((1 - compressed.length / data.length) * 100),
      };
    } catch (error) {
      console.warn('Compression échouée:', error);
      return { compressed: false, data };
    }
  }

  // Décompresser les données
  decompress(compressedData) {
    if (!compressedData.compressed) {
      return compressedData.data;
    }

    try {
      return this.lzDecompress(compressedData.data);
    } catch (error) {
      console.error('Décompression échouée:', error);
      return null;
    }
  }

  // Compression LZ77 simplifiée
  lzCompress(data) {
    const dict = {};
    let result = '';
    let phrase = '';

    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      const newPhrase = phrase + char;

      if (dict[newPhrase]) {
        phrase = newPhrase;
      } else {
        if (phrase) {
          result += String.fromCharCode(dict[phrase]);
        } else {
          result += char;
        }
        dict[newPhrase] = Object.keys(dict).length + 256;
        phrase = char;
      }
    }

    if (phrase) {
      result += String.fromCharCode(dict[phrase] || phrase.charCodeAt(0));
    }

    return btoa(result);
  }

  // Décompression LZ77
  lzDecompress(compressed) {
    try {
      const data = atob(compressed);
      const dict = {};
      let result = '';

      // Reconstruire le dictionnaire et les données
      for (let i = 0; i < data.length; i++) {
        const code = data.charCodeAt(i);
        if (code >= 256) {
          result += dict[code] || '';
        } else {
          result += String.fromCharCode(code);
        }
      }

      return result;
    } catch {
      throw new Error('Décompression invalide');
    }
  }

  // ===== CRUD OPERATIONS =====

  // Sauvegarder des données avec métadonnées
  async setData(table, id, data) {
    if (!this.dataSchema.tables[table]) {
      throw new Error(`Table inconnue: ${table}`);
    }

    const key = this.getStorageKey(table, id);
    const metadata = {
      table,
      id,
      version: this.version,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      checksum: this.generateChecksum(data),
    };

    const payload = { metadata, data };
    const compressed = this.compress(payload);

    try {
      localStorage.setItem(key, JSON.stringify(compressed));
      await this.updateIndex(table, id, data);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        await this.cleanupOldData();
        // Retry once
        try {
          localStorage.setItem(key, JSON.stringify(compressed));
          return true;
        } catch {
          throw new Error('Stockage plein, impossible de sauvegarder');
        }
      }
      throw error;
    }
  }

  // Récupérer des données
  async getData(table, id) {
    const key = this.getStorageKey(table, id);

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const compressed = JSON.parse(stored);
      const payload = JSON.parse(this.decompress(compressed));

      // Vérifier l'intégrité
      if (!this.verifyChecksum(payload.data, payload.metadata.checksum)) {
        console.warn(
          `DataManagement: Intégrité compromise pour ${table}:${id}`
        );
        return null;
      }

      return payload.data;
    } catch (error) {
      console.error(`DataManagement: Erreur lecture ${table}:${id}:`, error);
      return null;
    }
  }

  // Liste des données d'une table
  async listData(table, filters = {}) {
    const results = [];
    const prefix = this.getTablePrefix(table);

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const id = key.replace(prefix, '');
        const data = await this.getData(table, id);

        if (data && this.matchesFilters(data, filters)) {
          results.push({ id, ...data });
        }
      }
    }

    return results.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // Supprimer des données
  async deleteData(table, id) {
    const key = this.getStorageKey(table, id);
    localStorage.removeItem(key);
    await this.removeFromIndex(table, id);
    return true;
  }

  // ===== INDEX MANAGEMENT =====

  // Configurer les index
  async setupIndexes() {
    for (const [tableName, tableSchema] of Object.entries(
      this.dataSchema.tables
    )) {
      for (const indexField of tableSchema.indexes) {
        await this.rebuildIndex(tableName, indexField);
      }
    }
  }

  // Reconstruire un index
  async rebuildIndex(table, field) {
    const indexKey = this.getIndexKey(table, field);
    const index = {};

    const data = await this.listData(table);

    data.forEach((item) => {
      const value = item[field];
      if (value !== undefined) {
        if (!index[value]) index[value] = [];
        index[value].push(item.id);
      }
    });

    localStorage.setItem(indexKey, JSON.stringify(index));
  }

  // Recherche par index
  async findByIndex(table, field, value) {
    const indexKey = this.getIndexKey(table, field);
    const indexData = localStorage.getItem(indexKey);

    if (!indexData) return [];

    const index = JSON.parse(indexData);
    const ids = index[value] || [];

    const results = [];
    for (const id of ids) {
      const data = await this.getData(table, id);
      if (data) results.push({ id, ...data });
    }

    return results;
  }

  // ===== MIGRATION =====

  // Migrer les données si nécessaire
  async migrateDataIfNeeded() {
    const currentVersion = localStorage.getItem(this.namespace + 'version');

    if (!currentVersion) {
      console.log(
        'DataManagement: Première installation, migration données existantes...'
      );
      await this.migrateExistingData();
      localStorage.setItem(this.namespace + 'version', this.version);
    } else if (currentVersion !== this.version) {
      console.log(
        `DataManagement: Migration ${currentVersion} → ${this.version}`
      );
      await this.performMigration(currentVersion, this.version);
      localStorage.setItem(this.namespace + 'version', this.version);
    }
  }

  // Migrer les données existantes
  async migrateExistingData() {
    const migrations = [
      { from: 'monsite_clients', to: 'clients' },
      { from: 'monsite_subscribers', to: 'subscribers' },
      { from: 'payment_transactions', to: 'transactions' },
    ];

    for (const migration of migrations) {
      const oldData = localStorage.getItem(migration.from);
      if (oldData) {
        try {
          const parsedData = JSON.parse(oldData);
          if (Array.isArray(parsedData)) {
            for (const item of parsedData) {
              await this.setData(migration.to, item.id, item);
            }
            console.log(
              `DataManagement: Migré ${parsedData.length} éléments de ${migration.from}`
            );
            localStorage.removeItem(migration.from);
          }
        } catch (error) {
          console.error(
            `DataManagement: Erreur migration ${migration.from}:`,
            error
          );
        }
      }
    }
  }

  // ===== BACKUP & RESTORE =====

  // Créer une sauvegarde complète
  async createBackup() {
    const backup = {
      version: this.version,
      timestamp: new Date().toISOString(),
      data: {},
    };

    for (const tableName of Object.keys(this.dataSchema.tables)) {
      backup.data[tableName] = await this.listData(tableName);
    }

    const compressed = this.compress(backup);
    return {
      backup: compressed.data,
      stats: {
        tables: Object.keys(backup.data).length,
        totalRecords: Object.values(backup.data).reduce(
          (sum, table) => sum + table.length,
          0
        ),
        originalSize: this.formatBytes(JSON.stringify(backup).length),
        compressedSize: compressed.compressed
          ? this.formatBytes(compressed.data.length)
          : 'Non compressé',
        compressionRatio: compressed.ratio || 0,
      },
    };
  }

  // Restaurer une sauvegarde
  async restoreBackup(backupData) {
    try {
      const backup = JSON.parse(
        this.decompress({ compressed: true, data: backupData })
      );

      // Vider les données existantes
      await this.clearAllData();

      // Restaurer chaque table
      for (const [tableName, records] of Object.entries(backup.data)) {
        for (const record of records) {
          const { id, ...data } = record;
          await this.setData(tableName, id, data);
        }
      }

      console.log('DataManagement: Sauvegarde restaurée ✅');
      return true;
    } catch (error) {
      console.error('DataManagement: Erreur restauration:', error);
      throw new Error('Sauvegarde corrompue ou incompatible');
    }
  }

  // ===== UTILITAIRES =====

  // Clés de stockage
  getStorageKey(table, id) {
    return `${this.namespace}${table}_${id}`;
  }

  getTablePrefix(table) {
    return `${this.namespace}${table}_`;
  }

  getIndexKey(table, field) {
    return `${this.namespace}idx_${table}_${field}`;
  }

  // Générer checksum
  generateChecksum(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  // Vérifier checksum
  verifyChecksum(data, expectedChecksum) {
    return this.generateChecksum(data) === expectedChecksum;
  }

  // Filtres
  matchesFilters(data, filters) {
    return Object.entries(filters).every(([key, value]) => {
      if (Array.isArray(value)) {
        return value.includes(data[key]);
      }
      return data[key] === value;
    });
  }

  // Nettoyage automatique
  setupAutoCleanup() {
    // Nettoyer les données expirées toutes les heures
    setInterval(() => {
      this.cleanupOldData().catch(console.error);
    }, 60 * 60 * 1000);
  }

  // Nettoyer les anciennes données
  async cleanupOldData() {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - 6); // 6 mois

    let cleaned = 0;

    for (const tableName of Object.keys(this.dataSchema.tables)) {
      const data = await this.listData(tableName);

      for (const item of data) {
        const itemDate = new Date(item.createdAt);
        if (itemDate < cutoffDate && item.status !== 'actif') {
          await this.deleteData(tableName, item.id);
          cleaned++;
        }
      }
    }

    console.log(`DataManagement: ${cleaned} anciens éléments nettoyés`);
    return cleaned;
  }

  // Vider toutes les données
  async clearAllData() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.namespace)) {
        keys.push(key);
      }
    }

    keys.forEach((key) => localStorage.removeItem(key));
    console.log(`DataManagement: ${keys.length} clés supprimées`);
  }

  // Formater bytes
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Statistiques globales
  async getStats() {
    const stats = {
      version: this.version,
      storage: await this.checkStorageSpace(),
      tables: {},
    };

    for (const tableName of Object.keys(this.dataSchema.tables)) {
      const data = await this.listData(tableName);
      stats.tables[tableName] = {
        count: data.length,
        size: this.formatBytes(JSON.stringify(data).length),
      };
    }

    return stats;
  }
}

// Instance singleton
const dataManagementService = new DataManagementService();

export default dataManagementService;
