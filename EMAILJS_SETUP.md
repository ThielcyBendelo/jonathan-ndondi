# Configuration EmailJS - Guide Étape par Étape

## 📧 Étape 1: Créer un compte EmailJS

1. Va sur https://www.emailjs.com/
2. Clique sur "Sign Up"
3. Crée ton compte avec ton email `bendelothielcy@gmail.com`

## 📨 Étape 2: Configurer un Service Email

1. Une fois connecté, va dans "Email Services"
2. Clique sur "Add New Service"
3. Choisis "Gmail" (ou ton fournisseur d'email)
4. Connecte ton compte Gmail `bendelothielcy@gmail.com`
5. Note le **Service ID** généré (ex: `service_xyz123`)

## 📋 Étape 3: Créer un Template d'Email

1. Va dans "Email Templates"
2. Clique sur "Create New Template"
3. Utilise ce template pour recevoir les demandes de devis :

**Sujet :** `Nouvelle demande de {{project_type}} - {{from_name}}`

**Contenu :**

```
Nouvelle demande de devis reçue !

👤 INFORMATIONS CLIENT
--------------------------------
Nom: {{from_name}}
Email: {{from_email}}
Téléphone: {{phone}}
Entreprise: {{company}}

🚀 DÉTAILS DU PROJET
--------------------------------
Type: {{project_type}}
Budget: {{budget}}
Délais: {{timeline}}

📄 DESCRIPTION
--------------------------------
{{message}}

📎 FICHIERS JOINTS
--------------------------------
Nombre: {{files_count}}
Fichiers: {{files_list}}

⏰ REÇU LE
--------------------------------
{{submission_date}}

---
Pour répondre au client, utilisez: {{reply_to}}
```

4. Note le **Template ID** généré (ex: `template_abc456`)

## 🔑 Étape 4: Récupérer tes identifiants

1. Va dans "Integration"
2. Note ton **User ID** (ex: `user_def789`)

## ⚙️ Étape 5: Configurer le projet

Modifie le fichier `src/services/emailService.js` en remplaçant :

```javascript
this.userId = 'TON_USER_ID_ICI';
this.serviceId = 'TON_SERVICE_ID_ICI';
this.templateId = 'TON_TEMPLATE_ID_ICI';
```

## 🎯 Exemple de configuration finale :

```javascript
this.userId = 'user_def789';
this.serviceId = 'service_xyz123';
this.templateId = 'template_abc456';
```

## ✅ Étape 6: Tester

1. Lance ton site : `npm run dev`
2. Va dans Services → Demander un devis
3. Remplis le formulaire et envoie
4. Vérifie ton email `bendelothielcy@gmail.com`

## 📊 Avantages :

✅ Gratuit jusqu'à 200 emails/mois
✅ Tu reçois toutes les demandes dans ta boîte email
✅ Le client reçoit une confirmation automatique
✅ Toutes les informations du formulaire incluses
✅ Pas besoin de serveur backend

## 🚨 En cas de problème :

- Vérifie que les IDs sont corrects
- Regarde la console du navigateur pour les erreurs
- Assure-toi que Gmail autorise les "applications moins sécurisées"
- Teste d'abord avec le compte EmailJS de test

---

Une fois configuré, chaque demande de devis arrivera directement dans ton email ! 🎉
