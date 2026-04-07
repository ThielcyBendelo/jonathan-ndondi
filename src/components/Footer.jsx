import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
} from 'react-icons/fa';
import { contact } from '../assets/assets.js';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialIcons = {
    Email: FaEnvelope,
    LinkedIn: FaLinkedin,
    GitHub: FaGithub,
    Instagram: FaInstagram,
    Facebook: FaFacebook,
    WhatsApp: FaWhatsapp,
  };

  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Logo et Signature Professionnelle */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-serif font-bold text-white tracking-widest uppercase mb-6">
              LEGACY<span className="text-slate-500 font-light">ARHITECTS & CO</span>
            </h3>
            <p className="text-sm leading-relaxed font-light text-slate-500 uppercase tracking-tighter">
              Bâtir l'héritage de demain à travers <br /> une architecture de précision.
            </p>
          </div>

          {/* Navigation Structurée */}
          <div className="md:ml-auto">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">Navigation</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/home" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Portfolio</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Expertises</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">L'Agence</Link></li>
            </ul>
          </div>

          {/* Contact & Bureau */}
          <div className="md:ml-auto">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">Contact</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/contact" className="hover:text-white transition-colors">Consultation</Link></li>
              <li><Link to="/experience" className="hover:text-white transition-colors">Parcours</Link></li>
              <li><Link to="/skills" className="hover:text-white transition-colors">Technique</Link></li>
            </ul>
          </div>

          {/* Réseaux et Social Connect */}
          <div className="md:ml-auto text-left md:text-right">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">Suivre l'Agence</h4>
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
                    className="text-xl text-slate-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                    aria-label={item.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright Minimaliste */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-slate-600">
          <p>© {currentYear} Ibrahim Muswema | LEGACY Architects & co.</p>
          <p className="font-light">Design & Structure par CRP</p>
        </div>
      </div>
    </footer>
  );
}
