import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StaffDashboard.css";

// Must match the keys used in VolunteerDashboard.jsx
const KEYS = {
  opportunities: "volunteerhub.opportunities.v1",
  applications: "volunteerhub.applications.v1",
  profile: "volunteerhub.volunteer.profile.v1",
  notifications: "volunteerhub.volunteer.notifications.v1",
};

const DEFAULT_OPPORTUNITIES = [
  {
    id: "opp-1",
    title: "Community Food Bank",
    category: "Community",
    location: "Edinburgh",
    date: "2026-10-28",
    startTime: "10:00",
    durationHours: 4,
    capacity: 20,
    organiser: "Community Food Network",
    description: "Help prepare food parcels and support local families.",
    requirements: "Friendly attitude and willingness to help.",
  },
  {
    id: "opp-2",
    title: "Park Clean-Up",
    category: "Environment",
    location: "Glasgow",
    date: "2026-11-02",
    startTime: "09:30",
    durationHours: 3,
    capacity: 15,
    organiser: "Green Streets",
    description: "Help improve local parks and green spaces.",
    requirements: "Outdoor clothing. Equipment is provided.",
  },
  {
    id: "opp-3",
    title: "Youth Mentoring",
    category: "Education",
    location: "Edinburgh",
    date: "2026-11-08",
    startTime: "14:00",
    durationHours: 2,
    capacity: 10,
    organiser: "Future Learners",
    description: "Support young people with learning and confidence.",
    requirements: "An interest in education. Checks may apply.",
  },
  {
    id: "opp-4",
    title: "Charity Fundraiser",
    category: "Community",
    location: "Dundee",
    date: "2026-11-12",
    startTime: "11:00",
    durationHours: 5,
    capacity: 25,
    organiser: "Community Giving",
    description: "Welcome guests and support fundraising activities.",
    requirements: "Good communication skills.",
  },
];

const DEFAULT_PROFILE = {
  id: "volunteer-demo",
  name: "Volunteer",
  email: "volunteer@example.com",
  city: "Edinburgh",
  interests: "Community, Environment",
  goalHours: 20,
};

const EMPTY_OPPORTUNITY = {
  title: "",
  category: "Community",
  location: "",
  date: "",
  startTime: "09:00",
  durationHours: 2,
  capacity: 10,
  organiser: "",
  description: "",
  requirements: "",
};

const TABS = [
  ["overview", "Overview"],
  ["applications", "Applications"],
  ["opportunities", "Opportunities"],
  ["volunteers", "Volunteers"],
  ["calendar", "Calendar"],
  ["profile", "Profile"],
];

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

// Custom hook: persists demo state between refreshes.
function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Could not save demo data:", error);
    }
  }, [key, value]);

  return [value, setValue];
}

