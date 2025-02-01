const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token:', token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded Token:', decoded);
      req.user = await User.findById(decoded.id).select('-password');
      console.log('Authenticated User:', req.user);
      next();
    } catch (error) {
      console.error('Token Verification Error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    console.error('No token provided');
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    console.error('User is not an admin');
    res.status(401);
    throw new Error('Not authorized as admin');
  }
});

module.exports = { protect, admin };
