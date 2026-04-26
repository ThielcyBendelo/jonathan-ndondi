import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import emailService from '../services/emailService';
import { 
  FaUser, FaEnvelope, FaPhone, FaBriefcase, FaCalendarAlt, 
  FaClock, FaPaperPlane, FaTimes, FaBalanceScale, FaLightbulb 
} from 'react-icons/fa';

const EXPERTISES = [
  { value: 'Juridique', label: 'Consultation Juridique & Défense' },
  { value: 'Coaching', label: 'Mentorat Business & Leadership' },
  { value: 'Conférence', label: 'Demande d\'Intervention / Conférence' },
  { value: 'Edition', label: 'Livres & Programmes Éducatifs' },
];

const URGENCIES = [
  { value: 'urgent', label: 'Besoin Urgent (sous 48h)' },
  { value: 'semaine', label: 'D\'ici une semaine' },
  { value: 'planification', label: 'Planification stratégique' },
  { value: 'information', label: 'Demande d\'information générale' },
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
      setResult({ success: false, message: "Erreur lors de la transmission." });
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div 
            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-sm shadow-2xl relative overflow-hidden border border-amber-600/20"
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          >
            {/* Header de Prestige */}
            <div className="bg-slate-950 p-8 text-white border-b border-amber-600/30">
              <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-amber-600 transition-colors">
                <FaTimes size={20} />
              </button>
              <h2 className="text-2xl font-serif italic mb-1 tracking-wide text-white">Prise de Contact Stratégique</h2>
              <p className="text-amber-600 text-[9px] uppercase tracking-[0.3em] font-bold">
                Cabinet Rebecca Kulufio | Défense & Mentorat
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[70vh]">
              {/* Coordonnées Client */}
              <div className="space-y-5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 border-b border-slate-100 dark:border-slate-800 pb-2">Vore Identité</h4>
                <div className="relative">
                  <FaUser className="absolute left-0 top-3 text-amber-600/50 text-xs" />
                  <input type="text" placeholder="Nom Complet / Raison Sociale" required className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-amber-600 outline-none transition-all dark:text-white" />
                </div>
                <div className="relative">
                  <FaEnvelope className="absolute left-0 top-3 text-amber-600/50 text-xs" />
                  <input type="email" placeholder="Email Professionnel" required className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-amber-600 outline-none transition-all dark:text-white" />
                </div>
                <div className="relative">
                  <FaPhone className="absolute left-0 top-3 text-amber-600/50 text-xs" />
                  <input type="tel" placeholder="Téléphone / WhatsApp" className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-amber-600 outline-none transition-all dark:text-white" />
                </div>
              </div>

              {/* Détails de l'Expertise */}
              <div className="space-y-5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-600 border-b border-slate-100 dark:border-slate-800 pb-2">Nature de la Requête</h4>
                <div className="relative">
                  <FaBalanceScale className="absolute left-0 top-3 text-amber-600/50 text-xs" />
                  <select 
                    value={formData.projectType}
                    onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                    className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-amber-600 outline-none appearance-none dark:text-white"
                  >
                    <option value="" className="dark:bg-slate-900">Type de service</option>
                    {EXPERTISES.map(s => <option key={s.value} value={s.value} className="dark:bg-slate-900">{s.label}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <FaClock className="absolute left-0 top-3 text-amber-600/50 text-xs" />
                  <select className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-amber-600 outline-none appearance-none dark:text-white">
                    <option value="" className="dark:bg-slate-900">Urgence du dossier</option>
                    {URGENCIES.map(t => <option key={t.value} value={t.value} className="dark:bg-slate-900">{t.label}</option>)}
                  </select>
                </div>
                <div className="relative">
                  <FaBriefcase className="absolute left-0 top-3 text-amber-600/50 text-xs" />
                  <input type="text" placeholder="Secteur d'activité" className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-amber-600 outline-none transition-all dark:text-white" />
                </div>
              </div>

              {/* Message */}
              <div className="md:col-span-2 mt-4">
                <textarea rows="3" placeholder="Veuillez résumer votre situation ou vos besoins en coaching..." className="w-full p-4 bg-slate-50 dark:bg-slate-800 text-sm border border-slate-100 dark:border-slate-700 focus:border-amber-600 outline-none dark:text-white transition-all" />
              </div>

              <div className="md:col-span-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-amber-600 text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-900/20"
                >
                  {loading ? 'Traitement du dossier...' : <><FaPaperPlane size={12} /> Envoyer la demande</>}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
