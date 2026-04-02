// Exemple de serveur Node.js/Express pour recevoir et stocker les demandes de devis
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Stockage local des devis (JSON)
const QUOTES_FILE = path.join(__dirname, 'quotes.json');
function saveQuote(quote) {
  let quotes = [];
  if (fs.existsSync(QUOTES_FILE)) {
    quotes = JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf-8'));
  }
  quotes.push({ ...quote, id: Date.now() });
  fs.writeFileSync(QUOTES_FILE, JSON.stringify(quotes, null, 2));
}

app.post('/api/quotes', (req, res) => {
  try {
    saveQuote(req.body);
    res.status(201).json({ success: true, message: 'Demande enregistrée.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

app.get('/api/quotes', (req, res) => {
  if (fs.existsSync(QUOTES_FILE)) {
    const quotes = JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf-8'));
    res.json(quotes);
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Quote server running on http://localhost:${PORT}`);
});
