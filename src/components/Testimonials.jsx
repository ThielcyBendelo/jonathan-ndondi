import React, { useState } from 'react';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar, FaBalanceScale, FaLightbulb } from 'react-icons/fa';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const initialTestimonials = [
  {
    name: 'Sarah M.',
    role: 'Entrepreneure',
    category: 'Juridique',
    date: '2024',
    rating: 5,
    text: "L'expertise juridique de Maître Rebecca a été déterminante pour la sécurisation de mes contrats internationaux.",
  },
  {
    name: 'Marcelle K.',
    role: 'Jeune Leader',
    category: 'Coaching',
    date: '2023',
    rating: 5,
    text: "Grâce au mentorat de Rebecca, j'ai trouvé la force de lancer mon projet d'impact pour les femmes de ma communauté.",
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('Tous');
  const [form, setForm] = useState({ name: '', category: 'Juridique', text: '', rating: 5 });

  // Filtrage des témoignages
  const filteredData = filter === 'Tous' 
    ? testimonials 
    : testimonials.filter(t => t.category === filter);

  const goToNext = () => setCurrentIndex((prev) => (prev === filteredData.length - 1 ? 0 : prev + 1));
  const goToPrevious = () => setCurrentIndex((prev) => (prev === 0 ? filteredData.length - 1 : prev - 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { ...form, date: new Date().getFullYear().toString() };
    setTestimonials([...testimonials, newEntry]);
    setShowModal(false);
    setForm({ name: '', category: 'Juridique', text: '', rating: 5 });
  };

  return (
    <section id="testimonials" className="py-24 bg-slate-950 text-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        <div className="text-center mb-12">
          <h2 className="text-amber-600 uppercase tracking-[0.3em] text-sm font-bold mb-4">Confiance & Impact</h2>
          <h3 className="text-4xl md:text-5xl font-serif italic">Paroles de Clients & Coachés</h3>
        </div>

        {/* NOUVEAUTÉ : Filtres de catégories */}
        <div className="flex justify-center gap-4 mb-12">
          {['Tous', 'Juridique', 'Coaching'].map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setCurrentIndex(0); }}
              className={`px-6 py-2 rounded-full border text-xs uppercase tracking-widest transition-all ${
                filter === cat ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-800 text-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {filteredData.length > 0 ? (
              <Motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center w-full"
              >
                <FaQuoteLeft className="text-amber-600/20 text-6xl mx-auto mb-8" />
                <div className="flex justify-center gap-1 mb-6 text-amber-500">
                  {[...Array(filteredData[currentIndex].rating)].map((_, i) => <FaStar key={i} />)}
                </div>
                <blockquote className="text-2xl md:text-3xl font-light italic leading-relaxed mb-10 max-w-3xl mx-auto">
                  "{filteredData[currentIndex].text}"
                </blockquote>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-600 flex items-center justify-center mb-4 text-xl font-serif">
                    {filteredData[currentIndex].name.charAt(0)}
                  </div>
                  <h4 className="font-bold text-xl">{filteredData[currentIndex].name}</h4>
                  <p className="text-amber-600 text-sm uppercase tracking-widest mt-1">
                    {filteredData[currentIndex].category} • {filteredData[currentIndex].role}
                  </p>
                </div>
              </Motion.div>
            ) : (
              <p className="text-slate-500">Aucun témoignage dans cette catégorie.</p>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {filteredData.length > 1 && (
            <>
              <button onClick={goToPrevious} className="absolute left-0 text-slate-500 hover:text-amber-600 text-3xl transition-colors"><FaChevronLeft /></button>
              <button onClick={goToNext} className="absolute right-0 text-slate-500 hover:text-amber-600 text-3xl transition-colors"><FaChevronRight /></button>
            </>
          )}
        </div>

        {/* Bouton d'action */}
        <div className="flex justify-center mt-16">
          <button onClick={() => setShowModal(true)} className="px-8 py-4 bg-transparent border-2 border-amber-600 text-amber-600 font-bold uppercase text-xs tracking-widest hover:bg-amber-600 hover:text-white transition-all">
            Partager votre expérience
          </button>
        </div>
      </div>

      {/* Modal personnalisé */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-amber-900/30 rounded-sm p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-serif text-white mb-6">Laisser un témoignage</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Votre Nom" className="w-full bg-slate-800 border-none p-3 text-white focus:ring-1 focus:ring-amber-600" required onChange={(e) => setForm({...form, name: e.target.value})} />
              <select className="w-full bg-slate-800 border-none p-3 text-white focus:ring-1 focus:ring-amber-600" onChange={(e) => setForm({...form, category: e.target.value})}>
                <option value="Juridique">Cabinet Juridique</option>
                <option value="Coaching">Mentorat / Coaching</option>
              </select>
              <textarea placeholder="Votre message..." className="w-full bg-slate-800 border-none p-3 text-white h-32 focus:ring-1 focus:ring-amber-600" required onChange={(e) => setForm({...form, text: e.target.value})} />
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-slate-400 uppercase text-xs font-bold tracking-widest">Annuler</button>
                <button type="submit" className="flex-1 py-3 bg-amber-600 text-white uppercase text-xs font-bold tracking-widest">Publier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
