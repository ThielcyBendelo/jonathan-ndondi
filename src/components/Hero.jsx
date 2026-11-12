import useParallax from '../hooks/useParallax';
import useIntersectionObserver from '../hooks/useIntersectionObserver';
import LazyImage from './LazyImage';
import { useEffect, useState } from 'react';
import { profile1Image } from '../assets/assets.js';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import { 
  FaShieldAlt, 
  FaRocket, 
  FaHandshake, 
  FaChevronLeft, 
  FaChevronRight,
  FaWhatsapp,
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaBuilding,
  FaUser
} from 'react-icons/fa';

// --- SECTION EXPERTISES ---
const Expertises = () => (
  <section id="services" className="py-24 bg-white text-[#191970] px-6">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif mb-16 border-l-4 border-orange-500 pl-6 text-left font-bold uppercase tracking-tight">
        Expertise & Vision
      </h2>
      <div className="grid md:grid-cols-3 gap-12 text-left">
        {[
          { 
            title: "Assurances Collectives", 
            icon: <FaShieldAlt className="text-orange-500 mb-4" size={28} />,
            desc: "Optimisation des contrats de protection sociale, santé et prévoyance pour les entreprises et leurs salariés." 
          },
          { 
            title: "Stratégie Entrepreneuriale", 
            icon: <FaRocket className="text-orange-500 mb-4" size={28} />,
            desc: "Accompagnement opérationnel pour transformer vos ambitions en succès commerciaux durables." 
          },
          { 
            title: "Gestion de Comptes", 
            icon: <FaHandshake className="text-orange-500 mb-4" size={28} />,
            desc: "Une approche sur mesure basée sur la confiance, la rigueur technique et une réactivité parisienne." 
          }
        ].map((service, i) => (
          <div key={i} className="group cursor-pointer border-b border-slate-100 pb-8 hover:border-orange-500 transition-all">
            {service.icon}
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">{service.title}</h3>
            <p className="text-slate-600 font-light leading-relaxed">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- SECTION : VALEUR AJOUTÉE & MÉTHODOLOGIE ---
const ValueProposition = () => (
  <section className="py-24 bg-slate-50 dark:bg-[#0a0f1d] px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Gauche : Statistiques d'Impact */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Économie Moyenne", value: "15%", sub: "sur vos budgets santé" },
            { label: "Conformité", value: "100%", sub: "Risque URSSAF maîtrisé" },
            { label: "Réactivité", value: "24h", sub: "Délai de réponse moyen" },
            { label: "Portefeuille", value: "50+", sub: "PME accompagnées" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-8 bg-white dark:bg-slate-900 shadow-sm border-b-4 border-orange-500"
            >
              <div className="text-3xl font-serif font-bold text-[#191970] dark:text-white mb-2">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest font-black text-orange-500 mb-1">{stat.label}</div>
              <div className="text-xs text-slate-400 font-light">{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Droite : Processus d'Accompagnement */}
        <div className="space-y-8 text-left">
          <h2 className="text-sm tracking-[0.4em] uppercase text-orange-500 font-bold">Votre parcours partenaire</h2>
          <h3 className="text-4xl font-serif font-bold text-[#191970] dark:text-white leading-tight">
            Une approche structurée pour des <span className="italic font-light">résultats mesurables.</span>
          </h3>
          
          <div className="space-y-6 mt-10">
            {[
              { step: "01", title: "Audit Flash", text: "Analyse gratuite de vos contrats actuels et identification des carences." },
              { step: "02", title: "Ingénierie Sociale", text: "Conception d'une solution sur-mesure alignée sur votre CCN." },
              { step: "03", title: "Pilotage Dédié", text: "Gestion quotidienne des mouvements et reporting de sinistralité." }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 group text-left">
                <span className="text-2xl font-serif font-bold text-orange-500/30 group-hover:text-orange-500 transition-colors">
                  {item.step}
                </span>
                <div>
                  <h4 className="font-bold text-[#191970] dark:text-white uppercase tracking-tighter mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- SECTION QUOTE ---
const Quote = () => (
  <section className="py-24 bg-[#191970] text-white text-center italic font-light px-6">
    <div className="max-w-4xl mx-auto">
      <p className="text-2xl md:text-3xl leading-snug font-serif">
        "L'assurance n'est pas qu'une protection, c'est le levier de sérénité indispensable à toute croissance entrepreneuriale audacieuse."
      </p>
      <div className="mt-8 h-px w-20 bg-orange-500 mx-auto"></div>
    </div>
  </section>
);

// --- COMPOSANT PRINCIPAL HERO DÉFILANT + MODALE WHATSAPP ---
export default function Hero() {
  const scrollY = useParallax();
  const [elementRef] = useIntersectionObserver();

    // Numéro WhatsApp professionnel
  const WHATSAPP_NUMBER = "33650092569";

  // États pour le carrousel
  const slides = [
    {
      image: '/background4.jpeg',
      badge: 'ASSURANCES COLLECTIVES • ENTREPRENEUR • PARIS',
      titleBold: 'Jonathan Booto',
      titleItalic: 'Ndondi',
      description: (
        <>
          Expert en <strong className="font-semibold text-white">gestion de comptes</strong> et ingénierie sociale pour les entreprises qui façonnent demain.
        </>
      )
    },
    {
      image: '/background5.jpeg',
      badge: 'INGÉNIERIE SOCIALE • SANTÉ & PRÉVOYANCE',
      titleBold: 'Protégez vos',
      titleItalic: 'Talents',
      description: (
        <>
          Des contrats collectifs sur-mesure, <strong className="font-semibold text-white">conformes à votre CCN</strong> et optimisés fiscalement.
        </>
      )
    },
    {
      image: '/background6.jpeg',
      badge: 'PILOTAGE DÉDIÉ • RÉACTIVITÉ PARISIENNE',
      titleBold: 'Partenaire de',
      titleItalic: 'Croissance',
      description: (
        <>
          Un accompagnement stratégique et humain pour <strong className="font-semibold text-white">sécuriser le développement</strong> de votre société.
        </>
      )
    }
  ];

  const [bgIndex, setBgIndex] = useState(0);

  // États pour la modale de rendez-vous
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    fullName: '',
    company: '',
    employees: '1 à 10 salariés (TPE)',
    topic: 'Audit Mutuelle & Prévoyance Collective',
    date: '',
    timeSlot: 'Matin (09h30 - 12h00)',
    format: 'Visioconférence',
    notes: ''
  });

  // Défilement automatique du carrousel (mis en pause si la modale est ouverte)
  useEffect(() => {
    if (isModalOpen) return;
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bgIndex, slides.length, isModalOpen]);

  const prevSlide = () => {
    setBgIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setBgIndex((prev) => (prev + 1) % slides.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({ ...prev, [name]: value }));
  };

  // Génération et envoi du message sur WhatsApp
  const handleSendWhatsApp = (e) => {
    e.preventDefault();

    const cleanPhone = WHATSAPP_NUMBER.replace(/\D/g, '');

    const formattedDate = appointmentData.date
      ? new Date(appointmentData.date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      : 'À définir ensemble';

    const message = [
      `Bonjour *Jonathan Booto Ndondi*,`,
      `Je souhaite planifier un rendez-vous concernant nos assurances collectives :`,
      ``,
      `👤 *Contact :* ${appointmentData.fullName}`,
      `🏢 *Entreprise :* ${appointmentData.company || 'Non précisée'}`,
      `👥 *Effectif :* ${appointmentData.employees}`,
      `📋 *Objet :* ${appointmentData.topic}`,
      `📅 *Date souhaitée :* ${formattedDate}`,
      `⏰ *Créneau :* ${appointmentData.timeSlot}`,
      `📍 *Format :* ${appointmentData.format}`,
      appointmentData.notes ? `📝 *Précisions :* ${appointmentData.notes}` : null,
      ``,
      `Dans l'attente de votre confirmation.`
    ]
      .filter(Boolean)
      .join('\n');

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = "https://wa.me/" + cleanPhone + "?text=" + encodedMessage;

    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = whatsappUrl;
    }

    setIsModalOpen(false);
  };

  const currentSlide = slides[bgIndex];


  return (
    <>
      <section
        ref={elementRef}
        id="home"
        className="relative min-h-screen flex flex-col justify-center items-center text-center py-20 px-6 overflow-hidden bg-[#191970]"
      >
        {/* 1. Arrière-plan défilant avec Parallax */}
        <AnimatePresence mode="wait">
          <motion.div
            key={bgIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${currentSlide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.30) contrast(110%)',
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          />
        </AnimatePresence>

        {/* Dégradé bleu nuit d'origine */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191970] via-transparent to-black/40 z-10 pointer-events-none" />

        {/* Flèches de navigation discrètes */}
        <button
          onClick={prevSlide}
          aria-label="Image précédente"
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-3 text-white/60 hover:text-orange-500 transition-colors cursor-pointer"
        >
          <FaChevronLeft size={24} />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Image suivante"
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-3 text-white/60 hover:text-orange-500 transition-colors cursor-pointer"
        >
          <FaChevronRight size={24} />
        </button>

        {/* 2. Contenu central */}
        <div className="relative z-20 max-w-4xl w-full flex flex-col items-center">
          
          {/* Photo de profil ronde d'origine */}
          <AnimatedSection variant="scaleIn" delay={0.2}>
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <LazyImage
                  src={profile1Image}
                  alt="Jonathan Booto Ndondi"
                  className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full object-cover border-2 border-orange-500/30 shadow-[0_0_50px_rgba(255,140,0,0.15)]"
                  style={{ objectPosition: 'center 10%' }}
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-3 border-l-2 border-t-2 border-orange-500/20 rounded-full pointer-events-none"
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Titre, Sous-titre et Description défilants */}
          <AnimatePresence mode="wait">
            <motion.div
              key={bgIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center mb-10"
            >
              <p className="text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.28em] text-orange-400 font-semibold mb-4 leading-relaxed">
                {currentSlide.badge}
              </p>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white tracking-tight leading-tight mb-6">
                <span className="font-bold">{currentSlide.titleBold}</span>{' '}
                <span className="font-light">{currentSlide.titleItalic}</span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-200 font-light max-w-2xl leading-relaxed">
                {currentSlide.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* BOUTONS D'ORIGINE (Ouverture de la modale au clic sur PRENDRE RENDEZ-VOUS) */}
          <div className="w-full max-w-md sm:max-w-xl flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#services"
              className="w-full py-4 px-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center cursor-pointer"
            >
              SOLUTIONS ENTREPRISES
            </a>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 px-8 bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white font-bold text-xs sm:text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center cursor-pointer"
            >
              PRENDRE RENDEZ-VOUS
            </button>
          </div>

          {/* Indicateurs de pagination */}
          <div className="flex items-center justify-center gap-2.5 mt-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setBgIndex(index)}
                aria-label={`Diapositive ${index + 1}`}
                className={`h-1.5 transition-all duration-300 cursor-pointer ${
                  bgIndex === index
                    ? 'w-8 bg-orange-500'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- MODALE DE PRISE DE RENDEZ-VOUS & ENVOI WHATSAPP --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] text-[#191970] dark:text-white border-t-4 border-orange-500 shadow-2xl overflow-hidden my-8"
            >
              {/* En-tête de la modale */}
              <div className="bg-[#191970] text-white px-6 py-5 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-orange-400 font-bold block">
                    Consultation Stratégique • Paris
                  </span>
                  <h3 className="text-xl font-serif font-bold mt-0.5">
                    Planifier un Rendez-vous
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Fermer la fenêtre"
                  className="p-2 text-white/70 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Formulaire de détails du rendez-vous */}
              <form onSubmit={handleSendWhatsApp} className="p-6 space-y-4 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nom complet */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                      <FaUser className="inline mr-1.5 text-orange-500" />
                      Nom & Prénom *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={appointmentData.fullName}
                      onChange={handleInputChange}
                      placeholder="Ex. Marc Dupont"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  {/* Entreprise */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                      <FaBuilding className="inline mr-1.5 text-orange-500" />
                      Entreprise *
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={appointmentData.company}
                      onChange={handleInputChange}
                      placeholder="Ex. Cabinet Conseil Paris"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Effectif & Objet */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                      Effectif salarié
                    </label>
                    <select
                      name="employees"
                      value={appointmentData.employees}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Dirigeant / Indépendant (TNS)">Dirigeant / Indépendant (TNS)</option>
                      <option value="1 à 10 salariés (TPE)">1 à 10 salariés (TPE)</option>
                      <option value="11 à 49 salariés (PME)">11 à 49 salariés (PME)</option>
                      <option value="50 à 249 salariés (PME+)">50 à 249 salariés (PME+)</option>
                      <option value="250 salariés et plus (ETI)">250 salariés et plus (ETI)</option>
                    </select>
                  </div>

                                    <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                      Besoin principal
                    </label>
                    <select
                      name="topic"
                      value={appointmentData.topic}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Audit Mutuelle & Prévoyance Collective">Audit Mutuelle & Prévoyance</option>
                      <option value="Mise en conformité CCN / DUE">Mise en conformité CCN / DUE</option>
                      <option value="Optimisation fiscale & Retraite (PERO)">Optimisation fiscale & PERO</option>
                      <option value="Gestion de compte & Renégociation">Gestion de compte & Renégociation</option>
                    </select>
                  </div>
                </div>

                {/* Date & Créneau */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                      <FaCalendarAlt className="inline mr-1.5 text-orange-500" />
                      Date souhaitée *
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={appointmentData.date}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                      <FaClock className="inline mr-1.5 text-orange-500" />
                      Créneau horaire
                    </label>
                    <select
                      name="timeSlot"
                      value={appointmentData.timeSlot}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Matin (09h30 - 12h00)">Matin (09h30 - 12h00)</option>
                      <option value="Midi (12h00 - 14h00)">Midi (12h00 - 14h00)</option>
                      <option value="Après-midi (14h00 - 17h00)">Après-midi (14h00 - 17h00)</option>
                      <option value="Fin de journée (17h00 - 19h00)">Fin de journée (17h00 - 19h00)</option>
                    </select>
                  </div>
                </div>

                {/* Format du rendez-vous */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                    Format d'échange privilégié
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'Visioconférence',
                      'Appel Téléphonique',
                      'Rendez-vous Paris'
                    ].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setAppointmentData((prev) => ({ ...prev, format: mode }))}
                        className={`py-2 px-2 text-[11px] font-semibold border transition-all cursor-pointer ${
                          appointmentData.format === mode
                            ? 'bg-[#191970] text-white border-[#191970]'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-500'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note complémentaire */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                    Précisions (Convention collective, échéance...)
                  </label>
                  <textarea
                    name="notes"
                    rows="2"
                    value={appointmentData.notes}
                    onChange={handleInputChange}
                    placeholder="Ex. CCN Syntec, renouvellement prévu au 1er janvier..."
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Bouton de validation & Envoi WhatsApp */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
                  >
                    <FaWhatsapp size={18} />
                    <span>Confirmer sur WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sections suivantes */}
      <Expertises />
      <ValueProposition />
      <Quote />
    </>
  );
}

