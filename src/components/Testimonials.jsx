import React, { useState } from 'react';
import dataService from '../services/dataService';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion as Motion, AnimatePresence } from 'framer-motion';
// Remplacer StarRating, itemVariants par vos propres composants ou valeurs si besoin
// import StarRating from './StarRating';
const itemVariants = {};

const initialTestimonials = [
  {
    name: 'Alice',
    role: 'Client',
    company: 'Entreprise X',
    project: 'Site Web',
    date: '2025',
    rating: 5,
    text: 'Super service, je recommande !',
  },
  // Ajoutez d'autres témoignages ici
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    project: '',
    text: '',
    rating: 5,
  });

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };
  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTestimonial = dataService.addTestimonial(form);
    setTestimonials((prev) => [...prev, newTestimonial]);
    setCurrentIndex(testimonials.length);
    setShowModal(false);
    setForm({ name: '', project: '', text: '', rating: 5 });
  };

  // Ajout de l'id testimonials pour le scroll
  return (
    <div
      id="testimonials"
      className="py-20 bg-gradient-to-br from-dark-200 via-dark-100 to-dark-200"
      style={{ zIndex: 1000 }}
    >
      <div className="container mx-auto px-6">
        {/* ...existing code... */}
        <div>
          {/* Bouton pour ouvrir le modal d'avis */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleOpenModal}
              className="px-6 py-3 bg-purple text-white font-bold rounded shadow-lg hover:bg-purple/80 transition-all duration-300"
            >
              Laisser ton avis
            </button>
          </div>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-dark-300 rounded-2xl p-8 w-full max-w-md mx-auto relative">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
                  aria-label="Fermer"
                >
                  ×
                </button>
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  Laisse ton témoignage
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className="w-full px-4 py-2 border rounded bg-dark-200 text-white"
                    required
                  />
                  <input
                    type="text"
                    name="project"
                    value={form.project}
                    onChange={handleChange}
                    placeholder="Nom du projet ou type de projet"
                    className="w-full px-4 py-2 border rounded bg-dark-200 text-white"
                    required
                  />
                  <textarea
                    name="text"
                    value={form.text}
                    onChange={handleChange}
                    placeholder="Votre témoignage"
                    className="w-full px-4 py-2 border rounded bg-dark-200 text-white"
                    rows={4}
                    required
                  />
                  <div>
                    <label
                      htmlFor="rating"
                      className="block text-gray-400 mb-1"
                    >
                      Note :
                    </label>
                    <select
                      name="rating"
                      id="rating"
                      value={form.rating}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded bg-dark-200 text-white"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} ★
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-purple text-white font-bold rounded"
                  >
                    Envoyer
                  </button>
                </form>
              </div>
            </div>
          )}
          <AnimatePresence>
            <Motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <FaQuoteLeft className="text-purple/30 text-4xl mb-6" />
              <div className="mb-6">{testimonials[currentIndex]?.rating} ★</div>
              <blockquote className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 italic">
                "{testimonials[currentIndex]?.text || ''}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple to-pink p-0.5">
                  <div className="w-full h-full rounded-full bg-dark-300 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonials[currentIndex]?.name?.charAt(0) || ''}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">
                    {testimonials[currentIndex]?.name || ''}
                  </h4>
                  <p className="text-gray-400">
                    {testimonials[currentIndex]?.role || ''} •{' '}
                    {testimonials[currentIndex]?.company || ''}
                  </p>
                  <p className="text-purple text-sm">
                    {testimonials[currentIndex]?.project || ''} •{' '}
                    {testimonials[currentIndex]?.date || ''}
                  </p>
                </div>
              </div>
            </Motion.div>
          </AnimatePresence>
          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-dark-400/80 backdrop-blur-sm hover:bg-purple/80 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-600/50 hover:border-purple"
            aria-label="Témoignage précédent"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-dark-400/80 backdrop-blur-sm hover:bg-purple/80 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-600/50 hover:border-purple"
            aria-label="Témoignage suivant"
          >
            <FaChevronRight />
          </button>
          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gradient-to-r from-purple to-pink scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <Motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          variants={itemVariants}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-gray-400">Projets réalisés</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-gray-400">Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">5★</div>
            <div className="text-gray-400">Note moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">2025</div>
            <div className="text-gray-400">Année</div>
          </div>
        </Motion.div>
      </div>
    </div>
  );
}
