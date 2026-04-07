import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import dataService from '../services/dataService';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaBuilding, FaMapMarkedAlt, FaLayerGroup } from 'react-icons/fa';

export default function ClientRegistration({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '',
    projectType: '', budget: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!formData.name || !formData.email) {
        toast.error("Nom et Email sont obligatoires.");
        setIsSubmitting(false);
        return;
      }
      dataService.addClient(formData);
      toast.success('Dossier enregistré. Notre bureau vous contactera.');
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      toast.error("Échec de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl"
      >
        {/* Header Architectural */}
        <div className="bg-slate-950 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif italic tracking-wide">Fiche de Projet</h2>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mt-1">Consultation Initiale | LEGACY</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Identité */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-b border-slate-200 dark:border-slate-700 py-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Maître d'Ouvrage (Nom)</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-transparent text-sm outline-none dark:text-white" placeholder="Nom complet ou Entité" />
            </div>
            <div className="border-b border-slate-200 dark:border-slate-700 py-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Contact Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-transparent text-sm outline-none dark:text-white" placeholder="adresse@exemple.com" />
            </div>
          </div>

          {/* Localisation & Structure */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-b border-slate-200 dark:border-slate-700 py-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Téléphone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-transparent text-sm outline-none dark:text-white" placeholder="+243..." />
            </div>
            <div className="border-b border-slate-200 dark:border-slate-700 py-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Organisme / Société</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-transparent text-sm outline-none dark:text-white" placeholder="Optionnel" />
            </div>
          </div>

          {/* Spécifications du Projet */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-b border-slate-200 dark:border-slate-700 py-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Typologie d'Ouvrage</label>
              <select name="projectType" value={formData.projectType} onChange={handleChange} className="w-full bg-transparent text-sm outline-none dark:text-white appearance-none cursor-pointer">
                <option value="" className="dark:bg-slate-900 italic">Sélectionner...</option>
                <option value="residentiel" className="dark:bg-slate-900">Résidentiel de Luxe</option>
                <option value="commercial" className="dark:bg-slate-900">Complexe Commercial</option>
                <option value="industriel" className="dark:bg-slate-900">Infrastructure Industrielle</option>
                <option value="publique" className="dark:bg-slate-900">Équipement Public</option>
              </select>
            </div>
            <div className="border-b border-slate-200 dark:border-slate-700 py-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Estimation Budgétaire</label>
              <select name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-transparent text-sm outline-none dark:text-white appearance-none cursor-pointer">
                <option value="" className="dark:bg-slate-900">À définir</option>
                <option value="premium" className="dark:bg-slate-900">Standard (Consultation)</option>
                <option value="luxe" className="dark:bg-slate-900">Prestige (Haute Facture)</option>
                <option value="institutionnel" className="dark:bg-slate-900">Grands Comptes / Étatique</option>
              </select>
            </div>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-700 py-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Note de Programme (Vision & Besoins)</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows="3" className="w-full bg-transparent text-sm outline-none dark:text-white resize-none" placeholder="Décrivez votre vision architecturale..." />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-slate-950 dark:bg-white text-white dark:text-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-slate-800 transition-all">
              {isSubmitting ? 'Validation...' : 'Soumettre le Dossier'}
            </button>
            <button type="button" onClick={() => window.location.href='/#testimonials'} className="flex-1 py-4 border border-slate-200 dark:border-slate-700 text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-slate-50 transition-all">
              Voir Références
            </button>
          </div>
        </form>
      </motion.div>
      <ToastContainer position="bottom-center" theme={document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'} />
    </div>
  );
}
