const Timer = (() => {
  let remaining = 0;
  let startTime = null;
  let running = false;
  let completed = false;

  const inputMinutes = document.getElementById("timer-minutes");
  const inputSeconds = document.getElementById("timer-seconds");
  const displayEl    = document.getElementById("timer-display");
  const inputsEl     = document.getElementById("timer-inputs");
  const completeMsg  = document.getElementById("timer-complete-msg");
  const btnStart     = document.getElementById("timer-start");
  const btnPause     = document.getElementById("timer-pause");
  const btnReset     = document.getElementById("timer-reset");
  const alarmAudio   = document.getElementById("alarm-audio");

  const loop = Utils.raf(() => {
    const current = remaining - (performance.now() - startTime);
    if (current <= 0) {
      complete();
      return;
    }
    displayEl.textContent = Utils.formatCountdown(current);
  });

  function complete() {
    loop.stop();
    running = false;
    completed = true;
    remaining = 0;
    displayEl.textContent = "00:00";
    displayEl.classList.add("completed");
    completeMsg.style.display = "block";
    btnStart.disabled = true;
    btnPause.disabled = true;
    try {
      alarmAudio.currentTime = 0;
      alarmAudio.play().catch(() => {});
    } catch {
    }
  }

  function getInputMs() {
    const mins = Utils.parseIntSafe(inputMinutes.value, 0, 0, 99);
    const secs = Utils.parseIntSafe(inputSeconds.value, 0, 0, 59);
    inputMinutes.value = mins;
    inputSeconds.value = secs;
    return (mins * 60 + secs) * 1000;
  }

  function start() {
    if (running) return;

    if (!completed && remaining === 0) {
      const ms = getInputMs();
      if (ms <= 0) return;
      remaining = ms;
    }

    if (remaining <= 0) return;

    running = true;
    completed = false;
    startTime = performance.now();

    inputsEl.style.display = "none";
    displayEl.style.display = "block";
    displayEl.classList.remove("completed");
    completeMsg.style.display = "none";
    btnStart.disabled = true;
    btnPause.disabled = false;

    loop.start();
  }

  function pause() {
    if (!running) return;
    remaining = Utils.clamp(remaining - (performance.now() - startTime), 0, Infinity);
    running = false;
    loop.stop();
    displayEl.textContent = Utils.formatCountdown(remaining);
    btnStart.textContent = "Resume";
    btnStart.disabled = false;
    btnPause.disabled = true;
  }

  function reset() {
    running = false;
    completed = false;
    remaining = 0;
    loop.stop();
    try {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
    } catch {
    }
    displayEl.style.display = "none";
    displayEl.classList.remove("completed");
    completeMsg.style.display = "none";
    inputsEl.style.display = "flex";
    btnStart.textContent = "Start";
    btnStart.disabled = false;
    btnPause.disabled = true;
  }

  function bindInput(input, min, max, storeFn) {
    input.addEventListener("change", Utils.debounce(() => {
      const val = Utils.parseIntSafe(input.value, min, min, max);
      input.value = val;
      storeFn(val);
    }, 300));
  }

  function init() {
    inputMinutes.value = Storage.getTimerMinutes();
    inputSeconds.value = Storage.getTimerSeconds();

    bindInput(inputMinutes, 0, 99, Storage.setTimerMinutes);
    bindInput(inputSeconds, 0, 59, Storage.setTimerSeconds);

    btnStart.addEventListener("click", start);
    btnPause.addEventListener("click", pause);
    btnReset.addEventListener("click", reset);
  }

  return { init };
})();