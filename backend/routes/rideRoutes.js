const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createRide, getRides } = require('../controllers/rideController');

router.post('/', protect, createRide);
router.get('/', protect, getRides);

module.exports = router;