import { apiRequest } from './client';

export const serializeDesign = (nodes = [], edges = []) => ({
  nodes: nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: {
      name: node.data?.name || '',
      attributes: node.data?.attributes || [],
      methods: node.data?.methods || [],
      enumValues: node.data?.enumValues || [],
    },
  })),
  edges: edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    relationshipType: edge.relationshipType || edge.data?.relationshipType || 'association',
  })),
});

export const createSubmission = ({ problemId, design, token }) =>
  apiRequest('/submissions', {
    method: 'POST',
    token,
    body: { problemId, design },
  });

export const getMySubmissions = (token) =>
  apiRequest('/submissions', { token });

export const getSubmission = (submissionId, token) =>
  apiRequest(`/submissions/${submissionId}`, { token });

export const retrySubmissionEvaluation = (submissionId, token) =>
  apiRequest(`/submissions/${submissionId}/retry`, {
    method: 'POST',
    token,
  });
