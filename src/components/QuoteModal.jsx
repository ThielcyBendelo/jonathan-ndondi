import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import emailService from '../services/emailService';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaBuilding, 
  FaBriefcase, 
  FaGlobe, 
  FaTools, 
  FaClock, 
  FaPaperPlane,
  FaTimes
} from 'react-icons/fa';


const SERVICES = [
  { value: 'Gestion de image de marque', label: 'Gestion de l\'image de marque' },
  { value: 'Maintien en Condition Opérationnelle (MCO)', label: 'Maintien en Condition Opérationnelle (MCO)' },
  { value: 'Interface Client-Technique', label: 'Interface Client-Technique' },
  { value: 'Support & Continuité de Service', label: 'Support & Continuité de Service' },
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
            
            {/* Bouton fermer avec icône */}
<button
  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
  onClick={onClose}
>
  <FaTimes size={20} />
</button>

<h2 className="text-2xl font-bold mb-2 text-red-600 text-center">Demander un devis</h2>
<p className="mb-6 text-gray-500 text-sm text-center px-4">Recevez une proposition personnalisée pour vos projets informatiques et communication.</p>

<form onSubmit={handleSubmit} className="space-y-4">
  {/* NOM */}
  <div>
    <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Nom Complet *</label>
    <div className="relative">
      <FaUser className="absolute left-3 top-3 text-red-400" />
      <input 
        ref={firstInputRef} 
        type="text" 
        name="name" 
        required 
        value={formData.name} 
        onChange={handleChange} 
        className={`w-full bg-gray-50 border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 transition-all ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-red-400'}`} 
        placeholder="Louiscar Ingeba"
      />
    </div>
  </div>

  {/* EMAIL */}
  <div>
    <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Email Professionnel *</label>
    <div className="relative">
      <FaEnvelope className="absolute left-3 top-3 text-red-400" />
      <input 
        type="email" 
        name="email" 
        required 
        value={formData.email} 
        onChange={handleChange} 
        className={`w-full bg-gray-50 border rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 transition-all ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-red-400'}`}
        placeholder="exemple@domaine.com"
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    {/* TELEPHONE */}
    <div>
      <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Téléphone</label>
      <div className="relative">
        <FaPhone className="absolute left-3 top-3 text-red-400" />
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-red-400 transition-all" />
      </div>
    </div>
    
    {/* SOCIÉTÉ */}
    <div>
      <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Société</label>
      <div className="relative">
        <FaBuilding className="absolute left-3 top-3 text-red-400" />
        <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-red-400 transition-all" />
      </div>
    </div>
  </div>

  {/* SERVICE (SELECT) */}
  <div>
    <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Service Souhaité *</label>
    <div className="relative">
      <FaTools className="absolute left-3 top-3 text-red-400 shadow-sm" />
      <select 
        name="projectType" 
        value={formData.projectType} 
        onChange={handleChange} 
        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 appearance-none focus:ring-2 focus:ring-red-400"
      >
        <option value="">Choisir un service...</option>
        {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
    </div>
  </div>

  {/* DÉLAI (SELECT) */}
  <div>
    <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">Délai du projet *</label>
    <div className="relative">
      <FaClock className="absolute left-3 top-3 text-red-400" />
      <select 
        name="timeline" 
        value={formData.timeline} 
        onChange={handleChange} 
        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 appearance-none focus:ring-2 focus:ring-red-400"
      >
        <option value="">Sélectionner un délai...</option>
        {TIMELINES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
    </div>
  </div>

  {/* BOUTON ENVOYER */}
  <button
    type="submit"
    disabled={loading}
    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 mt-4"
  >
    {loading ? (
      <span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>
    ) : (
      <>
        <FaPaperPlane /> Envoyer la demande
      </>
    )}
  </button>
</form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuoteModal;
