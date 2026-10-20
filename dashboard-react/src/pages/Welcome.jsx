import { Link } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
  return (
    <div className="welcome-page">
      <nav className="welcome-navbar">
        <h2>VolunteerHub</h2>

        <div className="welcome-nav-links">
          <Link to="/login?role=volunteer">Volunteer Login</Link>
          <Link to="/login?role=staff">Staff Login</Link>
        </div>
      </nav>

      <main className="welcome-content">
        <h1>Welcome to VolunteerHub</h1>

        <p>
          Connecting volunteers with meaningful opportunities to make a
          difference in their communities.
        </p>

        <div className="welcome-actions">
          <Link to="/signup" className="welcome-primary">
            Become a Volunteer
          </Link>

          <Link to="/login?role=volunteer" className="welcome-secondary">
            Already a Volunteer? Login
          </Link>
        </div>

        <section className="welcome-info">
          <h2>Why VolunteerHub?</h2>

          <div className="welcome-features">
            <div>
              <h3>Find Opportunities</h3>
              <p>Discover volunteering events and activities.</p>
            </div>

            <div>
              <h3>Track Your Impact</h3>
              <p>Keep track of your volunteering hours.</p>
            </div>

            <div>
              <h3>Make a Difference</h3>
              <p>Support causes that matter to your community.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Welcome;
