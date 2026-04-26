import { useState, useEffect } from 'react';
import { contact } from '../assets/assets.js';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { init, send } from '@emailjs/browser';
import { FaEnvelope, FaLinkedin, FaInstagram, FaWhatsapp, FaPaperPlane, FaMapMarkerAlt, FaPhoneAlt, FaClock, FaBriefcase } from 'react-icons/fa';
import notificationService from '../services/notificationService';

const contactIcons = {
  Email: FaEnvelope,
  LinkedIn: FaLinkedin,
  Instagram: FaInstagram,
  WhatsApp: FaWhatsapp,
};

export default function Contact() {
  const [elementRef, isVisible] = useIntersectionObserver();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Audit Assurance Collective', message: '', company: '' });

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) init(EMAILJS_PUBLIC_KEY);
  }, [EMAILJS_PUBLIC_KEY]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = notificationService.loading('Transmission de votre demande au cabinet...');

    try {
      const templateParams = {
        from_name: formData.name,
        company: formData.company,
        subject: formData.subject,
        to_reply: formData.email,
        message: formData.message,
        to_email: 'votre-mail-pro@domaine.fr',
      };

      await send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      notificationService.dismiss(loadingToast);
      notificationService.success('Demande transmise. Nous reviendrons vers vous sous 24h.');
      setFormData({ name: '', email: '', subject: 'Audit Assurance Collective', message: '', company: '' });
    } catch (err) {
      notificationService.dismiss(loadingToast);
      notificationService.error('Erreur d\'envoi. Redirection vers votre messagerie...');
      window.location.href = `mailto:votre-mail-pro@domaine.fr?subject=${formData.subject}&body=${formData.message}`;
    }
  };

  return (
    <section ref={elementRef} id="contact" className="py-24 bg-white dark:bg-[#0f172a] transition-all duration-500 min-h-screen">
      <div className={`max-w-7xl mx-auto px-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
        
        {/* Header Institutionnel */}
        <div className="mb-20 border-l-8 border-orange-500 pl-8">
          <h2 className="text-sm tracking-[0.4em] uppercase text-[#191970] dark:text-orange-500 font-bold mb-2">Contact & Audit</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#191970] dark:text-white uppercase tracking-tighter">
            Planifier une <span className="font-light italic text-orange-500">Expertise</span>
          </h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          
          {/* Colonne Coordonnées Paris */}
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-black text-orange-500 mb-6">Expertise Parisienne</h4>
              <div className="space-y-6 text-slate-500 dark:text-slate-400 font-light text-sm">
                <p className="flex items-start gap-3"><FaMapMarkerAlt className="mt-1 text-orange-500"/> Paris & Île-de-France (Déplacements en entreprise)</p>
                <p className="flex items-center gap-3"><FaPhoneAlt className="text-orange-500"/> +33 [Votre Numéro]</p>
                <p className="flex items-center gap-3"><FaEnvelope className="text-orange-500"/> contact@rebeccakulufio.fr</p>
                <p className="flex items-center gap-3"><FaClock className="text-orange-500"/> Lun - Ven: 08h30 - 18h30</p>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-black text-orange-500 mb-6">Réseau Professionnel</h4>
              <div className="flex gap-6">
                {contact.map((item) => {
                  const Icon = contactIcons[item.label];
                  return Icon ? (
                    <a key={item.label} href={item.link} target="_blank" rel="noreferrer" 
                       className="text-xl text-slate-400 hover:text-[#191970] dark:hover:text-orange-500 transition-all transform hover:-translate-y-1">
                      <Icon />
                    </a>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          {/* Formulaire de Consultation B2B */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900 p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="relative border-b border-slate-200 dark:border-slate-700 py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Responsable</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                         required className="w-full bg-transparent outline-none text-[#191970] dark:text-white text-sm" placeholder="Nom complet" />
                </div>
                <div className="relative border-b border-slate-200 dark:border-slate-700 py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Email Professionnel</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                         required className="w-full bg-transparent outline-none text-[#191970] dark:text-white text-sm" placeholder="votre@entreprise.fr" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="relative border-b border-slate-200 dark:border-slate-700 py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Entreprise</label>
                  <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})}
                         required className="w-full bg-transparent outline-none text-[#191970] dark:text-white text-sm" placeholder="Raison Sociale" />
                </div>
                <div className="relative border-b border-slate-200 dark:border-slate-700 py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Objet de l'expertise</label>
                  <select 
                    className="w-full bg-transparent outline-none text-[#191970] dark:text-white text-sm appearance-none cursor-pointer"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  >
                    <option value="Audit Assurance Collective">Audit Assurance Collective</option>
                    <option value="Accompagnement Stratégique PME">Accompagnement Stratégique PME</option>
                    <option value="Gestion de Comptes / Prévoyance">Gestion de Comptes / Prévoyance</option>
                    <option value="Protection du Dirigeant">Protection du Dirigeant</option>
                  </select>
                </div>
              </div>

              <div className="relative border-b border-slate-200 dark:border-slate-700 py-2 mb-12">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Message / Briefing</label>
                <textarea rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                          required className="w-full bg-transparent outline-none text-[#191970] dark:text-white text-sm resize-none" 
                          placeholder="Précisez votre besoin ou le nombre de salariés concernés..." />
              </div>

              <button type="submit" className="w-full md:w-auto px-12 py-5 bg-[#191970] text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-orange-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20">
                <FaPaperPlane size={12} /> Lancer la procédure d'audit
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