function formatDate(value) {
  if (!value) return "TBC";

  const date = new Date(`${value.slice(0, 10)}T12:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="sh-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="sh-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="sh-modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="sh-icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`sh-status status-${status.toLowerCase()}`}>{status}</span>
  );
}

export default function StaffDashboard() {
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useStoredState(
    KEYS.opportunities,
    DEFAULT_OPPORTUNITIES,
  );

  const [applications, setApplications] = useStoredState(KEYS.applications, []);

  const [volunteerProfile] = useStoredState(KEYS.profile, DEFAULT_PROFILE);

  const [notifications, setNotifications] = useStoredState(
    KEYS.notifications,
    [],
  );

  // Interface state
  const [activeTab, setActiveTab] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readApplicationIds, setReadApplicationIds] = useState([]);

  const [applicationSearch, setApplicationSearch] = useState("");
  const [applicationFilter, setApplicationFilter] = useState("All");

  const [opportunitySearch, setOpportunitySearch] = useState("");
  const [opportunityCategory, setOpportunityCategory] = useState("All");

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const [opportunityModalOpen, setOpportunityModalOpen] = useState(false);
  const [editingOpportunityId, setEditingOpportunityId] = useState(null);
  const [opportunityDraft, setOpportunityDraft] = useState(EMPTY_OPPORTUNITY);

  const [toast, setToast] = useState("");

  // Synchronise demo data when another tab changes localStorage.
  useEffect(() => {
    function handleStorage(event) {
      if (event.key === KEYS.opportunities) {
        setOpportunities(
          readStorage(KEYS.opportunities, DEFAULT_OPPORTUNITIES),
        );
      }

      if (event.key === KEYS.applications) {
        setApplications(readStorage(KEYS.applications, []));
      }
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [setOpportunities, setApplications]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const pendingApplications = useMemo(
    () =>
      applications.filter((application) => application.status === "Pending"),
    [applications],
  );

  const acceptedApplications = applications.filter(
    (application) =>
      application.status === "Accepted" || application.status === "Completed",
  );

  const completedApplications = applications.filter(
    (application) => application.status === "Completed",
  );

  const totalHours = completedApplications.reduce(
    (sum, application) => sum + Number(application.durationHours || 0),
    0,
  );

  const volunteers = useMemo(() => {
    const people = new Map();

    people.set(volunteerProfile.id, {
      id: volunteerProfile.id,
      name: volunteerProfile.name,
      email: volunteerProfile.email,
      city: volunteerProfile.city,
    });

    applications.forEach((application) => {
      if (!people.has(application.volunteerId)) {
        people.set(application.volunteerId, {
          id: application.volunteerId,
          name: application.volunteerName,
          email: application.volunteerEmail,
          city: "Not provided",
        });
      }
    });

    return Array.from(people.values()).map((person) => {
      const ownApplications = applications.filter(
        (application) => application.volunteerId === person.id,
      );

      return {
        ...person,
        applications: ownApplications.length,
        accepted: ownApplications.filter(
          (application) =>
            application.status === "Accepted" ||
            application.status === "Completed",
        ).length,
        hours: ownApplications
          .filter((application) => application.status === "Completed")
          .reduce(
            (sum, application) => sum + Number(application.durationHours || 0),
            0,
          ),
      };
    });
  }, [applications, volunteerProfile]);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const query = applicationSearch.toLowerCase();

      const matchesSearch = [
        application.volunteerName,
        application.volunteerEmail,
        application.title,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesStatus =
        applicationFilter === "All" || application.status === applicationFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, applicationSearch, applicationFilter]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opportunity) => {
      const matchesSearch = [opportunity.title, opportunity.location]
        .join(" ")
        .toLowerCase()
        .includes(opportunitySearch.toLowerCase());

      const matchesCategory =
        opportunityCategory === "All" ||
        opportunity.category === opportunityCategory;

      return matchesSearch && matchesCategory;
    });
  }, [opportunities, opportunitySearch, opportunityCategory]);

  const upcomingOpportunities = opportunities
    .filter(
      (opportunity) =>
        opportunity.date >= new Date().toISOString().slice(0, 10),
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  const categories = [
    "All",
    ...new Set(opportunities.map((item) => item.category)),
  ];

  // Staff-only in the UI. Real permissions must be enforced by backend.
  function updateApplicationStatus(application, newStatus) {
    const updated = {
      ...application,
      status: newStatus,
    };

    setApplications((previous) =>
      previous.map((item) => (item.id === application.id ? updated : item)),
    );

    setNotifications((previous) => [
      {
        id: crypto.randomUUID(),
        message: `Your application for ${application.title} is now ${newStatus}.`,
        read: false,
      },
      ...previous,
    ]);

    setSelectedApplication(null);
    setToast(`Application marked as ${newStatus}.`);
  }

  function openCreateOpportunity() {
    setEditingOpportunityId(null);
    setOpportunityDraft({ ...EMPTY_OPPORTUNITY });
    setOpportunityModalOpen(true);
  }

  function openEditOpportunity(opportunity) {
    setEditingOpportunityId(opportunity.id);
    setOpportunityDraft({ ...opportunity });
    setOpportunityModalOpen(true);
  }

  function saveOpportunity(event) {
    event.preventDefault();

    const savedOpportunity = {
      ...opportunityDraft,
      id: editingOpportunityId || crypto.randomUUID(),
      title: opportunityDraft.title.trim(),
      location: opportunityDraft.location.trim(),
      organiser: opportunityDraft.organiser.trim(),
      description: opportunityDraft.description.trim(),
      durationHours: Number(opportunityDraft.durationHours),
      capacity: Number(opportunityDraft.capacity),
    };

    if (
      !savedOpportunity.title ||
      !savedOpportunity.location ||
      !savedOpportunity.date ||
      !savedOpportunity.organiser ||
      !savedOpportunity.description ||
      savedOpportunity.capacity < 1 ||
      savedOpportunity.durationHours <= 0
    ) {
      setToast("Please complete all required opportunity fields.");
      return;
    }

    setOpportunities((previous) =>
      editingOpportunityId
        ? previous.map((item) =>
            item.id === editingOpportunityId ? savedOpportunity : item,
          )
        : [...previous, savedOpportunity],
    );

    setOpportunityModalOpen(false);
    setToast(
      editingOpportunityId
        ? "Opportunity updated successfully."
        : "Opportunity created successfully.",
    );
  }

  function deleteOpportunity(opportunity) {
    const hasApplications = applications.some(
      (application) => application.opportunityId === opportunity.id,
    );

    if (hasApplications) {
      setToast("Cannot delete an opportunity with existing applications.");
      return;
    }

    if (
      !window.confirm(`Delete "${opportunity.title}"? This cannot be undone.`)
    ) {
      return;
    }

    setOpportunities((previous) =>
      previous.filter((item) => item.id !== opportunity.id),
    );

    setSelectedOpportunity(null);
    setToast("Opportunity deleted.");
  }

  function showTab(tab) {
    setActiveTab(tab);
    setMenuOpen(false);
    setNotificationsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function countAccepted(opportunityId) {
    return applications.filter(
      (application) =>
        application.opportunityId === opportunityId &&
        ["Accepted", "Completed"].includes(application.status),
    ).length;
  }

  const pendingCount = pendingApplications.length;
  const unreadCount = pendingApplications.filter(
    (application) => !readApplicationIds.includes(application.id),
  ).length;

  return (
    <div className="sh-page">
      {/* NAVIGATION */}
      <header className="sh-navbar">
        <Link
          to="/staff/dashboard"
          className="sh-logo"
          onClick={() => showTab("overview")}
        >
          Volunteer<span>Hub</span>
        </Link>

        <button
          type="button"
          className="sh-mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <nav className={`sh-nav ${menuOpen ? "open" : ""}`}>
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`sh-nav-link ${activeTab === id ? "active" : ""}`}
              onClick={() => showTab(id)}
            >
              {label}
            </button>
          ))}

          <div className="sh-notification-wrapper">
            <button
              type="button"
              className="sh-bell"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Staff notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="sh-notification-count">{unreadCount}</span>
              )}
            </button>

            {notificationsOpen && (
              <div className="sh-notification-dropdown">
                <div className="sh-notification-header">
                  <strong>Pending Applications</strong>

                  <button
                    type="button"
                    onClick={() => {
                      setReadApplicationIds(
                        pendingApplications.map((item) => item.id),
                      );
                    }}
                  >
                    Mark read
                  </button>
                </div>

                {pendingApplications.length === 0 ? (
                  <p>No applications awaiting review.</p>
                ) : (
                  pendingApplications.map((application) => (
                    <button
                      key={application.id}
                      type="button"
                      className="sh-notification-item"
                      onClick={() => {
                        setSelectedApplication(application);
                        setNotificationsOpen(false);
                        setReadApplicationIds((previous) => [
                          ...new Set([...previous, application.id]),
                        ]);
                      }}
                    >
                      <strong>{application.volunteerName}</strong>
                      <small>{application.title}</small>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <span className="sh-role">Staff Portal</span>

          <button
            type="button"
            className="sh-logout"
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="sh-main">
        <section className="sh-welcome">
          <div>
            <span className="sh-eyebrow">VOLUNTEER MANAGEMENT WORKSPACE</span>

            <h1>
              {activeTab === "overview"
                ? "Staff Dashboard"
                : TABS.find(([id]) => id === activeTab)?.[1]}
            </h1>

            <p>
              Manage volunteering opportunities, review applications and support
              your community.
            </p>
          </div>

          <span className="sh-welcome-badge">Employee Workspace</span>
        </section>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <section className="sh-stats">
              <div className="sh-stat-card">
                <span>👥 Registered Volunteers</span>
                <strong>{volunteers.length}</strong>
                <small>Demo volunteer records</small>
              </div>

              <div className="sh-stat-card">
                <span>📅 Opportunities</span>
                <strong>{opportunities.length}</strong>
                <small>Published opportunities</small>
              </div>

              <div className="sh-stat-card">
                <span>📋 Pending Applications</span>
                <strong>{pendingCount}</strong>
                <small>Awaiting your review</small>
              </div>

              <div className="sh-stat-card">
                <span>⏱ Completed Hours</span>
                <strong>{totalHours}</strong>
                <small>Across completed activities</small>
              </div>
            </section>

            <div className="sh-overview-grid">
              <section className="sh-panel">
                <div className="sh-section-header">
                  <div>
                    <h2>Applications Awaiting Review</h2>
                    <p>Review recent volunteer applications.</p>
                  </div>

                  <button
                    className="sh-text-button"
                    onClick={() => showTab("applications")}
                  >
                    View all →
                  </button>
                </div>

                {pendingApplications.length === 0 ? (
                  <div className="sh-empty">
                    <h3>All caught up!</h3>
                    <p>No pending applications.</p>
                  </div>
                ) : (
                  pendingApplications.slice(0, 4).map((item) => (
                    <div className="sh-list-row" key={item.id}>
                      <div>
                        <strong>{item.volunteerName}</strong>
                        <small>{item.title}</small>
                      </div>

                      <button
                        className="sh-secondary-button"
                        onClick={() => setSelectedApplication(item)}
                      >
                        Review
                      </button>
                    </div>
                  ))
                )}
              </section>

              <section className="sh-panel">
                <div className="sh-section-header">
                  <div>
                    <h2>Quick Actions</h2>
                    <p>Common staff management tasks.</p>
                  </div>
                </div>

                <div className="sh-quick-actions">
                  <button onClick={openCreateOpportunity}>
                    <span>➕</span>
                    <strong>Create Opportunity</strong>
                    <small>Publish a new activity</small>
                  </button>

                  <button onClick={() => showTab("applications")}>
                    <span>📋</span>
                    <strong>Review Applications</strong>
                    <small>Approve or reject requests</small>
                  </button>

                  <button onClick={() => showTab("volunteers")}>
                    <span>👥</span>
                    <strong>View Volunteers</strong>
                    <small>Manage participation records</small>
                  </button>
                </div>
              </section>
            </div>
          </>
        )}

        {/* APPLICATION MANAGEMENT */}
        {activeTab === "applications" && (
          <section className="sh-panel">
            <div className="sh-section-header">
              <div>
                <h2>Manage Applications</h2>
                <p>Review applicants and update their statuses.</p>
              </div>

              <span className="sh-count">{pendingCount} Pending</span>
            </div>

            <div className="sh-filters">
              <input
                type="search"
                placeholder="Search volunteer or opportunity..."
                value={applicationSearch}
                onChange={(event) => setApplicationSearch(event.target.value)}
              />

              <select
                value={applicationFilter}
                onChange={(event) => setApplicationFilter(event.target.value)}
              >
                {["All", "Pending", "Accepted", "Rejected", "Completed"].map(
                  (status) => (
                    <option key={status}>{status}</option>
                  ),
                )}
              </select>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="sh-empty">
                <h3>No matching applications</h3>
                <p>Applications submitted by volunteers will appear here.</p>
              </div>
            ) : (
              <div className="sh-table-scroll">
                <table className="sh-table">
                  <thead>
                    <tr>
                      <th>Volunteer</th>
                      <th>Opportunity</th>
                      <th>Event Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredApplications.map((application) => (
                      <tr key={application.id}>
                        <td>
                          <strong>{application.volunteerName}</strong>
                          <small>{application.volunteerEmail}</small>
                        </td>

                        <td>{application.title}</td>
                        <td>{formatDate(application.date)}</td>

                        <td>
                          <StatusBadge status={application.status} />
                        </td>

                        <td>
                          <div className="sh-table-actions">
                            <button
                              className="sh-secondary-button"
                              onClick={() =>
                                setSelectedApplication(application)
                              }
                            >
                              View
                            </button>

                            {application.status === "Pending" && (
                              <>
                                <button
                                  className="sh-accept-button"
                                  onClick={() =>
                                    updateApplicationStatus(
                                      application,
                                      "Accepted",
                                    )
                                  }
                                >
                                  Accept
                                </button>

                                <button
                                  className="sh-reject-button"
                                  onClick={() =>
                                    updateApplicationStatus(
                                      application,
                                      "Rejected",
                                    )
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {application.status === "Accepted" && (
                              <button
                                className="sh-complete-button"
                                onClick={() =>
                                  updateApplicationStatus(
                                    application,
                                    "Completed",
                                  )
                                }
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* OPPORTUNITY MANAGEMENT */}
        {activeTab === "opportunities" && (
          <section className="sh-panel">
            <div className="sh-section-header">
              <div>
                <h2>Manage Opportunities</h2>
                <p>Create, edit and manage volunteering events.</p>
              </div>

              <button
                className="sh-primary-button"
                onClick={openCreateOpportunity}
              >
                + Create Opportunity
              </button>
            </div>

            <div className="sh-filters">
              <input
                type="search"
                placeholder="Search opportunities..."
                value={opportunitySearch}
                onChange={(event) => setOpportunitySearch(event.target.value)}
              />

              <select
                value={opportunityCategory}
                onChange={(event) => setOpportunityCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            {filteredOpportunities.length === 0 ? (
              <div className="sh-empty">
                <h3>No opportunities found</h3>
                <p>Create a new activity or change your filters.</p>
              </div>
            ) : (
              <div className="sh-opportunity-grid">
                {filteredOpportunities.map((opportunity) => {
                  const accepted = countAccepted(opportunity.id);
                  const percentage = Math.min(
                    100,
                    (accepted / Math.max(1, opportunity.capacity)) * 100,
                  );

                  return (
                    <article
                      className="sh-opportunity-card"
                      key={opportunity.id}
                    >
                      <span className="sh-category">
                        {opportunity.category}
                      </span>

                      <h3>{opportunity.title}</h3>

                      <p>📍 {opportunity.location}</p>
                      <p>📅 {formatDate(opportunity.date)}</p>
                      <p>⏱ {opportunity.durationHours} hours</p>

                      <div className="sh-capacity-header">
                        <span>Accepted Volunteers</span>
                        <strong>
                          {accepted}/{opportunity.capacity}
                        </strong>
                      </div>

                      <div className="sh-progress">
                        <div style={{ width: `${percentage}%` }} />
                      </div>

                      <div className="sh-card-actions">
                        <button
                          className="sh-secondary-button"
                          onClick={() => setSelectedOpportunity(opportunity)}
                        >
                          Details
                        </button>

                        <button
                          className="sh-secondary-button"
                          onClick={() => openEditOpportunity(opportunity)}
                        >
                          Edit
                        </button>

                        <button
                          className="sh-delete-button"
                          onClick={() => deleteOpportunity(opportunity)}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* VOLUNTEER MANAGEMENT */}
        {activeTab === "volunteers" && (
          <section className="sh-panel">
            <div className="sh-section-header">
              <div>
                <h2>Volunteer Management</h2>
                <p>View registered volunteers and participation.</p>
              </div>

              <span className="sh-count">{volunteers.length} Volunteers</span>
            </div>

            <div className="sh-table-scroll">
              <table className="sh-table">
                <thead>
                  <tr>
                    <th>Volunteer</th>
                    <th>Location</th>
                    <th>Applications</th>
                    <th>Accepted</th>
                    <th>Completed Hours</th>
                  </tr>
                </thead>

                <tbody>
                  {volunteers.map((volunteer) => (
                    <tr key={volunteer.id}>
                      <td>
                        <strong>{volunteer.name}</strong>
                        <small>{volunteer.email}</small>
                      </td>
                      <td>{volunteer.city}</td>
                      <td>{volunteer.applications}</td>
                      <td>{volunteer.accepted}</td>
                      <td>{volunteer.hours} hrs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* CALENDAR */}
        {activeTab === "calendar" && (
          <section className="sh-panel">
            <div className="sh-section-header">
              <div>
                <h2>Upcoming Events</h2>
                <p>View and manage the event schedule.</p>
              </div>

              <button
                className="sh-primary-button"
                onClick={openCreateOpportunity}
              >
                + Add Event
              </button>
            </div>

            {upcomingOpportunities.length === 0 ? (
              <div className="sh-empty">
                <h3>No upcoming events</h3>
                <p>Create an opportunity to get started.</p>
              </div>
            ) : (
              upcomingOpportunities.map((item) => (
                <div className="sh-calendar-row" key={item.id}>
                  <div className="sh-calendar-date">
                    <strong>
                      {new Date(`${item.date}T12:00:00`).getDate()}
                    </strong>
                    <span>
                      {new Intl.DateTimeFormat("en-GB", {
                        month: "short",
                      }).format(new Date(`${item.date}T12:00:00`))}
                    </span>
                  </div>

                  <div className="sh-calendar-info">
                    <h3>{item.title}</h3>
                    <p>
                      {item.location} · {item.startTime} ·{" "}
                      {countAccepted(item.id)} accepted
                    </p>
                  </div>

                  <button
                    className="sh-secondary-button"
                    onClick={() => openEditOpportunity(item)}
                  >
                    Manage
                  </button>
                </div>
              ))
            )}
          </section>
        )}

        {/* STAFF PROFILE */}
        {activeTab === "profile" && (
          <section className="sh-panel">
            <div className="sh-section-header">
              <div>
                <h2>Staff Profile</h2>
                <p>Information about your demo staff account.</p>
              </div>
            </div>

            <div className="sh-profile-grid">
              <div>
                <small>Account Type</small>
                <strong>Staff Member</strong>
              </div>

              <div>
                <small>Organisation</small>
                <strong>VolunteerHub</strong>
              </div>

              <div>
                <small>Permissions</small>
                <strong>Opportunity and Application Management</strong>
              </div>

              <div>
                <small>Environment</small>
                <strong>Frontend Demonstration</strong>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* APPLICATION REVIEW MODAL */}
      {selectedApplication && (
        <Modal
          title="Review Application"
          onClose={() => setSelectedApplication(null)}
        >
          {(() => {
            const current =
              applications.find((item) => item.id === selectedApplication.id) ||
              selectedApplication;

            return (
              <div className="sh-modal-content">
                <h3>{current.volunteerName}</h3>
                <StatusBadge status={current.status} />

                <div className="sh-detail-grid">
                  <div>
                    <small>Email</small>
                    <strong>{current.volunteerEmail}</strong>
                  </div>
                  <div>
                    <small>Opportunity</small>
                    <strong>{current.title}</strong>
                  </div>
                  <div>
                    <small>Event Date</small>
                    <strong>{formatDate(current.date)}</strong>
                  </div>
                  <div>
                    <small>Application Date</small>
                    <strong>
                      {formatDate(current.appliedAt?.slice(0, 10))}
                    </strong>
                  </div>
                  <div>
                    <small>Reference</small>
                    <strong>{current.id.slice(0, 8)}</strong>
                  </div>
                  <div>
                    <small>Duration</small>
                    <strong>{current.durationHours} hours</strong>
                  </div>
                </div>

                {current.status === "Pending" && (
                  <div className="sh-form-actions">
                    <button
                      className="sh-reject-button"
                      onClick={() =>
                        updateApplicationStatus(current, "Rejected")
                      }
                    >
                      Reject Application
                    </button>

                    <button
                      className="sh-accept-button"
                      onClick={() =>
                        updateApplicationStatus(current, "Accepted")
                      }
                    >
                      Accept Application
                    </button>
                  </div>
                )}

                {current.status === "Accepted" && (
                  <button
                    className="sh-complete-button sh-full-button"
                    onClick={() =>
                      updateApplicationStatus(current, "Completed")
                    }
                  >
                    Mark Activity Completed
                  </button>
                )}

                <p className="sh-muted">
                  Demo only. In production, staff permissions and status changes
                  must be validated by the backend.
                </p>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* OPPORTUNITY DETAILS MODAL */}
      {selectedOpportunity && (
        <Modal
          title="Opportunity Details"
          onClose={() => setSelectedOpportunity(null)}
        >
          <div className="sh-modal-content">
            <span className="sh-category">{selectedOpportunity.category}</span>

            <h3>{selectedOpportunity.title}</h3>
            <p>{selectedOpportunity.description}</p>

            <div className="sh-detail-grid">
              {[
                ["Location", selectedOpportunity.location],
                ["Date", formatDate(selectedOpportunity.date)],
                ["Start Time", selectedOpportunity.startTime],
                ["Duration", `${selectedOpportunity.durationHours} hours`],
                ["Capacity", `${selectedOpportunity.capacity} volunteers`],
                ["Organiser", selectedOpportunity.organiser],
              ].map(([label, value]) => (
                <div key={label}>
                  <small>{label}</small>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <h4>Requirements</h4>
            <p>{selectedOpportunity.requirements}</p>

            <button
              className="sh-primary-button sh-full-button"
              onClick={() => {
                setSelectedOpportunity(null);
                openEditOpportunity(selectedOpportunity);
              }}
            >
              Edit Opportunity
            </button>
          </div>
        </Modal>
      )}

      {/* CREATE / EDIT OPPORTUNITY MODAL */}
      {opportunityModalOpen && (
        <Modal
          title={
            editingOpportunityId ? "Edit Opportunity" : "Create Opportunity"
          }
          onClose={() => setOpportunityModalOpen(false)}
        >
          <form className="sh-form" onSubmit={saveOpportunity}>
            <label>
              Opportunity Title *
              <input
                required
                value={opportunityDraft.title}
                onChange={(event) =>
                  setOpportunityDraft((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
                placeholder="e.g. Community Food Drive"
              />
            </label>

            <label>
              Category *
              <select
                value={opportunityDraft.category}
                onChange={(event) =>
                  setOpportunityDraft((previous) => ({
                    ...previous,
                    category: event.target.value,
                  }))
                }
              >
                <option>Community</option>
                <option>Environment</option>
                <option>Education</option>
                <option>Health</option>
                <option>Fundraising</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Location *
              <input
                required
                value={opportunityDraft.location}
                onChange={(event) =>
                  setOpportunityDraft((previous) => ({
                    ...previous,
                    location: event.target.value,
                  }))
                }
                placeholder="e.g. Edinburgh"
              />
            </label>

            <div className="sh-form-grid">
              <label>
                Event Date *
                <input
                  required
                  type="date"
                  value={opportunityDraft.date}
                  onChange={(event) =>
                    setOpportunityDraft((previous) => ({
                      ...previous,
                      date: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Start Time *
                <input
                  required
                  type="time"
                  value={opportunityDraft.startTime}
                  onChange={(event) =>
                    setOpportunityDraft((previous) => ({
                      ...previous,
                      startTime: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="sh-form-grid">
              <label>
                Duration (hours) *
                <input
                  required
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={opportunityDraft.durationHours}
                  onChange={(event) =>
                    setOpportunityDraft((previous) => ({
                      ...previous,
                      durationHours: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Volunteer Capacity *
                <input
                  required
                  type="number"
                  min="1"
                  value={opportunityDraft.capacity}
                  onChange={(event) =>
                    setOpportunityDraft((previous) => ({
                      ...previous,
                      capacity: event.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <label>
              Organiser *
              <input
                required
                value={opportunityDraft.organiser}
                onChange={(event) =>
                  setOpportunityDraft((previous) => ({
                    ...previous,
                    organiser: event.target.value,
                  }))
                }
                placeholder="Organisation name"
              />
            </label>

            <label>
              Description *
              <textarea
                required
                rows="4"
                value={opportunityDraft.description}
                onChange={(event) =>
                  setOpportunityDraft((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
                placeholder="Describe the volunteering activity..."
              />
            </label>

            <label>
              Requirements
              <textarea
                rows="3"
                value={opportunityDraft.requirements}
                onChange={(event) =>
                  setOpportunityDraft((previous) => ({
                    ...previous,
                    requirements: event.target.value,
                  }))
                }
                placeholder="Skills, equipment or eligibility..."
              />
            </label>

            <div className="sh-form-actions">
              <button
                type="button"
                className="sh-secondary-button"
                onClick={() => setOpportunityModalOpen(false)}
              >
                Cancel
              </button>

              <button type="submit" className="sh-primary-button">
                {editingOpportunityId ? "Save Changes" : "Create Opportunity"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toast && (
        <div className="sh-toast" role="status">
          ✓ {toast}
        </div>
      )}

      <footer className="sh-footer">
        VolunteerHub Staff Portal · Frontend demo · No backend connected
      </footer>
    </div>
  );
}
