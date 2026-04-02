import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import dataService from '../services/dataService';

export default function ClientRegistration({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Vérifier que les champs requis sont remplis
      if (!formData.name || !formData.email) {
        toast.error("Veuillez remplir au moins le nom et l'email.");
        setIsSubmitting(false);
        return;
      }

      // Ajouter le client dans le service
      const newClient = dataService.addClient(formData);
      console.log('Client ajouté:', newClient); // Debug

      toast.success(
        'Demande envoyée avec succès ! Nous vous contacterons bientôt.'
      );
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        message: '',
      });
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error("Erreur lors de l'ajout du client:", error);
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Fonction pour rediriger et scroller vers la section témoignages
  const goToTestimonials = () => {
    window.location.href = '/#testimonials';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-300 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Demande de Projet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Nom complet *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white focus:border-purple"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white focus:border-purple"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white focus:border-purple"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Entreprise</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white focus:border-purple"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Type de projet</label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white focus:border-purple"
              >
                <option value="">Sélectionner...</option>
                <option value="site-web">Site Web</option>
                <option value="e-commerce">E-commerce</option>
                <option value="application">Application Web</option>
                <option value="mobile">Application Mobile</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Budget estimé</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white focus:border-purple"
              >
                <option value="">Sélectionner...</option>
                <option value="500-1000">500€ - 1000€</option>
                <option value="1000-5000">1000€ - 5000€</option>
                <option value="5000-10000">5000€ - 10000€</option>
                <option value="10000+">10000€+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Description du projet
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 bg-dark-200 border border-dark-400 rounded-lg text-white focus:border-purple resize-none"
              placeholder="Décrivez votre projet, vos besoins, délais..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-dark-400 text-gray-300 rounded-lg hover:bg-dark-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg 
                       hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi...' : 'Envoyer la demande'}
            </button>
          </div>
        </form>
        {/* Bouton Voir les témoignages */}
        <div className="pt-6 text-center">
          <button
            type="button"
            onClick={goToTestimonials}
            className="px-4 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg hover:shadow-lg transition-all font-semibold"
          >
            Voir les témoignages
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
}
