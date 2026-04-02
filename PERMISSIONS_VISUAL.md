# 🎨 Système de permissions - Diagramme visuel

## 📊 Flux d'accès par rôle

```
VISITEUR (Non connecté)
│
├─ Cliquer "Connexion"
│  └─ Affiche: SecureLogin ✅
│
├─ Cliquer "S'inscrire"
│  └─ Affiche: SecureRegister ✅
│
├─ Voir: Dashboard button?
│  └─ NON ❌ (Caché)
│
└─ Accès à /dashboard?
   └─ NON ❌ (Redirection /login)


UTILISATEUR (Client inscrit - role: 'user')
│
├─ Connecté?
│  └─ OUI ✅
│
├─ Dashboard button visible?
│  └─ NON ❌ (Caché)
│
├─ Menu utilisateur visible?
│  └─ OUI ✅ (Avatar + Déconnexion)
│
├─ Accès à /dashboard?
│  └─ NON ❌ (Redirection /login - pas autorisé)
│
├─ Accès à /profile?
│  └─ OUI ✅ (Si page créée)
│
└─ Accès à /account?
   └─ OUI ✅ (Si page créée)


ADMINISTRATEUR (Vous - role: 'admin')
│
├─ Connecté?
│  └─ OUI ✅
│
├─ Dashboard button visible?
│  └─ OUI ✅ (Cliquable)
│
├─ Menu utilisateur visible?
│  └─ OUI ✅ (Avatar + Déconnexion)
│
├─ Accès à /dashboard?
│  └─ OUI ✅ (Dashboard home)
│
├─ Accès à /dashboard/clients?
│  └─ OUI ✅ (Voir tous les clients)
│
├─ Accès à /dashboard/subscribers?
│  └─ OUI ✅ (Voir les inscrits)
│
├─ Accès à /dashboard/payments?
│  └─ OUI ✅ (Gérer les paiements)
│
├─ Accès à /dashboard/invoices?
│  └─ OUI ✅ (Gérer les factures)
│
└─ Accès à /dashboard/analytics?
   └─ OUI ✅ (Voir les statistiques)
```

---

## 🔐 Protection des routes

```
ROUTE STRUCTURE:

/
├─ PUBLIC ✅
└─ Tous les visiteurs

/login
├─ PUBLIC ✅
└─ Formulaire de connexion

/register
├─ PUBLIC ✅
└─ Formulaire d'inscription

/profile
├─ PrivateRoute (user + admin) ✅
├─ Client: ✅ peut voir son profil
└─ Admin: ✅ peut gérer profil

/dashboard
├─ AdminRoute (admin only) 🔒
├─ Client: ❌ redirection /login
├─ Admin: ✅ accès complet
│
├─ /dashboard (home)
├─ /dashboard/clients
├─ /dashboard/subscribers  ← Voir les clients inscrits
├─ /dashboard/payments
├─ /dashboard/invoices
├─ /dashboard/analytics
├─ /dashboard/projects
├─ /dashboard/messages
└─ /dashboard/profile
```

---

## 🧬 Détail de vérification - AdminRoute

```
USER TRIES TO ACCESS /dashboard
│
├─ AuthService.isLoggedIn()?
│  ├─ YES → Continue
│  └─ NO → ❌ Redirect /login
│
├─ RoleService.isAdmin()?
│  ├─ YES → ✅ ALLOW ACCESS
│  └─ NO → ❌ Redirect /login
│
└─ Affiche AdminLayout + contenu
```

---

## 📋 Tableau de permissions

```
┌──────────────────────┬─────────┬────────┬────────┐
│ Action               │ Public  │ User   │ Admin  │
├──────────────────────┼─────────┼────────┼────────┤
│ Lire home            │ ✅      │ ✅     │ ✅     │
│ Login                │ ✅      │ ❌     │ ❌     │
│ Register             │ ✅      │ ❌     │ ❌     │
│ Lire profil          │ ❌      │ ✅     │ ✅     │
│ Modifier profil      │ ❌      │ ✅     │ ✅     │
│ Dashboard (accueil)  │ ❌      │ ❌     │ ✅     │
│ Lister clients       │ ❌      │ ❌     │ ✅     │
│ Créer client         │ ❌      │ ❌     │ ✅     │
│ Modifier client      │ ❌      │ ❌     │ ✅     │
│ Supprimer client     │ ❌      │ ❌     │ ✅     │
│ Lister payments      │ ❌      │ ❌     │ ✅     │
│ Voir factures        │ ❌      │ ❌     │ ✅     │
│ Analytics            │ ❌      │ ❌     │ ✅     │
│ Déconnexion          │ ❌      │ ✅     │ ✅     │
└──────────────────────┴─────────┴────────┴────────┘
```

---

## 🧪 Test - Scénarios

### Scénario 1: Nouveau visiteur

