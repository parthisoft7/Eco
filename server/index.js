
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_...',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '...',
});

// Create Razorpay Order
app.post('/api/razorpay/create-order', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: currency || 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Razorpay Payment
app.post('/api/razorpay/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest('hex');

  if (digest === razorpay_signature) {
    res.json({ status: 'ok' });
  } else {
    res.status(400).json({ status: 'failed' });
  }
});

// Order Status Update
app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  // Here you would normally update Firestore
  // await admin.firestore().collection('orders').doc(id).update({ orderStatus: status });
  
  res.json({ message: 'Status updated successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
