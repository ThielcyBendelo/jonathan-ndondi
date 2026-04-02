import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Blog from './pages/Blog.jsx';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ExperiencePage from './pages/ExperiencePage';
import ProjectsPage from './pages/ProjectsPage';
import SkillsPage from './pages/SkillsPage';
import TestimonialsPage from './pages/TestimonialsPage';
import DashboardPage from './pages/DashboardPage';
import PaymentPage from './pages/PaymentPage';
import WorkPage from './pages/WorkPage';
import PrivateRoute from './components/PrivateRoute';
import ClientRegistrationPage from './pages/ClientRegistrationPage';
import ProfessionalSplashScreen from './components/ProfessionalSplashScreen';
import SecureLogin from './components/SecureLogin';
import SecureRegister from './components/SecureRegister';
// Dashboard imports
import {
  Login,
  AdminHome,
  Clients,
  Subscribers,
  PaymentManagement,
  InvoiceManagement,
  Analytics,
  Projects,
  Messaging,
  Profile,
  ProtectedRoute,
} from './dashboard';
import FinanceDashboard from './dashboard/FinanceDashboard';
import AdminLayout from './dashboard/components/AdminLayout';

const App = () => {
  const [splashDone, setSplashDone] = React.useState(false);
  return (
    <ThemeProvider>
      {!splashDone && (
        <ProfessionalSplashScreen onComplete={() => setSplashDone(true)} />
      )}
      {splashDone && (
        <div>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
          <Suspense fallback={<div>Chargement...</div>}>
            <Routes>
              {/* Route principale du site */}
              <Route path="/" element={<Home />} />
              {/* Route Services */}
              <Route path="/services" element={<ServicesPage />} />
              {/* Route Contact */}
              <Route path="/contact" element={<ContactPage />} />
              {/* Route About */}
              <Route path="/about" element={<AboutPage />} />
              {/* Route Experience */}
              <Route path="/experience" element={<ExperiencePage />} />
              {/* Route Projects */}
              <Route path="/projects" element={<ProjectsPage />} />
              {/* Route Skills */}
              <Route path="/skills" element={<SkillsPage />} />
              {/* Route Work */}
              <Route path="/work" element={<WorkPage />} />
              {/* Route Testimonials */}
              <Route path="/testimonials" element={<TestimonialsPage />} />
              {/* Route Payment */}
              <Route path="/paiement" element={<PaymentPage />} />
              {/* Route d'enregistrement des clients */}
              <Route path="/clients" element={<ClientRegistrationPage />} />
              {/* Route de connexion utilisateur (formulaire sécurisé) */}
              <Route path="/login" element={<SecureLogin />} />
              {/* Route d'inscription utilisateur */}
              <Route path="/register" element={<SecureRegister />} />
              {/* Blog route */}
              <Route path="/blog" element={<Blog />} />
              {/* Routes du dashboard avec layout admin */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<AdminHome />} />
                <Route path="clients" element={<Clients />} />
                <Route path="subscribers" element={<Subscribers />} />
                <Route path="payments" element={<PaymentManagement />} />
                <Route path="invoices" element={<InvoiceManagement />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="projects" element={<Projects />} />
                <Route path="messages" element={<Messaging />} />
                <Route path="profile" element={<Profile />} />
                <Route path="finance" element={<FinanceDashboard />} />
              </Route>
              {/* Route catch-all pour les chemins inconnus */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
