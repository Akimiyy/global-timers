const Utils = (() => {

  function pad(n, len = 2) {
    return String(Math.floor(n)).padStart(len, "0");
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function debounce(fn, delay) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  function throttle(fn, interval) {
    let last = 0;
    return (...args) => {
      const now = performance.now();
      if (now - last < interval) return;
      last = now;
      fn(...args);
    };
  }

  function memoize(fn) {
    const cache = new Map();
    return (...args) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) return cache.get(key);
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  }

  function formatTime(ms, showMs = true) {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const millis = Math.floor(ms % 1000);
    if (showMs) {
      return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(millis, 3)}`;
    }
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  function formatCountdown(ms) {
    const totalSeconds = Math.ceil(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${pad(m)}:${pad(s)}`;
  }

  function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    return Math.floor(diff / 86400000);
  }

  const getDateFormatter = memoize((locale, timeZone, options) => {
    return new Intl.DateTimeFormat(locale, { timeZone, ...options });
  });

  function formatWorldTime(zone, locale) {
    const now = new Date();
    const timeFmt = getDateFormatter(locale, zone, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const dateFmt = getDateFormatter(locale, zone, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return {
      time: timeFmt.format(now),
      date: dateFmt.format(now),
    };
  }

  function createElement(tag, className, textContent) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent !== undefined) el.textContent = textContent;
    return el;
  }

  function setAttributes(el, attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }

  function raf(callback) {
    let id = null;
    let active = false;

    function loop() {
      if (!active) return;
      callback();
      id = requestAnimationFrame(loop);
    }

    function start() {
      if (active) return;
      active = true;
      id = requestAnimationFrame(loop);
    }

    function stop() {
      active = false;
      if (id !== null) {
        cancelAnimationFrame(id);
        id = null;
      }
    }

    function isActive() {
      return active;
    }

    return { start, stop, isActive };
  }

  function parseIntSafe(value, fallback, min, max) {
    let parsed = parseInt(value, 10);
    if (isNaN(parsed)) parsed = fallback;
    return clamp(parsed, min, max);
  }

  function once(fn) {
    let called = false;
    let result;
    return (...args) => {
      if (!called) {
        called = true;
        result = fn(...args);
      }
      return result;
    };
  }

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  }

  return {
    pad,
    clamp,
    debounce,
    throttle,
    memoize,
    formatTime,
    formatCountdown,
    getDayOfYear,
    getDateFormatter,
    formatWorldTime,
    createElement,
    setAttributes,
    raf,
    parseIntSafe,
    once,
    isVisible,
  };
})();