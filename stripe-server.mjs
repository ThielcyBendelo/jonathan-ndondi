// Backend Express pour Stripe Checkout
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Stripe from 'stripe';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Remplace par ta clé secrète Stripe (test)
const stripe = new Stripe('sk_test_YOUR_STRIPE_SECRET_KEY');

// Route pour créer une session Stripe Checkout
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amount, currency, description } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency || 'usd',
            product_data: {
              name: description || 'Paiement',
            },
            unit_amount: amount ? Math.round(Number(amount) * 100) : 1000, // Stripe attend les montants en cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur backend Stripe lancé sur http://localhost:${PORT}`);
});
