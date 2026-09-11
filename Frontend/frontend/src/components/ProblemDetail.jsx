import React, { useEffect } from 'react';
import './ProblemDetail.css';

const ProblemDetail = ({ problem, onClose, onStartPractice }) => {

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!problem) return null;

  const handleStartPractice = () => {
    onStartPractice(problem);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ '--card-color': problem.color }}
      >
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="card-icon">{problem.icon}</span>
            <h2 className="modal-title">{problem.title}</h2>
            <div className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
              {problem.difficulty}
            </div>
          </div>
          <p className="modal-desc">{problem.longDesc}</p>
        </div>

        <div className="modal-body">
          <div className="history-section">
            <h4>
              Your History
              {problem.bestScore && (
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  🏆 Best: {problem.bestScore}/10
                </span>
              )}
            </h4>
            
            {problem.history && problem.history.length > 0 ? (
              <div className="history-list">
                {problem.history.map((attempt, index) => (
                  <div key={attempt.id} className="history-item">
                    <div className="history-item-left">
                      <span className="history-attempt">Attempt {attempt.id}</span>
                      <span className="history-date">{attempt.date}</span>
                    </div>
                    <div className="history-score">
                      {attempt.score}/10
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-history">
                No attempts yet. Be the first to solve this problem.
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="start-practice-btn" onClick={handleStartPractice}>
            Start Practice →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;
