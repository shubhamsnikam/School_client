import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin', // or 'teacher'
  });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, formData);
      alert('Registered successfully');
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-plus-fill" style={{ fontSize: '3rem', color: '#198754' }}></i>
          <h3 className="mt-2 text-success">Register Account</h3>
          <p className="text-muted">Create your staff account below.</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Choose a username"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter a secure password"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="admin">Principal</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100 mt-2">
            Register
          </button>
        </form>

        <hr className="my-4" />

        <div className="text-center">
          <p className="mb-2">Already have an account?</p>
          <Link to="/login" className="btn btn-outline-secondary w-100">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
