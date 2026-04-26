import { FaChartLine, FaUsers, FaUserShield, FaHandshake, FaSyncAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const managementSteps = [
  {
    title: "Pilotage & Reporting Trimestriel",
    type: "Suivi Actif",
    icon: <FaChartLine />,
    image: "/path-to-reporting-image.jpg", // Remplacez par vos images
    description: "Analyse détaillée de la sinistralité et du rapport Prestations/Cotisations pour anticiper les évolutions tarifaires."
  },
  {
    title: "Gestion des Mouvements Salariés",
    type: "Administration",
    icon: <FaUsers />,
    image: "/path-to-hr-image.jpg", // Remplacez par vos images
    description: "Externalisation complète de l'affiliation et de la radiation de vos collaborateurs pour soulager votre service RH."
  },
  {
    title: "Veille Juridique & Conventionnelle",
    type: "Conformité",
    icon: <FaUserShield />,
    image: "/path-to-compliance-image.jpg", // Remplacez par vos images
    description: "Mise à jour constante de vos contrats face aux évolutions de la Loi de Financement de la Sécurité Sociale et des CCN."
  }
];

export default function AccountManagement() {
  return (
    <section id="gestion-comptes" className="py-24 bg-white dark:bg-[#0f172a] px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Institutionnel */}
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.4em] uppercase text-orange-500 font-bold mb-4">
            Service de Proximité
          </h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-[#191970] dark:text-white uppercase tracking-tighter">
            Gestion <span className="font-light italic text-orange-500">& Pilotage</span>
          </h3>
          <p className="mt-6 text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
            Un chargé de comptes dédié pour une gestion transparente et une optimisation continue de vos budgets d'assurances.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {managementSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 flex flex-col"
            >
              {/* Image de la carte avec overlay signature */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#191970]/40 group-hover:bg-[#191970]/20 transition-colors duration-500" />
                
                {/* Icone flottante sur l'image */}
                <div className="absolute -bottom-6 left-8 flex h-12 w-12 items-center justify-center bg-orange-500 text-white shadow-xl z-10">
                  {step.icon}
                </div>
              </div>

              {/* Contenu de la carte */}
              <div className="p-8 pt-10 space-y-4">
                <span className="text-[9px] px-3 py-1 bg-orange-500/10 text-orange-600 rounded-full font-bold uppercase tracking-widest">
                  {step.type}
                </span>
                
                <h4 className="text-xl font-bold text-[#191970] dark:text-white group-hover:text-orange-500 transition-colors">
                  {step.title}
                </h4>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pb-4">
                  {step.description}
                </p>

                {/* Services inclus */}
                <ul className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400">
                    <FaSyncAlt className="text-orange-500" /> Mise à jour continue
                  </li>
                  <li className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400">
                    <FaHandshake className="text-orange-500" /> Support Dédié
                  </li>
                </ul>
              </div>

              {/* Barre décorative animée */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-orange-500 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Section Engagement */}
        <div className="mt-20 p-12 bg-[#191970] text-white flex flex-col md:flex-row items-center justify-between gap-8 border-b-4 border-orange-500">
          <div className="text-left">
            <h4 className="text-2xl font-serif font-bold italic mb-2">Une gestion 100% digitalisée</h4>
            <p className="text-slate-300 text-sm max-w-md font-light">
              Accédez à vos tableaux de bord et gérez vos affiliations en quelques clics via notre interface sécurisée.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-[10px] tracking-[0.2em] transition-all">
              Audit de gestion
            </button>
            <button className="px-10 py-4 border border-white/20 hover:bg-white hover:text-[#191970] text-white font-bold uppercase text-[10px] tracking-[0.2em] transition-all">
              Accès Client
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
