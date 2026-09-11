const Submission = require('../models/Submission');
const Evaluation = require('../models/Evaluation');
const analyzeDesign = require('../utils/analyzeDesign');
const normalizeDesign = require('../utils/normalizeDesign');
const { runAiEvaluation } = require('../services/evaluationService');

const startBackgroundEvaluation = (submission, findings) => {
  runAiEvaluation(submission, findings).catch(async (evaluationError) => {
    console.error(`AI evaluation failed for ${submission._id}: ${evaluationError.message}`);
    try {
      await Submission.findByIdAndUpdate(submission._id, {
        status: 'failed',
        evaluationError: evaluationError.message,
      });
    } catch (statusError) {
      console.error(`Failed to mark submission ${submission._id} as failed: ${statusError.message}`);
    }
  });
};

const createSubmission = async (req, res) => {
  try {
    const { problemId, design } = req.body;

    if (!problemId || typeof problemId !== 'string' || !problemId.trim()) {
      return res.status(400).json({ message: 'problemId is required' });
    }

    if (!design || typeof design !== 'object') {
      return res.status(400).json({ message: 'design is required' });
    }

    if (!Array.isArray(design.nodes) || !Array.isArray(design.edges)) {
      return res.status(400).json({ message: 'design must include nodes and edges arrays' });
    }

    const normalizedDesign = normalizeDesign(design);

    const submission = await Submission.create({
      user: req.user._id,
      problemId: problemId.trim(),
      design: normalizedDesign,
      status: 'submitted',
    });

    submission.status = 'evaluating';
    submission.evaluationError = '';
    await submission.save();

    const findings = analyzeDesign(normalizedDesign);

    res.status(201).json({
      submission,
      evaluation: null,
      findings,
    });

    startBackgroundEvaluation(submission, findings);
  } catch (error) {
    console.error(`Error in createSubmission: ${error.message}`);
    res.status(500).json({ message: 'Server error while creating submission' });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-design')
      .lean();

    const submissionIds = submissions.map((item) => item._id);
    const evaluations = await Evaluation.find({ submission: { $in: submissionIds } })
      .select('submission overallScore createdAt')
      .lean();

    const evaluationBySubmission = new Map(
      evaluations.map((item) => [item.submission.toString(), item])
    );

    const attempts = submissions.map((submission) => {
      const evaluation = evaluationBySubmission.get(submission._id.toString()) || null;
      return {
        id: submission._id,
        problemId: submission.problemId,
        status: submission.status,
        createdAt: submission.createdAt,
        evaluationError: submission.evaluationError || '',
        overallScore: evaluation?.overallScore ?? null,
      };
    });

    res.json({ attempts });
  } catch (error) {
    console.error(`Error in getMySubmissions: ${error.message}`);
    res.status(500).json({ message: 'Server error while retrieving attempts' });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this submission' });
    }

    const evaluation = await Evaluation.findOne({ submission: submission._id });

    res.json({
      submission,
      evaluation,
    });
  } catch (error) {
    console.error(`Error in getSubmissionById: ${error.message}`);

    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(500).json({ message: 'Server error while retrieving submission' });
  }
};

const retryEvaluation = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this submission' });
    }

    submission.status = 'evaluating';
    submission.evaluationError = '';
    await submission.save();

    const findings = analyzeDesign(submission.design);

    res.json({
      submission,
      evaluation: null,
    });

    startBackgroundEvaluation(submission, findings);
  } catch (error) {
    console.error(`Error in retryEvaluation: ${error.message}`);

    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(500).json({ message: 'Server error while retrying evaluation' });
  }
};

module.exports = {
  createSubmission,
  getMySubmissions,
  getSubmissionById,
  retryEvaluation,
};
