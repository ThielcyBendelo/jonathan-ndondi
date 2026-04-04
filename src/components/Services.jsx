import React, { useState } from "react";
import QuoteModal from "./QuoteModal"; // Assure-toi que ce fichier existe
import { FaBullhorn, FaServer, FaHandsHelping, FaShieldAlt, FaEnvelope } from "react-icons/fa";

const services = [
  {
    title: "Gestion de l'image de marque",
    icon: <FaBullhorn />,
    description: "Pilotage de la communication externe et des relations presse pour l'agence.",
    template: "Stratégie de communication, rédaction de communiqués de presse, gestion des réseaux sociaux, organisation d'événements et suivi des campagnes publicitaires.",
    benefits: ["Stratégie personnalisée", "Rédaction professionnelle", "Gestion de crise", "Reporting"],
    price: "Sur devis",
  },
  {
    title: "Maintien en Condition Opérationnelle (MCO)",
    icon: <FaServer />,
    description: "Surveillance, mises à jour et optimisation des infrastructures serveurs.",
    template: "Monitoring 24/7, gestion des incidents, mises à jour de sécurité, optimisation des performances et support technique proactif.",
    benefits: ["Surveillance continue", "Intervention rapide", "Mises à jour", "Optimisation"],
    price: "Sur devis",
  },
  {
    title: "Interface Client-Technique",
    icon: <FaHandsHelping />,
    description: "Traduction des besoins business en spécifications techniques pour les développeurs.",
    template: "Rédaction de cahiers des charges, gestion de projets Agile, coordination entre équipes marketing et développement, validation des livrables et suivi de qualité.",
    benefits: ["Communication fluide", "Documentation claire", "Gestion efficace", "Validation"],
    price: "Sur devis",
  },
  {
    title: "Support & Continuité de Service",
    icon: <FaShieldAlt />,
    description: "Gestion des incidents et maintenance préventive des systèmes déployés.",
    template: "Support technique 24/7, maintenance préventive, gestion des sauvegardes, monitoring des serveurs et optimisation des performances pour garantir disponibilté de vos services.",
    benefits: ["Audit RGPD", "Rapport détaillé", "Intervention rapide", "Formation"],
    price: "Sur devis",
  },
];

// Helper pour la modale
function getServiceKey(title) {
  const t = title.trim();
  if (t.includes("image de marque")) return "Gestion de image de marque";
  if (t.includes("MCO")) return "Maintien en Condition Opérationnelle (MCO)";
  if (t.includes("Interface")) return "Interface Client-Technique";
  if (t.includes("Support")) return "Support & Continuité de Service";
  return "autre";
}

export default function Services() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleQuoteClick = (serviceKey) => {
    setSelectedService(serviceKey);
    setModalOpen(true);
  };

  return (
    <section id="services" className="py-16 px-4 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mt-12 bg-gradient-to-r from-red-700 via-red-500 to-red-300 bg-clip-text text-transparent inline-block">
            Mes Services
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto mt-4">
            Allier la rigueur technique de la maintenance système à la finesse des relations publiques.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-zinc-900 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border border-gray-200 dark:border-zinc-800 transition-all duration-500 hover:-translate-y-2 group"
            >
              <div className="text-6xl mb-4 text-red-600 dark:text-red-500 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>

              <h3 className="text-2xl font-extrabold mb-2 text-gray-900 dark:text-white tracking-tight">
                {service.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                {service.description}
              </p>

              <div className="mb-4 p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl text-xs text-indigo-600 dark:text-indigo-400 font-semibold italic">
  <span className="block text-gray-500 dark:text-gray-500 mb-1 uppercase tracking-widest text-[10px]">Exemple / Template :</span>
  {service.template}
</div>
              <div className="mb-6 flex flex-wrap justify-center gap-2">
                {service.benefits.map((b, i) => (
                  <span key={i} className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full px-3 py-1 text-xs font-bold shadow-sm">
                    {b}
                  </span>
                ))}
              </div>

              <div className="mt-auto w-full flex flex-col gap-3">
                <div className="mb-2 text-lg font-bold text-green-600 dark:text-green-500">
                  Tarif : {service.price}
                </div>
                
                {/* Bouton 1 : Devis (Ouvre la modale) */}
                <button
                  onClick={() => handleQuoteClick(getServiceKey(service.title))}
                  className="w-full py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all transform active:scale-95"
                >
                  Demander un devis
                </button>

                {/* Bouton 2 : Mail (Ouvre le logiciel de mail) */}
                <a
                  href={`mailto:ingebalouiscar@gmail.com?subject=Information sur ${service.title}`}
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-red-600 dark:border-red-500 text-red-600 dark:text-red-500 rounded-xl font-bold hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all duration-300"
                >
                  <FaEnvelope /> Contacter moi
                </a>
              </div>
            </div>
          ))}
        </div>

        <QuoteModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          defaultService={selectedService}
        />
      </div>
    </section>
  );
}

  
