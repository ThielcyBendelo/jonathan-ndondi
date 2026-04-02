import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import emailService from '../services/emailService';

const SERVICES = [
  { value: 'site-web', label: 'Site Web vitrine' },
  { value: 'e-commerce', label: 'Site E-commerce' },
  { value: 'application', label: 'Application Web' },
  { value: 'mobile', label: 'Application Mobile' },
  { value: 'cybersecurite', label: 'Cybersécurité' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'cloud', label: 'Cloud & Hébergement' },
  { value: 'autre', label: 'Autre projet' },
];

const TIMELINES = [
  { value: 'urgent', label: "Urgent (moins d'une semaine)" },
  { value: '1-2-semaines', label: '1-2 semaines' },
  { value: '1-2-mois', label: '1-2 mois' },
  { value: '3-6-mois', label: '3-6 mois' },
  { value: 'flexible', label: 'Flexible' },
];

const initialState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  job: '',
  sector: '',
  website: '',
  projectType: '',
  budget: '',
  timeline: '',
  message: '',
};

const QuoteModal = ({ isOpen, onClose, defaultService }) => {
  const [formData, setFormData] = useState({ ...initialState, projectType: defaultService || '' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen) {
      setFormData({ ...initialState, projectType: defaultService || '' });
      setFiles([]);
      setResult(null);
    }
  }, [isOpen, defaultService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nom requis';
    if (!formData.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) newErrors.email = 'Email valide requis';
    if (!formData.projectType) newErrors.projectType = 'Service requis';
    if (!formData.timeline) newErrors.timeline = 'Délai requis';
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) newErrors.website = 'URL valide requise';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await emailService.sendQuoteRequest(formData, files);
      setResult(res);
      if (res.success) setFormData({ ...initialState, projectType: defaultService || '' });
    } catch {
      setResult({ success: false, message: "Erreur d'envoi." });
    }
    setLoading(false);
  };


  // Focus trap pour accessibilité
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
    // Focus trap
    const handleTab = (e) => {
      if (!modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll('input, select, textarea, button, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleTab);
    }
    return () => {
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, onClose]);

  // Gestion fermeture par clic sur overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative overflow-y-auto max-h-[90vh] sm:max-w-md sm:p-4"
            initial={{ scale: 0.8, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
            exit={{ scale: 0.8, y: 60, opacity: 0, transition: { duration: 0.2 } }}
            tabIndex={-1}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={onClose}
              aria-label="Fermer"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2 text-blue-700 text-center">Demander un devis</h2>
            <p className="mb-4 text-gray-600 text-center">Remplissez le formulaire pour recevoir votre devis personnalisé pour tous nos services.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Nom *</label>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-blue-400">👤</span>
                  <input ref={firstInputRef} type="text" name="name" required value={formData.name} onChange={handleChange} className={`w-full border rounded pl-8 px-3 py-2 focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`} />
                </div>
                {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium">Email *</label>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-blue-400">✉️</span>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className={`w-full border rounded pl-8 px-3 py-2 focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`} />
                </div>
                {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium">Téléphone</label>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-blue-400">📞</span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded pl-8 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Société</label>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-blue-400">🏢</span>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full border rounded pl-8 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Fonction</label>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-blue-400">💼</span>
                  <input type="text" name="job" value={formData.job} onChange={handleChange} className="w-full border rounded pl-8 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Secteur d'activité</label>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-blue-400">🏭</span>
                  <input type="text" name="sector" value={formData.sector} onChange={handleChange} className="w-full border rounded pl-8 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Site web</label>
                <div className="relative">
                  <span className="absolute left-2 top-2 text-blue-400">🌐</span>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} className={`w-full border rounded pl-8 px-3 py-2 focus:outline-none focus:ring-2 ${errors.website ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`} />
                </div>
                {errors.website && <span className="text-red-500 text-xs">{errors.website}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium">Service *</label>
                <select name="projectType" required value={formData.projectType} onChange={handleChange} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.projectType ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`}>
                  <option value="">Sélectionnez un service</option>
                  {SERVICES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {errors.projectType && <span className="text-red-500 text-xs">{errors.projectType}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium">Budget (EUR)</label>
                <input type="number" name="budget" value={formData.budget} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium">Délai souhaité *</label>
                <select name="timeline" required value={formData.timeline} onChange={handleChange} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${errors.timeline ? 'border-red-500 focus:ring-red-400' : 'focus:ring-blue-400'}`}>
                  <option value="">Sélectionnez un délai</option>
                  {TIMELINES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {errors.timeline && <span className="text-red-500 text-xs">{errors.timeline}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium">Fichiers (optionnel)</label>
                <input type="file" multiple onChange={handleFileChange} className="w-full" />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-700 to-purple-600 text-white py-2 rounded font-semibold hover:from-blue-800 hover:to-purple-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={loading}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
              </button>
              {result && (
                <div className={`mt-2 text-center font-medium ${result.success ? 'text-green-600' : 'text-red-600'} animate-pulse`}>
                  {result.success ? (
                    <>
                      <span className="inline-block text-3xl mb-2">✅</span><br />
                      <span>{result.message}</span>
                    </>
                  ) : (
                    <span>{result.message}</span>
                  )}
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;
