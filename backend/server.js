// // backend/server.js
// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const mongoose = require('mongoose');
// const path = require('path');

// // Import routes
// const userRoutes = require('./routes/userRoutes');
// const rideRoutes = require('./routes/rideRoutes');
// // const driverrideRoutes = require('./routes/driverrideRoutes'); // REMOVED: This is redundant
// const driverRoutes = require('./routes/driverRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const couponRoutes = require("./routes/couponRoutes");

// const FrontendUrl = process.env.FRONTEND_URL;

// // Initialize express app
// const app = express();

// // --- CORS Configuration ---
// const allowedOrigins = [
//   'https://ride-ease-six.vercel.app',
//   'https://ride-ease-six.vercel.app/',
//   'http://localhost:3000',
//   'http://localhost:5173',
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionsSuccessStatus: 204,
// };

// // --- Middlewares ---
// app.use(cors(corsOptions));
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// // --- Database Connection ---
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ride-booking-app');
//     console.log('MongoDB Connected...');
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };

// connectDB();

// // --- API Routes ---
// app.get('/', (req, res) => {
//   res.send(`API is running... Visit the frontend here: <a href="${FrontendUrl}">${FrontendUrl}</a>`);
// });

// // Use Routes
// app.use('/api/users', userRoutes);
// app.use('/api/rides', rideRoutes);
// app.use('/api/drivers', driverRoutes); // This now handles all driver routes, including /api/drivers/rides/*
// // app.use('/api/drivers/rides', driverrideRoutes); // REMOVED: This conflicts with the above line
// app.use('/api/payment', paymentRoutes);
// app.use("/api/coupons", couponRoutes);

// // --- Server Initialization ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));







const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer'); // Added multer for file uploads
const fs = require('fs'); // Added for directory creation

const userRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/rideRoutes');
const driverRoutes = require('./routes/driverRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const couponRoutes = require('./routes/couponRoutes');

const FrontendUrl = process.env.FRONTEND_URL;

const app = express();
const server = http.createServer(app);

// Configure Multer for file uploads
const uploadDir = path.join(__dirname, 'Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create Uploads directory if it doesn't exist
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalName).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png) are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Make multer available to routes
app.use((req, res, next) => {
  req.upload = upload; // Attach upload to req for use in routes
  next();
});

const allowedOrigins = [
  'https://ride-ease-six.vercel.app',
  'https://ride-ease-six.vercel.app/',
  'http://localhost:3000',
  'http://localhost:5173',
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

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors(corsOptions));
app.use(express.json());
app.use('/Uploads', express.static(uploadDir));

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (rideId) => {
    console.log(`Socket ${socket.id} is joining room: ride-${rideId}`);
    socket.join(`ride-${rideId}`);
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', socket.id, error.message);
  });
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ride-booking-app');
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

app.get('/', (req, res) => {
  res.send(`API is running... Visit the frontend here: <a href="${FrontendUrl}">${FrontendUrl}</a>`);
});

app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/coupons', couponRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));