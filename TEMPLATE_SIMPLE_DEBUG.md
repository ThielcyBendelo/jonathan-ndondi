# Template EmailJS Simplifié (pour test)

## 📧 **SUJET (Subject)**

```
Nouvelle demande de {{project_type}} - {{from_name}}
```

## 📋 **CONTENU (Content) - Version Simple**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background: #f5f5f5;
      }
      .container {
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        background: #667eea;
        color: white;
        padding: 20px;
        text-align: center;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      .section {
        margin-bottom: 20px;
        padding: 15px;
        border-left: 4px solid #667eea;
        background: #f9f9f9;
      }
      .label {
        font-weight: bold;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Nouvelle Demande de Devis</h1>
        <p>Reçue le {{submission_date}}</p>
      </div>

      <div class="section">
        <h3>👤 Client</h3>
        <p><span class="label">Nom:</span> {{from_name}}</p>
        <p><span class="label">Email:</span> {{from_email}}</p>
        <p><span class="label">Téléphone:</span> {{phone}}</p>
        <p><span class="label">Entreprise:</span> {{company}}</p>
      </div>

      <div class="section">
        <h3>🚀 Projet</h3>
        <p><span class="label">Type:</span> {{project_type}}</p>
        <p><span class="label">Budget:</span> {{budget}}</p>
        <p><span class="label">Délais:</span> {{timeline}}</p>
        <p><span class="label">Fichiers:</span> {{files_count}}</p>
      </div>

      <div class="section">
        <h3>📝 Description</h3>
        <p>{{message}}</p>
      </div>

      <div class="section">
        <h3>📧 Répondre</h3>
        <p>
          <a
            href="mailto:{{from_email}}"
            style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;"
            >Répondre au client</a
          >
        </p>
      </div>
    </div>
  </body>
</html>
```

---

## 🔄 **Étapes de résolution :**

### **Étape 1: Essayer le template simplifié**

1. Va sur **EmailJS** → **Email Templates**
2. **Supprime** l'ancien template qui n'a pas marché
3. **Crée un nouveau template**
4. Utilise le **template simplifié** ci-dessus
5. **Sauvegarde** et teste

### **Étape 2: Causes possibles du problème**

- **Code HTML trop complexe** (EmailJS a des limites)
- **Variables non reconnues** (vérifier la syntaxe {{variable}})
- **Caractères spéciaux** dans le code
- **Timeout de connexion** pendant la sauvegarde

### **Étape 3: Test rapide**

Une fois le template simplifié créé :

1. **Note le nouveau Template ID**
2. **Met à jour** `emailService.js` avec ce nouvel ID
3. **Teste** l'envoi depuis ton site

## 💡 **Template minimal pour débugger**

Si même le simplifié ne marche pas, essaie ce template ultra-basique :

**Subject:** `Devis {{from_name}}`

**Content:**

```
Nouvelle demande reçue !

Nom: {{from_name}}
Email: {{from_email}}
Projet: {{project_type}}
Budget: {{budget}}
Message: {{message}}

Reçu le: {{submission_date}}
```

Dis-moi ce qui se passe avec le template simplifié ! 🎯
