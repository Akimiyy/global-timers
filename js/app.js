document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particles-canvas");
  Particles.init(canvas);

  const particlesEnabled = Storage.getParticlesEnabled();
  const particleCount    = Storage.getParticleCount();
  const showMs           = Storage.getShowMs();

  Particles.setCount(particleCount);
  Particles.setEnabled(particlesEnabled);

  Clock.init();
  Stopwatch.init();
  Timer.init();

  const settingParticlesEnabled = document.getElementById("setting-particles-enabled");
  const settingParticleCount    = document.getElementById("setting-particle-count");
  const particleCountValue      = document.getElementById("particle-count-value");
  const settingShowMs           = document.getElementById("setting-show-ms");

  settingParticlesEnabled.checked = particlesEnabled;
  settingParticleCount.value      = particleCount;
  particleCountValue.textContent  = particleCount;
  settingShowMs.checked           = showMs;

  settingParticlesEnabled.addEventListener("change", () => {
    const val = settingParticlesEnabled.checked;
    Storage.setParticlesEnabled(val);
    Particles.setEnabled(val);
  });

  settingParticleCount.addEventListener("input", Utils.throttle(() => {
    const val = Utils.parseIntSafe(settingParticleCount.value, 60, 10, 150);
    particleCountValue.textContent = val;
    Storage.setParticleCount(val);
    Particles.setCount(val);
  }, 100));

  settingShowMs.addEventListener("change", () => {
    const val = settingShowMs.checked;
    Storage.setShowMs(val);
    Stopwatch.setShowMs(val);
  });

  Clock.buildClockToggles();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
});