import { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Results.css';

const initialForm = {
studentId: '',
subject: '',
examName: '',
marksObtained: '',
maximumMarks: '100',
passMarks: '40'
};

function Results() {
const [results, setResults] = useState([]);
const [students, setStudents] = useState([]);
const [form, setForm] = useState(initialForm);
const [editingId, setEditingId] = useState(null);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState('');
const [message, setMessage] = useState('');

useEffect(() => {
loadData();
}, []);

const loadData = async () => {
setLoading(true);
setError('');


try {
  const [resultsResponse, studentsResponse] = await Promise.all([
    api.get('/results'),
    api.get('/students/getall')
  ]);

  const resultData = resultsResponse.data;
  const studentData = studentsResponse.data;

  setResults(Array.isArray(resultData) ? resultData : []);

  const studentList = Array.isArray(studentData)
    ? studentData
    : studentData && typeof studentData === 'object'
      ? [studentData]
      : [];

  setStudents(
    studentList.filter(
      student =>
        (student.status ?? student.Status)?.toUpperCase() === 'APPROVED'
    )
  );
} catch (err) {
  console.error('Results loading error:', err);
  setError(
    err.response?.data?.detail ||
    err.response?.data?.message ||
    'Unable to load results or approved students.'
  );
} finally {
  setLoading(false);
}


};

const handleChange = event => {
const { name, value } = event.target;

setForm(previous => ({
  ...previous,
  [name]: value
}));

setError('');
setMessage('');


};

const resetForm = () => {
setForm(initialForm);
setEditingId(null);
setError('');
setMessage('');
};

const handleSubmit = async event => {
event.preventDefault();


setError('');
setMessage('');

const studentId = Number(form.studentId);
const marksObtained = Number(form.marksObtained);
const maximumMarks = Number(form.maximumMarks);
const passMarks = Number(form.passMarks);

if (
  !form.studentId ||
  !form.subject.trim() ||
  !form.examName.trim() ||
  form.marksObtained === '' ||
  form.maximumMarks === '' ||
  form.passMarks === ''
) {
  setError('Please fill in all fields.');
  return;
}

if (
  !Number.isFinite(marksObtained) ||
  !Number.isFinite(maximumMarks) ||
  !Number.isFinite(passMarks) ||
  maximumMarks <= 0 ||
  marksObtained < 0 ||
  marksObtained > maximumMarks ||
  passMarks < 0 ||
  passMarks > maximumMarks
) {
  setError('Enter valid marks within the maximum marks.');
  return;
}

const payload = {
  studentId,
  subject: form.subject.trim(),
  examName: form.examName.trim(),
  marksObtained,
  maximumMarks,
  passMarks
};

try {
  setSaving(true);

  if (editingId !== null) {
    await api.put(`/results/${editingId}`, payload);
    setMessage('Result updated successfully.');
  } else {
    await api.post('/results', payload);
    setMessage('Result added successfully.');
  }

  setForm(initialForm);
  setEditingId(null);

  await loadResults();
} catch (err) {
  console.error('Save result error:', err);

  setError(
    err.response?.data?.detail ||
    err.response?.data?.message ||
    'Unable to save result.'
  );
} finally {
  setSaving(false);
}


};

const loadResults = async () => {
const response = await api.get('/results');
setResults(Array.isArray(response.data) ? response.data : []);
};

const handleEdit = result => {
setEditingId(result.id);


setForm({
  studentId: String(result.student?.id ?? result.studentId ?? ''),
  subject: result.subject ?? '',
  examName: result.examName ?? '',
  marksObtained: String(result.marksObtained ?? ''),
  maximumMarks: String(result.maximumMarks ?? '100'),
  passMarks: String(result.passMarks ?? '40')
});

setError('');
setMessage('');

window.scrollTo({
  top: 0,
  behavior: 'smooth'
});


};

const handleDelete = async resultId => {
const confirmed = window.confirm(
'Are you sure you want to delete this result?'
);


if (!confirmed) return;

try {
  setError('');
  setMessage('');

  await api.delete(`/results/${resultId}`);

  setResults(previous =>
    previous.filter(result => result.id !== resultId)
  );

  if (editingId === resultId) {
    resetForm();
  }

  setMessage('Result deleted successfully.');
} catch (err) {
  console.error('Delete result error:', err);

  setError(
    err.response?.data?.detail ||
    err.response?.data?.message ||
    'Unable to delete result.'
  );
}

};

const getStudentName = result => {
const studentId = result.student?.id ?? result.studentId;


const student = students.find(
  item => String(item.id) === String(studentId)
);

return result.student?.name ?? student?.name ?? `Student ${studentId ?? ''}`;

};

const getPercentage = result => {
const marks = Number(result.marksObtained);
const maximum = Number(result.maximumMarks);

if (maximum <= 0) return 0;

return Number(((marks / maximum) * 100).toFixed(2));


};

const getResultStatus = result => {
return Number(result.marksObtained) >= Number(result.passMarks)
? 'PASS'
: 'FAIL';
};

return ( <div className="results-page"> <header className="results-header"> <div> <h1>Results Management</h1> <p>Manage examination marks and student results.</p> </div>

    <button
      type="button"
      className="results-refresh"
      onClick={loadData}
      disabled={loading}
    >
      Refresh
    </button>
  </header>

  {error && <div className="results-alert error">{error}</div>}
  {message && <div className="results-alert success">{message}</div>}

  <section className="result-form-card">
    <h2>{editingId !== null ? 'Update Result' : 'Add Student Result'}</h2>

    <form onSubmit={handleSubmit}>
      <div className="result-form-grid">
        <div className="result-field">
          <label htmlFor="studentId">Approved Student</label>

          <select
            id="studentId"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            disabled={editingId !== null}
            required
          >
            <option value="">Select a student</option>

            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} — {student.rollNo}
              </option>
            ))}
          </select>

          {!loading && students.length === 0 && (
            <small>No approved students available.</small>
          )}
        </div>

        <div className="result-field">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            maxLength={100}
            placeholder="e.g. Java Programming"
            required
          />
        </div>

        <div className="result-field">
          <label htmlFor="examName">Examination</label>
          <input
            id="examName"
            name="examName"
            value={form.examName}
            onChange={handleChange}
            maxLength={100}
            placeholder="e.g. Mid Semester"
            required
          />
        </div>

        <div className="result-field">
          <label htmlFor="marksObtained">Marks Obtained</label>
          <input
            id="marksObtained"
            name="marksObtained"
            type="number"
            min="0"
            step="any"
            value={form.marksObtained}
            onChange={handleChange}
            required
          />
        </div>

        <div className="result-field">
          <label htmlFor="maximumMarks">Maximum Marks</label>
          <input
            id="maximumMarks"
            name="maximumMarks"
            type="number"
            min="0.01"
            step="any"
            value={form.maximumMarks}
            onChange={handleChange}
            required
          />
        </div>

        <div className="result-field">
          <label htmlFor="passMarks">Pass Marks</label>
          <input
            id="passMarks"
            name="passMarks"
            type="number"
            min="0"
            step="any"
            value={form.passMarks}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="result-form-actions">
        <button
          type="submit"
          className="result-submit"
          disabled={saving || loading || students.length === 0}
        >
          {saving
            ? 'Saving...'
            : editingId !== null
              ? 'Update Result'
              : 'Save Result'}
        </button>

        {editingId !== null && (
          <button
            type="button"
            className="result-cancel"
            onClick={resetForm}
            disabled={saving}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  </section>

  <section className="result-list-section">
    <h2>Student Results</h2>

    {loading ? (
      <p>Loading results...</p>
    ) : (
      <div className="results-table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Subject</th>
              <th>Exam</th>
              <th>Marks</th>
              <th>Percentage</th>
              <th>Result</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {results.length > 0 ? (
              results.map(result => {
                const percentage = getPercentage(result);
                const status = getResultStatus(result);

                return (
                  <tr key={result.id}>
                    <td>{result.id}</td>
                    <td>{getStudentName(result)}</td>
                    <td>{result.subject}</td>
                    <td>{result.examName}</td>
                    <td>
                      {result.marksObtained} / {result.maximumMarks}
                    </td>
                    <td>{percentage}%</td>
                    <td>
                      <span
                        className={`result-status ${status.toLowerCase()}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td>
                      <div className="result-actions">
                        <button
                          type="button"
                          className="result-edit"
                          onClick={() => handleEdit(result)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="result-delete"
                          onClick={() => handleDelete(result.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="results-empty">
                  No results available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )}
  </section>
</div>
);
}

export default Results;
