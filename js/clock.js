const Clock = (() => {
  const DEFAULT_ZONES = [
    { zone: "Europe/Bucharest", city: "Bucharest" },
    { zone: "Europe/Madrid",    city: "Madrid"    },
    { zone: "Europe/London",    city: "London"    },
    { zone: "America/New_York", city: "New York"  },
    { zone: "America/Los_Angeles", city: "Los Angeles" },
    { zone: "Asia/Tokyo",       city: "Tokyo"     },
  ];

  const LOCALE = navigator.language || "en-US";

  let clocks = [];
  let intervalId = null;

  const getMainDateFormatter = Utils.memoize((locale) => {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  const getMainDayFormatter = Utils.memoize((locale) => {
    return new Intl.DateTimeFormat(locale, { weekday: "long" });
  });

  function formatMainClock() {
    const now = new Date();
    const h = Utils.pad(now.getHours());
    const m = Utils.pad(now.getMinutes());
    const s = Utils.pad(now.getSeconds());

    document.getElementById("main-time").textContent = `${h}:${m}:${s}`;
    document.getElementById("main-date").textContent = getMainDateFormatter(LOCALE).format(now);
    document.getElementById("main-dayofweek").textContent = getMainDayFormatter(LOCALE).format(now);

    const doy = Utils.getDayOfYear(now);
    document.getElementById("main-dayofyear").textContent = `Day ${doy} of ${now.getFullYear()}`;
  }

  function updateWorldClocks() {
    const enabled = clocks.filter(c => c.enabled);
    for (const clockDef of enabled) {
      const card = document.querySelector(`.world-clock-card[data-zone="${clockDef.zone}"]`);
      if (!card) continue;
      const data = Utils.formatWorldTime(clockDef.zone, "en-US");
      card.querySelector(".world-clock-time").textContent = data.time;
      card.querySelector(".world-clock-date").textContent = data.date;
    }
  }

  function buildWorldClockCard(clockDef) {
    const card = Utils.createElement("div", "world-clock-card");
    Utils.setAttributes(card, {
      "data-zone": clockDef.zone,
      "role": "region",
      "aria-label": clockDef.city,
    });

    card.appendChild(Utils.createElement("div", "world-clock-city", clockDef.city));
    card.appendChild(Utils.createElement("div", "world-clock-time"));
    card.appendChild(Utils.createElement("div", "world-clock-date"));

    return card;
  }

  function renderWorldClocks() {
    const grid = document.getElementById("world-clocks-grid");
    grid.innerHTML = "";

    const enabled = clocks.filter(c => c.enabled);

    if (enabled.length === 0) {
      const msg = Utils.createElement("p", null, "No world clocks enabled.");
      msg.style.color = "var(--text-secondary)";
      msg.style.fontSize = "0.9rem";
      grid.appendChild(msg);
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const clockDef of enabled) {
      fragment.appendChild(buildWorldClockCard(clockDef));
    }
    grid.appendChild(fragment);
    updateWorldClocks();
  }

  function tick() {
    formatMainClock();
    updateWorldClocks();
  }

  function saveClocks() {
    const state = clocks.map(c => ({ zone: c.zone, enabled: c.enabled }));
    Storage.setWorldClocks(state);
  }

  function loadClocks() {
    const saved = Storage.getWorldClocks();
    if (saved && Array.isArray(saved)) {
      clocks = DEFAULT_ZONES.map(def => {
        const match = saved.find(s => s.zone === def.zone);
        return {
          zone: def.zone,
          city: def.city,
          enabled: match ? match.enabled : true,
        };
      });
    } else {
      clocks = DEFAULT_ZONES.map(def => ({ ...def, enabled: true }));
    }
  }

  function buildClockToggles() {
    const container = document.getElementById("clock-toggles");
    container.innerHTML = "";

    const fragment = document.createDocumentFragment();

    for (const clockDef of clocks) {
      const row = Utils.createElement("div", "setting-row");

      const label = Utils.createElement("label", "setting-label", clockDef.city);
      label.setAttribute("for", `toggle-clock-${clockDef.zone}`);

      const toggleLabel = Utils.createElement("label", "toggle");
      toggleLabel.setAttribute("aria-label", `Enable ${clockDef.city} clock`);

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `toggle-clock-${clockDef.zone}`;
      input.checked = clockDef.enabled;
      input.setAttribute("role", "switch");

      const track = Utils.createElement("span", "toggle-track");
      const thumb = Utils.createElement("span", "toggle-thumb");
      track.appendChild(thumb);

      input.addEventListener("change", () => {
        clockDef.enabled = input.checked;
        saveClocks();
        renderWorldClocks();
      });

      toggleLabel.appendChild(input);
      toggleLabel.appendChild(track);

      row.appendChild(label);
      row.appendChild(toggleLabel);
      fragment.appendChild(row);
    }

    container.appendChild(fragment);
  }

  function init() {
    loadClocks();
    formatMainClock();
    renderWorldClocks();
    buildClockToggles();
    intervalId = setInterval(tick, 1000);
  }

  return { init, buildClockToggles, renderWorldClocks };
})();