const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const Transaction = require('../models/Transaction');

const logCompletedMockRide = async (req, res) => {
  // *** FIX 1: Destructure rideType from the request body ***
  const { pickups, drops, fare, tip = 0, rideType } = req.body;

  // Validate driver authentication
  if (!req.driver || !req.driver._id) {
    return res.status(401).json({ message: 'Could not identify the authenticated driver.' });
  }

  // Convert to numbers first
  const fareNum = Number(fare);
  const tipNum = Number(tip);

  // Validate input data
  if (!pickups || !Array.isArray(pickups) || pickups.length === 0) {
    return res.status(400).json({ message: 'Pickups must be a non-empty array of objects.' });
  }
  if (!drops || !Array.isArray(drops) || drops.length === 0) {
    return res.status(400).json({ message: 'Drops must be a non-empty array of objects.' });
  }
  if (!fareNum || isNaN(fareNum) || fareNum <= 0) {
    return res.status(400).json({ message: 'Fare must be a valid positive number.' });
  }
  if (isNaN(tipNum) || tipNum < 0) {
    return res.status(400).json({ message: 'Tip must be a valid non-negative number.' });
  }
  // Optional: Add validation for rideType
  if (!rideType || !['single', 'multi'].includes(rideType)) {
      return res.status(400).json({ message: 'A valid rideType ("single" or "multi") is required.' });
  }


  try {
    // Validate pickups and drops structure
    for (const pickup of pickups) {
      if (!pickup.address || typeof pickup.address !== 'string') {
        return res.status(400).json({ message: 'Each pickup must have a valid address string.' });
      }
    }
    for (const drop of drops) {
      if (!drop.address || typeof drop.address !== 'string') {
        return res.status(400).json({ message: 'Each drop must have a valid address string.' });
      }
    }

    // *** FIX 2: Removed the incorrect re-calculation of rideType ***
    // const rideType = (pickups.length > 1 || drops.length > 1) ? "multi" : "single";

    // Create new Ride document
    const newRide = new Ride({
      driver: req.driver._id,
      passenger: null,
      pickups: pickups.map(p => ({ address: p.address })),
      drops: drops.map(d => ({ address: d.address })),
      fare: fareNum,
      tip: tipNum,
      status: 'completed',
      rideType, // Now using the rideType sent from the front end
      startTime: new Date(),
      endTime: new Date(),
    });

    // Save the ride document
    const ride = await newRide.save();

    // Calculate total earning and create a credit transaction
    const totalEarning = fareNum + tipNum;
    await Transaction.create({
      driver: req.driver._id,
      type: 'credit',
      amount: totalEarning,
      ride: ride._id,
      status: 'completed',
      description: `Earning from mock ride`,
    });

    // Update driver's wallet
    await Driver.findByIdAndUpdate(req.driver._id, {
      $inc: {
        'wallet.balance': totalEarning,
        'wallet.totalEarnings': totalEarning,
      },
    });

    res.status(201).json({ message: 'Mock ride logged successfully', earned: totalEarning, ride });

  } catch (error) {
    console.error('SERVER ERROR IN logCompletedMockRide:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
    });
    res.status(500).json({ message: 'Server Error while logging mock ride', error: error.message });
  }
};

// @desc    Complete a ride and process earnings
// @route   POST /api/rides/:id/complete
// @access  Private (Driver)
const completeRide = async (req, res) => {
  const { tip } = req.body;

  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.driver.toString() !== req.driver._id.toString()) {
      return res.status(401).json({ message: 'You are not authorized to complete this ride' });
    }

    if (ride.status === 'completed') {
      return res.status(400).json({ message: 'This ride has already been completed' });
    }

    const rideTip = Number(tip) || 0;
    if (isNaN(rideTip) || rideTip < 0) {
      return res.status(400).json({ message: 'Tip must be a valid non-negative number.' });
    }

    ride.status = 'completed';
    ride.endTime = new Date();
    ride.tip = rideTip;
    await ride.save();

    const totalEarning = Number(ride.fare) + rideTip;
    if (isNaN(totalEarning) || totalEarning <= 0) {
      return res.status(400).json({ message: 'Invalid fare or tip values for transaction.' });
    }

    await Transaction.create({
      driver: req.driver._id,
      type: 'credit',
      amount: totalEarning,
      ride: ride._id,
      status: 'completed',
      description: `Earning from ride`,
    });

    await Driver.findByIdAndUpdate(req.driver._id, {
      $inc: {
        'wallet.balance': totalEarning,
        'wallet.totalEarnings': totalEarning,
      },
    });

    res.json({ message: 'Ride completed successfully', earned: totalEarning });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error while completing ride' });
  }
};

const getDriverRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.driver._id }).sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error while fetching rides' });
  }
};

module.exports = {
  completeRide,
  logCompletedMockRide,
  getDriverRides,
};