```
1. Visite http://localhost:5173/
   ├─ Voit: Home page ✅
   ├─ Voir navbar avec: Connexion, S'inscrire ✅
   └─ Dashboard button: caché ❌

2. Clique "S'inscrire"
   ├─ Redirected: /register
   ├─ Voit: Formulaire d'inscription ✅
   └─ Remplir: Email, Password, Name

3. Clique "S'inscrire"
   ├─ Inscription réussie ✅
   ├─ Token stocké ✅
   ├─ Role: 'user' (créé automatiquement)
   └─ Peut être redirigé: home ou /profile

4. Essaie d'accéder: /dashboard
   ├─ Route: AdminRoute check role
   ├─ Role: 'user' (NOT admin)
   ├─ Redirection: /login
   └─ Message: "Access denied"
```

### Scénario 2: Admin

```
1. Visite http://localhost:5173/
   ├─ Clique "Connexion"
   └─ Formulaire login s'affiche ✅

2. Remplir credentials
   ├─ Email: admin@example.com
   ├─ Password: Admin@12345
   └─ Clique "Se connecter"

3. Connexion réussie
   ├─ Token stocké ✅
   ├─ Role: 'admin' (du backend)
   ├─ Navbar met à jour ✅
   └─ Dashboard button: VISIBLE ✅

4. Clique "Dashboard"
   ├─ Route: /dashboard
   ├─ AdminRoute vérifie: role === 'admin'
   ├─ Vérifie: isLoggedIn() = true
   ├─ Accès AUTORISÉ ✅
   └─ Affiche: AdminLayout + content

5. Peut voir:
   ├─ Clients ✅
   ├─ Subscribers (les inscrits) ✅
   ├─ Payments ✅
   ├─ Invoices ✅
   ├─ Analytics ✅
   ├─ Projects ✅
   ├─ Messages ✅
   └─ Profile ✅
```

### Scénario 3: Client essaie d'accéder admin

```
1. Client connecté (role: 'user')
   ├─ Essaie: http://localhost:5173/dashboard
   └─ Tape URL directement

2. AdminRoute intercepte
   ├─ Vérifie: isLoggedIn() = true ✅
   ├─ Vérifie: isAdmin() = false ❌
   └─ Redirection: /login

3. Client voit: Login page
   └─ "Access denied" ou redirection
```

---

## 💾 Base de données - Exemple

### Avant inscription

```
users table: VIDE (ou juste admin)

admin_user:
├─ id: 1
├─ email: admin@example.com
├─ password: $2b$10$... (hasher)
├─ name: Administrator
├─ role: 'admin'
└─ created_at: 2025-11-05
```

### Après 1ère inscription

```
users table:

admin_user:
├─ id: 1
├─ email: admin@example.com
├─ role: 'admin'

client_1:
├─ id: 2
├─ email: client1@example.com
├─ role: 'user' ← PAS admin!
└─ name: Jean Client
```

### Après 5 inscriptions

```
users table:

id  │ email                  │ role   │ name
─────┼────────────────────────┼────────┼──────────────
1   │ admin@example.com      │ admin  │ Admin
2   │ client1@example.com    │ user   │ Client 1
3   │ client2@example.com    │ user   │ Client 2
4   │ client3@example.com    │ user   │ Client 3
5   │ client4@example.com    │ user   │ Client 4
6   │ client5@example.com    │ user   │ Client 5
```

**IMPORTANT:** Les clients sont dans la même table mais avec `role: 'user'`

---

## 🔐 Sécurité - Check list

### Frontend (Déjà fait ✅)

- ✅ PrivateRoute protège les routes user
- ✅ AdminRoute protège les routes admin
- ✅ NavbarSecured cache les boutons selon le rôle
- ✅ Validation des credentials
- ✅ Tokens stockés en SessionStorage
- ✅ Rôles vérifiés à chaque navigation

### Backend (À faire)

- ❌ Vérifier JWT token à chaque requête
- ❌ Vérifier le rôle pour chaque endpoint
- ❌ Rejeter les requêtes non-autorisées
- ❌ Logger les accès admin
- ❌ Rate limiting sur les endpoints sensibles

---

## 🎯 Résumé

```
INSCRIPTION CLIENT:
├─ Visiteur clique "S'inscrire"
├─ Remplit formulaire
├─ Créé avec role: 'user'
├─ NE PEUT PAS accéder /dashboard
└─ Peut accéder /profile seulement

ADMIN VOUS:
├─ Vous êtes role: 'admin'
├─ Pouvez accéder /dashboard
├─ Voyez tous les clients inscrits
├─ Gérez les données
└─ Avez l'accès complet

PROTECTION:
├─ AdminRoute ← Vérifie admin
├─ PrivateRoute ← Vérifie connecté
├─ RoleService ← Gère les rôles
└─ Navbar ← Affiche/cache selon rôle
```

---

**Version:** 1.0  
**Date:** Novembre 2025  
**Status:** ✅ Système de rôles implémenté
