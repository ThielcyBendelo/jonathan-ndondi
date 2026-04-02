/**
 * 🛡️ Content Security Policy (CSP) Configuration
 * 
 * Cette configuration protège votre application React contre:
 * - XSS (Cross-Site Scripting) attacks
 * - Clickjacking attacks
 * - Malicious script injection
 * - Unauthorized iframe embedding
 */

export const CSPConfig = {
  // Pour développement - headers relaxés
  development: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'], // unsafe-inline pour HMR Vite
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:'],
    'connect-src': ["'self'", 'http://localhost:*', 'https://api.github.com'],
    'frame-ancestors': ["'self'"],
  },

  // Pour production - headers stricts
  production: {
    'default-src': ["'self'"],
    'script-src': ["'self'", 'https://cdn.jsdelivr.net'],
    'style-src': ["'self'", 'https://fonts.googleapis.com'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'https:'],
    'connect-src': ["'self'", 'https://api.yourdomain.com', 'https://api.emailjs.com'],
    'frame-ancestors': ["'none'"], // Interdire l'embedding dans les frames
    'form-action': ["'self'"], // Soumettre les formulaires uniquement vers le même domaine
    'base-uri': ["'self'"],
    'upgrade-insecure-requests': [],
  },
};

/**
 * Génère la chaîne CSP complète
 * @param {Object} config - Configuration CSP
 * @returns {string} - Chaîne CSP formattée
 */
export const generateCSPHeader = (config) => {
  return Object.entries(config)
    .filter(([, values]) => values.length > 0)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
};

/**
 * Applique une meta CSP au document
 * Utile pour les applications React qui ne contrôlent pas les headers serveur
 */
export const applyCSPMeta = () => {
  const isDevelopment = import.meta.env.DEV;
  const config = isDevelopment ? CSPConfig.development : CSPConfig.production;
  const cspContent = generateCSPHeader(config);

  // Créer la meta tag
  const metaTag = document.createElement('meta');
  metaTag.httpEquiv = 'Content-Security-Policy';
  metaTag.content = cspContent;
  document.head.appendChild(metaTag);

};

/**
 * Logger les violations de CSP
 * Utile pour le débogage
 */
export const setupCSPViolationReporting = () => {
  document.addEventListener('securitypolicyviolation', (event) => {
    console.warn('🚨 CSP Violation Detected:', {
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber,
      originalPolicy: event.originalPolicy,
    });

    // Optionnel: Envoyer au serveur pour monitoring
    // fetch('/api/csp-violations', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     blockedURI: event.blockedURI,
    //     violatedDirective: event.violatedDirective,
    //     timestamp: new Date().toISOString(),
    //   }),
    // });
  });
};

/**
 * Exemple de headers CSP à configurer sur le serveur
 * Ajouter ces headers dans votre serveur web (Nginx, Apache, Express, etc.)
 */
export const serverHeadersExample = `
// Pour Express.js:
app.use((req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  const cspConfig = isDev ? CSPConfig.development : CSPConfig.production;
  const cspHeader = generateCSPHeader(cspConfig);
  
  res.setHeader('Content-Security-Policy', cspHeader);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
});

// Pour Nginx:
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; ...";
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header X-XSS-Protection "1; mode=block";
`;

export default {
  CSPConfig,
  generateCSPHeader,
  applyCSPMeta,
  setupCSPViolationReporting,
  serverHeadersExample,
};
