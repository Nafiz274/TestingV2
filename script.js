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
