import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaChess } from "react-icons/fa";

function GoogleMapsSection() {
  return (
    <section className="py-24 px-6 bg-white dark:bg-[#0f172a]" id="localisation">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* Colonne 1 : Informations (1/3) */}
          <div className="lg:col-span-1 text-left">
            <h2 className="text-sm tracking-[0.4em] uppercase text-orange-500 mb-4 font-bold">
              Proximité & Réactivité
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#191970] dark:text-white mb-6">
              Expertise <span className="italic text-orange-500">Parisienne</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-light">
              Basé à Paris, j'interviens dans toute l'Île-de-France pour réaliser vos audits d'assurances collectives et accompagner vos projets entrepreneuriaux.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 text-orange-500 rounded-sm">
                   <FaMapMarkerAlt />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-[#191970] dark:text-white mb-1">Zone d'intervention</h4>
                  <p className="text-sm text-slate-500 font-light">Paris & Île-de-France (Déplacements en entreprise)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 text-orange-500 rounded-sm">
                   <FaClock />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-[#191970] dark:text-white mb-1">Disponibilités</h4>
                  <p className="text-sm text-slate-500 font-light">Lundi — Vendredi : 08h30 - 18h30</p>
                  <p className="text-xs text-orange-600 italic mt-1 font-medium">Audit gratuit sur rendez-vous</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 text-orange-500 rounded-sm">
                   <FaEnvelope />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-[#191970] dark:text-white mb-1">Contact Direct</h4>
                  <p className="text-sm text-slate-500 font-medium">contact@votre-domaine.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne 2 : La Carte (2/3) */}
          <div className="lg:col-span-2 relative">
            {/* Bordure décorative Orange */}
            <div className="absolute -top-4 -right-4 w-32 h-32 border-t border-r border-orange-500/30 pointer-events-none"></div>
            
            <div className="relative rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800">
              <iframe
                title="Google Maps Paris"
                src="https://google.com"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale contrast-125 saturate-50 hover:grayscale-0 transition-all duration-1000"
              ></iframe>
              
              {/* Overlay Signature */}
              <div className="absolute bottom-6 right-6 bg-[#191970] text-white p-4 shadow-2xl border-l-4 border-orange-500">
                <p className="text-[10px] uppercase tracking-widest font-bold">Rebecca Kulufio</p>
                <p className="text-[9px] text-orange-400">Expert Assurances & Entrepreneuriat</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default GoogleMapsSection;
