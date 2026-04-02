import React from "react";

const testimonials = [
  {
    name: "Sophie Martin",
    company: "Tech Innov",
    text: "Un service exceptionnel, une équipe à l'écoute et un site web livré dans les délais. Je recommande vivement !",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    name: "Jean Dupont",
    company: "StartupX",
    text: "La sécurité et la performance sont au rendez-vous. Merci pour votre professionnalisme et votre réactivité !",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    name: "Fatou Ndiaye",
    company: "Ecom Africa",
    text: "Design moderne, accompagnement sur-mesure et résultats concrets. Notre e-commerce a décollé grâce à vous !",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
];

function TestimonialsSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white via-blue-50 to-gray-50" id="testimonials">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-6 drop-shadow-lg">Témoignages Clients</h2>
        <p className="text-lg text-gray-700 mb-10">Ils nous ont fait confiance pour leur projet digital. Découvrez leurs retours d'expérience.</p>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition">
              <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-full mb-4 border-4 border-blue-200 shadow" />
              <div className="flex mb-2">
                {[...Array(t.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-700 italic mb-2">"{t.text}"</p>
              <div className="font-bold text-blue-800">{t.name}</div>
              <div className="text-sm text-gray-500">{t.company}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
