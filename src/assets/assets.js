// Chemins des images - fichiers servis depuis le dossier public/
export const projet1 = '/images/projet1.jpg';
export const projet2 = '/images/projet2.png';
export const projet3 = '/images/projet3.jpg';
export const projet4 = '/images/projet4.jpg';
export const projet5 = '/images/projet5.webp';
export const projet6 = '/images/projet6.jpg';
export const predictiveMaintenance = '/images/predictive-maintenance.png';
export const profileImage = '/images/louiscar.jpeg';
export const profile1Image = '/images/louiscar.jpeg';
export const bgImage = '/images/background.jpg';
export const programmationImage = '/images/image.programmation2.jpg';
export const reactLogo = '/images/react.svg';
export const logoImage = '/images/logolouiscar.jpeg';

export const about =
  "Expert en relations publiques doté d'une solide expertise en maintenance système, j'assure la synergie entre la performance technique de nos outils et le rayonnement de notre agence. Mon rôle : garantir que nos systèmes ne tombent jamais et que nos partenariats ne cessent de croître.";

export const skills = [
  'Négociation',
  'Communication de crise',
  'Vulgarisation technique',
  'Gestion de projet',

  // Systèmes et réseaux
 
  'Administration Linux/Windows',
  'Docker',
  'gestion de serveurs Cloud (AWS/Vercel/DigitalOcean)',
  'Monotoring (Prometheus, Grafana)',

  // Communication
  'Rédaction de communiqués',
  'Réseaux sociaux professionnels (LinkedIn)',
  'Organisation d/événements IT.',

  // Sécurité
  'Audits de sécurité système', 
  'Gestion des sauvegardes',
  'Protocoles de protection des données (RGPD)', 
];

export const experiences = [
  {
    role: 'Ingénieur Full Stack',
    company: 'Digital Innovation Lab',
    year: '2024-Présent',
    type: 'full-time',
    description:
      "Développement end-to-end d'applications web (React/Node.js/MongoDB), intégration CI/CD, et optimisation des performances (+40% de rapidité).",
  },
  {
    role: 'Développeur Backend',
    company: 'Mwamokel Services',
    year: '2023-2024',
    type: 'full-time',
    description:
      "Conception et développement d'APIs RESTful scalables avec Python/Django, gestion de bases de données PostgreSQL, et architecture microservices.",
  },
  {
    role: 'Testeur Logiciel / QA Engineer',
    company: 'Mwamokel Services',
    year: '2023-2024',
    type: 'full-time',
    description:
      'Automatisation des tests (Selenium, Jest, Cypress), détection de bugs critiques, et amélioration de la couverture de tests à 85%.',
  },
  {
    role: 'Développeur Frontend',
    company: 'Mwamokel Sevice',
    year: '2023-2024',
    type: 'full-time',
    description:
      "Création d'interfaces utilisateur modernes et responsives avec React, intégration d'APIs, et collaboration avec designers UX/UI.",
  },
];

export const projets = [
  {
    titre: 'Portfolio React',
    description: 'Site personnel pour présenter mes projets et compétences.',
    image: projet1,
    lienDemo: 'https://github.com/ThielcyBendelo',
    lienGithub: 'https://github.com/ThielcyBendelo',
    technologies: ['React', 'Tailwind', 'JavaScript'],
    fonctionnalites: [
      'Design responsive et moderne',
      'Animations fluides avec Framer Motion',
      'Navigation intuitive',
      'Optimisé pour les performances',
    ],
  },
  {
    titre: 'Application Todo',
    description:
      'Gestion de tâches avec React et localStorage pour une productivité optimale.',
    image: projet2,
    lienDemo: 'https://github.com/ThielcyBendelo/todo',
    lienGithub: 'https://github.com/ThielcyBendelo/todo',
    technologies: ['React', 'LocalStorage', 'JavaScript'],
    fonctionnalites: [
      'Ajout et suppression de tâches',
      'Marquage comme terminé',
      'Sauvegarde locale',
      'Interface utilisateur intuitive',
    ],
  },
  {
    titre: 'E-commerce Platform',
    description:
      'Plateforme de commerce électronique moderne et responsive avec gestion complète des produits.',
    image: projet3,
    lienDemo: 'https://github.com/ThielcyBendelo/ecommerce',
    lienGithub: 'https://github.com/ThielcyBendelo/ecommerce',
    technologies: ['React', 'Node.js', 'MongoDB'],
    fonctionnalites: [
      'Catalogue de produits dynamique',
      "Panier d'achat interactif",
      'Gestion des commandes',
      'Système de paiement sécurisé',
    ],
  },
  {
    titre: 'Digital Transformation',
    description:
      'Solution de transformation numérique pour entreprises avec intelligence artificielle intégrée.',
    image: projet4,
    lienDemo: 'https://github.com/ThielcyBendelo/digital-transform',
    lienGithub: 'https://github.com/ThielcyBendelo/digital-transform',
    technologies: ['React', 'Cloud', 'AI'],
    fonctionnalites: [
      'Analyse de données avancée',
      'Tableaux de bord interactifs',
      'Intégration cloud native',
      'Intelligence artificielle',
    ],
  },
  {
    titre: 'Système de Maintenance',
    description:
      'Application de gestion de maintenance préventive avec IoT et surveillance en temps réel.',
    image: predictiveMaintenance,
    lienDemo: 'https://github.com/ThielcyBendelo/maintenance',
    lienGithub: 'https://github.com/ThielcyBendelo/maintenance',
    technologies: ['React', 'Python', 'IoT'],
    fonctionnalites: [
      'Surveillance IoT en temps réel',
      'Maintenance prédictive',
      'Alertes automatiques',
      'Rapports détaillés',
    ],
  },
  {
    titre: 'Formation Tech',
    description:
      "Plateforme d'apprentissage en ligne pour développeurs avec cours interactifs et certifications.",
    image: projet6,
    lienDemo: 'https://github.com/monportfolio/formation',
    lienGithub: 'https://github.com/monportfolio/formation',
    technologies: ['React', 'Express', 'MongoDB'],
    fonctionnalites: [
      'Cours interactifs et vidéos',
      'Système de progression',
      'Certifications en ligne',
      "Communauté d'apprentissage",
    ],
  },
];

export const works = [
  // 'Direction de projet e-commerce multilingue (équipe de 10 développeurs)',
  "Architecture et développement d'API RESTful pour plateforme bancaire",
  'Mise en place de pipeline CI/CD et automatisation des tests',
  "Développement Full Stack de plateforme de gestion d'entreprise (ERP)",
  'Consultation en transformation digitale pour PME',
  // 'Formation et mentorat de développeurs juniors',
];

export const contact = [
  { label: 'Email', link: 'ingebalouiscar@gmail.com' },
  {
    label: 'LinkedIn',
    link: 'https://linkedin.com/in/louiscar',
  },
  { label: 'GitHub', link: 'https://github.com/' },
  {
    label: 'Instagram',
    link: 'https://instagram.com/louiscarfernandez?igsh=MjB3ODdzMDI4dGto',
  },
  {
    label: 'Facebook',
    link: 'https://facebook.com/louiscar.fernandez',
  },
  {
    label: 'WhatsApp',
    link: 'https://wa.me/',
  },
];
