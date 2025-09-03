// const Razorpay = require('razorpay'); 
//  const crypto = require('crypto'); 
//  const Ride = require('../models/Ride'); 

//  const razorpay = new Razorpay({ 
//   key_id: process.env.RAZORPAY_KEY_ID, 
//   key_secret: process.env.RAZORPAY_KEY_SECRET, 
//  }); 

//  // @desc    Create a Razorpay order before payment 
//  // @route   POST /api/payment/create-order 
//  // @access  Private (User) 
//  const createOrder = async (req, res) => { 
//   try { 
//     const { amount, currency = 'INR' } = req.body; 
//     const options = { 
//       amount: Math.round(amount * 100), // Convert to paise and ensure it's an integer 
//       currency, 
//       receipt: `receipt_${Date.now()}`, 
//     }; 
//     const order = await razorpay.orders.create(options); 
//     res.json({ orderId: order.id, amount: order.amount }); 
//   } catch (error) { 
//     console.error('Error creating order:', error); 
//     res.status(500).json({ error: 'Failed to create order' }); 
//   } 
//  }; 

//  // @desc    Verify payment and save the ride to DB 
//  // @route   POST /api/payment/verify-and-save-ride 
//  // @access  Private (User) 
//  const verifyPaymentAndSaveRide = async (req, res) => { 
//   const { 
//     razorpay_order_id, 
//     razorpay_payment_id, 
//     razorpay_signature, 
//     rideDetails, // All ride data sent from frontend 
//   } = req.body; 

//   // 1. Verify the payment signature 
//   const body = razorpay_order_id + "|" + razorpay_payment_id; 
//   const expectedSignature = crypto 
//     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET) 
//     .update(body.toString()) 
//     .digest('hex'); 
  
//   const isAuthentic = expectedSignature === razorpay_signature; 

//   if (isAuthentic) { 
//     // 2. If payment is authentic, save the ride to the database 
//     try { 
//       const ride = new Ride({ 
//         ...rideDetails, 
//         // --- THIS IS THE FIX ---
//         // Changed 'passenger' to 'userId' to match the RideSchema
//         userId: req.user.id, // from protect middleware 
//         status: 'pending', // Pending for a driver to accept 
//         paymentDetails: { 
//           orderId: razorpay_order_id, 
//           paymentId: razorpay_payment_id, 
//           status: 'completed', 
//         }, 
//       }); 
//       await ride.save(); 
//       res.status(201).json({  
//         message: 'Payment successful and ride booked!', 
//         ride  
//       }); 
//     } catch (dbError) { 
//       console.error('Error saving ride to DB:', dbError); 
//       // Optional: You might want to refund the payment here if DB write fails 
//       res.status(500).json({ error: 'Payment verified, but failed to save ride.' }); 
//     } 
//   } else { 
//     res.status(400).json({ error: 'Invalid payment signature. Payment failed.' }); 
//   } 
//  }; 

//  module.exports = { createOrder, verifyPaymentAndSaveRide };




















// controllers/paymentController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Ride = require('../models/Ride');
const axios = require('axios');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

/**
 * simulateDriver:
 *  - geocodes pickup & drop
 *  - makes random driver start ~1km from pickup
 *  - requests routes for arrival & main trip via OpenRouteService
 *  - emits 'driverLocationUpdate' every tick to room `ride-<rideId>`
 *  - updates Ride.driverLocation & tripPhase in DB
 */
const simulateDriver = async (ride, io) => {
    try {
        console.log(`[SIM START] ride ${ride._id}`);
        const apiKey = process.env.OPENROUTESERVICE_API_KEY;
        if (!apiKey) throw new Error("OPENROUTESERVICE_API_KEY not set.");

        const geocode = async (address) => {
            const res = await axios.get(`https://api.openrouteservice.org/geocode/search`, {
                params: { api_key: apiKey, text: address }
            });
            if (!res.data.features?.[0]) throw new Error('Geocode failed');
            return res.data.features[0].geometry.coordinates; // [lng, lat]
        };

        const getRoute = async (start, end) => {
            const res = await axios.post('https://api.openrouteservice.org/v2/directions/driving-car/geojson',
                { coordinates: [start, end] },
                { headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' } }
            );
            return res.data.features[0].geometry.coordinates; // [[lng,lat], ...]
        };

        const pickupCoord = await geocode(ride.pickups[0]);
        const dropCoord = await geocode(ride.drops[ride.drops.length - 1]);

        // create starting point ~1km away (approx)
        const offsetInDegrees = 0.0085; // ~0.9 - 1 km depending on latitude
        const driverStart = [
            pickupCoord[0] + (Math.random() - 0.5) * offsetInDegrees * 2,
            pickupCoord[1] + (Math.random() - 0.5) * offsetInDegrees * 2
        ];

        // arrival route: driverStart -> pickup
        const arrivalRoute = await getRoute(driverStart, pickupCoord);
        // main trip: pickup -> drop
        const mainTripRoute = await getRoute(pickupCoord, dropCoord);

        // create full route sequence (concatenate)
        const fullRoute = [...arrivalRoute, ...mainTripRoute];

        let idx = 0;
        const tickMs = 2000; // emits every 2s
        const roomName = `ride-${ride._id}`;

        // ensure room-based namespace usage: server should join this room when client emits 'joinRide'
        const interval = setInterval(async () => {
            if (idx >= fullRoute.length) {
                clearInterval(interval);
                const finalRide = await Ride.findByIdAndUpdate(ride._id, { status: 'completed' }, { new: true });
                io.to(roomName).emit('rideCompleted', { rideId: ride._id, ride: finalRide });
                console.log(`[SIM END] ride ${ride._1} completed`);
                return;
            }

            const point = fullRoute[idx]; // [lng, lat]
            const isArriving = idx < arrivalRoute.length;
            const phase = isArriving ? 'arriving' : 'enroute';

            // update DB with [lng, lat]
            const updated = await Ride.findByIdAndUpdate(ride._id, {
                driverLocation: { type: 'Point', coordinates: point },
                tripPhase: phase,
                status: 'ongoing'
            }, { new: true });

            // emit to clients: location as [lat, lng]
            io.to(roomName).emit('driverLocationUpdate', {
                rideId: ride._id,
                location: [point[1], point[0]],
                phase,
                ride: updated
            });

            idx++;
        }, tickMs);

    } catch (err) {
        console.error('simulateDriver error:', err.message || err);
    }
};

const verifyPaymentAndSaveRide = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, rideDetails } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    try {
      const ride = new Ride({
        ...rideDetails,
        userId: req.user.id,
        status: 'ongoing',
        tripPhase: 'arriving',
        paymentDetails: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          status: 'completed',
        },
      });
      await ride.save();

      // if you use socket.io, attach io to req in your server (req.io = io)
      if (req.io) simulateDriver(ride, req.io);

      res.status(201).json({ message: 'Payment successful and ride booked!', ride });
    } catch (dbError) {
      console.error('Error saving ride to DB:', dbError);
      res.status(500).json({ error: 'Payment verified, but failed to save ride.' });
    }
  } else {
    res.status(400).json({ error: 'Invalid payment signature. Payment failed.' });
  }
};

module.exports = { createOrder, verifyPaymentAndSaveRide, simulateDriver };
