# 🔐 Identifiants de test - Mode Développement

## 👨‍💼 Compte Administrateur de Test

### Email

```
admin@example.com
```

### Mot de passe

```
Admin@12345
```

---

## 🚀 Comment se connecter

### Étape 1: Cliquer sur "Connexion"

- Le formulaire `SecureLogin` s'affiche

### Étape 2: Entrer les credentials

```
Email: admin@example.com
Mot de passe: Admin@12345
```

### Étape 3: Cliquer "Se connecter"

- ✅ Connexion réussie
- ✅ Redirection vers `/dashboard`
- ✅ Navbar affiche le bouton Dashboard
- ✅ Menu utilisateur visible

---

## 📊 Ce que vous pouvez faire une fois connecté

### ✅ Voir le Dashboard

- Clients
- Subscribers
- Payments
- Invoices
- Analytics
- Projects
- Messaging
- Profile

### ✅ Naviguer dans l'admin

- Menu latéral du dashboard
- Pages protégées

### ✅ Se déconnecter

- Clic sur "Déconnexion" dans le menu utilisateur
- Retour à la page d'accueil

---

## ⚠️ IMPORTANT - À faire avant production

### 1. Créer votre backend API

Les endpoints nécessaires:

```javascript
POST /api/auth/login
├─ Body: { email, password }
├─ Response: { success, token, user }
└─ Valide les credentials

POST /api/auth/register
├─ Body: { email, password, name }
└─ Crée un nouvel utilisateur

GET /api/auth/me
├─ Headers: Authorization: Bearer {token}
└─ Retourne les données utilisateur
```

### 2. Configurer votre base de données

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255) -- HASH avec bcrypt
  name VARCHAR(255),
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Hash les passwords

```javascript
// Exemple avec bcrypt
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

### 4. Mettre à jour authService.js

Le fichier `src/services/authService.js` envoie les requêtes au backend:

```javascript
// À modifier avec votre URL de backend
const API_URL = 'https://votre-api.com'; // ← À changer
```

---

## 🧪 Test local avant production

### Avec credentials fictifs (actuellement)

```bash
npm run dev
# Ouvrir http://localhost:5173
# Cliquer Connexion
# Entrer: admin@example.com / Admin@12345
# ✅ Accès au dashboard
```

### Avec votre backend (après création)

1. Créer le backend API
2. Mettre à jour `authService.js` avec l'URL de votre API
3. Créer un utilisateur admin dans votre base de données
4. Tester la connexion

---

## 📝 Créer d'autres comptes de test

### Pour les tests:

```
Email: user@example.com
Mot de passe: User@12345

Email: test@example.com
Mot de passe: Test@12345
```

### Ajouter à votre base de données:

```sql
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@example.com', '$2b$10$...', 'Admin User', 'admin'),
('user@example.com', '$2b$10$...', 'Regular User', 'user'),
('test@example.com', '$2b$10$...', 'Test User', 'user');
```

---

## 🔐 Sécurité

### Ce qui est déjà protégé:

✅ **Frontend:**

- Validation des inputs
- Sanitization XSS
- CSRF tokens
- Rate limiting

✅ **À implémenter côté backend:**

- Password hashing (bcrypt)
- JWT token signing
- Database encryption
- HTTPS/SSL
- Logging & monitoring

---

## 🚨 Problèmes courants

### Q: "Authentification échouée"

**A:** Le backend n'existe pas encore. C'est normal en développement.

### Q: "Accès refusé au dashboard"

**A:** Vérifier que le token JWT est valide dans `authService.js`

### Q: "Mot de passe incorrect"

**A:** Vérifier que vous entrez `Admin@12345` (sensible à la casse)

---

## 📚 Fichiers source à consulter

- `src/services/authService.js` - Logique authentification
- `src/components/SecureLogin.jsx` - Formulaire login
- `src/components/SecureRegister.jsx` - Formulaire register
- `src/components/NavbarSecured.jsx` - Navigation sécurisée

---

## 🎯 Prochaines étapes

1. ✅ Tester les credentials de test (maintenant)
2. Créer le backend API
3. Implémenter les endpoints `/auth/login`, `/auth/register`, `/auth/me`
4. Connecter le frontend au backend
5. Déployer en production

---

**Version:** 1.0  
**Date:** Novembre 2025  
**Status:** ✅ Test credentials disponibles
