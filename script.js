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

// Create a function that runs when the "Start" button is clicked.
function startBreathwork() {
  // Get the inhale duration (in seconds) from the user input
  inhaleTime = parseInt(document.getElementById('inhale').value);

  // Get the exhale duration (in seconds) from the user input
  exhaleTime = parseInt(document.getElementById('exhale').value);

  // Get the total session duration (in minutes) from the user input
  totalDuration = parseInt(document.getElementById('duration').value);

  // If any of the inputs aren't valid numbers, show an alert and stop the function
  if (isNaN(inhaleTime) || isNaN(exhaleTime) || isNaN(totalDuration)) {
    alert('Please enter valid numbers for all fields.');
    return;
  }

  // Calculate the exact end time of the session based on the current timestamp
  // totalDuration (in minutes) is converted to milliseconds
  sessionEndTime = Date.now() + totalDuration * 60 * 1000;

  // Disable the start button so the user can't restart mid-session
  startBtn.disabled = true;

  // Enable the stop button so the user can cancel if they want
  stopBtn.disabled = false;

  // Show a message that the session is active
  statusMsg.textContent = "Session in progress...";

  // Kick off the first inhale/exhale cycle
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
