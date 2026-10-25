const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../config/multer');
const {
  createResearch,
  getResearch,
  listResearch,
} = require('../controllers/researchController');

const router = express.Router();

// All research routes require authentication
router.use(protect);

// POST /api/v1/research  — start a new research session
router.post(
  '/',
  upload.single('document'), // optional PDF upload
  [
    body('queryText')
      .if((_value, { req }) => !req.file)
      .notEmpty()
      .withMessage('queryText is required when no document is uploaded')
      .isLength({ max: 5000 }),
    body('title').optional().trim().isLength({ max: 300 }),
  ],
  validate,
  createResearch
);

// GET /api/v1/research  — list all sessions for the current user
router.get('/', listResearch);

// GET /api/v1/research/:id  — retrieve one session with results
router.get('/:id', getResearch);

module.exports = router;
