import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const onProblems = location.pathname === '/';
  const onAttempts = location.pathname.startsWith('/attempts');

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">LowKeyDesign</Link>
      </div>
      
      <div className="nav-center">
        <Link to="/" className={`nav-link ${onProblems ? 'active' : ''}`}>Problems</Link>
        <Link to="/attempts" className={`nav-link ${onAttempts ? 'active' : ''}`}>My Attempts</Link>
      </div>
      
      <div className="nav-right">
        <div className="profile">
          <span className="profile-icon">👤</span>
          {user?.name || 'Learner'}
        </div>
        <button type="button" className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
