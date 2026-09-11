import React from 'react';
import './ProblemCard.css';

const ProblemCard = ({ problem, onClick }) => {
  const { title, difficulty, shortDesc, time, attempts, bestScore, icon, color } = problem;

  return (
    <div 
      className="problem-card" 
      style={{ backgroundColor: color }}
      onClick={() => onClick(problem)}
    >
      <div className="card-header">
        <div className="card-icon">{icon}</div>
        <div className={`difficulty-badge ${difficulty.toLowerCase()}`}>
          {difficulty}
        </div>
      </div>
      
      <h3 className="card-title">{title}</h3>
      <p className="card-desc">{shortDesc}</p>
      
      <div className="card-meta">
        <div className="meta-item">
          <span>⏱️</span> {time}
        </div>
        <div className="meta-item">
          <span>🔄</span> {attempts} {attempts === 1 ? 'Attempt' : 'Attempts'}
        </div>
        {bestScore && (
          <div className="meta-item">
            <span>🏆</span> Best: {bestScore}/10
          </div>
        )}
      </div>
      
      <button className="practice-btn" onClick={(e) => {
        e.stopPropagation();
        onClick(problem);
      }}>
        Practice <span>→</span>
      </button>
    </div>
  );
};

export default ProblemCard;
