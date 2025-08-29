const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  selectedVehicle: Object,
  pickups: Array,
  drops: Array,
  driver: Object,
  arrivalTime: Number,
  destinationTime: Number,
  status: String,
  bookedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Ride', RideSchema);