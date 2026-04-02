import React from "react";

const steps = [
  {
    icon: "📝",
    title: "Analyse & Conseil",
    description: "Écoute de vos besoins, audit, et recommandations personnalisées pour un projet sur-mesure.",
  },
  {
    icon: "🎨",
    title: "Design & Prototype",
    description: "Création de maquettes, design UX/UI, validation du parcours utilisateur et identité visuelle.",
  },
  {
    icon: "💻",
    title: "Développement",
    description: "Développement technique, intégration des fonctionnalités, sécurité et performance.",
  },
  {
    icon: "🚀",
    title: "Mise en ligne & Suivi",
    description: "Déploiement, tests, formation, et accompagnement post-livraison pour garantir la réussite.",
  },
];

function ProcessSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white via-blue-50 to-gray-50" id="process">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-6 drop-shadow-lg text-center">Notre Processus</h2>
        <p className="text-lg text-gray-700 mb-10 text-center">Un accompagnement complet, étape par étape, pour garantir la réussite de votre projet digital.</p>
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition">
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-lg font-bold text-blue-800 mb-2">{step.title}</h3>
              <p className="text-gray-700 text-center">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
