import React from 'react';
import './EditorHeader.css';

const EditorHeader = ({ problem, onBack, hasUnsavedChanges, onSave, onSubmit, onToggleLeft, onToggleRight }) => {
  return (
    <header className="editor-header">
      <div className="header-left">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <button className="mobile-toggle" onClick={onToggleLeft}>☰ Tools</button>
        <div className="problem-title-container">
          <span className="problem-icon">{problem.icon}</span>
          <h1 className="problem-name">{problem.title}</h1>
          <span className="header-badge">LLD Practice</span>
        </div>
      </div>
      
      <div className="header-center">
        <span className="design-title">Design your solution</span>
      </div>
      
      <div className="header-right">
        {hasUnsavedChanges ? (
          <span className="unsaved-indicator">● Unsaved changes</span>
        ) : (
          <span className="saved-indicator">✔ All changes saved</span>
        )}
        <button className="mobile-toggle props" onClick={onToggleRight}>⚙ Props</button>
        <button className="save-btn" onClick={onSave}>Save Draft</button>
        <button className="submit-btn" onClick={onSubmit}>Submit Design</button>
      </div>
    </header>
  );
};

export default EditorHeader;
