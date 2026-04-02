import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AdminLayout from '../components/AdminLayout';
import AnimatedStatsCard from '../components/AnimatedStatsCard';
import ClientsChart from '../components/ClientsChart';
import RecentActivity from '../components/RecentActivity';
import AdvancedDashboardOverview from '../components/AdvancedDashboardOverview';
import NotificationToast from '../components/NotificationToast';
import PaymentNotificationWidget from '../components/PaymentNotificationWidget';
import PayPalStatusTracker from '../components/PayPalStatusTracker';
import dataService from '../../services/dataService';
import notificationService from '../services/notificationService';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const updateStats = () => setStats(dataService.getStats());
    updateStats();

    // Initialiser le service de notifications
    notificationService.init();

    // Exposer dataService globalement pour les notifications
    window.dataService = dataService;

    // Actualiser les stats toutes les 30 secondes
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        color: '#1f2937',
      }}
    >
      <div
        className="min-h-screen flex"
        style={{
          backgroundColor: '#ffffff',
          color: '#1f2937',
          minHeight: '100vh',
        }}
      >
        <Sidebar />
        <main
          className="flex-1 p-8"
          style={{ backgroundColor: '#ffffff', color: '#1f2937' }}
        >
          <header className="mb-6 pt-16">
            <h1 className="text-3xl font-bold" style={{ color: '#1f2937' }}>
              Tableau de bord
            </h1>
            <p style={{ color: '#6b7280' }}>
              Vue d'ensemble et statistiques en temps réel
            </p>
          </header>

          {/* Dashboard avancé avec toutes les nouvelles fonctionnalités */}
          <AdvancedDashboardOverview />

          {/* Section des statistiques détaillées héritées */}
          <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnimatedStatsCard
              title="Total Clients"
              value={stats?.totalClients || 0}
              change={15}
              changeType="positive"
              color="purple"
              icon={
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
            />
            <AnimatedStatsCard
              title="Abonnés Newsletter"
              value={stats?.totalSubscribers || 0}
              change={8}
              changeType="positive"
              color="blue"
              icon={
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />
            <AnimatedStatsCard
              title="Nouveaux ce mois"
              value={stats?.newClientsThisMonth || 0}
              change={25}
              changeType="positive"
              color="green"
              icon={
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              }
            />
            <AnimatedStatsCard
              title="Projets en cours"
              value={stats?.clientsByStatus?.enCours || 0}
              change={-2}
              changeType="negative"
              color="orange"
              icon={
                <svg
                  className="w-6 h-6 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <ClientsChart />
            </div>
            <div>
              <RecentActivity />
            </div>
          </section>

          {/* Section Export rapide */}
          <section className="mb-8">
            <div
              className="rounded-2xl p-6 border shadow-sm"
              style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: '#1f2937' }}
                  >
                    Export rapide
                  </h3>
                  <p style={{ color: '#6b7280' }}>
                    Exportez vos données clients et abonnés
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    to="/admin/clients"
                    className="px-4 py-2 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                    style={{ backgroundColor: '#6366f1' }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = '#4f46e5')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = '#6366f1')
                    }
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Clients ({stats?.totalClients || 0})
                  </Link>
                  <Link
                    to="/admin/subscribers"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                             hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Abonnés ({stats?.totalSubscribers || 0})
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <Outlet />
          </section>
        </main>

        {/* Composant de notifications toast */}
        <NotificationToast />

        {/* Widget de notifications de paiement */}
        <PaymentNotificationWidget />

        {/* Tracker de statut PayPal */}
        <PayPalStatusTracker />
      </div>
    </div>
  );
}
