const Storage = (() => {
  const KEYS = {
    PARTICLES_ENABLED: "gt_particles_enabled",
    PARTICLE_COUNT: "gt_particle_count",
    SHOW_MS: "gt_show_ms",
    WORLD_CLOCKS: "gt_world_clocks",
    TIMER_MINUTES: "gt_timer_minutes",
    TIMER_SECONDS: "gt_timer_seconds",
  };

  function get(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      if (val === null) return fallback;
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
    }
  }

  function getParticlesEnabled() {
    return get(KEYS.PARTICLES_ENABLED, true);
  }

  function setParticlesEnabled(val) {
    set(KEYS.PARTICLES_ENABLED, val);
  }

  function getParticleCount() {
    return get(KEYS.PARTICLE_COUNT, 60);
  }

  function setParticleCount(val) {
    set(KEYS.PARTICLE_COUNT, val);
  }

  function getShowMs() {
    return get(KEYS.SHOW_MS, true);
  }

  function setShowMs(val) {
    set(KEYS.SHOW_MS, val);
  }

  function getWorldClocks() {
    return get(KEYS.WORLD_CLOCKS, null);
  }

  function setWorldClocks(val) {
    set(KEYS.WORLD_CLOCKS, val);
  }

  function getTimerMinutes() {
    return get(KEYS.TIMER_MINUTES, 5);
  }

  function setTimerMinutes(val) {
    set(KEYS.TIMER_MINUTES, val);
  }

  function getTimerSeconds() {
    return get(KEYS.TIMER_SECONDS, 0);
  }

  function setTimerSeconds(val) {
    set(KEYS.TIMER_SECONDS, val);
  }

  return {
    getParticlesEnabled,
    setParticlesEnabled,
    getParticleCount,
    setParticleCount,
    getShowMs,
    setShowMs,
    getWorldClocks,
    setWorldClocks,
    getTimerMinutes,
    setTimerMinutes,
    getTimerSeconds,
    setTimerSeconds,
  };
})();