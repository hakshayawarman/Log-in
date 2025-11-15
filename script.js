// script.js — clean new behavior for the fresh UI
document.addEventListener("DOMContentLoaded", () => {
  const openBtns = [document.getElementById("open-auth"), document.getElementById("open-auth-hero")];
  const modal = document.getElementById("auth-modal");
  const closeBtn = document.getElementById("auth-close");
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const pwToggles = Array.from(document.querySelectorAll(".pw-toggle"));

  function openModal() {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden","false");
    // default to login
    showLogin();
  }
  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden","true");
  }

  function showLogin() {
    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  }
  function showSignup() {
    tabSignup.classList.add("active");
    tabLogin.classList.remove("active");
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  }

  // attach open buttons
  openBtns.forEach(b => { if(b) b.addEventListener("click", openModal); });

  // close
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  // tabs
  if (tabLogin) tabLogin.addEventListener("click", showLogin);
  if (tabSignup) tabSignup.addEventListener("click", showSignup);

  // password toggle (delegated)
  pwToggles.forEach(t => {
    t.addEventListener("click", () => {
      // the toggle has data-target but we used name attributes — find nearest input in same input-wrap
      const wrap = t.closest(".input-wrap");
      if (!wrap) return;
      const input = wrap.querySelector("input");
      if (!input) return;
      if (input.type === "password") {
        input.type = "text";
        t.classList.replace("uil-eye-slash", "uil-eye");
      } else {
        input.type = "password";
        t.classList.replace("uil-eye", "uil-eye-slash");
      }
    });
  });

  // sample form handlers (replace with real backend later)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // minimal validation demo
    const email = loginForm.querySelector('input[type="email"]').value.trim();
    if (!email) { alert("Enter email"); return; }
    // store demo username for progress/demo
    localStorage.setItem("banana_user", email);
    alert("Logged in (demo). Close modal to continue.");
    closeModal();
  });

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const pw = signupForm.querySelector('input[name="su-password"]').value;
    const pw2 = signupForm.querySelector('input[name="su-password2"]').value;
    if (pw.length < 6) { alert("Password must be at least 6 characters"); return; }
    if (pw !== pw2) { alert("Passwords do not match"); return; }
    // demo: save email
    const email = signupForm.querySelector('input[type="email"]').value.trim();
    localStorage.setItem("banana_user", email);
    alert("Account created (demo). You are logged in.");
    closeModal();
  });
});
