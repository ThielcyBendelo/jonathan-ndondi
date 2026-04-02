import React from 'react';
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
    <footer className="bg-dark-200 text-gray-300 py-8 mt-auto border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et Description */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple to-pink text-transparent bg-clip-text">
                Mon Portfolio
              </span>
            </h3>
            <p className="text-sm text-gray-400">
              Créons ensemble des expériences web exceptionnelles
            </p>
          </div>

          {/* Liens rapides */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#home"
                  className="hover:text-purple transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-purple transition-colors"
                >
                  À propos de moi
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  className="hover:text-purple transition-colors"
                >
                  Compétences
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-purple transition-colors"
                >
                 Services 
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-purple transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4">Me Suivre</h4>
            <div className="flex justify-center md:justify-end space-x-4">
              {contact.map((item) => {
                const Icon = socialIcons[item.label];
                if (!Icon) return null;
                // If the contact link is an email address (no protocol), convert to mailto
                let href = item.link;
                if (item.label === 'Email' && !/^mailto:/i.test(href)) {
                  href = `mailto:${href}`;
                }
                return (
                  <a
                    key={item.label}
                    href={href}
                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={
                      href.startsWith('mailto:')
                        ? undefined
                        : 'noopener noreferrer'
                    }
                    className="text-2xl hover:text-purple transition-colors hover:scale-110 transform duration-200"
                    aria-label={item.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright uniquement */}
        <div className="mt-auto pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {currentYear} Louiscar Ingeba | CRP . Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
