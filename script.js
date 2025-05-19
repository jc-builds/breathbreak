// ========== Session State ==========
let sessionActive = false;

// ========== DOM Elements ==========
const startBtn = document.getElementById('start');
const sessionStopBtn = document.getElementById('session-stop');

const inhaleInput = document.getElementById('inhale');
const exhaleInput = document.getElementById('exhale');
const durationInput = document.getElementById('duration');

const breathCue = document.getElementById('breath-cue');
const controlPanel = document.querySelector('.control-panel');
const sessionView = document.getElementById('session-view');
const progressBar = document.getElementById('progress-bar');

// ========== Timing State ==========
let inhaleTime = 4;
let exhaleTime = 6;
let totalDuration = 5;
let sessionStartTime;
let sessionEndTime;
let timeoutID;
let idleTimeout;
let statusInterval;

// ========== Helpers ==========
function getTimeRemaining() {
  const msLeft = sessionEndTime - Date.now();
  const seconds = Math.max(0, Math.floor(msLeft / 1000));
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function updateProgressBar() {
  const elapsed = Date.now() - sessionStartTime;
  const total = totalDuration * 60 * 1000;
  const progress = Math.min((elapsed / total) * 100, 100);
  progressBar.style.width = `${progress}%`;
}

// ========== Breathwork Logic ==========
function startBreathwork() {
  sessionActive = true;

  inhaleTime = parseInt(inhaleInput.value);
  exhaleTime = parseInt(exhaleInput.value);
  totalDuration = parseInt(durationInput.value);

  if (isNaN(inhaleTime) || isNaN(exhaleTime) || isNaN(totalDuration)) {
    alert('Please enter valid numbers for all fields.');
    sessionActive = false;
    return;
  }

  sessionStartTime = Date.now();
  sessionEndTime = sessionStartTime + totalDuration * 60 * 1000;

  statusInterval = setInterval(updateProgressBar, 1000);

  startBtn.disabled = true;
  controlPanel.classList.add('hidden');
  sessionView.classList.remove('hidden');

  beginCycle();
}

function stopBreathwork(finalStatus = '', finalCue = 'Stopped') {
  sessionActive = false;

  clearTimeout(timeoutID);
  clearInterval(statusInterval);
  document.body.classList.remove('inhale');

  startBtn.disabled = false;

  breathCue.textContent = finalCue;
  progressBar.style.width = '0%';

  sessionView.classList.add('hidden');
  controlPanel.classList.remove('hidden');
}

function beginCycle() {
  if (Date.now() >= sessionEndTime) {
    stopBreathwork('', 'Complete');
    return;
  }

  // Inhale Phase
  let inhaleCountdown = inhaleTime;
  breathCue.textContent = `Inhale: ${inhaleCountdown}`;
  document.body.classList.add('inhale');

  timeoutID = setInterval(() => {
    inhaleCountdown--;
    if (inhaleCountdown > 0) {
      breathCue.textContent = `Inhale: ${inhaleCountdown}`;
    } else {
      clearInterval(timeoutID);
      document.body.classList.remove('inhale');

      // Exhale Phase
      let exhaleCountdown = exhaleTime;
      breathCue.textContent = `Exhale: ${exhaleCountdown}`;

      timeoutID = setInterval(() => {
        exhaleCountdown--;
        if (exhaleCountdown > 0) {
          breathCue.textContent = `Exhale: ${exhaleCountdown}`;
        } else {
          clearInterval(timeoutID);
          beginCycle(); // Start the next inhale
        }
      }, 1000);
    }
  }, 1000);
}


// ========== Idle Detection Logic ==========
function showControlPanel() {
  if (sessionActive) {
    sessionStopBtn.classList.remove('hidden');
    return;
  }

  controlPanel.classList.add('visible');

  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(() => {
    controlPanel.classList.remove('visible');
  }, 6000);
}

// ========== Event Listeners ==========
startBtn.addEventListener('click', startBreathwork);
sessionStopBtn.addEventListener('click', stopBreathwork);

['mousemove', 'keydown', 'touchstart'].forEach(event => {
  document.addEventListener(event, showControlPanel);
});

window.addEventListener('load', () => {
  controlPanel.classList.remove('visible');
});
