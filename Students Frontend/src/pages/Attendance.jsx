import { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Attendance.css';

function Attendance() {
const [students, setStudents] = useState([]);
const [attendance, setAttendance] = useState({});
const [attendanceDate, setAttendanceDate] = useState(
new Date().toLocaleDateString('en-CA')
);
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
const [error, setError] = useState('');
const [message, setMessage] = useState('');

useEffect(() => {
fetchStudents();
}, []);

useEffect(() => {
if (attendanceDate) {
fetchAttendance();
}
}, [attendanceDate]);
const fetchStudents = async () => {
  try {
    setLoading(true);
    setError('');

    const response = await api.get('/students/getall');

    const data = response.data;

    const studentList = Array.isArray(data)
      ? data
      : data && typeof data === 'object'
        ? [data]
        : [];

    // Display only approved students
    const approvedStudents = studentList.filter(
      (student) =>
        (student.status ?? student.Status)?.toUpperCase() === 'APPROVED'
    );

    setStudents(approvedStudents);
  } catch (err) {
    console.error('Student fetch error:', err);

    setError('Unable to load approved students.');
  } finally {
    setLoading(false);
  }
};

const fetchAttendance = async () => {
try {
const response = await api.get(
`/attendance/date/${attendanceDate}`
);

  const records = Array.isArray(response.data)
    ? response.data
    : [];

  const attendanceMap = {};

  records.forEach((record) => {
    const studentId = record.student?.id ?? record.studentId;

    if (studentId != null) {
      attendanceMap[studentId] = record.status;
    }
  });

  setAttendance(attendanceMap);
} catch (err) {
  console.error('Attendance fetch error:', err);
  setError('Unable to load attendance records.');
}

};

const handleStatusChange = (studentId, status) => {
setAttendance((previous) => ({
...previous,
[studentId]: status
}));

setMessage('');

};

const handleSaveAttendance = async () => {
try {
setSaving(true);
setError('');
setMessage('');


  const studentsToSave = students.filter(
    (student) => attendance[student.id]
  );

  if (studentsToSave.length === 0) {
    setError('Please select Present or Absent for at least one student.');
    return;
  }

  for (const student of studentsToSave) {
    await api.post('/attendance/mark', {
      studentId: student.id,
      attendanceDate,
      status: attendance[student.id]
    });
  }

  setMessage('Attendance saved successfully!');
  await fetchAttendance();
} catch (err) {
  console.error(
    'Save attendance error:',
    err.response?.data || err.message
  );

  setError(
    err.response?.data?.detail ||
    err.response?.data?.message ||
    'Failed to save attendance. Please try again.'
  );
} finally {
  setSaving(false);
}


};

return ( <div className="attendance-page"> <div className="attendance-header"> <div> <h1>Attendance Management</h1> <p>View students and record daily attendance.</p> </div>

    <button
      className="attendance-refresh"
      onClick={() => {
        fetchStudents();
        fetchAttendance();
      }}
    >
      Refresh
    </button>
  </div>

  <div className="attendance-toolbar">
    <label htmlFor="attendanceDate">Attendance Date</label>

    <input
      id="attendanceDate"
      type="date"
      value={attendanceDate}
      max={new Date().toLocaleDateString('en-CA')}
      onChange={(event) => setAttendanceDate(event.target.value)}
    />
  </div>

  {loading && <p>Loading students...</p>}

  {error && <div className="attendance-error">{error}</div>}

  {message && (
    <div className="attendance-success">{message}</div>
  )}

  {!loading && (
    <>
      <div className="attendance-summary">
        <div>
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </div>

        <div>
          <span>Present</span>
          <strong>
            {
              Object.values(attendance).filter(
                (status) => status === 'PRESENT'
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Absent</span>
          <strong>
            {
              Object.values(attendance).filter(
                (status) => status === 'ABSENT'
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="attendance-table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Attendance Status</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.rollNo}</td>
                  <td>{student.department}</td>

                  <td>
                    <div className="attendance-options">
                      <label>
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          checked={
                            attendance[student.id] === 'PRESENT'
                          }
                          onChange={() =>
                            handleStatusChange(
                              student.id,
                              'PRESENT'
                            )
                          }
                        />
                        Present
                      </label>

                      <label>
                        <input
                          type="radio"
                          name={`attendance-${student.id}`}
                          checked={
                            attendance[student.id] === 'ABSENT'
                          }
                          onChange={() =>
                            handleStatusChange(
                              student.id,
                              'ABSENT'
                            )
                          }
                        />
                        Absent
                      </label>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="attendance-empty">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        className="attendance-save"
        onClick={handleSaveAttendance}
        disabled={saving || students.length === 0}
      >
        {saving ? 'Saving...' : 'Save Attendance'}
      </button>
    </>
  )}
</div>

);
}

export default Attendance;
