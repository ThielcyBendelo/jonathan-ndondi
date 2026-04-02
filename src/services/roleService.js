/**
 * 🔐 Service de gestion des rôles et permissions
 * Gère l'accès admin avec des niveaux de permission
 */

class RoleService {
  constructor() {
    this.currentUser = null;
    this.permissions = {
      admin: [
        'VIEW_DASHBOARD',
        'MANAGE_CLIENTS',
        'MANAGE_SUBSCRIBERS',
        'MANAGE_PAYMENTS',
        'MANAGE_INVOICES',
        'VIEW_ANALYTICS',
        'MANAGE_PROJECTS',
        'MANAGE_MESSAGES',
        'MANAGE_USERS',
        'SYSTEM_SETTINGS',
      ],
      moderator: [
        'VIEW_DASHBOARD',
        'MANAGE_CLIENTS',
        'MANAGE_SUBSCRIBERS',
        'VIEW_PAYMENTS',
        'VIEW_ANALYTICS',
        'MANAGE_MESSAGES',
      ],
      user: ['VIEW_PROFILE'],
    };
  }

  /**
   * Définir l'utilisateur courant
   */
  setCurrentUser(user) {
    this.currentUser = user;
    console.log('👤 User role set:', user?.role);
  }

  /**
   * Obtenir l'utilisateur courant
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Vérifier si l'utilisateur est admin
   */
  isAdmin() {
    return this.currentUser?.role === 'admin';
  }

  /**
   * Vérifier si l'utilisateur est modérateur
   */
  isModerator() {
    return ['admin', 'moderator'].includes(this.currentUser?.role);
  }

  /**
   * Vérifier si l'utilisateur a une permission
   */
  hasPermission(permissionName) {
    if (!this.currentUser) return false;

    const userPermissions = this.permissions[this.currentUser.role] || [];
    return userPermissions.includes(permissionName);
  }

  /**
   * Vérifier si l'utilisateur a TOUTES les permissions
   */
  hasAllPermissions(permissionNames) {
    return permissionNames.every((perm) => this.hasPermission(perm));
  }

  /**
   * Vérifier si l'utilisateur a AU MOINS UNE permission
   */
  hasAnyPermission(permissionNames) {
    return permissionNames.some((perm) => this.hasPermission(perm));
  }

  /**
   * Obtenir toutes les permissions de l'utilisateur
   */
  getUserPermissions() {
    if (!this.currentUser) return [];
    return this.permissions[this.currentUser.role] || [];
  }

  /**
   * Obtenir le niveau d'accès (pour logging)
   */
  getAccessLevel() {
    if (this.isAdmin()) return 'ADMIN';
    if (this.isModerator()) return 'MODERATOR';
    return 'USER';
  }

  /**
   * Logger un accès (pour audit)
   */
  logAccess(action, resource) {
    const timestamp = new Date().toISOString();
    const level = this.getAccessLevel();
    const user = this.currentUser?.email || 'unknown';

    console.log(`[AUDIT] ${timestamp} | ${level} | ${user} | ${action} | ${resource}`);

    // Optionnel: envoyer au serveur
    this.sendAuditLog({
      timestamp,
      level,
      user,
      action,
      resource,
    });
  }

  /**
   * Envoyer les logs d'audit au serveur
   */
  async sendAuditLog(log) {
    try {
      await fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      }).catch(() => {
        // Silencieusement échouer si l'endpoint n'existe pas
      });
    } catch (error) {
      console.warn('Audit log error:', error);
    }
  }

  /**
   * Nettoyer les données de rôle
   */
  clear() {
    this.currentUser = null;
  }
}

const roleService = new RoleService();

export default roleService;
