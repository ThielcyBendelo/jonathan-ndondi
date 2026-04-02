// Blog API service for Node/Express or Firebase REST
// Change BASE_URL to your backend API endpoint

const BASE_URL = 'https://your-api-url.com/api/blog';

export const blogService = {
  // Get all articles
  async getArticles() {
    const res = await fetch(`${BASE_URL}/articles`);
    if (!res.ok) throw new Error('Erreur chargement articles');
    return res.json();
  },

  // Get single article
  async getArticle(id) {
    const res = await fetch(`${BASE_URL}/articles/${id}`);
    if (!res.ok) throw new Error('Erreur chargement article');
    return res.json();
  },

  // Create new article
  async createArticle(data) {
    const res = await fetch(`${BASE_URL}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur création article');
    return res.json();
  },

  // Update article
  async updateArticle(id, data) {
    const res = await fetch(`${BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur modification article');
    return res.json();
  },

  // Delete article
  async deleteArticle(id) {
    const res = await fetch(`${BASE_URL}/articles/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur suppression article');
    return res.json();
  },

  // Get comments for an article
  async getComments(articleId) {
    const res = await fetch(`${BASE_URL}/articles/${articleId}/comments`);
    if (!res.ok) throw new Error('Erreur chargement commentaires');
    return res.json();
  },

  // Add comment to an article
  async addComment(articleId, data) {
    const res = await fetch(`${BASE_URL}/articles/${articleId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur ajout commentaire');
    return res.json();
  },

  // Delete comment
  async deleteComment(articleId, commentId) {
    const res = await fetch(`${BASE_URL}/articles/${articleId}/comments/${commentId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur suppression commentaire');
    return res.json();
  },

  // Increment view count
  async incrementViews(articleId) {
    const res = await fetch(`${BASE_URL}/articles/${articleId}/views`, {
      method: 'POST' });
    if (!res.ok) throw new Error('Erreur incrément vue');
    return res.json();
  },
};
