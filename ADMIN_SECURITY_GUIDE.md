# 🔐 Guide - Route Admin Dashboard Sécurisée

## 📋 Fichiers créés

| Fichier | Description | Statut |
|---------|-------------|--------|
| `src/services/roleService.js` | Gestion des rôles et permissions | ✅ Créé |
| `src/components/AdminRoute.jsx` | Protection des routes admin | ✅ Créé |
| `src/services/authService.js` | Mise à jour avec rôles | ✅ Modifié |

---

## 🛡️ Système de rôles

### Rôles disponibles

```javascript
{
  admin: [                          // Accès complet
    'VIEW_DASHBOARD',
    'MANAGE_CLIENTS',
    'MANAGE_SUBSCRIBERS',
    'MANAGE_PAYMENTS',
    'MANAGE_INVOICES',
    'VIEW_ANALYTICS',
    'MANAGE_PROJECTS',
    'MANAGE_MESSAGES',
    'MANAGE_USERS',
    'SYSTEM_SETTINGS',
  ],
  
  moderator: [                      // Accès limité
    'VIEW_DASHBOARD',
    'MANAGE_CLIENTS',
    'MANAGE_SUBSCRIBERS',
    'VIEW_PAYMENTS',
    'VIEW_ANALYTICS',
    'MANAGE_MESSAGES',
  ],
  
  user: [                           // Accès minimum
    'VIEW_PROFILE',
  ],
}
```

---

## 🚀 Utilisation

### 1. Mettre à jour App.jsx

**Fichier:** `src/App.jsx`

```jsx
import AdminRoute from './components/AdminRoute';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Route admin protégée */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="clients" element={<Clients />} />
        <Route path="payments" element={<PaymentManagement />} />
        {/* ... autres routes */}
      </Route>

      {/* Autres routes... */}
    </Routes>
  );
}
```

### 2. Utiliser roleService dans vos composants

```jsx
import roleService from '../services/roleService';

export default function MyComponent() {
  // Vérifier si admin
  if (!roleService.isAdmin()) {
    return <div>Accès refusé</div>;
  }

  // Vérifier une permission spécifique
  if (roleService.hasPermission('MANAGE_PAYMENTS')) {
    return <PaymentPanel />;
  }

  // Vérifier plusieurs permissions
  if (roleService.hasAllPermissions(['MANAGE_CLIENTS', 'MANAGE_PAYMENTS'])) {
    return <FullPanel />;
  }

  return null;
}
```

### 3. Logger les accès (audit trail)

```jsx
import roleService from '../services/roleService';

// Dans vos actions sensibles
roleService.logAccess('DELETE_USER', 'USER_123');
roleService.logAccess('UPDATE_PAYMENT', 'PAYMENT_456');
roleService.logAccess('EXPORT_DATA', 'CLIENTS_LIST');
```

---

## 🔐 Sécurité implémentée

### ✅ Protection en couches

1. **Authentification**
   - Login requis
   - Token JWT validé

2. **Autorisation**
   - Rôle vérifié (admin)
   - Permissions vérifiées

3. **Audit**
   - Accès loggé
   - Timestamp enregistré
   - User identifié

4. **Redirection**
   - Non-authentifié → `/login`
   - Non-admin → `/` (page d'accueil)

### 🛡️ Protection XSS

```jsx
// ✅ Sécurisé
<div>{roleService.getCurrentUser()?.email}</div>

// ❌ Dangereux
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 🛡️ Protection CSRF

```javascript
// Déjà inclus dans secureAPIClient
// Tous les appels API incluent automatiquement
// les headers X-CSRF-Token
```

---

## 📊 Flux de sécurité

```
1. Utilisateur va à /dashboard
                     ↓
2. AdminRoute vérifie:
   - isLoggedIn()? ✓
   - isAdmin()? ✓
                     ↓
3. Si ✓: Affiche Dashboard
   Log: ACCESSED | ADMIN_DASHBOARD
                     ↓
4. Si ✗: Redirige /login ou /
   Log: DENIED_ACCESS | ADMIN_DASHBOARD
```

---

## 💡 Exemples avancés

### Middleware permission

```jsx
function AdminOnly({ children, permission }) {
  if (!roleService.hasPermission(permission)) {
    return <UnauthorizedPage />;
  }
  return children;
}

// Utilisation
<AdminOnly permission="MANAGE_PAYMENTS">
  <PaymentPage />
</AdminOnly>
```

### Conditional rendering

```jsx
export default function AdminPanel() {
  const isAdmin = roleService.isAdmin();
  const canManageUsers = roleService.hasPermission('MANAGE_USERS');

  return (
    <div>
      {/* Visible pour tous les admins */}
      {isAdmin && <Dashboard />}

      {/* Visible uniquement si permission spécifique */}
      {canManageUsers && <UserManagement />}

      {/* Permissions multiples */}
      {roleService.hasAllPermissions([
        'MANAGE_PAYMENTS',
        'VIEW_ANALYTICS',
      ]) && <FinancePanel />}
    </div>
  );
}
```

### Audit logger

```javascript
// Tracer toutes les actions importantes
class UserService {
  async deleteUser(userId) {
    // Action
    const result = await api.delete(`/users/${userId}`);

    // Log l'accès
    roleService.logAccess('DELETE_USER', userId);

    return result;
  }

  async exportData() {
    // Log avant l'export
    roleService.logAccess('EXPORT_DATA', 'ALL_RECORDS');

    return await generateExport();
  }
}
```

---

## 🧪 Tests

### Test 1: Accès non-authentifié
```
1. Aller à /dashboard
2. Résultat attendu: Redirigé vers /login
```

### Test 2: Accès utilisateur normal
```
1. Se connecter en tant qu'utilisateur standard
2. Aller à /dashboard
3. Résultat attendu: Redirigé vers /
```

### Test 3: Accès admin
```
1. Se connecter en tant qu'admin
2. Aller à /dashboard
3. Résultat attendu: Dashboard affiché
4. Console: Log "ACCESSED | ADMIN_DASHBOARD"
```

### Test 4: Permission spécifique
```javascript
// Dans la console
roleService.isAdmin()           // true/false
roleService.hasPermission('MANAGE_PAYMENTS') // true/false
roleService.getAccessLevel()    // 'ADMIN', 'MODERATOR', 'USER'
```

---

## 📝 Configuration backend

**Réponse du login doit inclure:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "admin@example.com",
    "role": "admin",
    "name": "Admin User"
  }
}
```

**Rôles acceptés:** `admin`, `moderator`, `user`

---

## 🚀 Prochaines étapes

1. **Backend API**
   - Retourner le rôle dans la réponse login
   - Valider le rôle côté serveur
   - Implémenter l'endpoint /api/audit-logs

2. **Tests**
   - Tester avec différents rôles
   - Vérifier les logs d'audit
   - Tester les permissions

3. **Monitoring**
   - Afficher les audit logs dans le dashboard
   - Alerter sur accès non-autorisés
   - Trier par utilisateur/action/date

---

## ✅ Checklist sécurité

- [x] AdminRoute créé
- [x] roleService créé
- [x] Rôles définis
- [x] Permissions définies
- [x] Logging implémenté
- [x] Intégration authService complète
- [ ] Backend API à ajuster
- [ ] Tests à valider
- [ ] Audit logs à afficher
- [ ] Alertes de sécurité à configurer

---

**Système de sécurité admin en place et prêt pour le backend ! 🎉**

Pour les questions, consultez les services correspondants ou la documentation générale.
