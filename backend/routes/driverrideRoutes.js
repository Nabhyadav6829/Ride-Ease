const express = require('express');
const router = express.Router();
const { completeRide } = require('../controllers/driverRideController');
const { protectDriver } = require('../middleware/authMiddleware');

// Route to complete a ride. It's protected to ensure only the
// assigned driver can mark it as complete.
// The ':id' is the ID of the ride to be completed.
router.post('/:id/complete', protectDriver, completeRide);

module.exports = router;