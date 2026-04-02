// Lazy Loading pour les composants Dashboard
import { lazy, Suspense } from 'react';

// Lazy loading des pages dashboard
const Dashboard = lazy(() => import('../dashboard/pages/Dashboard'));
const Analytics = lazy(() => import('../dashboard/pages/Analytics'));
const Projects = lazy(() => import('../dashboard/pages/Projects'));
const Clients = lazy(() => import('../dashboard/pages/Clients'));
const Messaging = lazy(() => import('../dashboard/pages/Messaging'));
const AdminProfile = lazy(() => import('../dashboard/pages/AdminProfile'));
const Subscribers = lazy(() => import('../dashboard/pages/Subscribers'));
const Login = lazy(() => import('../dashboard/pages/Login'));

// Composant de loading
const DashboardLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 font-medium">Chargement du dashboard...</p>
    </div>
  </div>
);

// Utilisation dans App.jsx :
/*
<Route path="/dashboard/*" element={
  <Suspense fallback={<DashboardLoader />}>
    <AdminLayout />
  </Suspense>
}>
  <Route index element={
    <Suspense fallback={<DashboardLoader />}>
      <Dashboard />
    </Suspense>
  } />
  <Route path="analytics" element={
    <Suspense fallback={<DashboardLoader />}>
      <Analytics />
    </Suspense>
  } />
  // ... autres routes
</Route>
*/

export {
  Dashboard,
  Analytics,
  Projects,
  Clients,
  Messaging,
  AdminProfile,
  Subscribers,
  Login,
  DashboardLoader,
};
