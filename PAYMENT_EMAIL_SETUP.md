# Configuration EmailJS pour les Notifications de Paiement

## 📧 Templates à créer dans EmailJS

Allez sur https://emailjs.com et créez ces templates :

### 1. Template Client Confirmation (ID: `template_client_payment`)

**Sujet:** Confirmation de votre demande de paiement - {{project_name}}

**Contenu HTML:**

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
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
      }
      .info-box {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
      }
      .button {
        background: #007bff;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
        margin: 15px 0;
      }
      .footer {
        background: #f8f9fa;
        padding: 15px;
        text-align: center;
        font-size: 14px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>✅ Demande de Paiement Confirmée</h1>
      <p>Merci {{to_name}} pour votre confiance !</p>
    </div>

    <div class="content">
      <h2>Détails de votre commande</h2>

      <div class="info-box">
        <strong>📋 Projet:</strong> {{project_name}}<br />
        <strong>💰 Montant:</strong> {{amount}} {{currency}}<br />
        <strong>📅 Date:</strong> {{payment_date}} à {{payment_time}}<br />
        <strong>🆔 Commande:</strong> {{order_id}}<br />
        <strong>💳 Type:</strong> {{payment_type}}
      </div>

      <h3>Prochaines étapes :</h3>
      <ol>
        <li>Cliquez sur le lien PayPal reçu pour effectuer le paiement</li>
        <li>Vous recevrez un reçu de paiement après la transaction</li>
        <li>Je vous contacterai sous 24h pour démarrer le projet</li>
      </ol>

      <div style="text-align: center;">
        <a href="{{paypal_link}}" class="button">💳 Payer avec PayPal</a>
      </div>

      <p>
        <strong>Description du projet:</strong><br />
        {{project_description}}
      </p>
    </div>

    <div class="footer">
      <p>
        <strong>{{admin_name}}</strong><br />
        Développeur Web Full-Stack<br />
        📧 {{admin_email}}<br />
        🌐 {{website_url}}
      </p>
      <p><em>Merci de votre confiance !</em></p>
    </div>
  </body>
</html>
```

---

### 2. Template Admin Notification (ID: `template_admin_notification`)

**Sujet:** 🚨 NOUVEAU PAIEMENT - {{project_name}} - {{amount}} {{currency}}

**Contenu HTML:**

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
        max-width: 700px;
        margin: 0 auto;
      }
      .header {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
      }
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin: 20px 0;
      }
      .info-box {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #007bff;
      }
      .urgent {
        border-left-color: #dc3545;
        background: #fff5f5;
      }
      .client-info {
        border-left-color: #28a745;
        background: #f0fff4;
      }
      .payment-info {
        border-left-color: #ffc107;
        background: #fffbf0;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>💰 NOUVELLE DEMANDE DE PAIEMENT</h1>
      <p>Un client vient de demander un devis !</p>
    </div>

    <div class="content">
      <div class="info-box urgent">
        <h2>🚨 ACTION REQUISE</h2>
        <p>
          <strong>Projet:</strong> {{project_name}}<br />
          <strong>Montant:</strong> {{amount}} {{currency}}<br />
          <strong>Type:</strong> {{payment_type}}<br />
          <strong>Date:</strong> {{payment_date}} à {{payment_time}}
        </p>
      </div>

      <div class="info-grid">
        <div class="info-box client-info">
          <h3>👤 Informations Client</h3>
          <strong>Nom:</strong> {{client_name}}<br />
          <strong>Email:</strong> {{client_email}}<br />
          <strong>Téléphone:</strong> {{client_phone}}<br />
        </div>

        <div class="info-box payment-info">
          <h3>💳 Détails Paiement</h3>
          <strong>Montant:</strong> {{amount}} {{currency}}<br />
          <strong>Type:</strong> {{payment_type}}<br />
          <strong>ID Commande:</strong> {{order_id}}<br />
        </div>
      </div>

      <div class="info-box">
        <h3>📋 Description du Projet</h3>
        <p>{{project_description}}</p>
        <p><strong>Timeline:</strong> {{project_timeline}}</p>
      </div>

      <div class="info-box">
        <h3>🔗 Lien PayPal Généré</h3>
        <p><a href="{{paypal_link}}" target="_blank">{{paypal_link}}</a></p>
      </div>

      <div class="info-box">
        <h3>🕐 Métadonnées</h3>
        <p>
          <strong>Timestamp:</strong> {{payment_date}} {{payment_time}}<br />
          <strong>User Agent:</strong> {{user_agent}}
        </p>
      </div>
    </div>
  </body>
</html>
```

---

### 3. Template Payment Receipt (ID: `template_payment_receipt`)

**Sujet:** 🧾 Reçu de Paiement - Facture {{invoice_number}}

**Contenu HTML:**

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
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
        color: white;
        padding: 20px;
        text-align: center;
      }
      .invoice-header {
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
      }
      .content {
        padding: 20px;
      }
      .invoice-details {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .total-box {
        background: #e9ecef;
        padding: 15px;
        border-radius: 8px;
        font-weight: bold;
        text-align: center;
        margin: 20px 0;
      }
      .footer {
        background: #f8f9fa;
        padding: 15px;
        text-align: center;
        font-size: 14px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>🧾 REÇU DE PAIEMENT</h1>
      <p>Facture {{invoice_number}}</p>
    </div>

    <div class="content">
      <div class="invoice-header">
        <div>
          <h3>Facturé à:</h3>
          <p>
            {{to_name}}<br />
            {{to_email}}
          </p>
        </div>
        <div style="text-align: right;">
          <h3>De:</h3>
          <p>
            {{company_name}}<br />
            {{company_email}}<br />
            {{company_website}}
          </p>
        </div>
      </div>

      <div class="invoice-details">
        <h3>Détails de la Facture</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 10px;"><strong>N° Facture:</strong></td>
            <td style="padding: 10px;">{{invoice_number}}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 10px;"><strong>N° Commande:</strong></td>
            <td style="padding: 10px;">{{order_id}}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 10px;"><strong>Date de Paiement:</strong></td>
            <td style="padding: 10px;">{{payment_date}}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <td style="padding: 10px;"><strong>Transaction PayPal:</strong></td>
            <td style="padding: 10px;">{{paypal_transaction_id}}</td>
          </tr>
        </table>
      </div>

      <div class="invoice-details">
        <h3>Détails du Service</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #e9ecef;">
              <th style="padding: 10px; text-align: left;">Description</th>
              <th style="padding: 10px; text-align: right;">Type</th>
              <th style="padding: 10px; text-align: right;">Montant</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #dee2e6;">
              <td style="padding: 10px;">{{project_name}}</td>
              <td style="padding: 10px; text-align: right;">
                {{payment_type}}
              </td>
              <td style="padding: 10px; text-align: right;">
                {{amount}} {{currency}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="text-align: right; margin: 20px 0;">
        <table style="margin-left: auto; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px; text-align: right;">
              <strong>Sous-total:</strong>
            </td>
            <td style="padding: 5px; text-align: right;">
              {{subtotal}} {{currency}}
            </td>
          </tr>
          <tr>
            <td style="padding: 5px; text-align: right;">
              <strong>TVA ({{tax_rate}}%):</strong>
            </td>
            <td style="padding: 5px; text-align: right;">
              {{tax_amount}} {{currency}}
            </td>
          </tr>
          <tr
            style="font-size: 18px; font-weight: bold; border-top: 2px solid #333;"
          >
            <td style="padding: 10px; text-align: right;">
              <strong>TOTAL:</strong>
            </td>
            <td style="padding: 10px; text-align: right;">
              {{total_amount}} {{currency}}
            </td>
          </tr>
        </table>
      </div>

      <div class="invoice-details">
        <h3>💬 Message Personnel</h3>
        <p>{{thank_you_message}}</p>

        <h4>Prochaines étapes:</h4>
        <p>{{next_steps}}</p>
      </div>
    </div>

    <div class="footer">
      <p>
        <strong>{{company_name}}</strong><br />
        📧 {{company_email}} | 🌐 {{company_website}}
      </p>
      <p><em>Merci pour votre confiance ! 🙏</em></p>
    </div>
  </body>
</html>
```

---

## ⚙️ Configuration EmailJS

1. **Service ID actuel:** `service_5n7ogjf`
2. **Public Key actuelle:** `7fC_jWVgGTcXNrQrC`

## 🎯 Fonctionnalités Ajoutées

✅ **Notifications automatiques** - 3 types d'emails  
✅ **Suivi des transactions** - Sauvegarde locale  
✅ **Gestion d'erreurs** - Toast notifications  
✅ **Templates professionnels** - Design responsive  
✅ **Métadonnées complètes** - Tracking avancé

## 🚀 Test du Système

Le système est maintenant prêt ! Quand un client valide un paiement :

1. **Email client** → Confirmation avec lien PayPal
2. **Email admin** → Notification avec tous les détails
3. **Reçu automatique** → Facture professionnelle
4. **Sauvegarde locale** → Pour le dashboard future

**Prochaine étape:** Intégration au dashboard pour le suivi en temps réel !
