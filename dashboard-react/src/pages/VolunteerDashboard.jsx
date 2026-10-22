import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./VolunteerDashboard.css";

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

// Safely read demo data from the browser.
function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

// Custom hook: useState + automatic localStorage saving.
function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Unable to save demo data:", error);
    }
  }, [key, value]);

  return [value, setValue];
}

function formatDate(dateString) {
  if (!dateString) return "TBC";

  const date = new Date(`${dateString.slice(0, 10)}T12:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// Reusable dialog for opportunity details and profile editing.
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
      className="vh-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="vh-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="vh-modal-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="vh-icon-button"
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
    <span className={`vh-status status-${status.toLowerCase()}`}>{status}</span>
  );
}

export default function VolunteerDashboard() {
  const navigate = useNavigate();

  // Shared mock data. Staff Dashboard can use the same keys.
  const [opportunities, setOpportunities] = useStoredState(
    KEYS.opportunities,
    DEFAULT_OPPORTUNITIES,
  );

  const [applications, setApplications] = useStoredState(KEYS.applications, []);

  const [profile, setProfile] = useStoredState(KEYS.profile, DEFAULT_PROFILE);

  const [notifications, setNotifications] = useStoredState(KEYS.notifications, [
    {
      id: "welcome",
      message: "Welcome to VolunteerHub!",
      read: false,
    },
  ]);

  // UI state
  const [activeTab, setActiveTab] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [applicationFilter, setApplicationFilter] = useState("All");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState(profile);
  const [toast, setToast] = useState("");

  // Listen for staff changes made in another browser tab.
  useEffect(() => {
    function syncStorage(event) {
      if (event.key === KEYS.opportunities) {
        setOpportunities(
          readStorage(KEYS.opportunities, DEFAULT_OPPORTUNITIES),
        );
      }

      if (event.key === KEYS.applications) {
        setApplications(readStorage(KEYS.applications, []));
      }
    }

    window.addEventListener("storage", syncStorage);

    return () => {
      window.removeEventListener("storage", syncStorage);
    };
  }, [setOpportunities, setApplications]);

  // Automatically dismiss success messages.
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Derived data: no need for extra state.
  const myApplications = useMemo(
    () =>
      applications.filter(
        (application) => application.volunteerId === profile.id,
      ),
    [applications, profile.id],
  );

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .filter((opportunity) => {
        const text = [
          opportunity.title,
          opportunity.location,
          opportunity.description,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch = text.includes(search.toLowerCase());
        const matchesCategory =
          category === "All" || opportunity.category === category;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) =>
        sortBy === "title"
          ? a.title.localeCompare(b.title)
          : a.date.localeCompare(b.date),
      );
  }, [opportunities, search, category, sortBy]);

  const visibleApplications = myApplications.filter(
    (application) =>
      applicationFilter === "All" || application.status === applicationFilter,
  );

  const completedApplications = myApplications.filter(
    (application) => application.status === "Completed",
  );

  const completedHours = completedApplications.reduce(
    (total, application) => total + Number(application.durationHours || 0),
    0,
  );

  const goalHours = Math.max(1, Number(profile.goalHours) || 20);
  const progress = Math.min(
    100,
    Math.round((completedHours / goalHours) * 100),
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const upcoming = opportunities
    .filter(
      (opportunity) =>
        opportunity.date >= new Date().toISOString().slice(0, 10),
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  const categories = [
    "All",
    ...new Set(opportunities.map((item) => item.category)),
  ];

  function showTab(tab) {
    setActiveTab(tab);
    setMenuOpen(false);
    setNotificationsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function hasApplied(opportunityId) {
    return myApplications.some(
      (application) => application.opportunityId === opportunityId,
    );
  }

  function handleApply(opportunity) {
    if (hasApplied(opportunity.id)) {
      setToast("You have already applied for this opportunity.");
      return;
    }

    const application = {
      id: crypto.randomUUID(),
      opportunityId: opportunity.id,
      volunteerId: profile.id,
      volunteerName: profile.name,
      volunteerEmail: profile.email,
      title: opportunity.title,
      location: opportunity.location,
      date: opportunity.date,
      durationHours: opportunity.durationHours,
      status: "Pending",
      appliedAt: new Date().toISOString(),
    };

    setApplications((previous) => [...previous, application]);

    setNotifications((previous) => [
      {
        id: crypto.randomUUID(),
        message: `Application submitted for ${opportunity.title}.`,
        read: false,
      },
      ...previous,
    ]);

    setSelectedOpportunity(null);
    setToast("Application submitted successfully!");
  }

  function saveProfile(event) {
    event.preventDefault();

    const updatedProfile = {
      ...profileDraft,
      name: profileDraft.name.trim(),
      email: profileDraft.email.trim(),
      goalHours: Math.max(1, Number(profileDraft.goalHours) || 20),
    };

    if (!updatedProfile.name || !updatedProfile.email) return;

    setProfile(updatedProfile);

    setApplications((previous) =>
      previous.map((application) =>
        application.volunteerId === profile.id
          ? {
              ...application,
              volunteerName: updatedProfile.name,
              volunteerEmail: updatedProfile.email,
            }
          : application,
      ),
    );

    setEditingProfile(false);
    setToast("Profile updated!");
  }

  function markNotificationsRead() {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  }

  const navigation = [
    ["overview", "Dashboard"],
    ["opportunities", "Opportunities"],
    ["applications", "My Applications"],
    ["impact", "My Impact"],
    ["calendar", "Calendar"],
    ["profile", "Profile"],
  ];

  return (
    <div className="vh-page">
      {/* NAVBAR */}
      <header className="vh-navbar">
        <Link
          to="/volunteer/dashboard"
          className="vh-logo"
          onClick={() => showTab("overview")}
        >
          Volunteer<span>Hub</span>
        </Link>

        <button
          type="button"
          className="vh-mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <nav className={`vh-nav ${menuOpen ? "open" : ""}`}>
          {navigation.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`vh-nav-link ${activeTab === id ? "active" : ""}`}
              onClick={() => showTab(id)}
            >
              {label}
            </button>
          ))}

          <div className="vh-notification-wrapper">
            <button
              type="button"
              className="vh-bell"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="vh-notification-count">{unreadCount}</span>
              )}
            </button>

            {notificationsOpen && (
              <div className="vh-notification-dropdown">
                <div className="vh-notification-header">
                  <strong>Notifications</strong>
                  <button type="button" onClick={markNotificationsRead}>
                    Mark all read
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <p>No notifications yet.</p>
                ) : (
                  notifications.map((notification) => (
                    <p
                      key={notification.id}
                      className={notification.read ? "read" : ""}
                    >
                      {notification.message}
                    </p>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="vh-logout"
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="vh-main">
        {/* PAGE HEADER */}
        <section className="vh-welcome">
          <span className="vh-eyebrow">YOUR VOLUNTEER SPACE</span>

          <h1>
            {activeTab === "overview"
              ? `Let's Make an Impact, ${profile.name}!`
              : navigation.find(([id]) => id === activeTab)?.[1]}
          </h1>

          <p>
            Discover opportunities, manage applications and make a difference in
            your community.
          </p>
        </section>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="vh-stats">
              <div className="vh-stat-card">
                <span>🤝 Available Opportunities</span>
                <strong>{opportunities.length}</strong>
                <small>Explore ways to help</small>
              </div>

              <div className="vh-stat-card">
                <span>📋 My Applications</span>
                <strong>{myApplications.length}</strong>
                <small>
                  {
                    myApplications.filter((item) => item.status === "Pending")
                      .length
                  }{" "}
                  awaiting review
                </small>
              </div>

              <div className="vh-stat-card">
                <span>💜 Volunteer Hours</span>
                <strong>{completedHours}</strong>
                <small>Completed hours</small>
              </div>
            </div>

            <div className="vh-overview-grid">
              <section className="vh-panel">
                <div className="vh-section-header">
                  <div>
                    <h2>Explore Opportunities</h2>
                    <p>Find your next volunteering activity.</p>
                  </div>
                  <button
                    className="vh-text-button"
                    onClick={() => showTab("opportunities")}
                  >
                    View all →
                  </button>
                </div>

                {opportunities.slice(0, 3).map((item) => (
                  <div className="vh-list-row" key={item.id}>
                    <div>
                      <strong>{item.title}</strong>
                      <small>
                        {item.location} · {formatDate(item.date)}
                      </small>
                    </div>

                    <button
                      className="vh-secondary-button"
                      onClick={() => setSelectedOpportunity(item)}
                    >
                      Details
                    </button>
                  </div>
                ))}

                {opportunities.length === 0 && (
                  <p className="vh-muted">
                    No opportunities are available yet.
                  </p>
                )}
              </section>

              <section className="vh-panel">
                <div className="vh-section-header">
                  <div>
                    <h2>My Progress</h2>
                    <p>Your volunteering journey.</p>
                  </div>
                </div>

                <div className="vh-impact-number">
                  {completedHours}
                  <small> / {goalHours} hours</small>
                </div>

                <div className="vh-progress">
                  <div style={{ width: `${progress}%` }} />
                </div>

                <p className="vh-muted">
                  {progress}% of your personal goal completed
                </p>

                <button
                  className="vh-primary-button"
                  onClick={() => showTab("impact")}
                >
                  View My Impact
                </button>
              </section>
            </div>
          </>
        )}

        {/* OPPORTUNITIES */}
        {activeTab === "opportunities" && (
          <section className="vh-panel">
            <div className="vh-section-header">
              <div>
                <h2>Explore Volunteering Opportunities</h2>
                <p>Search, filter and apply for activities.</p>
              </div>
              <span className="vh-count">
                {filteredOpportunities.length} results
              </span>
            </div>

            <div className="vh-filters">
              <input
                type="search"
                placeholder="Search by title or location..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search opportunities"
              />

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                aria-label="Category"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Categories" : item}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort opportunities"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Name</option>
              </select>
            </div>

            {filteredOpportunities.length === 0 ? (
              <div className="vh-empty">
                <h3>No matching opportunities</h3>
                <p>Try changing your search or category.</p>
                <button
                  className="vh-secondary-button"
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="vh-opportunity-grid">
                {filteredOpportunities.map((item) => (
                  <article className="vh-opportunity-card" key={item.id}>
                    <span className="vh-category">{item.category}</span>

                    <h3>{item.title}</h3>

                    <p>📍 {item.location}</p>
                    <p>📅 {formatDate(item.date)}</p>
                    <p>⏱ {item.durationHours} hours</p>

                    <p className="vh-description">{item.description}</p>

                    <div className="vh-card-actions">
                      <button
                        className="vh-secondary-button"
                        onClick={() => setSelectedOpportunity(item)}
                      >
                        View Details
                      </button>

                      <button
                        className="vh-primary-button"
                        disabled={hasApplied(item.id)}
                        onClick={() => handleApply(item)}
                      >
                        {hasApplied(item.id) ? "Applied ✓" : "Apply Now"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* APPLICATIONS */}
        {activeTab === "applications" && (
          <section className="vh-panel">
            <div className="vh-section-header">
              <div>
                <h2>My Applications</h2>
                <p>Track your applications and staff decisions.</p>
              </div>
              <span className="vh-count">{myApplications.length} total</span>
            </div>

            <div className="vh-filters">
              <select
                value={applicationFilter}
                onChange={(event) => setApplicationFilter(event.target.value)}
                aria-label="Filter applications"
              >
                {["All", "Pending", "Accepted", "Rejected", "Completed"].map(
                  (status) => (
                    <option key={status}>{status}</option>
                  ),
                )}
              </select>
            </div>

            {visibleApplications.length === 0 ? (
              <div className="vh-empty">
                <h3>No applications to display</h3>
                <p>
                  Apply for an opportunity to get started, or try another
                  filter.
                </p>
                <button
                  className="vh-primary-button"
                  onClick={() => showTab("opportunities")}
                >
                  Browse Opportunities
                </button>
              </div>
            ) : (
              <div className="vh-application-list">
                {visibleApplications.map((item) => (
                  <div className="vh-application-row" key={item.id}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>
                        {item.location} · {formatDate(item.date)}
                      </p>
                      <small>
                        Applied {formatDate(item.appliedAt?.slice(0, 10))}
                      </small>
                    </div>

                    <div className="vh-application-actions">
                      <StatusBadge status={item.status} />

                      <button
                        className="vh-secondary-button"
                        onClick={() => setSelectedApplication(item)}
                      >
                        View Application
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="vh-muted">
              Application statuses are read-only. Only staff can approve, reject
              or complete applications.
            </p>
          </section>
        )}

        {/* IMPACT */}
        {activeTab === "impact" && (
          <div className="vh-overview-grid">
            <section className="vh-panel">
              <h2>My Volunteering Progress</h2>
              <p className="vh-muted">
                Hours are calculated from activities marked Completed by staff.
              </p>

              <div className="vh-impact-number">
                {completedHours}
                <small> / {goalHours} hours</small>
              </div>

              <div className="vh-progress">
                <div style={{ width: `${progress}%` }} />
              </div>

              <p>{progress}% of your goal completed</p>

              <div className="vh-achievements">
                <span>
                  🌱 First Application {myApplications.length ? "✓" : "🔒"}
                </span>
                <span>
                  🤝 Accepted Volunteer{" "}
                  {myApplications.some(
                    (item) =>
                      item.status === "Accepted" || item.status === "Completed",
                  )
                    ? "✓"
                    : "🔒"}
                </span>
                <span>
                  🏆 First Completed Activity{" "}
                  {completedApplications.length ? "✓" : "🔒"}
                </span>
              </div>
            </section>

            <section className="vh-panel">
              <h2>Activity History</h2>

              {completedApplications.length === 0 ? (
                <div className="vh-empty">
                  <h3>No completed activities yet</h3>
                  <p>Your volunteering history will appear here.</p>
                </div>
              ) : (
                completedApplications.map((item) => (
                  <div className="vh-list-row" key={item.id}>
                    <div>
                      <strong>{item.title}</strong>
                      <small>{formatDate(item.date)}</small>
                    </div>
                    <span className="vh-category">
                      +{item.durationHours} hrs
                    </span>
                  </div>
                ))
              )}
            </section>
          </div>
        )}

        {/* CALENDAR / EVENT AGENDA */}
        {activeTab === "calendar" && (
          <section className="vh-panel">
            <div className="vh-section-header">
              <div>
                <h2>Upcoming Events</h2>
                <p>Your community volunteering calendar.</p>
              </div>
            </div>

            {upcoming.length === 0 ? (
              <div className="vh-empty">
                <h3>No upcoming events</h3>
                <p>Check back for new opportunities.</p>
              </div>
            ) : (
              upcoming.map((item) => (
                <div className="vh-calendar-row" key={item.id}>
                  <div className="vh-calendar-date">
                    <strong>
                      {new Date(`${item.date}T12:00:00`).getDate()}
                    </strong>
                    <span>
                      {new Intl.DateTimeFormat("en-GB", {
                        month: "short",
                      }).format(new Date(`${item.date}T12:00:00`))}
                    </span>
                  </div>

                  <div className="vh-calendar-info">
                    <h3>{item.title}</h3>
                    <p>
                      {item.location} · {item.startTime} · {item.durationHours}{" "}
                      hours
                    </p>
                  </div>

                  <button
                    className="vh-secondary-button"
                    onClick={() => setSelectedOpportunity(item)}
                  >
                    Details
                  </button>
                </div>
              ))
            )}
          </section>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <section className="vh-panel">
            <div className="vh-section-header">
              <div>
                <h2>My Profile</h2>
                <p>Manage your volunteering preferences.</p>
              </div>

              <button
                className="vh-primary-button"
                onClick={() => {
                  setProfileDraft(profile);
                  setEditingProfile(true);
                }}
              >
                Edit Profile
              </button>
            </div>

            <div className="vh-profile-grid">
              {[
                ["Full Name", profile.name],
                ["Email", profile.email],
                ["City", profile.city],
                ["Interests", profile.interests],
                ["Volunteer Goal", `${goalHours} hours`],
              ].map(([label, value]) => (
                <div key={label}>
                  <small>{label}</small>
                  <strong>{value || "Not set"}</strong>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* OPPORTUNITY DETAILS MODAL */}
      {selectedOpportunity && (
        <Modal
          title="Opportunity Details"
          onClose={() => setSelectedOpportunity(null)}
        >
          <div className="vh-modal-content">
            <span className="vh-category">{selectedOpportunity.category}</span>

            <h3>{selectedOpportunity.title}</h3>
            <p>{selectedOpportunity.description}</p>

            <div className="vh-detail-grid">
              {[
                ["Location", selectedOpportunity.location],
                ["Date", formatDate(selectedOpportunity.date)],
                ["Start Time", selectedOpportunity.startTime],
                ["Duration", `${selectedOpportunity.durationHours} hours`],
                ["Capacity", `${selectedOpportunity.capacity} places`],
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
              className="vh-primary-button vh-full-button"
              disabled={hasApplied(selectedOpportunity.id)}
              onClick={() => handleApply(selectedOpportunity)}
            >
              {hasApplied(selectedOpportunity.id)
                ? "Already Applied ✓"
                : "Apply for this Opportunity"}
            </button>
          </div>
        </Modal>
      )}

      {/* APPLICATION DETAILS MODAL */}
      {selectedApplication && (
        <Modal
          title="Application Details"
          onClose={() => setSelectedApplication(null)}
        >
          <div className="vh-modal-content">
            <h3>{selectedApplication.title}</h3>

            <StatusBadge
              status={
                applications.find((item) => item.id === selectedApplication.id)
                  ?.status || selectedApplication.status
              }
            />

            <div className="vh-detail-grid">
              <div>
                <small>Location</small>
                <strong>{selectedApplication.location}</strong>
              </div>
              <div>
                <small>Event Date</small>
                <strong>{formatDate(selectedApplication.date)}</strong>
              </div>
              <div>
                <small>Application Reference</small>
                <strong>{selectedApplication.id.slice(0, 8)}</strong>
              </div>
              <div>
                <small>Applied On</small>
                <strong>
                  {formatDate(selectedApplication.appliedAt?.slice(0, 10))}
                </strong>
              </div>
            </div>

            <p className="vh-muted">Staff manage all application decisions.</p>
          </div>
        </Modal>
      )}

      {/* EDIT PROFILE MODAL */}
      {editingProfile && (
        <Modal title="Edit Profile" onClose={() => setEditingProfile(false)}>
          <form className="vh-profile-form" onSubmit={saveProfile}>
            <label>
              Full Name
              <input
                required
                value={profileDraft.name}
                onChange={(event) =>
                  setProfileDraft((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Email Address
              <input
                type="email"
                required
                value={profileDraft.email}
                onChange={(event) =>
                  setProfileDraft((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              City
              <input
                value={profileDraft.city}
                onChange={(event) =>
                  setProfileDraft((previous) => ({
                    ...previous,
                    city: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Interests
              <input
                value={profileDraft.interests}
                onChange={(event) =>
                  setProfileDraft((previous) => ({
                    ...previous,
                    interests: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Volunteering Hours Goal
              <input
                type="number"
                min="1"
                max="1000"
                value={profileDraft.goalHours}
                onChange={(event) =>
                  setProfileDraft((previous) => ({
                    ...previous,
                    goalHours: event.target.value,
                  }))
                }
              />
            </label>

            <div className="vh-form-actions">
              <button
                type="button"
                className="vh-secondary-button"
                onClick={() => setEditingProfile(false)}
              >
                Cancel
              </button>

              <button type="submit" className="vh-primary-button">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toast && (
        <div className="vh-toast" role="status">
          ✓ {toast}
        </div>
      )}

      <footer className="vh-footer">
        VolunteerHub · Frontend demo · No backend connected
      </footer>
    </div>
  );
}
