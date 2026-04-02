# 📊 Système de rôles et permissions - Explication complète

## 🎯 Objectif

Les clients qui s'inscrivent ne doivent **PAS** avoir accès au dashboard admin!

---

## 👥 Les 2 types d'utilisateurs

### 1️⃣ **Utilisateur CLIENT** (Inscription publique)

**Qui peut s'inscrire:**

- ✅ N'importe qui via le bouton "S'inscrire"
- ✅ Formulaire public accessible à tous

**Rôle:**

```
role: 'user'
```

**Permissions:**

```
❌ PAS accès au /dashboard (admin)
❌ PAS accès aux pages admin
❌ PAS accès à la gestion des clients
✅ SEULEMENT accès à son profil (optionnel)
```

**Page visible:**

```
/profile (si implémentée)
/account (si implémentée)
```

---

### 2️⃣ **ADMINISTRATEUR** (Création manuelle)

**Qui peut être admin:**

- ✅ SEULEMENT créé manuellement par vous
- ❌ IMPOSSIBLE de devenir admin via inscription

**Rôle:**

```
role: 'admin'
```

**Permissions:**

```
✅ Accès au /dashboard complet
✅ Gestion des clients
✅ Gestion des factures
✅ Gestion des paiements
✅ Analytics
✅ Tous les rapports
```

**Pages visibles:**

```
/dashboard (accueil)
/dashboard/clients
/dashboard/subscribers
/dashboard/payments
/dashboard/invoices
/dashboard/analytics
/dashboard/projects
/dashboard/messages
/dashboard/profile
```

---

## 🔐 Comment c'est protégé

### 1. Route Protection

**Fichier:** `src/components/AdminRoute.jsx`

```javascript
// Vérifie: isLoggedIn() ET isAdmin()
if (!authService.isLoggedIn()) {
  // Redirection /login
}

if (!roleService.isAdmin()) {
  // Redirection /login (accès refusé)
}

// Sinon → Affiche la page
```

### 2. Affichage du Dashboard button

**Fichier:** `src/components/NavbarSecured.jsx`

```javascript
if (isAuthenticated) {
  // Vérifie si admin ou pas
  if (userRole === 'admin') {
    // Affiche Dashboard button
  } else {
    // Cache Dashboard button (utilisateur normal)
  }
} else {
  // Non connecté → Cache tout
}
```

### 3. Stockage dans SessionStorage

```javascript
// À la connexion/inscription
sessionStorage.setItem('user_token', token);
sessionStorage.setItem(
  'current_user',
  JSON.stringify({
    id: 1,
    email: 'user@example.com',
    name: 'John',
    role: 'user', // ← Important!
  })
);
```

---

## 📋 Flux d'inscription - Ce qui se passe

### Étape 1: Visiteur clique "S'inscrire"

```
Navbar → Bouton S'inscrire
         ↓
Route: /register
         ↓
SecureRegister.jsx s'affiche
```

### Étape 2: Remplir le formulaire

```
Email: client@example.com
Mot de passe: Client@12345
Nom: John Client
         ↓
Validation (client side)
         ↓
authService.register()
```

### Étape 3: Inscription réussie

```
Créer utilisateur avec:
├─ email: client@example.com
├─ name: John Client
├─ role: 'user'  ← PAS admin!
└─ password: (hasher avec bcrypt)

Générer JWT token
         ↓
Stocker dans sessionStorage
         ↓
Redirection: /dashboard (ou /)
```

### Étape 4: Accès au système

```
Utilisateur normal:
├─ ✅ Connecté
├─ ✅ Token valide
├─ ✅ Rôle: 'user'
├─ ❌ Dashboard button CACHÉ
├─ ❌ Pas d'accès /dashboard
└─ ❌ Redirection /login si tentative

Administrateur:
├─ ✅ Connecté
├─ ✅ Token valide
├─ ✅ Rôle: 'admin'
├─ ✅ Dashboard button VISIBLE
├─ ✅ Accès /dashboard complet
└─ ✅ Accès à tout
```

---

## 💾 Base de données - Structure recommandée

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- HASHER avec bcrypt!
  name VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Données par défaut

```sql
-- Admin (vous)
INSERT INTO users (email, password, name, role, status) VALUES
('admin@example.com', '$2b$10$...', 'Administrator', 'admin', 'active');

-- Clients normaux
INSERT INTO users (email, password, name, role, status) VALUES
('client1@example.com', '$2b$10$...', 'Client 1', 'user', 'active'),
('client2@example.com', '$2b$10$...', 'Client 2', 'user', 'active');
```

