import React from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaShoppingCart, FaStar, FaGlobeAfrica } from 'react-icons/fa';

const myBooks = [
  {
    id: 1,
    title: "L'Éveil du Leadership Féminin",
    subtitle: "Guide pour la femme africaine moderne",
    price: "25.00",
    rating: 5,
    cover: "/cover-book-1.jpg", // Remplacez par vos vraies images
    description: "Un ouvrage pratique pour briser les plafonds de verre et assumer son rôle de leader dans la société actuelle.",
    tag: "Leadership"
  },
  {
    id: 2,
    title: "Droit & Jeunesse",
    subtitle: "Comprendre ses droits pour mieux bâtir",
    price: "18.50",
    rating: 5,
    cover: "/cover-book-2.jpg",
    description: "Vulgarisation juridique destinée à la jeunesse africaine pour une citoyenneté active et protégée.",
    tag: "Éducation"
  }
];

export default function Books() {
  return (
    <section id="books" className="py-24 bg-slate-50 dark:bg-slate-950 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête de la page */}
        <div className="text-center mb-20">
          <h2 className="text-amber-600 uppercase tracking-[0.4em] text-sm font-bold mb-4">
            Publications & Pensées
          </h2>
          <h3 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white italic">
            La Bibliothèque <span className="font-light not-italic text-slate-500">d'Impact</span>
          </h3>
          <p className="mt-6 text-slate-500 max-w-2xl mx-auto italic">
            "L'écriture est l'arme la plus puissante pour transmettre des valeurs durables à la nouvelle génération."
          </p>
        </div>

        {/* Grille des livres */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {myBooks.map((book) => (
            <motion.div 
              key={book.id}
              initial={{ opacity: 0, x: book.id % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-8 bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-100 dark:border-slate-800 relative group"
            >
              {/* Couverture du livre */}
              <div className="w-full md:w-64 h-96 bg-slate-200 dark:bg-slate-800 flex-shrink-0 relative overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <FaBookOpen size={50} className="opacity-20" />
                </div>
                {/* <img src={book.cover} alt={book.title} className="w-full h-full object-cover relative z-10" /> */}
                <div className="absolute top-4 right-4 z-20 bg-amber-600 text-white text-[10px] px-3 py-1 font-bold uppercase tracking-widest">
                  {book.tag}
                </div>
              </div>

              {/* Détails du livre */}
              <div className="flex flex-col justify-between py-2">
                <div>
                  <div className="flex gap-1 text-amber-500 mb-2">
                    {[...Array(book.rating)].map((_, i) => <FaStar key={i} size={12} />)}
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                    {book.title}
                  </h4>
                  <p className="text-amber-600 text-sm font-medium mb-4 italic">
                    {book.subtitle}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {book.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {book.price} $
                  </span>
                  <button className="flex items-center gap-2 bg-slate-900 dark:bg-amber-600 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-amber-700 transition-all">
                    <FaShoppingCart /> Commander
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section Engagement */}
        <div className="mt-24 p-12 bg-amber-600 text-white rounded-sm flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-amber-900/20">
          <div className="flex items-center gap-6">
            <FaGlobeAfrica size={60} className="opacity-50" />
            <div>
              <h4 className="text-2xl font-serif font-bold italic">Expédition Internationale</h4>
              <p className="text-amber-100 text-sm">Disponible en format papier et numérique (E-book).</p>
            </div>
          </div>
          <button className="px-8 py-4 border-2 border-white text-white font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-amber-600 transition-all">
            Voir tous les points de vente
          </button>
        </div>
      </div>
    </section>
  );
}
