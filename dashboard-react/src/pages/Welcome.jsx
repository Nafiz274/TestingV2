import { useState } from "react";
import { Link } from "react-router-dom";
import "./Welcome.css";

const features = [
  {
    icon: "🔎",
    title: "Discover Opportunities",
    description:
      "Find volunteering activities that match your interests, location and availability.",
  },
  {
    icon: "📋",
    title: "Track Applications",
    description:
      "Apply for opportunities and keep track of your application progress.",
  },
  {
    icon: "💜",
    title: "Measure Your Impact",
    description:
      "See your completed activities, volunteering hours and achievements.",
  },
  {
    icon: "🤝",
    title: "Connect Communities",
    description:
      "Help organisations and volunteers work together to make a difference.",
  },
];

const steps = [
  {
    number: "01",
    title: "Join VolunteerHub",
    description: "Choose your role and access your personalised dashboard.",
  },
  {
    number: "02",
    title: "Find Your Opportunity",
    description:
      "Browse activities, review details and apply for volunteering roles.",
  },
  {
    number: "03",
    title: "Make an Impact",
    description: "Take part in activities and track your volunteering journey.",
  },
];

const featuredOpportunities = [
  {
    id: 1,
    icon: "🥫",
    category: "Community",
    title: "Community Food Bank",
    location: "Edinburgh",
    duration: "4 hours",
    description:
      "Support local families by helping prepare and distribute food parcels.",
  },
  {
    id: 2,
    icon: "🌱",
    category: "Environment",
    title: "Park Clean-Up",
    location: "Glasgow",
    duration: "3 hours",
    description:
      "Help keep public green spaces clean and welcoming for everyone.",
  },
  {
    id: 3,
    icon: "📚",
    category: "Education",
    title: "Youth Mentoring",
    location: "Edinburgh",
    duration: "2 hours",
    description:
      "Support young people as they build confidence and develop skills.",
  },
];

const faqs = [
  {
    question: "What is VolunteerHub?",
    answer:
      "VolunteerHub is a platform that helps volunteers discover opportunities and allows organisations to manage volunteering activities.",
  },
  {
    question: "How do I apply for an opportunity?",
    answer:
      "Enter the Volunteer Dashboard, explore the available opportunities, review the details and select Apply Now.",
  },
  {
    question: "How can I check my application status?",
    answer:
      "Open My Applications in your Volunteer Dashboard to view whether your application is Pending, Accepted, Rejected or Completed.",
  },
  {
    question: "What can staff members do?",
    answer:
      "Staff can create and manage opportunities, review applications, manage volunteers and monitor participation.",
  },
  {
    question: "Is this connected to a real database?",
    answer:
      "This version is a frontend prototype. Demonstration data is stored locally in the browser until a backend is connected.",
  },
];

