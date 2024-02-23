import PropTypes from 'prop-types'
import { useLocation, useNavigate  } from 'react-router-dom'
import Button from './Button'
import { useAuth } from '../AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = ({ title, onAdd, showAdd }) => {
    const location = useLocation()
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout(); 
            navigate('/login');
            toast.success('You have been logged out.', { position: 'top-right' });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className='header'>
            <h1>{title}</h1>
            {location.pathname === '/' && (
                <>
                    <Button color={showAdd ? 'red' : 'green'} text={showAdd ? 'Close' : 'Add'} onClick={onAdd} />
                    {isAuthenticated && <Button color="blue" text="Logout" onClick={handleLogout} />}
                </>
            )}
            <ToastContainer />
        </header>
    );
}

Header.defaultProps = {
    title: 'My To-Do List',
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
}

export default Header