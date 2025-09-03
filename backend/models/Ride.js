// const mongoose = require('mongoose');

// const RideSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   selectedVehicle: Object,
//   pickups: Array,
//   drops: Array,
//   driver: Object,
//   arrivalTime: Number,
//   destinationTime: Number,
//   status: String,
//   bookedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Ride', RideSchema);













const mongoose = require('mongoose');
const RideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  selectedVehicle: Object,
  pickups: Array,
  drops: Array,
  driver: Object,
  arrivalTime: Number,
  destinationTime: Number,
  fare: { type: Number, required: true },   // 👈 add this
  tip: { type: Number, default: 0 },        // 👈 optional, add this
  status: {
    type: String,
    enum: ['pending', 'ongoing', 'completed', 'cancelled'],
    default: 'pending',
  },
  bookedAt: { type: Date, default: Date.now },
  driverLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
  paymentDetails: Object,
  tripPhase: {
    type: String,
    enum: ['arriving', 'enroute'],
    default: 'arriving',
  },
  rideType: {
    type: String,
    enum: ['single', 'multi'],
    default: 'single'
  },
});


RideSchema.index({ driverLocation: '2dsphere' });

module.exports = mongoose.model('Ride', RideSchema);