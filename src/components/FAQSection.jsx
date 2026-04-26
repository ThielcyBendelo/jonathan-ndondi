import React from "react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "Qu'est-ce qu'un chargé de comptes en assurances collectives ?",
    answer: "C'est un partenaire stratégique qui gère et optimise les contrats de protection sociale (santé, prévoyance, retraite) d'une entreprise. Mon rôle est de négocier les meilleurs tarifs et garanties tout en assurant une gestion administrative fluide pour l'employeur et ses salariés.",
  },
  {
    question: "Comment votre profil d'entrepreneur aide-t-il mes projets ?",
    answer: "Ma vision entrepreneuriale me permet de comprendre vos impératifs de rentabilité et de croissance. Je ne me contente pas de gérer des risques ; je vous aide à structurer des solutions qui attirent les talents et sécurisent votre capital humain, moteur de votre business.",
  },
  {
    question: "Proposez-vous des audits pour les entreprises basées à Paris ?",
    answer: "Absolument. Je réalise des audits complets sur site ou à distance pour les entreprises franciliennes. L'objectif est d'identifier les carences de couverture et les opportunités d'économies sur vos contrats actuels.",
  },
  {
    question: "Comment se déroule la mise en place d'une nouvelle solution ?",
    answer: "Le processus est simple : nous commençons par un diagnostic gratuit. Si une optimisation est possible, je m'occupe de la mise en concurrence des assureurs et de la transition technique pour que l'impact sur votre temps soit minimal.",
  },
];

function FAQSection() {
  return (
    <section className="py-24 px-6 bg-[#191970] text-white" id="faq">
      <div className="max-w-4xl mx-auto">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.4em] uppercase text-orange-500 mb-4 font-bold">
            Expertise & Réponses
          </h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold">
            Questions Fréquentes
          </h3>
        </div>

        {/* Liste des FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.details 
              key={idx} 
              className="group border-b border-white/10 bg-transparent transition-all duration-300"
            >
              <summary className="flex justify-between items-center py-6 px-4 cursor-pointer list-none">
                <span className="text-lg md:text-xl font-light tracking-wide group-hover:text-orange-400 transition-colors">
                  {faq.question}
                </span>
                <span className="text-2xl font-thin text-orange-500 group-open:rotate-45 transition-transform duration-300">
                  +
                </span>
              </summary>
              
              <div className="px-4 pb-8 text-slate-300 font-light leading-relaxed text-base md:text-lg max-w-3xl border-l border-orange-500/30 ml-4">
                {faq.answer}
              </div>
            </motion.details>
          ))}
        </div>

        {/* Note de fin */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm italic">
            Une problématique spécifique ? 
            <a href="/contact" className="text-orange-500 border-b border-orange-500/30 hover:border-orange-500 transition-all ml-2 pb-1 font-bold">
              Planifions un échange stratégique.
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
