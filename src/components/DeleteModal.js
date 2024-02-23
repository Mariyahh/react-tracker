import React from 'react'

const DeleteModal = ({ onDelete, onCancel }) => {
    return (
        <div className="modal-wrapper">
            <div className="modal">
                <div className="modal-content">
                    <p>Are you sure you want to delete this task?</p>
                    <div className="modal-actions">
                        <button className='can' onClick={onCancel}>Cancel</button>
                        <button className='del' onClick={onDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
