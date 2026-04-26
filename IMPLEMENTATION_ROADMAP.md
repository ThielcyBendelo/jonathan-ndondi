# 📋 Plan d'Action - Intégration Sécurité Complète

## 🎯 Objectif

Transformer votre application React en application **hautement sécurisée** et **prête pour la production**

---

## ✅ ÉTAPE 1: Intégrer la sécurité dans les formulaires existants

### 1.1 Formulaire Contact (Contact.jsx)

**Fichier:** `src/components/Contact.jsx`

**Modifications à apporter:**

#### Option A: Intégration complète avec `useFormSecurity` (RECOMMANDÉE)

```jsx
import useFormSecurity from '../hooks/useFormSecurity';
import securityService from '../services/securityService';

export default function Contact() {
  const formSchema = {
    name: { type: 'text', minLength: 2, maxLength: 50, required: true },
    email: { type: 'email', required: true },
    message: { type: 'text', minLength: 10, maxLength: 1000, required: true },
  };

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isLoading,
  } = useFormSecurity(formSchema, async (data) => {
    // Données déjà validées et sanitisées
    await send(SERVICE_ID, TEMPLATE_ID, {
      from_name: data.name,
      from_email: data.email,
      message: data.message,
      to_email: 'bendelothielcy@gmail.com',
    });
  });

  return <form onSubmit={handleSubmit}>{/* Champs avec validation */}</form>;
}
```

#### Option B: Validation minimale (Gardez votre code actuel)

```jsx
const handleChange = (e) => {
  const { name, value } = e.target;
  // Sanitiser l'input
  const sanitized = securityService.sanitizeInput(value, name);
  setFormData((prev) => ({
    ...prev,
    [name]: sanitized,
  }));
};
```

### 1.2 Formulaire Newsletter (NewsletterSubscription.jsx)

```jsx
import securityService from '../services/securityService';

const handleSubmit = async (e) => {
  e.preventDefault();

  // Valider et sanitiser
  const emailResult = securityService.validateEmail(email);
  if (!emailResult.isValid) {
    setError(emailResult.error);
    return;
  }

  // Rate limiting
  const rateLimit = securityService.checkRateLimit('newsletter-sub');
  if (!rateLimit.allowed) {
    setError(`Trop de soumissions. Réessayez dans ${rateLimit.retryAfter}s`);
    return;
  }

  // Envoyer email sanitisé
  await sendNewsletterEmail(emailResult.sanitized);
};
```

### 1.3 Formulaire PaymentModal (PaymentModal.jsx)

```jsx
import useFormSecurity from '../hooks/useFormSecurity';

const formSchema = {
  fullName: { type: 'text', minLength: 3, maxLength: 50, required: true },
  email: { type: 'email', required: true },
  amount: { type: 'text', required: true },
};

const { formData, errors, handleSubmit } = useFormSecurity(
  formSchema,
  async (data) => {
    // Traiter le paiement avec données sécurisées
  }
);
```

---

## 📡 ÉTAPE 2: Configurer les headers serveur

### 2.1 Pour Express.js

**Créer le fichier:** `server.js` (ou ajouter à votre backend)

```javascript
import express from 'express';
import { generateCSPHeader } from './src/utils/cspConfig.js';

const app = express();
const isDev = process.env.NODE_ENV === 'development';

// ✅ Headers de sécurité
app.use((req, res, next) => {
  // Content Security Policy
  const cspConfig = isDev ? CSPConfig.development : CSPConfig.production;
  res.setHeader('Content-Security-Policy', generateCSPHeader(cspConfig));

  // Autres headers essentiels
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );

  // HSTS (HTTPS uniquement)
  if (!isDev) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }

  next();
});

// CORS sécurisé
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  })
);
```

### 2.2 Pour Nginx

**Ajouter à votre configuration Nginx:**

