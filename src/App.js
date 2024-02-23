import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axiosInstance from './axiosInstance';
import { useAuth } from './AuthContext';

const API_URL = 'todoes';

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  const [editTask, setEditTask] = useState(null)
  const [editFormOpen, setEditFormOpen] = useState(false);

  const auth = useAuth();

  useEffect(() => {
    const getTasks = async () => {
      try {
        // Retrieve the JWT token from the auth object
        const token = auth.getToken();
        const response = await axiosInstance.get(API_URL); 
        setTasks(response.data);
      } catch (error) {
        if (error.response) {
          // Handle unauthorized access
          if (error.response.status === 401) {
            console.error('Unauthorized access. Please log in again.', error.response.status);
            auth.logout(); // Clear token and update authentication status
            return; 
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error setting up the request:', error.message);
        }
        setTasks([]);
      }
    };

    getTasks();
  }, [auth]);

  useEffect(() => {
    if (!auth.isAuthenticated && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      toast.warn('Please login first!', { position: 'top-center' });
    }
  }, [auth]);

  // Add Task
  const addTask = async (task) => {
    try {
      const token = auth.getToken();
      if (!token) {
        console.error('Authentication token is null');
        return;
      }
      const response = await axiosInstance.post(API_URL, { ...task, UserId: decodeToken(token) }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks([...tasks, response.data]);
      toast.success('New task added!', { position: 'top-center' });
    } catch (error) {
      console.error('Error adding task:', error);
      console.log(error.response.data);
    }
  };


  // Function to open edit form
  const handleEdit = (task) => {
    console.log("Editing task:", task);
    setEditTask(task);
    setEditFormOpen(true);
  };

  // Edit Task
  const editTaskFunc = async (editedTask) => {
    try {
      const token = auth.getToken();
      if (!token) {
        console.error('Authentication token is null');
        return;
      }

      // Update the task on the server
      await axiosInstance.put(`${API_URL}/${editedTask.id}`, {
        ...editedTask,
        UserId: decodeToken(token) 
      });

      // Update the tasks array 
      const updatedTasks = tasks.map((task) =>
        task.id === editedTask.id ? editedTask : task
      );
      setTasks(updatedTasks);
      setEditTask(null);
      toast.success('Task successfully updated!', { position: 'top-center' });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  // const editTaskFunc = async (editedTask) => {
  //   try {

  //     // Add the current date and time to the edited task
  //     editedTask.created = new Date().toISOString();

  //     // Update the task on the server
  //     await axios.put(`${API_URL}/${editedTask.id}`, editedTask);

  //     // Update the tasks array with the edited task
  //     const updatedTasks = tasks.map((task) =>
  //       task.id === editedTask.id ? editedTask : task
  //     );
  //     setTasks(updatedTasks);
  //     setEditTask(null);
  //     toast.success('Task successfully updated!', { position: 'top-center' });
  //   } catch (error) {
  //     console.error('Error updating task:', error);
  //   }
  // };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const token = auth.getToken();
      if (!token) {
        console.error('Authentication token is null');
        return;
      }

      // Delete task on server
      await axiosInstance.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update tasks array
      setTasks(tasks.filter((task) => task.id !== id));
      toast.error('Task successfully deleted!', { position: 'top-center' });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  // const deleteTask = async (id) => {
  //   try {
  //     await axios.delete(`${API_URL}/${id}`);
  //     setTasks(tasks.filter((task) => task.id !== id));
  //     toast.error('Task successfully deleted!', { position: 'top-center' });
  //   } catch (error) {
  //     console.error('Error deleting task:', error);
  //   }
  // };

  // Toggle Status
  const toggleStatus = async (id) => {
    try {
      const taskToToggle = tasks.find((task) => task.id === id);
      const updatedTask = { ...taskToToggle, status: taskToToggle.status === 'Complete' ? 'Incomplete' : 'Complete' };
      await axiosInstance.put(`${API_URL}/${id}`, updatedTask);
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, status: updatedTask.status } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  // Close edit form
  const onCloseEditForm = () => {
    setEditFormOpen(false);
  };

  const decodeToken = (token) => {
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded token payload:', payload);
        if (payload && payload.sub) {
            return payload.sub;
        } else {
            console.error('User ID not found in the token payload.');
            return null;
        }
    }
    return null;
};

  useEffect(() => {
    const location = window.location;
    if (location.state && location.state.loginRequired) {
      toast.warn('Please login first!', { position: 'top-center' });
    }
  }, []);

  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
        <ToastContainer />
        <Routes>
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegistrationForm />} />
          {/* <Route
              path='/'
              element={auth.isAuthenticated ? (
                <div>
                  {(showAddTask || editFormOpen) && (
                    <AddTask tasks={tasks} onAdd={addTask} editTask={editTask} onEditSubmit={editTaskFunc} onCloseEditForm={onCloseEditForm} />
                  )}
                  {tasks.length > 0 ? (
                    <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleStatus} onEdit={setEditTask} setEditFormOpen={setEditFormOpen} />
                  ) : (
                    'No Tasks to Show'
                  )}
                </div>
                ) : (
                  <Navigate to='/login' />
                )}
            /> */}
          <Route
            path='/'
            element={
              auth.isAuthenticated ? (
                <div>
                  {(showAddTask || editFormOpen) && (
                    <AddTask tasks={tasks} onAdd={addTask} editTask={editTask} onEditSubmit={editTaskFunc} onCloseEditForm={onCloseEditForm} auth={auth} />
                  )}
                  {tasks.length > 0 ? (
                    <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleStatus} onEdit={handleEdit} setEditFormOpen={setEditFormOpen} />
                  ) : (
                    'No Tasks to Show'
                  )}
                </div>
              ) : (
                <Navigate to='/login' state={{ fromProtectedRoute: true }} />
              )
            }
          />
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
