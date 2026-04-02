import React from "react";
import { motion } from 'framer-motion';

const team = [
  {
    name: "Ir Bendelo Thielcy",
    role: "Lead Developer & Consultant",
    bio: "Expert fullstack, sécurité, cloud, IA. 10+ ans d'expérience, passionné par l'innovation et la réussite client.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    linkedin: "https://www.linkedin.com/in/bendelothielcy/",
    skills: ["React", "Node.js", "Cloud", "Sécurité", "IA"],
    badge: "Fondateur",
  },
  {
    name: "Sophie Martin",
    role: "UI/UX Designer & Brand Specialist",
    bio: "Design d'interfaces, branding, accessibilité. Créatrice de parcours digitaux engageants et inclusifs.",
    avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    linkedin: "https://www.linkedin.com/in/sophiemartin/",
    skills: ["Figma", "UX", "Branding", "Accessibilité"],
    badge: "Design Lead",
  },
  {
    name: "Jean Dupont",
    role: "Cloud Architect & Security Expert",
    bio: "Ingénieur cloud, DevOps, cybersécurité. Garant de la fiabilité, scalabilité et protection des données clients.",
    avatar: "https://randomuser.me/api/portraits/men/48.jpg",
    linkedin: "https://www.linkedin.com/in/jeandupont/",
    skills: ["AWS", "Azure", "DevOps", "Pentest"],
    badge: "Expert Sécurité",
  },
];


function TeamSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white via-blue-50 to-gray-50" id="team">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-6 drop-shadow-lg">Notre Équipe Professionnelle</h2>
        <p className="text-lg text-gray-700 mb-10">Des experts passionnés, engagés pour la réussite de votre projet digital. Découvrez les talents qui vous accompagnent à chaque étape.</p>
        <div className="grid gap-8 md:grid-cols-3">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border border-blue-100 hover:shadow-2xl transition"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, type: 'spring', stiffness: 120 }}
            >
              <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full mb-4 border-4 border-blue-200 shadow" />
              <div className="font-bold text-blue-800 text-lg mb-1 flex items-center gap-2">
                {member.name}
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-semibold">{member.badge}</span>
              </div>
              <div className="text-sm text-purple-700 mb-2">{member.role}</div>
              <div className="mb-2 flex flex-wrap gap-2 justify-center">
                {member.skills.map((skill, i) => (
                  <span key={i} className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-semibold shadow">{skill}</span>
                ))}
              </div>
              <p className="text-gray-700 text-center mb-2">{member.bio}</p>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 text-sm">LinkedIn</a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
