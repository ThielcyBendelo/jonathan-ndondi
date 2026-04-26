import { experiences } from '../assets/assets.js';
import { FaBalanceScale, FaBookOpen, FaUserTie, FaCheckCircle, FaAward } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Sélecteur d'icônes selon le type d'expérience (Avocate / Coach / Auteur)
const roleIcon = (type) => {
  const lower = (type || '').toLowerCase();
  if (lower.includes('legal') || lower.includes('avocat')) return FaBalanceScale;
  if (lower.includes('auteur') || lower.includes('book')) return FaBookOpen;
  if (lower.includes('coach') || lower.includes('mentor')) return FaUserTie;
  return FaCheckCircle;
};

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* En-tête Prestige */}
        <div className="mb-20">
          <h2 className="text-sm tracking-[0.4em] uppercase text-amber-600 mb-2 font-bold italic">
            Parcours d'Excellence
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white">
            Chronologie <span className="italic font-light text-slate-500">& Impact</span>
          </h3>
          <div className="h-1 w-20 bg-amber-600 mt-6"></div>
        </div>

        {/* Container de la Timeline (Style Signature) */}
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 md:ml-6">
          {experiences.map((exp, idx) => {
            const Icon = roleIcon(exp.type);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative mb-16 pl-10 md:pl-16"
              >
                {/* Le Point (Style Sceau Doré) */}
                <div className="absolute top-0 -left-[11px] w-5 h-5 bg-white dark:bg-slate-950 border-2 border-amber-600 rounded-full z-10" />

                {/* Contenu de la carte (Style Cabinet) */}
                <div className="group bg-slate-50 dark:bg-slate-900 p-8 rounded-sm shadow-sm hover:shadow-xl transition-all duration-500 border-l-4 border-amber-600">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white dark:bg-slate-800 text-amber-600 rounded-full group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <Icon size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-amber-600 font-bold block mb-1">
                          {exp.year}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter font-serif">
                          {exp.role}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-1 bg-amber-600/10 text-amber-600 rounded-full border border-amber-600/20">
                      <FaAward size={10} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {exp.company}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed text-sm md:text-base border-t border-slate-200 dark:border-slate-800 pt-6 italic">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Signature finale */}
        <div className="mt-24 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-slate-400 font-bold">
            Engagement • Justice • Transmission | Rebecca Kulufio
          </p>
        </div>
      </div>
    </section>
  );
}
