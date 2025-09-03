// routes/rideRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
// Updated to import the new getRideById function
const { createRide, getRides, getRideById } = require('../controllers/rideController');

// This route is deprecated
router.post('/', protect, createRide);

// This route gets ride history for the logged-in user
router.get('/', protect, getRides);

// NEW ROUTE: Gets a single ride by its ID for the tracking page
router.get('/:id', protect, getRideById);

module.exports = router;