import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-badge">✏️ Low-Level Design Practice</div>
      <h1 className="hero-title">
        Practice LLD.<br/><span>Build Better Designs.</span>
      </h1>
      <p className="hero-subtitle">
        Solve real-world design problems, build your class structure visually, and improve with structured feedback.
      </p>
    </section>
  );
};

export default Hero;
