const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../config/multer');
const { uploadDocument, listDocuments, getDocument } = require('../controllers/documentController');

const router = express.Router();
router.use(protect);

// POST /api/v1/documents  — upload a PDF
router.post('/', upload.single('document'), uploadDocument);

// GET /api/v1/documents  — list all documents for current user
router.get('/', listDocuments);

// GET /api/v1/documents/:id
router.get('/:id', getDocument);

module.exports = router;
