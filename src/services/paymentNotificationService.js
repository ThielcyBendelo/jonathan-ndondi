import emailjs from '@emailjs/browser';

/**
 * Service de notification de paiement
 * Gère les emails automatiques après validation PayPal
 */
class PaymentNotificationService {
  constructor() {
    this.serviceId = 'service_5n7ogjf';
    this.publicKey = '7fC_jWVgGTcXNrQrC';

    // Templates EmailJS
    this.templates = {
      clientConfirmation: 'template_client_payment', // Template pour le client
      adminNotification: 'template_admin_notification', // Template pour vous
      paymentReceipt: 'template_payment_receipt', // Template reçu de paiement
    };

    // Initialiser EmailJS
    emailjs.init(this.publicKey);
  }

  /**
   * Envoie confirmation de paiement au client
   */
  async sendClientConfirmation(paymentData) {
    try {
      const templateParams = {
        to_name: paymentData.clientName || 'Client',
        to_email: paymentData.clientEmail,
        project_name: paymentData.projectName,
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_type: paymentData.paymentType,
        paypal_link: paymentData.paypalLink,
        project_description: paymentData.projectDescription || '',
        payment_date: new Date().toLocaleDateString('fr-FR'),
        payment_time: new Date().toLocaleTimeString('fr-FR'),
        order_id: this.generateOrderId(),
        // Informations de contact
        admin_name: 'Thiélcy Bendelo',
        admin_email: 'thielsybendelo@gmail.com',
        website_url: window.location.origin,
      };

      const result = await emailjs.send(
        this.serviceId,
        this.templates.clientConfirmation,
        templateParams
      );

      console.log('✅ Email client envoyé:', result.status);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Erreur envoi email client:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Envoie notification à l'admin (vous)
   */
  async sendAdminNotification(paymentData) {
    try {
      const templateParams = {
        // Informations du client
        client_name: paymentData.clientName || 'Client non spécifié',
        client_email: paymentData.clientEmail,
        client_phone: paymentData.clientPhone || 'Non fourni',

        // Détails du projet
        project_name: paymentData.projectName,
        project_description: paymentData.projectDescription || 'Non spécifié',
        project_timeline: paymentData.timeline || 'Non spécifié',

        // Détails du paiement
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_type: paymentData.paymentType,
        paypal_link: paymentData.paypalLink,

        // Métadonnées
        payment_date: new Date().toLocaleDateString('fr-FR'),
        payment_time: new Date().toLocaleTimeString('fr-FR'),
        order_id: this.generateOrderId(),
        user_agent: navigator.userAgent,

        // Votre email (destinataire)
        to_email: 'thielsybendelo@gmail.com',
      };

      const result = await emailjs.send(
        this.serviceId,
        this.templates.adminNotification,
        templateParams
      );

      console.log('✅ Email admin envoyé:', result.status);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Erreur envoi email admin:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Envoie un reçu de paiement détaillé
   */
  async sendPaymentReceipt(paymentData, paypalTransactionId = null) {
    try {
      const templateParams = {
        to_name: paymentData.clientName || 'Client',
        to_email: paymentData.clientEmail,

        // Informations facture
        invoice_number: this.generateInvoiceNumber(),
        order_id: this.generateOrderId(),
        payment_date: new Date().toLocaleDateString('fr-FR'),

        // Détails du paiement
        project_name: paymentData.projectName,
        amount: paymentData.amount,
        currency: paymentData.currency,
        payment_type: paymentData.paymentType,
        paypal_transaction_id: paypalTransactionId || 'En attente',

        // Calculs financiers
        subtotal: paymentData.amount,
        tax_rate: '0', // Pas de TVA pour l'instant
        tax_amount: '0',
        total_amount: paymentData.amount,

        // Informations entreprise
        company_name: 'Thiélcy Bendelo - Développeur Web',
        company_email: 'thielsybendelo@gmail.com',
        company_website: window.location.origin,

        // Messages personnalisés
        thank_you_message:
          'Merci pour votre confiance ! Votre projet sera traité avec le plus grand soin.',
        next_steps: this.getNextStepsMessage(paymentData.paymentType),
      };

      const result = await emailjs.send(
        this.serviceId,
        this.templates.paymentReceipt,
        templateParams
      );

      console.log('✅ Reçu de paiement envoyé:', result.status);
      return { success: true, data: result };
    } catch (error) {
      console.error('❌ Erreur envoi reçu:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Envoie toutes les notifications en une fois
   */
  async sendAllNotifications(paymentData) {
    console.log('📧 Envoi des notifications de paiement...');

    const results = {
      clientConfirmation: null,
      adminNotification: null,
      paymentReceipt: null,
    };

    try {
      // Envoi en parallèle pour plus de rapidité
      const [clientResult, adminResult, receiptResult] = await Promise.all([
        this.sendClientConfirmation(paymentData),
        this.sendAdminNotification(paymentData),
        this.sendPaymentReceipt(paymentData),
      ]);

      results.clientConfirmation = clientResult;
      results.adminNotification = adminResult;
      results.paymentReceipt = receiptResult;

      // Vérifier si tous les envois ont réussi
      const allSuccess = Object.values(results).every(
        (result) => result.success
      );

      if (allSuccess) {
        console.log('✅ Toutes les notifications envoyées avec succès');
        return { success: true, results };
      } else {
        console.warn('⚠️ Certaines notifications ont échoué');
        return { success: false, results };
      }
    } catch (error) {
      console.error('❌ Erreur globale envoi notifications:', error);
      return { success: false, error: error.message, results };
    }
  }

  /**
   * Génère un ID de commande unique
   */
  generateOrderId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Génère un numéro de facture
   */
  generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${year}${month}-${timestamp}`;
  }

  /**
   * Retourne les prochaines étapes selon le type de paiement
   */
  getNextStepsMessage(paymentType) {
    switch (paymentType) {
      case 'full':
        return 'Votre projet va maintenant commencer ! Vous recevrez un email de confirmation sous 24h avec le planning détaillé.';
      case 'deposit':
        return 'Merci pour votre acompte ! Le développement va commencer. Le solde sera demandé à la livraison du projet.';
      case 'installment':
        return 'Première échéance reçue ! Vous recevrez les détails du planning de paiement par email.';
      default:
        return 'Merci pour votre paiement ! Vous recevrez prochainement les détails de votre projet.';
    }
  }

  /**
   * Sauvegarde locale de la transaction pour suivi
   */
  saveTransactionLocally(paymentData) {
    try {
      const transactions = JSON.parse(
        localStorage.getItem('payment_transactions') || '[]'
      );
      const transaction = {
        id: this.generateOrderId(),
        ...paymentData,
        timestamp: new Date().toISOString(),
        status: 'pending', // pending, completed, failed
      };

      transactions.push(transaction);
      localStorage.setItem(
        'payment_transactions',
        JSON.stringify(transactions)
      );

      console.log('💾 Transaction sauvegardée localement');
      return transaction;
    } catch (error) {
      console.error('❌ Erreur sauvegarde locale:', error);
      return null;
    }
  }
}

// Instance singleton
const paymentNotificationService = new PaymentNotificationService();
export default paymentNotificationService;
