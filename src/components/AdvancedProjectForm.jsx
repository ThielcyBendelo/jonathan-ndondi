import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import validationService from '../services/validationService';
import dataService from '../services/dataService';
import emailService from '../services/emailService';
import { requestQuote } from '../services/quoteApi';

export default function AdvancedProjectForm({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [completionScore, setCompletionScore] = useState(0);

  const totalSteps = 4;

  // Validation en temps réel
  const realTimeValidator = validationService.createRealTimeValidator(
    (fieldName, result) => {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: result.isValid ? null : result.error,
      }));
    }
  );

  // Mise à jour du score de completude
  useEffect(() => {
    const score = validationService.getCompletionScore(formData, files);
    setCompletionScore(score);
  }, [formData, files]);

  // Pré-remplir le type de projet si sélectionné depuis Services
  useEffect(() => {
    if (isOpen) {
      const selectedService = sessionStorage.getItem('selectedService');
      if (selectedService) {
        let projectType = '';
        // Mapper les services vers les types de projet
        switch (selectedService) {
          case 'Développement Web':
            projectType = 'site-web';
            break;
          case 'Applications Mobiles':
            projectType = 'mobile';
            break;
          case 'E-commerce':
            projectType = 'e-commerce';
            break;
          case 'API & Backend':
            projectType = 'application';
            break;
          default:
            projectType = 'autre';
        }

        setFormData((prev) => ({
          ...prev,
          projectType: projectType,
        }));
      }
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validation en temps réel
    realTimeValidator(name, value);
  };

  const handleFileUpload = (newFiles) => {
    const fileArray = Array.from(newFiles);
    const totalFiles = files.length + fileArray.length;

    if (totalFiles > 5) {
      toast.error('Maximum 5 fichiers autorisés');
      return;
    }

    // Valider les fichiers
    const validation = validationService.validateFiles(fileArray);
    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    setFiles((prev) => [...prev, ...fileArray]);
    toast.success(`${fileArray.length} fichier(s) ajouté(s)`);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateCurrentStep = () => {
    const stepValidation = validationService.validateStep(
      currentStep,
      formData,
      files
    );
    setErrors((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(stepValidation.fieldResults).map(([field, result]) => [
          field,
          result.isValid ? null : result.error,
        ])
      ),
    }));
    return stepValidation.isValid;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error('Veuillez corriger les erreurs avant de continuer');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const formValidation = validationService.validateForm(formData, files);

    if (!formValidation.isValid) {
      toast.error('Veuillez corriger toutes les erreurs avant de soumettre');
      setErrors(
        Object.fromEntries(
          Object.entries(formValidation.fieldResults).map(([field, result]) => [
            field,
            result.isValid ? null : result.error,
          ])
        )
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Envoyer la demande de devis à l'API backend
      await requestQuote({ ...formData, files });

      // Envoyer par email avec EmailJS
      const emailResult = await emailService.sendQuoteRequest(formData, files);

      // Enregistrer la transaction pour la comptabilité (devis)
      const { addTransaction } = await import('../services/transactionApi');
      await addTransaction({
        client: formData.name,
        clientEmail: formData.email,
        project: formData.projectType || 'devis',
        amount: parseFloat(formData.budget) || 0,
        currency: 'EUR',
        type: 'quote',
        date: new Date().toISOString().slice(0, 10),
        description: formData.message,
      });

      if (emailResult.success) {
        // Aussi sauvegarder localement pour le suivi
        const formattedData = validationService.formatFormData(formData, files);
        const newClient = dataService.addClient(formattedData);

        console.log('Email envoyé et client ajouté:', newClient, files);

        toast.success(
          <div>
            <div className="font-semibold">
              ✅ Demande envoyée avec succès !
            </div>
            <div className="text-sm">
              Vous recevrez une réponse sous 24h par email
            </div>
          </div>
        );

        // Reset du formulaire
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          budget: '',
          timeline: '',
          message: '',
        });
        setFiles([]);
        setErrors({});
        setCurrentStep(1);

        setTimeout(() => onClose(), 3000);
      } else {
        // Fallback: sauvegarder localement même si l'email échoue
        const formattedData = validationService.formatFormData(formData, files);
        dataService.addClient(formattedData);

        toast.error(
          <div>
            <div className="font-semibold">⚠️ Problème d'envoi email</div>
            <div className="text-sm">
              Votre demande a été sauvegardée. Contactez-nous directement.
            </div>
          </div>
        );
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);

      // Sauvegarder localement en cas d'erreur
      try {
        const formattedData = validationService.formatFormData(formData, files);
        dataService.addClient(formattedData);

        toast.error(
          <div>
            <div className="font-semibold">Erreur d'envoi</div>
            <div className="text-sm">
              Demande sauvegardée. Veuillez nous contacter directement.
            </div>
          </div>
        );
      } catch {
        toast.error(
          "Erreur lors de l'envoi. Veuillez réessayer ou nous contacter directement."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-dark-300 rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto mx-2 sm:mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-dark-400">
          <div>
            <h2 className="text-2xl font-bold text-white">Demande de Projet</h2>
            <p className="text-gray-400">
              Étape {currentStep} sur {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-dark-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Progression</span>
            <span className="text-sm text-purple font-semibold">
              {completionScore}%
            </span>
          </div>
          <div className="w-full bg-dark-400 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple to-pink h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  step <= currentStep
                    ? 'bg-gradient-to-r from-purple to-pink text-white'
                    : 'bg-dark-400 text-gray-500'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 sm:p-6">
          {currentStep === 1 && (
            <Step1
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <Step2
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <Step3
              formData={formData}
              onChange={handleInputChange}
              errors={errors}
            />
          )}
          {currentStep === 4 && (
            <Step4
              files={files}
              onFileUpload={handleFileUpload}
              onRemoveFile={removeFile}
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              errors={errors}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center p-4 sm:p-6 bg-dark-200 border-t border-dark-400">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-dark-400 text-gray-300 rounded-lg hover:bg-dark-500 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Précédent
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">
              Qualité de la demande
            </div>
            <div
              className={`text-sm font-semibold ${
                completionScore >= 80
                  ? 'text-green-400'
                  : completionScore >= 60
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            >
              {completionScore >= 80
                ? 'Excellente'
                : completionScore >= 60
                ? 'Bonne'
                : 'À améliorer'}
            </div>
          </div>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                       hover:shadow-lg transition-all transform hover:scale-105"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                       hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi...
                </div>
              ) : (
                'Envoyer la demande'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Étape 1: Informations personnelles
function Step1({ formData, onChange, errors }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Informations personnelles
        </h3>
        <p className="text-gray-400">Commençons par vos coordonnées</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">
            Nom complet <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Jean Dupont"
            className={`w-full px-4 py-3 bg-dark-200 border rounded-lg text-white placeholder-gray-500 
                      focus:outline-none focus:ring-2 transition-colors ${
                        errors.name
                          ? 'border-red-500 focus:ring-red-500/50'
                          : 'border-dark-400 focus:ring-purple/50'
                      }`}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="jean@exemple.com"
            className={`w-full px-4 py-3 bg-dark-200 border rounded-lg text-white placeholder-gray-500 
                      focus:outline-none focus:ring-2 transition-colors ${
                        errors.email
                          ? 'border-red-500 focus:ring-red-500/50'
                          : 'border-dark-400 focus:ring-purple/50'
                      }`}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">
          Téléphone <span className="text-gray-500">(optionnel)</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="0123456789"
          className={`w-full px-4 py-3 bg-dark-200 border rounded-lg text-white placeholder-gray-500 
                    focus:outline-none focus:ring-2 transition-colors ${
                      errors.phone
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-dark-400 focus:ring-purple/50'
                    }`}
        />
        {errors.phone && (
          <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          Format: 0123456789 ou +33123456789
        </p>
      </div>
    </div>
  );
}

// Étape 2: Informations projet
function Step2({ formData, onChange, errors }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Détails du projet
        </h3>
        <p className="text-gray-400">Parlez-nous de votre projet</p>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">
          Entreprise <span className="text-gray-500">(optionnel)</span>
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={onChange}
          placeholder="Mon Entreprise"
          className={`w-full px-4 py-3 bg-dark-200 border rounded-lg text-white placeholder-gray-500 
                    focus:outline-none focus:ring-2 transition-colors ${
                      errors.company
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-dark-400 focus:ring-purple/50'
                    }`}
        />
        {errors.company && (
          <p className="text-red-400 text-sm mt-1">{errors.company}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 mb-2">
            Type de projet <span className="text-red-400">*</span>
          </label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={onChange}
            className={`w-full px-4 py-3 bg-dark-200 border rounded-lg text-white 
                      focus:outline-none focus:ring-2 transition-colors ${
                        errors.projectType
                          ? 'border-red-500 focus:ring-red-500/50'
                          : 'border-dark-400 focus:ring-purple/50'
                      }`}
          >
            <option value="">Sélectionner...</option>
            <option value="site-web">Site Web</option>
            <option value="e-commerce">E-commerce</option>
            <option value="application">Application Web</option>
            <option value="mobile">Application Mobile</option>
            <option value="autre">Autre</option>
          </select>
          {errors.projectType && (
            <p className="text-red-400 text-sm mt-1">{errors.projectType}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 mb-2">
            Budget estimé <span className="text-red-400">*</span>
          </label>
          <select
            name="budget"
            value={formData.budget}
            onChange={onChange}
            className={`w-full px-4 py-3 bg-dark-200 border rounded-lg text-white 
                      focus:outline-none focus:ring-2 transition-colors ${
                        errors.budget
                          ? 'border-red-500 focus:ring-red-500/50'
                          : 'border-dark-400 focus:ring-purple/50'
                      }`}
          >
            <option value="">Sélectionner...</option>
            <option value="500-1000">500€ - 1000€</option>
            <option value="1000-5000">1000€ - 5000€</option>
            <option value="5000-10000">5000€ - 10000€</option>
            <option value="10000+">10000€+</option>
          </select>
          {errors.budget && (
            <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-gray-300 mb-2">
          Délais souhaités <span className="text-red-400">*</span>
        </label>
        <select
          name="timeline"
          value={formData.timeline}
          onChange={onChange}
          className={`w-full px-4 py-3 bg-dark-200 border rounded-lg text-white 
                    focus:outline-none focus:ring-2 transition-colors ${
                      errors.timeline
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-dark-400 focus:ring-purple/50'
                    }`}
        >
          <option value="">Sélectionner...</option>
          <option value="urgent">Urgent (moins d'une semaine)</option>
          <option value="1-2-semaines">1-2 semaines</option>
          <option value="1-2-mois">1-2 mois</option>
          <option value="3-6-mois">3-6 mois</option>
          <option value="flexible">Flexible</option>
        </select>
        {errors.timeline && (
          <p className="text-red-400 text-sm mt-1">{errors.timeline}</p>
        )}
      </div>
    </div>
  );
}

// Étape 3: Description
function Step3({ formData, onChange, errors }) {
  const wordCount = formData.message.length;
  const maxWords = 1000;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Description du projet
        </h3>
        <p className="text-gray-400">Décrivez votre vision en détail</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-300">
            Description détaillée <span className="text-red-400">*</span>
          </label>
          <span
            className={`text-sm ${
              wordCount > maxWords ? 'text-red-400' : 'text-gray-400'
            }`}
          >
            {wordCount}/{maxWords}
          </span>
        </div>
        <textarea
          name="message"
          value={formData.message}
          onChange={onChange}
          rows="8"
          placeholder="Décrivez votre projet, vos besoins, vos attentes, les fonctionnalités souhaitées, votre audience cible, vos références, etc."
          className={`w-full px-4 py-3 bg-dark-200 border rounded-lg text-white placeholder-gray-500 
                    focus:outline-none focus:ring-2 transition-colors resize-none ${
                      errors.message
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-dark-400 focus:ring-purple/50'
                    }`}
        />
        {errors.message && (
          <p className="text-red-400 text-sm mt-1">{errors.message}</p>
        )}
        <div className="text-sm text-gray-500 mt-2">
          💡 Plus votre description est détaillée, plus notre devis sera précis
        </div>
      </div>

      <div className="bg-dark-200 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-2">
          💡 Conseils pour une bonne description :
        </h4>
        <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
          <li>Décrivez l'objectif principal de votre projet</li>
          <li>Listez les fonctionnalités importantes</li>
          <li>Mentionnez vos références/inspirations</li>
          <li>Précisez votre audience cible</li>
          <li>Indiquez si vous avez déjà du contenu (textes, images)</li>
        </ul>
      </div>
    </div>
  );
}

// Étape 4: Fichiers
function Step4({
  files,
  onFileUpload,
  onRemoveFile,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  errors,
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Documents et fichiers
        </h3>
        <p className="text-gray-400">
          Ajoutez vos documents (optionnel mais recommandé)
        </p>
      </div>

      {/* Zone de drop */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-purple bg-purple/10'
            : 'border-dark-400 hover:border-purple/50'
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-dark-200 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <p className="text-white font-medium">Glissez vos fichiers ici</p>
            <p className="text-gray-400 text-sm">ou</p>
          </div>

          <label className="px-4 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg cursor-pointer hover:shadow-lg transition-all">
            Parcourir les fichiers
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={(e) => onFileUpload(e.target.files)}
              className="hidden"
            />
          </label>

          <div className="text-xs text-gray-500">
            Formats acceptés: Images, PDF, Documents Word (max 5MB chacun, 5
            fichiers max)
          </div>
        </div>
      </div>

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-white font-medium">
            Fichiers ajoutés ({files.length}/5)
          </h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-dark-200 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple/20 rounded flex items-center justify-center">
                  📎
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{file.name}</p>
                  <p className="text-gray-400 text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemoveFile(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {errors.files && <p className="text-red-400 text-sm">{errors.files}</p>}

      <div className="bg-dark-200 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-2">📋 Documents utiles :</h4>
        <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
          <li>Brief ou cahier des charges</li>
          <li>Maquettes ou wireframes</li>
          <li>Logos et éléments graphiques</li>
          <li>Exemples ou références visuelles</li>
          <li>Contenus textuels existants</li>
        </ul>
      </div>
    </div>
  );
}