**IMPORTANT:** Le password doit être hasher avec **bcrypt**, PAS en plain text!

```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

---

## 🧪 Test - Vérifier que ça marche

### Test 1: Admin (✅ accès complet)

```
1. Se connecter: admin@example.com / Admin@12345
2. Vérifier:
   ✅ Dashboard button VISIBLE
   ✅ /dashboard accessible
   ✅ Toutes les pages admin visibles
```

### Test 2: Utilisateur normal (❌ pas d'accès admin)

```
1. S'inscrire: newuser@example.com
2. Remplir le formulaire
3. Vérifier:
   ❌ Dashboard button NOT VISIBLE
   ❌ /dashboard NOT accessible (redirection /login)
   ❌ Menu admin caché
```

### Test 3: Non connecté (❌ rien)

```
1. Sans être connecté
2. Vérifier:
   ❌ Dashboard button invisible
   ❌ Boutons Connexion/S'inscrire visibles
   ❌ /dashboard pas accessible
```

---

## 🚀 Comment les clients ont accès à leurs données

### Option 1: Page de profil

```javascript
// /profile (accessible seulement si connecté)
<PrivateRoute>
  <Profile />
</PrivateRoute>
```

### Option 2: Page personnelle

```javascript
// /my-account ou /account
<PrivateRoute>
  <Account />
</PrivateRoute>
```

### Option 3: Portail client

```javascript
// /client-portal
<PrivateRoute>
  <ClientPortal />
</PrivateRoute>
```

**À vous de créer ces pages!** Elles seront protégées mais accessibles aux utilisateurs normaux.

---

## 📊 Vue d'ensemble - Qui accède à quoi

| Page                  | Public | User | Admin |
| --------------------- | ------ | ---- | ----- |
| `/` (Home)            | ✅     | ✅   | ✅    |
| `/login`              | ✅     | ❌   | ❌    |
| `/register`           | ✅     | ❌   | ❌    |
| `/profile`            | ❌     | ✅   | ✅    |
| `/dashboard`          | ❌     | ❌   | ✅    |
| `/dashboard/clients`  | ❌     | ❌   | ✅    |
| `/dashboard/payments` | ❌     | ❌   | ✅    |
| etc...                | ❌     | ❌   | ✅    |

---

## ⚠️ SÉCURITÉ - À faire

### Frontend (Déjà fait ✅)

- ✅ AdminRoute protège les pages
- ✅ PrivateRoute protège les pages user
- ✅ Navbar affiche/cache correctement
- ✅ Roles vérifiés

### Backend (À faire ❌)

- ❌ Vérifier le rôle à chaque requête API
- ❌ Rejeter les requêtes des utilisateurs non-autorisés
- ❌ Logger les tentatives d'accès non-autorisé
- ❌ Rate limiting pour sécurité

### Backend - Exemple

```javascript
// Middleware de protection
const adminOnly = (req, res, next) => {
  const user = req.user; // Du JWT token

  if (user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied - Admin only',
    });
  }

  next();
};

// Route admin
app.get('/api/clients', adminOnly, (req, res) => {
  // Retourner les clients
});
```

---

## 🎯 Résumé final

### ✅ Les clients qui s'inscrivent:

- Reçoivent un compte avec `role: 'user'`
- N'ont **PAS** accès au dashboard admin
- Sont stockés dans la table `users`
- Peuvent accéder à leur profil (si créé)

### ✅ Vous (Admin):

- Vous avez `role: 'admin'`
- Accès complet au dashboard
- Pouvez gérer tous les clients
- Pouvez voir les inscrits dans `Subscribers`

### ✅ C'est protégé par:

- Routes (AdminRoute/PrivateRoute)
- Vérification du rôle (roleService)
- SessionStorage (tokens)
- Affichage conditionnel (Navbar)

---

## 📝 À faire maintenant

1. ✅ Inscription disponible (déjà fait)
2. ✅ Rôles protégés (déjà fait)
3. ❌ Créer page /profile ou /account pour clients
4. ❌ Créer API backend
5. ❌ Tester tous les scénarios

---

**Status:** ✅ Sécurité des rôles implémentée  
**Version:** 1.0  
**Date:** Novembre 2025
