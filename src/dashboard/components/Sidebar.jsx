import { NavLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import NotificationBell from './NotificationBell';
import MessageNotificationBell from './MessageNotificationBell';

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <aside
      className="w-64 p-4 min-h-screen"
      style={{ backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0' }}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-12 rounded-full"
              style={{ backgroundColor: '#6366f1' }}
            />
            <div style={{ color: '#1e293b', fontWeight: 'bold' }}>Admin</div>
          </div>
          <NotificationBell />
        </div>
      </div>
      <nav className="flex flex-col gap-2" style={{ color: '#64748b' }}>
        <button
          type="button"
          className="mb-3 px-3 py-2 text-white text-center rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
          style={{ backgroundColor: '#6366f1' }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#4f46e5')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#6366f1')}
          title="Retour au site principal"
          onClick={() => navigate('/')}
        >
          ← Site Principal
        </button>
        <NavLink
          to="/dashboard"
          end
          className="px-3 py-2 rounded-lg transition-colors"
          style={({ isActive }) => ({
            color: isActive ? '#6366f1' : '#64748b',
            fontWeight: isActive ? '600' : 'normal',
            backgroundColor: isActive ? '#f1f5f9' : 'transparent',
          })}
        >
          📊 Dashboard
        </NavLink>
        <NavLink
          to="/dashboard/clients"
          className="px-3 py-2 rounded-lg transition-colors"
          style={({ isActive }) => ({
            color: isActive ? '#6366f1' : '#64748b',
            fontWeight: isActive ? '600' : 'normal',
            backgroundColor: isActive ? '#f1f5f9' : 'transparent',
          })}
        >
          👥 Clients
        </NavLink>
        <NavLink
          to="/dashboard/subscribers"
          className="px-3 py-2 rounded-lg transition-colors"
          style={({ isActive }) => ({
            color: isActive ? '#6366f1' : '#64748b',
            fontWeight: isActive ? '600' : 'normal',
            backgroundColor: isActive ? '#f1f5f9' : 'transparent',
          })}
        >
          📧 Abonnés
        </NavLink>
        <NavLink
          to="/dashboard/projects"
          className="px-3 py-2 rounded-lg transition-colors"
          style={({ isActive }) => ({
            color: isActive ? '#6366f1' : '#64748b',
            fontWeight: isActive ? '600' : 'normal',
            backgroundColor: isActive ? '#f1f5f9' : 'transparent',
          })}
        >
          📋 Projets
        </NavLink>
        <NavLink
          to="/dashboard/analytics"
          className="px-3 py-2 rounded-lg transition-colors"
          style={({ isActive }) => ({
            color: isActive ? '#6366f1' : '#64748b',
            fontWeight: isActive ? '600' : 'normal',
            backgroundColor: isActive ? '#f1f5f9' : 'transparent',
          })}
        >
          📊 Analytics
        </NavLink>
        <NavLink
          to="/dashboard/payments"
          className="px-3 py-2 rounded-lg transition-colors"
          style={({ isActive }) => ({
            color: isActive ? '#6366f1' : '#64748b',
            fontWeight: isActive ? '600' : 'normal',
            backgroundColor: isActive ? '#f1f5f9' : 'transparent',
          })}
        >
          💰 Paiements
        </NavLink>
        <NavLink
          to="/dashboard/invoices"
          className="px-3 py-2 rounded-lg transition-colors"
          style={({ isActive }) => ({
            color: isActive ? '#6366f1' : '#64748b',
            fontWeight: isActive ? '600' : 'normal',
            backgroundColor: isActive ? '#f1f5f9' : 'transparent',
          })}
        >
          📄 Factures
        </NavLink>
        <div className="relative">
          <NavLink
            to="/dashboard/messages"
            className="px-3 py-2 rounded-lg transition-colors"
            style={({ isActive }) => ({
              color: isActive ? '#6366f1' : '#64748b',
              fontWeight: isActive ? '600' : 'normal',
              backgroundColor: isActive ? '#f1f5f9' : 'transparent',
            })}
          >
            💬 Messages
          </NavLink>
          <MessageNotificationBell />
        </div>
        <NavLink
          to="/dashboard/profile"
          className="px-3 py-2 rounded-lg transition-colors"
          style={({ isActive }) => ({
            color: isActive ? '#6366f1' : '#64748b',
            fontWeight: isActive ? '600' : 'normal',
            backgroundColor: isActive ? '#f1f5f9' : 'transparent',
          })}
        >
          👤 Mon Profil
        </NavLink>
        <button
          onClick={logout}
          className="mt-4 text-sm px-3 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#1e293b',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#f1f5f9')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#ffffff')}
        >
          Se déconnecter
        </button>
      </nav>
    </aside>
  );
}
