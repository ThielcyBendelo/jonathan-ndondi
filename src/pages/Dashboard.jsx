import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import ClientsManager from '../components/dashboard/ClientsManager';
import SubscribersManager from '../components/dashboard/SubscribersManager';
import BlogStats from '../blog/BlogStats';
import Settings from '../components/dashboard/Settings';
import AdminProfile from '../dashboard/pages/AdminProfile';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('dashboardToken');
    if (!token) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <DashboardStats />;
      case 'clients':
        return <ClientsManager />;
      case 'subscribers':
        return <SubscribersManager />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <AdminProfile />;
      default:
        return <DashboardStats />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Bouton retour site principal */}
      <div className="mb-6 flex justify-start">
        <button
          type="button"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={() => navigate('/')}
        >
          ← Retour au site principal
        </button>
      </div>
      {/* Navbar */}
      <DashboardNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex">
        {/* Sidebar */}
        <DashboardSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 ml-0 lg:ml-64 transition-all duration-300">
          {/* Statistiques Blog retirées */}
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
