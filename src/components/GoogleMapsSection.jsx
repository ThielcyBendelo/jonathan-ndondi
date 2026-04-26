import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";

function GoogleMapsSection() {
  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-950" id="localisation">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          
          {/* Colonne 1 : Informations (1/3) */}
          <div className="lg:col-span-1 text-left">
            <h2 className="text-sm tracking-[0.4em] uppercase text-amber-600 mb-4 font-bold">
              Le Cabinet
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6 italic">
              Siège de Kinshasa
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-light">
              Nous vous accueillons au cœur de la Gombe pour vos consultations juridiques, séances de mentorat et projets éditoriaux.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 text-amber-600 rounded-sm">
                   <FaMapMarkerAlt />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-900 dark:text-white mb-1">Localisation</h4>
                  <p className="text-sm text-slate-500 font-light">Gombe, Kinshasa, République Démocratique du Congo</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 text-amber-600 rounded-sm">
                   <FaClock />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-900 dark:text-white mb-1">Heures d'ouverture</h4>
                  <p className="text-sm text-slate-500 font-light">Lundi — Vendredi : 09h00 - 17h00</p>
                  <p className="text-xs text-amber-600 italic mt-1">Sur rendez-vous uniquement</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 text-amber-600 rounded-sm">
                   <FaEnvelope />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-900 dark:text-white mb-1">Secrétariat</h4>
                  <p className="text-sm text-slate-500 font-medium">contact@votre-domaine.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne 2 : La Carte (2/3) */}
          <div className="lg:col-span-2 relative">
            {/* Bordure décorative Or/Ambre */}
            <div className="absolute -top-4 -right-4 w-32 h-32 border-t border-r border-amber-600/30 pointer-events-none"></div>
            
            <div className="relative rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-amber-900/5 border border-slate-100 dark:border-slate-800">
              <iframe
                title="Google Maps localisation"
                src="https://google.com"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale contrast-110 hover:grayscale-0 transition-all duration-1000"
              ></iframe>
              
              {/* Overlay discret en mode sombre */}
              <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 dark:border-slate-950/20"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default GoogleMapsSection;
