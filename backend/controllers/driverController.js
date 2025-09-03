const Driver = require('../models/Driver');
const Transaction = require('../models/Transaction');
const Ride = require('../models/Ride');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT for Driver
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new driver
// @route   POST /api/drivers/register
// @access  Public
const registerDriver = async (req, res) => {
  const { name, email, password, licenseNumber } = req.body;

  try {
    if (!name || !email || !password || !licenseNumber) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const driverExists = await Driver.findOne({ $or: [{ email }, { licenseNumber }] });
    if (driverExists) {
      return res.status(400).json({ message: 'Driver with this email or license already exists.' });
    }

    const driver = await Driver.create({
      name,
      email,
      password,
      licenseNumber,
    });

    if (driver) {
      res.status(201).json({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        token: generateToken(driver._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid driver data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate driver & get token
// @route   POST /api/drivers/login
// @access  Public
const loginDriver = async (req, res) => {
  const { email, password } = req.body;
  try {
    const driver = await Driver.findOne({ email });
    if (driver && (await driver.matchPassword(password))) {
      res.json({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        token: generateToken(driver._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get driver profile
// @route   GET /api/drivers/profile
// @access  Private (Driver)
const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.driver._id).select('-password');
    if (driver) {
      res.json(driver);
    } else {
      res.status(404).json({ message: 'Driver not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update driver profile
// @route   PUT /api/drivers/profile
// @access  Private (Driver)
const updateDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.driver._id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const { name, phone, address, vehicleDetails } = req.body;

    // Update only allowed fields
    if (name) driver.name = name;
    if (phone) driver.phone = phone;
    if (address) driver.address = address;
    if (vehicleDetails) driver.vehicleDetails = vehicleDetails;

    await driver.save();

    res.json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      address: driver.address,
      vehicleDetails: driver.vehicleDetails,
      licenseNumber: driver.licenseNumber,
      isVerified: driver.isVerified,
      profilePicture: driver.profilePicture,
      createdAt: driver.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Change driver password
// @route   PUT /api/drivers/change-password
// @access  Private (Driver)
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide old and new passwords.' });
    }

    const driver = await Driver.findById(req.driver._id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Verify old password
    const isMatch = await driver.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // Validate new password (minimum 6 characters, as per frontend)
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
    }

    // Update password
    driver.password = newPassword; // The pre-save middleware will hash it
    await driver.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get driver ride history
// @route   GET /api/drivers/rides
// @access  Private (Driver)
const getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.driver._id }).sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error while fetching ride history' });
  }
};

// @desc    Request a withdrawal
// @route   POST /api/drivers/withdraw
// @access  Private (Driver)
const requestWithdrawal = async (req, res) => {
  const { amount } = req.body;
  const withdrawalAmount = parseFloat(amount);

  if (!withdrawalAmount || withdrawalAmount <= 0) {
    return res.status(400).json({ message: 'Invalid withdrawal amount' });
  }

  try {
    const driver = await Driver.findById(req.driver._id);
    if (driver.wallet.balance < withdrawalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Create a debit transaction
    await Transaction.create({
      driver: req.driver._id,
      type: 'debit',
      amount: withdrawalAmount,
      status: 'pending', // Admin needs to approve this
      description: 'Withdrawal request',
    });

    // Update wallet balance
    driver.wallet.balance -= withdrawalAmount;
    await driver.save();

    res.json({ message: 'Withdrawal request submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error while processing withdrawal' });
  }
};

// @desc    Upload driver avatar
// @route   PUT /api/drivers/upload-avatar
// @access  Private (Driver)
const uploadDriverAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file.' });
    }
    const driver = await Driver.findById(req.driver._id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    driver.profilePicture = req.file.filename;
    await driver.save();
    res.json({
      message: 'Avatar updated successfully',
      profilePicture: driver.profilePicture,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get transaction history for a driver
// @route   GET /api/drivers/transactions
// @access  Private (Driver)
const getTransactionsHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({ driver: req.driver._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error while fetching transactions' });
  }
};

module.exports = {
  registerDriver,
  loginDriver,
  getDriverProfile,
  updateDriverProfile,
  changePassword,
  getRideHistory,
  requestWithdrawal,
  uploadDriverAvatar,
  getTransactionsHistory,
};