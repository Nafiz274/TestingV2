import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./Auth.css";

const USERS_KEY = "volunteerhub.demo.users.v1";
const SESSION_KEY = "volunteerhub.demo.session.v1";

const DEMO_ACCOUNTS = [
  {
    id: "demo-staff",
    name: "Staff Member",
    email: "staff@volunteerhub.com",
    password: "Staff123!",
    role: "staff",
  },
  {
    id: "volunteer-demo",
    name: "Volunteer",
    email: "volunteer@volunteerhub.com",
    password: "Volunteer123!",
    role: "volunteer",
  },
];

function readUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function PasswordInput({ value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-password-wrapper">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        autoComplete="current-password"
      />

      <button
        type="button"
        className="auth-password-toggle"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const requestedRole = searchParams.get("role");
  const initialRole = requestedRole === "staff" ? "staff" : "volunteer";

  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(searchParams.get("role") === "staff" ? "staff" : "volunteer");
  }, [searchParams]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  function handleLogin(event) {
    event.preventDefault();
    setError("");

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    // Simulated login. Replace with a backend API later.
    const allUsers = [...DEMO_ACCOUNTS, ...readUsers()];

    const user = allUsers.find(
      (account) =>
        account.email.toLowerCase() === email &&
        account.password === password &&
        account.role === role,
    );

    if (!user) {
      setError("Incorrect login details or account role. Please try again.");
      setLoading(false);
      return;
    }

    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      loggedInAt: new Date().toISOString(),
    };

    const storage = rememberMe ? localStorage : sessionStorage;

    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    storage.setItem(SESSION_KEY, JSON.stringify(session));

    setLoading(false);

    navigate(role === "staff" ? "/staff/dashboard" : "/volunteer/dashboard");
  }

  function fillDemoAccount() {
    const demo = DEMO_ACCOUNTS.find((account) => account.role === role);

    setForm({
      email: demo.email,
      password: demo.password,
    });

    setError("");
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
            <span className="auth-brand-eyebrow">💜 WELCOME BACK</span>

            <h1>
              Your Journey.
              <br />
              <span>Your Impact.</span>
            </h1>

            <p>
              Connect with your community, discover meaningful opportunities and
              make every volunteering hour count.
            </p>

            <div className="auth-brand-illustration">
              <div className="auth-illustration-main">
                <span className="auth-illustration-icon">🤝</span>
                <h3>Making a Difference Together</h3>
                <p>Every action creates a positive impact.</p>

                <div className="auth-illustration-items">
                  <div>
                    <span>🌱</span>
                    <strong>Community Projects</strong>
                    <span>✓</span>
                  </div>

                  <div>
                    <span>📚</span>
                    <strong>Education & Mentoring</strong>
                    <span>✓</span>
                  </div>

                  <div>
                    <span>💜</span>
                    <strong>Volunteer Impact</strong>
                    <span>✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-brand-footer">
              VolunteerHub · Connecting People with Purpose
            </div>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-container">
            <div className="auth-form-heading">
              <span className="auth-eyebrow">WELCOME BACK</span>

              <h2>Sign in to your account</h2>

              <p>Choose your role and enter your login details.</p>
            </div>

            <div className="auth-role-selector">
              <button
                type="button"
                className={role === "volunteer" ? "active" : ""}
                onClick={() => {
                  setRole("volunteer");
                  setError("");
                }}
              >
                <span>🙋</span>
                Volunteer
              </button>

              <button
                type="button"
                className={role === "staff" ? "active" : ""}
                onClick={() => {
                  setRole("staff");
                  setError("");
                }}
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

            <form className="auth-form" onSubmit={handleLogin}>
              <label htmlFor="login-email">Email Address</label>

              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={updateField}
                autoComplete="email"
                required
              />

              <div className="auth-label-row">
                <label htmlFor="login-password">Password</label>
              </div>

              <PasswordInput
                value={form.password}
                onChange={(event) =>
                  updateField({
                    target: {
                      name: "password",
                      value: event.target.value,
                    },
                  })
                }
                placeholder="Enter your password"
              />

              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Remember me
              </label>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In →"}
              </button>
            </form>

            <div className="auth-divider">
              <span>DEMO ACCESS</span>
            </div>

            <div className="auth-demo-box">
              <div>
                <strong>Try the {role} dashboard</strong>
                <p>Fill in a demo account to explore the platform.</p>
              </div>

              <button type="button" onClick={fillDemoAccount}>
                Use Demo Account
              </button>
            </div>

            <p className="auth-switch-text">
              Don't have an account? <Link to="/signup">Create an Account</Link>
            </p>

            <p className="auth-security-note">
              🔒 Frontend demonstration only. Real authentication will be
              handled by the backend.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
