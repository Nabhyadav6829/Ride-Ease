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

// Import routes
const userRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/rideRoutes');
const driverrideRoutes = require('./routes/driverrideRoutes');
const driverRoutes = require('./routes/driverRoutes'); 

const FrontendUrl = process.env.FRONTEND_URL;

// Initialize express app
const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  'https://ride-ease-six.vercel.app',
  'https://ride-ease.vercel.app', // backup if project renamed
  'http://localhost:3000',
  'http://localhost:5173'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// Apply CORS middleware at the very top
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight requests

// Middleware to parse JSON
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ride-booking-app');
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};
connectDB();

// --- API Routes ---
app.get('/', (req, res) => {
  res.send(`API is running... Visit the frontend here: <a href="${FrontendUrl}">${FrontendUrl}</a>`);
});

app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/rides', driverrideRoutes);

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
