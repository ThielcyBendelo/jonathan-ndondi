import { experiences } from '../assets/assets.js';
import { FaBuilding, FaDraftingCompass, FaHardHat, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const roleIcon = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'internship':
    case 'stage': return FaDraftingCompass;
    case 'freelance':
    case 'contract': return FaHardHat;
    default: return FaCheckCircle;
  }
};

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* En-tête aligné à gauche pour une structure plus forte */}
        <div className="mb-20">
          <h2 className="text-sm tracking-[0.4em] uppercase text-slate-400 mb-2 font-bold">Chronologie</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 italic">Parcours & Projets</h3>
          <div className="h-1 w-20 bg-slate-900 mt-6"></div>
        </div>

        {/* Container de la Timeline */}
        <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6">
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
                {/* Le Point (Le plot de construction) */}
                <div className="absolute top-0 -left-[11px] w-5 h-5 bg-white border-2 border-slate-900 rounded-full z-10 shadow-sm" />

                {/* Contenu de la carte */}
                <div className="group bg-white p-8 rounded-sm shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-xl transition-all duration-500 border-l-4 border-slate-900">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-50 text-slate-900 rounded-full group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                        <Icon size={22} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block mb-1">
                          {exp.year}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">
                          {exp.role}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full">
                      <FaBuilding size={12} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        {exp.company}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-500 font-light leading-relaxed text-sm md:text-base border-t border-slate-100 pt-4">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Signature finale */}
        <div className="mt-24 pt-8 border-t border-slate-200 text-center md:text-right">
          <p className="text-[10px] uppercase tracking-[0.5em] text-slate-400">
            © LEGACY Architects & co. | Archive Professionnelle
          </p>
        </div>
      </div>
    </section>
  );
}
