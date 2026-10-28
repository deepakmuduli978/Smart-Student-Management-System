import { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/RegistrationApproval.css';

function RegistrationApproval() {
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

    const response = await api.get('/admin/pending-students');

    setStudents(Array.isArray(response.data) ? response.data : []);
  } catch (err) {
    console.error('Fetch error:', err.response?.data || err.message);
    setError('Unable to load pending student registrations.');
  } finally {
    setLoading(false);
  }
};

const handleApproval = async (studentId, approved) => {
  try {
    const action = approved ? 'approve' : 'reject';

    await api.put(`/admin/students/${studentId}/${action}`);

    alert(
      approved
        ? 'Student approved successfully!'
        : 'Student rejected successfully!'
    );

    await fetchStudents();
  } catch (err) {
    console.error('Approval error:', err.response?.data || err.message);

    alert(
      err.response?.data?.message ||
      `Failed to ${approved ? 'approve' : 'reject'} student.`
    );
  }
};

  return (
    <div className="approval-container">
      <div className="approval-header">
        <div>
          <h2>Registration Approval</h2>
          <p>Review pending student registrations.</p>
        </div>

        <button className="approval-refresh" onClick={fetchStudents}>
          Refresh
        </button>
      </div>

      {loading && <p>Loading registrations...</p>}

      {error && <p className="approval-error">{error}</p>}

      {!loading && !error && (
        <div className="approval-table-wrapper">
          <table className="approval-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {students.length > 0 ? (
                students.map(student => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.rollNo}</td>
                    <td>{student.department}</td>

                    <td>
                      <span className="approval-pending">
                        {student.Status ?? student.status}
                      </span>
                    </td>

                    <td>
                      <div className="approval-actions">
                        <button
                          className="approve-btn"
                          onClick={() => handleApproval(student.id, true)}
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() => handleApproval(student.id, false)}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="approval-empty">
                    No pending registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RegistrationApproval;