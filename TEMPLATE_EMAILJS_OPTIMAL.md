# Template EmailJS Optimal pour Demandes de Devis

## 📧 **SUJET DE L'EMAIL**

```text
🚀 Nouvelle demande {{project_type}} - {{from_name}} ({{budget}})
```

**Pourquoi ce sujet ?**

- 🚀 Émoji accrocheur pour se démarquer
- Type de projet immédiatement visible
- Nom du client pour personnalisation
- Budget entre parenthèses pour priorité

---

## 📋 **CONTENU HTML DU TEMPLATE**

Copie ce code HTML dans ton template EmailJS :

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        background: #f4f4f4;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 30px;
      }
      .section {
        margin-bottom: 25px;
      }
      .section h2 {
        color: #667eea;
        font-size: 18px;
        margin-bottom: 10px;
        border-bottom: 2px solid #667eea;
        padding-bottom: 5px;
      }
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 15px;
      }
      .info-item {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #667eea;
      }
      .info-label {
        font-weight: bold;
        color: #555;
        font-size: 12px;
        text-transform: uppercase;
      }
      .info-value {
        font-size: 16px;
        color: #333;
        margin-top: 5px;
      }
      .message-box {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #28a745;
      }
      .priority {
        background: #fff3cd;
        border-left: 4px solid #ffc107;
      }
      .priority.high {
        background: #f8d7da;
        border-left-color: #dc3545;
      }
      .footer {
        background: #f8f9fa;
        padding: 20px;
        text-align: center;
        color: #666;
        font-size: 14px;
      }
      .button {
        display: inline-block;
        background: #667eea;
        color: white;
        padding: 12px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin: 10px 5px;
      }
      @media (max-width: 600px) {
        .info-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>🚀 Nouvelle Demande de Devis</h1>
        <p>{{submission_date}}</p>
      </div>

      <div class="content">
        <!-- Informations Client -->
        <div class="section">
          <h2>👤 Informations Client</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Nom Complet</div>
              <div class="info-value">{{from_name}}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">{{from_email}}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Téléphone</div>
              <div class="info-value">{{phone}}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Entreprise</div>
              <div class="info-value">{{company}}</div>
            </div>
          </div>
        </div>

        <!-- Détails du Projet -->
        <div class="section">
          <h2>🚀 Détails du Projet</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Type de Projet</div>
              <div class="info-value">{{project_type}}</div>
            </div>
            <div
              class="info-item {{#if budget}}{{#contains budget 'urgent'}}priority high{{/contains}}{{#contains budget '10000'}}priority{{/contains}}{{/if}}"
            >
              <div class="info-label">Budget Estimé</div>
              <div class="info-value">{{budget}}</div>
            </div>
            <div
              class="info-item {{#if timeline}}{{#contains timeline 'urgent'}}priority high{{/contains}}{{/if}}"
            >
              <div class="info-label">Délais Souhaités</div>
              <div class="info-value">{{timeline}}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Fichiers Joints</div>
              <div class="info-value">{{files_count}} fichier(s)</div>
            </div>
          </div>
        </div>

        <!-- Description du Projet -->
        <div class="section">
          <h2>📝 Description du Projet</h2>
          <div class="message-box">
            <p style="margin: 0; white-space: pre-line;">{{message}}</p>
          </div>
        </div>

        <!-- Fichiers -->
        {{#if files_list}}
        <div class="section">
          <h2>📎 Fichiers Joints</h2>
          <div class="info-item">
            <div class="info-value">{{files_list}}</div>
          </div>
        </div>
        {{/if}}

        <!-- Actions Rapides -->
        <div class="section" style="text-align: center;">
          <h2>⚡ Actions Rapides</h2>
          <a
            href="mailto:{{from_email}}?subject=RE: Votre demande de {{project_type}}&body=Bonjour {{from_name}},%0D%0A%0D%0AJe vous remercie pour votre demande de devis concernant votre projet {{project_type}}.%0D%0A%0D%0ACordialement,%0D%0AIr Bendelo Thielcy"
            class="button"
          >
            📧 Répondre au Client
          </a>
          <a href="tel:{{phone}}" class="button"> 📞 Appeler </a>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p><strong>Ir Bendelo Thielcy</strong> - Développeur Web Full Stack</p>
        <p>📧 bendelothielcy@gmail.com | 📱 {{phone}}</p>
        <p>Cette demande a été reçue le {{submission_date}}</p>
      </div>
    </div>
  </body>
</html>
```

---

## 🎯 **FONCTIONNALITÉS DU TEMPLATE**

✅ **Design professionnel** avec CSS moderne
✅ **Responsive** (s'adapte mobile/desktop)  
✅ **Priorités visuelles** (urgent = rouge, gros budget = jaune)
✅ **Boutons d'action** (répondre, appeler)
✅ **Informations structurées** en sections claires
✅ **Support des fichiers joints**
✅ **Branding personnel** (tes couleurs/nom)

---

## 📱 **RENDU FINAL**

L'email aura :

- **Header violet** avec gradient et date
- **Sections organisées** : Client, Projet, Description, Fichiers
- **Codes couleur** : Urgent (rouge), Gros budget (jaune)
- **Boutons cliquables** pour répondre/appeler directement
- **Footer professionnel** avec tes coordonnées

Veux-tu qu'on teste ce template ou l'adapter à tes préférences ?
