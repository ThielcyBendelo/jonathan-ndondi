import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaLinkedin,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa';
import { contact } from '../assets/assets.js';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialIcons = {
    Email: FaEnvelope,
    LinkedIn: FaLinkedin,
    Instagram: FaInstagram,
    Facebook: FaFacebook,
    WhatsApp: FaWhatsapp,
    YouTube: FaYoutube,
  };

  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-amber-900/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Signature Professionnelle */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-serif font-bold text-white tracking-widest uppercase mb-6">
              REBECCA<span className="text-amber-600 font-light"> KULUFIO</span>
            </h3>
            <p className="text-xs leading-relaxed font-light text-slate-500 uppercase tracking-widest">
              Droit • Coaching • Impact <br />
              Bâtir l'héritage de la jeunesse <br />
              et des femmes d'Afrique.
            </p>
          </div>

          {/* Expertises */}
          <div className="md:ml-auto">
            <h4 className="text-xs font-bold text-amber-600 uppercase tracking-[0.2em] mb-6">Expertises</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/legal" className="hover:text-white transition-colors">Cabinet Juridique</Link></li>
              <li><Link to="/coaching" className="hover:text-white transition-colors">Business Mentorat</Link></li>
              <li><Link to="/books" className="hover:text-white transition-colors">Publications</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Mon Parcours</Link></li>
            </ul>
          </div>

          {/* Ressources */}
          <div className="md:ml-auto">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">Ressources</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog & Impact</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Prendre RDV</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Aide & FAQ</Link></li>
            </ul>
          </div>

          {/* Social Connect */}
          <div className="md:ml-auto text-left md:text-right">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">Suivre l'Impact</h4>
            <div className="flex justify-start md:justify-end gap-5">
              {contact.map((item) => {
                const Icon = socialIcons[item.label];
                if (!Icon) return null;
                let href = item.link;
                if (item.label === 'Email' && !/^mailto:/i.test(href)) {
                  href = `mailto:${href}`;
                }
                return (
                  <a
                    key={item.label}
                    href={href}
                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="text-xl text-slate-500 hover:text-amber-500 transition-all duration-300 transform hover:-translate-y-1"
                    aria-label={item.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-slate-600">
          <p>© {currentYear} Rebecca Kulufio | Cabinet & Mentorat.</p>
          <p className="font-light">Élever le leadership féminin africain</p>
        </div>
      </div>
    </footer>
  );
}
