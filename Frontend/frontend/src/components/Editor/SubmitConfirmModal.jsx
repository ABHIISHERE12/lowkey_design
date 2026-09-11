import React from 'react';
import '../ProblemDetail.css';
import './SubmitConfirmModal.css';

const SubmitConfirmModal = ({ onCancel, onConfirm, submitting }) => {
  return (
    <div className="modal-overlay" onClick={submitting ? undefined : onCancel}>
      <div className="modal-content submit-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Ready to submit?</h2>
          <p className="modal-desc">
            Your current LLD design will be evaluated against the platform's design rubric.
          </p>
        </div>
        <div className="modal-footer submit-confirm-actions">
          <button type="button" className="cancel-submit-btn" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button type="button" className="confirm-submit-btn" onClick={onConfirm} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit Design'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmModal;
