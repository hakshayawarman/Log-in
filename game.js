(() => {
  const BANANA_API = "https://marcconrad.com/uob/banana/api.php";
  const DEFAULT_TIME = 60; 
  const XP_PER_CORRECT = 10;
  const XP_LOSS_WRONG = 5;
  const LEVEL_THRESHOLDS = [0, 50, 120, 220, 360]; 
  const BADGES = [
    { level: 2, name: "Novice Solver" },
    { level: 3, name: "Apprentice" },
    { level: 4, name: "Expert" },
    { level: 5, name: "Master" }
  ];

  const xpEl = document.getElementById("xp");
  const levelEl = document.getElementById("level");
  const timerEl = document.getElementById("timer");
  const puzzleImg = document.getElementById("puzzle-img");
  const answerInput = document.getElementById("answer");
  const submitBtn = document.getElementById("submit-btn");
  const feedbackEl = document.getElementById("feedback");
  const badgesEl = document.getElementById("badges");
  const playerNameEl = document.getElementById("player-name");
  const feedbackBtn = document.getElementById("feedback-btn");
  const logoutBtn = document.getElementById("logout");

  const startModal = document.getElementById("start-modal");
  const startBtn = document.getElementById("start-btn");
  const timeoutModal = document.getElementById("timeout-modal");
  const timeoutInfo = document.getElementById("timeout-info");
  const modalTryBtn = document.getElementById("modal-try-again");

  const wrongModal = document.getElementById("wrong-modal");
  const wrongInfo = document.getElementById("wrong-info");
  const wrongTryBtn = document.getElementById("wrong-try-again");

  let state = { xp:0, level:1, timeLeft:DEFAULT_TIME, correctAnswer:null, inRound:false, currentImage:null, history:[] };
  let timerInterval = null;

  function loadProgress() {
    const saved = localStorage.getItem(`banana_progress_${playerNameEl.textContent}`);
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        state.xp = obj.xp || 0;
        state.level = obj.level || 1;
        state.history = obj.history || [];
      } catch(e){ console.error(e); }
    }
    renderProgress();
    renderBadges();
  }

  function saveProgress() {
    localStorage.setItem(`banana_progress_${playerNameEl.textContent}`, JSON.stringify({ xp: state.xp, level: state.level, history: state.history }));
  }

  function renderProgress() { xpEl.textContent = state.xp; levelEl.textContent = state.level; }
  function renderBadges() {
    badgesEl.innerHTML = "";
    BADGES.forEach(b=>{
      const div = document.createElement("div");
      div.className = "badge" + (state.level>=b.level?" earned":"");
      div.textContent = b.name;
      badgesEl.appendChild(div);
    });
  }

  function setTimerDisplay(){ timerEl.textContent = state.timeLeft; }
  function computeLevelFromXP(xp){ for(let i=LEVEL_THRESHOLDS.length-1;i>=0;i--){if(xp>=LEVEL_THRESHOLDS[i])return i+1;} return 1; }

  async function fetchPuzzle() {
    feedbackEl.textContent = "Loading puzzle...";
    try {
      const res = await fetch(BANANA_API+"?json=1");
      if(!res.ok) throw new Error("Network not OK");
      const data = await res.json();
      state.correctAnswer = data.solution!==undefined?String(data.solution).trim():null;
      state.currentImage = data.question;
      puzzleImg.src = state.currentImage;
      feedbackEl.textContent="";
      answerInput.value="";
      state.timeLeft = DEFAULT_TIME;
      setTimerDisplay();
      startTimer();
      state.inRound=true;
      submitBtn.disabled=false;
    } catch(err){
      console.error(err);
      feedbackEl.textContent="Failed to load puzzle.";
    }
  }

  function startTimer() { clearInterval(timerInterval); timerInterval=setInterval(()=>{ state.timeLeft--; setTimerDisplay(); if(state.timeLeft<=0){ clearInterval(timerInterval); onTimeOut(); } },1000); }
  function stopTimer(){ clearInterval(timerInterval); }

  function onTimeOut() {
    if(!state.inRound) return;
    state.inRound=false;
    stopTimer();
    state.xp = Math.max(0,state.xp-XP_LOSS_WRONG);
    renderProgress();
    renderBadges();
    saveProgress();
    timeoutInfo.innerHTML=`⏰ Time ran out!<br>XP lost: ${XP_LOSS_WRONG}<br>Correct answer: <strong>${state.correctAnswer}</strong>`;
    timeoutModal.style.display="flex";
  }

  modalTryBtn.onclick = ()=>{ timeoutModal.style.display="none"; fetchPuzzle(); };

  function checkAnswer() {
    if(!state.inRound) return;
    const userAns=(answerInput.value||"").trim();
    if(!userAns){ feedbackEl.classList.add("big-warning"); feedbackEl.textContent = "Please enter an answer!"; return; }
    feedbackEl.classList.remove("big-warning");
    stopTimer();
    state.inRound=false;
    let correct=false;
    if(state.correctAnswer!==null){
      const aNum=Number(state.correctAnswer);
      const uNum=Number(userAns);
      correct = (!Number.isNaN(aNum)&&!Number.isNaN(uNum))? (aNum===uNum) : (state.correctAnswer.toLowerCase()===userAns.toLowerCase());
    }
    state.history.push({ timestamp:Date.now(), questionImage: state.currentImage, userAnswer:userAns, correct });
    if(correct){
      state.xp+=XP_PER_CORRECT;
      const oldLevel=state.level;
      state.level=computeLevelFromXP(state.xp);
      renderProgress(); renderBadges(); saveProgress();
      feedbackEl.innerHTML=`<span style="color:green">Correct! +${XP_PER_CORRECT} XP</span>`;
      submitBtn.disabled=true;
      setTimeout(()=>fetchPuzzle(),1000);
    } else {
      state.xp=Math.max(0,state.xp-XP_LOSS_WRONG);
      renderProgress(); renderBadges(); saveProgress();
      wrongInfo.innerHTML=`Wrong answer! Correct: <strong>${state.correctAnswer}</strong><br>XP lost: ${XP_LOSS_WRONG}`;
      wrongModal.style.display="flex";
    }
  }

  wrongTryBtn.onclick = ()=>{ wrongModal.style.display="none"; fetchPuzzle(); }

  function showFeedback() {
    if(!state.history.length){ alert("No attempts yet."); return; }
    let text="Recent attempts:\n";
    state.history.slice(-5).reverse().forEach((h,idx)=>{
      const d=new Date(h.timestamp);
      text+=`${idx+1}. ${d.toLocaleString()} - Answer: ${h.userAnswer} - ${h.correct?"Correct":"Wrong"}\n`;
    });
    text+=`\nXP: ${state.xp}\nLevel: ${state.level}`;
    alert(text);
  }

  function logout() {
    window.location.href="logout.php";
  }

  submitBtn.addEventListener("click",checkAnswer);
  feedbackBtn.addEventListener("click",showFeedback);
  logoutBtn.addEventListener("click",logout);
  startBtn.addEventListener("click",()=>{ startModal.style.display="none"; fetchPuzzle(); });

  loadProgress();
  startModal.style.display="flex";
  timeoutModal.style.display="none";
  wrongModal.style.display="none";
})();
