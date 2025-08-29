const express = require('express');
const router = express.Router();
const {
  registerDriver,
  loginDriver,
  getDriverProfile,
  getRideHistory,
  requestWithdrawal,
} = require('../controllers/driverController');
const { protectDriver } = require('../middleware/authMiddleware');

// Public routes for authentication
router.post('/register', registerDriver);
router.post('/login', loginDriver);

// Protected routes - only a logged-in driver can access these
router.get('/profile', protectDriver, getDriverProfile);
router.get('/rides', protectDriver, getRideHistory);
router.post('/withdraw', protectDriver, requestWithdrawal);

module.exports = router;