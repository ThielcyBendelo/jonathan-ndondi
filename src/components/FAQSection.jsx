import React from "react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Quels types de projets gérez-vous chez LEGACY ?",
    answer: "Nous intervenons sur des échelles variées : de la conception de résidences privées de luxe au développement de complexes commerciaux, industriels et hospitaliers, sans oublier les projets d'urbanisme public.",
  },
  {
    question: "Quelle est votre approche de la maîtrise d'œuvre ?",
    answer: "En tant qu'architecte et entrepreneur, nous assurons une gestion transversale : de l'esquisse initiale à la coordination technique sur chantier, garantissant le respect des délais et des normes de construction les plus strictes.",
  },
  {
    question: "Comment se déroule la première consultation ?",
    answer: "Nous commençons par une analyse de faisabilité et une écoute de vos besoins. Nous transformons ensuite votre vision en concepts spatiaux concrets, tout en optimisant les contraintes techniques et budgétaires.",
  },
  {
    question: "Proposez-vous des services de rénovation et réhabilitation ?",
    answer: "Absolument. Nous redonnons vie à des structures existantes en alliant préservation du patrimoine et intégration de technologies modernes et durables.",
  },
];

function FAQSection() {
  return (
    <section className="py-24 px-6 bg-slate-950 text-white" id="faq">
      <div className="max-w-4xl mx-auto">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.4em] uppercase text-slate-500 mb-4 font-light">
            Informations & Processus
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold italic">
            Questions Fréquentes
          </h3>
        </div>

        {/* Liste des FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.details 
              key={idx} 
              className="group border-b border-slate-800 bg-transparent transition-all duration-300"
            >
              <summary className="flex justify-between items-center py-6 px-4 cursor-pointer list-none">
                <span className="text-lg md:text-xl font-light tracking-wide group-open:text-slate-400 transition-colors">
                  {faq.question}
                </span>
                <span className="text-2xl font-thin text-slate-500 group-open:rotate-45 transition-transform duration-300">
                  +
                </span>
              </summary>
              
              <div className="px-4 pb-8 text-slate-400 font-light leading-relaxed text-base md:text-lg max-w-3xl">
                {faq.answer}
              </div>
            </motion.details>
          ))}
        </div>

        {/* Note de fin pour contact direct */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm italic">
            Une question spécifique ? <a href="/contact" className="text-white border-b border-white/30 hover:border-white transition-all ml-2 pb-1">Contactez l'agence directement.</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
