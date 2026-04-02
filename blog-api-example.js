// Express.js Blog API Example
// Pour démarrer : npm install express cors body-parser

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

let articles = [];
let comments = {};

// Get all articles (sorted by date desc)
app.get('/api/blog/articles', (req, res) => {
  res.json([...articles].sort((a, b) => b.id - a.id));
});

// Get single article
app.get('/api/blog/articles/:id', (req, res) => {
  const article = articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
});

// Create article
app.post('/api/blog/articles', (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({ error: 'Title and content required' });
  }
  const article = { ...req.body, id: Date.now().toString(), views: 0 };
  articles.unshift(article);
  res.json(article);
});

// Update article
app.put('/api/blog/articles/:id', (req, res) => {
  const idx = articles.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  articles[idx] = { ...articles[idx], ...req.body };
  res.json(articles[idx]);
});

// Delete article
app.delete('/api/blog/articles/:id', (req, res) => {
  articles = articles.filter(a => a.id !== req.params.id);
  delete comments[req.params.id];
  res.json({ success: true });
});

// Get comments for article
app.get('/api/blog/articles/:id/comments', (req, res) => {
  res.json(comments[req.params.id] || []);
});

// Add comment
app.post('/api/blog/articles/:id/comments', (req, res) => {
  if (!comments[req.params.id]) comments[req.params.id] = [];
  const comment = { ...req.body, id: Date.now().toString() };
  comments[req.params.id].unshift(comment);
  res.json(comment);
});

// Delete comment
app.delete('/api/blog/articles/:id/comments/:commentId', (req, res) => {
  if (!comments[req.params.id]) return res.json({ success: true });
  comments[req.params.id] = comments[req.params.id].filter(c => c.id !== req.params.commentId);
  res.json({ success: true });
});

// Increment views
app.post('/api/blog/articles/:id/views', (req, res) => {
  const article = articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  article.views = (article.views || 0) + 1;
  res.json({ views: article.views });
});

app.listen(PORT, () => {
  console.log(`Blog API running on http://localhost:${PORT}`);
});
