// controllers/driverControllers.js
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

// Token generate karne ka function
const generateToken = (id) => {
  return jwt.sign({ id, type: 'driver' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Driver ko register karein
// @route   POST /api/drivers/register
// @access  Public
const registerDriver = async (req, res) => {
  const { name, email, password, licenseNumber, vehicleDetails } = req.body;
  try {
    const driverExists = await Driver.findOne({ email });
    if (driverExists) {
      return res.status(400).json({ message: 'Driver already exists' });
    }
    const driver = await Driver.create({
      name,
      email,
      password,
      licenseNumber,
      vehicleDetails,
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
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Driver ko login karein
// @route   POST /api/drivers/login
// @access  Public
const loginDriver = async (req, res) => {
  const { email, password } = req.body;
  try {
    const driver = await Driver.findOne({ email });
    if (driver && (await driver.matchPassword(password))) {
      res.json({
        message: 'Login successful',
        driver: {
          _id: driver._id,
          name: driver.name,
          email: driver.email,
        },
        token: generateToken(driver._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get driver profile and earnings
// @route   GET /api/drivers/profile
// @access  Private
const getDriverProfile = async (req, res) => {
  // req.driver is attached by the protectDriver middleware
  try {
    const driver = await Driver.findById(req.driver._id);
    if (driver) {
      res.json({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        vehicleDetails: driver.vehicleDetails,
        onlineStatus: driver.onlineStatus,
        wallet: driver.wallet,
      });
    } else {
      res.status(404).json({ message: 'Driver not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get driver's ride history
// @route   GET /api/drivers/rides
// @access  Private
const getRideHistory = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.driver._id, status: 'completed' })
      .sort({ createdAt: -1 }) // Show most recent rides first
      .limit(20); 
    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Request a withdrawal from wallet
// @route   POST /api/drivers/withdraw
// @access  Private
const requestWithdrawal = async (req, res) => {
  const { amount } = req.body;
  const parsedAmount = parseFloat(amount);

  if (!parsedAmount || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Invalid withdrawal amount' });
  }

  try {
    const driver = await Driver.findById(req.driver._id);

    if (driver.wallet.balance < parsedAmount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // 1. Create a debit transaction record
    await Transaction.create({
      driver: driver._id,
      type: 'debit',
      amount: parsedAmount,
      status: 'pending', // An admin can approve this later
      description: `Withdrawal request of ₹${parsedAmount}`,
    });

    // 2. Decrease the driver's wallet balance
    driver.wallet.balance -= parsedAmount;
    await driver.save();
    
    res.status(201).json({ 
        message: 'Withdrawal request submitted successfully', 
        newBalance: driver.wallet.balance 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error while processing withdrawal' });
  }
};


module.exports = { 
    registerDriver, 
    loginDriver,
    getDriverProfile,
    getRideHistory,
    requestWithdrawal
};