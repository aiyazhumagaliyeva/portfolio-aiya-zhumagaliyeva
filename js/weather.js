/* Weather layer — drawn in code ON TOP of the Figma sky shader (the shader keeps its own look).
   kinds: clear, cloudy, fog, drizzle, rain, snow, storm */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rnd = (a, b) => a + Math.random() * (b - a);

  function cloudSprite(dark) {   // one soft cloud, drawn once
    const c = document.createElement("canvas"); c.width = 520; c.height = 220;
    const g = c.getContext("2d");
    const puffs = [[130, 140, 90], [220, 105, 110], [320, 120, 95], [400, 150, 70], [260, 160, 100], [170, 165, 70]];
    puffs.forEach(([x, y, r]) => {
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      const col = dark ? "205,212,224" : "255,255,255";
      gr.addColorStop(0, `rgba(${col},.55)`); gr.addColorStop(0.6, `rgba(${col},.28)`); gr.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    });
    return c;
  }
  const SPR = { light: null, dark: null };

  function Weather(canvas) {
    this.c = canvas; this.g = canvas.getContext("2d"); this.kind = "clear"; this.parts = []; this.clouds = []; this.flash = 0; this.nextFlash = 0;
    this.visible = true;
    new ResizeObserver(() => this.resize()).observe(canvas);
    new IntersectionObserver((es) => { this.visible = es[0].isIntersecting; }).observe(canvas);
    this.resize();
    let last = 0;
    const loop = (t) => {
      if (this.visible && t - last > 1000 / 40) { const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t; this.draw(dt, t); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  Weather.prototype.resize = function () {
    const r = this.c.getBoundingClientRect(); if (!r.width) return;
    this.k = Math.min(devicePixelRatio || 1, 1.5);
    this.c.width = Math.round(r.width * this.k); this.c.height = Math.round(r.height * this.k);
    this.W = r.width; this.H = r.height; this.s = r.width / 1590;   // 1 Figma px
    this.set(this.kind, true);
  };
  Weather.prototype.set = function (kind, force) {
    if (kind === this.kind && !force) return;
    this.kind = kind;
    const W = this.W || 1, H = this.H || 1, s = Math.max(this.s || 1, 0.35);
    const n = { drizzle: 70, rain: 170, storm: 240, snow: 120 }[kind] || 0;
    this.parts = Array.from({ length: n }, () => this.spawn(true));
    const cl = { cloudy: 7, fog: 6, drizzle: 6, rain: 7, storm: 8, snow: 5 }[kind] || 0;
    if (!SPR.light) { SPR.light = cloudSprite(false); SPR.dark = cloudSprite(true); }
    this.clouds = Array.from({ length: cl }, (_, i) => ({
      x: rnd(-0.2, 1.05) * W, y: rnd(-0.12, 0.55) * H, w: rnd(380, 720) * s, v: rnd(6, 16) * s, a: rnd(0.55, 1), dark: kind === "storm" || (kind === "rain" && i % 2 === 0)
    }));
  };
  Weather.prototype.spawn = function (anywhere) {
    const W = this.W, H = this.H, s = Math.max(this.s, 0.35), k = this.kind;
    if (k === "snow") return { x: rnd(0, W), y: anywhere ? rnd(0, H) : -10, r: rnd(1.6, 4.4) * s * 1.4, v: rnd(30, 70) * s, ph: rnd(0, 6.28), sw: rnd(10, 26) * s };
    const heavy = k === "storm" ? 1.25 : k === "drizzle" ? 0.6 : 1;
    return { x: rnd(-0.1, 1.1) * W, y: anywhere ? rnd(0, H) : rnd(-60, -10), l: rnd(14, 30) * s * heavy, v: rnd(700, 1000) * s * heavy, a: rnd(0.18, 0.42) };
  };
  Weather.prototype.draw = function (dt, t) {
    const g = this.g, W = this.W, H = this.H; if (!W) return;
    g.setTransform(this.k, 0, 0, this.k, 0, 0); g.clearRect(0, 0, W, H);
    if (reduce) dt = 0;
    const k = this.kind;
    // fog: a soft white wash that is thicker at the bottom
    if (k === "fog") {
      const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, "rgba(255,255,255,.10)"); gr.addColorStop(1, "rgba(255,255,255,.38)");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }
    if (k === "storm") { g.fillStyle = "rgba(40,50,72,.16)"; g.fillRect(0, 0, W, H); }
    // clouds drifting right
    this.clouds.forEach((c) => {
      c.x += c.v * dt; if (c.x > W + 40) { c.x = -c.w - rnd(0, 200); c.y = rnd(-0.12, 0.55) * H; }
      g.globalAlpha = c.a * (k === "fog" ? 0.8 : 1);
      g.drawImage(c.dark ? SPR.dark : SPR.light, c.x, c.y, c.w, c.w * 220 / 520);
    });
    g.globalAlpha = 1;
    if (k === "snow") {
      g.fillStyle = "rgba(255,255,255,.9)";
      this.parts.forEach((p, i) => {
        p.y += p.v * dt; p.ph += dt * 1.3;
        const x = p.x + Math.sin(p.ph) * p.sw;
        if (p.y > H + 10) this.parts[i] = this.spawn(false);
        g.globalAlpha = 0.55 + (p.r / 8); g.beginPath(); g.arc(x, p.y, p.r, 0, Math.PI * 2); g.fill();
      });
      g.globalAlpha = 1;
    } else if (this.parts.length) {
      const slant = 0.22;
      g.lineCap = "round"; g.lineWidth = Math.max(1, 1.6 * this.s);
      this.parts.forEach((p, i) => {
        p.y += p.v * dt; p.x += p.v * slant * dt;
        if (p.y > H + 30) this.parts[i] = this.spawn(false);
        g.strokeStyle = `rgba(235,243,255,${p.a})`;
        g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x - p.l * slant, p.y - p.l); g.stroke();
      });
    }
    // lightning: a quick double flash every 7–14 s
    if (k === "storm" && !reduce) {
      if (!this.nextFlash) this.nextFlash = t + rnd(2500, 6000);
      if (t > this.nextFlash) { this.flash = t; this.nextFlash = t + rnd(7000, 14000); }
      const e = t - this.flash, a = e < 90 ? 0.32 : e < 160 ? 0 : e < 260 ? 0.22 : 0;
      if (a) { g.fillStyle = `rgba(255,255,255,${a})`; g.fillRect(0, 0, W, H); }
    }
  };

  /* WMO code → [kind, word] */
  Weather.kindOf = function (code, isDay) {
    if (code == null) return ["clear", ""];
    if (code === 0) return ["clear", isDay ? "Sunny" : "Clear"];
    if (code === 1) return ["clear", isDay ? "Mostly sunny" : "Mostly clear"];
    if (code === 2) return ["cloudy", "Partly cloudy"];
    if (code === 3) return ["cloudy", "Cloudy"];
    if (code === 45 || code === 48) return ["fog", "Foggy"];
    if (code >= 51 && code <= 57) return ["drizzle", "Drizzle"];
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return ["rain", "Rainy"];
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return ["snow", "Snowy"];
    if (code >= 95) return ["storm", "Stormy"];
    return ["cloudy", "Cloudy"];
  };
  window.WeatherLayer = Weather;
})();
