const Submission = require('../models/Submission');
const Evaluation = require('../models/Evaluation');
const { getProblemById } = require('../data/problems');
const { evaluateDesign } = require('./aiEvaluationService');

const runAiEvaluation = async (submission, findings) => {
  const problem = getProblemById(submission.problemId);
  const result = await evaluateDesign({
    problem,
    design: submission.design,
    findings,
  });

  await Evaluation.findOneAndUpdate(
    { submission: submission._id },
    {
      submission: submission._id,
      overallScore: result.overallScore,
      criteria: result.criteria,
      strengths: result.strengths,
      concerns: result.concerns,
      suggestions: result.suggestions,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await Submission.findByIdAndUpdate(submission._id, {
    status: 'completed',
    evaluationError: '',
  });
  submission.status = 'completed';
  return result;
};

module.exports = {
  runAiEvaluation,
};
