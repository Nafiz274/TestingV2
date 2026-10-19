import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Update username and clear its error
  function handleUsernameChange(e) {
    setUsername(e.target.value);

    setErrors((previous) => ({
      ...previous,
      username: "",
    }));
  }

  // Update password and clear its error
  function handlePasswordChange(e) {
    setPassword(e.target.value);

    setErrors((previous) => ({
      ...previous,
      password: "",
    }));
  }

  // Validate login fields
  function handleLogin(e) {
    e.preventDefault();

    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Please enter your username.";
    }

    if (!password) {
      newErrors.password = "Please enter your password.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Demo login: no real authentication yet
      navigate("/dashboard");
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome Back!</h1>
        <p>Please enter your credentials to log in.</p>

        <form onSubmit={handleLogin} noValidate>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={handleUsernameChange}
            aria-invalid={Boolean(errors.username)}
            required
          />

          {errors.username && (
            <span className="field-error">{errors.username}</span>
          )}

          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={handlePasswordChange}
            aria-invalid={Boolean(errors.password)}
            required
          />

          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}

          <button
            type="button"
            id="togglePassword"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide Password" : "Show Password"}
          </button>

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
