// Service de validation pour les formulaires
// Contient toutes les règles de validation et utilitaires

class ValidationService {
  // Règles de validation par champ
  validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
      message:
        'Le nom doit contenir entre 2 et 50 caractères (lettres uniquement)',
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Veuillez entrer une adresse email valide',
    },
    phone: {
      required: false,
      pattern: /^(?:\+33|0)[1-9](?:[0-9]{8})$/,
      message: 'Format: 0123456789 ou +33123456789',
    },
    company: {
      required: false,
      maxLength: 100,
      message: "Le nom de l'entreprise ne peut dépasser 100 caractères",
    },
    projectType: {
      required: true,
      options: ['site-web', 'e-commerce', 'application', 'mobile', 'autre'],
      message: 'Veuillez sélectionner un type de projet',
    },
    budget: {
      required: true,
      options: ['500-1000', '1000-5000', '5000-10000', '10000+'],
      message: 'Veuillez sélectionner une fourchette de budget',
    },
    timeline: {
      required: true,
      options: ['urgent', '1-2-semaines', '1-2-mois', '3-6-mois', 'flexible'],
      message: 'Veuillez indiquer les délais souhaités',
    },
    message: {
      required: true,
      minLength: 20,
      maxLength: 1000,
      message: 'La description doit contenir entre 20 et 1000 caractères',
    },
    files: {
      required: false,
      maxSize: 5 * 1024 * 1024, // 5MB par fichier
      allowedTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      maxFiles: 5,
      message:
        'Fichiers autorisés: images, PDF, documents Word (max 5MB chacun, 5 fichiers max)',
    },
  };

  // Messages d'erreur personnalisés
  errorMessages = {
    required: 'Ce champ est obligatoire',
    minLength: (min) => `Minimum ${min} caractères requis`,
    maxLength: (max) => `Maximum ${max} caractères autorisés`,
    pattern: 'Format invalide',
    fileSize: 'Fichier trop volumineux (max 5MB)',
    fileType: 'Type de fichier non autorisé',
    maxFiles: 'Maximum 5 fichiers autorisés',
  };

  // Valider un champ spécifique
  validateField(fieldName, value, files = null) {
    const rules = this.validationRules[fieldName];
    if (!rules) return { isValid: true, error: null };

    const errors = [];

    // Validation required
    if (
      rules.required &&
      (!value || (typeof value === 'string' && value.trim() === ''))
    ) {
      return { isValid: false, error: this.errorMessages.required };
    }

    // Si le champ n'est pas requis et est vide, pas d'autres validations
    if (!rules.required && (!value || value.trim() === '')) {
      return { isValid: true, error: null };
    }

    // Validation minLength
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(this.errorMessages.minLength(rules.minLength));
    }

    // Validation maxLength
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(this.errorMessages.maxLength(rules.maxLength));
    }

    // Validation pattern
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.message || this.errorMessages.pattern);
    }

    // Validation options (select)
    if (rules.options && !rules.options.includes(value)) {
      errors.push(rules.message);
    }

    // Validation fichiers
    if (fieldName === 'files' && files && files.length > 0) {
      const fileValidation = this.validateFiles(files);
      if (!fileValidation.isValid) {
        errors.push(...fileValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      error: errors.length > 0 ? errors[0] : null,
      errors: errors,
    };
  }

  // Valider des fichiers
  validateFiles(files) {
    const rules = this.validationRules.files;
    const errors = [];

    // Vérifier le nombre de fichiers
    if (files.length > rules.maxFiles) {
      errors.push(this.errorMessages.maxFiles);
      return { isValid: false, errors };
    }

    // Valider chaque fichier
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Vérifier la taille
      if (file.size > rules.maxSize) {
        errors.push(`${file.name}: ${this.errorMessages.fileSize}`);
        continue;
      }

      // Vérifier le type
      if (!rules.allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: ${this.errorMessages.fileType}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Valider un objet complet (toutes les étapes)
  validateForm(formData, files = null) {
    const results = {};
    let isFormValid = true;

    // Valider chaque champ
    Object.keys(this.validationRules).forEach((fieldName) => {
      if (fieldName === 'files') {
        results[fieldName] = this.validateField(fieldName, null, files);
      } else {
        results[fieldName] = this.validateField(fieldName, formData[fieldName]);
      }

      if (!results[fieldName].isValid) {
        isFormValid = false;
      }
    });

    return {
      isValid: isFormValid,
      fieldResults: results,
      errors: Object.keys(results)
        .filter((field) => !results[field].isValid)
        .map((field) => `${field}: ${results[field].error}`),
    };
  }

  // Valider une étape spécifique
  validateStep(stepNumber, formData, files = null) {
    const stepFields = this.getStepFields(stepNumber);
    const results = {};
    let isStepValid = true;

    stepFields.forEach((fieldName) => {
      if (fieldName === 'files') {
        results[fieldName] = this.validateField(fieldName, null, files);
      } else {
        results[fieldName] = this.validateField(fieldName, formData[fieldName]);
      }

      if (!results[fieldName].isValid) {
        isStepValid = false;
      }
    });

    return {
      isValid: isStepValid,
      fieldResults: results,
    };
  }

  // Obtenir les champs pour une étape donnée
  getStepFields(stepNumber) {
    const stepFieldsMap = {
      1: ['name', 'email', 'phone'], // Informations personnelles
      2: ['company', 'projectType', 'budget', 'timeline'], // Projet
      3: ['message'], // Description
      4: ['files'], // Fichiers (optionnel)
    };

    return stepFieldsMap[stepNumber] || [];
  }

  // Calculer le score de completude du formulaire (en %)
  getCompletionScore(formData, files = null) {
    const totalFields = Object.keys(this.validationRules).length;
    let completedFields = 0;

    Object.keys(this.validationRules).forEach((fieldName) => {
      const value = fieldName === 'files' ? files : formData[fieldName];

      if (fieldName === 'files') {
        // Les fichiers sont optionnels, on compte comme complet s'il n'y en a pas
        completedFields++;
      } else if (value && value.toString().trim() !== '') {
        completedFields++;
      }
    });

    return Math.round((completedFields / totalFields) * 100);
  }

  // Suggestions d'amélioration
  getImprovementSuggestions(formData, files = null) {
    const suggestions = [];
    const validation = this.validateForm(formData, files);

    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        suggestions.push(`Corrigez: ${error}`);
      });
    }

    // Suggestions pour améliorer la qualité
    if (formData.message && formData.message.length < 50) {
      suggestions.push('Ajoutez plus de détails dans la description du projet');
    }

    if (!formData.phone || formData.phone.trim() === '') {
      suggestions.push(
        'Ajoutez votre numéro de téléphone pour un contact plus rapide'
      );
    }

    if (!formData.company || formData.company.trim() === '') {
      suggestions.push('Indiquez votre entreprise si applicable');
    }

    if (!files || files.length === 0) {
      suggestions.push(
        'Ajoutez des documents (brief, maquettes) pour enrichir votre demande'
      );
    }

    return suggestions;
  }

  // Formatage de données avant soumission
  formatFormData(formData, files = null) {
    const formatted = { ...formData };

    // Nettoyer les chaînes
    Object.keys(formatted).forEach((key) => {
      if (typeof formatted[key] === 'string') {
        formatted[key] = formatted[key].trim();
      }
    });

    // Formater le téléphone
    if (formatted.phone) {
      formatted.phone = formatted.phone.replace(/\s+/g, '');
    }

    // Ajouter métadonnées
    formatted.submittedAt = new Date().toISOString();
    formatted.completionScore = this.getCompletionScore(formData, files);

    if (files && files.length > 0) {
      formatted.hasAttachments = true;
      formatted.attachmentCount = files.length;
      formatted.attachmentNames = Array.from(files).map((f) => f.name);
    }

    return formatted;
  }

  // Validation en temps réel (debounced)
  createRealTimeValidator(callback, delay = 300) {
    let timeoutId;
    return (fieldName, value, files = null) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const result = this.validateField(fieldName, value, files);
        callback(fieldName, result);
      }, delay);
    };
  }
}

export default new ValidationService();
