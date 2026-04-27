// Chemins des images - fichiers servis depuis le dossier public/
export const projet1 = '/images/projet1.jpg';
export const projet2 = '/images/projet2.png';
export const projet3 = '/images/projet3.jpg';
export const projet4 = '/images/projet4.jpg';
export const projet5 = '/images/projet5.webp';
export const projet6 = '/images/projet6.jpg';
export const predictiveMaintenance = '/images/predictive-maintenance.png';
export const profileImage = '/images/proabout.jpeg';
export const profile1Image = '/images/probooto.jpeg';
export const bgImage = '/images/background.jpeg';
export const programmationImage = '/images/image.programmation2.jpg';
export const logoImages = '/images/logojo.jpeg';
export const repo1 = '/images/repo1.jpeg';
export const repo2 = '/images/repo2.jpeg';
export const repo3 = '/images/repo3.jpeg';

export const about =
  "Avocate dévouée à la justice et entrepreneure passionnée, j'œuvre pour la protection des droits et l'épanouissement du leadership féminin en Afrique. À travers mes ouvrages et mes séances de coaching, je m'engage à transmettre aux femmes et à la jeunesse les outils stratégiques et juridiques nécessaires pour bâtir des projets à fort impact et transformer durablement notre société.";

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
    year: "Mars 2026",
    role: "Ingénieur Conseil -Santé et Prévoyance collectives",
    company: "PLENITA",
    type: "conseil",
    // On transforme la description en un tableau de points
    descriptions: [
      "Conseil auprès d'entreprises dans la conception, la mise en place et l'optimisation de leurs regimes de protection sociale collective.",
      "Analyse des besoins des DRH, CSE et directions financière et diagnostic des regimes existants.",
      "Vérification de la conformité réglementaire des dispositifs (ANI, conventions collectives, obligations sociales).",
      "Pilotage d’appels d’offres assureurs : rédaction des cahiers des charges, consultation du marché et analyse comparative des offres.",
      "Négociation des conditions techniques et tarifaires avec les organismes assureurs.",
      "Préparation et présentation de bilans techniques annuels et recommandations d’optimisation des régimes.",
      "Développement commercial : prospection d’entreprises (+50 salariés) et promotion du rôle de conseil du cabinet.",
      "Participation à la rédaction d’appels d’offres et réponses aux consultations.",
      "Veille réglementaire et analyse des évolutions du marché de la protection sociale.",
    ]
  },
    {
    year: "Septembre 2022 - Février 2026",
    role: "Chargé de clientèle - Assurance de personnes - secteur public",
    company: "WILLIS TOWERS WATSON (WTW, Ex-GRAS SAVOYE)",
    type: "gestion",
    // On transforme la description en un tableau de points
    descriptions: [
      "Gestion, saturation du portefeuille et prospection.",
      "Suivi du portefeuille clients (247 clients, 80 rendez-vous clients par an) : Proposition d’une véritable approche conseil après identification, analyse, et compréhension des besoins et enjeux des clients, alerte sur les évolutions juridiques pouvant avoir un impact sur les contrats.",
      "Analyse des opportunités de développement et préparation d’un plan d’action dans le cadre des objectifs commerciaux",
      "Réponse aux appels d’offres lancés par les clients et les prospects (au minimum 80 par an).",
      "Participation à la négociation dans l’activité de placement auprès des organismes assureurs.",
      "Reporting de l’activité et présentation des résultats aux clients.",
      "Participation aux projets transverses du groupe.",
    ]
  },
    {
    year: "Avril 2021 - Août 2022 ",
    role: " Juriste en Protection sociale & Droit des assurances",
    company: " COLONNA BROKER, Courtier spécialisé en santé et prévoyance",
    type: "juridique",
    // On transforme la description en un tableau de points
    descriptions: [
      "Conseil auprès des différents services opérationnels et clients",
      "Mise en conformité réglementaire et conventionnelle (conventions collectives nationales)",
      "Gestion de portefeuille (mise à jour de la documentation contractuelle, suivi de l’évolution du portefeuille).",
      "Rédaction des actes de mise en place (accords collectifs, décisions unilatérales de l‘employeur)",
      "Réalisation des cartographies des garanties d’un portefeuille (Analyse de la conformité des régimes et des actes de mise en place).",
      "Réalisation des comparatifs des garanties.",
      "Étude des conventions de distribution (co-courtage et partenariat).",
      "Analyse des cahiers de charges.",
      "Validation des contrats d’assurances et avenants.",
      "Suivi des pièces contractuelles",
    ]
  },
    {
    year: "Novembre 2020 - février 2021",
    role: "Juriste en Droit des assurances",
    company: "CHOISEZ & ASSOCIES, Cabinet d’Avocats spécialisé en droit des assurances de dommage (Biens et RC)",
    type: "juridique",
    // On transforme la description en un tableau de points
    descriptions: [
      "Participation au traitement des dossiers.",
      "Participation à la rédaction d’actes juridiques et de procédures (Assignation, conclusions, conventions d’honoraires, mise en demeure).",
      "Réalisation des recherches juridiques",
      "Veille juridique.",
    ]
  }
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
  { label: 'Email', link: 'jonathanbooto@gmail.com' },
  {
    label: 'LinkedIn',
    link: 'https://linkedin.com/in/',
  },
  // { label: 'GitHub', link: 'https://github.com/' },
  {
    label: 'Instagram',
    link: 'https://instagram.com/',
  },
  {
    label: 'Facebook',
    link: 'https://facebook.com/',
  },
  // {
  //   label: 'WhatsApp',
  //   link: 'https://wa.me/',
  // },
];
