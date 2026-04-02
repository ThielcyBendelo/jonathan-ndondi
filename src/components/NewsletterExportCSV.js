// Export CSV utilitaire pour les abonnés newsletter
export function exportSubscribersToCSV(subscribers) {
  if (!subscribers || subscribers.length === 0) return;
  const headers = ['Email', 'Date abonnement', 'Statut'];
  const rows = subscribers.map((sub) => [
    sub.email,
    sub.subscribedAt,
    sub.status,
  ]);
  let csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers, ...rows].map((e) => e.join(';')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'newsletter_abonnes.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
