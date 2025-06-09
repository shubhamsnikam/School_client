import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; // for school icon

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert('Login failed. Please check credentials.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <i className="bi bi-mortarboard-fill" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
          <h3 className="mt-2 text-primary">School Login</h3>
          <p className="text-muted">Welcome back! Please login to continue.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">
            Login
          </button>
        </form>

        <hr className="my-4" />

        <div className="text-center">
          <p className="mb-2">Don't have an account?</p>
          <Link to="/register" className="btn btn-outline-primary w-100">
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
