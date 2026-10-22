import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./VolunteerDashboard.css";

const opportunities = [
  {
    id: 1,
    title: "Community Food Bank",
    category: "Community",
    location: "Edinburgh",
    date: "28 October 2026",
    hours: 4,
  },
  {
    id: 2,
    title: "Park Clean-Up",
    category: "Environment",
    location: "Glasgow",
    date: "2 November 2026",
    hours: 3,
  },
  {
    id: 3,
    title: "Youth Mentoring",
    category: "Education",
    location: "Edinburgh",
    date: "8 November 2026",
    hours: 2,
  },
  {
    id: 4,
    title: "Charity Fundraiser",
    category: "Community",
    location: "Dundee",
    date: "12 November 2026",
    hours: 5,
  },
];

function VolunteerDashboard() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [applications, setApplications] = useState([]);
  const [completedHours, setCompletedHours] = useState(0);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Welcome to VolunteerHub!",
      read: false,
    },
  ]);

  const username = "Volunteer";
  const hoursGoal = 20;

  // Filter opportunities by search and category
  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch =
      opportunity.title.toLowerCase().includes(search.toLowerCase()) ||
      opportunity.location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || opportunity.category === category;

    return matchesSearch && matchesCategory;
  });

  // Count unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  // Apply for an opportunity

  // Apply for an opportunity
  function handleApply(opportunity) {
    const alreadyApplied = applications.some(
      (application) => application.opportunityId === opportunity.id,
    );

    if (alreadyApplied) return;

    const newApplication = {
      id: crypto.randomUUID(),
      opportunityId: opportunity.id,
      title: opportunity.title,
      location: opportunity.location,
      date: opportunity.date,
      status: "Pending",
    };

    setApplications((previous) => [...previous, newApplication]);

    setNotifications((previous) => [
      {
        id: crypto.randomUUID(),
        message: `Application submitted for ${opportunity.title}.`,
        read: false,
      },
      ...previous,
    ]);
  }

  // Demo hours update
  function addVolunteerHours() {
    setCompletedHours((previous) => previous + 1);
  }

  function handleLogout() {
    navigate("/");
  }

  function markNotificationsRead() {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  }

  const progress = Math.min((completedHours / hoursGoal) * 100, 100);

  return (
    <div className="volunteer-dashboard-page">
      {/* Navigation */}
      <header className="volunteer-navbar">
        <Link to="/volunteer/dashboard" className="volunteer-logo">
          Volunteer<span>Hub</span>
        </Link>

        <button
          type="button"
          className="volunteer-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <nav className={`volunteer-nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/volunteer/dashboard" className="volunteer-nav-active">
            Dashboard
          </Link>

          <a href="#opportunities">Opportunities</a>
          <a href="#applications">Applications</a>
          <a href="#impact">My Impact</a>

          <div className="notification-wrapper">
            <button
              type="button"
              className="volunteer-nav-icon"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
            >
              🔔
              {unreadCount > 0 && (
                <span className="notification-count">{unreadCount}</span>
              )}
            </button>

            {notificationsOpen && (
              <div className="notification-dropdown">
                <div className="notification-heading">
                  <strong>Notifications</strong>

                  <button type="button" onClick={markNotificationsRead}>
                    Mark all read
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <p>No notifications yet.</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      className={`notification-item ${
                        notification.read ? "read" : ""
                      }`}
                      key={notification.id}
                    >
                      {notification.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="volunteer-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="volunteer-dashboard-main">
        {/* Welcome */}
        <section className="volunteer-welcome">
          <span className="volunteer-greeting">YOUR VOLUNTEER SPACE</span>

          <h1>Let's Make an Impact, {username}!</h1>

          <p>
            Discover opportunities, manage your applications and track the
            difference you're making.
          </p>
        </section>

        {/* Summary cards */}
        <section className="volunteer-summary-grid">
          <div className="volunteer-summary-card">
            <span>🤝 Available Opportunities</span>
            <strong>{opportunities.length}</strong>
          </div>

          <div className="volunteer-summary-card">
            <span>📋 My Applications</span>
            <strong>{applications.length}</strong>
          </div>

          <div className="volunteer-summary-card">
            <span>💜 Volunteer Hours</span>
            <strong>{completedHours} hrs</strong>
          </div>
        </section>

        {/* 1. Browse opportunities */}
        <section className="volunteer-section" id="opportunities">
          <div className="volunteer-section-heading">
            <h2>Explore Volunteering Opportunities</h2>
            <p>Find opportunities that match your interests.</p>
          </div>

          <div className="opportunity-filters">
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search opportunities"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="All">All Categories</option>
              <option value="Community">Community</option>
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
            </select>
          </div>

          <div className="opportunity-grid">
            {filteredOpportunities.map((opportunity) => {
              const applied = applications.some(
                (application) => application.opportunityId === opportunity.id,
              );

              return (
                <article className="opportunity-card" key={opportunity.id}>
                  <span className="opportunity-category">
                    {opportunity.category}
                  </span>

                  <h3>{opportunity.title}</h3>

                  <p>📍 {opportunity.location}</p>
                  <p>📅 {opportunity.date}</p>
                  <p>⏱ {opportunity.hours} hours</p>

                  <button
                    type="button"
                    onClick={() => handleApply(opportunity)}
                    disabled={applied}
                  >
                    {applied ? "Applied ✓" : "Apply Now →"}
                  </button>
                </article>
              );
            })}
          </div>

          {filteredOpportunities.length === 0 && (
            <p>No matching opportunities found.</p>
          )}
        </section>

        {/* 2. Application tracker */}
        <section className="volunteer-section" id="applications">
          <div className="volunteer-section-heading">
            <h2>My Applications</h2>
            <p>Keep track of the opportunities you've applied for.</p>
          </div>

          {applications.length === 0 ? (
            <div className="volunteer-empty-state">
              <p>You haven't applied for anything yet.</p>
              <a href="#opportunities">Browse Opportunities →</a>
            </div>
          ) : (
            <div className="applications-list">
              {applications.map((application) => (
                <div className="application-row" key={application.id}>
                  <div>
                    <h3>{application.title}</h3>
                    <p>
                      {application.location} · {application.date}
                    </p>
                  </div>

                  <span
                    className={`application-status status-${application.status.toLowerCase()}`}
                  >
                    {application.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. Volunteer hours */}
        <section className="volunteer-section" id="impact">
          <div className="volunteer-section-heading">
            <h2>My Volunteer Impact</h2>
            <p>Track your volunteering hours and progress.</p>
          </div>

          <div className="volunteer-impact-card">
            <div>
              <span className="impact-label">Hours Completed</span>

              <div className="impact-number">
                {completedHours}
                <small> / {hoursGoal} hrs</small>
              </div>

              <div className="volunteer-progress-track">
                <div
                  className="volunteer-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p>{Math.round(progress)}% of your goal completed</p>
            </div>

            <button
              type="button"
              onClick={addVolunteerHours}
              className="impact-add-button"
            >
              + Add 1 Demo Hour
            </button>
          </div>

          <p className="volunteer-demo-note">
            Demo only: Hours are added manually for testing. A real system
            should verify completed hours.
          </p>
        </section>
      </main>

      {/* 4. Chatbot placeholder */}
      <div className="volunteer-chat-wrapper">
        {chatOpen && (
          <div className="volunteer-chat-window">
            <div className="volunteer-chat-header">
              <strong>VolunteerHub Assistant</strong>

              <button
                type="button"
                onClick={() => setChatOpen(false)}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>

            <div className="volunteer-chat-body">
              <p>👋 Hi! Welcome to VolunteerHub.</p>
              <small>Chatbot functionality is coming soon.</small>
            </div>
          </div>
        )}

        <button
          type="button"
          className="volunteer-chat-button"
          onClick={() => setChatOpen(!chatOpen)}
          aria-label="Toggle chatbot"
          aria-expanded={chatOpen}
        >
          {chatOpen ? "×" : "💬"}
        </button>
      </div>
    </div>
  );
}

export default VolunteerDashboard;
