# Template EmailJS pour Compte Gratuit

## ✅ **TEMPLATE GARANTI COMPATIBLE GRATUIT**

### **Subject (Sujet):**

```
Devis de {{from_name}}
```

### **Content (Contenu) - Version texte simple:**

```
Bonjour,

Vous avez reçu une nouvelle demande de devis.

INFORMATIONS CLIENT:
- Nom: {{from_name}}
- Email: {{from_email}}
- Téléphone: {{phone}}
- Entreprise: {{company}}

PROJET:
- Type: {{project_type}}
- Budget: {{budget}}
- Délais: {{timeline}}

MESSAGE:
{{message}}

---
Demande reçue le: {{submission_date}}
Nombre de fichiers: {{files_count}}

Pour répondre, utilisez: {{from_email}}
```

## 🎯 **Instructions pour compte gratuit:**

1. **Crée un nouveau template** sur EmailJS
2. **Colle exactement** le sujet et contenu ci-dessus
3. **Sauvegarde** (devrait marcher maintenant)
4. **Note le Template ID**
5. **Teste** avec ton site

## 💡 **Si ça ne marche toujours pas:**

**Option A: Utiliser le template par défaut EmailJS**

- Sélectionne "Default Template"
- Modifie juste les variables nécessaires

**Option B: Upgrade temporaire gratuit**

- EmailJS offre parfois des upgrades gratuits pour tester
- Regarde dans Account > Billing

**Option C: Alternative sans template custom**

- Utilise juste les variables de base : {{from_name}}, {{from_email}}, {{message}}

## 🧪 **Test rapide:**

Une fois le template simple créé, teste avec:

```bash
npm run dev
# Va sur Services > Demander un devis
# Remplis et envoie
```

Essaie ce template ultra-simple et dis-moi si ça se sauvegarde ! 🎯
