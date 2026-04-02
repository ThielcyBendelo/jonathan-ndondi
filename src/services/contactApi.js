// Service d'API pour le formulaire de contact
const API_URL = '/api/contact';

export async function sendContact(form) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (!response.ok) throw new Error("Erreur lors de l'envoi du message");
  return response.json();
}
