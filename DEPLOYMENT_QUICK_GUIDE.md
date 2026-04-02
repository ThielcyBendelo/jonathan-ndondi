# 🚀 Guide de déploiement - Navbar sécurisé

## 📋 Avant de déployer

- [ ] NavbarSecured intégré dans App.jsx
- [ ] Tous les tests de sécurité passent (SecurityTestDashboard)
- [ ] Backend API configuré (si utilisé)
- [ ] npm run build réussi (0 errors)

---

## 🌐 Option 1: Vercel (⭐ Recommandé - 2 min)

### Étape 1: Préparer le projet

```bash
git init
git add .
git commit -m "Security: Add NavbarSecured and authentication system"
git branch -M main
```

### Étape 2: Pusher sur GitHub

```bash
git remote add origin https://github.com/votre-user/votre-repo.git
git push -u origin main
```

### Étape 3: Déployer sur Vercel

**Méthode A: Via interface Vercel**

1. Aller à https://vercel.com
2. Cliquer "New Project"
3. Sélectionner votre repo GitHub
4. Cliquer "Deploy"
5. **✅ Déployé en ~30 secondes**

**Méthode B: Via CLI**

```bash
npm i -g vercel
vercel
# Suivre les instructions
```

### Résultat:

```
✅ URL de production: https://votre-site.vercel.app
✅ Auto-déploiement à chaque push
✅ SSL/HTTPS gratuit
✅ CDN global
```

---

## 🐳 Option 2: Docker (5 min)

### Étape 1: Vérifier le Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Étape 2: Construire l'image

```bash
docker build -t monsite-app:latest .
```

### Étape 3: Lancer le conteneur

```bash
docker run -p 80:80 monsite-app:latest
# Accès: http://localhost
```

### Étape 4: Déployer (optionnel)

**Sur Docker Hub:**

```bash
docker tag monsite-app:latest votre-user/monsite-app:latest
docker push votre-user/monsite-app:latest
```

---

## 💻 Option 3: VPS / Serveur Dédié (10 min)

### Étape 1: Se connecter au serveur

```bash
ssh root@your-server-ip
```

### Étape 2: Installer Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs git
```

### Étape 3: Cloner et déployer

```bash
git clone https://github.com/votre-user/monsite-app.git
cd monsite-app
npm install
npm run build
```

### Étape 4: Configurer Nginx

```bash
# Copier config
cp nginx.conf /etc/nginx/sites-available/monsite
ln -s /etc/nginx/sites-available/monsite /etc/nginx/sites-enabled/

# Redémarrer Nginx
systemctl restart nginx
```

### Étape 5: Configurer SSL

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d votre-domaine.com
```

---

## ✅ Checklist post-déploiement

### 1. Vérifier la sécurité

```bash
# Headers de sécurité
curl -I https://votre-site.com

# Devrait voir:
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

### 2. Tester les fonctionnalités

- [ ] Navbar affichée correctement
- [ ] Bouton "Connexion" visible sans login
- [ ] Bouton "Dashboard" caché sans login
- [ ] Redirection /login si pas authentifié
- [ ] Login fonctionne
- [ ] Dashboard visible après login
- [ ] Déconnexion fonctionne

### 3. Vérifier les performances

```bash
# Google Lighthouse
# https://developers.google.com/web/tools/lighthouse

# Résultats cibles:
# Performance: > 90
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
```

---

## 🔐 Configuration de sécurité en production

### 1. Headers de sécurité (nginx.conf)

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 2. Content Security Policy

```html
<!-- Déjà dans main.jsx -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'"
/>
```

### 3. Variables d'environnement

```bash
# Créer .env.production
VITE_API_URL=https://votre-api.com
VITE_JWT_EXPIRY=3600
VITE_RATE_LIMIT_MINUTES=1
```

---

## 📊 Monitoring et logs

### 1. Logs Nginx

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. Logs d'application

```javascript
// Dans main.jsx
if (import.meta.env.PROD) {
  console.log('🚀 App en production');
  // Envoyer les logs à un service
  // ex: Sentry, LogRocket, etc.
}
```

### 3. Analytics

```javascript
// Ajouter Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## 🐛 Dépannage

### Problème 1: 502 Bad Gateway

**Cause:** L'app n'est pas accessible depuis Nginx

**Solution:**

```bash
# Vérifier que l'app tourne
ps aux | grep node

# Vérifier les logs
journalctl -u app-service -n 50
```

### Problème 2: CSS/JS 404 Not Found

**Cause:** Mauvaise base URL

**Solution - dans vite.config.js:**

```javascript
export default {
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  base: '/', // ← Vérifier cette valeur
};
```

### Problème 3: CORS errors

**Cause:** Backend pas configuré pour CORS

**Solution - Backend Express:**

```javascript
const cors = require('cors');
app.use(
  cors({
    origin: 'https://votre-site.com',
    credentials: true,
  })
);
```

### Problème 4: Navbar ne charge pas

**Cause:** Imports manquants

**Solution:**

```bash
# Vérifier les erreurs
npm run build -- --debug

# Vérifier les imports dans App.jsx
grep -n "import.*NavbarSecured" src/App.jsx
```

---

## 📈 Optimisations post-déploiement

### 1. Compression Gzip

**nginx.conf:**

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
gzip_min_length 1000;
gzip_comp_level 6;
```

### 2. Cache des assets

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

### 3. Lazy loading des images

```jsx
<img loading="lazy" src="image.jpg" alt="description" />
```

### 4. Minification du bundle

```bash
npm run build  # Vite minifie automatiquement
```

---

## 🔔 Notifications et alertes

### Setup Sentry (Erreurs temps réel)

```javascript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://your-sentry-dsn@sentry.io/xxxxx',
  environment: import.meta.env.MODE,
});
```

### Setup LogRocket (Session replay)

```javascript
import LogRocket from 'logrocket';

LogRocket.init('your-app-id');
```

---

## ✅ Checklist de déploiement final

```
PRE-DÉPLOIEMENT:
- [ ] npm run build réussi
- [ ] npm run dev testé localement
- [ ] SecurityTestDashboard tous les tests verts
- [ ] Variables d'environnement configurées
- [ ] Backend API prêt (optionnel)

POST-DÉPLOIEMENT:
- [ ] Site accessible en HTTPS
- [ ] Headers de sécurité configurés
- [ ] Navbar affichée correctement
- [ ] Authentication fonctionne
- [ ] Logs configurés
- [ ] Monitoring setup
- [ ] Backups activés

MAINTENANCE:
- [ ] Updates Node.js régulières
- [ ] Updates dépendances npm
- [ ] Vérification des erreurs quotidienne
- [ ] Tests de sécurité mensuels
```

---

## 🎯 Prochaines étapes

1. **Immédiat:** Choisir une plateforme (Vercel/Docker/VPS)
2. **Jour 1:** Déployer l'application
3. **Jour 2:** Configurer le backend API
4. **Jour 3:** Tests complets en production
5. **Jour 4:** Monitoring et optimisations

---

**Status:** ✅ PRÊT À DÉPLOYER  
**Plateforme recommandée:** Vercel (plus simple)  
**Temps estimé:** 2-10 minutes
