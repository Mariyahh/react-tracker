import React, { useState, useEffect } from 'react';
import { FaTimes, FaEdit } from 'react-icons/fa'
import DeleteModal from './DeleteModal';
import { format } from 'date-fns';

export const Task = ({ task, onDelete, onToggle, onEdit, onEditFormOpen }) => {
  const [showModal, setShowModal] = useState(false);
  const [completed, setCompleted] = useState(task.status === 'Complete');
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setCompleted(task.status === 'Complete');

    const parsedDate = task.created ? new Date(task.created) : null;
    const formattedDate = parsedDate ? format(parsedDate, 'MMMM dd, yyyy HH:mm') : "Date not provided";

    setFormattedDate(formattedDate);
  }, [task.status, task.created]);

  const handleDelete = () => {
    onDelete(task.id);
    setShowModal(false);
  };

  const handleToggleCompletion = () => {
    const newCompletionStatus = !completed;
    setCompleted(newCompletionStatus);
    onToggle(task.id, newCompletionStatus); 
  };

  console.log("Task props:", task);

  return (

    <div style={{ marginTop: '20px', padding: '2%', textDecoration: completed ? 'line-through' : 'none', color: completed ? '#aaa' : 'inherit' }}>
      <h3 className='taskhead'>
        <label className="checkbox-container" style={{ marginRight: '5%' }}>
          <input type="checkbox" checked={completed} onChange={handleToggleCompletion} style={{ display: 'none' }} />
          <span className="checkbox-custom"></span>
        </label>

        {task.title}{''}
        <FaTimes
          style={{ color: 'red', cursor: 'pointer', float: 'right' }}
          // onClick={() => onDelete(task.id)}
          onClick={() => setShowModal(true)}
        />
        <FaEdit
          style={{ color: 'blue', cursor: 'pointer', float: 'right' }}
          onClick={() => {
            onEdit(task);
            onEditFormOpen(); 
          }}
        />
      </h3>
      <p style={{ marginLeft: '5%' }}>Description: {task.description}</p>
      <p style={{ marginLeft: '5%' }}>Status: {task.status}</p>
      <p style={{ marginLeft: '5%' }}>Date: {formattedDate}</p>

      <hr style={{marginLeft: "10px", marginRight: "10px", marginTop: "15px"}} />
      {showModal && (
        <DeleteModal
          onDelete={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
      
    </div>
  )
}

export default Task
