// Service d'API pour le paiement
const API_URL = 'http://localhost:5000/api/payments'; 

export async function processPayment(data) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erreur lors du paiement');
  return response.json();
}

// Service d'API pour Stripe
const STRIPE_URL = 'http://localhost:5000/api/create-checkout-session';

export async function processStripePayment(data) {
  const response = await fetch(STRIPE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erreur Stripe');
  return response.json();
}
