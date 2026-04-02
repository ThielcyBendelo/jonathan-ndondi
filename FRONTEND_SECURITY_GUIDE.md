# 🛡️ Guide de Sécurité Frontend - React

## 📚 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Installation](#installation)
3. [Utilisation](#utilisation)
4. [Composants de sécurité](#composants-de-sécurité)
5. [Bonnes pratiques](#bonnes-pratiques)
6. [Checklist de sécurité](#checklist-de-sécurité)

---

## Vue d'ensemble

Ce guide vous aide à sécuriser votre application React contre les attaques courantes :
- **XSS (Cross-Site Scripting)** - Injection de scripts malveillants
- **CSRF (Cross-Site Request Forgery)** - Requêtes non autorisées au nom de l'utilisateur
- **Injection HTML/SQL** - Injection de code malveillant
- **Brute Force** - Attaques par force brute sur les formulaires
- **Clickjacking** - Attaques par clic camouflé

---

## Installation

### 1. DOMPurify (Déjà installé ✓)
```bash
npm install dompurify
```

### 2. Vérifier les fichiers de sécurité créés
- `src/services/securityService.js` - Service de sécurité principal
- `src/hooks/useFormSecurity.js` - Hook pour sécuriser les formulaires
- `src/components/SecureContactForm.jsx` - Exemple de formulaire sécurisé
- `src/utils/cspConfig.js` - Configuration CSP
- `src/utils/secureAPIClient.js` - Client API sécurisé

---

## Utilisation

### 1. Sanitiser du contenu HTML

```jsx
import securityService from '../services/securityService';

// Sanitiser du HTML utilisateur
const cleanHTML = securityService.sanitizeHTML(userContent);

// Sanitiser en texte pur (supprimer toutes les balises)
const cleanText = securityService.sanitizeText(userContent);
```

### 2. Valider les entrées utilisateur

```jsx
// Valider un email
const emailResult = securityService.validateEmail('user@example.com');
if (emailResult.isValid) {
  console.log('Email valide:', emailResult.sanitized);
}

// Valider un téléphone
const phoneResult = securityService.validatePhone('+33612345678');
console.log(phoneResult.sanitized); // Numéro nettoyé

// Valider un texte
const textResult = securityService.validateText(userInput, {
  minLength: 2,
  maxLength: 500,
  required: true,
});

// Valider la force du mot de passe
const pwdResult = securityService.validatePasswordStrength(password);
console.log(pwdResult.strength); // "Très fort", "Fort", "Faible", etc.
```

### 3. Utiliser le hook de sécurité des formulaires

```jsx
import useFormSecurity from '../hooks/useFormSecurity';

function MyForm() {
  const formSchema = {
    email: { type: 'email', required: true },
    name: { type: 'text', minLength: 2, maxLength: 50, required: true },
    message: { type: 'text', minLength: 10, maxLength: 500, required: true },
  };

  const {
    formData,
    errors,
    touched,
    isLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useFormSecurity(formSchema, async (data) => {
    // Les données sont déjà validées et sanitisées
    console.log('Données sécurisées:', data);
    // Envoyer au serveur
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        value={formData.email || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.email && errors.email && (
        <span className="error">{errors.email}</span>
      )}
      <button type="submit" disabled={isLoading}>
        Envoyer
      </button>
    </form>
  );
}
```

### 4. Rate Limiting (Prévention du brute force)

```jsx
import securityService from '../services/securityService';

// Vérifier si l'utilisateur peut effectuer une action
const rateLimit = securityService.checkRateLimit('user-ip-or-id');

if (!rateLimit.allowed) {
  console.log(`Trop de requêtes. Réessayez dans ${rateLimit.retryAfter}s`);
  return;
}

// Continuer l'action
```

### 5. Utiliser le client API sécurisé

```jsx
import secureAPIClient from '../utils/secureAPIClient';

// Initialiser
secureAPIClient.initialize(csrfToken, authToken);

// Effectuer des requêtes
try {
  const response = await secureAPIClient.post('/api/contact', {
    name: 'Jean',
    email: 'jean@example.com',
    message: 'Bonjour',
  });
  
  console.log('✓ Réponse:', response.data);
} catch (error) {
  console.error('❌ Erreur:', error.userMessage);
}
```

### 6. Configurer CSP (Content Security Policy)

Dans `src/main.jsx` :
```jsx
import { applyCSPMeta, setupCSPViolationReporting } from './utils/cspConfig';

// Appliquer la CSP meta tag
applyCSPMeta();

// Logger les violations de CSP
setupCSPViolationReporting();
```

### 7. Exemple complet : Formulaire sécurisé

```jsx
import React from 'react';
import useFormSecurity from '../hooks/useFormSecurity';
import securityService from '../services/securityService';

export function SecureContactForm() {
  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormSecurity(
    {
      name: { type: 'text', minLength: 2, required: true },
      email: { type: 'email', required: true },
      message: { type: 'text', minLength: 10, required: true },
    },
    async (data) => {
      // Les données sont validées et sanitisées
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name || ''}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.name && errors.name && <span>{errors.name}</span>}
      
      {/* Autres champs ... */}
      
      <button type="submit">Envoyer</button>
    </form>
  );
}
```

---

## Composants de sécurité

### `securityService.js`
Le service de sécurité principal contient :
- Sanitisation d'entrées (HTML, texte, emails, téléphones)
- Validation d'emails, URLs, téléphones, mots de passe
- Rate limiting
- Protection contre le brute force
- Validation de fichiers
- Génération de tokens sécurisés

### `useFormSecurity.js`
Hook React pour :
- Gérer l'état d'un formulaire sécurisé
- Valider les champs individuellement
- Gérer les erreurs
- Appliquer le rate limiting
- Sanitiser les entrées automatiquement

### `SecureContactForm.jsx`
Exemple de composant d'un formulaire sécurisé :
- Validation en temps réel
- Affichage des erreurs
- Gestion du chargement
- Sanitisation automatique

### `cspConfig.js`
Configuration Content Security Policy :
- Headers de sécurité pour production/développement
- Génération de meta tags CSP
- Logging des violations de sécurité

### `secureAPIClient.js`
Client API sécurisé :
- Gestion automatique des tokens CSRF
- Headers d'authentification
- Gestion des erreurs
- Timeouts des requêtes

---

## Bonnes pratiques

### ✅ À faire

1. **Toujours valider les entrées utilisateur**
```jsx
const result = securityService.validateEmail(email);
if (!result.isValid) {
  setError(result.error);
  return;
}
```

2. **Sanitiser le contenu HTML**
```jsx
const cleanHTML = securityService.sanitizeHTML(userContent);
return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
```

3. **Utiliser le hook de sécurité pour les formulaires**
```jsx
const { formData, errors, handleSubmit } = useFormSecurity(schema, onSubmit);
```

4. **Activer la CSP**
```jsx
import { applyCSPMeta } from './utils/cspConfig';
applyCSPMeta();
```

5. **Implémenter le rate limiting**
```jsx
const rateLimit = securityService.checkRateLimit('user-id');
if (!rateLimit.allowed) {
  // Bloquer l'action
}
```

### ❌ À éviter

1. **Ne pas utiliser `dangerouslySetInnerHTML` sans sanitisation**
```jsx
// ❌ MAUVAIS
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ BON
const clean = securityService.sanitizeHTML(userContent);
<div dangerouslySetInnerHTML={{ __html: clean }} />
```

2. **Ne pas faire confiance aux données utilisateur**
```jsx
// ❌ MAUVAIS - Pas de validation
const result = await api.post('/api/data', userInput);

// ✅ BON - Validation avant envoi
const validated = securityService.validateText(userInput, schema);
const result = await api.post('/api/data', validated);
```

3. **Ne pas stocker les tokens sensibles en localStorage**
```jsx
// ❌ MAUVAIS
localStorage.setItem('authToken', token);

// ✅ BON - Utiliser sessionStorage ou HttpOnly cookies
sessionStorage.setItem('authToken', token);
```

4. **Ne pas laisser les données sensibles en debug**
```jsx
// ❌ MAUVAIS
console.log('Password:', password);
console.log('CC:', creditCard);

// ✅ BON
if (import.meta.env.DEV) {
  console.log('Form submitted');
}
```

5. **Ne pas ignorer les erreurs de CORS**
```jsx
// ❌ MAUVAIS - Désactiver CORS complètement
fetch(url, { mode: 'no-cors' });

// ✅ BON - Utiliser un proxy ou configurer CORS correctement
```

---

## Checklist de sécurité

### ✅ Frontend Security
- [ ] DOMPurify installé et utilisé
- [ ] `securityService.js` importé et fonctionnel
- [ ] `useFormSecurity` utilisé dans tous les formulaires
- [ ] CSP activée et testée
- [ ] Rate limiting implémenté
- [ ] Validation d'entrées sur tous les champs utilisateur
- [ ] Pas de `dangerouslySetInnerHTML` sans sanitisation
- [ ] Tokens CSRF implémentés

### 🔄 API Security
- [ ] Toutes les requêtes utilisent `secureAPIClient`
- [ ] Headers CSRF et d'authentification ajoutés
- [ ] Timeout des requêtes configuré
- [ ] Gestion des erreurs 401/403
- [ ] CORS configuré correctement côté serveur

### 🔐 Authentication
- [ ] Mots de passe validés côté client (force)
- [ ] Pas de stockage des mots de passe en localStorage
- [ ] Tokens rafraîchis automatiquement
- [ ] Sessions expirées après inactivité
- [ ] Logout sécurisé (suppression des tokens)

### 📦 Dépendances
- [ ] Dépendances à jour (`npm audit`)
- [ ] Pas de packages malveillants
- [ ] Dépendances minimales (réduire la surface d'attaque)

### 🌐 Headers Serveur (Si applicable)
- [ ] Content-Security-Policy
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Strict-Transport-Security
- [ ] Referrer-Policy

---

## 🚀 Configuration pour la Production

### 1. Activer la CSP stricte
```jsx
// src/main.jsx
import { CSPConfig, generateCSPHeader } from './utils/cspConfig';

const cspHeader = generateCSPHeader(CSPConfig.production);
console.log('CSP:', cspHeader);
```

### 2. Configurer le serveur
```
# Nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net;";
```

### 3. Vérifier les vulnérabilités
```bash
npm audit
npm audit fix
```

### 4. Activer le rate limiting côté serveur
```
# Utiliser nginx-limit-req ou similaire
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/m;
limit_req zone=api burst=20 nodelay;
```

---

## 📞 Support & Ressources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

---

**Dernière mise à jour:** `${new Date().toISOString()}`
**Version:** 1.0.0
**Statut:** ✅ Production Ready
