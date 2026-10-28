import { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Teachers.css';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/teachers');

      setTeachers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Unable to load teachers.');
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (teacher) => {
    try {
      const active = !teacher.active;

      await api.patch(`/teachers/${teacher.id}/status`, null, {
        params: { active }
      });

      await fetchTeachers();
    } catch (err) {
      console.error('Error updating teacher:', err);
      alert('Unable to update teacher status.');
    }
  };

  return (
    <div className="teachers-container">
      <div className="teachers-header">
        <h2>Teacher Management</h2>

        <button onClick={fetchTeachers} className="teachers-refresh">
          Refresh
        </button>
      </div>

      {loading && <p>Loading teachers...</p>}

      {error && <p className="teachers-error">{error}</p>}

      {!loading && !error && (
        <div className="teachers-table-wrapper">
          <table className="teachers-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Account</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.id}</td>
                    <td>{teacher.name}</td>
                    <td>{teacher.email}</td>
                    <td>{teacher.phone}</td>
                    <td>{teacher.department}</td>
                    <td>{teacher.subject}</td>
                    <td>
                      <span
                        className={`teacher-status ${String(
                          teacher.status
                        ).toLowerCase()}`}
                      >
                        {teacher.status}
                      </span>
                    </td>
                    <td>
                      {teacher.active ? 'Active' : 'Inactive'}
                    </td>
                    <td>
                      <button
                        className={
                          teacher.active
                            ? 'deactivate-btn'
                            : 'activate-btn'
                        }
                        onClick={() => changeStatus(teacher)}
                      >
                        {teacher.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="teachers-empty">
                    No teachers found.
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

export default Teachers;