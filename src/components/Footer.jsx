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
    <footer className="bg-[#0f172a] text-slate-400 py-16 border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Signature Professionnelle */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-serif font-bold text-white tracking-widest uppercase mb-6">
              REBECCA<span className="text-orange-500 font-light italic"> KULUFIO</span>
            </h3>
            <p className="text-[10px] leading-relaxed font-light text-slate-500 uppercase tracking-widest">
              Assurances Collectives <br />
              Audit & Stratégie <br />
              Entrepreneuriat Paris.
            </p>
          </div>

          {/* Solutions Assurances */}
          <div className="md:ml-auto">
            <h4 className="text-xs font-bold text-orange-500 uppercase tracking-[0.2em] mb-6">Expertises</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/services" className="hover:text-white transition-colors">Santé & Prévoyance</Link></li>
              <li><Link to="/experience" className="hover:text-white transition-colors">Gestion de Comptes</Link></li>
              <li><Link to="/skills" className="hover:text-white transition-colors">Audit Entreprises</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Ma Vision</Link></li>
            </ul>
          </div>

          {/* Réseau & Business */}
          <div className="md:ml-auto">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">Ressources</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog Entrepreneur</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors">Projets & Impact</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Audit Gratuit</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Aide & FAQ</Link></li>
            </ul>
          </div>

          {/* Social Connect */}
          <div className="md:ml-auto text-left md:text-right">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-6">Réseau Professionnel</h4>
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
                    className="text-xl text-slate-500 hover:text-orange-500 transition-all duration-300 transform hover:-translate-y-1"
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
          <p>© {currentYear} Jonathan Booto | Experte Assurance Paris.</p>
          <p className="font-light">Sécuriser l'humain pour libérer la croissance</p>
        </div>
      </div>
    </footer>
  );
}
