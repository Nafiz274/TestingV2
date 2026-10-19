import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

function Signup() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: "",
    surname: "",
    username: "",
    birthday: "",
    email: "",
    phone: "",
    password: "",
    verify_password: "",
  });

  // Update input values and clear errors when corrected
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      passwordRequirements: "",
    }));
  }

  // Password requirements
  const hasLength = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(formData.password);
  const passwordsMatch =
    formData.password.length > 0 &&
    formData.password === formData.verify_password;

  const passwordValid =
    hasLength && hasUppercase && hasSpecial && passwordsMatch;
  // Calculate password strength
  function calculatePasswordStrength(password) {
    if (!password) return 0;

    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  }

  const passwordStrength = calculatePasswordStrength(formData.password);

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const strengthColors = ["", "#dc2626", "#f59e0b", "#3b82f6", "#16a34a"];

  // Validate Step 1
  function handleNext() {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Please enter your first name.";
    }

    if (!formData.surname.trim()) {
      newErrors.surname = "Please enter your surname.";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Please enter your username.";
    }

    if (!formData.birthday) {
      newErrors.birthday = "Please enter your date of birth.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setStep(2);
    }
  }

  // Validate Step 2 and show success popup
  function handleSignup(e) {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone) {
      newErrors.phone = "Please enter your phone number.";
    } else if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    }

    if (!formData.verify_password) {
      newErrors.verify_password = "Please confirm your password.";
    }

    if (formData.password && formData.verify_password && !passwordValid) {
      newErrors.passwordRequirements = "Please meet all password requirements.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Demo only: no account is actually created
      setShowSuccess(true);
    }
  }

  return (
    <div className="signup-page">
      <div className="login-container">
        <h1>Create an Account</h1>
        <p>Please enter your details to sign up.</p>

        <form id="signupForm" onSubmit={handleSignup} noValidate>
          {step === 1 && (
            <div className="signup-step">
              <h3>Personal Information</h3>

              <div className="name-row">
                <div>
                  <label htmlFor="first_name">First Name:</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    placeholder="Enter first name"
                    value={formData.first_name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.first_name)}
                    required
                  />
                  {errors.first_name && (
                    <span className="field-error">{errors.first_name}</span>
                  )}
                </div>

                <div>
                  <label htmlFor="surname">Surname:</label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    placeholder="Enter surname"
                    value={formData.surname}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.surname)}
                    required
                  />
                  {errors.surname && (
                    <span className="field-error">{errors.surname}</span>
                  )}
                </div>
              </div>

              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                aria-invalid={Boolean(errors.username)}
                required
              />
              {errors.username && (
                <span className="field-error">{errors.username}</span>
              )}

              <label htmlFor="birthday">Date of Birth:</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                aria-invalid={Boolean(errors.birthday)}
                required
              />
              {errors.birthday && (
                <span className="field-error">{errors.birthday}</span>
              )}

              <button type="button" onClick={handleNext}>
                Next →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="signup-step">
              <h3>Account Details</h3>

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                required
              />
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}

              <label htmlFor="phone">Phone Number:</label>

              <PhoneInput
                id="phone"
                international
                defaultCountry="GB"
                countryCallingCodeEditable={false}
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(value) => {
                  setFormData((previous) => ({
                    ...previous,
                    phone: value || "",
                  }));

                  setErrors((previous) => ({
                    ...previous,
                    phone: "",
                  }));
                }}
                className={errors.phone ? "phone-error" : ""}
              />
              {errors.phone && (
                <span className="field-error">{errors.phone}</span>
              )}

              <label htmlFor="password">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.password)}
                required
              />
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${passwordStrength * 25}%`,
                        backgroundColor: strengthColors[passwordStrength],
                      }}
                    />
                  </div>

                  <p
                    className="strength-label"
                    style={{
                      color: strengthColors[passwordStrength],
                    }}
                  >
                    Password Strength: {strengthLabels[passwordStrength]}
                  </p>
                </div>
              )}
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}

              <label htmlFor="verify_password">Confirm Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                id="verify_password"
                name="verify_password"
                placeholder="Confirm password"
                value={formData.verify_password}
                onChange={handleChange}
                aria-invalid={Boolean(errors.verify_password)}
                required
              />
              {errors.verify_password && (
                <span className="field-error">{errors.verify_password}</span>
              )}

              <button
                type="button"
                id="togglePassword"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>

              {/* Live password requirements */}
              <div id="passwordRequirements">
                <p className={hasLength ? "valid" : "invalid"}>
                  {hasLength ? "✓" : "✗"} At least 8 characters
                </p>

                <p className={hasUppercase ? "valid" : "invalid"}>
                  {hasUppercase ? "✓" : "✗"} At least 1 uppercase letter
                </p>

                <p className={hasSpecial ? "valid" : "invalid"}>
                  {hasSpecial ? "✓" : "✗"} At least 1 special character
                </p>

                <p className={passwordsMatch ? "valid" : "invalid"}>
                  {passwordsMatch ? "✓" : "✗"} Passwords match
                </p>
              </div>

              {errors.passwordRequirements && (
                <span className="field-error">
                  {errors.passwordRequirements}
                </span>
              )}

              <button type="button" onClick={() => setStep(1)}>
                ← Back
              </button>

              <button type="submit">Sign Up</button>
            </div>
          )}
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      {/* Success popup */}
      {showSuccess && (
        <div className="popup" role="dialog" aria-modal="true">
          <div className="popup-content">
            <button
              type="button"
              id="closePopup"
              aria-label="Close popup"
              onClick={() => setShowSuccess(false)}
            >
              ×
            </button>

            <img src="/tick.gif" alt="Success" className="success-gif" />

            <h2>Successfully Signed Up!</h2>
            <p>
              This is a demo signup. No account has been created or verification
              email sent yet.
            </p>

            <Link to="/login" className="continue-login">
              Continue to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
