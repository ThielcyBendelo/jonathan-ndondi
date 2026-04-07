import { useState, useEffect } from 'react';
import { contact } from '../assets/assets.js';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { init, send } from '@emailjs/browser';
import { FaEnvelope, FaLinkedin, FaInstagram, FaWhatsapp, FaPaperPlane, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import notificationService from '../services/notificationService';

const contactIcons = {
  Email: FaEnvelope,
  LinkedIn: FaLinkedin,
  Instagram: FaInstagram,
  WhatsApp: FaWhatsapp,
};

export default function Contact() {
  const [elementRef, isVisible] = useIntersectionObserver();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) init(EMAILJS_PUBLIC_KEY);
  }, [EMAILJS_PUBLIC_KEY]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = notificationService.loading('Transmission de votre dossier...');

    try {
      const templateParams = {
        from_name: formData.name,
        to_reply: formData.email,
        message: formData.message,
        to_email: 'contact@legacyarchitects.org',
      };

      await send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      notificationService.dismiss(loadingToast);
      notificationService.success('Dossier transmis avec succès.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      notificationService.dismiss(loadingToast);
      notificationService.error('Erreur technique. Ouverture du client mail...');
      window.location.href = `mailto:ingebalouiscar@://gmail.com Architecture&body=${formData.message}`;
    }
  };

  return (
    <section ref={elementRef} id="contact" className="py-24 bg-white dark:bg-slate-950 transition-all duration-500 min-h-screen">
      <div className={`max-w-7xl mx-auto px-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
        
        {/* Header Architectural */}
        <div className="mb-20 border-l-8 border-slate-900 dark:border-white pl-8">
          <h2 className="text-sm tracking-[0.4em] uppercase text-slate-400 font-bold mb-2">Contact</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white italic">
            Initier votre <span className="font-light not-italic text-slate-500">Projet</span>
          </h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          
          {/* Colonne Coordonnées (1/3) */}
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-900 dark:text-white mb-6">Siège de l'Agence</h4>
              <div className="space-y-4 text-slate-500 dark:text-slate-400 font-light">
                <p className="flex items-center gap-3"><FaMapMarkerAlt /> Immeuble LYS CENTRE Local, 6, 29 Avenue des Forces Armées Kinshasa Gombe, RDC</p>
                <p className="flex items-center gap-3"><FaPhoneAlt /> +243 895 495 802</p>
                <p className="flex items-center gap-3"><FaPhoneAlt /> +243 811 349 537</p>
                <p className="flex items-center gap-3"><FaEnvelope /> contact@legacyarchitects.org</p>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-900 dark:text-white mb-6">Réseaux Professionnels</h4>
              <div className="flex gap-6">
                {contact.map((item) => {
                  const Icon = contactIcons[item.label];
                  return Icon ? (
                    <a key={item.label} href={item.link} target="_blank" rel="noreferrer" 
                       className="text-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all transform hover:-translate-y-1">
                      <Icon />
                    </a>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          {/* Formulaire de Consultation (2/3) */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900 p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="relative border-b border-slate-200 dark:border-slate-700 py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Nom Complet</label>
                  <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                         required className="w-full bg-transparent outline-none text-slate-900 dark:text-white text-sm" placeholder="Ex: Jean Mukendi" />
                </div>
                <div className="relative border-b border-slate-200 dark:border-slate-700 py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Email Professionnel</label>
                  <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                         required className="w-full bg-transparent outline-none text-slate-900 dark:text-white text-sm" placeholder="contact@domaine.com" />
                </div>
              </div>
              <div className="relative border-b border-slate-200 dark:border-slate-700 py-2 mb-12">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Description sommaire du projet</label>
                <textarea name="message" rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                          required className="w-full bg-transparent outline-none text-slate-900 dark:text-white text-sm resize-none" 
                          placeholder="Décrivez votre vision (Lieu, type de bâtiment, contraintes...)" />
              </div>

              <button type="submit" className="w-full md:w-auto px-12 py-4 bg-slate-950 dark:bg-white text-white dark:text-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                <FaPaperPlane size={12} /> Envoyer la Demande
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
