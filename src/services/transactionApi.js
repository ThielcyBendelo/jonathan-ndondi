// Service d'API pour les transactions et la comptabilité
const API_URL = '/api/transactions';

export async function fetchTransactions() {
  const response = await fetch(API_URL);
  if (!response.ok)
    throw new Error('Erreur lors du chargement des transactions');
  return response.json();
}

export async function addTransaction(transaction) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });
  if (!response.ok)
    throw new Error("Erreur lors de l'enregistrement de la transaction");
  return response.json();
}

export function calculateStats(transactions) {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const byProject = {};
  transactions.forEach((t) => {
    if (!byProject[t.project]) byProject[t.project] = 0;
    byProject[t.project] += t.amount;
  });
  return { total, byProject, count: transactions.length };
}
