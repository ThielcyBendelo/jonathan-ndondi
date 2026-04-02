import { Navigate } from 'react-router-dom';
import authService from '../services/authService';
import roleService from '../services/roleService';

/**
 * 🔐 Composant de protection pour routes ADMIN SEULEMENT
 * Vérifie:
 * 1. L'utilisateur est authentifié
 * 2. L'utilisateur a le rôle 'admin'
 * 3. Log l'accès pour audit
 */
const AdminRoute = ({ children }) => {
  // 1. Vérifier l'authentification
  if (!authService.isLoggedIn()) {
    console.warn('❌ Access denied: Not authenticated');
    return <Navigate to="/login" replace />;
  }

  // 2. Vérifier le rôle admin
  if (!roleService.isAdmin()) {
    console.warn('❌ Access denied: Not admin');
    roleService.logAccess('DENIED_ACCESS', 'ADMIN_DASHBOARD');
    return <Navigate to="/" replace />;
  }

  // 3. Log l'accès réussi
  roleService.logAccess('ACCESSED', 'ADMIN_DASHBOARD');

  return children;
};

export default AdminRoute;
