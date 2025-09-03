














// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (user, req) => {
  const profileImageUrl =
    !user.profilePicture || user.profilePicture === 'no-photo.jpg'
      ? null
      : `${req.protocol}://${req.get('host')}/Uploads/${user.profilePicture}`;

  const payload = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImageUrl: profileImageUrl,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    
    const token = generateToken(user, req);

    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImageUrl: null
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide an email and password.' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user, req);
    const profileImageUrl = !user.profilePicture || user.profilePicture === 'no-photo.jpg'
      ? null
      : `${req.protocol}://${req.get('host')}/Uploads/${user.profilePicture}`;

    res.status(200).json({
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImageUrl: profileImageUrl,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file.' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.profilePicture = req.file.filename;
        const updatedUser = await user.save();

        const token = generateToken(updatedUser, req);
        const avatarUrl = `${req.protocol}://${req.get('host')}/Uploads/${updatedUser.profilePicture}`;

        res.status(200).json({
            message: 'Avatar updated successfully!',
            token: token,
            data: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                address: updatedUser.address,
                avatarUrl: avatarUrl,
                createdAt: updatedUser.createdAt
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateUserDetails = async (req, res) => {
   try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.address = req.body.address || user.address;
      const updatedUser = await user.save();

      const token = generateToken(updatedUser, req);

      res.status(200).json({
        message: "Profile updated successfully!",
        token: token,
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          address: updatedUser.address,
          profileImageUrl: !updatedUser.profilePicture || updatedUser.profilePicture === 'no-photo.jpg'
              ? null
              : `${req.protocol}://${req.get('host')}/Uploads/${updatedUser.profilePicture}`,
          createdAt: updatedUser.createdAt
        },
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide both old and new passwords.' });
    }
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect old password.' });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.status(200).json({ message: 'Password changed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      avatarUrl: user.profilePicture && user.profilePicture !== 'no-photo.jpg'
        ? `${req.protocol}://${req.get('host')}/Uploads/${user.profilePicture}`
        : null,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const verifyToken = (req, res) => {
    res.status(200).json({
      success: true,
      user: req.user,
    });
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.deleteOne({ _id: req.user.id });
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUserDetails,
  getMe,
  changePassword,
  uploadAvatar,
  verifyToken,
  deleteAccount
};