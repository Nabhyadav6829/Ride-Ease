// // backend/server.js
// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const mongoose = require('mongoose');
// const path = require('path');

// // Import routes at the top for better organization
// const userRoutes = require('./routes/userRoutes');
// const rideRoutes = require('./routes/rideRoutes');
// const driverrideRoutes = require('./routes/driverrideRoutes');
// const driverRoutes = require('./routes/driverRoutes'); // Driver routes
// const FrontendUrl = process.env.FRONTEND_URL;
// // Initialize express app
// const app = express();

// // --- Middlewares ---
// // NOTE: It's best practice to declare core middlewares at the top.
// app.use(cors()); // Enable Cross-Origin Resource Sharing
// app.use(express.json()); // To parse JSON bodies (previously declared twice).

// // Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// // --- Database Connection ---
// const connectDB = async () => {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/ride-booking-app');
//     console.log('MongoDB Connected...');
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };

// connectDB();

// // --- API Routes ---
// app.get('/', (req, res) => {
//   res.send(`click here <a href="${FrontendUrl}">${FrontendUrl}</a>`);
// });

// // Use Routes
// app.use('/api/users', userRoutes);
// app.use('/api/rides', rideRoutes);
// app.use('/api/drivers', driverRoutes); // Driver routes
// app.use('/api/rides', driverrideRoutes);

// // --- Server Initialization ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 









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
const FrontendUrl = process.env.FRONTEND_URL;

// Initialize express app
const app = express();

// --- CORS Configuration ---
// A whitelist of allowed origins.
const allowedOrigins = [
  'https://ride-ease-six.vercel.app',
  'https://ride-ease-six.vercel.app/',
  'http://localhost:3000', // Example for local development
  'http://localhost:5173', // Example for local Vite development
];

const corsOptions = {
  origin: (origin, callback) => {
    // The 'origin' is the URL of the frontend making the request.
    // We allow the request if the origin is in our whitelist or if there's no origin (like for server-to-server requests or tools like Postman).
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Important for sending cookies or authorization headers.
  optionsSuccessStatus: 204, // Responds to preflight requests with a 204 No Content.
};

// --- Middlewares ---
// Apply the specific CORS configuration BEFORE your routes.
// This is the most crucial part.
app.use(cors(corsOptions));

app.use(express.json()); // To parse JSON bodies.

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// --- Database Connection ---
const connectDB = async () => {
  try {
    // Best practice to use an environment variable for your database connection string.
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ride-booking-app');
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// --- API Routes ---
app.get('/', (req, res) => {
  res.send(`API is running... Visit the frontend here: <a href="${FrontendUrl}">${FrontendUrl}</a>`);
});

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/rides', driverrideRoutes);

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));