// Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  driver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Driver', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['credit', 'debit'], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  // Link to the ride for which the earning was made
  ride: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ride' 
  },
  // Status is mainly for withdrawals (debit)
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed',
  },
  description: { 
    type: String, 
    required: true 
  },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;