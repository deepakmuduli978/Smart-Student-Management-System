
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /*
   * Temporary development ID.
   * Replace this with the authenticated student's ID
   * when Spring Security is implemented.
   */
  const STUDENT_ID = 1;

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(
        `/student-dashboard/${STUDENT_ID}`
      );

      setDashboard(response.data);
    } catch (err) {
      console.error('Student dashboard error:', err);

      setError(
        err.response?.data?.message ||
        'Unable to load student information. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = amount => {
    return `₹${Number(amount ?? 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const attendancePercentage = Math.min(
    100,
    Math.max(0, Number(dashboard?.attendancePercentage ?? 0))
  );

  const averagePercentage = Number(
    dashboard?.averagePercentage ?? 0
  );

  const totalAttendance = Number(
    dashboard?.totalAttendance ?? 0
  );

  const presentAttendance = Number(
    dashboard?.presentAttendance ?? 0
  );

  const absentAttendance = Math.max(
    0,
    totalAttendance - presentAttendance
  );

  if (loading) {
    return (
      <div className="student-dashboard-state">
        <div className="student-loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="student-dashboard-state">
        <div className="student-error-card">
          <h2>Unable to Load Dashboard</h2>
          <p>{error || 'Student information is unavailable.'}</p>

          <button onClick={fetchDashboard}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">

      {/* SIDEBAR */}
      <aside className="student-sidebar">

        <div className="student-brand">
          <div className="student-brand-icon">S</div>

          <div>
            <h2>SMS</h2>
            <p>Student Portal</p>
          </div>
        </div>

        <div className="student-sidebar-label">
          MY WORKSPACE
        </div>

        <nav className="student-nav">

          <Link
            to="/student-dashboard"
            className="student-nav-active"
          >
            <span className="student-nav-icon">▦</span>
            Dashboard
          </Link>

          <Link to="/student-profile">
            <span className="student-nav-icon">♙</span>
            My Profile
          </Link>

          <Link to="/student-attendance">
            <span className="student-nav-icon">◷</span>
            My Attendance
          </Link>

          <Link to="/student-results">
            <span className="student-nav-icon">▤</span>
            My Results
          </Link>

          <Link to="/student-fees">
            <span className="student-nav-icon">₹</span>
            My Fees
          </Link>

        </nav>

        <div className="student-sidebar-footer">
          <div className="student-footer-avatar">
            {(dashboard.name || 'S').charAt(0).toUpperCase()}
          </div>

          <div className="student-footer-info">
            <strong>{dashboard.name || 'Student'}</strong>
            <span>Student Account</span>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="student-dashboard-main">

        {/* HEADER */}
        <header className="student-dashboard-header">

          <div>
            <div className="student-breadcrumb">
              Student Portal / Dashboard
            </div>

            <h1>My Dashboard</h1>

            <p>
              Welcome back! Here is your academic overview.
            </p>
          </div>

          <button
            className="student-refresh-btn"
            onClick={fetchDashboard}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </header>

        {/* WELCOME CARD */}
        <section className="student-welcome-card">

          <div className="student-welcome-content">

            <span className="student-welcome-label">
              STUDENT OVERVIEW
            </span>

            <h2>
              Hello, {dashboard.name || 'Student'}!
            </h2>

            <p>
              Keep track of your attendance, academic performance,
              and fee information in one place.
            </p>

            <div className="student-welcome-details">
              <span>
                Roll No: {dashboard.rollNo || 'N/A'}
              </span>

              <span>
                {dashboard.course || 'Course not specified'}
              </span>

              <span>
                Semester {dashboard.semester ?? 'N/A'}
              </span>
            </div>

          </div>

          <div className="student-welcome-avatar">
            {(dashboard.name || 'S').charAt(0).toUpperCase()}
          </div>

        </section>

        {/* STUDENT PROFILE */}
        <section className="student-profile-section">

          <div className="student-section-heading">
            <div>
              <h2>My Profile</h2>
              <p>Your registered academic information</p>
            </div>

            <Link to="/student-profile">
              View Details →
            </Link>
          </div>

          <div className="student-profile-grid">

            <article className="student-profile-item">
              <span>Full Name</span>
              <strong>{dashboard.name || 'N/A'}</strong>
            </article>

            <article className="student-profile-item">
              <span>Email Address</span>
              <strong>{dashboard.email || 'N/A'}</strong>
            </article>

            <article className="student-profile-item">
              <span>Roll Number</span>
              <strong>{dashboard.rollNo || 'N/A'}</strong>
            </article>

            <article className="student-profile-item">
              <span>Department</span>
              <strong>{dashboard.department || 'N/A'}</strong>
            </article>

            <article className="student-profile-item">
              <span>Course</span>
              <strong>{dashboard.course || 'N/A'}</strong>
            </article>

            <article className="student-profile-item">
              <span>Registration Status</span>

              <span
                className={`student-status-badge ${
                  (dashboard.status || '').toLowerCase()
                }`}
              >
                {dashboard.status || 'UNKNOWN'}
              </span>
            </article>

          </div>

        </section>

        {/* SUMMARY CARDS */}
        <section className="student-summary-grid">

          {/* ATTENDANCE */}
          <article className="student-summary-card attendance-summary">

            <div className="student-summary-top">
              <div>
                <p>Attendance</p>
                <h2>{attendancePercentage.toFixed(1)}%</h2>
              </div>

              <div className="student-summary-icon">
                ◷
              </div>
            </div>

            <div className="student-progress-track">
              <div
                className="student-progress-fill attendance-fill"
                style={{
                  width: `${attendancePercentage}%`
                }}
              ></div>
            </div>

            <div className="student-summary-footer">
              {presentAttendance} present out of {totalAttendance} classes
            </div>

            <Link to="/student-attendance">
              View Attendance →
            </Link>

          </article>

          {/* RESULTS */}
          <article className="student-summary-card results-summary">

            <div className="student-summary-top">
              <div>
                <p>Average Result</p>
                <h2>{averagePercentage.toFixed(2)}%</h2>
              </div>

              <div className="student-summary-icon">
                ▤
              </div>
            </div>

            <div className="student-summary-description">
              {dashboard.totalSubjects ?? 0} result records available
            </div>

            <div className="student-summary-footer">
              Academic performance overview
            </div>

            <Link to="/student-results">
              View Results →
            </Link>

          </article>

          {/* PAID FEES */}
          <article className="student-summary-card paid-summary">

            <div className="student-summary-top">
              <div>
                <p>Total Paid</p>
                <h2>{formatMoney(dashboard.paidFees)}</h2>
              </div>

              <div className="student-summary-icon">
                ✓
              </div>
            </div>

            <div className="student-summary-description">
              Total fees: {formatMoney(dashboard.totalFees)}
            </div>

            <div className="student-summary-footer">
              Recorded payments
            </div>

            <Link to="/student-fees">
              View Fee Details →
            </Link>

          </article>

          {/* PENDING FEES */}
          <article className="student-summary-card pending-summary">

            <div className="student-summary-top">
              <div>
                <p>Pending Fees</p>
                <h2>{formatMoney(dashboard.pendingFees)}</h2>
              </div>

              <div className="student-summary-icon">
                ₹
              </div>
            </div>

            <div className="student-summary-description">
              Outstanding fee balance
            </div>

            <div className="student-summary-footer">
              Contact administration for payment assistance.
            </div>

            <Link to="/student-fees">
              View Fee Details →
            </Link>

          </article>

        </section>

        {/* ATTENDANCE OVERVIEW */}
        <section className="student-attendance-section">

          <div className="student-section-heading">
            <div>
              <h2>Attendance Overview</h2>
              <p>Summary of your recorded attendance</p>
            </div>

            <Link to="/student-attendance">
              View Records →
            </Link>
          </div>

          <div className="student-attendance-stats">

            <div className="student-attendance-stat">
              <span className="attendance-stat-dot present-dot"></span>

              <div>
                <p>Present</p>
                <h3>{presentAttendance}</h3>
              </div>
            </div>

            <div className="student-attendance-stat">
              <span className="attendance-stat-dot absent-dot"></span>

              <div>
                <p>Absent</p>
                <h3>{absentAttendance}</h3>
              </div>
            </div>

            <div className="student-attendance-stat">
              <span className="attendance-stat-dot total-dot"></span>

              <div>
                <p>Total Classes</p>
                <h3>{totalAttendance}</h3>
              </div>
            </div>

          </div>

        </section>

        {/* QUICK ACCESS */}
        <section className="student-quick-access">

          <div className="student-section-heading">
            <div>
              <h2>Academic Information</h2>
              <p>Quick access to your personal records</p>
            </div>
          </div>

          <div className="student-quick-access-grid">

            <Link to="/student-profile">
              <span className="quick-access-icon profile-quick-icon">
                ♙
              </span>

              <div>
                <strong>My Profile</strong>
                <p>View registered details</p>
              </div>

              <span className="student-quick-arrow">→</span>
            </Link>

            <Link to="/student-attendance">
              <span className="quick-access-icon attendance-quick-icon">
                ◷
              </span>

              <div>
                <strong>My Attendance</strong>
                <p>View attendance records</p>
              </div>

              <span className="student-quick-arrow">→</span>
            </Link>

            <Link to="/student-results">
              <span className="quick-access-icon results-quick-icon">
                ▤
              </span>

              <div>
                <strong>My Results</strong>
                <p>View marks and results</p>
              </div>

              <span className="student-quick-arrow">→</span>
            </Link>

            <Link to="/student-fees">
              <span className="quick-access-icon fees-quick-icon">
                ₹
              </span>

              <div>
                <strong>My Fees</strong>
                <p>View fee information</p>
              </div>

              <span className="student-quick-arrow">→</span>
            </Link>

          </div>

        </section>

        <footer className="student-dashboard-footer">
          Smart Student Management System · Student Portal
        </footer>

      </main>
    </div>
  );
};

export default StudentDashboard;
