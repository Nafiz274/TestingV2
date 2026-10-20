import { Link } from "react-router-dom";
import { useState } from "react";
import "./Welcome.css";

function Welcome() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="welcome-page">
      {/* Navigation */}
      <nav className="welcome-navbar">
        <Link to="/" className="welcome-logo">
          <span className="logo-symbol">♥</span>
          Volunteer<span>Hub</span>
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <div className={`welcome-nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#opportunities" onClick={() => setMenuOpen(false)}>
            Opportunities
          </a>
          <Link to="/login?role=staff" className="staff-nav-link">
            Staff Login
          </Link>
        </div>
      </nav>

      {/* Hero section */}
      <main>
        <section className="welcome-hero">
          <div className="hero-text">
            <span className="hero-tag">✦ Together, we make a difference</span>

            <h1>
              Small Actions.
              <br />
              <span>Big Impact.</span>
            </h1>

            <p>
              Discover meaningful volunteering opportunities, connect with your
              community, and make every hour count.
            </p>

            <div className="hero-buttons">
              <Link to="/signup" className="welcome-primary">
                Become a Volunteer <span>→</span>
              </Link>

              <Link to="/login?role=volunteer" className="welcome-secondary">
                Already a Volunteer? Login
              </Link>
            </div>

            <div className="hero-highlights">
              <span>✓ Discover opportunities</span>
              <span>✓ Track your impact</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-illustration">
              <div className="illustration-icon">🤝</div>
              <h2>Make a Difference</h2>
              <p>Your community needs people like you.</p>
            </div>

            <div className="floating-card floating-card-top">
              <span>💜</span>
              <div>
                <strong>Give Back</strong>
                <small>Support your community</small>
              </div>
            </div>

            <div className="floating-card floating-card-bottom">
              <span>🌱</span>
              <div>
                <strong>Grow Together</strong>
                <small>Every action matters</small>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="about" className="welcome-about">
          <div className="section-heading">
            <span className="section-tag">WHY VOLUNTEERHUB?</span>
            <h2>Make your time matter.</h2>
            <p>
              Everything you need to start volunteering and see the difference
              you're making.
            </p>
          </div>

          <div className="welcome-features">
            <div className="feature-card">
              <div className="feature-icon">🔎</div>
              <h3>Find Opportunities</h3>
              <p>
                Explore volunteering opportunities that match your interests and
                availability.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Your Impact</h3>
              <p>
                Keep track of your volunteering hours, activities and personal
                contributions.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Connect With Others</h3>
              <p>
                Join a community of volunteers working together to create
                positive change.
              </p>
            </div>
          </div>
        </section>

        {/* Volunteer Stories */}
        <section className="volunteer-stories" id="stories">
          <div className="section-heading">
            <span className="section-tag">VOLUNTEER STORIES</span>
            <h2>Stories That Inspire</h2>
            <p>
              Discover how volunteering can bring people together and make a
              difference in local communities.
            </p>
          </div>

          {/* Stories Grid */}
          <div className="stories-grid">
            <div className="story-card">
              <div className="story-quote">“</div>

              <p className="story-text">
                Volunteering helped me meet amazing people and feel more
                connected to my community. It's been such a rewarding
                experience.
              </p>

              <div className="story-person">
                <div className="story-avatar">AM</div>
                <div>
                  <h3>Aisha M.</h3>
                  <span>Community Volunteer</span>
                </div>
              </div>
            </div>

            <div className="story-card">
              <div className="story-quote">“</div>

              <p className="story-text">
                Even a few hours each week can make a genuine difference.
                Helping at the local food bank has been incredibly fulfilling.
              </p>

              <div className="story-person">
                <div className="story-avatar">JR</div>
                <div>
                  <h3>James R.</h3>
                  <span>Food Bank Volunteer</span>
                </div>
              </div>
            </div>

            <div className="story-card">
              <div className="story-quote">“</div>

              <p className="story-text">
                I started volunteering to gain experience, but I ended up
                gaining confidence, new skills and some great friendships.
              </p>

              <div className="story-person">
                <div className="story-avatar">SP</div>
                <div>
                  <h3>Sarah P.</h3>
                  <span>Youth Mentor</span>
                </div>
              </div>
            </div>
          </div>

          <p className="stories-disclaimer">
            Example stories created for demonstration purposes.
          </p>
        </section>

        {/* Final call to action */}
        <section id="opportunities" className="welcome-cta">
          <div className="cta-content">
            <h2>Ready to make a difference?</h2>
            <p>
              Your volunteering journey starts here. Take the first step today.
            </p>

            <Link to="/signup" className="cta-button">
              Get Started →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="welcome-footer">
        <strong>♥ VolunteerHub</strong>
        <p>Connecting people. Creating impact.</p>
        <span>© {new Date().getFullYear()} VolunteerHub</span>
      </footer>
    </div>
  );
}

export default Welcome;
