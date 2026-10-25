const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalName: { type: String, required: true },
    storedName: { type: String, required: true }, // UUID filename on disk
    fileSizeBytes: { type: Number },
    mimeType: { type: String, default: 'application/pdf' },
    // Processing state by the Python AI service
    processingStatus: {
      type: String,
      enum: ['uploaded', 'extracting', 'indexing', 'ready', 'failed'],
      default: 'uploaded',
    },
    processingError: { type: String },
    // Extracted text metadata (not the full text — that lives in ChromaDB)
    pageCount: { type: Number },
    wordCount: { type: Number },
    extractionMethod: {
      type: String,
      enum: ['digital', 'ocr', 'unknown'],
      default: 'unknown',
    },
    // ChromaDB collection / document IDs for retrieval
    chromaDocumentIds: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
