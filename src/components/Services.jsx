import React, { useState } from "react";
import QuoteModal from "./QuoteModal";

const services = [
  {
    title: "Gestion de l'image de marque",
    description:
      "  Pilotage de la communication externe et des relations presse pour l'agence.",
    template:
      "Stratégie de communication, rédaction de communiqués de presse, gestion des réseaux sociaux, organisation d'événements et suivi des campagnes publicitaires.",
    benefits: ["Stratégie personnalisée", "Rédaction professionnelle", "Gestion de crise", "Reporting détaillé"],
  },
  {
    title: "Maintien en Condition Opérationnelle (MCO)",
    description:
      "Surveillance, mises à jour et optimisation des infrastructures serveurs et parcs informatiques.",
    template:
      "Monitoring 24/7, gestion des incidents, mises à jour de sécurité, optimisation des performances et support technique proactif.",
    benefits: ["Surveillance continue", "Intervention rapide", "Mises à jour régulières", "Optimisation des performances"],
  },
  {
    title: "Interface Client-Technique",
    description:
      "Traduction des besoins business en spécifications techniques pour les développeurs.",
    template:
      "Rédaction de cahiers des charges, gestion de projets Agile, coordination entre équipes marketing et développement, validation des livrables et suivi de la qualité.",
    benefits: [" Communication fluide", "Documentation claire", "Gestion de projet efficace", "Validation rigoureuse"],
  },
  {
    title: "Support & Continuité de Service",
    description:
      " Gestion des incidents et maintenance préventive des systèmes déployés.",
    template:
      "Support technique 24/7, maintenance préventive, gestion des sauvegardes, monitoring des serveurs et optimisation des performances pour garantir la disponibilité de vos services.",
    benefits: ["Audit RGPD", "Rapport détaillé", "Intervention rapide", "Formation incluse"],
  },
];

function Services() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleQuoteClick = (serviceKey) => {
    setSelectedService(serviceKey);
    setModalOpen(true);
  };

  return (
    <section className="py-10 px-4 bg-gradient-to-b from-back-400 via-black to-blue-50" id="services">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 text-center">
          <h2 className="text-5xl font-extrabold text-blue-700 mb-2 mt-16 tracking-tight drop-shadow-lg">Mes Services</h2>
          <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto mb-6">Allier la rigueur technique de la maintenance système à la finesse des relations publiques. Je propose des solutions globales pour garantir la haute disponibilité de vos infrastructures tout en optimisant l'image de marque et l'engagement de vos partenaires</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-black via-gray-50 to-blue-100 rounded-3xl shadow-2xl p-8 flex flex-col items-center text-center border border-blue-100 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 hover:bg-blue-50 group"
              style={{ animation: `fadeInUp 0.7s cubic-bezier(.39,.575,.565,1) ${idx * 0.15}s both` }}
            >
              <div className="text-6xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">{service.icon}</div>
              <h3 className="text-2xl font-extrabold mb-2 text-blue-700 tracking-tight drop-shadow">{service.title}</h3>
              <p className="text-gray-900 mb-2 font-medium">{service.description}</p>
              <div className="mb-2 text-sm text-indigo-700 font-semibold">Template : {service.template}</div>
              {/* <div className="mb-2 text-sm text-blue-700"><span className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-1 mr-1">Durée estimée :</span> {service.duration}</div> */}
              <div className="mb-2 flex flex-wrap justify-center gap-2">
                {service.benefits && service.benefits.map((b, i) => (
                  <span key={i} className="inline-block bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-semibold shadow">{b}</span>
                ))}
              </div>
              {/* <div className="mb-2 text-sm">
                <a
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 underline hover:text-blue-800 font-semibold transition"
                >
                  Voir un exemple
                </a>
              </div> */}
              <div className="mb-4 text-lg font-bold text-green-700">Tarif : {service.price}</div>
              <button
                className="mt-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-transform duration-300 transform hover:scale-105 focus:scale-100 active:scale-95"
                onClick={() => handleQuoteClick(getServiceKey(service.title))}
              >
                {service.action}
              </button>
            </div>
          ))}
        </div>
        <QuoteModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultService={selectedService}
        />
        <style>{`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(40px) scale(0.96); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </section>
  );
  // Helper pour convertir le titre en clé EmailJS
  function getServiceKey(title) {
    switch (title) {
      case "Développement Web": return "site-web";
      case "Applications Mobiles": return "mobile";
      case "Design UI/UX": return "application";
      case "Cybersécurité": return "cybersecurite";
      case "Maintenance Systèmes": return "maintenance";
      case "Services Cloud": return "cloud";
      default: return "autre";
    }
  }
}

export default Services;