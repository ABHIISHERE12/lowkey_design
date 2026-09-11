import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo">LowKeyDesign</div>
        </div>
        
        <div className="footer-center">
          © {new Date().getFullYear()} LowKeyDesign. Practice makes perfect.
        </div>
        
        <div className="footer-links">
          <a href="#" className="footer-link">GitHub</a>
          <a href="#" className="footer-link">Discord</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
