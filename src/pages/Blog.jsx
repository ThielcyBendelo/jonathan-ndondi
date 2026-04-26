import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaArrowLeft, FaRegClock, FaChevronRight, FaFilter } from 'react-icons/fa';
// import BlogList from '../blog/BlogList';
import Footer from '../components/Footer';

export default function Blog() {
  const navigate = useNavigate();
  // const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");

  const categories = ["Tous", "Droit", "Entrepreneuriat", "Jeunesse", "Leadership Féminin"];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      
      {/* --- NAVIGATION & HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-slate-500 hover:text-amber-600 transition-colors"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Retour au Cabinet
          </button>
          <div className="text-xl font-serif font-bold italic dark:text-white">
            Impact <span className="text-amber-600">Journal</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        
        {/* --- SECTION TITRE & RECHERCHE --- */}
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <h2 className="text-sm uppercase tracking-[0.4em] text-amber-600 font-bold mb-4">Réflexions & Analyses</h2>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
              Éclairer le chemin de la <span className="italic font-light">réussite africaine.</span>
            </h1>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
              <FaSearch />
            </div>
            <input 
              type="text"
              placeholder="Rechercher un article, une loi, un conseil..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-sm text-sm focus:ring-2 focus:ring-amber-600 outline-none dark:text-white transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* --- FILTRES DE CATÉGORIES --- */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-slate-100 dark:border-slate-900 pb-8">
          <div className="flex items-center gap-2 text-slate-400 mr-4 text-xs uppercase font-bold tracking-widest">
            <FaFilter /> Filtrer :
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 text-xs uppercase tracking-widest font-bold transition-all rounded-full ${
                activeCategory === cat 
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20' 
                : 'bg-transparent text-slate-500 hover:text-amber-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- MISE EN AVANT (FEATURED POST) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 group cursor-pointer"
        >
          <div className="grid lg:grid-cols-2 gap-8 bg-slate-50 dark:bg-slate-900 rounded-sm overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="h-[300px] lg:h-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
               {/* Remplacer par une image réelle */}
               <div className="w-full h-full bg-gradient-to-br from-amber-600/20 to-slate-900 flex items-center justify-center text-amber-600 italic font-serif">
                  Dernier Éditorial
               </div>
            </div>
            <div className="p-10 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-amber-600 font-bold mb-4">
                <span>Éditorial</span>
                <span className="flex items-center gap-1 text-slate-400"><FaRegClock /> 5 min de lecture</span>
              </div>
              <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6 group-hover:text-amber-600 transition-colors">
                Pourquoi la sécurité juridique est le premier levier de l'entrepreneuriat féminin.
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 font-light leading-relaxed">
                Analyse profonde sur l'importance des structures légales pour les femmes d'affaires en RDC et partout en Afrique...
              </p>
              <button className="flex items-center gap-2 text-xs uppercase font-black tracking-[0.2em] text-slate-900 dark:text-white group-hover:gap-4 transition-all">
                Lire l'article <FaChevronRight className="text-amber-600" />
              </button>
            </div>
          </div>
        </motion.div>

        --- LISTE DES ARTICLES ---
        {/* <div className="grid grid-cols-1 gap-12">
          <BlogList query={searchQuery} category={activeCategory} />
        </div> */}

        {/* --- NEWSLETTER IMPACT --- */}
        <section className="mt-24 p-12 bg-slate-900 dark:bg-amber-600 text-white text-center rounded-sm relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-3xl font-serif font-bold mb-4 italic">Rejoignez la communauté d'impact</h4>
            <p className="text-amber-100/80 mb-8 max-w-xl mx-auto font-light">
              Recevez chaque mois mes analyses juridiques et conseils en leadership directement dans votre boîte mail.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="votre@email.com" 
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 outline-none focus:bg-white/20 transition-all text-sm"
              />
              <button className="px-8 py-3 bg-white text-slate-900 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-colors">
                S'abonner
              </button>
            </form>
          </div>
          {/* Filigrane décoratif */}
          <div className="absolute -bottom-10 -right-10 text-white/5 font-serif text-[150px] pointer-events-none uppercase font-black italic">
            Impact
          </div>
        </section>
      </main>
        <Footer />
    </div>
  );
}
