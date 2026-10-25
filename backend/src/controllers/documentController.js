const Document = require('../models/Document');
const path = require('path');

// POST /api/v1/documents
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const doc = await Document.create({
      user: req.user._id,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      fileSizeBytes: req.file.size,
      mimeType: req.file.mimetype,
      processingStatus: 'uploaded',
    });

    res.status(201).json({ success: true, document: doc });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/documents
const listDocuments = async (req, res, next) => {
  try {
    const docs = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: docs.length, documents: docs });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/documents/:id
const getDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }
    res.json({ success: true, document: doc });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadDocument, listDocuments, getDocument };
