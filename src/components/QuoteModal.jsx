import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import emailService from '../services/emailService';
import { 
  FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkedAlt, 
  FaClock, FaPaperPlane, FaTimes, FaEuroSign, FaDraftingCompass 
} from 'react-icons/fa';

const ARCHI_SERVICES = [
  { value: 'Conception & Signature', label: 'Conception & Signature Architecturale' },
  { value: 'Maitrise d\'œuvre', label: 'Maîtrise d\'œuvre & Suivi de Chantier' },
  { value: 'Urbanisme', label: 'Urbanisme & Aménagement Urbain' },
  { value: 'Expertise & Conseil', label: 'Expertise & Conseil Stratégique' },
];

const TIMELINES = [
  { value: 'immediat', label: 'Lancement Immédiat' },
  { value: '3-6-mois', label: 'D\'ici 3 à 6 mois' },
  { value: 'etude-prealable', label: 'Phase d\'étude préalable' },
  { value: 'flexible', label: 'Projet à long terme / Flexible' },
];

export default function QuoteModal({ isOpen, onClose, defaultService }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', 
    projectType: defaultService || '', timeline: '', message: '', budget: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (isOpen) setFormData(prev => ({ ...prev, projectType: defaultService || '' }));
  }, [isOpen, defaultService]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await emailService.sendQuoteRequest(formData);
      setResult(res);
    } catch {
      setResult({ success: false, message: "Erreur lors de l'envoi." });
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div 
            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-sm shadow-2xl relative overflow-hidden"
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          >
            {/* Header Architectural */}
            <div className="bg-slate-950 p-8 text-white">
              <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
                <FaTimes size={20} />
              </button>
              <h2 className="text-2xl font-serif italic mb-2 tracking-wide text-white">Demande de Consultation</h2>
              <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-light">
                LEGACY Architects & co. | Bureau d'études
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
              {/* Coordonnées */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b pb-2">Informations Client</h4>
                <div className="relative">
                  <FaUser className="absolute left-0 top-3 text-slate-300 text-xs" />
                  <input type="text" placeholder="Nom Complet" required className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-slate-900 outline-none transition-all dark:text-white" />
                </div>
                <div className="relative">
                  <FaEnvelope className="absolute left-0 top-3 text-slate-300 text-xs" />
                  <input type="email" placeholder="Email" required className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-slate-900 outline-none transition-all dark:text-white" />
                </div>
                <div className="relative">
                  <FaPhone className="absolute left-0 top-3 text-slate-300 text-xs" />
                  <input type="tel" placeholder="Téléphone" className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-slate-900 outline-none transition-all dark:text-white" />
                </div>
              </div>

              {/* Détails Projet */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b pb-2">Détails du Projet</h4>
                <div className="relative">
                  <FaDraftingCompass className="absolute left-0 top-3 text-slate-300 text-xs" />
                  <select 
                    value={formData.projectType}
                    onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                    className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-slate-900 outline-none appearance-none dark:text-white"
                  >
                    {ARCHI_SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <FaClock className="absolute left-0 top-3 text-slate-300 text-xs" />
                  <select className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-slate-900 outline-none appearance-none dark:text-white">
                    <option value="">Délai souhaité</option>
                    {TIMELINES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <FaMapMarkedAlt className="absolute left-0 top-3 text-slate-300 text-xs" />
                  <input type="text" placeholder="Localisation du terrain" className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-slate-900 outline-none transition-all dark:text-white" />
                </div>
              </div>

              {/* Message plein écran */}
              <div className="md:col-span-2 mt-4">
                <textarea rows="3" placeholder="Décrivez votre vision ou vos contraintes techniques..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 text-sm border-none focus:ring-1 focus:ring-slate-900 outline-none dark:text-white" />
              </div>

              <div className="md:col-span-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-slate-950 text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? 'Analyse en cours...' : <><FaPaperPlane size={12} /> Envoyer le dossier</>}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