```nginx
# /etc/nginx/sites-available/monsite

server {
  listen 443 ssl http2;
  server_name monsite.com;

  # Headers de sécurité
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.monsite.com;" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

  # Rate limiting
  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;
  limit_req_zone $binary_remote_addr zone=contact:10m rate=5r/h;

  location /api/ {
    limit_req zone=api burst=20 nodelay;
    proxy_pass http://backend:3000;
  }

  location /api/contact {
    limit_req zone=contact burst=10 nodelay;
    proxy_pass http://backend:3000;
  }

  # Servir React app
  location / {
    root /var/www/monsite/dist;
    try_files $uri $uri/ /index.html;
  }

  # Cache statique
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

### 2.3 Pour Vercel/Netlify

**Créer `vercel.json`:**

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.yourdomain.com;"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

---

## 🔐 ÉTAPE 3: Implémenter l'authentification

### 3.1 Créer un service d'authentification sécurisé

**Fichier:** `src/services/authService.js`

```javascript
import secureAPIClient from '../utils/secureAPIClient';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authToken = null;
  }

  // Login sécurisé
  async login(email, password) {
    // Valider les entrées
    const emailResult = securityService.validateEmail(email);
    if (!emailResult.isValid) {
      throw new Error('Email invalide');
    }

    // Rate limiting login
    const rateLimit = securityService.checkLoginAttempts(email);
    if (!rateLimit.allowed) {
      throw new Error(
        `Compte verrouillé. Réessayez dans ${rateLimit.remainingTime}s`
      );
    }

    // Valider force du mot de passe
    const pwdResult = securityService.validatePasswordStrength(password);
    if (!pwdResult.isValid) {
      throw new Error(`Mot de passe faible: ${pwdResult.strength}`);
    }

    try {
      // Appel API sécurisé
      const response = await secureAPIClient.post('/api/auth/login', {
        email: emailResult.sanitized,
        password: password, // Jamais le transmettre en clair en production !
      });

      // Succès
      this.authToken = response.data.token;
      this.currentUser = response.data.user;
      this.isAuthenticated = true;

      // Stocker le token de manière sécurisée
      this.storeToken(this.authToken);

      // Reset des tentatives
      securityService.resetLoginAttempts(email);

      return response.data;
    } catch (error) {
      // Enregistrer tentative échouée
      securityService.recordFailedLogin(email);
      throw error;
    }
  }

  // Logout sécurisé
  async logout() {
    try {
      await secureAPIClient.post('/api/auth/logout', {});
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      // Nettoyer les données locales
      this.clearAuth();
    }
  }

  // Stocker le token de manière sécurisée
  storeToken(token) {
    // Option 1: SessionStorage (recommandé)
    sessionStorage.setItem('authToken', token);

    // Option 2: HttpOnly Cookie (idéal, mais nécessite backend)
    // Le backend doit envoyer: Set-Cookie: authToken=...; HttpOnly; Secure; SameSite=Strict

    // JAMAIS localStorage pour les tokens sensibles
    // localStorage n'est pas protégé contre XSS
  }

  // Récupérer le token
  getToken() {
    return sessionStorage.getItem('authToken');
  }

  // Nettoyer l'authentification
  clearAuth() {
    this.authToken = null;
    this.currentUser = null;
    this.isAuthenticated = false;
    sessionStorage.removeItem('authToken');
  }

  // Vérifier si authentifié
  isLoggedIn() {
    return this.isAuthenticated && this.authToken !== null;
  }

  // Rafraîchir le token
  async refreshToken() {
    try {
      const response = await secureAPIClient.post('/api/auth/refresh', {});
      this.authToken = response.data.token;
      this.storeToken(this.authToken);
      return response.data;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
```

### 3.2 Créer un composant Login sécurisé

**Fichier:** `src/components/SecureLogin.jsx`

```jsx
import { useState } from 'react';
import useFormSecurity from '../hooks/useFormSecurity';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function SecureLogin() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const formSchema = {
    email: { type: 'email', required: true },
    password: { type: 'password', required: true },
  };

  const { formData, errors, handleSubmit, isLoading } = useFormSecurity(
    formSchema,
    async (data) => {
      try {
        setApiError('');
        await authService.login(data.email, data.password);
        navigate('/dashboard');
      } catch (error) {
        setApiError(error.userMessage || error.message);
      }
    }
  );

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🔐 Connexion Sécurisée</h1>

      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-red-800">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            // ... connecter aux handlers du hook
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input
            type="password"
            name="password"
            // ... connecter aux handlers du hook
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
```

### 3.3 Créer un PrivateRoute protégé

**Fichier:** `src/components/PrivateRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

export default function PrivateRoute({ children }) {
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

---

## 🚀 ÉTAPE 4: Tester en production

### 4.1 Préparation locale

```bash
# 1. Build de production
npm run build

# 2. Vérifier le bundle
ls -lh dist/

# 3. Servir localement pour tester
npx serve dist

# 4. Ouvrir http://localhost:3000
```

### 4.2 Vérifier la sécurité

**Utiliser les outils en ligne:**

- 🔍 **SSL Labs:** https://www.ssllabs.com/ssltest/ - Vérifier HTTPS
- 🔍 **Security Headers:** https://securityheaders.com/ - Vérifier les headers
- 🔍 **CSP Evaluator:** https://csp-evaluator.withgoogle.com/ - Vérifier CSP
- 🔍 **OWASP ZAP:** Outil de scan de sécurité

### 4.3 Déployer sur production

#### Option A: Vercel

```bash
npm install -g vercel
vercel --prod
```

#### Option B: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option C: Serveur propre (VPS/Dedicated)

```bash
# 1. SSH sur le serveur
ssh user@server.com

# 2. Cloner le repo
git clone https://github.com/yourname/rebkul-web.git
cd rebkul-web

# 3. Installer et builder
npm install
npm run build

# 4. Copier les fichiers
sudo cp -r dist/* /var/www/monsite/

# 5. Configurer Nginx (voir ÉTAPE 2.2)
sudo systemctl restart nginx

# 6. Configurer SSL (Let's Encrypt)
sudo certbot certonly --nginx -d monsite.com
```

#### Option D: Docker

**Créer `Dockerfile`:**

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4.4 Monitoring & Logs

```javascript
// src/services/monitoringService.js
class MonitoringService {
  // Logger les erreurs de sécurité
  logSecurityEvent(event) {
    fetch('/api/logs/security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: event.type,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        details: event.details,
      }),
    });
  }

  // Logger les violations CSP
  logCSPViolation(violation) {
    this.logSecurityEvent({
      type: 'CSP_VIOLATION',
      details: violation,
    });
  }
}
```

---

## 📊 Checklist final

### Frontend ✅

- [ ] Formulaires avec `useFormSecurity`
- [ ] Sanitisation avec DOMPurify
- [ ] Validation d'inputs
- [ ] Rate limiting
- [ ] CSP activée

### Backend 🔧

- [ ] Headers de sécurité configurés
- [ ] CORS sécurisé
- [ ] Authentification implémentée
- [ ] Validation côté serveur
- [ ] Logs de sécurité

### Déploiement 🚀

- [ ] HTTPS/SSL configuré
- [ ] Variables d'environnement sécurisées
- [ ] Build optimisé
- [ ] Tests de sécurité passés
- [ ] Monitoring actif

---

## 📞 Prochaines étapes

1. **Intégration des formulaires** (30 min) - Étape 1
2. **Configuration serveur** (30 min) - Étape 2
3. **Authentification** (1-2 h) - Étape 3
4. **Déploiement** (1 h) - Étape 4

**Total:** ~3-4 heures pour sécurité complète

---

_Guide créé le 5 Novembre 2025_
_Version 1.0.0 - Production Ready_
