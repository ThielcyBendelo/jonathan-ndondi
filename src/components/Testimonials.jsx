import React, { useState } from 'react';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight, FaStar, FaShieldAlt, FaFileContract, FaSearchPlus } from 'react-icons/fa';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const initialTestimonials = [
  {
    name: 'Jean-Pierre D.',
    role: 'DRH - Groupe Logistique',
    category: 'Audit',
    date: '2024',
    rating: 5,
    text: "L'audit de nos contrats de prévoyance a révélé des économies de 12% dès la première année sans réduire les garanties.",
  },
  {
    name: 'Sophie L.',
    role: 'Fondatrice Tech Startup',
    category: 'Conformité',
    date: '2023',
    rating: 5,
    text: "Rebecca nous a accompagnés pour la mise en conformité de notre mutuelle. Un gain de sérénité total face aux risques URSSAF.",
  },
  {
    name: 'Marc A.',
    role: 'Chef d\'Entreprise',
    category: 'Conseil',
    date: '2024',
    rating: 5,
    text: "Une double casquette entrepreneur/expert assurance qui fait toute la différence dans la compréhension de nos enjeux.",
  },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('Tous');
  const [form, setForm] = useState({ name: '', category: 'Audit', text: '', rating: 5, role: '' });

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
    setForm({ name: '', category: 'Audit', text: '', rating: 5, role: '' });
  };

  return (
    <section id="audit-risques" className="py-24 bg-[#0f172a] text-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        
        <div className="text-center mb-12">
          <h2 className="text-orange-500 uppercase tracking-[0.3em] text-sm font-bold mb-4">Satisfaction & Performance</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-white uppercase tracking-tighter">
            Retours <span className="font-light italic text-orange-400">d'Expérience</span>
          </h3>
          <p className="mt-4 text-slate-400 font-light">L'impact de nos audits sur la protection sociale de vos salariés.</p>
        </div>

        {/* Filtres Métier */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['Tous', 'Audit', 'Conformité', 'Conseil'].map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setCurrentIndex(0); }}
              className={`px-6 py-2 border text-[10px] uppercase tracking-widest font-bold transition-all ${
                filter === cat ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'border-slate-800 text-slate-500 hover:border-orange-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-h-[450px] flex items-center justify-center bg-[#191970]/30 border border-white/5 p-12 shadow-2xl">
          <AnimatePresence mode="wait">
            {filteredData.length > 0 ? (
              <Motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="text-center w-full"
              >
                <FaQuoteLeft className="text-orange-500/10 text-8xl mx-auto mb-4 absolute top-10 left-1/2 -translate-x-1/2" />
                
                <div className="flex justify-center gap-1 mb-8 text-orange-500">
                  {[...Array(filteredData[currentIndex].rating)].map((_, i) => <FaStar key={i} size={14} />)}
                </div>

                <blockquote className="text-xl md:text-2xl font-serif leading-relaxed mb-10 max-w-3xl mx-auto relative z-10 italic">
                  "{filteredData[currentIndex].text}"
                </blockquote>

                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-orange-500 text-white flex items-center justify-center mb-4 text-xl font-bold shadow-xl">
                    {filteredData[currentIndex].name.charAt(0)}
                  </div>
                  <h4 className="font-bold text-lg text-white uppercase tracking-tight">{filteredData[currentIndex].name}</h4>
                  <p className="text-orange-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">
                    {filteredData[currentIndex].role}
                  </p>
                </div>
              </Motion.div>
            ) : (
              <p className="text-slate-500 uppercase tracking-widest text-xs">Aucun audit référencé ici.</p>
            )}
          </AnimatePresence>

          {/* Navigation B2B */}
          {filteredData.length > 1 && (
            <div className="absolute bottom-0 left-0 w-full flex justify-between px-4 pb-4">
              <button onClick={goToPrevious} className="p-4 text-slate-500 hover:text-orange-500 transition-colors"><FaChevronLeft /></button>
              <button onClick={goToNext} className="p-4 text-slate-500 hover:text-orange-500 transition-colors"><FaChevronRight /></button>
            </div>
          )}
        </div>

        {/* CTA Audit */}
        <div className="flex justify-center mt-16">
          <button onClick={() => setShowModal(true)} className="px-10 py-5 bg-orange-500 text-white font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-orange-900/40">
            Soumettre un retour d'audit
          </button>
        </div>
      </div>

      {/* Modal Corporate */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#191970]/95 backdrop-blur-md p-4">
          <div className="bg-white text-[#191970] rounded-sm p-10 w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-serif font-bold mb-2">Partager votre succès</h3>
            <p className="text-xs text-slate-500 mb-8 uppercase tracking-widest">Votre avis aide d'autres entreprises à faire le bon choix.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Nom Prénom" className="w-full bg-slate-100 border-none p-4 text-sm focus:ring-1 focus:ring-orange-500" required onChange={(e) => setForm({...form, name: e.target.value})} />
                <input type="text" placeholder="Votre Poste (ex: DRH)" className="w-full bg-slate-100 border-none p-4 text-sm focus:ring-1 focus:ring-orange-500" required onChange={(e) => setForm({...form, role: e.target.value})} />
              </div>
              <select className="w-full bg-slate-100 border-none p-4 text-sm focus:ring-1 focus:ring-orange-500" onChange={(e) => setForm({...form, category: e.target.value})}>
                <option value="Audit">Audit Assurances</option>
                <option value="Conformité">Conformité CCN / URSSAF</option>
                <option value="Conseil">Conseil Stratégique</option>
              </select>
              <textarea placeholder="Décrivez l'impact de l'intervention..." className="w-full bg-slate-100 border-none p-4 text-sm h-32 focus:ring-1 focus:ring-orange-500 shadow-inner" required onChange={(e) => setForm({...form, text: e.target.value})} />
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 uppercase text-[10px] font-bold tracking-widest border border-slate-200">Annuler</button>
                <button type="submit" className="flex-1 py-4 bg-[#191970] text-white uppercase text-[10px] font-bold tracking-widest hover:bg-orange-500 transition-colors">Valider le témoignage</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
