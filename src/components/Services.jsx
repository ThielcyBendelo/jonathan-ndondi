import React, { useState } from "react";
import QuoteModal from "./QuoteModal";
import { FaDraftingCompass, FaCity, FaHardHat, FaHandshake, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

const services = [
  {
    title: "Conception & Signature Architecturale",
    icon: <FaDraftingCompass />,
    description: "Création de concepts spatiaux uniques alliant esthétique intemporelle et fonctionnalité.",
    template: "Études d'esquisse, plans masse, modélisation BIM 3D, design d'intérieur de prestige et intégration bioclimatique.",
    benefits: ["Vision Créative", "Modélisation BIM", "Optimisation d'Espace"],
    price: "Sur Devis Technique",
  },
  {
    title: "Maîtrise d'Œuvre & Direction de Chantier",
    icon: <FaHardHat />,
    description: "Supervision rigoureuse de l'exécution pour garantir la conformité absolue aux plans.",
    template: "Coordination des corps d'état (OPC), suivi technique hebdomadaire, contrôle qualité des matériaux et respect des délais.",
    benefits: ["Zéro Retard", "Expertise Matériaux", "Gestion Budgétaire"],
    price: "Sur Devis Technique",
  },
  {
    title: "Urbanisme & Aménagement Urbain",
    icon: <FaCity />,
    description: "Planification à grande échelle pour transformer le paysage urbain de manière durable.",
    template: "Analyse de faisabilité foncière, aménagement de lotissements, intégration paysagère et mise en conformité réglementaire.",
    benefits: ["Analyse Foncière", "Vision Urbaine", "Normes RDC & Int."],
    price: "Sur Devis Technique",
  },
  {
    title: "Expertise & Conseil Stratégique",
    icon: <FaHandshake />,
    description: "Accompagnement VIP pour les investisseurs et propriétaires de patrimoine.",
    template: "Audit de structures existantes, réhabilitation lourde, expertise immobilière et consultation privée en investissement bâti.",
    benefits: ["Audit de Patrimoine", "Conseil Investisseur", "Solutions Sur-mesure"],
    price: "Sur Devis Technique",
  },
];

export default function Services() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const handleQuoteClick = (title) => {
    setSelectedService(title);
    setModalOpen(true);
  };

  return (
    <section id="services" className="py-24 px-6 bg-white dark:bg-slate-950 transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Style Cabinet d'Architecture */}
        <div className="mb-20 text-left border-l-8 border-slate-900 dark:border-white pl-8">
          <h2 className="text-sm tracking-[0.4em] uppercase text-slate-400 font-bold mb-2">Expertises de l'Agence</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white italic">
            Nos <span className="font-light not-italic text-slate-500">Prestations</span>
          </h3>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-light max-w-2xl mt-6 leading-relaxed">
            Architecte Principal au sein de <strong className="text-slate-900 dark:text-white">LEGACY Architects & co.</strong>, j'assure la fusion entre rigueur technique et vision artistique.
          </p>
        </div>

        {/* Grille de Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 p-10 flex flex-col hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-500 group"
            >
              <div className="text-4xl mb-8 text-slate-900 dark:text-white group-hover:scale-110 transition-transform duration-500">
                {service.icon}
              </div>

              <h4 className="text-xs tracking-widest uppercase font-bold text-slate-400 mb-2">Service 0{idx + 1}</h4>
              <h3 className="text-2xl font-serif font-bold mb-4 text-slate-900 dark:text-white uppercase tracking-tighter">
                {service.title}
              </h3>

              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed font-light">
                {service.description}
              </p>

              {/* Détails techniques style "Cartouche de plan" */}
              <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-950 border-l-2 border-slate-200 dark:border-slate-700 italic text-[13px] text-slate-500">
                <span className="block font-bold not-italic uppercase tracking-tighter text-[10px] mb-1">Détails de la mission :</span>
                {service.template}
              </div>

              <div className="flex flex-wrap gap-2 mb-10">
                {service.benefits.map((b, i) => (
                  <span key={i} className="text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-700 px-3 py-1 text-slate-500 dark:text-slate-400 font-bold">
                    {b}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="mb-6 text-sm font-serif italic text-slate-400">
                  Honoraires : <span className="text-slate-900 dark:text-white font-bold not-italic">{service.price}</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleQuoteClick(service.title)}
                    className="py-4 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] uppercase tracking-widest font-bold hover:bg-slate-700 dark:hover:bg-slate-200 transition-all"
                  >
                    Demander une Étude
                  </button>
                  <a
                    href={`mailto:ingebalouiscar@://gmail.com Architecture: ${service.title}`}
                    className="flex items-center justify-center gap-2 py-4 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-[10px] uppercase tracking-widest font-bold hover:bg-slate-900 hover:text-white transition-all"
                  >
                    <FaEnvelope /> Contact Direct
                  </a>
                </div>
              </div>
            </motion.div>
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
