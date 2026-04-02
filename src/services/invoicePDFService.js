import jsPDF from 'jspdf';
// eslint-disable-next-line no-unused-vars
import html2canvas from 'html2canvas';

/**
 * Service de génération de factures PDF
 * Crée des factures professionnelles avec templates personnalisés
 */
class InvoicePDFService {
  constructor() {
    this.companyInfo = {
      name: 'Thielcy Bendelo',
      title: 'Développeur Web Full-Stack',
      email: 'thielcybendelo@gmail.com',
      website: window.location.origin,
      address: '', // À compléter si nécessaire
      phone: '+243829054350', // À compléter si nécessaire
      logo: null, // Logo de l'entreprise (base64 ou URL)
    };

    this.defaultSettings = {
      format: 'A4',
      orientation: 'portrait',
      unit: 'mm',
      currency: 'EUR',
      language: 'fr',
      theme: 'professional', // professional, modern, minimal
    };
  }

  /**
   * Génère une facture PDF pour une transaction
   */
  async generateInvoice(transactionData, options = {}) {
    try {
      console.log('📄 Génération facture PDF...', transactionData);

      const settings = { ...this.defaultSettings, ...options };
      const invoiceData = this.prepareInvoiceData(transactionData);

      // Créer le document PDF
      const pdf = new jsPDF(
        settings.orientation,
        settings.unit,
        settings.format
      );

      // Générer le contenu selon le thème
      switch (settings.theme) {
        case 'modern':
          await this.generateModernInvoice(pdf, invoiceData);
          break;
        case 'minimal':
          await this.generateMinimalInvoice(pdf, invoiceData);
          break;
        default:
          await this.generateProfessionalInvoice(pdf, invoiceData);
      }

      return {
        success: true,
        pdf: pdf,
        filename: `facture-${invoiceData.invoiceNumber}.pdf`,
        data: invoiceData,
      };
    } catch (error) {
      console.error('❌ Erreur génération PDF:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Prépare les données de facture
   */
  prepareInvoiceData(transactionData) {
    const now = new Date();
    const invoiceNumber = this.generateInvoiceNumber();

    return {
      // Informations facture
      invoiceNumber: invoiceNumber,
      invoiceDate: now.toLocaleDateString('fr-FR'),
      dueDate: new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString('fr-FR'),

      // Informations client
      clientName: transactionData.clientName || 'Client',
      clientEmail: transactionData.clientEmail,
      clientPhone: transactionData.clientPhone || '',

      // Informations projet
      projectName: transactionData.projectName,
      projectDescription: transactionData.projectDescription || '',
      timeline: transactionData.timeline || '',

      // Informations paiement
      amount: parseFloat(transactionData.amount) || 0,
      currency: transactionData.currency || 'EUR',
      paymentType: transactionData.paymentType || 'full',
      paymentStatus: transactionData.status || 'pending',
      paypalTransactionId: transactionData.paypalTransactionId || '',

      // Calculs
      subtotal: parseFloat(transactionData.amount) || 0,
      taxRate: 0, // 0% pour l'instant
      taxAmount: 0,
      totalAmount: parseFloat(transactionData.amount) || 0,

      // Métadonnées
      transactionId: transactionData.id,
      createdAt: transactionData.timestamp,
      updatedAt: transactionData.updatedAt || transactionData.timestamp,
    };
  }

  /**
   * Génère une facture au style professionnel
   */
  async generateProfessionalInvoice(pdf, invoiceData) {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPos = 20;

    // Couleurs du thème professionnel
    const primaryColor = [102, 126, 234]; // Violet
    const secondaryColor = [107, 114, 128]; // Gris
    const accentColor = [239, 68, 68]; // Rouge pour les montants

    // Header avec dégradé (simulé)
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 40, 'F');

    // Titre FACTURE
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(28);
    pdf.text('FACTURE', 20, 25);

    // Numéro de facture
    pdf.setFontSize(14);
    pdf.text(`N° ${invoiceData.invoiceNumber}`, pageWidth - 60, 25);

    yPos = 60;

    // Informations entreprise (colonne gauche)
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text(this.companyInfo.name, 20, yPos);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);
    pdf.text(this.companyInfo.title, 20, yPos + 6);
    pdf.text(this.companyInfo.email, 20, yPos + 12);
    pdf.text(this.companyInfo.website, 20, yPos + 18);

    // Informations client (colonne droite)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('FACTURÉ À:', pageWidth - 80, yPos);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);
    pdf.text(invoiceData.clientName, pageWidth - 80, yPos + 8);
    pdf.text(invoiceData.clientEmail, pageWidth - 80, yPos + 14);
    if (invoiceData.clientPhone) {
      pdf.text(invoiceData.clientPhone, pageWidth - 80, yPos + 20);
    }

    yPos += 40;

    // Dates et informations (tableau)
    const infoTableY = yPos;
    pdf.setFillColor(248, 250, 252);
    pdf.rect(20, infoTableY, pageWidth - 40, 25, 'F');

    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);

    // En-têtes
    pdf.text('DATE FACTURE', 25, infoTableY + 8);
    pdf.text('DATE ÉCHÉANCE', 70, infoTableY + 8);
    pdf.text('STATUT', 120, infoTableY + 8);
    pdf.text('TYPE PAIEMENT', 150, infoTableY + 8);

    // Valeurs
    pdf.setFont('helvetica', 'normal');
    pdf.text(invoiceData.invoiceDate, 25, infoTableY + 16);
    pdf.text(invoiceData.dueDate, 70, infoTableY + 16);

    // Statut avec couleur
    const statusColor =
      invoiceData.paymentStatus === 'completed' ? [34, 197, 94] : [234, 179, 8]; // Vert ou orange
    pdf.setTextColor(...statusColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text(invoiceData.paymentStatus.toUpperCase(), 120, infoTableY + 16);

    pdf.setTextColor(...secondaryColor);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      this.getPaymentTypeLabel(invoiceData.paymentType),
      150,
      infoTableY + 16
    );

    yPos += 45;

    // Détails du projet
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('DÉTAILS DU SERVICE', 20, yPos);

    yPos += 10;

    // Tableau des services
    const tableHeaders = ['DESCRIPTION', 'TYPE', 'MONTANT'];
    const tableData = [
      [
        invoiceData.projectName,
        this.getPaymentTypeLabel(invoiceData.paymentType),
        `${invoiceData.amount.toFixed(2)} ${this.getCurrencySymbol(
          invoiceData.currency
        )}`,
      ],
    ];

    this.drawTable(pdf, 20, yPos, pageWidth - 40, tableHeaders, tableData);

    yPos += 40;

    // Description du projet (si disponible)
    if (invoiceData.projectDescription) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Description détaillée:', 20, yPos);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...secondaryColor);
      const descLines = pdf.splitTextToSize(
        invoiceData.projectDescription,
        pageWidth - 40
      );
      pdf.text(descLines, 20, yPos + 6);
      yPos += descLines.length * 4 + 10;
    }

