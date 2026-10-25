const mongoose = require('mongoose');

const savedCaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // The research session this case came from (optional)
    research: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Research',
    },
    // Case metadata from the AI service / dataset
    caseId: { type: String, required: true },
    caseTitle: { type: String, required: true, trim: true },
    court: { type: String, trim: true },
    year: { type: Number },
    citation: { type: String, trim: true },
    sourceUrl: { type: String, trim: true },
    similarityScore: { type: Number },
    summary: { type: String },
    relevanceExplanation: { type: String },
    statutes: [{ type: String }],
    notes: { type: String, maxlength: 2000 }, // user-written notes
  },
  { timestamps: true }
);

// Prevent duplicate saves of the same case per user
savedCaseSchema.index({ user: 1, caseId: 1 }, { unique: true });

module.exports = mongoose.model('SavedCase', savedCaseSchema);
