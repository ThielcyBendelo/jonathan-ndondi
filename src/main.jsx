import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// ===== 🛡️ SÉCURITÉ =====
// Initialiser la sécurité CSP et les validations
import { applyCSPMeta, setupCSPViolationReporting } from './utils/cspConfig';
import secureAPIClient from './utils/secureAPIClient';

// Appliquer Content Security Policy
applyCSPMeta();

// Logger les violations de sécurité
setupCSPViolationReporting();

// Initialiser le client API sécurisé
secureAPIClient.initialize();

console.log('🛡️ Frontend Security initialized');

// ===== SERVICES =====
// Initialiser le service de webhook PayPal
import paypalWebhookService from './dashboard/services/paypalWebhookService.js';

// Initialiser le service au démarrage de l'application
console.log('🚀 Service PayPal Webhook initialisé:', paypalWebhookService);

// Using createRoot method
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// ===== SERVICE WORKER =====
// Désactiver le service worker en développement
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
