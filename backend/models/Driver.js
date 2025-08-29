//Driver.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Wallet schema for managing earnings
const walletSchema = new mongoose.Schema({
  balance: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalEarnings: {
    type: Number,
    required: true,
    default: 0.0,
  },
});

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  vehicleDetails: {
    type: String,
    default: ''
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false, // Admin can verify drivers later
  },
  onlineStatus: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  wallet: walletSchema,
}, {
  timestamps: true,
});

// Middleware to run before saving
driverSchema.pre('save', async function (next) {
  // Initialize wallet for new drivers
  if (this.isNew) {
    this.wallet = { balance: 0, totalEarnings: 0 };
  }

  // Hash password only if it has been modified
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

// Password compare method
driverSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;