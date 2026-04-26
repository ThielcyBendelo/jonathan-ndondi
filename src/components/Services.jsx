import React, { useState } from "react";
import QuoteModal from "./QuoteModal";
import { FaBalanceScale, FaLightbulb, FaUsers, FaBook, FaEnvelope, FaGavel, FaFemale, FaGlobeAfrica } from "react-icons/fa";
import { motion } from "framer-motion";

const services = [
  {
    title: "Conseil & Défense Juridique",
    icon: <FaBalanceScale />,
    description: "Protection de vos intérêts et structuration légale pour une sécurité contractuelle absolue.",
    template: "Audit juridique, rédaction de contrats d'affaires, protection de propriété intellectuelle, conformité réglementaire et médiation.",
    benefits: ["Sécurité Contractuelle", "Expertise RDC", "Rigueur Procédurale"],
    price: "Sur Consultation",
  },
  {
    title: "Mentorat Business & Leadership",
    icon: <FaLightbulb />,
    description: "Accompagnement stratégique pour les femmes entrepreneures et les leaders de demain.",
    template: "Structuration de business model, développement du personal branding, leadership féminin et stratégie de croissance d'impact.",
    benefits: ["Vision Stratégique", "Mindset d'Excellence", "Réseautage d'Impact"],
    price: "Forfaits de Coaching",
  },
  {
    title: "Keynote Speaker & Conférences",
    icon: <FaUsers />,
    description: "Interventions inspirantes sur le droit, l'entrepreneuriat et l'éveil de la jeunesse africaine.",
    template: "Conférences en universités, séminaires d'entreprises, panels internationaux et ateliers sur l'engagement civique.",
    benefits: ["Impact Social", "Transmission de Valeurs", "Oratoire de Prestige"],
    price: "Sur Devis Événement",
  },
  {
    title: "Édition & Programmes Éducatifs",
    icon: <FaBook />,
    description: "Transmission du savoir à travers des ouvrages dédiés à la réussite de la nouvelle génération.",
    template: "Publication de manuels pratiques, masterclasses sur l'autonomisation et création de supports pédagogiques pour la jeunesse.",
    benefits: ["Éducation Civique", "Impact Littéraire", "Héritage Durable"],
    price: "Prix Public / E-book",
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
        
        {/* Header Style Cabinet & Mentorat */}
        <div className="mb-20 text-left border-l-8 border-amber-600 pl-8">
          <h2 className="text-sm tracking-[0.4em] uppercase text-slate-400 font-bold mb-2">Domaines d'Intervention</h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white italic">
            Expertises <span className="font-light not-italic text-amber-600">& Solutions</span>
          </h3>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-light max-w-2xl mt-6 leading-relaxed">
            Avocate & Mentor, j'accompagne <strong className="text-slate-900 dark:text-white">les bâtisseurs de l'Afrique de demain</strong> en alliant rigueur juridique et éveil du potentiel humain.
          </p>
        </div>

        {/* Grille de Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-900 p-10 flex flex-col hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-500 group"
            >
              <div className="text-4xl mb-8 text-amber-600 group-hover:scale-110 transition-transform duration-500">
                {service.icon}
              </div>

              <h4 className="text-xs tracking-widest uppercase font-bold text-slate-400 mb-2">Pilier Impact 0{idx + 1}</h4>
              <h3 className="text-2xl font-serif font-bold mb-4 text-slate-900 dark:text-white uppercase tracking-tighter">
                {service.title}
              </h3>

              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed font-light">
                {service.description}
              </p>

              {/* Détails techniques style "Dossier Juridique" */}
              <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-950 border-l-2 border-amber-600 italic text-[13px] text-slate-500">
                <span className="block font-bold not-italic uppercase tracking-tighter text-[10px] mb-1 text-amber-600">Composantes de la mission :</span>
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
                  Modalités : <span className="text-amber-600 font-bold not-italic">{service.price}</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleQuoteClick(service.title)}
                    className="py-4 bg-slate-900 dark:bg-amber-600 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-slate-700 transition-all shadow-lg shadow-amber-900/10"
                  >
                    Réserver une séance
                  </button>
                  <a
                    href={`mailto:votre-email@://cabinet.com: ${service.title}`}
                    className="flex items-center justify-center gap-2 py-4 border border-amber-600 text-amber-600 text-[10px] uppercase tracking-widest font-bold hover:bg-amber-600 hover:text-white transition-all"
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
