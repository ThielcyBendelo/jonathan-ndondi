import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import paymentNotificationService from '../services/paymentNotificationService.js';
import paymentManagementService from '../dashboard/services/paymentManagementService.js';
import paypalWebhookService from '../dashboard/services/paypalWebhookService';
import { processPayment } from '../services/paymentApi';
import { addTransaction } from '../services/transactionApi';

export default function PaymentModal({ isOpen, onClose, projectData = null }) {
  // Références pour le scroll
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  // États pour la navigation par étapes
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // États pour le scroll
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  // États existants
  const [paymentMethod] = useState('paypal'); // Défini pour usage futur
  const [amount, setAmount] = useState('');
  const [projectName, setProjectName] = useState(projectData?.name || '');
  const [currency, setCurrency] = useState('EUR');
  const [paymentType, setPaymentType] = useState('full'); // 'full', 'deposit', 'installment'
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [timeline, setTimeline] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Tes informations PayPal (à remplacer par tes vraies données)
  const PAYPAL_EMAIL = 'bendelothielcy@gmail.com';

  // Initialiser les données du projet
  useEffect(() => {
    if (projectData) {
      setProjectName(projectData.name || '');
      // Extraire le montant suggéré du prix
      const priceMatch = projectData.suggestedAmount?.match(/(\d+)/);
      if (priceMatch) {
        setAmount(priceMatch[1]);
      }
    }
  }, [projectData]);

  // Réinitialiser l'étape quand le modal se ferme/ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      // Remettre le scroll en haut
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Gérer l'affichage et l'état des boutons de scroll
  const checkScrollButtons = () => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const hasScroll = scrollHeight > clientHeight;

    setShowScrollButtons(hasScroll);
    setCanScrollUp(scrollTop > 10);
    setCanScrollDown(scrollTop < scrollHeight - clientHeight - 10);
  };

  // Vérifier le scroll à l'ouverture et au changement d'étape
  useEffect(() => {
    if (isOpen) {
      // Petit délai pour laisser le contenu se rendre
      const timer = setTimeout(checkScrollButtons, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentStep]);

  // Fonctions de scroll
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // Fonctions de navigation
  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Validation par étape
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: {
        // Informations client
        if (!clientEmail) {
          toast.error('Veuillez entrer votre email');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clientEmail)) {
          toast.error('Veuillez entrer une adresse email valide');
          return false;
        }
        if (!projectName) {
          toast.error('Veuillez entrer le nom du projet');
          return false;
        }
        return true;
      }

      case 2: {
        // Configuration paiement
        if (!amount) {
          toast.error('Veuillez entrer un montant');
          return false;
        }
        const paymentAmount = parseFloat(amount);
        if (paymentAmount <= 0) {
          toast.error(
            `Le montant doit être supérieur à 0${getCurrentSymbol()}`
          );
          return false;
        }
        if (paymentAmount > 50000) {
          toast.error(
            'Pour les montants supérieurs à 50 000€, contactez-moi directement'
          );
          return false;
        }
        return true;
      }

      case 3: // Confirmation
        return true;

      default:
        return true;
    }
  };

  const handlePayment = async () => {
    // Validation améliorée
    if (!amount || !projectName || !clientEmail) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount <= 0) {
      toast.error(`Le montant doit être supérieur à 0${currency}`);
      return;
    }

    if (paymentAmount > 50000) {
      toast.error(
        'Pour les montants supérieurs à 50 000€, contactez-moi directement'
      );
      return;
    }

    // Email validation simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      toast.error('Veuillez entrer une adresse email valide');
      return;
    }

    setIsProcessing(true);

    try {
      // Calculer le montant selon le type de paiement
      let finalAmount = paymentAmount;
      let paymentDescription = projectName;

      if (paymentType === 'deposit') {
        finalAmount = Math.round(paymentAmount * 0.3); // 30% d'acompte
        paymentDescription = `Acompte (30%) - ${projectName}`;
      } else if (paymentType === 'installment') {
        finalAmount = Math.round(paymentAmount / 3); // Premier tiers
        paymentDescription = `Paiement 1/3 - ${projectName}`;
      }

      // Envoyer les données de paiement à l'API backend
      await processPayment({
        clientEmail,
        clientName,
        clientPhone,
        projectName,
        paymentType,
        amount: finalAmount,
        currency,
        description: paymentDescription,
        timeline,
      });

      // Enregistrer la transaction pour la comptabilité
      await addTransaction({
        client: clientName || clientEmail,
        clientEmail,
        project: projectName,
        amount: finalAmount,
        currency,
        type: paymentType,
        date: new Date().toISOString().slice(0, 10),
        description: paymentDescription,
      });

      // Générer le lien PayPal
      if (paymentMethod === 'paypal') {
        await generatePayPalLink(finalAmount, paymentDescription);
      } else if (paymentMethod === 'stripe') {
        toast.info('Stripe sera disponible bientôt');
      }
    } catch (error) {
      let errorMsg = 'Erreur lors de la génération du lien de paiement';
      if (error && error.message) {
        errorMsg += ` : ${error.message}`;
      }
      console.error('Erreur paiement:', error);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePayPalLink = async (amount, projectDescription) => {
    try {
      // Toast de traitement
      toast.info('🔄 Préparation du paiement...', { autoClose: 2000 });

      // Paramètres PayPal améliorés avec URLs de retour intelligentes
      const transactionData = {
        clientEmail: clientEmail,
        projectName: projectName,
        clientName: clientName,
        amount: amount,
        currency: currency,
      };

      const successUrl = paypalWebhookService.generateReturnUrl(
        'success',
        transactionData
      );
      const cancelUrl = paypalWebhookService.generateReturnUrl(
        'cancel',
        transactionData
      );

      const paypalParams = new URLSearchParams({
        cmd: '_xclick',
        business: PAYPAL_EMAIL,
        item_name: `${projectDescription}`,
        item_number: `PROJ-${Date.now()}`,
        amount: amount.toString(),
        currency_code: currency,
        payer_email: clientEmail,
        return: successUrl,
        cancel_return: cancelUrl,
        notify_url: `${window.location.origin}/api/paypal-webhook`,
        custom: JSON.stringify({
          client_email: clientEmail,
          project_name: projectName,
          client_name: clientName,
          payment_type: paymentType,
          transaction_id: transaction?.id,
          timestamp: new Date().toISOString(),
        }),
      });

      const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?${paypalParams.toString()}`;

      // Préparer les données de paiement pour les notifications
      const paymentData = {
        clientName: clientName || 'Client',
        clientEmail: clientEmail,
        clientPhone: clientPhone,
        projectName: projectName,
        projectDescription: projectDescription,
        amount: amount,
        currency: currency,
        paymentType: paymentType,
        paypalLink: paypalUrl,
        timeline: timeline,
      };

      // Sauvegarder la transaction avec le service de gestion centralisé
      const transaction = paymentManagementService.addTransaction({
        ...paymentData,
        status: 'pending',
      });

      // Envoyer toutes les notifications email
      toast.info('📧 Envoi des notifications...', { autoClose: 3000 });

      const notificationResult =
        await paymentNotificationService.sendAllNotifications(paymentData);

      if (notificationResult.success) {
        toast.success(
          <div>
            <div className="font-semibold">✅ Paiement préparé !</div>
            <div className="text-sm">Emails envoyés • Redirection PayPal</div>
          </div>,
          { autoClose: 4000 }
        );
      } else {
        console.warn(
          '⚠️ Certaines notifications ont échoué:',
          notificationResult
        );
        toast.warning(
          <div>
            <div className="font-semibold">⚠️ Paiement préparé</div>
            <div className="text-sm">Certains emails peuvent avoir échoué</div>
          </div>,
          { autoClose: 4000 }
        );
      }

      // Simulation d'attente pour l'UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Ouvrir PayPal dans un nouvel onglet
      window.open(paypalUrl, '_blank');

      // Toast final avec instructions
      toast.success(
        <div>
          <div className="font-semibold">🚀 Redirection PayPal</div>
          <div className="text-sm">
            Montant: {amount}
            {getCurrentSymbol()} - Complétez le paiement
          </div>
          <div className="text-xs mt-1 opacity-75">
            Vous recevrez une confirmation par email
          </div>
        </div>,
        { autoClose: 7000 }
      );

      // Statistiques pour le dashboard
      console.log('💰 Paiement initié:', {
        transactionId: transaction?.id,
        amount: `${amount}${getCurrentSymbol()}`,
        project: projectName,
        client: clientEmail,
        type: paymentType,
        timestamp: new Date().toISOString(),
      });

      // Fermer le modal après 3 secondes
      setTimeout(() => onClose(), 3000);
    } catch (error) {
      console.error('❌ Erreur lors de la génération PayPal:', error);
      toast.error(
        <div>
          <div className="font-semibold">❌ Erreur de paiement</div>
          <div className="text-sm">
            Impossible de préparer le paiement. Réessayez.
          </div>
        </div>,
        { autoClose: 5000 }
      );
    }
  };

  const predefinedAmounts = [500, 1000, 1500, 2000, 3000, 5000];
  const currencies = [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'Dollar US' },
    { code: 'GBP', symbol: '£', name: 'Livre Sterling' },
  ];

  const paymentTypes = [
    {
      value: 'full',
      label: 'Paiement complet',
      description: 'Paiement total du projet',
    },
    {
      value: 'deposit',
      label: 'Acompte (30%)',
      description: 'Acompte pour démarrer le projet',
    },
    {
      value: 'installment',
      label: 'Paiement échelonné',
      description: 'Premier tiers du montant total',
    },
  ];

  const getCurrentSymbol = () =>
    currencies.find((c) => c.code === currency)?.symbol || '€';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className="bg-dark-200 rounded-2xl w-full max-w-lg shadow-2xl relative"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-dark-400">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                💳 Paiement Projet
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            {/* Indicateur de progression */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>
                    Étape {currentStep} sur {totalSteps}
                  </span>
                  <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
                </div>
                <div className="w-full bg-dark-400 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {/* Titres des étapes */}
            <div className="flex justify-between mt-4">
              {[
                { num: 1, title: 'Informations' },
                { num: 2, title: 'Paiement' },
                { num: 3, title: 'Confirmation' },
              ].map((step) => (
                <div
                  key={step.num}
                  className={`flex items-center space-x-2 ${
                    currentStep >= step.num
                      ? 'text-purple-400'
                      : 'text-gray-500'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      currentStep >= step.num
                        ? 'bg-purple-600 text-white'
                        : 'bg-dark-400 text-gray-500'
                    }`}
                  >
                    {currentStep > step.num ? '✓' : step.num}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content avec étapes */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto max-h-96 p-6"
            onScroll={checkScrollButtons}
          >
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Étape 1: Informations du projet */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      📋 Informations du projet
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Veuillez renseigner les détails de votre projet
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Votre email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="votre.email@exemple.com"
                      className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-white 
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                             transition-all duration-200"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Pour recevoir la confirmation de paiement
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Votre nom complet
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Prénom Nom"
                      className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-white 
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                             transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Téléphone (optionnel)
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-white 
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                             transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Nom du projet <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Ex: Site web e-commerce"
                      className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-white 
                             placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                             transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Délai souhaité
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-white 
                             focus:outline-none focus:ring-2 focus:ring-purple-500/50
                             transition-all duration-200"
                    >
                      <option value="">Sélectionnez un délai</option>
                      <option value="urgent">🚀 Urgent (1-2 semaines)</option>
                      <option value="standard">
                        📅 Standard (3-4 semaines)
                      </option>
                      <option value="flexible">⏳ Flexible (1-2 mois)</option>
                      <option value="custom">💬 À discuter</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Étape 2: Informations de paiement */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      💰 Détails du paiement
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Définissez le montant et la devise pour votre projet
                    </p>
                  </div>

                  {/* Type de paiement */}
                  <div>
                    <label className="block text-gray-300 mb-3">
                      Type de paiement
                    </label>
                    <div className="space-y-2">
                      {paymentTypes.map((type) => (
                        <label
                          key={type.value}
                          className="flex items-center cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="paymentType"
                            value={type.value}
                            checked={paymentType === type.value}
                            onChange={(e) => setPaymentType(e.target.value)}
                            className="mr-3 text-purple-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="text-white font-medium group-hover:text-purple-400 transition-colors">
                                {type.label}
                              </span>
                              {type.value === 'deposit' && (
                                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                  Recommandé
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm">
                              {type.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Devise */}
                  <div>
                    <label className="block text-gray-300 mb-2">Devise</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-white 
                             focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
                    >
                      {currencies.map((curr) => (
                        <option key={curr.code} value={curr.code}>
                          {curr.symbol} {curr.name} ({curr.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Montant */}
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Montant <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {predefinedAmounts.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setAmount(preset.toString())}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                            amount === preset.toString()
                              ? 'bg-purple-600 text-white shadow-lg'
                              : 'bg-dark-300 text-gray-300 hover:bg-purple-600/20'
                          }`}
                        >
                          {preset}
                          {getCurrentSymbol()}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Montant personnalisé"
                        min="1"
                        max="50000"
                        className="w-full px-4 py-3 pr-12 bg-dark-300 border border-dark-400 rounded-lg text-white 
                               placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50
                               transition-all duration-200"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {getCurrentSymbol()}
                      </span>
                    </div>
                  </div>

                  {/* Aperçu du montant selon le type */}
                  {amount && (
                    <div className="bg-dark-500 p-4 rounded-lg border border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">
                          {paymentType === 'full' && 'Montant total:'}
                          {paymentType === 'deposit' && 'Acompte (30%):'}
                          {paymentType === 'installment' && 'Premier tiers:'}
                        </span>
                        <span className="text-2xl font-bold text-purple-400">
                          {paymentType === 'full' && `${amount} ${currency}`}
                          {paymentType === 'deposit' &&
                            `${Math.round(
                              parseFloat(amount || 0) * 0.3
                            )} ${currency}`}
                          {paymentType === 'installment' &&
                            `${Math.round(
                              parseFloat(amount || 0) / 3
                            )} ${currency}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Étape 3: Confirmation */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      ✅ Confirmation
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Vérifiez les informations avant de procéder au paiement
                    </p>
                  </div>

                  {/* Résumé complet */}
                  <div className="bg-dark-500 p-6 rounded-lg border border-purple-500/20 space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-dark-400">
                      <span className="text-gray-300">📧 Email:</span>
                      <span className="text-white">{clientEmail}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dark-400">
                      <span className="text-gray-300">📝 Projet:</span>
                      <span className="text-white">{projectName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dark-400">
                      <span className="text-gray-300">🎯 Type:</span>
                      <span className="text-white">
                        {
                          paymentTypes.find((t) => t.value === paymentType)
                            ?.label
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dark-400">
                      <span className="text-gray-300">🌍 Devise:</span>
                      <span className="text-white">{currency}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">💰 Montant à payer:</span>
                      <span className="text-2xl font-bold text-purple-400">
                        {paymentType === 'full' && `${amount} ${currency}`}
                        {paymentType === 'deposit' &&
                          `${Math.round(
                            parseFloat(amount || 0) * 0.3
                          )} ${currency}`}
                        {paymentType === 'installment' &&
                          `${Math.round(
                            parseFloat(amount || 0) / 3
                          )} ${currency}`}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-400 text-xl">ℹ️</span>
                      <div>
                        <p className="text-blue-300 text-sm font-medium mb-1">
                          À propos du paiement
                        </p>
                        <p className="text-blue-200 text-sm">
                          Vous serez redirigé vers PayPal pour effectuer le
                          paiement de manière sécurisée. Un email de
                          confirmation vous sera envoyé.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Footer avec boutons de navigation */}
          <div className="p-6 border-t border-dark-400">
            <div className="flex justify-between items-center">
              {/* Bouton Précédent */}
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'bg-dark-400 text-gray-500 cursor-not-allowed'
                    : 'bg-dark-300 text-white hover:bg-dark-400'
                }`}
              >
                ← Précédent
              </button>

              {/* Bouton Suivant/Payer */}
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 
                         transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Suivant</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg 
                         font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2
                         transform hover:scale-105 active:scale-95"
                >
                  <span>💳</span>
                  <span>
                    {isProcessing ? 'Traitement...' : 'Payer maintenant'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Boutons de scroll flottants */}
          <AnimatePresence>
            {showScrollButtons && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-10"
              >
                {/* Bouton scroll vers le haut */}
                <motion.button
                  onClick={scrollToTop}
                  disabled={!canScrollUp}
                  className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                    canScrollUp
                      ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                      : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={canScrollUp ? { scale: 1.1 } : {}}
                  whileTap={canScrollUp ? { scale: 0.95 } : {}}
                  title="Aller en haut"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </motion.button>

                {/* Bouton scroll vers le bas */}
                <motion.button
                  onClick={scrollToBottom}
                  disabled={!canScrollDown}
                  className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                    canScrollDown
                      ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
                      : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={canScrollDown ? { scale: 1.1 } : {}}
                  whileTap={canScrollDown ? { scale: 0.95 } : {}}
                  title="Aller en bas"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
