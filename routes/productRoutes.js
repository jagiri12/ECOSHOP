const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const asyncHandler = require('express-async-handler');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const validateProduct = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('image').notEmpty().withMessage('Image is required'),
  body('brand').notEmpty().withMessage('Brand is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('countInStock').isNumeric().withMessage('Count in stock must be a number'),
];

const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required'),
];

router.route('/').get(asyncHandler(getProducts));
router.route('/').post(protect, admin, validateProduct, asyncHandler(createProduct));
router.route('/:id/reviews').post(protect, validateReview, asyncHandler(createProductReview));
router.route('/:id').get(asyncHandler(getProductById));
router.route('/:id').put(protect, admin, validateProduct, asyncHandler(updateProduct));
router.route('/:id').delete(protect, admin, asyncHandler(deleteProduct));

module.exports = router;
