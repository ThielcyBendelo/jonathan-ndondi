import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

function GoogleMapsSection() {
  return (
    <section className="py-24 px-6 bg-white" id="localisation">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Colonne 1 : Informations textuelles (1/3) */}
          <div className="lg:col-span-1 text-left">
            <h2 className="text-sm tracking-[0.3em] uppercase text-slate-400 mb-4 font-bold">
              Siège Social
            </h2>
            <h3 className="text-3xl font-serif font-bold text-slate-900 mb-6 italic">
              Bureau de Kinshasa
            </h3>
            <p className="text-slate-500 mb-10 leading-relaxed font-light">
              Notre agence vous accueille pour l'étude de vos projets architecturaux et consultations techniques.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-slate-900 mt-1" />
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-900">Adresse</h4>
                  <p className="text-sm text-slate-500">Immeuble LYS CENTRE Local, 6, 29 Avenue des Forces Armées Kinshasa Gombe, RDC</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaPhoneAlt className="text-slate-900 mt-1" />
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-900">Contact Direct</h4>
                  <p className="text-sm text-slate-500">+243 895 495 802</p>
                   <p className="text-sm text-slate-500">+243 811 349 537</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaEnvelope className="text-slate-900 mt-1" />
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-900">Email Professionnel</h4>
                  <p className="text-sm text-slate-500 font-medium">contact@legacyarchitects.org</p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne 2 : La Carte (2/3) */}
          <div className="lg:col-span-2 relative group">
            {/* Décoration géométrique style architecte */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-slate-200 pointer-events-none"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-slate-200 pointer-events-none"></div>
            
            <div className="rounded-sm overflow-hidden shadow-2xl grayscale contrast-125 hover:grayscale-0 transition-all duration-700 border border-slate-100">
              <iframe
                title="Google Maps localisation"
                src="https://www.google.com/maps?q=Immeuble+LYS+CENTRE+Local%2C+6%2C+29+Avenue+des+Forces+Armées+Kinshasa+Gombe%2C+RDC&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default GoogleMapsSection;
