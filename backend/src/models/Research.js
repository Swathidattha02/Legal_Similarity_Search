const mongoose = require('mongoose');

/**
 * Represents a single legal research session.
 * A session may be text-based (query string) or document-based (uploaded PDF).
 */
const researchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    queryText: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    queryType: {
      type: String,
      enum: ['text', 'document'],
      required: true,
    },
    // Reference to uploaded document (when queryType === 'document')
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    errorMessage: { type: String },
    // Results stored after AI service responds
    results: [
      {
        caseId: String,
        caseTitle: String,
        court: String,
        year: Number,
        citation: String,
        sourceUrl: String,
        similarityScore: Number,
        matchedChunks: [String],
        summary: String,
        relevanceExplanation: String,
        statutes: [String],
      },
    ],
    ragSummary: { type: String },
    processingTimeMs: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Research', researchSchema);
