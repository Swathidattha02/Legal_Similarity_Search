const Research = require('../models/Research');

// GET /api/v1/history
const getHistory = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, parseInt(req.query.limit || '20', 10));

    const [sessions, total] = await Promise.all([
      Research.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('title queryType status createdAt processingTimeMs')
        .populate('document', 'originalName'),
      Research.countDocuments({ user: req.user._id }),
    ]);

    res.json({ success: true, total, page, limit, history: sessions });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/v1/history
const clearHistory = async (req, res, next) => {
  try {
    const result = await Research.deleteMany({ user: req.user._id });
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} research session(s)`,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getHistory, clearHistory };
