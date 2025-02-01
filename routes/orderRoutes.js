const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const validateOrder = [
  body('orderItems').isArray({ min: 1 }).withMessage('At least one order item is required'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  body('itemsPrice').isNumeric().withMessage('Items price must be a number'),
  body('shippingPrice').isNumeric().withMessage('Shipping price must be a number'),
  body('totalPrice').isNumeric().withMessage('Total price must be a number'),
];

router.route('/').post(protect, validateOrder, asyncHandler(createOrder));
router.route('/myorders').get(protect, asyncHandler(getMyOrders));
router.route('/:id').get(protect, asyncHandler(getOrderById));
router.route('/:id/pay').put(protect, asyncHandler(updateOrderToPaid));

module.exports = router;
