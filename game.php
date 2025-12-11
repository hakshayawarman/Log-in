<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}
$username = $_SESSION['user_email']; // store username from session
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Banana Chill - Play</title>
  <link rel="stylesheet" href="game.css" />
</head>

<body>
  <header>
    <div class="logo">🍌 Banana Chill</div>
    <nav class="nav-right">
      <a href="index.php">Home</a>
      <button id="logout">Logout</button>
    </nav>
  </header>

  <!-- Start Game Modal -->
  <div id="start-modal" class="modal">
    <div class="modal-content">
      <h2>🎮 Welcome to Banana Chill!</h2>
      <div class="modal-rules">
        <strong>Game Rules:</strong>
        <ul>
          <li>Solve the puzzle before time runs out.</li>
          <li>Correct → Gain XP and level up.</li>
          <li>Wrong → XP penalty.</li>
          <li>Try Again if time runs out or answer is wrong.</li>
        </ul>
      </div>
      <button id="start-btn" class="start-btn">Start Game</button>
    </div>
  </div>

  <main class="game-container">

    <!-- Left Game Panel -->
    <section class="panel left">
      <div class="status-bar">
        <div class="stat xp">XP: <span id="xp">0</span></div>
        <div class="stat time">⏳ <span id="timer">30</span>s</div>
        <div class="stat level">Level: <span id="level">1</span></div>
      </div>

      <img id="puzzle-img" class="puzzle-img" src="" alt="Puzzle" />

      <input type="text" id="answer" placeholder="Type your answer..." />

      <div class="btn-row">
        <button id="submit-btn">Submit</button>
      </div>

      <div id="feedback" class="feedback-text"></div>
    </section>

    <!-- Right Progress Panel -->
    <aside class="panel right">
      <h3 class="panel-title">🎮 Player Progress</h3>
      <div class="player-name" id="player-name"><?php echo htmlspecialchars($username); ?></div>
      <div class="badges" id="badges"></div>
      <hr />
      <div class="rules">
        <strong>Rules</strong>
        <ul>
          <li>Solve the puzzle before time runs out.</li>
          <li>Correct → Gain XP + Level up.</li>
          <li>Wrong → XP penalty.</li>
        </ul>
      </div>
      <button id="feedback-btn" class="feedback-btn">View Feedback</button>
    </aside>
  </main>

  <!-- Timeout Modal -->
  <div id="timeout-modal" class="modal">
    <div class="modal-content">
      <h2>⏰ Time's Up!</h2>
      <p id="timeout-info"></p>
      <button id="modal-try-again">Try Again</button>
    </div>
  </div>

  <!-- Wrong Answer Modal -->
  <div id="wrong-modal" class="modal">
    <div class="modal-content">
      <h2>❌ Wrong Answer!</h2>
      <p id="wrong-info"></p>
      <button id="wrong-try-again">Try Again</button>
    </div>
  </div>

  <!-- XP Popup -->
  <div id="xp-popup-modal" class="modal">
    <div class="modal-content" style="background: linear-gradient(90deg, #ffe066, #ff8a00); font-size: 28px; font-weight: 900;">
      +<span id="xp-gained">0</span> XP!
    </div>
  </div>

  <script src="game.js"></script>
</body>
</html>
