# 📝 Configuration des routes d'authentification sécurisée

## 🎯 Formulaires disponibles

Vous avez maintenant 3 composants d'authentification prêts à l'emploi:

1. **SecureRegister.jsx** ✅ - Inscription avec validation de force du mot de passe
2. **SecureLogin.jsx** ✅ - Connexion sécurisée
3. **PrivateRoute.jsx** ✅ - Protection des routes

---

## 🔧 Intégration dans App.jsx

### Étape 1: Importer les composants

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SecureRegister from './components/SecureRegister';
import SecureLogin from './components/SecureLogin';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './dashboard/pages/AdminDashboard';
import Home from './pages/Home';
```

### Étape 2: Configurer les routes

```jsx
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SecureRegister />} />
        <Route path="/login" element={<SecureLogin />} />

        {/* Routes privées - User dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Routes privées - Admin dashboard (SÉCURISÉ) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* Page 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🛡️ Flux d'authentification complet

```
┌─────────────────────────────────────────────────────────┐
│  1. Utilisateur arrive sur le site                      │
│     ↓                                                    │
│  2. Choix: /register ou /login                           │
│     ├─ /register → SecureRegister.jsx                   │
│     │  ├─ Validation name/email                         │
│     │  ├─ Validation force du password                  │
│     │  ├─ Confirmation password                         │
│     │  └─ POST /api/auth/register                       │
│     │     ↓                                              │
│     │  3. Création compte + JWT token                   │
│     │     ↓                                              │
│     │  4. Redirection vers /dashboard                   │
│     │                                                    │
│     └─ /login → SecureLogin.jsx                         │
│        ├─ Validation email                              │
│        ├─ Rate limiting                                 │
│        └─ POST /api/auth/login                          │
│           ↓                                              │
│  3. Token JWT stocké en sessionStorage                  │
│     ↓                                                    │
│  4. authService.initialize() au démarrage               │
│     ├─ Récupère le token                                │
│     ├─ Valide le token                                  │
│     └─ Charge les données utilisateur                   │
│     ↓                                                    │
│  5. Vérifier les permissions                            │
│     ├─ PrivateRoute → User dashboard OK                 │
│     ├─ AdminRoute → Vérifier rôle admin                 │
│     │  ├─ Admin? → Admin dashboard                      │
│     │  └─ Non-admin? → Redirection /login               │
│     └─ Non authentifié? → Redirection /login            │
│                                                          │
│  6. Logout → clearAuth() → Suppression token            │
│     Redirection vers /login                             │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Sécurité intégrée

### SecureRegister
- ✅ Validation email RFC 5322
- ✅ Force du mot de passe en temps réel
- ✅ Confirmation du mot de passe
- ✅ Affichage de la force (Très faible → Très fort)
- ✅ Checklist des critères (majuscule, chiffre, etc.)
- ✅ Rate limiting
- ✅ Sanitisation des inputs
- ✅ Stockage sécurisé du token (sessionStorage)

### SecureLogin
- ✅ Validation email
- ✅ Rate limiting (5 tentatives/15 min)
- ✅ Account lockout automatique
- ✅ Affichage/masquage du mot de passe
- ✅ Lien "Mot de passe oublié"
- ✅ Lien vers l'inscription

### PrivateRoute
- ✅ Vérifier si connecté
- ✅ Redirection vers /login si non authentifié
- ✅ Préserve l'URL après reconnexion

### AdminRoute
- ✅ Vérifier si connecté
- ✅ Vérifier si rôle = admin
- ✅ Redirection vers /login si non admin
- ✅ Logs de sécurité

---

## 🌐 Configuration du serveur

### Backend endpoints requis

```javascript
// POST /api/auth/register
{
  "email": "user@example.com",
  "password": "HashedPassword123!",
  "name": "John Doe"
}
Response: { token: "jwt-token", user: { id, email, name, role } }

// POST /api/auth/login
{
  "email": "user@example.com",
  "password": "Password123!"
}
Response: { token: "jwt-token", user: { id, email, name, role } }

// GET /api/auth/me
Headers: { Authorization: "Bearer jwt-token" }
Response: { id, email, name, role }

// POST /api/auth/logout
Response: { success: true }
```

---

## 🎨 Personnalisation

### Changer les couleurs

```jsx
// SecureRegister.jsx ligne ~30
className="bg-gradient-to-r from-purple to-pink"
// Remplacer purple et pink par vos couleurs
```

### Ajouter un logo

```jsx
<div className="text-center mb-8">
  <img src="/logo.png" alt="Logo" className="w-12 h-12 mx-auto mb-4" />
  <h1 className="text-3xl font-bold text-white mb-2">Mon App</h1>
</div>
```

### Ajouter d'autres champs

```jsx
// Ajouter au formSchema
const formSchema = {
  name: { type: 'text', minLength: 2, maxLength: 50, required: true },
  email: { type: 'email', required: true },
  phone: { type: 'phone', required: false }, // ✅ Nouveau
  company: { type: 'text', required: false }, // ✅ Nouveau
  password: { type: 'password', required: true },
  // ...
};
```

---

## 📊 Flux de données

```
SecureRegister.jsx
├─ useFormSecurity hook
│  ├─ Validation en temps réel
│  ├─ Sanitisation automatique
│  └─ Affichage des erreurs
├─ authService.register()
│  ├─ Validation côté client
│  ├─ POST /api/auth/register
│  └─ Stockage du token
└─ navigate('/dashboard')

SecureLogin.jsx
├─ useFormSecurity hook
│  ├─ Validation email
│  ├─ Rate limiting
│  └─ Gestion des tentatives
├─ authService.login()
│  ├─ Validation email
│  ├─ Vérification rate limit
│  ├─ POST /api/auth/login
│  └─ Stockage du token
└─ navigate('/dashboard')

PrivateRoute.jsx
├─ authService.isLoggedIn()
├─ Si true: render children
└─ Si false: navigate('/login')

AdminRoute.jsx
├─ authService.isLoggedIn()
├─ roleService.hasRole('admin')
├─ Si true: render children
└─ Si false: navigate('/login')
```

---

## ✅ Checklist d'implémentation

- [ ] Importer les composants dans App.jsx
- [ ] Configurer les routes
- [ ] Créer les endpoints API (/api/auth/*)
- [ ] Implémenter la validation côté serveur
- [ ] Hasher les passwords (bcrypt)
- [ ] Configurer JWT secrets
- [ ] Tester l'inscription en local
- [ ] Tester la connexion en local
- [ ] Tester l'accès admin
- [ ] Déployer en production

---

## 🚀 Prochaines étapes

1. **Backend API** (2-3 heures)
   - Créer les endpoints d'authentification
   - Implémenter la validation
   - Configurer les JWT

2. **Tests** (30 minutes)
   - Tester l'inscription
   - Tester la connexion
   - Tester les redirections
   - Tester l'accès admin

3. **Sécurité** (15 minutes)
   - Vérifier les headers
   - Tester les protections CSRF
   - Vérifier le stockage des tokens

4. **Déploiement** (30 minutes)
   - Build de production
   - Déployer sur Vercel/Docker/VPS
   - Tester en production

---

## 📞 Support

Pour les questions, consultez:
- `FRONTEND_SECURITY_GUIDE.md`
- `COMPLETE_DEPLOYMENT_GUIDE.md`
- Code source des services

---

*Configuration d'authentification complète: ✅ PRÊTE*

*Temps estimé pour backend: 2-3 heures*

*Temps estimé pour tests: 30 minutes*
