import React from 'react';

const DuplicateTitleModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="modal-wrapper">
      <div className="modal">
        <div className="modal-content">
          <p>This title is already in use. Continue adding task?</p>
          <div className="modal-actions">
            <button style={{backgroundColor:"#dbadb5"}} className="cancel" onClick={onCancel}>
              Cancel
            </button>
            <button style={{backgroundColor:"#B47B84"}} className="confirm" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateTitleModal;
