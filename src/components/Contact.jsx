import { useState, useEffect } from 'react';
import { contact } from '../assets/assets.js';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { init, send } from '@emailjs/browser';
import { FaEnvelope, FaLinkedin, FaInstagram, FaWhatsapp, FaPaperPlane, FaMapMarkerAlt, FaPhoneAlt, FaClock } from 'react-icons/fa';
import notificationService from '../services/notificationService';

const contactIcons = {
  Email: FaEnvelope,
  LinkedIn: FaLinkedin,
  Instagram: FaInstagram,
  WhatsApp: FaWhatsapp,
};

export default function Contact() {
  const [elementRef, isVisible] = useIntersectionObserver();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'Consultation Juridique', message: '' });

  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) init(EMAILJS_PUBLIC_KEY);
  }, [EMAILJS_PUBLIC_KEY]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = notificationService.loading('Envoi de votre demande au cabinet...');

    try {
      const templateParams = {
        from_name: formData.name,
        subject: formData.subject,
        to_reply: formData.email,
        message: formData.message,
        to_email: 'contact@votre-domaine.com', // À mettre à jour
      };

      await send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      notificationService.dismiss(loadingToast);
      notificationService.success('Votre message a été transmis avec succès.');
      setFormData({ name: '', email: '', subject: 'Consultation Juridique', message: '' });
    } catch (err) {
      notificationService.dismiss(loadingToast);
      notificationService.error('Échec de l\'envoi automatique.');
      window.location.href = `mailto:votre-email@://gmail.com{formData.subject}&body=${formData.message}`;
    }
  };

  return (
    <section ref={elementRef} id="contact" className="py-24 bg-white dark:bg-slate-950 transition-all duration-500 min-h-screen">
      <div className={`max-w-7xl mx-auto px-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
        
        {/* Header de Prestige */}
        <div className="mb-20 border-l-8 border-amber-600 pl-8">
          <h2 className="text-sm tracking-[0.4em] uppercase text-slate-400 font-bold mb-2">Contact</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white italic">
            Solliciter une <span className="font-light not-italic text-amber-600">Expertise</span>
          </h3>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          
          {/* Colonne Coordonnées */}
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-amber-600 mb-6">Le Cabinet</h4>
              <div className="space-y-6 text-slate-500 dark:text-slate-400 font-light text-sm">
                <p className="flex items-start gap-3"><FaMapMarkerAlt className="mt-1 text-amber-600"/> Gombe, Kinshasa, République Démocratique du Congo</p>
                <p className="flex items-center gap-3"><FaPhoneAlt className="text-amber-600"/> +243 [Votre Numéro]</p>
                <p className="flex items-center gap-3"><FaEnvelope className="text-amber-600"/> contact@votre-domaine.com</p>
                <p className="flex items-center gap-3"><FaClock className="text-amber-600"/> Lun - Ven: 09h00 - 17h00</p>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-amber-600 mb-6">Suivre l'impact</h4>
              <div className="flex gap-6">
                {contact.map((item) => {
                  const Icon = contactIcons[item.label];
                  return Icon ? (
                    <a key={item.label} href={item.link} target="_blank" rel="noreferrer" 
                       className="text-xl text-slate-400 hover:text-amber-600 transition-all transform hover:-translate-y-1">
                      <Icon />
                    </a>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          {/* Formulaire de Consultation */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900 p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="relative border-b border-slate-200 dark:border-slate-700 py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Identité</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                         required className="w-full bg-transparent outline-none text-slate-900 dark:text-white text-sm" placeholder="Nom ou Entreprise" />
                </div>
                <div className="relative border-b border-slate-200 dark:border-slate-700 py-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                         required className="w-full bg-transparent outline-none text-slate-900 dark:text-white text-sm" placeholder="votre@email.com" />
                </div>
              </div>

              <div className="relative border-b border-slate-200 dark:border-slate-700 py-2 mb-8">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Objet de la demande</label>
                <select 
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-white text-sm appearance-none"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                >
                  <option value="Consultation Juridique" className="dark:bg-slate-900">Consultation Juridique</option>
                  <option value="Coaching Business" className="dark:bg-slate-900">Coaching Business / Mentorat</option>
                  <option value="Demande de Conférence" className="dark:bg-slate-900">Demande de Conférence</option>
                  <option value="Livres / Dédicaces" className="dark:bg-slate-900">Ouvrages & Éditions</option>
                </select>
              </div>

              <div className="relative border-b border-slate-200 dark:border-slate-700 py-2 mb-12">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block mb-1">Détails de votre requête</label>
                <textarea rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                          required className="w-full bg-transparent outline-none text-slate-900 dark:text-white text-sm resize-none" 
                          placeholder="Comment puis-je vous accompagner ?" />
              </div>

              <button type="submit" className="w-full md:w-auto px-12 py-4 bg-amber-600 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-900/20">
                <FaPaperPlane size={12} /> Envoyer la Requête
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
