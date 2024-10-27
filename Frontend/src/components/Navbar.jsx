import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../store/auth';

function Navbar() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Assuming role is stored in local storage
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(authActions.logout());
        localStorage.removeItem('token'); 
        localStorage.removeItem('id'); // Changed clear to removeItem
        localStorage.removeItem('username'); // Changed clear to removeItem
        localStorage.removeItem('role'); // Also clear the role
        navigate('/');  
    };

    return (
        <div className='navbar'>
            <div className="logo" onClick={() => navigate('/')}>
                <h2>Job Portal</h2>
            </div>
            <div className="nav_items">
                {token ? (
                    <div className="d-flex gap-3 nav_links">
                        <Link to="/" className="btn btn-outline-info">Home</Link>
                        {/* Conditionally render the My Application button based on role */}
                        {role !== 'reviewer' && role !== 'approver' && (
                            <Link to="/application" className="btn btn-primary">My Application</Link>
                        )}
                        <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
                    </div>
                ) : (
                    <div className="lavlink d-flex gap-3">
                        <Link to="/login" className="btn btn-outline-success">Login</Link>
                        <Link to="/signup" className="btn btn-outline-info">Sign Up</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
