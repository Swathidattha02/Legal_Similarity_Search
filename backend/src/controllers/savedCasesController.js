const SavedCase = require('../models/SavedCase');

// GET /api/v1/saved-cases
const getSavedCases = async (req, res, next) => {
  try {
    const cases = await SavedCase.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: cases.length, cases });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/saved-cases
const saveCase = async (req, res, next) => {
  try {
    const data = { ...req.body, user: req.user._id };
    const saved = await SavedCase.create(data);
    res.status(201).json({ success: true, case: saved });
  } catch (err) {
    // Duplicate key — user already saved this case
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Case already saved' });
    }
    next(err);
  }
};

// DELETE /api/v1/saved-cases/:id
const removeSavedCase = async (req, res, next) => {
  try {
    const deleted = await SavedCase.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Saved case not found' });
    }
    res.json({ success: true, message: 'Case removed from saved list' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/saved-cases/:id/notes
const updateCaseNotes = async (req, res, next) => {
  try {
    const updated = await SavedCase.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { notes: req.body.notes },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Saved case not found' });
    res.json({ success: true, case: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSavedCases, saveCase, removeSavedCase, updateCaseNotes };
