import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaArrowLeft, FaRegClock, FaChevronRight, FaFilter, FaNewspaper } from 'react-icons/fa';
import Footer from '../components/Footer';

export default function Blog() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Tous");

  const categories = ["Tous", "Assurances", "Réglementation", "Stratégie PME", "Vie d'Entrepreneur"];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] transition-colors duration-500">
      
      {/* --- NAVIGATION & HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-orange-500 transition-colors"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Retour au Cabinet
          </button>
          <div className="text-xl font-serif font-bold dark:text-white uppercase tracking-tighter">
            Business <span className="text-orange-500 italic">Insights</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        
        {/* --- SECTION TITRE & RECHERCHE --- */}
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <h2 className="text-sm uppercase tracking-[0.4em] text-orange-500 font-bold mb-4">Analyses & Perspectives</h2>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#191970] dark:text-white leading-tight">
              Décrypter les enjeux de la <span className="italic font-light text-orange-500">protection sociale.</span>
            </h1>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              <FaSearch />
            </div>
            <input 
              type="text"
              placeholder="Rechercher un audit, une CCN, un conseil fiscal..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-sm text-sm focus:ring-2 focus:ring-orange-500 outline-none dark:text-white transition-all shadow-sm"
            />
          </div>
        </div>

        {/* --- FILTRES DE CATÉGORIES --- */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-slate-100 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-2 text-slate-400 mr-4 text-[10px] uppercase font-bold tracking-widest">
            <FaFilter /> Filtrer par expertise :
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest font-bold transition-all rounded-full border ${
                activeCategory === cat 
                ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-900/20' 
                : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-500 hover:text-orange-500 hover:border-orange-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- ARTICLE À LA UNE (FEATURED) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 group cursor-pointer"
        >
          <div className="grid lg:grid-cols-2 gap-0 bg-slate-50 dark:bg-slate-900 rounded-sm overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl">
            <div className="h-[300px] lg:h-full relative overflow-hidden">
               <img 
                 src="https://unsplash.com" 
                 alt="Audit Assurance"
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-[#191970]/30 mix-blend-multiply"></div>
               <div className="absolute top-6 left-6 bg-orange-500 text-white text-[9px] px-4 py-1 font-bold uppercase tracking-widest">
                 À la une
               </div>
            </div>
            <div className="p-10 md:p-16 flex flex-col justify-center bg-white dark:bg-slate-900">
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-orange-500 font-bold mb-4">
                <span className="flex items-center gap-2"><FaNewspaper /> Dossier Spécial</span>
                <span className="flex items-center gap-1 text-slate-400"><FaRegClock /> 8 min de lecture</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#191970] dark:text-white mb-6 group-hover:text-orange-500 transition-colors">
                Optimiser votre protection sociale : Le levier caché de la rentabilité PME.
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 font-light leading-relaxed">
                Comment un audit rigoureux de vos contrats collectifs peut dégager de la trésorerie tout en améliorant l'attractivité de votre marque employeur...
              </p>
              <button className="flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.2em] text-[#191970] dark:text-white group-hover:gap-4 transition-all">
                Consulter le dossier <FaChevronRight className="text-orange-500" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* --- NEWSLETTER PROFESSIONNELLE --- */}
        <section className="mt-24 p-12 bg-[#191970] text-white text-center relative overflow-hidden border-b-4 border-orange-500">
          <div className="relative z-10">
            <h4 className="text-3xl font-serif font-bold mb-4">Restez informé de l'actualité sociale</h4>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto font-light">
              Recevez mensuellement mes décryptages réglementaires et conseils stratégiques pour dirigeants.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="votre@email-pro.com" 
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 outline-none focus:bg-white/20 transition-all text-sm"
              />
              <button className="px-8 py-4 bg-orange-500 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-colors shadow-lg">
                S'inscrire
              </button>
            </form>
          </div>
          {/* Filigrane discret */}
          <div className="absolute -bottom-10 -right-10 text-white/5 font-serif text-[150px] pointer-events-none uppercase font-black italic select-none">
            Expert
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
