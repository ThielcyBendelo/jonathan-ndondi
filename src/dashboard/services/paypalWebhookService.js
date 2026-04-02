/**
 * Service de gestion des webhooks et retours PayPal
 * Gère les confirmations automatiques de paiement
 */
class PayPalWebhookService {
  constructor() {
    this.webhookEndpoint = '/api/paypal-webhook';
    this.returnUrls = {
      success: `${window.location.origin}?payment=success`,
      cancel: `${window.location.origin}?payment=cancelled`,
    };
    this.initializeService();
  }

  /**
   * Initialise le service de webhook
   */
  initializeService() {
    // Vérifier les paramètres d'URL au chargement de la page
    this.checkReturnParameters();

    // Écouter les changements d'URL (pour les SPAs)
    window.addEventListener('popstate', () => {
      this.checkReturnParameters();
    });

    // Vérifier les paramètres périodiquement (au cas où)
    setInterval(() => {
      this.checkReturnParameters();
    }, 5000);
  }

  /**
   * Vérifie les paramètres de retour PayPal dans l'URL
   */
  checkReturnParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const paypalTransactionId = urlParams.get('tx') || urlParams.get('txn_id');
    const payerId = urlParams.get('PayerID');
    const amount = urlParams.get('amt') || urlParams.get('mc_gross');
    const currency = urlParams.get('cc') || urlParams.get('mc_currency');
    const custom = urlParams.get('custom');

