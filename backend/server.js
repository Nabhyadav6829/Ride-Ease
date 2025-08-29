// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

// Import routes at the top for better organization
const userRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/rideRoutes');
const driverrideRoutes = require('./routes/driverrideRoutes');
const driverRoutes = require('./routes/driverRoutes'); // Driver routes

// Initialize express app
const app = express();

// --- Middlewares ---
// NOTE: It's best practice to declare core middlewares at the top.
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies (previously declared twice).

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
connectDB();

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('Ride-Booking API is running...');
});

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/drivers', driverRoutes); // Driver routes
app.use('/api/rides', driverrideRoutes);

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 