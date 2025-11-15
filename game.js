// game.js - frontend game logic using Banana API, localStorage for progress
(() => {
  // config
  const BANANA_API = "https://marcconrad.com/uob/banana/api.php"; // returns JSON with image & answer
  const DEFAULT_TIME = 30; // seconds per puzzle
  const XP_PER_CORRECT = 10;
  const XP_LOSS_WRONG = 5;
  const LEVEL_THRESHOLDS = [0, 50, 120, 220, 360]; // xp thresholds for levels 1..5
  const BADGES = [
    { level: 2, name: "Novice Solver" },
    { level: 3, name: "Apprentice" },
    { level: 4, name: "Expert" },
    { level: 5, name: "Master" }
  ];

  // DOM
  const xpEl = document.getElementById("xp");
  const levelEl = document.getElementById("level");
  const timerEl = document.getElementById("timer");
  const puzzleImg = document.getElementById("puzzle-img");
  const answerInput = document.getElementById("answer");
  const submitBtn = document.getElementById("submit-btn");
  const nextBtn = document.getElementById("next-btn");
  const feedbackEl = document.getElementById("feedback");
  const badgesEl = document.getElementById("badges");
  const playerNameEl = document.getElementById("player-name");
  const feedbackBtn = document.getElementById("feedback-btn");
  const logoutBtn = document.getElementById("logout");

  // state
  let state = {
    xp: 0,
    level: 1,
    timeLeft: DEFAULT_TIME,
    correctAnswer: null,
    inRound: false,
    currentImage: null,
    history: [] // keep attempts for feedback
  };

  // load stored progress (simulate virtual identity)
  function loadProgress() {
    const saved = localStorage.getItem("banana_progress");
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        state.xp = obj.xp || 0;
        state.level = obj.level || 1;
        state.history = obj.history || [];
      } catch (e) { /* ignore */ }
    }
    // player name placeholder
    const name = localStorage.getItem("banana_user") || "Guest";
    playerNameEl.textContent = name;
    renderProgress();
    renderBadges();
  }
  function saveProgress() {
    localStorage.setItem("banana_progress", JSON.stringify({
      xp: state.xp,
      level: state.level,
      history: state.history
    }));
  }

  function setTimerDisplay() {
    timerEl.textContent = state.timeLeft;
  }

  function renderProgress() {
    xpEl.textContent = state.xp;
    levelEl.textContent = state.level;
  }

  function renderBadges() {
    badgesEl.innerHTML = "";
    BADGES.forEach(b => {
      const div = document.createElement("div");
      div.className = "badge" + (state.level >= b.level ? " earned" : "");
      div.textContent = b.name;
      badgesEl.appendChild(div);
    });
  }

  // compute level from xp using thresholds
  function computeLevelFromXP(xp) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i]) return i + 1; // index 0 -> level1
    }
    return 1;
  }

  // fetch puzzle from Banana API (returns image URL and answer)
  async function fetchPuzzle() {
    feedbackEl.textContent = "Loading puzzle...";
    try {
      const res = await fetch(BANANA_API + "?json=1"); // some endpoints accept json param
      if (!res.ok) throw new Error("Network response not OK");
      const data = await res.json();
      // banana API may return {question, image, answer} or similar
      // safely handle various fields
      const image = data.image || data.img || data.picture || data.question_image;
      const answer = data.answer || data.correct || data.solution;
      if (!image) throw new Error("No image returned by API");
      state.correctAnswer = answer !== undefined ? String(answer).trim() : null;
      state.currentImage = image;
      puzzleImg.src = image;
      feedbackEl.textContent = "";
      answerInput.value = "";
      state.timeLeft = DEFAULT_TIME;
      setTimerDisplay();
      startTimer();
      state.inRound = true;
      nextBtn.disabled = true;
    } catch (err) {
      console.error(err);
      feedbackEl.textContent = "Failed to load puzzle. Try again later.";
    }
  }

  // timer
  let timerInterval = null;
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      state.timeLeft--;
      setTimerDisplay();
      if (state.timeLeft <= 0) {
        clearInterval(timerInterval);
        onTimeOut();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function onTimeOut() {
    state.inRound = false;
    feedbackEl.innerHTML = `<span class="game-over">Time's up — Game over. <button id="try-again">Try Again</button></span>`;
    document.getElementById("try-again").addEventListener("click", () => {
      fetchPuzzle();
    });
  }

  // evaluate answer
  function checkAnswer() {
    if (!state.inRound) return;
    const userAns = (answerInput.value || "").trim();
    if (userAns === "") {
      feedbackEl.textContent = "Please enter an answer first.";
      return;
    }
    stopTimer();
    state.inRound = false;

    // compare loosely (numbers vs string). If numeric answers, try numeric compare
    let correct = false;
    if (state.correctAnswer === null) {
      // no reference answer from API: just treat as incorrect (or accept any)
      correct = false;
    } else {
      // try numeric compare if both numeric
      const aNum = Number(state.correctAnswer);
      const uNum = Number(userAns);
      if (!Number.isNaN(aNum) && !Number.isNaN(uNum)) {
        correct = (aNum === uNum);
      } else {
        correct = (String(state.correctAnswer).toLowerCase() === userAns.toLowerCase());
      }
    }

    // record attempt
    state.history.push({
      timestamp: Date.now(),
      questionImage: state.currentImage,
      userAnswer: userAns,
      correct: correct
    });

    if (correct) {
      state.xp += XP_PER_CORRECT;
      const oldLevel = state.level;
      state.level = computeLevelFromXP(state.xp);
      feedbackEl.innerHTML = `<span style="color:green">Correct! +${XP_PER_CORRECT} XP</span>`;
      nextBtn.disabled = false;
      submitBtn.disabled = true;
      renderProgress();
      renderBadges();
      saveProgress();
      // if leveled up, show message
      if (state.level > oldLevel) {
        setTimeout(() => alert(`Level Up! You are now level ${state.level}`), 200);
      }
    } else {
      // wrong
      state.xp = Math.max(0, state.xp - XP_LOSS_WRONG);
      renderProgress();
      renderBadges();
      // show correct answer and block progress (next disabled)
      feedbackEl.innerHTML = `Wrong. Correct answer: <span id="correct-answer">${state.correctAnswer}</span>. No XP awarded. Try again.`;
      nextBtn.disabled = true;
      submitBtn.disabled = false; // user can try again on same puzzle, but XP not awarded until correct
      saveProgress();
    }
  }

  // next puzzle (only if previously correct)
  function nextPuzzle() {
    // progression rule: user must have positive XP to advance. If xp is zero -> block.
    if (state.xp <= 0) {
      feedbackEl.textContent = "You have no XP. You cannot progress. Try puzzles and earn XP first.";
      return;
    }
    // fetch new puzzle
    fetchPuzzle();
    submitBtn.disabled = false;
  }

  // feedback page (simple modal or alert summarizing history)
  function showFeedback() {
    if (!state.history.length) {
      alert("No attempts yet.");
      return;
    }
    let text = "Recent attempts:\n";
    const last5 = state.history.slice(-5).reverse();
    last5.forEach((h, idx) => {
      const d = new Date(h.timestamp);
      text += `${idx+1}. ${d.toLocaleString()} - Answer: ${h.userAnswer} - ${h.correct ? "Correct" : "Wrong"}\n`;
    });
    text += `\nXP: ${state.xp}\nLevel: ${state.level}`;
    alert(text);
  }

  // logout: clear user and redirect to index (simulated)
  function logout() {
    localStorage.removeItem("banana_user");
    // keep progress but you may choose to clear
    window.location.href = "index.html";
  }

  // attach events
  submitBtn.addEventListener("click", checkAnswer);
  nextBtn.addEventListener("click", nextPuzzle);
  feedbackBtn.addEventListener("click", showFeedback);
  logoutBtn.addEventListener("click", logout);

  // init
  loadProgress();
  // auto-start first puzzle
  fetchPuzzle();
})();
