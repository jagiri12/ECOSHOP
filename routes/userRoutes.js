const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

const validateLogin = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/login', validateLogin, asyncHandler(authUser));

router.post('/user', registerUser);

router.route('/profile').get(protect, asyncHandler(getUserProfile));

router.route('/profile').put(protect, validateUser, asyncHandler(updateUserProfile));

module.exports = router;
