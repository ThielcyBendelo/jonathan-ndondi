import React from 'react';
import { projets } from '../assets/assets.js';

export default function ProjetSimple() {
  return (
    <section id="projects" className="py-20 px-4 bg-dark-200 mt-24">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-white">
          Mes Projets
        </h2>
        <p className="text-lg md:text-xl text-center mb-12 text-gray-300 max-w-2xl mx-auto">
          Découvrez une sélection de mes réalisations récentes
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projets.map((projet, index) => (
            <div
              key={index}
              className="bg-dark-100 rounded-lg shadow-[0_8px_32px_0_rgba(80,0,160,0.18)] overflow-hidden hover:shadow-[0_16px_48px_0_rgba(80,0,160,0.32)] transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image du projet */}
              <div className="relative overflow-hidden">
                <img
                  src={projet.image}
                  alt={projet.titre}
                  className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {projet.titre}
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {projet.description}
                </p>

                {/* Technologies utilisées */}
                {projet.technologies && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {projet.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-primary text-white text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  {projet.lienDemo && (
                    <a
                      href={projet.lienDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
                    >
                      Démo
                    </a>
                  )}
                  {projet.lienGithub && (
                    <a
                      href={projet.lienGithub}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                    >
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
