import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const projectsData = [
  { id: 1, title: "Villa Horizon", category: "Résidentiel", img: "/proj1.jpg" },
  { id: 2, title: "Tour Legacy", category: "Commercial", img: "/proj2.jpg" },
  { id: 3, title: "Hôpital Central", category: "Hospitalité", img: "/proj3.jpg" },
  { id: 4, title: "Usine Logistique", category: "Industriel", img: "/proj4.jpg" },
  { id: 5, title: "Bibliothèque Nationale", category: "Publique", img: "/proj5.jpg" },
  { id: 6, title: "Analyse Urbaine", category: "Stage académique", img: "/proj6.jpg" },
];

const categories = ["Tous", "Résidentiel", "Commercial", "Industriel", "Hospitalité", "Publique", "Stage académique"];

export default function ProjectGallery() {
  const [filter, setFilter] = useState("Tous");

  const filteredProjects = filter === "Tous" 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  return (
    <section className="py-24 bg-slate-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="text-left">
            <h2 className="text-sm tracking-[0.3em] uppercase text-slate-500 mb-2">Portfolio</h2>
            <h3 className="text-4xl font-serif font-bold text-slate-900">Réalisations Sélectionnées</h3>
          </div>

          {/* Filtres de navigation */}
          <div className="flex flex-wrap gap-4 justify-start md:justify-end">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition-all border-b-2 ${
                  filter === cat ? "border-slate-900 text-slate-900 font-bold" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grille de projets avec Animation */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative overflow-hidden bg-slate-200 aspect-[4/5] cursor-pointer"
              >
                {/* Image de fond */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110 bg-gray-300">
                  {/* Remplacez par <img src={project.img} /> quand vos images seront prêtes */}
                  <div className="w-full h-full flex items-center justify-center text-slate-400 italic">
                    {project.title}
                  </div>
                </div>

                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-8">
                  <span className="text-xs tracking-widest text-slate-400 uppercase mb-2">{project.category}</span>
                  <h4 className="text-white text-2xl font-serif mb-6 text-center">{project.title}</h4>
                  <div className="w-12 h-px bg-white mb-6"></div>
                  <button className="text-white text-xs uppercase tracking-[0.2em] border border-white/30 px-6 py-2 hover:bg-white hover:text-black transition-all">
                    Voir le projet
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
