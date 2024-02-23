import { useState, useEffect } from 'react'
import DuplicateTitleModal from './DuplicateTitleModal'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddTask = ({ tasks, onAdd, editTask, onEditSubmit, onCloseEditForm, auth }) => {
    const [title, setTitle] = useState(editTask ? editTask.title : '');
    const [description, setDescription] = useState(editTask ? editTask.description : '');
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (editTask) {
            setTitle(editTask.title);
            setDescription(editTask.description);
        }
    }, [editTask])

    const onSubmit = async (e) => {
        e.preventDefault();
    
        if (!title || !description) {
            alert('Please fill in all fields.');
            return;
        }
    
        if (!auth.isAuthenticated()) {
            return;
        }
    
        try {
            // for duplicate title
            if (tasks.some((task) => task.title === title)) {
                setShowDuplicateModal(true);
                return;
            }
    
            const taskData = {
                title: title,
                description: description,
                status: 'Incomplete', 
                userId: auth.getUserId(), 
            };
    
            await onAdd(taskData);
    
            setTitle('');
            setDescription('');
            onCloseEditForm();
            navigate('/'); 
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <>
            <form className='add-form' onSubmit={onSubmit} style={{ padding: '3%', marginBottom: '2%' }}>
                <div className='form-control'>
                    <label>Title</label>
                    <input type='text' value={title} style={{ padding: '2%' }} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className='form-control'>
                    <label>Description</label>
                    <textarea style={{ width: '100%', height: '100px', padding: '2%' }} type='text' value={description} onChange={(e) => setDescription(e.target.value)} />

                </div>

                <input type='submit' value='Save Task' className='btn btn-block' style={{ marginRight: 'px' }} />
            </form>
            <hr style={{marginLeft: "10px", marginRight: "10px", marginTop: "15px"}} />

            {showDuplicateModal && (
                <DuplicateTitleModal
                    onCancel={() => setShowDuplicateModal(false)}
                    onConfirm={() => {
                        onAdd({ title, description, status: 'Incomplete' });
                        setTitle('');
                        setDescription('');
                        setShowDuplicateModal(false);
                    }}
                />
            )}
        </>
    )

}

export default AddTask