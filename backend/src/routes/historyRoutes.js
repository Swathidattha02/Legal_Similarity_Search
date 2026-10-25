const express = require('express');
const { protect } = require('../middleware/auth');
const { getHistory, clearHistory } = require('../controllers/historyController');

const router = express.Router();
router.use(protect);

// GET /api/v1/history
router.get('/', getHistory);

// DELETE /api/v1/history  — clear all history for current user
router.delete('/', clearHistory);

module.exports = router;
