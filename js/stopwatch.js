const Stopwatch = (() => {
  let elapsed = 0;
  let startTime = null;
  let running = false;
  let showMs = true;

  const display  = document.getElementById("stopwatch-display");
  const btnStart = document.getElementById("stopwatch-start");
  const btnPause = document.getElementById("stopwatch-pause");
  const btnReset = document.getElementById("stopwatch-reset");

  const loop = Utils.raf(() => {
    const ms = elapsed + (performance.now() - startTime);
    display.textContent = Utils.formatTime(ms, showMs);
  });

  function render() {
    display.textContent = Utils.formatTime(elapsed, showMs);
  }

  function start() {
    if (running) return;
    running = true;
    startTime = performance.now();
    btnStart.disabled = true;
    btnPause.disabled = false;
    loop.start();
  }

  function pause() {
    if (!running) return;
    running = false;
    elapsed += performance.now() - startTime;
    loop.stop();
    render();
    btnStart.textContent = "Resume";
    btnStart.disabled = false;
    btnPause.disabled = true;
  }

  function reset() {
    running = false;
    elapsed = 0;
    startTime = null;
    loop.stop();
    btnStart.textContent = "Start";
    btnStart.disabled = false;
    btnPause.disabled = true;
    render();
  }

  function setShowMs(val) {
    showMs = val;
    if (!running) render();
  }

  function init() {
    showMs = Storage.getShowMs();
    render();
    btnStart.addEventListener("click", start);
    btnPause.addEventListener("click", pause);
    btnReset.addEventListener("click", reset);
  }

  return { init, setShowMs };
})();