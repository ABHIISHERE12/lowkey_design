import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemCard from './ProblemCard';
import ProblemDetail from './ProblemDetail';
import { problems } from '../data/problems';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedProblem, setSelectedProblem] = useState(null);
  const navigate = useNavigate();

  const handleOpenProblem = (problem) => {
    setSelectedProblem(problem);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseProblem = () => {
    setSelectedProblem(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Practice Problems</h2>
        <p className="dashboard-subtitle">Choose a problem and start designing.</p>
      </div>
      
      <div className="problem-grid">
        {problems.map(problem => (
          <ProblemCard 
            key={problem.id} 
            problem={problem} 
            onClick={handleOpenProblem}
          />
        ))}
      </div>

      {selectedProblem && (
        <ProblemDetail 
          problem={selectedProblem} 
          onClose={handleCloseProblem} 
          onStartPractice={(problem) => {
            handleCloseProblem();
            navigate(`/editor/${problem.id}`);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