    // Calculs financiers (alignés à droite)
    const calcX = pageWidth - 80;
    const calcWidth = 60;

    // Fond pour les calculs
    pdf.setFillColor(248, 250, 252);
    pdf.rect(calcX - 5, yPos, calcWidth + 10, 35, 'F');

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);

    // Sous-total
    pdf.text('Sous-total:', calcX, yPos + 8);
    pdf.text(
      `${invoiceData.subtotal.toFixed(2)} ${this.getCurrencySymbol(
        invoiceData.currency
      )}`,
      calcX + 35,
      yPos + 8
    );

    // TVA
    pdf.text(`TVA (${invoiceData.taxRate}%):`, calcX, yPos + 16);
    pdf.text(
      `${invoiceData.taxAmount.toFixed(2)} ${this.getCurrencySymbol(
        invoiceData.currency
      )}`,
      calcX + 35,
      yPos + 16
    );

    // Total (en gras et couleur accent)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(...accentColor);
    pdf.text('TOTAL:', calcX, yPos + 26);
    pdf.text(
      `${invoiceData.totalAmount.toFixed(2)} ${this.getCurrencySymbol(
        invoiceData.currency
      )}`,
      calcX + 35,
      yPos + 26
    );

    yPos += 50;

    // Informations PayPal (si disponible)
    if (invoiceData.paypalTransactionId) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('TRANSACTION PAYPAL:', 20, yPos);

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...secondaryColor);
      pdf.text(invoiceData.paypalTransactionId, 20, yPos + 6);
      yPos += 15;
    }

    // Footer
    yPos = pageHeight - 30;
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, yPos - 5, pageWidth, 40, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text('Merci pour votre confiance !', 20, yPos + 5);
    pdf.text(
      `Facture générée le ${new Date().toLocaleDateString(
        'fr-FR'
      )} à ${new Date().toLocaleTimeString('fr-FR')}`,
      20,
      yPos + 12
    );

    // Informations de contact dans le footer
    pdf.text(
      `Email: ${this.companyInfo.email} | Site: ${this.companyInfo.website}`,
      20,
      yPos + 19
    );
  }

  /**
   * Génère une facture au style moderne
   */
  async generateModernInvoice(pdf, invoiceData) {
    // Style moderne avec couleurs vives et design épuré
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPos = 30;

    // Couleurs modernes
    const primaryColor = [79, 70, 229]; // Indigo
    const accentColor = [236, 72, 153]; // Pink
    // eslint-disable-next-line no-unused-vars
    const textColor = [31, 41, 55]; // Gray-800

    // Header moderne avec forme géométrique
    pdf.setFillColor(...primaryColor);
    // Créer un triangle avec des lignes (jsPDF n'a pas de méthode triangle directe)
    pdf.setDrawColor(...primaryColor);
    pdf.setLineWidth(0);
    pdf.lines(
      [
        [pageWidth, 0],
        [0, 30],
      ],
      0,
      0,
      [1, 1],
      'F'
    );

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.text('INVOICE', pageWidth - 50, 20);

    // Numéro stylisé
    pdf.setFillColor(...accentColor);
    pdf.roundedRect(20, 40, 60, 15, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text(`#${invoiceData.invoiceNumber}`, 25, 50);

    // eslint-disable-next-line no-unused-vars
    yPos = 70;

    // Le reste du design moderne...
    await this.generateProfessionalInvoice(pdf, invoiceData); // Utiliser la base professionnelle pour l'instant
  }

  /**
   * Génère une facture au style minimal
   */
  async generateMinimalInvoice(pdf, invoiceData) {
    // Style minimal avec beaucoup d'espace blanc
    // eslint-disable-next-line no-unused-vars
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPos = 40;

    // Couleurs minimales
    const textColor = [0, 0, 0];
    const lightGray = [156, 163, 175];

    // Header minimal
    pdf.setTextColor(...textColor);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(32);
    pdf.text('Invoice', 20, yPos);

    pdf.setFontSize(12);
    pdf.setTextColor(...lightGray);
    pdf.text(invoiceData.invoiceNumber, 20, yPos + 8);

    yPos += 30;

    // Le reste du design minimal...
    await this.generateProfessionalInvoice(pdf, invoiceData); // Utiliser la base professionnelle pour l'instant
  }

  /**
   * Dessine un tableau dans le PDF
   */
  drawTable(pdf, x, y, width, headers, data) {
    const colWidth = width / headers.length;
    const rowHeight = 8;

    // En-têtes
    pdf.setFillColor(241, 245, 249);
    pdf.rect(x, y, width, rowHeight, 'F');

    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);

    headers.forEach((header, i) => {
      pdf.text(header, x + i * colWidth + 2, y + 5);
    });

    // Données
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(107, 114, 128);

    data.forEach((row, rowIndex) => {
      const rowY = y + rowHeight + rowIndex * rowHeight;

      row.forEach((cell, colIndex) => {
        pdf.text(String(cell), x + colIndex * colWidth + 2, rowY + 5);
      });
    });

    // Bordures
    pdf.setDrawColor(229, 231, 235);
    pdf.rect(x, y, width, rowHeight + data.length * rowHeight);
  }

  /**
   * Télécharge le PDF généré
   */
  async downloadInvoice(transactionData, options = {}) {
    try {
      const result = await this.generateInvoice(transactionData, options);

      if (result.success) {
        result.pdf.save(result.filename);
        console.log('✅ Facture téléchargée:', result.filename);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Erreur téléchargement facture:', error);
      throw error;
    }
  }

  /**
   * Génère et retourne le PDF en base64
   */
  async getInvoiceBase64(transactionData, options = {}) {
    try {
      const result = await this.generateInvoice(transactionData, options);

      if (result.success) {
        const base64 = result.pdf.output('datauristring');
        return {
          success: true,
          base64: base64,
          filename: result.filename,
          data: result.data,
        };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Erreur génération base64:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Prévisualise la facture dans un nouvel onglet
   */
  async previewInvoice(transactionData, options = {}) {
    try {
      const result = await this.getInvoiceBase64(transactionData, options);

      if (result.success) {
        const newWindow = window.open();
        newWindow.document.write(
          `<iframe src="${result.base64}" width="100%" height="100%" style="border:none;"></iframe>`
        );
        newWindow.document.title = `Prévisualisation - ${result.filename}`;

        console.log('👁️ Facture prévisualisée');
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Erreur prévisualisation:', error);
      throw error;
    }
  }

  /**
   * Utilities
   */
  generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${year}${month}-${timestamp}`;
  }

  getCurrencySymbol(currency) {
    const symbols = { EUR: '€', USD: '$', CAD: 'C$' };
    return symbols[currency] || currency;
  }

  getPaymentTypeLabel(type) {
    const labels = {
      full: 'Paiement complet',
      deposit: 'Acompte',
      installment: 'Paiement échelonné',
    };
    return labels[type] || type;
  }

  /**
   * Met à jour les informations de l'entreprise
   */
  updateCompanyInfo(newInfo) {
    this.companyInfo = { ...this.companyInfo, ...newInfo };
  }

  /**
   * Met à jour les paramètres par défaut
   */
  updateDefaultSettings(newSettings) {
    this.defaultSettings = { ...this.defaultSettings, ...newSettings };
  }

  /**
   * Méthode de test rapide
   */
  async testInvoiceGeneration() {
    console.log('🧪 Test de génération de facture...');

    const testTransaction = {
      id: 'test-' + Date.now(),
      clientName: 'Jean Dupont',
      clientEmail: 'jean.dupont@example.com',
      clientPhone: '0123456789',
      projectName: 'Développement Site Web E-commerce',
      projectDescription:
        "Création d'une boutique en ligne moderne avec React, Node.js et base de données MongoDB. Interface responsive, paiements sécurisés, gestion des stocks.",
      timeline: '6-8 semaines',
      amount: 2500,
      currency: 'EUR',
      paymentType: 'full',
      status: 'completed',
      timestamp: new Date().toISOString(),
      paypalTransactionId:
        'TEST-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    };

    try {
      // Test génération
      const result = await this.generateInvoice(testTransaction);

      if (result.success) {
        console.log('✅ Génération réussie:', result.filename);

        // Test téléchargement
        result.pdf.save(result.filename);
        console.log('✅ Téléchargement lancé');

        // Test prévisualisation
        const base64Result = await this.getInvoiceBase64(testTransaction);
        if (base64Result.success) {
          console.log(
            '✅ Base64 généré:',
            base64Result.base64.substring(0, 50) + '...'
          );
        }

        return {
          success: true,
          message: 'Test complet réussi !',
          details: result,
        };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Erreur lors du test:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Instance singleton
const invoicePDFService = new InvoicePDFService();

// Exposer la fonction de test globalement pour debug
if (typeof window !== 'undefined') {
  window.testInvoicePDF = () => invoicePDFService.testInvoiceGeneration();
  window.invoicePDFService = invoicePDFService;
  console.log('🧪 Service PDF disponible globalement:');
  console.log('- Tapez "testInvoicePDF()" pour tester');
  console.log('- Utilisez "invoicePDFService" pour accès direct');
}

export default invoicePDFService;
