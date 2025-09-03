const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const {
  registerDriver,
  loginDriver,
  getDriverProfile,
  updateDriverProfile,
  changePassword,
  getRideHistory,
  requestWithdrawal,
  uploadDriverAvatar,
  getTransactionsHistory,
} = require('../controllers/driverController'); // Handles profile, auth, etc.

const { logCompletedMockRide } = require('../controllers/driverRideController'); // Handles ride-specific actions
const { protectDriver } = require('../middleware/authMiddleware');

// Multer configuration for driver avatar upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `driver-avatar-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// --- Public routes for authentication ---
router.post('/register', registerDriver);
router.post('/login', loginDriver);

// --- Protected routes (require a valid driver token) ---
router.get('/profile', protectDriver, getDriverProfile);
router.put('/profile', protectDriver, updateDriverProfile);
router.put('/change-password', protectDriver, changePassword);
router.get('/rides', protectDriver, getRideHistory); // Gets ride history
router.get('/transactions', protectDriver, getTransactionsHistory);
router.post('/withdraw', protectDriver, requestWithdrawal);
router.put('/upload-avatar', protectDriver, upload.single('avatar'), uploadDriverAvatar);

// --- Route for Ride-Specific Actions ---
router.post('/rides/log-mock-ride', protectDriver, logCompletedMockRide);

module.exports = router;