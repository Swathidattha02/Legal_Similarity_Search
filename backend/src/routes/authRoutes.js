const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// POST /api/v1/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('profession').optional().isIn(['lawyer', 'law-student', 'researcher', 'judge', 'other']),
  ],
  validate,
  register
);

// POST /api/v1/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

// GET /api/v1/auth/me  (protected)
router.get('/me', protect, getMe);

// PUT /api/v1/auth/profile  (protected)
router.put(
  '/profile',
  protect,
  [
    body('name').optional().trim().notEmpty(),
    body('profession').optional().isIn(['lawyer', 'law-student', 'researcher', 'judge', 'other']),
    body('organization').optional().trim().isLength({ max: 200 }),
  ],
  validate,
  updateProfile
);

module.exports = router;
