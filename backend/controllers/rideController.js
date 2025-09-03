


// controllers/rideController.js
const Ride = require('../models/Ride');

// This function is now DEPRECATED because rides are created after payment verification.
const createRide = async (req, res) => {
  try {
    res.status(400).json({ message: 'This endpoint is deprecated. Use payment flow to create a ride.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Gets all rides for the logged-in user
const getRides = async (req, res) => {
  try {
    const rides = await Ride.find({ userId: req.user.id }).sort({ bookedAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// NEW FUNCTION: Gets a single ride by its ID
const getRideById = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Ensure the user requesting the ride is the one who booked it
        if (ride.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to view this ride' });
        }

        res.json(ride);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Ride not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { createRide, getRides, getRideById };