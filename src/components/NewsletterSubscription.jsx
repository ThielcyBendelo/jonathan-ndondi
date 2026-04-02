
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { newsletterService } from '../services/newsletterService.firebase';
import { exportSubscribersToCSV } from './NewsletterExportCSV';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [subscribers, setSubscribers] = useState([]);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await newsletterService.addSubscriber(email);
      const subs = await newsletterService.getSubscribers();
      setSubscribers(subs);
      toast.success('Abonnement réussi ! Merci de nous rejoindre.');
      setEmail('');
      setShowModal(false);
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error);
      if (error.message.includes('déjà abonné')) {
        toast.info('Vous êtes déjà abonné à notre newsletter.');
      } else {
        toast.error("Erreur lors de l'abonnement. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Charger les abonnés au montage
  React.useEffect(() => {
    newsletterService.getSubscribers().then(setSubscribers);
  }, []);

  return (
    <div className="bg-dark-300/50 rounded-2xl p-6 border border-dark-300/60">
      <h3 className="text-xl font-bold text-white mb-2">Newsletter</h3>
      <p className="text-gray-400 mb-4">
        Restez informé de mes derniers projets et articles tech
      </p>

      <div className="flex gap-3 mb-4">
        <button
          onClick={handleOpenModal}
          className="px-6 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg hover:shadow-lg"
        >
          S'abonner à la newsletter
        </button>
      </div>

      {/* Modal d'abonnement */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" aria-modal="true" role="dialog">
          <div className="bg-dark-300 rounded-2xl p-8 w-full max-w-md mx-auto relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
              aria-label="Fermer"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Abonnez-vous à la newsletter</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="newsletter-email" className="block text-gray-400 mb-1">Adresse email</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="w-full px-4 py-2 border rounded bg-dark-200 text-white"
                aria-label="Adresse email pour abonnement newsletter"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-purple text-white font-bold rounded"
                aria-busy={isSubmitting}
              >
                {isSubmitting ? '...' : "S'abonner"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Liste des abonnés (dashboard) */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-bold text-white">Abonnés</h4>
          <button
            className="px-4 py-1 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded shadow hover:scale-105 transition-transform font-semibold text-sm"
            onClick={() => exportSubscribersToCSV(subscribers)}
          >
            Export CSV
          </button>
        </div>
        {/* Récupère le rôle depuis le localStorage (défini à la connexion) */}
        {(() => { const userRole = localStorage.getItem('dashboardRole') || 'reader';
        return (
          <ul className="text-gray-300 text-sm max-h-40 overflow-y-auto">
            {subscribers.length === 0 ? (
              <li>Aucun abonné pour le moment.</li>
            ) : (
              subscribers.map((sub) => (
                <li key={sub.id} className="mb-1 flex justify-between items-center">
                  <span>
                    {sub.email} <span className="text-gray-500">({sub.status})</span>
                  </span>
                  {['admin','editor'].includes(userRole) && (
                    <button
                      className="ml-2 px-2 py-1 bg-pink/80 text-white rounded text-xs hover:bg-pink"
                      onClick={async () => {
                        if (!window.confirm('Voulez-vous vraiment supprimer cet abonné ?')) return;
                        try {
                          await newsletterService.deleteSubscriber(sub.id);
                          setSubscribers(await newsletterService.getSubscribers());
                        } catch {
                          toast.error("Erreur lors de la suppression de l'abonné.");
                        }
                      }}
                      aria-label="Supprimer l'abonné"
                    >
                      Supprimer
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        ); })()}
      </div>
    </div>
  );
}

