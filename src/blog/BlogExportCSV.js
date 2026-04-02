// Export CSV utilitaire pour le blog
export function exportBlogPostsToCSV(posts) {
  if (!posts || posts.length === 0) return;
  const headers = ['Titre', 'Auteur', 'Catégorie', 'Date', 'Vues', 'Tags'];
  const rows = posts.map((post) => [
    post.title,
    post.author,
    post.category,
    post.date,
    post.views,
    post.tags ? post.tags.join(', ') : '',
  ]);
  let csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers, ...rows].map((e) => e.join(';')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'blog_articles.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
