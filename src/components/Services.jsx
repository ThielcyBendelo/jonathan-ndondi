import React, { useState } from "react";
import QuoteModal from "./QuoteModal";
import { 
  FaShieldAlt, FaHandshake, FaUserCheck, FaFileInvoiceDollar, 
  FaEnvelope, FaChartLine, FaLaptopMedical, FaCogs 
} from "react-icons/fa";
import { motion } from "framer-motion";

const services = [
  {
    title: "Santé Collective (Mutuelle)",
    icon: <FaLaptopMedical />,
    description: "Conception et mise en conformité de votre régime de frais de santé obligatoire.",
    template: "Analyse des obligations conventionnelles (CCN), audit des garanties actuelles, pilotage du ratio sinistres/primes et mise en place du 100% Santé.",
    benefits: ["Panier de soins optimisé", "Conformité DDA", "Dispenses de droit"],
    price: "Audit Gratuit",
    tag: "Obligatoire"
  },
  {
    title: "Prévoyance & Retraite",
    icon: <FaShieldAlt />,
    description: "Sécurisation des revenus de vos salariés face aux aléas de la vie et préparation de l'avenir.",
    template: "Maintien de salaire, capital décès, rente éducation, et mise en place de PER d'entreprise (Plan Épargne Retraite) avec avantages fiscaux.",
    benefits: ["Avantages Fiscaux", "Sécurité Salariés", "Loi PACTE"],
    price: "Sur Devis",
    tag: "Stratégique"
  },
  {
    title: "Ingénierie Sociale & Audit",
    icon: <FaCogs />,
    description: "Analyse globale de vos charges sociales et optimisation du package de rémunération.",
    template: "Audit de conformité URSSAF sur les contrats collectifs, renégociation des taux assureurs et optimisation des avantages hors salaires.",
    benefits: ["Économie de Charges", "Zéro Risque URSSAF", "Benchmarking"],
    price: "Honoraires au Succès",
    tag: "Expertise"
  },
  {
    title: "Accompagnement Entrepreneur",
    icon: <FaChartLine />,
    description: "Solutions dédiées aux TNS (Travailleurs Non-Salariés) et dirigeants à Paris.",
    template: "Protection du dirigeant, mutuelle loi Madelin, assurance homme-clé et garantie chômage des chefs d'entreprise (GSC).",
    benefits: ["Déductibilité Madelin", "Protection Famille", "Indemnités IJ"],
    price: "Diagnostic 30 min",
    tag: "Dirigeants"
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
    <section id="services" className="py-24 px-6 bg-white dark:bg-[#0f172a] transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Style Courtier & Expert */}
        <div className="mb-20 text-left border-l-8 border-orange-500 pl-8">
          <h2 className="text-sm tracking-[0.4em] uppercase text-slate-400 font-bold mb-2 text-[#191970] dark:text-orange-500">
            Ingénierie en Protection Sociale
          </h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#191970] dark:text-white uppercase tracking-tighter">
            Solutions <span className="font-light italic text-orange-500">Collectives</span>
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-light max-w-2xl mt-6 leading-relaxed">
            Basé à Paris, j'accompagne les <strong className="text-[#191970] dark:text-white">dirigeants et DRH</strong> dans la gestion de leurs comptes assurances pour transformer une contrainte légale en levier de performance.
          </p>
        </div>

        {/* Grille de Services - Design Épuré */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-900 p-10 flex flex-col border border-slate-100 dark:border-slate-800 hover:border-orange-500/50 transition-all duration-500 group relative"
            >
              {/* Badge flottant */}
              <span className="absolute top-6 right-6 text-[9px] uppercase tracking-widest bg-orange-500/10 text-orange-600 px-3 py-1 rounded-full font-bold">
                {service.tag}
              </span>

              <div className="text-4xl mb-8 text-[#191970] dark:text-orange-500 group-hover:scale-110 transition-transform duration-500">
                {service.icon}
              </div>

              <h4 className="text-[10px] tracking-widest uppercase font-bold text-slate-400 mb-2">Service Business 0{idx + 1}</h4>
              <h3 className="text-2xl font-serif font-bold mb-4 text-[#191970] dark:text-white">
                {service.title}
              </h3>

              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
                {service.description}
              </p>

              {/* Détails techniques style "Note de Synthèse" */}
              <div className="mb-8 p-5 bg-white dark:bg-[#0f172a] border-l-2 border-orange-500 text-[13px] text-slate-500 shadow-sm">
                <span className="block font-bold uppercase tracking-tighter text-[10px] mb-2 text-orange-500">Périmètre technique :</span>
                {service.template}
              </div>

              <div className="flex flex-wrap gap-2 mb-10">
                {service.benefits.map((b, i) => (
                  <span key={i} className="text-[9px] uppercase tracking-widest bg-[#191970]/5 dark:bg-orange-500/5 px-3 py-1 text-[#191970] dark:text-slate-300 font-bold border border-[#191970]/10">
                    {b}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="mb-6 text-sm font-serif italic text-slate-500">
                  Tarification : <span className="text-[#191970] dark:text-orange-500 font-bold not-italic">{service.price}</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleQuoteClick(service.title)}
                    className="py-4 bg-[#191970] dark:bg-orange-500 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-orange-600 transition-all shadow-lg"
                  >
                    Lancer un audit
                  </button>
                  <a
                    href={`mailto:contact@://votre-domaine.com info: ${service.title}`}
                    className="flex items-center justify-center gap-2 py-4 border border-[#191970] dark:border-orange-500 text-[#191970] dark:text-orange-500 text-[10px] uppercase tracking-widest font-bold hover:bg-[#191970] hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all"
                  >
                    <FaEnvelope /> Expert Direct
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
