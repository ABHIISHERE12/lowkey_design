const mongoose = require('mongoose');

const criterionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    score: { type: Number, required: true },
    evidence: { type: String, default: '' },
    concern: { type: String, default: '' },
    suggestion: { type: String, default: '' },
    confidence: { type: Number, default: 0 },
  },
  { _id: false }
);

const evaluationSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
      unique: true,
      index: true,
    },
    overallScore: {
      type: Number,
      required: true,
    },
    criteria: {
      type: [criterionSchema],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    concerns: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
