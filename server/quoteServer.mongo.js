// Exemple serveur Node.js/Express + MongoDB pour devis
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = 'monsite';
const COLLECTION = 'quotes';

app.use(express.json());

let db;
MongoClient.connect(MONGO_URL, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(DB_NAME);
    app.listen(PORT, () => {
      console.log(`Quote server (MongoDB) running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/quotes', async (req, res) => {
  try {
    const result = await db.collection(COLLECTION).insertOne({ ...req.body, date: new Date() });
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

app.get('/api/quotes', async (req, res) => {
  try {
    const quotes = await db.collection(COLLECTION).find().sort({ date: -1 }).toArray();
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});
