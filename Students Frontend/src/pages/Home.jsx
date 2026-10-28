
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    pendingStudents: 0,
    pendingTeachers: 0,
  });

  const [loginRole, setLoginRole] = useState("STUDENT");
  const [registerRole, setRegisterRole] = useState("STUDENT");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    loadOrganizationStats();
  }, []);

  const loadOrganizationStats = async () => {
    try {
      const results = await Promise.allSettled([
        api.get("/students/getall"),
        api.get("/teachers"),
        api.get("/admin/pending-students"),
        api.get("/admin/pending-teachers"),
      ]);

      setStats({
        students:
          results[0].status === "fulfilled" &&
          Array.isArray(results[0].value.data)
            ? results[0].value.data.length
            : 0,

        teachers:
          results[1].status === "fulfilled" &&
          Array.isArray(results[1].value.data)
            ? results[1].value.data.length
            : 0,

        pendingStudents:
          results[2].status === "fulfilled" &&
          Array.isArray(results[2].value.data)
            ? results[2].value.data.length
            : 0,

        pendingTeachers:
          results[3].status === "fulfilled" &&
          Array.isArray(results[3].value.data)
            ? results[3].value.data.length
            : 0,
      });
    } catch (error) {
      console.error("Unable to load organization statistics:", error);
    }
  };

  const handleLogin = () => {
    if (loginRole === "ADMIN") {
      navigate("/login?role=ADMIN");
    } else if (loginRole === "TEACHER") {
      navigate("/login?role=TEACHER");
    } else {
      navigate("/login?role=STUDENT");
    }
  };

  const handleRegister = () => {
    if (registerRole === "STUDENT") {
      navigate("/register?role=STUDENT");
    } else {
      navigate("/register?role=TEACHER");
    }
  };

  const facilities = [
    {
      icon: "📚",
      title: "Digital Library",
      description:
        "Access learning resources, academic materials, and reference books.",
    },
    {
      icon: "💻",
      title: "Computer Laboratories",
      description:
        "Develop technical skills with practical learning and computing facilities.",
    },
    {
      icon: "🏫",
      title: "Smart Classrooms",
      description:
        "Support interactive teaching and an engaging learning environment.",
    },
    {
      icon: "⚽",
      title: "Sports & Recreation",
      description:
        "Encourage teamwork, physical fitness, and extracurricular activities.",
    },
  ];

  const activities = [
    {
      icon: "📢",
      title: "Organization Announcements",
      description:
        "Stay informed about important notices and academic updates.",
    },
    {
      icon: "🎓",
      title: "Academic Activities",
      description:
        "Follow examinations, academic schedules, and learning activities.",
    },
    {
      icon: "🤝",
      title: "Events & Workshops",
      description:
        "Participate in workshops, events, and skill-development programs.",
    },
  ];

  return (
    <div className="org-home">
      {/* NAVBAR */}
      <header className="org-navbar">
        <a className="org-brand" href="#home">
          <span className="org-brand-icon">S</span>
          <span>
            <strong>Smart Campus</strong>
            <small>Student Management System</small>
          </span>
        </a>

        <nav className="org-nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#facilities">Facilities</a>
          <a href="#activities">Activities</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="org-nav-actions">
          <button
            className="org-btn org-btn-outline"
            onClick={() => {
              setShowLogin(!showLogin);
              setShowRegister(false);
            }}
          >
            Login
          </button>

          <button
            className="org-btn org-btn-primary"
            onClick={() => {
              setShowRegister(!showRegister);
              setShowLogin(false);
            }}
          >
            Register
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="org-hero" id="home">
        <div className="org-hero-content">
          <span className="org-eyebrow">
            WELCOME TO OUR CAMPUS
          </span>

          <h1>
            One Campus.
            <br />
            <span>One Connected Community.</span>
          </h1>

          <p>
            A unified digital platform connecting students, teachers,
            and administrators to academic information, campus facilities,
            and organizational activities.
          </p>

          <div className="org-hero-actions">
            <button
              className="org-btn org-btn-light"
              onClick={() => {
                setShowLogin(true);
                setShowRegister(false);
                document
                  .getElementById("access")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Access Your Dashboard →
            </button>

            <a className="org-hero-link" href="#facilities">
              Explore Campus ↓
            </a>
          </div>

          <div className="org-hero-note">
            <span className="org-status-dot"></span>
            A connected platform for the entire organization
          </div>
        </div>

        <div className="org-hero-visual">
          <div className="org-visual-card org-visual-main">
            <div className="org-visual-top">
              <span>Campus Overview</span>
              <span className="org-live-badge">LIVE DATA</span>
            </div>

            <div className="org-visual-number">
              {stats.students + stats.teachers}
            </div>

            <p>Students & Teachers</p>

            <div className="org-visual-divider"></div>

            <div className="org-visual-row">
              <span>🎓 Students</span>
              <strong>{stats.students}</strong>
            </div>

            <div className="org-visual-row">
              <span>👨‍🏫 Teachers</span>
              <strong>{stats.teachers}</strong>
            </div>
          </div>

          <div className="org-floating-card org-floating-one">
            <span>📖</span>
            <div>
              <strong>Learning</strong>
              <small>Academic resources</small>
            </div>
          </div>

          <div className="org-floating-card org-floating-two">
            <span>🏆</span>
            <div>
              <strong>Activities</strong>
              <small>Campus engagement</small>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="org-stats-section">
        <div className="org-stat-item">
          <span className="org-stat-icon">🎓</span>
          <div>
            <strong>{stats.students}</strong>
            <p>Registered Students</p>
          </div>
        </div>

        <div className="org-stat-item">
          <span className="org-stat-icon">👨‍🏫</span>
          <div>
            <strong>{stats.teachers}</strong>
            <p>Teachers</p>
          </div>
        </div>

        <div className="org-stat-item">
          <span className="org-stat-icon">📝</span>
          <div>
            <strong>{stats.pendingStudents}</strong>
            <p>Pending Student Approvals</p>
          </div>
        </div>

        <div className="org-stat-item">
          <span className="org-stat-icon">⏳</span>
          <div>
            <strong>{stats.pendingTeachers}</strong>
            <p>Pending Teacher Approvals</p>
          </div>
        </div>
      </section>

      {/* LOGIN AND REGISTRATION */}
      <section className="org-access-section" id="access">
        <div className="org-section-heading">
          <span className="org-eyebrow">YOUR CAMPUS, YOUR SPACE</span>
          <h2>Access Your Portal</h2>
          <p>
            Choose your role to access the appropriate portal.
          </p>
        </div>

        <div className="org-role-grid">
          <article className="org-role-card">
            <div className="org-role-icon student-icon">🎓</div>
            <h3>Student Portal</h3>
            <p>
              View your profile, attendance, examination results,
              and fee information.
            </p>
            <button
              className="org-btn org-btn-primary org-full-btn"
              onClick={() => {
                setLoginRole("STUDENT");
                setShowLogin(true);
                setShowRegister(false);
              }}
            >
              Student Login →
            </button>
            <button
              className="org-text-btn"
              onClick={() => {
                setRegisterRole("STUDENT");
                setShowRegister(true);
                setShowLogin(false);
              }}
            >
              New student? Register
            </button>
          </article>

          <article className="org-role-card">
            <div className="org-role-icon teacher-icon">👨‍🏫</div>
            <h3>Teacher Portal</h3>
            <p>
              Access academic information, attendance tools,
              and student results.
            </p>
            <button
              className="org-btn org-btn-primary org-full-btn"
              onClick={() => {
                setLoginRole("TEACHER");
                setShowLogin(true);
                setShowRegister(false);
              }}
            >
              Teacher Login →
            </button>
            <button
              className="org-text-btn"
              onClick={() => {
                setRegisterRole("TEACHER");
                setShowRegister(true);
                setShowLogin(false);
              }}
            >
              New teacher? Register
            </button>
          </article>

          <article className="org-role-card">
            <div className="org-role-icon admin-icon">🛡️</div>
            <h3>Admin Portal</h3>
            <p>
              Manage registrations, students, teachers,
              attendance, results, and fees.
            </p>
            <button
              className="org-btn org-btn-dark org-full-btn"
              onClick={() => {
                setLoginRole("ADMIN");
                setShowLogin(true);
                setShowRegister(false);
              }}
            >
              Admin Login →
            </button>
            <span className="org-admin-note">
              System-configured administrator account
            </span>
          </article>
        </div>

        {showLogin && (
          <div className="org-access-form">
            <button
              className="org-close-btn"
              onClick={() => setShowLogin(false)}
              aria-label="Close login options"
            >
              ×
            </button>

            <h3>Continue to Login</h3>
            <p>Select your account type to continue.</p>

            <label htmlFor="org-login-role">Account Type</label>
            <select
              id="org-login-role"
              value={loginRole}
              onChange={(event) => setLoginRole(event.target.value)}
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="ADMIN">Admin</option>
            </select>

            <button
              className="org-btn org-btn-primary org-full-btn"
              onClick={handleLogin}
            >
              Continue to Login →
            </button>
          </div>
        )}

        {showRegister && (
          <div className="org-access-form">
            <button
              className="org-close-btn"
              onClick={() => setShowRegister(false)}
              aria-label="Close registration options"
            >
              ×
            </button>

            <h3>Create Your Account</h3>
            <p>Choose the type of account you want to register.</p>

            <label htmlFor="org-register-role">Account Type</label>
            <select
              id="org-register-role"
              value={registerRole}
              onChange={(event) => setRegisterRole(event.target.value)}
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>

            <button
              className="org-btn org-btn-primary org-full-btn"
              onClick={handleRegister}
            >
              Continue to Registration →
            </button>

            <small className="org-form-note">
              Admin registration is disabled. Use the existing
              system-configured admin account.
            </small>
          </div>
        )}
      </section>

      {/* ABOUT */}
      <section className="org-about-section" id="about">
        <div className="org-about-visual">
          <div className="org-about-symbol">S</div>
          <span>SMART CAMPUS</span>
          <strong>Learning. Managing. Growing.</strong>
        </div>

        <div className="org-about-content">
          <span className="org-eyebrow">ABOUT OUR PLATFORM</span>
          <h2>Everything Connected in One Place</h2>
          <p>
            The Smart Student Management System brings the organization's
            academic operations together in one platform. Students,
            teachers, and administrators can access the information and
            tools relevant to their responsibilities.
          </p>

          <div className="org-about-feature">
            <span>✓</span>
            <div>
              <strong>Centralized Information</strong>
              <p>Academic and organizational information in one place.</p>
            </div>
          </div>

          <div className="org-about-feature">
            <span>✓</span>
            <div>
              <strong>Role-Specific Portals</strong>
              <p>Dedicated experiences for students, teachers, and admins.</p>
            </div>
          </div>

          <div className="org-about-feature">
            <span>✓</span>
            <div>
              <strong>Connected Academic Operations</strong>
              <p>Attendance, results, and fee management tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="org-facilities-section" id="facilities">
        <div className="org-section-heading">
          <span className="org-eyebrow">CAMPUS RESOURCES</span>
          <h2>Facilities for Better Learning</h2>
          <p>
            Resources designed to support learning, development,
            and campus life.
          </p>
        </div>

        <div className="org-facility-grid">
          {facilities.map((facility) => (
            <article className="org-facility-card" key={facility.title}>
              <div className="org-facility-icon">{facility.icon}</div>
              <h3>{facility.title}</h3>
              <p>{facility.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="org-activities-section" id="activities">
        <div className="org-section-heading">
          <span className="org-eyebrow">CAMPUS LIFE</span>
          <h2>Activities & Announcements</h2>
          <p>
            Stay connected with academic activities and campus updates.
          </p>
        </div>

        <div className="org-activity-grid">
          {activities.map((activity) => (
            <article className="org-activity-card" key={activity.title}>
              <span>{activity.icon}</span>
              <div>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="org-demo-notice">
          These are informational sections. Live announcements and event
          management can be connected to the backend in a later step.
        </p>
      </section>

      {/* CONTACT */}
      <section className="org-contact-section" id="contact">
        <div>
          <span className="org-eyebrow">STAY CONNECTED</span>
          <h2>One Platform. Three Portals. One Community.</h2>
          <p>
            Access the information and tools you need through your
            dedicated campus portal.
          </p>
        </div>

        <button
          className="org-btn org-btn-light"
          onClick={() => {
            setShowLogin(true);
            setShowRegister(false);
            document
              .getElementById("access")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Get Started →
        </button>
      </section>

      {/* FOOTER */}
      <footer className="org-footer">
        <a className="org-brand org-footer-brand" href="#home">
          <span className="org-brand-icon">S</span>
          <span>
            <strong>Smart Campus</strong>
            <small>Student Management System</small>
          </span>
        </a>

        <p>
          © {new Date().getFullYear()} Smart Campus. All rights reserved.
        </p>

        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
};

export default Home;

