const mongoose = require('mongoose');

const parameterSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    type: { type: String, default: '' },
  },
  { _id: false }
);

const attributeSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    type: { type: String, default: '' },
    visibility: { type: String, default: 'public' },
  },
  { _id: false }
);

const methodSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    returnType: { type: String, default: 'void' },
    visibility: { type: String, default: 'public' },
    parameters: { type: [parameterSchema], default: [] },
    isOverride: { type: Boolean, default: false },
    isOverloaded: { type: Boolean, default: false },
  },
  { _id: false }
);

const nodeDataSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    attributes: { type: [attributeSchema], default: [] },
    methods: { type: [methodSchema], default: [] },
    enumValues: { type: [String], default: [] },
  },
  { _id: false }
);

const nodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
    },
    data: { type: nodeDataSchema, default: () => ({}) },
  },
  { _id: false }
);

const edgeSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    target: { type: String, required: true },
    relationshipType: { type: String, default: 'association' },
  },
  { _id: false }
);

const designSchema = new mongoose.Schema(
  {
    nodes: { type: [nodeSchema], default: [] },
    edges: { type: [edgeSchema], default: [] },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problemId: {
      type: String,
      required: true,
      index: true,
    },
    design: {
      type: designSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ['submitted', 'evaluating', 'completed', 'failed'],
      default: 'submitted',
      index: true,
    },
    evaluationError: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
