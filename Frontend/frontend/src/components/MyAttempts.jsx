import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { problems } from '../data/problems';
import { getMySubmissions } from '../api/submissions';
import { useAuth } from '../context/AuthContext';
import './MyAttempts.css';

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
};

const formatScore = (value) => {
  const score = Number(value);
  return Number.isNaN(score) ? '—' : score.toFixed(1);
};

const MyAttempts = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const problemMap = useMemo(() => {
    const map = new Map();
    problems.forEach((problem) => map.set(problem.id, problem));
    return map;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getMySubmissions(token);
        if (!cancelled) {
          setAttempts(Array.isArray(data.attempts) ? data.attempts : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load your attempts.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const openReport = (attempt) => {
    navigate(`/submission/${attempt.id}`);
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="attempts-page">
        <div className="attempts-header">
          <h1 className="attempts-title">My Attempts</h1>
          <p className="attempts-subtitle">
            Review every past submission and open its evaluation report.
          </p>
        </div>

        {loading && (
          <div className="attempts-state">Loading your attempts…</div>
        )}

        {!loading && error && (
          <div className="attempts-state attempts-error">{error}</div>
        )}

        {!loading && !error && attempts.length === 0 && (
          <div className="attempts-empty">
            <h2>No attempts yet</h2>
            <p>Submit a design from a problem to see your reports here.</p>
            <Link to="/" className="attempts-cta">Browse Problems</Link>
          </div>
        )}

        {!loading && !error && attempts.length > 0 && (
          <div className="attempts-list">
            {attempts.map((attempt) => {
              const problem = problemMap.get(attempt.problemId);
              const title = problem?.title || attempt.problemId;
              const icon = problem?.icon || '📐';
              const color = problem?.color || '#fef08a';
              return (
                <article
                  key={attempt.id}
                  className="attempt-card"
                  style={{ '--card-color': color }}
                >
                  <div className="attempt-card-top">
                    <div className="attempt-problem">
                      <span className="attempt-icon">{icon}</span>
                      <div>
                        <h2>{title}</h2>
                        <p className="attempt-date">{formatDate(attempt.createdAt)}</p>
                      </div>
                    </div>
                    <span className={`attempt-status status-${attempt.status}`}>
                      {attempt.status}
                    </span>
                  </div>

                  <div className="attempt-meta">
                    <div>
                      <span className="meta-label">Overall Score</span>
                      <span className="meta-value">
                        {attempt.overallScore == null
                          ? 'Pending'
                          : `${formatScore(attempt.overallScore)} / 10`}
                      </span>
                    </div>
                    <div>
                      <span className="meta-label">Problem ID</span>
                      <span className="meta-value">{attempt.problemId}</span>
                    </div>
                  </div>

                  <div className="attempt-actions">
                    <button
                      type="button"
                      className="view-report-btn"
                      onClick={() => openReport(attempt)}
                    >
                      {attempt.status === 'completed' ? 'View Report' : 'Open Submission'}
                    </button>
                    <Link to={`/editor/${attempt.problemId}`} className="retry-problem-link">
                      Practice Again
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyAttempts;
