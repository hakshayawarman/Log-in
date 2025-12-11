<?php
include 'connect.php';
include 'signup.php';
include 'login.php';

// Flags for messages
$signup_success = $signup_success ?? '';
$login_error = $login_error ?? '';
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Banana Chill — Login</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css">
</head>
<body>

<header class="nav-wrap">
  <div class="nav-inner">
    <div class="brand">🍌 Banana Chill</div>
    <nav class="links" aria-label="Primary"><a href="#">About</a></nav>
  </div>
</header>

<main class="hero" role="main">
  <div class="hero-inner">
    <h1>Banana Chill</h1>
    <p class="tag">Solve puzzles · Earn XP · Level up</p>
    <div class="hero-cta">
      <button id="open-auth-hero" class="cta ghost">Play Now</button>
    </div>
  </div>
</main>

<!-- AUTH MODAL -->
<div id="auth-modal" class="auth-modal" aria-hidden="true">
  <div class="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title">
    <button class="close-btn" aria-label="Close" id="auth-close"><i class="uil uil-times"></i></button>

    <div class="auth-head">
      <div class="auth-logo">🍌</div>
      <h2 id="auth-title">Welcome to Banana Chill</h2>
      <p class="auth-sub">Sign in to continue playing</p>
    </div>

    <div class="tabs" role="tablist" aria-label="Auth tabs">
      <button id="tab-login" class="tab active" role="tab" aria-selected="true">Login</button>
      <button id="tab-signup" class="tab" role="tab" aria-selected="false">Sign up</button>
    </div>

    <!-- LOGIN FORM -->
    <form id="login-form" class="auth-form" method="post" action="index.php">
      <label class="field">
        <span class="label-text">Email</span>
        <div class="input-wrap">
          <input type="email" name="email" required placeholder="you@example.com">
          <i class="uil uil-envelope-alt icon"></i>
        </div>
      </label>

      <label class="field">
        <span class="label-text">Password</span>
        <div class="input-wrap">
          <input type="password" name="password" required placeholder="••••••••">
          <i class="uil uil-lock icon"></i>
        </div>
      </label>

      <button type="submit" name="login_submit" class="btn primary">Login</button>
    </form>

    <!-- SIGNUP FORM -->
    <form id="signup-form" class="auth-form hidden" method="post" action="index.php">
      <label class="field">
        <span class="label-text">Email</span>
        <div class="input-wrap">
          <input type="email" name="su_email" required placeholder="you@example.com">
          <i class="uil uil-envelope-alt icon"></i>
        </div>
      </label>

      <label class="field">
        <span class="label-text">Password</span>
        <div class="input-wrap">
          <input type="password" name="su_password" required placeholder="min 6 chars">
          <i class="uil uil-lock icon"></i>
        </div>
      </label>

      <label class="field">
        <span class="label-text">Confirm Password</span>
        <div class="input-wrap">
          <input type="password" name="su_password2" required placeholder="confirm password">
          <i class="uil uil-lock icon"></i>
        </div>
      </label>

      <button type="submit" name="signup_submit" class="btn primary">Sign up</button>
    </form>

    <p class="foot-note small">By continuing you accept our <a href="#">terms</a></p>
  </div>
</div>

<!-- POPUP MODAL -->
<div id="auth-popup" class="popup-modal">
  <div class="popup-content">
    <h2 id="popup-title"></h2>
    <p id="popup-text"></p>
    <button id="popup-close-btn">OK</button>
  </div>
</div>

<!-- Hidden data for JS -->
<div id="auth-messages" 
     data-signup="<?php echo htmlspecialchars($signup_success); ?>" 
     data-login="<?php echo htmlspecialchars($login_error); ?>"></div>

<script src="script.js"></script>
</body>
</html>
