const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
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

const {
  registerUser,
  loginUser,
  updateUserDetails,
  changePassword,
  uploadAvatar,
  getMe,
  verifyToken,
  deleteAccount // Added new controller function
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', protect, getMe);
router.get('/verify', protect, verifyToken);
router.put('/updatedetails', protect, updateUserDetails);
router.put('/changepassword', protect, changePassword);
router.put('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);
router.delete('/delete', protect, deleteAccount); // Added new DELETE route

module.exports = router;