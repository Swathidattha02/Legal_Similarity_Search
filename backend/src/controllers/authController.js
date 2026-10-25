const jwt = require('jsonwebtoken');
const User = require('../models/User');

/** Generate a signed JWT for a given user ID */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ── POST /api/v1/auth/register ──────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, profession, organization } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    const user = await User.create({ name, email, password, profession, organization });
    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/auth/login ─────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    const token = signToken(user._id);
    res.json({ success: true, token, user: user.toJSON() });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/v1/auth/me ─────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    // req.user is already attached by the protect middleware
    res.json({ success: true, user: req.user });
  } catch (err) {
    next(err);
  }
};

// ── PUT /api/v1/auth/profile ────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'profession', 'organization'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateProfile };
