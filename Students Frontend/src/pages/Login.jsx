import React from 'react';
import '../styles/Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Smart Student Management System</h2>
        <p className="login-subtitle">Sign in to your account</p>

        <form>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
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
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;