 // driverRideController.js
 const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const Transaction = require('../models/Transaction');

// @desc    Complete a ride and process earnings
// @route   POST /api/rides/:id/complete
// @access  Private (Driver)
const completeRide = async (req, res) => {
  const { tip } = req.body; // You can send an optional tip from the frontend
  
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Ensure the logged-in driver is the one assigned to this ride
    if (ride.driver.toString() !== req.driver._id.toString()) {
      return res.status(401).json({ message: 'You are not authorized to complete this ride' });
    }
    
    if (ride.status === 'completed') {
        return res.status(400).json({ message: 'This ride has already been completed' });
    }

    // 1. Update ride status
    const rideTip = parseFloat(tip) || 0;
    ride.status = 'completed';
    ride.endTime = new Date();
    ride.tip = rideTip;
    await ride.save();

    // 2. Calculate total earning and create a credit transaction
    const totalEarning = ride.fare + rideTip;
    await Transaction.create({
      driver: req.driver._id,
      type: 'credit',
      amount: totalEarning,
      ride: ride._id,
      status: 'completed',
      description: `Earning from ride`,
    });

    // 3. Add earning to driver's wallet
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

module.exports = {
  completeRide,
};