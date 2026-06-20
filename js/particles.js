const Particles = (() => {
  let canvas, ctx, particles = [], enabled = true, count = 60;

  const SPEED = 0.25;

  const loop = Utils.raf(() => {
    update();
    draw();
  });

  const onResize = Utils.debounce(() => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    particles.forEach(p => {
      p.x = Math.random() * canvas.width;
      p.y = Math.random() * canvas.height;
    });
  }, 200);

  function init(canvasEl) {
    canvas = canvasEl;
    ctx    = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", onResize);
  }

  function createParticle() {
    return {
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      vx:     (Math.random() - 0.5) * SPEED,
      vy:     (Math.random() - 0.5) * SPEED,
      radius: Math.random() * 1.5 + 0.5,
      alpha:  Math.random() * 0.3 + 0.05,
    };
  }

  function build() {
    particles = Array.from({ length: count }, createParticle);
  }

  function update() {
    const w = canvas.width;
    const h = canvas.height;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -2)    p.x = w + 2;
      if (p.x > w + 2) p.x = -2;
      if (p.y < -2)    p.y = h + 2;
      if (p.y > h + 2) p.y = -2;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(79, 140, 255, ${p.alpha})`;
      ctx.fill();
    }
  }

  function start() {
    build();
    loop.start();
  }

  function stop() {
    loop.stop();
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function setEnabled(val) {
    enabled = val;
    enabled ? start() : stop();
  }

  function setCount(val) {
    count = val;
    if (enabled) {
      stop();
      start();
    }
  }

  function isEnabled() {
    return enabled;
  }

  return { init, start, stop, setEnabled, setCount, isEnabled };
})();