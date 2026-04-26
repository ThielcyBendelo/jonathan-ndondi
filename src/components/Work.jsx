import { FaMicrophoneAlt, FaUsers, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Simuler des données de conférences (À déplacer dans assets.js plus tard)
const events = [
  {
    title: "Leadership au Féminin : Briser le Plafond de Verre",
    location: "Kinshasa, RDC",
    date: "Mars 2024",
    type: "Keynote",
    description: "Une conférence dédiée à l'autonomisation des femmes dans le secteur juridique et entrepreneurial."
  },
  {
    title: "La Jeunesse Africaine face aux Défis du Numérique",
    location: "Abidjan, Côte d'Ivoire",
    date: "Janvier 2024",
    type: "Panel",
    description: "Discussion stratégique sur l'impact de l'éducation et de l'écriture pour la nouvelle génération."
  },
  {
    title: "Droit des Affaires & Entrepreneuriat local",
    location: "Brazzaville, Congo",
    date: "Novembre 2023",
    type: "Workshop",
    description: "Atelier pratique sur la structuration légale des PME pour les jeunes entrepreneurs."
  }
];

export default function Events() {
  return (
    <section id="events" className="py-24 bg-white dark:bg-slate-950 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Signature */}
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.4em] uppercase text-amber-600 font-bold mb-4">
            Prendre la parole
          </h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white italic">
            Conférences <span className="font-light not-italic text-slate-500">& Impact</span>
          </h3>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-slate-50 dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500"
            >
              {/* Icone Flottante */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-600 text-white mb-6 shadow-lg shadow-amber-900/20">
                <FaMicrophoneAlt />
              </div>

              <div className="space-y-4">
                <span className="text-[10px] px-3 py-1 bg-amber-600/10 text-amber-600 rounded-full font-bold uppercase tracking-widest">
                  {event.type}
                </span>
                
                <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                  {event.title}
                </h4>

                <div className="flex flex-col gap-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-amber-600" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-amber-600" />
                    <span>{event.date}</span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pt-4 border-t border-slate-200 dark:border-slate-800 italic">
                  {event.description}
                </p>
              </div>

              {/* Effet Décoratif Hover */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-amber-600 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Call to Action Conférencière */}
        <div className="mt-20 p-10 bg-slate-900 text-white text-center rounded-sm">
          <h4 className="text-2xl font-serif mb-4">Vous organisez un événement ?</h4>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Disponible pour des interventions sur le leadership, le droit des affaires et l'éveil de la jeunesse africaine.
          </p>
          <button className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase text-xs tracking-[0.2em] transition-all">
            Réserver une intervention
          </button>
        </div>
      </div>
    </section>
  );
}