// Reusable feature card component.
function FeatureCard({ icon, title, description }) {
  return (
    <article className="welcome-feature-card">
      <div className="welcome-feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

// Reusable opportunity card component.
function OpportunityCard({ opportunity }) {
  return (
    <article className="welcome-opportunity-card">
      <div className="welcome-opportunity-image">
        <span>{opportunity.icon}</span>
      </div>

      <div className="welcome-opportunity-content">
        <span className="welcome-category">{opportunity.category}</span>

        <h3>{opportunity.title}</h3>

        <p>{opportunity.description}</p>

        <div className="welcome-opportunity-meta">
          <span>📍 {opportunity.location}</span>
          <span>⏱ {opportunity.duration}</span>
        </div>

        <Link to="/login?role=volunteer" className="welcome-opportunity-link">
          Explore Opportunity <span>→</span>
        </Link>
      </div>
    </article>
  );
}

export default function Welcome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  function toggleFaq(index) {
    setOpenFaq((previous) => (previous === index ? null : index));
  }

  return (
    <div className="welcome-page">
      {/* NAVIGATION */}
      <header className="welcome-navbar">
        <Link to="/" className="welcome-logo" onClick={closeMenu}>
          Volunteer<span>Hub</span>
        </Link>

        <button
          type="button"
          className="welcome-mobile-toggle"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          aria-label="Toggle navigation"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        <nav className={`welcome-nav ${mobileMenuOpen ? "open" : ""}`}>
          <a href="#features" onClick={closeMenu}>
            Features
          </a>

          <a href="#how-it-works" onClick={closeMenu}>
            How It Works
          </a>

          <a href="#opportunities" onClick={closeMenu}>
            Opportunities
          </a>

          <a href="#faq" onClick={closeMenu}>
            FAQs
          </a>

          <Link
            to="/login?role=staff"
            className="welcome-staff-nav"
            onClick={closeMenu}
          >
            Staff Login
          </Link>

          <Link
            to="/login?role=volunteer"
            className="welcome-nav-button"
            onClick={closeMenu}
          >
            Get Started →
          </Link>
        </nav>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="welcome-hero">
          <div className="welcome-hero-inner">
            <div className="welcome-hero-content">
              <span className="welcome-eyebrow">
                <span className="welcome-live-dot" />
                CONNECTING PEOPLE WITH PURPOSE
              </span>

              <h1>
                Small Actions.
                <br />
                <span>Big Impact.</span>
              </h1>

              <p className="welcome-hero-description">
                Discover meaningful volunteering opportunities, connect with
                your community and make a difference — all in one place.
              </p>

              <div className="welcome-hero-actions">
                <Link
                  to="/login?role=volunteer"
                  className="welcome-primary-button"
                >
                  Start Volunteering <span>→</span>
                </Link>

                <a href="#how-it-works" className="welcome-secondary-button">
                  See How It Works
                </a>
              </div>

              <div className="welcome-hero-highlights">
                <div>
                  <span>✓</span>
                  Discover local opportunities
                </div>

                <div>
                  <span>✓</span>
                  Track your progress
                </div>

                <div>
                  <span>✓</span>
                  Make a difference
                </div>
              </div>
            </div>

            {/* CSS-built illustration: no image package needed */}
            <div className="welcome-hero-visual">
              <div className="welcome-visual-glow" />

              <div className="welcome-floating-icon welcome-icon-one">💜</div>

              <div className="welcome-floating-icon welcome-icon-two">🌱</div>

              <div className="welcome-floating-icon welcome-icon-three">✨</div>

              <div className="welcome-illustration-card">
                <div className="welcome-illustration-top">
                  <div className="welcome-illustration-avatar">🤝</div>

                  <div>
                    <strong>Make a Difference</strong>
                    <span>Your journey starts here</span>
                  </div>
                </div>

                <div className="welcome-illustration-banner">
                  <span>🌍</span>
                  <div>
                    <strong>Find Your Purpose</strong>
                    <small>Your community needs people like you.</small>
                  </div>
                </div>

                <div className="welcome-illustration-items">
                  <div>
                    <span className="welcome-illustration-symbol">🥫</span>

                    <div>
                      <strong>Community Food Bank</strong>
                      <small>Help local families</small>
                    </div>

                    <span className="welcome-illustration-check">✓</span>
                  </div>

                  <div>
                    <span className="welcome-illustration-symbol">🌳</span>

                    <div>
                      <strong>Park Clean-Up</strong>
                      <small>Protect green spaces</small>
                    </div>

                    <span className="welcome-illustration-check">✓</span>
                  </div>

                  <div>
                    <span className="welcome-illustration-symbol">📚</span>

                    <div>
                      <strong>Youth Mentoring</strong>
                      <small>Inspire young people</small>
                    </div>

                    <span className="welcome-illustration-check">✓</span>
                  </div>
                </div>
              </div>

              <div className="welcome-impact-floating-card">
                <span>💜</span>
                <div>
                  <strong>Your Impact Matters</strong>
                  <small>Every hour makes a difference</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORM FEATURES */}
        <section className="welcome-section welcome-features" id="features">
          <div className="welcome-section-heading">
            <span className="welcome-section-eyebrow">WHY VOLUNTEERHUB?</span>

            <h2>
              Everything You Need to <span>Make an Impact</span>
            </h2>

            <p>
              A simple platform designed to make volunteering easier for
              individuals and organisations.
            </p>
          </div>

          <div className="welcome-feature-grid">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          className="welcome-section welcome-how-section"
          id="how-it-works"
        >
          <div className="welcome-section-heading">
            <span className="welcome-section-eyebrow">GETTING STARTED</span>

            <h2>
              How <span>VolunteerHub</span> Works
            </h2>

            <p>Three simple steps to start your volunteering journey.</p>
          </div>

          <div className="welcome-steps-grid">
            {steps.map((step) => (
              <div className="welcome-step-card" key={step.number}>
                <div className="welcome-step-number">{step.number}</div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED OPPORTUNITIES */}
        <section className="welcome-section" id="opportunities">
          <div className="welcome-section-heading">
            <span className="welcome-section-eyebrow">
              EXPLORE YOUR COMMUNITY
            </span>

            <h2>
              Find Opportunities That <span>Inspire You</span>
            </h2>

            <p>
              Explore some examples of the volunteering activities available
              through VolunteerHub.
            </p>
          </div>

          <div className="welcome-opportunities-grid">
            {featuredOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>

          <div className="welcome-center-action">
            <Link to="/login?role=volunteer" className="welcome-primary-button">
              Explore All Opportunities →
            </Link>
          </div>
        </section>

        {/* ROLE SELECTION */}
        <section className="welcome-section welcome-role-section">
          <div className="welcome-section-heading">
            <span className="welcome-section-eyebrow">BUILT FOR EVERYONE</span>

            <h2>
              One Platform. <span>Two Ways to Make a Difference.</span>
            </h2>

            <p>
              Whether you're looking to volunteer or manage community
              activities, we've got you covered.
            </p>
          </div>

          <div className="welcome-role-grid">
            <article className="welcome-role-card">
              <div className="welcome-role-icon">🙋</div>

              <span className="welcome-role-tag">FOR VOLUNTEERS</span>

              <h3>Ready to Give Back?</h3>

              <p>
                Discover opportunities, submit applications, manage your
                schedule and track your impact.
              </p>

              <ul>
                <li>✓ Browse local opportunities</li>
                <li>✓ Apply for volunteering roles</li>
                <li>✓ Track application statuses</li>
                <li>✓ View volunteering achievements</li>
              </ul>

              <Link
                to="/login?role=volunteer"
                className="welcome-primary-button"
              >
                Volunteer Login →
              </Link>
            </article>

            <article className="welcome-role-card welcome-role-staff">
              <div className="welcome-role-icon">🧑‍💼</div>

              <span className="welcome-role-tag">FOR ORGANISATIONS</span>

              <h3>Managing Volunteers?</h3>

              <p>
                Organise volunteering opportunities, review applications and
                oversee community activities.
              </p>

              <ul>
                <li>✓ Create and manage opportunities</li>
                <li>✓ Review volunteer applications</li>
                <li>✓ Manage volunteer participation</li>
                <li>✓ Monitor volunteering activity</li>
              </ul>

              <Link to="/login?role=staff" className="welcome-staff-button">
                Staff Login →
              </Link>
            </article>
          </div>
        </section>

        {/* FAQ */}
        <section className="welcome-section welcome-faq-section" id="faq">
          <div className="welcome-section-heading">
            <span className="welcome-section-eyebrow">
              FREQUENTLY ASKED QUESTIONS
            </span>

            <h2>
              Got <span>Questions?</span>
            </h2>

            <p>Here's everything you need to know to get started.</p>
          </div>

          <div className="welcome-faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  className={`welcome-faq-item ${isOpen ? "open" : ""}`}
                  key={faq.question}
                >
                  <button
                    type="button"
                    className="welcome-faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className="welcome-faq-symbol">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="welcome-faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="welcome-cta-section">
          <div className="welcome-cta-content">
            <span>💜 MAKE A DIFFERENCE TODAY</span>

            <h2>Your Community Needs You.</h2>

            <p>
              Every small action can create meaningful change. Start your
              volunteering journey with VolunteerHub.
            </p>

            <Link to="/login?role=volunteer" className="welcome-cta-button">
              Get Started Today →
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="welcome-footer">
        <div className="welcome-footer-inner">
          <div>
            <Link to="/" className="welcome-logo">
              Volunteer<span>Hub</span>
            </Link>

            <p>
              Connecting volunteers and communities, one opportunity at a time.
            </p>
          </div>

          <div className="welcome-footer-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#opportunities">Opportunities</a>
            <Link to="/login?role=staff">Staff Portal</Link>
          </div>
        </div>

        <div className="welcome-footer-bottom">
          <span>© {new Date().getFullYear()} VolunteerHub</span>
          <span>Frontend Prototype · Made for Community Impact</span>
        </div>
      </footer>
    </div>
  );
}
