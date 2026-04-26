import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import emailService from '../services/emailService';
import { 
  FaUser, FaEnvelope, FaPhone, FaBuilding, FaClock, 
  FaPaperPlane, FaTimes, FaShieldAlt, FaChartPie, FaUsers 
} from 'react-icons/fa';

const SOLUTIONS = [
  { value: 'Sante', label: 'Santé Collective (Mutuelle)' },
  { value: 'Prevoyance', label: 'Prévoyance & Retraite' },
  { value: 'Audit', label: 'Audit & Optimisation des Charges' },
  { value: 'Dirigeant', label: 'Protection du Dirigeant (TNS)' },
  { value: 'Entrepreneuriat', label: 'Conseil en Stratégie Business' },
];

const TAILLE_ENTREPRISE = [
  { value: 'TPE', label: 'Indépendant / TPE (1-10 salariés)' },
  { value: 'PME', label: 'PME (11-50 salariés)' },
  { value: 'ETI', label: 'ETI / Grande Entreprise (50+)' },
];

export default function QuoteModal({ isOpen, onClose, defaultService }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', 
    projectType: defaultService || '', companySize: '', message: ''
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
      if (res.success) setTimeout(() => { onClose(); setResult(null); }, 2000);
    } catch {
      setResult({ success: false, message: "Erreur lors de l'envoi." });
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#191970]/90 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div 
            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-sm shadow-2xl relative overflow-hidden border border-orange-500/20"
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          >
            {/* Header Institutionnel */}
            <div className="bg-[#191970] p-8 text-white border-b border-orange-500/30">
              <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-orange-500 transition-colors">
                <FaTimes size={20} />
              </button>
              <h2 className="text-2xl font-serif font-bold mb-1 tracking-wide">Audit & Expertise</h2>
              <p className="text-orange-500 text-[9px] uppercase tracking-[0.3em] font-bold">
                Rebecca Kulufio | Protection Sociale & Stratégie Paris
              </p>
            </div>

            {result ? (
              <div className="p-12 text-center space-y-4">
                <div className="text-orange-500 text-5xl flex justify-center"><FaShieldAlt /></div>
                <h3 className="text-xl font-bold dark:text-white">{result.success ? "Demande transmise" : "Une erreur est survenue"}</h3>
                <p className="text-slate-500 text-sm">{result.message || "Notre cabinet reviendra vers vous sous 24h ouvrées."}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[70vh]">
                {/* Identification */}
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-500 border-b border-slate-100 dark:border-slate-800 pb-2">Identification</h4>
                  <div className="relative">
                    <FaUser className="absolute left-0 top-3 text-orange-500/50 text-xs" />
                    <input type="text" placeholder="Nom complet du responsable" required className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-orange-500 outline-none transition-all dark:text-white" />
                  </div>
                  <div className="relative">
                    <FaEnvelope className="absolute left-0 top-3 text-orange-500/50 text-xs" />
                    <input type="email" placeholder="Email professionnel" required className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-orange-500 outline-none transition-all dark:text-white" />
                  </div>
                  <div className="relative">
                    <FaBuilding className="absolute left-0 top-3 text-orange-500/50 text-xs" />
                    <input type="text" placeholder="Nom de l'entreprise" required className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-orange-500 outline-none transition-all dark:text-white" />
                  </div>
                </div>

                {/* Analyse du Besoin */}
                <div className="space-y-5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-500 border-b border-slate-100 dark:border-slate-800 pb-2">Analyse du Besoin</h4>
                  <div className="relative">
                    <FaShieldAlt className="absolute left-0 top-3 text-orange-500/50 text-xs" />
                    <select 
                      value={formData.projectType}
                      onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                      className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-orange-500 outline-none appearance-none dark:text-white"
                    >
                      <option value="" className="dark:bg-slate-900">Expertise souhaitée</option>
                      {SOLUTIONS.map(s => <option key={s.value} value={s.value} className="dark:bg-slate-900">{s.label}</option>)}
                    </select>
                  </div>
                  <div className="relative">
                    <FaUsers className="absolute left-0 top-3 text-orange-500/50 text-xs" />
                    <select className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-orange-500 outline-none appearance-none dark:text-white">
                      <option value="" className="dark:bg-slate-900">Effectif de la structure</option>
                      {TAILLE_ENTREPRISE.map(t => <option key={t.value} value={t.value} className="dark:bg-slate-900">{t.label}</option>)}
                    </select>
                  </div>
                  <div className="relative">
                    <FaPhone className="absolute left-0 top-3 text-orange-500/50 text-xs" />
                    <input type="tel" placeholder="Ligne directe" className="w-full pl-6 py-2 border-b border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:border-orange-500 outline-none transition-all dark:text-white" />
                  </div>
                </div>

                {/* Brief Technique */}
                <div className="md:col-span-2 mt-4">
                  <textarea rows="3" placeholder="Précisez votre demande (ex: Renégociation mutuelle, audit CCN, protection dirigeant...)" className="w-full p-4 bg-slate-50 dark:bg-slate-800 text-sm border border-slate-100 dark:border-slate-700 focus:border-orange-500 outline-none dark:text-white transition-all" />
                </div>

                <div className="md:col-span-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-orange-500 text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-900/20"
                  >
                    {loading ? 'Analyse en cours...' : <><FaPaperPlane size={12} /> Solliciter un expert</>}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
