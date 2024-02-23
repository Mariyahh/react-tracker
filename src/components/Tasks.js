import React, { useState, useEffect } from 'react';
import Task from "./Task";

const Tasks = ({ tasks, onDelete, onToggle, onEdit, setEditFormOpen, setTasks }) => {
    const [sortByDateAsc, setSortByDateAsc] = useState(true);
    const [sortByStatusAsc, setSortByStatusAsc] = useState(true);
    const [filter, setFilter] = useState('All');
    const [filteredTasks, setFilteredTasks] = useState([]);

    const handleSortByDate = () => {
        const sorted = [...tasks].sort((a, b) => {
            const dateA = new Date(a.created);
            const dateB = new Date(b.created);
            return sortByDateAsc ? dateA - dateB : dateB - dateA;
        });
        setSortByDateAsc(!sortByDateAsc);
        return sorted;
    };

    // status
    const handleSortByStatus = () => {
        const sorted = [...tasks].sort((a, b) => {
            return sortByStatusAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
        });
        setSortByStatusAsc(!sortByStatusAsc);
        return sorted;
    };

    // filtering tasks
    const handleFilter = (status) => {
        console.log('Filter selected:', status);
        setFilter(status);
    };

    // sorting and filtering 
    const applySortAndFilter = (sortingFunction) => {
        let sortedTasks = sortingFunction();
        let filteredTasks = [...sortedTasks];
        if (filter !== 'All') {
            filteredTasks = sortedTasks.filter(task => task.status === filter);
        }
        console.log('Sorted and filtered tasks:', filteredTasks);
        return filteredTasks;
    };

    // handle sorting and filtering
    const handleSortAndFilter = (sortingFunction) => {
        console.log('Sorting and filtering...');
        const filteredTasks = applySortAndFilter(sortingFunction);
        setFilteredTasks(filteredTasks);
    };

    useEffect(() => {
        // Update filtered tasks
        handleSortAndFilter(handleSortByDate);
    }, [tasks, filter]);

    return (
        <>
            <div className='sorfil' style={{ marginBottom: '10px' }}>
                <button className='sortDate' onClick={() => handleSortAndFilter(handleSortByDate)}>
                    Sort by Date {sortByDateAsc ? '↑' : '↓'}
                </button>
                <button className='filsor' onClick={() => handleSortAndFilter(handleSortByStatus)}>
                    Sort by Status {sortByStatusAsc ? '(Incomplete to Complete)' : '(Complete to Incomplete)'}
                </button>
                <button className='filsor' onClick={() => handleFilter('Complete')}>Show Complete</button>
                <button className='filsor' onClick={() => handleFilter('Incomplete')}>Show Incomplete</button>
                <button className='filsor' onClick={() => handleFilter('All')}>Show All</button>
            </div>
            <hr style={{marginLeft: "10px", marginRight: "10px", marginTop: "15px"}} />
            {filteredTasks.map((task, index) => (
                <Task
                    key={index}
                    task={task}
                    onDelete={onDelete}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onEditFormOpen={() => setEditFormOpen(true)}
                    setTasks={setTasks}
                />
            ))}
        </>
    );
};

export default Tasks;
