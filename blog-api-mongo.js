// Express.js Blog API with MongoDB (Mongoose)
// Pour démarrer : npm install express cors body-parser mongoose

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/blogdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  date: String,
  category: String,
  tags: [String],
  views: { type: Number, default: 0 },
});

const CommentSchema = new mongoose.Schema({
  articleId: mongoose.Schema.Types.ObjectId,
  text: String,
  date: String,
});

const Article = mongoose.model('Article', ArticleSchema);
const Comment = mongoose.model('Comment', CommentSchema);

// Get all articles
// Get all articles (sorted by _id desc = plus récent en premier)
app.get('/api/blog/articles', async (req, res) => {
  const articles = await Article.find().sort({ _id: -1 });
  res.json(articles);
});

// Get single article
app.get('/api/blog/articles/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
});

// Create article
app.post('/api/blog/articles', async (req, res) => {
  if (!req.body.title || !req.body.content) {
    return res.status(400).json({ error: 'Title and content required' });
  }
  const article = new Article({ ...req.body, date: new Date().toLocaleDateString() });
  await article.save();
  res.json(article);
});

// Update article
app.put('/api/blog/articles/:id', async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
});

// Delete article
app.delete('/api/blog/articles/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ articleId: mongoose.Types.ObjectId(req.params.id) });
  res.json({ success: true });
});

// Get comments for article
app.get('/api/blog/articles/:id/comments', async (req, res) => {
  const comments = await Comment.find({ articleId: req.params.id }).sort({ date: -1 });
  res.json(comments);
});

// Add comment
app.post('/api/blog/articles/:id/comments', async (req, res) => {
  const comment = new Comment({ articleId: req.params.id, ...req.body, date: new Date().toLocaleString() });
  await comment.save();
  res.json(comment);
});

// Delete comment
app.delete('/api/blog/articles/:id/comments/:commentId', async (req, res) => {
  await Comment.findByIdAndDelete(req.params.commentId);
  res.json({ success: true });
});

// Increment views
app.post('/api/blog/articles/:id/views', async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json({ views: article.views });
});

app.listen(PORT, () => {
  console.log(`Blog API (MongoDB) running on http://localhost:${PORT}`);
});
