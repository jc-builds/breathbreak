//Creating variables based on the ID of the buttons / elements in the HTML
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const breathCue = document.getElementById('breath-cue');
const statusMsg = document.getElementById('status');

//Initialize variables for inhaleTime, exhaleTime, duration
let inhaleTime = 4;
let exhaleTime = 6;
let totalDuration = 5;
let intervalID;
let timeoutID;
let sessionEndTime;

function startBreathwork() {
  inhaleTime = parseInt(document.getElementById('inhale').value);
  exhaleTime = parseInt(document.getElementById('exhale').value);
  totalDuration = parseInt(document.getElementById('duration').value);

  if (isNaN(inhaleTime) || isNaN(exhaleTime) || isNaN(totalDuration)) {
    alert('Please enter valid numbers for all fields.');
    return;
  }

  sessionEndTime = Date.now() + totalDuration * 60 * 1000;

  startBtn.disabled = true;
  stopBtn.disabled = false;
  statusMsg.textContent = "Session in progress...";
  beginCycle();
}

function stopBreathwork() {
  clearTimeout(timeoutID);
  clearInterval(intervalID);
  breathCue.textContent = "Stopped";
  statusMsg.textContent = "";
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

function beginCycle() {
  if (Date.now() >= sessionEndTime) {
    stopBreathwork();
    breathCue.textContent = "Complete";
    statusMsg.textContent = "Session complete.";
    return;
  }

  breathCue.textContent = "Inhale";
  document.body.classList.add("inhale");

  timeoutID = setTimeout(() => {
    breathCue.textContent = "Exhale";
    document.body.classList.remove("inhale");

    timeoutID = setTimeout(() => {
      beginCycle(); // Restart the cycle
    }, exhaleTime * 1000);

  }, inhaleTime * 1000);
}

startBtn.addEventListener('click', startBreathwork);
stopBtn.addEventListener('click', stopBreathwork);
