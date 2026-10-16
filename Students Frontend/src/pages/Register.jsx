import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Register.css';

const Register = () => {
  const [role, setRole] = useState('STUDENT');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    rollNo: '',
    department: '',
    course: '',
    semester: '',
    gender: '',
    dateOfBirth: '',
    subject: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const payload =
      role === 'STUDENT'
        ? {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            rollNo: formData.rollNo,
            phone: formData.phone,
            address: formData.address,
            department: formData.department,
            course: formData.course,
            semester: Number(formData.semester),
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            department: formData.department,
            subject: formData.subject
          };

    try {
      setLoading(true);

      const endpoint =
        role === 'STUDENT'
          ? '/students/register'
          : '/teachers/register';

      const response = await api.post(endpoint, payload);

      setMessage(
        response.data?.message ||
          `${role === 'STUDENT' ? 'Student' : 'Teacher'} registration submitted successfully.`
      );

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        rollNo: '',
        department: '',
        course: '',
        semester: '',
        gender: '',
        dateOfBirth: '',
        subject: ''
      });
    } catch (err) {
  console.error('Registration Error:', err);

  console.error('Status:', err.response?.status);
  console.error('Response:', err.response?.data);

  setError(
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    'Registration failed.'
  );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create an Account</h2>

        <p className="register-subtitle">
          Smart Student Management System
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="register-form-group">
            <label htmlFor="role">Register As</label>

            <select
              id="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setMessage('');
                setError('');
              }}
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>

          <div className="register-form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="department">Department</label>
            <input
              id="department"
              name="department"
              type="text"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter your department"
              required
            />
          </div>

          {role === 'STUDENT' ? (
            <>
              <div className="register-form-group">
                <label htmlFor="rollNo">Roll Number</label>
                <input
                  id="rollNo"
                  name="rollNo"
                  type="text"
                  value={formData.rollNo}
                  onChange={handleChange}
                  placeholder="Enter your roll number"
                  required
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="course">Course</label>
                <input
                  id="course"
                  name="course"
                  type="text"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Enter your course"
                  required
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="semester">Semester</label>
                <input
                  id="semester"
                  name="semester"
                  type="number"
                  min="1"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="Enter your semester"
                  required
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="register-form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          ) : (
            <div className="register-form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter your subject"
                required
              />
            </div>
          )}

          <div className="register-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="register-login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;