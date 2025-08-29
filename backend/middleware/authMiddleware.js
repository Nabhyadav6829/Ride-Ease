


// Middleware for JWT authentication
const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Header se token check karein
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token ko header se nikalen (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Token ko verify karein
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User ki ID se user ka data database se nikalein (password chhod kar)
      // aur usse request object mein daal dein
      req.user = await User.findById(decoded.user.id).select('-password');
      
      // Agle function (controller) par jaane dein
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
};

const protectDriver = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if it is a driver token
      if (decoded.type !== 'driver') {
        return res.status(401).json({ message: 'Not authorized, invalid token type' });
      }

      // Get driver from the token and attach to the request object
      req.driver = await Driver.findById(decoded.id).select('-password');
      
      if (!req.driver) {
        return res.status(401).json({ message: 'Not authorized, driver not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect, protectDriver };