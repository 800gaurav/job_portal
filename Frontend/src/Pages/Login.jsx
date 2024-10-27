import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/auth';
import "react-toastify/dist/ReactToastify.css";
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      alert('All fields are required');
      return;
    }
    try {
      const res = await axios.post('https://job-protal-4.onrender.com/api/auth/login', { email, password });
      if (res.data.success) {
        dispatch(authActions.login());
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.users.role);
        localStorage.setItem('id', res.data.users._id);
        toast.success(res.data.message);
        navigate('/');
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 403) {
          alert("Your account has been Blocked");
        } else if (status === 404) {
          toast.error(data.message);
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="submit-btn">Log in</button>
        <div className="or_fun">
          <p className="text-center">or</p>
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Login;
