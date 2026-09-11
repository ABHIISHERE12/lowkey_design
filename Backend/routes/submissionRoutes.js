const express = require('express');
const router = express.Router();
const { createSubmission, getMySubmissions, getSubmissionById, retryEvaluation } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSubmission);
router.get('/', protect, getMySubmissions);
router.post('/:id/retry', protect, retryEvaluation);
router.get('/:id', protect, getSubmissionById);

module.exports = router;
