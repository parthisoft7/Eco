import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Allow requests from frontend
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST']
}));

app.use(express.json());

// Razorpay Instance
// Note: Vercel Environment Variables are recommended for keys in production
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_S1PWro2UcHnr2w',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'uvIr45WZeumzCmzZh7aV9rHX',
});

/**
 * Endpoint to create a secure Razorpay order.
 */
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency || 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-8)}`,
      payment_capture: 1 
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({ error: 'Could not create payment order' });
  }
});

/**
 * Endpoint to verify the payment signature.
 */
app.post('/api/razorpay/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ status: 'failure', message: 'Missing required parameters' });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'uvIr45WZeumzCmzZh7aV9rHX';
    
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      res.json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      console.warn("Signature Mismatch:", { generated: generated_signature, received: razorpay_signature });
      res.status(400).json({ status: 'failure', message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Export the app for Vercel Serverless
export default app;