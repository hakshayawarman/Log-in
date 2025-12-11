document.addEventListener("DOMContentLoaded", () => {

  /*** ===== AUTH MODAL LOGIN/SIGNUP ===== ***/
  const openBtns = Array.from([
    document.getElementById("open-auth"), 
    document.getElementById("open-auth-hero")
  ]).filter(Boolean);

  const modal = document.getElementById("auth-modal");
  const closeAuthBtn = document.getElementById("auth-close");
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const pwToggles = Array.from(document.querySelectorAll(".pw-toggle"));

  function openModal() {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    showLogin();
  }

  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
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

  // Open modal buttons
  openBtns.forEach(b => b.addEventListener("click", openModal));

  // Close modal
  if (closeAuthBtn) closeAuthBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => { if(e.target === modal) closeModal(); });

  // Switch tabs
  if (tabLogin) tabLogin.addEventListener("click", showLogin);
  if (tabSignup) tabSignup.addEventListener("click", showSignup);

  // Password toggle
  pwToggles.forEach(t => {
    t.addEventListener("click", () => {
      const input = t.closest(".input-wrap").querySelector("input");
      if (!input) return;
      if(input.type === "password"){
        input.type = "text";
        t.classList.replace("uil-eye-slash","uil-eye");
      } else {
        input.type = "password";
        t.classList.replace("uil-eye","uil-eye-slash");
      }
    });
    t.addEventListener("keyup", e => { if(e.key==="Enter"||e.key===" ") t.click(); });
  });

  // Escape key to close modal
  document.addEventListener("keydown", e => { 
    if(e.key==="Escape" && modal.classList.contains("show")) closeModal(); 
  });


  /*** ===== SIGNUP / LOGIN POPUP ===== ***/
  const popupModal = document.getElementById("auth-popup");
  const popupTitle = document.getElementById("popup-title");
  const popupText = document.getElementById("popup-text");
  const popupCloseBtn = document.getElementById("popup-close-btn");

  const messagesDiv = document.getElementById("auth-messages");
  const signupMsg = messagesDiv?.dataset.signup || null;
  const loginMsg = messagesDiv?.dataset.login || null;

  function showPopup(title, text, isError = false){
    popupTitle.textContent = title;
    popupText.textContent = text;
    popupModal.querySelector(".popup-content").classList.toggle("error", isError);
    popupModal.classList.add("show");
    setTimeout(()=> popupModal.classList.remove("show"), 5000);
  }

  // Show PHP messages if exist
  if(signupMsg) showPopup("🎉 Congratulations!", signupMsg, false);
  else if(loginMsg) showPopup("❌ Error", loginMsg, true);

  if(popupCloseBtn){
    popupCloseBtn.addEventListener("click", () => popupModal.classList.remove("show"));
  }


  /*** ===== PREVENT REDIRECT AFTER SIGNUP ===== ***/
  if(signupForm){
    signupForm.addEventListener("submit", function(e){
      if(signupMsg){
        e.preventDefault(); // prevent redirect to game page
        showPopup("🎉 Congratulations!", signupMsg, false);
      }
    });
  }

});
