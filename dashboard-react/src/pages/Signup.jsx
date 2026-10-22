import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const USERS_KEY = "volunteerhub.demo.users.v1";
const PROFILE_KEY = "volunteerhub.volunteer.profile.v1";
const SESSION_KEY = "volunteerhub.demo.session.v1";

const DEMO_EMAILS = ["staff@volunteerhub.com", "volunteer@volunteerhub.com"];

function readUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (!password) return { score: 0, label: "" };
  if (score <= 1) return { score, label: "Weak" };
  if (score <= 3) return { score, label: "Medium" };

  return { score, label: "Strong" };
}

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    password: "",
    confirmPassword: "",
    role: "volunteer",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  }

  function validateForm() {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.city.trim()
    ) {
      return "Please complete all required fields.";
    }

    if (form.password.length < 8) {
      return "Your password must be at least 8 characters.";
    }

    if (!/[A-Z]/.test(form.password)) {
      return "Your password must contain an uppercase letter.";
    }

    if (!/[0-9]/.test(form.password)) {
      return "Your password must contain a number.";
    }

    if (form.password !== form.confirmPassword) {
      return "Your passwords do not match.";
    }

    if (!form.agreeToTerms) {
      return "Please acknowledge the demo account notice.";
    }

    return "";
  }

  function handleSignup(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const existingUsers = readUsers();
    const email = form.email.trim().toLowerCase();

    const alreadyExists =
      DEMO_EMAILS.includes(email) ||
      existingUsers.some((user) => user.email.toLowerCase() === email);

    if (alreadyExists) {
      setError("An account with this email already exists.");
      return;
    }

    setLoading(true);

    const user = {
      id: crypto.randomUUID(),
      name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      email,
      password: form.password,
      role: form.role,
      city: form.city.trim(),
      createdAt: new Date().toISOString(),
    };

    // Demo only: real passwords must NEVER be stored in localStorage.
    localStorage.setItem(USERS_KEY, JSON.stringify([...existingUsers, user]));

    if (form.role === "volunteer") {
      const profile = {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        interests: "",
        goalHours: 20,
      };

      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }

    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      loggedInAt: new Date().toISOString(),
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

    setLoading(false);

    navigate(
      form.role === "staff" ? "/staff/dashboard" : "/volunteer/dashboard",
    );
  }

  return (
    <div className="auth-page">
      <header className="auth-navbar">
        <Link to="/" className="auth-logo">
          Volunteer<span>Hub</span>
        </Link>

        <Link to="/" className="auth-back-link">
          ← Back to Home
        </Link>
      </header>

      <main className="auth-main">
        <section className="auth-brand-panel">
          <div className="auth-brand-content">
            <span className="auth-brand-eyebrow">💜 JOIN OUR COMMUNITY</span>

            <h1>
              Be the Change.
              <br />
              <span>Make an Impact.</span>
            </h1>

            <p>
              Join VolunteerHub and connect with opportunities that help you
              give back to your community.
            </p>

            <div className="auth-brand-illustration">
              <div className="auth-illustration-main">
                <span className="auth-illustration-icon">🌍</span>

                <h3>Every Volunteer Matters</h3>
                <p>Small actions create lasting change.</p>

                <div className="auth-illustration-items">
                  <div>
                    <span>🤝</span>
                    <strong>Connect with Communities</strong>
                    <span>✓</span>
                  </div>

                  <div>
                    <span>🌱</span>
                    <strong>Support Local Causes</strong>
                    <span>✓</span>
                  </div>

                  <div>
                    <span>🏆</span>
                    <strong>Track Your Achievements</strong>
                    <span>✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-brand-footer">
              VolunteerHub · Together We Make a Difference
            </div>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-container">
            <div className="auth-form-heading">
              <span className="auth-eyebrow">GET STARTED</span>

              <h2>Create your account</h2>

              <p>Join VolunteerHub and start making a difference.</p>
            </div>

            <div className="auth-role-selector">
              <button
                type="button"
                className={form.role === "volunteer" ? "active" : ""}
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    role: "volunteer",
                  }))
                }
              >
                <span>🙋</span>
                Volunteer
              </button>

              <button
                type="button"
                className={form.role === "staff" ? "active" : ""}
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    role: "staff",
                  }))
                }
              >
                <span>🧑‍💼</span>
                Staff
              </button>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                ⚠ {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSignup}>
              <div className="auth-form-grid">
                <div className="auth-field">
                  <label htmlFor="signup-first-name">First Name *</label>

                  <input
                    id="signup-first-name"
                    name="firstName"
                    value={form.firstName}
                    onChange={updateField}
                    placeholder="First name"
                    autoComplete="given-name"
                    required
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="signup-last-name">Last Name *</label>

                  <input
                    id="signup-last-name"
                    name="lastName"
                    value={form.lastName}
                    onChange={updateField}
                    placeholder="Last name"
                    autoComplete="family-name"
                    required
                  />
                </div>
              </div>

              <label htmlFor="signup-email">Email Address *</label>

              <input
                id="signup-email"
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />

              <label htmlFor="signup-city">City *</label>

              <input
                id="signup-city"
                name="city"
                value={form.city}
                onChange={updateField}
                placeholder="e.g. Edinburgh"
                autoComplete="address-level2"
                required
              />

              <label htmlFor="signup-password">Password *</label>

              <div className="auth-password-wrapper">
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={updateField}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {form.password && (
                <div className="auth-password-strength">
                  <div className="auth-strength-bars">
                    {[1, 2, 3, 4].map((level) => (
                      <span
                        key={level}
                        className={
                          level <= passwordStrength.score
                            ? `filled ${passwordStrength.label.toLowerCase()}`
                            : ""
                        }
                      />
                    ))}
                  </div>

                  <small>
                    Password Strength: <strong>{passwordStrength.label}</strong>
                  </small>
                </div>
              )}

              <p className="auth-password-hint">
                Use at least 8 characters, one uppercase letter and one number.
              </p>

              <label htmlFor="signup-confirm-password">
                Confirm Password *
              </label>

              <div className="auth-password-wrapper">
                <input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={updateField}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              {form.confirmPassword && (
                <small
                  className={
                    form.password === form.confirmPassword
                      ? "auth-match"
                      : "auth-no-match"
                  }
                >
                  {form.password === form.confirmPassword
                    ? "✓ Passwords match"
                    : "✕ Passwords do not match"}
                </small>
              )}

              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={form.agreeToTerms}
                  onChange={updateField}
                  required
                />

                <span>
                  I understand this is a frontend demonstration and not a secure
                  production account.
                </span>
              </label>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account →"}
              </button>
            </form>

            <p className="auth-switch-text">
              Already have an account?{" "}
              <Link to={`/login?role=${form.role}`}>Sign In</Link>
            </p>

            <p className="auth-security-note">
              🔒 Your account will be stored locally for this frontend
              demonstration only.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
