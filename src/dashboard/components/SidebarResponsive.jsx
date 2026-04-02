import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import NotificationBell from './NotificationBell';
import MessageNotificationBell from './MessageNotificationBell';

export default function Sidebar({ isMobile = false, onClose = () => {} }) {
  const navigate = useNavigate();

  const logout = () => {
    authService.logout();
    navigate('/login');
    if (isMobile) onClose();
  };

  const handleNavClick = () => {
    if (isMobile) onClose();
  };

  const navLinkClass = ({ isActive }) => `
    px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
      isMobile ? 'mb-1' : ''
    } ${
    isActive
      ? 'text-indigo-600 font-semibold bg-indigo-50'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
  }
  `;

  return (
    <aside
      className={`
      ${isMobile ? 'w-full h-full p-4' : 'w-64 min-h-screen p-4'} 
      bg-gray-50 border-r border-gray-200
    `}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm lg:text-base">
                A
              </span>
            </div>
            <div className="text-gray-900 font-bold text-sm lg:text-base">
              Admin Dashboard
            </div>
          </div>
          {!isMobile && <NotificationBell />}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {/* Retour site principal */}
        <a
          href="/"
          onClick={handleNavClick}
          className="mb-4 px-3 py-2 bg-indigo-600 text-white text-center text-sm lg:text-base rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          title="Retour au site principal"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Site Principal
        </a>

        {/* Menu items */}
        <NavLink
          to="/dashboard"
          end
          className={navLinkClass}
          onClick={handleNavClick}
        >
          <span className="text-lg">📊</span>
          <span className="text-sm lg:text-base">Dashboard</span>
        </NavLink>

        <NavLink
          to="/dashboard/clients"
          className={navLinkClass}
          onClick={handleNavClick}
        >
          <span className="text-lg">👥</span>
          <span className="text-sm lg:text-base">Clients</span>
        </NavLink>

        <NavLink
          to="/dashboard/subscribers"
          className={navLinkClass}
          onClick={handleNavClick}
        >
          <span className="text-lg">📧</span>
          <span className="text-sm lg:text-base">Abonnés</span>
        </NavLink>

        <NavLink
          to="/dashboard/projects"
          className={navLinkClass}
          onClick={handleNavClick}
        >
          <span className="text-lg">📋</span>
          <span className="text-sm lg:text-base">Projets</span>
        </NavLink>

        <NavLink
          to="/dashboard/analytics"
          className={navLinkClass}
          onClick={handleNavClick}
        >
          <span className="text-lg">📈</span>
          <span className="text-sm lg:text-base">Analytics</span>
        </NavLink>

        <NavLink
          to="/dashboard/payments"
          className={navLinkClass}
          onClick={handleNavClick}
        >
          <span className="text-lg">💳</span>
          <span className="text-sm lg:text-base">Paiements</span>
        </NavLink>

        <NavLink
          to="/dashboard/messaging"
          className={navLinkClass}
          onClick={handleNavClick}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💬</span>
            <span className="text-sm lg:text-base">Messages</span>
            {!isMobile && <MessageNotificationBell />}
          </div>
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className={navLinkClass}
          onClick={handleNavClick}
        >
          <span className="text-lg">👤</span>
          <span className="text-sm lg:text-base">Mon Profil</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-6 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm lg:text-base"
        >
          <span className="text-lg">🚪</span>
          Se déconnecter
        </button>
      </nav>

      {/* Mobile notifications */}
      {isMobile && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Notifications</span>
            <div className="flex gap-2">
              <NotificationBell />
              <MessageNotificationBell />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
