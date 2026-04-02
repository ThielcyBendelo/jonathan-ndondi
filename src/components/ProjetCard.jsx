import LazyImage from './LazyImage';
import { FaExpand } from 'react-icons/fa';

export default function ProjetCard({ projet, onOpenLightbox }) {
  return (
    <div className="card-base card-interactive card-hover-scale overflow-hidden relative">
      {/* Image en box-shadow derrière la carte */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${projet.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(16px) brightness(0.5)',
          opacity: 0.35,
        }}
      />
      <div className="relative z-10">
        <div className="relative group">
          <LazyImage
            src={projet.image}
            alt={projet.title}
            className="w-full h-48 md:h-56 object-cover rounded-t-lg transition-transform 
                     group-hover:scale-105 cursor-pointer"
            priority={false}
            onClick={() => onOpenLightbox && onOpenLightbox()}
          />
          <div className="absolute inset-0 bg-linear-to-t from-dark-100/80 to-transparent rounded-t-lg" />

          {/* Bouton d'agrandissement */}
          <button
            onClick={() => onOpenLightbox && onOpenLightbox()}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg
                     opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100
                     transition-all duration-300 hover:bg-purple/80"
            title="Voir en plein écran"
          >
            <FaExpand className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">{projet.title}</h3>
          <p className="text-gray-300 mb-4">{projet.description}</p>
          {/* Technologies */}
          {projet.technologies && <TechChips items={projet.technologies} />}
          <a
            href={projet.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-gradient-to-r from-purple to-pink text-white rounded-lg transform transition-all
                       hover:scale-105 hover:shadow-neon-purple"
          >
            Voir le projet
          </a>
        </div>
      </div>
    </div>
  );
}

// Technology chips with icons
import { FaReact, FaCloud, FaBrain } from 'react-icons/fa';
import { FaNodeJs } from 'react-icons/fa';
import {
  SiTailwindcss,
  SiJavascript,
  SiMongodb,
  SiPython,
  SiExpress,
} from 'react-icons/si';
import { GiCircuitry } from 'react-icons/gi';

const techIcons = {
  React: FaReact,
  Tailwind: SiTailwindcss,
  JavaScript: SiJavascript,
  'Node.js': FaNodeJs,
  MongoDB: SiMongodb,
  Cloud: FaCloud,
  AI: FaBrain,
  Python: SiPython,
  IoT: GiCircuitry,
  Express: SiExpress,
};

function TechChips({ items = [] }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map((t, i) => {
        const Icon = techIcons[t];
        return (
          <span
            key={`${t}-${i}`}
            className="inline-flex items-center gap-1.5 text-xs px-2 py-1 bg-dark-300/90 border border-dark-300/70
                       rounded-full text-gray-300 shadow-soft hover:shadow-elevated transition-all"
            title={t}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            <span>{t}</span>
          </span>
        );
      })}
    </div>
  );
}
