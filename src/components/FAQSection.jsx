import React from "react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Comment conciliez-vous le droit et le coaching ?",
    answer: "Le droit apporte la structure et la protection, tandis que le coaching apporte la vision et l'action. J'aide mes clientes à bâtir des entreprises qui sont non seulement inspirantes, mais aussi juridiquement solides et pérennes.",
  },
  {
    question: "Quels types d'accompagnement proposez-vous aux femmes ?",
    answer: "Je propose du mentorat stratégique pour les entrepreneures : de la structuration légale de leur business au développement de leur leadership, afin de maximiser leur impact sur le continent africain.",
  },
  {
    question: "Où puis-je me procurer vos livres pour la jeunesse ?",
    answer: "Mes ouvrages sont disponibles en commande directe sur ce site, ainsi que dans plusieurs librairies partenaires et sur les plateformes numériques majeures. Ils visent à outiller la nouvelle génération face aux défis actuels.",
  },
  {
    question: "Comment réserver une consultation juridique ou une session de coaching ?",
    answer: "Le processus commence par une séance de diagnostic. Vous pouvez réserver votre créneau directement via le bouton 'Prendre RDV' en haut de la page pour une analyse personnalisée de votre situation.",
  },
];

function FAQSection() {
  return (
    <section className="py-24 px-6 bg-slate-950 text-white" id="faq">
      <div className="max-w-4xl mx-auto">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.4em] uppercase text-amber-600 mb-4 font-bold">
            Assistance & Vision
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold italic">
            Réponses à vos Questions
          </h3>
        </div>

        {/* Liste des FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.details 
              key={idx} 
              className="group border-b border-white/5 bg-transparent transition-all duration-300"
            >
              <summary className="flex justify-between items-center py-6 px-4 cursor-pointer list-none">
                <span className="text-lg md:text-xl font-light tracking-wide group-hover:text-amber-500 transition-colors">
                  {faq.question}
                </span>
                <span className="text-2xl font-thin text-amber-600 group-open:rotate-45 transition-transform duration-300">
                  +
                </span>
              </summary>
              
              <div className="px-4 pb-8 text-slate-400 font-light leading-relaxed text-base md:text-lg max-w-3xl border-l border-amber-900/30 ml-4">
                {faq.answer}
              </div>
            </motion.details>
          ))}
        </div>

        {/* Note de fin pour contact direct */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm italic">
            Besoin d'un échange sur mesure ? 
            <a href="/contact" className="text-amber-500 border-b border-amber-500/30 hover:border-amber-500 transition-all ml-2 pb-1">
              Sollicitez une rencontre privée.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
