import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
const [stats, setStats] = useState({
totalStudents: 0,
totalTeachers: 0,
pendingStudents: 0,
pendingTeachers: 0
});

const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
fetchDashboardData();
}, []);

const fetchDashboardData = async () => {
try {
setLoading(true);
setError('');


  const [
    studentsResponse,
    teachersResponse,
    pendingStudentsResponse,
    pendingTeachersResponse
  ] = await Promise.all([
    api.get('/students/getall'),
    api.get('/teachers'),
    api.get('/admin/pending-students'),
    api.get('/admin/pending-teachers')
  ]);

  const students = Array.isArray(studentsResponse.data)
    ? studentsResponse.data
    : studentsResponse.data
      ? [studentsResponse.data]
      : [];

  const teachers = Array.isArray(teachersResponse.data)
    ? teachersResponse.data
    : teachersResponse.data
      ? [teachersResponse.data]
      : [];

  const pendingStudents = Array.isArray(pendingStudentsResponse.data)
    ? pendingStudentsResponse.data
    : [];

  const pendingTeachers = Array.isArray(pendingTeachersResponse.data)
    ? pendingTeachersResponse.data
    : [];

  setStats({
    totalStudents: students.length,
    totalTeachers: teachers.length,
    pendingStudents: pendingStudents.length,
    pendingTeachers: pendingTeachers.length
  });
} catch (err) {
  console.error('Dashboard API error:', err);
  setError('Unable to load dashboard statistics.');
} finally {
  setLoading(false);
}


};

const cards = [
{ title: 'Total Students', value: stats.totalStudents },
{ title: 'Total Teachers', value: stats.totalTeachers },
{ title: 'Pending Students', value: stats.pendingStudents },
{ title: 'Pending Teachers', value: stats.pendingTeachers }
];

return ( <div className="dashboard-container"> <aside className="dashboard-sidebar"> <h2>SMS</h2>

    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/students">Students</Link>
      <Link to="/teachers">Teachers</Link>
      <Link to="/registration-approve">Registration Approval</Link>
      <Link to="/attendance">Attendance</Link>
      <Link to="/results">Results</Link>
      <Link to="/fees">Fee Management</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  </aside>

  <main className="dashboard-main">
    <header className="dashboard-header">
      <div>
        <h1>Admin Dashboard</h1>
        <span>Smart Student Management System</span>
      </div>

      <button
        className="dashboard-refresh"
        onClick={fetchDashboardData}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Refresh'}
      </button>
    </header>

    {error && <p className="dashboard-error">{error}</p>}

    <section className="dashboard-cards">
      {cards.map((card) => (
        <div className="dashboard-card" key={card.title}>
          <h3>{card.title}</h3>
          <p>{loading ? '...' : card.value}</p>
        </div>
      ))}
    </section>

    <section className="dashboard-quick-links">
      <h2>Quick Access</h2>

      <Link to="/students">Manage Students</Link>
      <Link to="/teachers">Manage Teachers</Link>
      <Link to="/registration-approve">Approve Registrations</Link>
      <Link to="/attendance">Manage Attendance</Link>
      <Link to="/results">Manage Results</Link>
      <Link to="/fees">Manage Fees</Link>
    </section>
  </main>
</div>
);
};

export default Dashboard;
