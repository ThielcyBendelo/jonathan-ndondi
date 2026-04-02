import { useState, useEffect } from 'react';
import { contact } from '../assets/assets.js';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import { init, send } from '@emailjs/browser';
import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
} from 'react-icons/fa';
import notificationService from '../services/notificationService';
import analyticsService from '../services/analyticsService';
import messagingService from '../dashboard/services/messagingService';

const contactIcons = {
  Email: FaEnvelope,
  LinkedIn: FaLinkedin,
  GitHub: FaGithub,
  Instagram: FaInstagram,
  Facebook: FaFacebook,
  WhatsApp: FaWhatsapp,
};

export default function Contact() {
  const [elementRef, isVisible] = useIntersectionObserver();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  // Read EmailJS credentials from Vite environment variables.
  // Create a .env file at the project root (see .env.example) to set these.
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

  useEffect(() => {
    // Initialize EmailJS with your public key if available
    try {
      if (EMAILJS_PUBLIC_KEY) init(EMAILJS_PUBLIC_KEY);
    } catch (err) {
      console.warn('EmailJS init failed', err);
    }
  }, [EMAILJS_PUBLIC_KEY]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Envoi en cours...' });

    // Tracker la tentative d'envoi du formulaire
    analyticsService.trackEvent('contact_form_submit', {
      hasName: !!formData.name,
      hasEmail: !!formData.email,
      messageLength: formData.message.length,
      category: 'contact',
    });

    // Toast de chargement
    const loadingToast = notificationService.loading(
      'Envoi de votre message en cours...'
    );

    // If EmailJS is not configured, fallback to mailto
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      const mailtoLink = `mailto:bendelothielcy@gmail.com?subject=Message de ${encodeURIComponent(
        formData.name
      )}&body=${encodeURIComponent(
        `Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
      // Fermer le toast de chargement et afficher succès
      notificationService.dismiss(loadingToast);
      notificationService.success('Client email ouvert avec succès !', {
        icon: '📧',
      });

      setStatus({
        type: 'success',
        message: 'Ouverture de votre client email...',
      });
      return;
    }

    // Send via EmailJS (client-side)
    try {
      const templateParams = {
        from_name: formData.name,
        to_reply: formData.email,
        message: formData.message,
        to_email: 'ingebalouiscar@gmail.com',
      };

      await send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

      // 📧 Sauvegarder dans le dashboard
      try {
        messagingService.addMessage({
          senderName: formData.name,
          senderEmail: formData.email,
          subject: 'Message depuis le site web',
          message: formData.message,
          source: 'contact_form',
          timestamp: new Date().toISOString(),
        });
        console.log('✅ Message sauvegardé dans le dashboard');
      } catch (saveError) {
        console.warn('⚠️ Erreur sauvegarde dashboard:', saveError);
        // Ne pas bloquer le processus si la sauvegarde échoue
      }

      // Fermer le toast de chargement et afficher succès
      notificationService.dismiss(loadingToast);
      notificationService.formSuccess(
        'Message envoyé avec succès !',
        'Je vous répondrai dans les plus brefs délais. Merci !'
      );

      setStatus({
        type: 'success',
        message: 'Message envoyé avec succès ! Merci.',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('EmailJS send error', err);
      // Fallback to mailto on error
      const mailtoLink = `mailto:bendelothielcy@gmail.com?subject=Message de ${encodeURIComponent(
        formData.name
      )}&body=${encodeURIComponent(
        `Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
      // Fermer le toast de chargement et afficher erreur
      notificationService.dismiss(loadingToast);
      notificationService.warning(
        'Envoi par EmailJS échoué. Ouverture de votre client email...',
        { autoClose: 5000 }
      );

      setStatus({
        type: 'error',
        message:
          'Échec EmailJS. Ouverture de votre client email comme alternative...',
      });
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section ref={elementRef} id="contact" className="py-20 px-4 bg-dark-200">
      <div
        className={`max-w-4xl mx-auto transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Contact
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Formulaire */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-8 bg-dark-300/50 backdrop-blur-sm rounded-2xl 
                       shadow-2xl shadow-purple-500/20 border border-gray-700/50 
                       hover:shadow-purple-500/30 transition-all duration-300 
                       order-1 md:order-none"
          >
            {(!EMAILJS_SERVICE_ID ||
              !EMAILJS_TEMPLATE_ID ||
              !EMAILJS_PUBLIC_KEY) && (
              <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  ⚠️ EmailJS non configuré. Le formulaire utilisera votre client
                  email par défaut.
                </p>
              </div>
            )}

            <div>
              <label className="block text-gray-400 mb-2">Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="contact-input w-full px-4 py-3 bg-dark-100 border border-gray-600/50 rounded-xl
                         text-white placeholder-gray-400 focus:outline-none focus:border-purple 
                         focus:ring-2 focus:ring-purple/20 transition-all duration-300 
                         shadow-inner backdrop-blur-sm"
                placeholder="Votre nom complet"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="contact-input w-full px-4 py-3 bg-dark-100 border border-gray-600/50 rounded-xl
                         text-white placeholder-gray-400 focus:outline-none focus:border-purple 
                         focus:ring-2 focus:ring-purple/20 transition-all duration-300 
                         shadow-inner backdrop-blur-sm"
                placeholder="votre.email@exemple.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="contact-input w-full px-4 py-3 bg-dark-100 border border-gray-600/50 rounded-xl
                         text-white placeholder-gray-400 focus:outline-none focus:border-purple 
                         focus:ring-2 focus:ring-purple/20 transition-all duration-300 
                         shadow-inner backdrop-blur-sm resize-none"
                placeholder="Décrivez votre projet ou votre message..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-purple to-pink text-white 
                       rounded-xl transform transition-all hover:scale-105 
                       hover:shadow-2xl hover:shadow-purple-500/40 disabled:opacity-50
                       font-semibold shadow-lg shadow-purple-500/25"
              disabled={status.type === 'loading'}
            >
              {status.type === 'loading' ? 'Envoi...' : 'Envoyer le message'}
            </button>

            {status.message && (
              <p
                className={`text-center ${
                  status.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {status.message}
              </p>
            )}
          </form>

          {/* Liens de contact */}
          <div className="space-y-6 order-2 md:order-none">
            <h3 className="text-xl font-bold text-gray-300 mb-4 text-center md:text-left">
              Autres moyens de me contacter
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {contact.map((c, idx) => {
                const Icon = contactIcons[c.label];
                let href = c.link;
                if (c.label === 'Email' && !/^mailto:/i.test(href))
                  href = `mailto:${href}`;
                return (
                  <a
                    key={idx}
                    href={href}
                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={
                      href.startsWith('mailto:')
                        ? undefined
                        : 'noopener noreferrer'
                    }
                    onClick={() => {
                      analyticsService.trackEvent('contact_link_click', {
                        platform: c.label,
                        category: 'social_media',
                      });
                    }}
                    className="flex items-center gap-3 p-3 sm:p-4 bg-dark-300 text-gray-300 rounded-lg
                             transform transition-all hover:scale-[1.02] hover:bg-dark-400 
                             hover:text-white border border-dark-300 hover:border-purple
                             text-sm sm:text-base"
                  >
                    {Icon && <Icon className="text-xl" />}
                    <span>{c.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
