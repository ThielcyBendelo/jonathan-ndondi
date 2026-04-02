import React from "react";

const portfolio = [
  {
    title: "Site vitrine Tech Innov",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    description: "Refonte complète du site vitrine pour Tech Innov, avec design moderne, SEO optimisé et sécurité renforcée.",
    tags: ["React", "SEO", "Design"],
    link: "#",
  },
  {
    title: "E-commerce Ecom Africa",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    description: "Développement d'une plateforme e-commerce sur-mesure, intégration paiement sécurisé et gestion des stocks.",
    tags: ["E-commerce", "Sécurité", "Node.js"],
    link: "#",
  },
  {
    title: "Application mobile StartupX",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    description: "Application mobile hybride pour StartupX, notifications push, design responsive et publication sur stores.",
    tags: ["Mobile", "React Native", "UX"],
    link: "#",
  },
];

function PortfolioSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 via-white to-gray-50" id="portfolio">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-6 drop-shadow-lg text-center">Portfolio</h2>
        <p className="text-lg text-gray-700 mb-10 text-center">Quelques réalisations récentes pour nos clients.</p>
        <div className="grid gap-10 md:grid-cols-3">
          {portfolio.map((p, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 hover:shadow-2xl transition flex flex-col">
              <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-blue-800 mb-2">{p.title}</h3>
                <p className="text-gray-700 mb-2">{p.description}</p>
                <div className="mb-2 flex flex-wrap gap-2">
                  {p.tags.map((tag, i) => (
                    <span key={i} className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-semibold shadow">{tag}</span>
                  ))}
                </div>
                <a href={p.link} className="mt-auto inline-block text-blue-600 underline hover:text-blue-800 font-semibold transition">Voir le projet</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PortfolioSection;
