// Export CSV utilitaire pour les commentaires d’un article
export function exportCommentsToCSV(comments, articleTitle = '') {
  if (!comments || comments.length === 0) return;
  const headers = ['Article', 'Texte', 'Date'];
  const rows = comments.map(c => [
    articleTitle,
    c.text,
    c.date
  ]);
  let csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(e => e.join(';')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `commentaires_${articleTitle || 'article'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
