import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StaffDashboard.css";

const initialApplications = [
  {
    id: 101,
    volunteer: "Alex Morgan",
    email: "alex@example.com",
    opportunity: "Community Food Bank",
    date: "28 October 2026",
    status: "Pending",
  },
  {
    id: 102,
    volunteer: "Jamie Wilson",
    email: "jamie@example.com",
    opportunity: "Park Clean-Up",
    date: "2 November 2026",
    status: "Accepted",
  },
  {
    id: 103,
    volunteer: "Taylor Smith",
    email: "taylor@example.com",
    opportunity: "Youth Mentoring",
    date: "8 November 2026",
    status: "Pending",
  },
  {
    id: 104,
    volunteer: "Sam Patel",
    email: "sam@example.com",
    opportunity: "Charity Fundraiser",
    date: "12 November 2026",
    status: "Rejected",
  },
];

const opportunities = [
  {
    id: 1,
    title: "Community Food Bank",
    location: "Edinburgh",
    date: "28 October 2026",
    volunteers: 12,
    capacity: 20,
  },
  {
    id: 2,
    title: "Park Clean-Up",
    location: "Glasgow",
    date: "2 November 2026",
    volunteers: 8,
    capacity: 15,
  },
  {
    id: 3,
    title: "Youth Mentoring",
    location: "Edinburgh",
    date: "8 November 2026",
    volunteers: 5,
    capacity: 10,
  },
];

function StaffDashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState(initialApplications);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const pendingCount = applications.filter(
    (application) => application.status === "Pending",
  ).length;

  const filteredApplications = applications.filter((application) => {
    const matchesFilter = filter === "All" || application.status === filter;

    const matchesSearch =
      application.volunteer.toLowerCase().includes(search.toLowerCase()) ||
      application.opportunity.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Frontend demo only.
  // Backend will eventually save staff decisions.
  function handleStatusChange(id, newStatus) {
    setApplications((previous) =>
      previous.map((application) =>
        application.id === id
          ? { ...application, status: newStatus }
          : application,
      ),
    );
  }

  return (
    <div className="staff-page">
      <header className="staff-navbar">
        <Link to="/staff/dashboard" className="staff-logo">
          Volunteer<span>Hub</span>
        </Link>

        <button
          className="staff-menu-toggle"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <nav className={`staff-nav ${menuOpen ? "open" : ""}`}>
          <a href="#overview">Overview</a>
          <a href="#applications">Applications</a>
          <a href="#opportunities">Opportunities</a>

          <span className="staff-role-label">Staff Portal</span>

          <button
            className="staff-logout"
            type="button"
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="staff-main" id="overview">
        <section className="staff-welcome">
          <div>
            <span className="staff-eyebrow">STAFF MANAGEMENT PORTAL</span>

            <h1>Staff Dashboard</h1>

            <p>
              Manage volunteer applications, review upcoming opportunities and
              oversee community activity.
            </p>
          </div>

          <div className="staff-welcome-badge">Staff Workspace</div>
        </section>

        <section className="staff-stats">
          <div className="staff-stat-card">
            <span>👥 Total Volunteers</span>
            <strong>150</strong>
            <small>Registered volunteers</small>
          </div>

          <div className="staff-stat-card">
            <span>📅 Active Opportunities</span>
            <strong>8</strong>
            <small>Currently available</small>
          </div>

          <div className="staff-stat-card">
            <span>📋 Pending Applications</span>
            <strong>{pendingCount}</strong>
            <small>Awaiting staff review</small>
          </div>

          <div className="staff-stat-card">
            <span>⏱ Volunteer Hours</span>
            <strong>1,240</strong>
            <small>Total hours contributed</small>
          </div>
        </section>

        <section className="staff-section" id="applications">
          <div className="staff-section-header">
            <div>
              <h2>Manage Applications</h2>
              <p>Review applications and make approval decisions.</p>
            </div>

            <span className="staff-section-count">{pendingCount} Pending</span>
          </div>

          <div className="staff-filters">
            <input
              type="text"
              placeholder="Search volunteer or opportunity..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="All">All Applications</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="staff-table-scroll">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Volunteer</th>
                  <th>Opportunity</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <strong>{application.volunteer}</strong>
                      <small>{application.email}</small>
                    </td>

                    <td>{application.opportunity}</td>
                    <td>{application.date}</td>

                    <td>
                      <span
                        className={`staff-status status-${application.status.toLowerCase()}`}
                      >
                        {application.status}
                      </span>
                    </td>

                    <td>
                      <div className="staff-actions">
                        <button
                          type="button"
                          className="staff-accept"
                          disabled={application.status !== "Pending"}
                          onClick={() =>
                            handleStatusChange(application.id, "Accepted")
                          }
                        >
                          Accept
                        </button>

                        <button
                          type="button"
                          className="staff-reject"
                          disabled={application.status !== "Pending"}
                          onClick={() =>
                            handleStatusChange(application.id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <p className="staff-empty">No matching applications found.</p>
          )}
        </section>

        <section className="staff-section" id="opportunities">
          <div className="staff-section-header">
            <div>
              <h2>Manage Opportunities</h2>
              <p>Overview of upcoming volunteering activities.</p>
            </div>

            <button
              type="button"
              className="staff-add-button"
              disabled
              title="Coming soon"
            >
              + Create Opportunity
            </button>
          </div>

          <div className="staff-opportunity-grid">
            {opportunities.map((opportunity) => (
              <article className="staff-opportunity-card" key={opportunity.id}>
                <span className="staff-opportunity-label">Upcoming Event</span>

                <h3>{opportunity.title}</h3>
                <p>📍 {opportunity.location}</p>
                <p>📅 {opportunity.date}</p>

                <div className="staff-capacity-header">
                  <span>Volunteers Registered</span>
                  <strong>
                    {opportunity.volunteers}/{opportunity.capacity}
                  </strong>
                </div>

                <div className="staff-progress-track">
                  <div
                    className="staff-progress-fill"
                    style={{
                      width: `${
                        (opportunity.volunteers / opportunity.capacity) * 100
                      }%`,
                    }}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <p className="staff-demo-message">
          Frontend prototype — application decisions are simulated locally and
          reset when the page refreshes.
        </p>
      </main>
    </div>
  );
}

export default StaffDashboard;
