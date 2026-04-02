import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function TestimonialsSystem({
  testimonials = [],
  autoPlay = true,
  interval = 5000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || testimonials.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, testimonials.length, interval]);

  // Default testimonials data
  const defaultTestimonials = [
    {
      id: 1,
      author: 'Marie Dubois',
      role: 'Directrice Marketing',
      company: 'TechStart Solutions',
      content:
        "Ir Bendelo a transformé notre présence digitale. Le site web qu'ils ont créé a augmenté nos conversions de 150%. Une équipe professionnelle et créative !",
      rating: 5,
      project: 'Site E-commerce TechStart',
      avatar: '/api/placeholder/80/80',
      date: '2024-03-15',
    },
    {
      id: 2,
      author: 'Jean-Pierre Martin',
      role: 'CEO',
      company: 'Innovation Labs',
      content:
        "Un travail exceptionnel sur notre application mobile. L'interface utilisateur est intuitive et le design moderne. Nous recommandons vivement leurs services.",
      rating: 5,
      project: 'App Mobile Innovation',
      avatar: '/api/placeholder/80/80',
      date: '2024-02-28',
    },
    {
      id: 3,
      author: 'Sophie Laurent',
      role: 'Fondatrice',
      company: 'Creative Studio',
      content:
        'Délais respectés, qualité irréprochable et un accompagnement personnalisé. Ir Bendelo comprend vraiment les besoins de ses clients.',
      rating: 5,
      project: 'Site Vitrine Creative',
      avatar: '/api/placeholder/80/80',
      date: '2024-01-20',
    },
    {
      id: 4,
      author: 'Alexandre Petit',
      role: 'CTO',
      company: 'DataFlow Systems',
      content:
        "L'expertise technique d'Ir Bendelo est remarquable. Ils ont développé une solution sur mesure qui répond parfaitement à nos besoins complexes.",
      rating: 5,
      project: 'Dashboard Analytics',
      avatar: '/api/placeholder/80/80',
      date: '2024-04-10',
    },
  ];

  const displayTestimonials =
    testimonials.length > 0 ? testimonials : defaultTestimonials;

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + displayTestimonials.length) % displayTestimonials.length
    );
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  if (displayTestimonials.length === 0) return null;

  const currentTestimonial = displayTestimonials[currentIndex];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const testimonialVariants = {
    enter: { opacity: 0, x: 100, scale: 0.95 },
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      scale: 0.95,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-16 bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">IR</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Témoignages
            </h2>
          </div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Découvrez ce que nos clients disent de notre travail et de notre
            expertise
          </p>
        </motion.div>

        {/* Main Testimonial Card */}
        <motion.div variants={itemVariants} className="relative mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="relative p-8 lg:p-12">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M20,20 Q50,5 80,20 Q95,50 80,80 Q50,95 20,80 Q5,50 20,20 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={testimonialVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative z-10"
                >
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <blockquote className="text-xl lg:text-2xl text-slate-700 text-center leading-relaxed mb-8 font-medium">
                    "{currentTestimonial.content}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">
                          {currentTestimonial.author.charAt(0)}
                        </span>
                      </div>
                      <div className="text-center lg:text-left">
                        <h4 className="text-xl font-bold text-slate-800">
                          {currentTestimonial.author}
                        </h4>
                        <p className="text-slate-600">
                          {currentTestimonial.role}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {currentTestimonial.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-center lg:items-start space-y-2">
                      {/* Stars Rating */}
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-2xl ${
                              i < currentTestimonial.rating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      {/* Project & Date */}
                      <div className="text-center lg:text-left">
                        <p className="text-sm font-semibold text-blue-600">
                          {currentTestimonial.project}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(currentTestimonial.date).toLocaleDateString(
                            'fr-FR',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 text-slate-600 hover:text-slate-800"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 text-slate-600 hover:text-slate-800"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Testimonial Navigation Dots */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center space-x-3 mb-8"
        >
          {displayTestimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 w-8'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </motion.div>

        {/* Play/Pause Control */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 text-slate-600 hover:text-slate-800"
          >
            {isPlaying ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                <span className="font-medium">Pause</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="font-medium">Lecture</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Statistics Summary */}
        <motion.div variants={itemVariants} className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Clients Satisfaits', value: '50+', icon: '😊' },
              { label: 'Projets Terminés', value: '100+', icon: '🚀' },
              { label: 'Note Moyenne', value: '4.9/5', icon: '⭐' },
              { label: 'Recommandations', value: '98%', icon: '👍' },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {stat.value}
                </div>
                <div className="text-slate-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
