
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedRole = (searchParams.get('role') || 'STUDENT').toUpperCase();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const user = response.data;

      if (!user || !user.id || !user.role) {
        setError('Invalid login response from server.');
        return;
      }

      const actualRole = String(user.role).toUpperCase();
      const status = String(user.status || '').toUpperCase();

      // Verify that the selected portal matches the account role.
      if (actualRole !== selectedRole) {
        setError(
          `This account does not belong to the ${selectedRole.toLowerCase()} portal. Please select the correct portal.`
        );
        return;
      }

      // Check approval status for student and teacher accounts.
      if (status === 'PENDING') {
        setError('Your account is pending admin approval.');
        return;
      }

      if (status === 'REJECTED') {
        setError('Your account registration was rejected.');
        return;
      }

      // Save the account details after successful validation.
      localStorage.setItem('userId', user.id);
      localStorage.setItem('name', user.name || '');
      localStorage.setItem('email', user.email || '');
      localStorage.setItem('role', actualRole);
      localStorage.setItem('status', status);

      // Navigate to the appropriate dashboard.
      switch (actualRole) {
        case 'STUDENT':
          navigate('/student-dashboard');
          break;

        case 'TEACHER':
          navigate('/teacher-dashboard');
          break;

        case 'ADMIN':
          navigate('/dashboard');
          break;

        default:
          localStorage.removeItem('userId');
          localStorage.removeItem('name');
          localStorage.removeItem('email');
          localStorage.removeItem('role');
          localStorage.removeItem('status');

          setError('Unknown account role. Please contact the administrator.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const roleLabels = {
    STUDENT: 'Student',
    TEACHER: 'Teacher',
    ADMIN: 'Admin'
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Smart Student Management System</h2>

        <p className="login-subtitle">
          {roleLabels[selectedRole] || 'User'} Sign In
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : `Login as ${roleLabels[selectedRole] || 'User'}`}
          </button>
        </form>

        {selectedRole !== 'ADMIN' && (
          <p className="register-link">
            Don't have an account?{' '}
            <Link to={`/register?role=${selectedRole}`}>
              Register
            </Link>
          </p>
        )}

        <p className="register-link">
          <Link to="/">← Back to Common Dashboard</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
