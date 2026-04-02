import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * Composant de protection des routes privées
 * Redirige vers login si non authentifié
 */
const PrivateRoute = ({ children }) => {
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
