const express = require('express');
const { body, param } = require('express-validator');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  getSavedCases,
  saveCase,
  removeSavedCase,
  updateCaseNotes,
} = require('../controllers/savedCasesController');

const router = express.Router();
router.use(protect);

// GET /api/v1/saved-cases
router.get('/', getSavedCases);

// POST /api/v1/saved-cases
router.post(
  '/',
  [
    body('caseId').notEmpty().withMessage('caseId is required'),
    body('caseTitle').notEmpty().withMessage('caseTitle is required'),
    body('court').optional().isString(),
    body('year').optional().isInt({ min: 1900, max: 2100 }),
    body('citation').optional().isString(),
    body('sourceUrl').optional().isURL(),
    body('similarityScore').optional().isFloat({ min: 0, max: 1 }),
    body('notes').optional().isLength({ max: 2000 }),
  ],
  validate,
  saveCase
);

// DELETE /api/v1/saved-cases/:id
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid case ID')],
  validate,
  removeSavedCase
);

// PATCH /api/v1/saved-cases/:id/notes
router.patch(
  '/:id/notes',
  protect,
  [
    param('id').isMongoId(),
    body('notes').isLength({ max: 2000 }),
  ],
  validate,
  updateCaseNotes
);

module.exports = router;
