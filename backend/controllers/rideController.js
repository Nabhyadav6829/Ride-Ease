const Ride = require('../models/Ride');

const createRide = async (req, res) => {
  try {
    const ride = new Ride({
      userId: req.user.id,
      ...req.body,
    });
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getRides = async (req, res) => {
  try {
    const rides = await Ride.find({ userId: req.user.id }).sort({ bookedAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createRide, getRides };