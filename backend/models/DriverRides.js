//DriverRides.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  // You can add coordinates later for mapping
  // coordinates: { type: { type: String, enum: ['Point'] }, coordinates: [Number] }
});

const rideSchema = new mongoose.Schema({
  driver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Driver', 
    required: true 
  },
  // You should have a User model for passengers
  passenger: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  pickups: [locationSchema],
  drops: [locationSchema],
  rideType: { 
    type: String, 
    enum: ['single', 'multi'], 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
    default: 'pending',
  },
  fare: { 
    type: Number, 
    required: true 
  },
  tip: { 
    type: Number, 
    default: 0 
  },
  distance: { type: Number }, // in kilometers
  duration: { type: Number }, // in minutes
  startTime: { type: Date },
  endTime: { type: Date },
}, { timestamps: true });

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;