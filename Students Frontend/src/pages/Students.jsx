import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Students.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

const fetchStudents = async () => {
  try {
    setLoading(true);
    setError('');

    const response = await api.get('/students/getall');

    console.log('API Response:', response.data);

    // Handle either an array or a single student object
    const data = response.data;

    if (Array.isArray(data)) {
      setStudents(data);
    } else if (data && typeof data === 'object') {
      setStudents([data]);
    } else {
      setStudents([]);
    }
  } catch (err) {
    console.error('API Error:', err);
    setError('Unable to load students.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="students-container">
      <div className="students-header">
        <h2>Student Management</h2>
        <button onClick={fetchStudents} className="refresh-btn">
          Refresh
        </button>
      </div>

      {loading && <p>Loading students...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="students-table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.rollNo}</td>
                    <td>{student.department}</td>
                    <td>{student.course}</td>
                   <td>{student.semester ?? student.Semester ?? '-'}</td>
                    <td>
                    <span className="status-badge">
                        {student.status ?? student.Status ?? '-'}
                    </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Students;