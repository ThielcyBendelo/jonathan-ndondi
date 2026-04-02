// Service d'API pour la demande de devis
const API_URL = '/api/quotes';

export async function requestQuote(form) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (!response.ok) throw new Error('Erreur lors de la demande de devis');
  return response.json();
}
