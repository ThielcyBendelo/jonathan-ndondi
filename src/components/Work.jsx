import { works } from '../assets/assets.js';
import { FaBriefcase, FaHandshake, FaBuilding } from 'react-icons/fa';

const pickWorkIcon = (label = '') => {
  const lower = label.toLowerCase();
  if (lower.includes('agence')) return FaBuilding;
  if (lower.includes('freelance') || lower.includes('pme')) return FaHandshake;
  return FaBriefcase;
};

export default function Work() {
  return (
    <section id="work" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Mon Travail
          </span>
        </h2>
        <p className="text-lg text-center text-gray-400 mb-10">
          Découvrez mes réalisations, collaborations et projets menés avec expertise, engagement et sens du résultat.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          {works.map((work, idx) => {
            const Icon = pickWorkIcon(work);
            return (
              <div
                key={idx}
                className="group card-base card-interactive card-hover-scale p-6"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-dark-300
                                  ring-1 ring-white/5 group-hover:ring-[var(--accent-1)]/40 shadow-inner"
                  >
                    <Icon className="h-6 w-6 text-gray-200 group-hover:drop-shadow-glow" />
                  </div>
                  <div>
                    <p className="text-gray-200 font-semibold">{work}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Réalisation professionnelle avec collaboration et qualité.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
