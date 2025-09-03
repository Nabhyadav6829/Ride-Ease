// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, verifyPaymentAndSaveRide } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Route to create a payment order
router.post('/create-order', protect, createOrder);

// Route to verify the payment and create the ride
router.post('/verify-and-save-ride', protect, verifyPaymentAndSaveRide);

module.exports = router;