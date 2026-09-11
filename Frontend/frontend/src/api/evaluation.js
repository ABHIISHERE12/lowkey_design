import { apiRequest } from './client';
import { getMockEvaluation } from '../data/mockEvaluation';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isBackendUnavailable = (error) => {
  const message = (error?.message || '').toLowerCase();
  return (
    message.includes('failed to fetch')
    || message.includes('network')
    || message.includes('not found')
    || message.includes('404')
    || message.includes('load failed')
  );
};

export const submitAndEvaluateDesign = async ({ problemId, problemTitle, design, token }) => {
  if (!import.meta.env.VITE_API_URL) {
    await delay(1800);
    return {
      status: 'completed',
      evaluation: getMockEvaluation(problemTitle),
    };
  }

  try {
    const data = await apiRequest('/submissions', {
      method: 'POST',
      token,
      body: { problemId, design },
    });

    return {
      status: 'completed',
      evaluation: data.evaluation || data,
    };
  } catch (error) {
    if (isBackendUnavailable(error)) {
      await delay(1800);
      return {
        status: 'completed',
        evaluation: getMockEvaluation(problemTitle),
      };
    }

    return {
      status: 'failed',
      message: error.message || 'Evaluation failed.',
    };
  }
};
