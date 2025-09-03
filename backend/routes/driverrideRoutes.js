// routes/driverrideRoutes.js
const express = require('express');
const router = express.Router();
const { protectDriver } = require('../middleware/authMiddleware'); // Ensure this exists
const { getDriverRides, completeRide, logCompletedMockRide } = require('../controllers/driverRideController');

router.route('/').get(protectDriver, getDriverRides);
router.route('/log-mock-ride').post(protectDriver, logCompletedMockRide);
router.route('/:id/complete').post(protectDriver, completeRide);

module.exports = router;