    if (paymentStatus) {
      this.handlePaymentReturn(paymentStatus, {
        transactionId: paypalTransactionId,
        payerId: payerId,
        amount: amount,
        currency: currency,
        custom: custom,
      });

      // Nettoyer l'URL après traitement
      this.cleanUrl();
    }
  }

  /**
   * Gère le retour de PayPal
   */
  async handlePaymentReturn(status, paymentData) {
    console.log('🔔 Retour PayPal détecté:', status, paymentData);

    try {
      if (status === 'success') {
        await this.handleSuccessfulPayment(paymentData);
      } else if (status === 'cancelled') {
        await this.handleCancelledPayment(paymentData);
      }
    } catch (error) {
      console.error('❌ Erreur traitement retour PayPal:', error);
    }
  }

  /**
   * Traite un paiement réussi
   */
  async handleSuccessfulPayment(paymentData) {
    try {
      // Parser les données custom si disponibles
      let customData = {};
      if (paymentData.custom) {
        try {
          customData = JSON.parse(paymentData.custom);
        } catch (e) {
          console.warn('Impossible de parser les données custom:', e);
        }
      }

      // Importer dynamiquement le service de gestion (éviter les imports circulaires)
      const { default: paymentManagementService } = await import(
        './paymentManagementService.js'
      );
      const { default: paymentNotificationService } = await import(
        '../../services/paymentNotificationService.js'
      );
      const { default: invoicePDFService } = await import(
        '../../services/invoicePDFService.js'
      );

      // Rechercher la transaction correspondante
      const allTransactions = paymentManagementService.getAllTransactions();
      let matchingTransaction = null;

      // Essayer de trouver par email client et timestamp récent
      if (customData.client_email) {
        matchingTransaction = allTransactions.find(
          (t) =>
            t.clientEmail === customData.client_email &&
            t.status === 'pending' &&
            // Transaction créée dans les dernières 2 heures
            Date.now() - new Date(t.timestamp).getTime() < 2 * 60 * 60 * 1000
        );
      }

      // Sinon, prendre la transaction pending la plus récente
      if (!matchingTransaction) {
        matchingTransaction = allTransactions
          .filter((t) => t.status === 'pending')
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      }

      if (matchingTransaction) {
        // Mettre à jour le statut de la transaction
        const updateSuccess = paymentManagementService.updateTransactionStatus(
          matchingTransaction.id,
          'completed',
          paymentData.transactionId
        );

        if (updateSuccess) {
          // Envoyer un reçu de paiement
          const receiptResult =
            await paymentNotificationService.sendPaymentReceipt(
              {
                ...matchingTransaction,
                paypalTransactionId: paymentData.transactionId,
              },
              paymentData.transactionId
            );

          // Générer automatiquement la facture PDF
          try {
            const invoiceResult = await invoicePDFService.getInvoiceBase64({
              ...matchingTransaction,
              paypalTransactionId: paymentData.transactionId,
              status: 'completed',
            });

            if (invoiceResult.success) {
              // Stocker la facture générée dans la transaction
              paymentManagementService.updateTransaction(
                matchingTransaction.id,
                {
                  invoice: {
                    filename: invoiceResult.filename,
                    generatedAt: new Date().toISOString(),
                    base64: invoiceResult.base64,
                  },
                }
              );

              console.log(
                '📄 Facture générée automatiquement:',
                invoiceResult.filename
              );
            }
          } catch (invoiceError) {
            console.warn(
              '⚠️ Erreur génération facture automatique:',
              invoiceError
            );
            // Ne pas bloquer le processus principal si la facture échoue
          }

          // Notification de succès
          this.showSuccessNotification(
            matchingTransaction,
            paymentData.transactionId
          );

          console.log('✅ Paiement confirmé et traité:', {
            transactionId: matchingTransaction.id,
            paypalId: paymentData.transactionId,
            receiptSent: receiptResult.success,
          });

          return {
            success: true,
            transactionId: matchingTransaction.id,
            paypalTransactionId: paymentData.transactionId,
          };
        }
      } else {
        console.warn('⚠️ Aucune transaction correspondante trouvée');
        this.showWarningNotification('Transaction non trouvée');
      }
    } catch (error) {
      console.error('❌ Erreur traitement paiement réussi:', error);
      this.showErrorNotification('Erreur de traitement');
      return { success: false, error: error.message };
    }
  }

  /**
   * Traite un paiement annulé
   */
  async handleCancelledPayment(paymentData) {
    try {
      // Parser les données custom si disponibles
      let customData = {};
      if (paymentData.custom) {
        try {
          customData = JSON.parse(paymentData.custom);
        } catch (e) {
          console.warn('Impossible de parser les données custom:', e);
        }
      }

      // Importer le service de gestion
      const { default: paymentManagementService } = await import(
        './paymentManagementService.js'
      );

      // Rechercher la transaction correspondante
      const allTransactions = paymentManagementService.getAllTransactions();
      let matchingTransaction = null;

      if (customData.client_email) {
        matchingTransaction = allTransactions.find(
          (t) =>
            t.clientEmail === customData.client_email &&
            t.status === 'pending' &&
            Date.now() - new Date(t.timestamp).getTime() < 2 * 60 * 60 * 1000
        );
      }

      if (matchingTransaction) {
        // Mettre à jour le statut comme annulé
        paymentManagementService.updateTransactionStatus(
          matchingTransaction.id,
          'cancelled'
        );

        this.showCancelledNotification(matchingTransaction);

        console.log('⚠️ Paiement annulé:', {
          transactionId: matchingTransaction.id,
          client: matchingTransaction.clientEmail,
        });

        return {
          success: true,
          transactionId: matchingTransaction.id,
          status: 'cancelled',
        };
      }
    } catch (error) {
      console.error('❌ Erreur traitement paiement annulé:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Simule un webhook PayPal pour les tests
   */
  simulateWebhook(transactionId, status = 'completed', paypalTxnId = null) {
    const simulatedData = {
      transactionId: paypalTxnId || `SIMULATED-${Date.now()}`,
      payerId: 'SIMULATED_PAYER',
      amount: '100.00',
      currency: 'EUR',
      custom: JSON.stringify({
        client_email: 'test@example.com',
        project_name: 'Test Project',
        payment_type: 'full',
        timestamp: new Date().toISOString(),
      }),
    };

    if (status === 'completed') {
      this.handleSuccessfulPayment(simulatedData);
    } else if (status === 'cancelled') {
      this.handleCancelledPayment(simulatedData);
    }

    console.log('🧪 Webhook simulé:', status, simulatedData);
  }

  /**
   * Vérifie le statut d'un paiement PayPal
   */
  async checkPaymentStatus(paypalTransactionId) {
    // Dans un vrai environnement, ceci ferait un appel à l'API PayPal
    // Pour l'instant, on simule

    console.log('🔍 Vérification statut PayPal:', paypalTransactionId);

    // Simulation d'une vérification
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactionId: paypalTransactionId,
          status: 'completed',
          amount: '100.00',
          currency: 'EUR',
          timestamp: new Date().toISOString(),
        });
      }, 1000);
    });
  }

  /**
   * Notifications visuelles
   */
  showSuccessNotification(transaction, paypalTxnId) {
    // Utiliser react-toastify si disponible
    if (window.toast) {
      window.toast.success(
        `✅ Paiement confirmé ! Transaction PayPal: ${paypalTxnId?.substring(
          0,
          12
        )}...`,
        {
          position: 'top-right',
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } else {
      // Fallback vers une notification native
      this.showNativeNotification(
        'Paiement Confirmé ✅',
        `Votre paiement de ${transaction.amount}${transaction.currency} a été confirmé par PayPal.`
      );
    }
  }

  showCancelledNotification(transaction) {
    if (window.toast) {
      window.toast.warn(`⚠️ Paiement annulé pour ${transaction.projectName}`, {
        autoClose: 5000,
      });
    } else {
      this.showNativeNotification(
        'Paiement Annulé ⚠️',
        `Le paiement pour ${transaction.projectName} a été annulé.`
      );
    }
  }

  showWarningNotification(message) {
    if (window.toast) {
      window.toast.warn(`⚠️ ${message}`, { autoClose: 5000 });
    } else {
      this.showNativeNotification('Attention ⚠️', message);
    }
  }

  showErrorNotification(message) {
    if (window.toast) {
      window.toast.error(`❌ ${message}`, { autoClose: 5000 });
    } else {
      this.showNativeNotification('Erreur ❌', message);
    }
  }

  /**
   * Notification native du navigateur
   */
  showNativeNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    } else if (
      'Notification' in window &&
      Notification.permission !== 'denied'
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, {
            body: body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
          });
        }
      });
    }
  }

  /**
   * Nettoie l'URL des paramètres PayPal
   */
  cleanUrl() {
    const url = new URL(window.location);
    url.searchParams.delete('payment');
    url.searchParams.delete('tx');
    url.searchParams.delete('txn_id');
    url.searchParams.delete('PayerID');
    url.searchParams.delete('amt');
    url.searchParams.delete('mc_gross');
    url.searchParams.delete('cc');
    url.searchParams.delete('mc_currency');
    url.searchParams.delete('custom');

    // Mettre à jour l'URL sans recharger la page
    window.history.replaceState({}, document.title, url.toString());
  }

  /**
   * Génère une URL de retour PayPal améliorée
   */
  generateReturnUrl(type = 'success', transactionData = {}) {
    const baseUrl =
      type === 'success' ? this.returnUrls.success : this.returnUrls.cancel;
    const url = new URL(baseUrl);

    // Ajouter des paramètres de tracking
    if (transactionData.clientEmail) {
      url.searchParams.set('client', btoa(transactionData.clientEmail));
    }
    if (transactionData.projectName) {
      url.searchParams.set('project', btoa(transactionData.projectName));
    }

    return url.toString();
  }

  /**
   * Configuration pour les tests en développement
   */
  enableTestMode() {
    console.log('🧪 Mode test PayPal activé');

    // Ajouter des boutons de test dans le console
    window.paypalTest = {
      simulateSuccess: (transactionId) =>
        this.simulateWebhook(transactionId, 'completed'),
      simulateCancel: (transactionId) =>
        this.simulateWebhook(transactionId, 'cancelled'),
      checkStatus: (paypalTxnId) => this.checkPaymentStatus(paypalTxnId),
    };

    console.log('🎮 Commandes de test disponibles:');
    console.log('- paypalTest.simulateSuccess("TXN-123")');
    console.log('- paypalTest.simulateCancel("TXN-123")');
    console.log('- paypalTest.checkStatus("PAYPAL-TXN-456")');
  }

  /**
   * Statistiques de traitement des webhooks
   */
  getWebhookStats() {
    const stats = JSON.parse(
      localStorage.getItem('paypal_webhook_stats') || '{}'
    );
    return {
      totalProcessed: stats.totalProcessed || 0,
      successCount: stats.successCount || 0,
      cancelledCount: stats.cancelledCount || 0,
      errorCount: stats.errorCount || 0,
      lastProcessed: stats.lastProcessed || null,
    };
  }

  /**
   * Met à jour les statistiques de webhook
   */
  updateWebhookStats(type) {
    const stats = this.getWebhookStats();
    stats.totalProcessed++;
    stats.lastProcessed = new Date().toISOString();

    switch (type) {
      case 'success':
        stats.successCount++;
        break;
      case 'cancelled':
        stats.cancelledCount++;
        break;
      case 'error':
        stats.errorCount++;
        break;
    }

    localStorage.setItem('paypal_webhook_stats', JSON.stringify(stats));
  }
}

// Instance singleton
const paypalWebhookService = new PayPalWebhookService();

// Activer le mode test en développement
if (import.meta.env.DEV) {
  paypalWebhookService.enableTestMode();
}

export default paypalWebhookService;
