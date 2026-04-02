// Service d'API pour les témoignages clients

// Utilisation de localStorage pour mocker les témoignages
const STORAGE_KEY = 'mock_testimonials';

function getAllTestimonials() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveAllTestimonials(testimonials) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(testimonials));
}

export async function fetchTestimonials() {
  return getAllTestimonials();
}

export async function addTestimonial(testimonial) {
  const testimonials = getAllTestimonials();
  const newTestimonial = {
    ...testimonial,
    id: Date.now(),
  };
  testimonials.push(newTestimonial);
  saveAllTestimonials(testimonials);
  return newTestimonial;
}

export async function deleteTestimonial(id) {
  let testimonials = getAllTestimonials();
  testimonials = testimonials.filter((t) => t.id !== id);
  saveAllTestimonials(testimonials);
  return { success: true };
}

export async function updateTestimonial(id, testimonial) {
  let testimonials = getAllTestimonials();
  testimonials = testimonials.map((t) =>
    t.id === id ? { ...t, ...testimonial } : t
  );
  saveAllTestimonials(testimonials);
  return testimonials.find((t) => t.id === id);
}
