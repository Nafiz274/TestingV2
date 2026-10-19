const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("togglePassword");
const confirmPassword = document.getElementById("verify_password");

toggleButton.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    if (confirmPassword) confirmPassword.type = "text";
    toggleButton.textContent = "Hide Password";
  } else {
    passwordInput.type = "password";
    if (confirmPassword) confirmPassword.type = "password"; // Toggle confirm password field if it exists
    toggleButton.textContent = "Show Password";
  }
});

// Password match validation
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  function checkPasswords() {
    const password = passwordInput.value;
    const confirm = confirmPassword.value;

    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      match: password.length > 0 && password === confirm,
    };

    for (const [id, valid] of Object.entries(checks)) {
      const element = document.getElementById(id);

      element.classList.toggle("valid", valid);
      element.classList.toggle("invalid", !valid);
      element.textContent =
        (valid ? "✓ " : "✗ ") + element.textContent.slice(2);
    }

    return Object.values(checks).every(Boolean);
  }

  passwordInput.addEventListener("input", checkPasswords);
  confirmPassword.addEventListener("input", checkPasswords);

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (checkPasswords()) {
      document.getElementById("successPopup").style.display = "flex";
    }
  });

  checkPasswords();
}

const closePopup = document.getElementById("closePopup");

if (closePopup) {
  closePopup.addEventListener("click", function () {
    document.getElementById("successPopup").style.display = "none";
  });
}

// Handle the "Continue to Login" button click
const continueLogin = document.getElementById("continueLogin");

if (continueLogin) {
  continueLogin.addEventListener("click", function () {
    window.location.href = "login.html";
  });
}

// Handle multi-step form navigation
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");

const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");

if (nextBtn && backBtn) {
  nextBtn.addEventListener("click", function () {
    // Check all Step 1 inputs
    const inputs = step1.querySelectorAll("input");

    for (const input of inputs) {
      if (!input.reportValidity()) {
        return;
      }
    }

    // Move to Step 2
    step1.style.display = "none";
    step2.style.display = "flex";
  });

  backBtn.addEventListener("click", function () {
    // Return to Step 1
    step2.style.display = "none";
    step1.style.display = "flex";
  });
}
