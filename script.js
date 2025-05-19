// ========== Session State ==========
let sessionActive = false;

// ========== DOM Elements ==========
const startBtn = document.getElementById('start');
const sessionStopBtn = document.getElementById('session-stop');

const inhaleInput = document.getElementById('inhale');
const exhaleInput = document.getElementById('exhale');
const durationInput = document.getElementById('duration');

const breathCue = document.getElementById('breath-cue');
const statusMsg = document.getElementById('status');
const controlPanel = document.querySelector('.control-panel');
const sessionView = document.getElementById('session-view');

// ========== Timing State ==========
let inhaleTime = 4;
let exhaleTime = 6;
let totalDuration = 5;
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

// ========== Breathwork Logic ==========

// Starts the breathing session
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

  sessionEndTime = Date.now() + totalDuration * 60 * 1000;

  statusInterval = setInterval(() => {
    statusMsg.textContent = `${getTimeRemaining()}`;
  }, 1000);

  startBtn.disabled = true;

  controlPanel.classList.add('hidden');
  sessionView.classList.remove('hidden');
  //statusMsg.textContent = 'Session in progress...';

  beginCycle();
}

// Ends the breathing session
function stopBreathwork() {
  sessionActive = false;

  clearTimeout(timeoutID);
  clearInterval(statusInterval);
  document.body.classList.remove('inhale');

  startBtn.disabled = false;

  breathCue.textContent = 'Stopped';
  statusMsg.textContent = '';

  sessionView.classList.add('hidden');
  controlPanel.classList.remove('hidden');
}

// Handles the inhale/exhale loop
function beginCycle() {
  if (Date.now() >= sessionEndTime) {
    stopBreathwork();
    breathCue.textContent = 'Complete';
    statusMsg.textContent = 'Session complete.';
    return;
  }

  // Inhale Phase
  let inhaleCountdown = inhaleTime;
  breathCue.textContent = `Inhale: ${inhaleCountdown}`;
  document.body.classList.add('inhale');

  const inhaleInterval = setInterval(() => {
    inhaleCountdown--;
    if (inhaleCountdown > 0) {
      breathCue.textContent = `Inhale: ${inhaleCountdown}`;
    } else {
      clearInterval(inhaleInterval);
      document.body.classList.remove('inhale');

      // Exhale Phase
      let exhaleCountdown = exhaleTime;
      breathCue.textContent = `Exhale: ${exhaleCountdown}`;

      const exhaleInterval = setInterval(() => {
        exhaleCountdown--;
        if (exhaleCountdown > 0) {
          breathCue.textContent = `Exhale: ${exhaleCountdown}`;
        } else {
          clearInterval(exhaleInterval);
          beginCycle(); // Continue loop
        }
      }, 1000);
    }
  }, 1000);
}

// ========== Idle Detection Logic ==========

// Shows control panel only if session is not active
function showControlPanel() {
  if (sessionActive) {
    sessionStopBtn.classList.remove('hidden'); // Show Stop button during session
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
