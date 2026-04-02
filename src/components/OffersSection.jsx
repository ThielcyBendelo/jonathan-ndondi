import React, { useState } from "react";
import QuoteModal from "./QuoteModal";

const offers = [
  {
    name: "Pack Starter",
    price: "600€",
    features: ["Site vitrine 1-5 pages", "Design personnalisé", "Référencement de base", "Livraison rapide"],
    best: false,
  },
  {
    name: "Pack Pro",
    price: "1200€",
    features: ["Site vitrine ou e-commerce", "Design avancé", "SEO optimisé", "Sécurité renforcée", "Support 3 mois"],
    best: true,
  },
  {
    name: "Pack Sur-mesure",
    price: "Sur devis",
    features: ["Application web/mobile", "Fonctionnalités avancées", "Accompagnement dédié", "Maintenance évolutive"],
    best: false,
  },
];

function OffersSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState("");

  const handleQuoteClick = (offerName) => {
    setSelectedOffer(offerName);
    setModalOpen(true);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 via-white to-gray-50" id="offers">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-6 drop-shadow-lg text-center">Nos Offres</h2>
        <p className="text-lg text-gray-700 mb-10 text-center">Des packs adaptés à tous les besoins, transparence et accompagnement garanti.</p>
        <div className="grid gap-8 md:grid-cols-3">
          {offers.map((offer, idx) => (
            <div key={idx} className={`bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border ${offer.best ? 'border-purple-400' : 'border-blue-100'} hover:shadow-2xl transition relative`}>
              {offer.best && <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-bold">Populaire</span>}
              <h3 className="text-xl font-bold text-blue-800 mb-2">{offer.name}</h3>
              <div className="text-3xl font-extrabold text-purple-700 mb-4">{offer.price}</div>
              <ul className="mb-4 space-y-2">
                {offer.features.map((f, i) => (
                  <li key={i} className="flex items-center text-gray-700"><span className="text-green-500 mr-2">✔️</span>{f}</li>
                ))}
              </ul>
              <button
                className="mt-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-transform duration-300 transform hover:scale-105"
                onClick={() => handleQuoteClick(offer.name)}
              >Demander un devis</button>
            </div>
          ))}
        </div>
        <QuoteModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultService={selectedOffer}
        />
      </div>
    </section>
  );
}

export default OffersSection;
