import { Navigate } from 'react-router-dom';
// Use the main application auth/role services (not the dashboard-local mocks)
import authService from '../../services/authService';
import roleService from '../../services/roleService';

export default function ProtectedRoute({ children }) {
  // 1. Vérifier que l'utilisateur est connecté
  if (!authService.isLoggedIn()) {
    console.warn('❌ ProtectedRoute: user not logged in');
    return <Navigate to="/login" replace />;
  }

  // 2. Vérifier que l'utilisateur est admin
  if (!roleService.isAdmin()) {
    console.warn('❌ ProtectedRoute: user is not admin');
    roleService.logAccess('DENIED_ACCESS', 'ADMIN_DASHBOARD');
    return <Navigate to="/" replace />;
  }

  // Autorisé
  roleService.logAccess('ACCESSED', 'ADMIN_DASHBOARD');
  return children;
}
