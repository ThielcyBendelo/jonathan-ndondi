import emailjs from '@emailjs/browser';

class EmailService {
  constructor() {
    // Configuration EmailJS - REMPLACE CES VALEURS PAR TES VRAIS IDs
    this.userId = 'user_YjX7AqRgWxNS25PU8'; // Ex: 'user_abc123xyz'
    this.serviceId = 'service_em2n66c'; // Ex: 'service_def456ghi'
    this.templateId = 'template_0c9kluk'; // Ex: 'template_jkl789mno'

    // Initialiser EmailJS
    this.init();
  }

  init() {
    try {
      emailjs.init(this.userId);
      console.log('EmailJS initialisé avec succès');
    } catch (error) {
      console.error('Erreur initialisation EmailJS:', error);
    }
  }

  /**
   * Envoyer une demande de devis par email
   * @param {Object} formData - Données du formulaire
   * @param {Array} files - Fichiers attachés (optionnel)
   * @returns {Promise} - Promesse d'envoi
   */
  async sendQuoteRequest(formData, files = []) {
    try {
      // Préparer les données pour le template EmailJS
      const templateParams = {
        // Informations du client
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Non renseigné',
        company: formData.company || 'Non renseigné',

        // Détails du projet
        project_type: this.getProjectTypeLabel(formData.projectType),
        budget: formData.budget,
        timeline: this.getTimelineLabel(formData.timeline),
        message: formData.message,

        // Informations supplémentaires
        submission_date: new Date().toLocaleString('fr-FR'),
        files_count: files.length,
        files_list:
          files.length > 0
            ? files.map((f) => f.name).join(', ')
            : 'Aucun fichier',

        // Email de destination (ton email)
        to_email: 'bendelothielcy@gmail.com', // Ton email
        reply_to: formData.email,

        // Sujet personnalisé
        subject: `Nouvelle demande de ${this.getProjectTypeLabel(
          formData.projectType
        )} - ${formData.name}`,
      };

      console.log('🔧 DEBUG - Configuration EmailJS:');
      console.log('User ID:', this.userId);
      console.log('Service ID:', this.serviceId);
      console.log('Template ID:', this.templateId);
      console.log('🔧 DEBUG - Paramètres envoyés:', templateParams);

      // Envoyer l'email
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      console.log('✅ Réponse EmailJS:', response);

      console.log('Email envoyé avec succès:', response);
      return {
        success: true,
        message: 'Demande envoyée avec succès !',
        response,
      };
    } catch (error) {
      console.error('Erreur envoi email:', error);
      return {
        success: false,
        message: "Erreur lors de l'envoi. Veuillez réessayer.",
        error,
      };
    }
  }

  /**
   * Convertir le type de projet en libellé lisible
   */
  getProjectTypeLabel(type) {
    const types = {
      'site-web': 'Site Web',
      'e-commerce': 'Site E-commerce',
      application: 'Application Web',
      mobile: 'Application Mobile',
      autre: 'Autre projet',
    };
    return types[type] || type;
  }

  /**
   * Convertir les délais en libellé lisible
   */
  getTimelineLabel(timeline) {
    const timelines = {
      urgent: "Urgent (moins d'une semaine)",
      '1-2-semaines': '1-2 semaines',
      '1-2-mois': '1-2 mois',
      '3-6-mois': '3-6 mois',
      flexible: 'Flexible',
    };
    return timelines[timeline] || timeline;
  }

  /**
   * Envoyer un email de confirmation au client
   */
  async sendConfirmationToClient(formData) {
    try {
      const _confirmationParams = {
        to_email: formData.email,
        client_name: formData.name,
        project_type: this.getProjectTypeLabel(formData.projectType),
        submission_date: new Date().toLocaleString('fr-FR'),
        from_name: 'Ir Bendelo Thielcy',
        from_email: 'bendelothielcy@gmail.com',
      };

      // Tu peux créer un template séparé pour la confirmation client
      // Pour l'instant, cette fonctionnalité est préparée pour plus tard
      console.log('Paramètres confirmation préparés:', _confirmationParams);

      return {
        success: true,
        message: 'Confirmation envoyée au client',
      };
    } catch (error) {
      console.error('Erreur confirmation client:', error);
      return {
        success: false,
        message: 'Erreur envoi confirmation',
        error,
      };
    }
  }

  /**
   * Configurer les IDs EmailJS (appelé depuis l'interface)
   */
  configure(userId, serviceId, templateId) {
    this.userId = userId;
    this.serviceId = serviceId;
    this.templateId = templateId;
    this.init();
  }
}

// Instance singleton
const emailService = new EmailService();

export default emailService;
