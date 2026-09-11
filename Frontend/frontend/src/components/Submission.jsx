import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { problems } from '../data/problems';
import { getSubmission, retrySubmissionEvaluation } from '../api/submissions';
import { useAuth } from '../context/AuthContext';
import './Submission.css';

const POLL_MS = 2000;

const formatScore = (value) => {
  const score = Number(value);
  return Number.isNaN(score) ? '—' : score.toFixed(1);
};

const formatConfidence = (value) => {
  const confidence = Number(value);
  if (Number.isNaN(confidence)) return '—';
  return `${Math.round(confidence * 100)}%`;
};

const Submission = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [submission, setSubmission] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const pollRef = useRef(null);

  const problem = useMemo(() => {
    const problemId = submission?.problemId;
    return problems.find((item) => item.id === problemId) || { title: problemId || 'Problem', icon: '📐' };
  }, [submission]);

  const status = submission?.status || '';
  const isPending = status === 'submitted' || status === 'evaluating';

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const applyPayload = useCallback((data) => {
    setError('');
    setSubmission(data.submission);
    setEvaluation(data.evaluation || null);
    const nextStatus = data.submission?.status;
    if (nextStatus === 'completed' || nextStatus === 'failed') {
      stopPolling();
    }
  }, [stopPolling]);

  const fetchSubmission = useCallback(async () => {
    const data = await getSubmission(submissionId, token);
    applyPayload(data);
    return data.submission?.status;
  }, [applyPayload, submissionId, token]);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      setError('');
      try {
        const currentStatus = await fetchSubmission();
        if (cancelled) return;
        if (currentStatus === 'completed' || currentStatus === 'failed') return;

        pollRef.current = setInterval(async () => {
          try {
            await fetchSubmission();
          } catch (pollError) {
            setError(pollError.message || 'Could not refresh evaluation status.');
          }
        }, POLL_MS);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || 'Could not load this submission.');
        }
      }
    };

    start();
    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [fetchSubmission, stopPolling]);

  const handleRetry = async () => {
    setRetrying(true);
    setError('');
    try {
      const data = await retrySubmissionEvaluation(submissionId, token);
      applyPayload(data);
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          await fetchSubmission();
        } catch (pollError) {
          setError(pollError.message || 'Could not refresh evaluation status.');
        }
      }, POLL_MS);
    } catch (retryError) {
      setError(retryError.message || 'Could not retry evaluation.');
    } finally {
      setRetrying(false);
    }
  };

  const handleViewDesign = () => {
    if (submission?.problemId) {
      navigate(`/editor/${submission.problemId}`);
    }
  };

  const handleTryAgain = () => {
    if (submission?.problemId) {
      navigate(`/editor/${submission.problemId}?fresh=1`);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="submission-page">
        <div className="submission-card">
          <div className="submission-meta">
            <div>
              <p className="submission-label">Problem</p>
              <h1 className="submission-problem">
                <span>{problem.icon}</span> {problem.title}
              </h1>
            </div>
            <div className={`submission-status ${status ? `status-${status}` : (error ? 'status-failed' : 'status-evaluating')}`}>
              {error && !submission ? 'Failed' : (isPending || !submission ? 'Evaluating...' : status)}
            </div>
          </div>

          {!submission && error && (
            <div className="evaluation-failed">
              <h2>Could not load this submission.</h2>
              <p className="failed-detail">{error}</p>
            </div>
          )}

          {((!submission && !error) || isPending) && (
            <div className="evaluation-loading">
              <div className="eval-spinner" aria-hidden="true" />
              <h2>Analyzing your design...</h2>
              <p>Deterministic checks and Gemini Flash are reviewing your LLD against the rubric.</p>
              {error && <p className="failed-detail">{error}</p>}
            </div>
          )}

          {status === 'failed' && (
            <div className="evaluation-failed">
              <h2>Your design was saved, but evaluation failed.</h2>
              <p className="failed-detail">
                {submission?.evaluationError || error || 'Gemini could not evaluate this design.'}
              </p>
              <button type="button" className="retry-eval-btn" onClick={handleRetry} disabled={retrying}>
                {retrying ? 'Retrying…' : 'Retry Evaluation'}
              </button>
            </div>
          )}

          {status === 'completed' && evaluation && (
            <div className="evaluation-results">
              <h2 className="evaluation-heading">Design Evaluation</h2>
              <div className="overall-score">
                <span className="overall-label">Overall Score</span>
                <span className="overall-value">{formatScore(evaluation.overallScore)} / 10</span>
              </div>

              <div className="criteria-list">
                {(evaluation.criteria || []).map((criterion) => (
                  <article key={criterion.name} className="criterion-card">
                    <div className="criterion-header">
                      <h3>{criterion.name}</h3>
                      <span className="criterion-score">{formatScore(criterion.score)} / 10</span>
                    </div>
                    <p><strong>Score:</strong> {formatScore(criterion.score)} / 10</p>
                    <p><strong>Evidence:</strong> {criterion.evidence}</p>
                    <p><strong>Concern:</strong> {criterion.concern}</p>
                    <p><strong>Suggestion:</strong> {criterion.suggestion}</p>
                    <p><strong>Confidence:</strong> {formatConfidence(criterion.confidence)}</p>
                  </article>
                ))}
              </div>

              <section className="eval-section">
                <h3>Strengths</h3>
                <ul>
                  {(evaluation.strengths || []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <section className="eval-section">
                <h3>Areas to Improve</h3>
                <ul>
                  {(evaluation.concerns || []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <section className="eval-section">
                <h3>Actionable Suggestions</h3>
                <ul>
                  {(evaluation.suggestions || []).map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <div className="submission-actions">
                <button type="button" className="view-design-btn" onClick={handleViewDesign}>
                  View My Design
                </button>
                <button type="button" className="try-again-btn" onClick={handleTryAgain}>
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Submission;
