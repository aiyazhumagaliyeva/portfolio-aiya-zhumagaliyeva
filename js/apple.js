/* "Apple - Illustration" component from Figma (431×431 variants):
   regular / right / left / up / down / when dragged / blink.
   Apple(el, {follow, blink, physics}) builds one inside el. */
(function () {
  const ALMOND = "M0 32.8626C17.8955 8.06371 66.5824 -26.6548 118.166 32.8626C96.9495 54.3862 43.6134 84.5191 0 32.8626Z";
  const BLINK = "M94.3451 12.662C51.7734 6.61241 15.0062 9.46804 2.84924 16.8309";
  const SQUINT_R = "M256.556 5.5C213.556 5.5 177.557 13.5 166.556 22.5C151.821 34.5564 217.722 36.6667 256.556 33.5";
  const SQUINT_L = "M0.447144 5.5C43.4465 5.5 79.4462 13.5 90.4464 22.5C105.182 34.5564 39.2803 36.6667 0.447014 33.5";
  const EYES = [{ x: 65.15, y: 158.03, cx: 56.78 }, { x: 253.91, y: 158.03, cx: 58.32 }];
  const CY = 32.23;
  // pupil travel, from the Figma variants (right / left / up / down)
  const RANGE = { right: 32.2, left: 33.8, up: 16.2, down: 19.8 };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let uid = 0;
  const BLINK_MS = 2000;   // eyes closed for 2 seconds

  function Apple(host, opt) {
    opt = Object.assign({ follow: true, blink: true }, opt || {});
    const id = "alm" + ++uid;
    host.classList.add("apple");
    host.innerHTML = `
      <svg class="apple-face" viewBox="0 0 431 431" aria-hidden="true">
        <image href="assets/apple.webp" x="0" y="0" width="431" height="431"/>
        <defs><clipPath id="${id}"><path d="${ALMOND}"/></clipPath></defs>
        <g class="st-open">${EYES.map((e) => `
          <g transform="translate(${e.x} ${e.y})"><path d="${ALMOND}" fill="#fff"/>
            <g clip-path="url(#${id})"><circle class="pupil" cx="${e.cx}" cy="${CY}" r="29.16" fill="#000"/></g></g>`).join("")}
        </g>
        <g class="st-blink" fill="none" stroke="#000" stroke-width="11">
          <path d="${BLINK}" transform="translate(91.4 182)"/><path d="${BLINK}" transform="translate(252.4 182)"/>
        </g>
        <g class="st-drag" fill="none" stroke="#000" stroke-width="11" transform="translate(88.5 175)">
          <path d="${SQUINT_R}"/><path d="${SQUINT_L}"/>
        </g>
      </svg>`;
    this.host = host; this.opt = opt;
    this.pupils = [...host.querySelectorAll(".pupil")];
    this.look = { x: 0, y: 0 }; this.lookTo = { x: 0, y: 0 }; this.forced = null;
    this.setState("open");
    if (opt.blink) this.scheduleBlink();
    if (opt.follow) {
      addEventListener("pointermove", (e) => this.aim(e.clientX, e.clientY), { passive: true });
      const tick = () => { this.stepEyes(); requestAnimationFrame(tick); }; requestAnimationFrame(tick);
    }
  }
  Apple.prototype.setState = function (s) { this.state = s; this.host.dataset.eyes = s; };
  /* face = "open" | "blink" | "drag" — what the eyes show right now */
  Apple.prototype.face = function () {
    if (this.forcedFace) return this.forcedFace;
    if (this.dragging) return "drag";
    if (this.blinking) return "blink";
    return "open";
  };
  Apple.prototype.refresh = function () { this.setState(this.face()); };
  Apple.prototype.scheduleBlink = function () {
    clearTimeout(this.bt);
    this.bt = setTimeout(() => this.blink(), 10000 + Math.random() * 5000);   // every 10–15 s
  };
  Apple.prototype.blink = function () {
    this.blinking = true; this.refresh();
    clearTimeout(this.bo);
    this.bo = setTimeout(() => { this.blinking = false; this.refresh(); if (this.opt.blink) this.scheduleBlink(); }, BLINK_MS);
  };
  /* point the pupils at a screen point */
  Apple.prototype.aim = function (px, py) {
    if (this.forced) return;
    const r = this.host.getBoundingClientRect(); if (!r.width) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height * 0.44;
    let dx = px - cx, dy = py - cy;
    const a = -(this.angle || 0) * Math.PI / 180;   // into the apple's own (rotated) frame
    const rx = dx * Math.cos(a) - dy * Math.sin(a), ry = dx * Math.sin(a) + dy * Math.cos(a);
    const reach = r.width * 0.9;
    const k = Math.min(1, Math.hypot(rx, ry) / reach), n = Math.hypot(rx, ry) || 1;
    this.lookTo = { x: (rx / n) * k, y: (ry / n) * k };
  };
  /* force a look: "regular" | "right" | "left" | "up" | "down" | null (follow mouse) */
  Apple.prototype.lookAt = function (dir) {
    this.forced = dir;
    const m = { regular: [0, 0], right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] }[dir] || [0, 0];
    this.lookTo = { x: m[0], y: m[1] };
    if (!this.opt.follow) { this.look = { ...this.lookTo }; this.paintEyes(); }
  };
  Apple.prototype.stepEyes = function () {
    const L = this.look, T = this.lookTo, k = reduce ? 1 : 0.16;
    L.x += (T.x - L.x) * k; L.y += (T.y - L.y) * k;
    this.paintEyes();
  };
  Apple.prototype.paintEyes = function () {
    const L = this.look;
    const ox = L.x >= 0 ? L.x * RANGE.right : L.x * RANGE.left, oy = L.y >= 0 ? L.y * RANGE.down : L.y * RANGE.up;
    this.pupils.forEach((p, i) => { p.setAttribute("cx", (EYES[i].cx + ox).toFixed(2)); p.setAttribute("cy", (CY + oy).toFixed(2)); });
  };

  /* ---------- Falling + bouncing + dragging, inside a frame ----------
     Figma px of the frame (o.W × o.H); o.S = [w, h] of the thing. Works for the apple and the yurt.
     obj: { host, angle, dragging, refresh() }. o.rest = start already resting (no drop). */
  function Physics(obj, frame, o) {
    const el = obj.host, SW = (o.S || [431, 431])[0], SH = (o.S || [431, 431])[1];
    const st = { x: o.x, y: reduce || o.rest ? o.y : o.y - o.H - 300, vx: 0, vy: 0, a: o.a, va: 0, held: false };
    const G = 5200, BOUNCE = 0.38;
    const unit = () => frame.getBoundingClientRect().width / o.W || 1;
    let lastT = 0, started = reduce || !!o.rest, grab = null, hist = [];
    obj.angle = st.a;
    const paint = () => {
      el.style.transform = `translate(calc(${(st.x - SW / 2).toFixed(2)} * var(--fu)), calc(${(st.y - SH / 2).toFixed(2)} * var(--fu))) rotate(${st.a.toFixed(2)}deg)`;
      obj.angle = st.a;
    };
    paint();
    this.drop = () => { st.x = o.x; st.y = o.y - o.H - 300; st.vx = 0; st.vy = 0; st.a = o.a - 14; st.va = 0; started = true; };
    this.start = () => { started = true; };
    this.reset = () => { st.x = o.x; st.y = o.y; st.vx = st.vy = st.va = 0; st.a = o.a; paint(); };
    const step = (t) => {
      const dt = Math.min(0.033, (t - (lastT || t)) / 1000); lastT = t;
      if (started && !st.held) {
        st.vy += G * dt;
        st.x += st.vx * dt; st.y += st.vy * dt;
        if (st.y >= o.y) {
          st.y = o.y;
          if (st.vy > 260) { st.vy = -st.vy * BOUNCE; st.va += (Math.random() - 0.5) * 60 + st.vx * 0.05; }
          else st.vy = 0;
          st.vx *= 0.86;
        }
        if (st.x < o.minX) { st.x = o.minX; st.vx = Math.abs(st.vx) * 0.5; }
        if (st.x > o.maxX) { st.x = o.maxX; st.vx = -Math.abs(st.vx) * 0.5; }
        // tilt springs back to the Figma angle
        st.va += ((o.a - st.a) * 40 - st.va * 7) * dt; st.a += st.va * dt;
        paint();
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    /* o.flee: no dragging — the apple hops away from the mouse instead */
    if (o.flee) {
      let lastHop = 0, scaredT = 0;
      addEventListener("pointermove", (e) => {
        if (!started || e.pointerType === "touch") return;
        const f = frame.getBoundingClientRect(), k = unit();
        const px = (e.clientX - f.left) / k, py = (e.clientY - f.top) / k;
        const dx = st.x - px, dy = st.y - py, d = Math.hypot(dx, dy), R = o.fleeR || 330;
        if (d > R) return;
        const now = performance.now();
        let dir = Math.sign(dx) || 1;
        // cornered against a wall → jump over the mouse to the other side
        if ((dir < 0 && st.x < o.minX + 60) || (dir > 0 && st.x > o.maxX - 60)) dir = -dir;
        st.vx += dir * (R - d) * 6;
        st.vx = Math.max(-1800, Math.min(1800, st.vx));
        if (st.y >= o.y - 2 && now - lastHop > 380) { st.vy = -(700 + (R - d) * 2.4); lastHop = now; }
        st.va += dir * 60;
        obj.dragging = true; obj.refresh && obj.refresh();   // squints while running
        clearTimeout(scaredT); scaredT = setTimeout(() => { obj.dragging = false; obj.refresh && obj.refresh(); }, 650);
      }, { passive: true });
      // touch: tapping the apple makes it hop
      el.addEventListener("pointerdown", (e) => {
        if (e.pointerType !== "touch" || st.y < o.y - 2) return;
        st.vy = -1100; st.vx += (Math.random() < 0.5 ? -1 : 1) * 500; st.va += 120;
        obj.dragging = true; obj.refresh && obj.refresh();
        setTimeout(() => { obj.dragging = false; obj.refresh && obj.refresh(); }, 650);
      });
      return;
    }
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault(); el.setPointerCapture(e.pointerId);
      const f = frame.getBoundingClientRect(), k = unit();
      grab = { dx: (e.clientX - f.left) / k - st.x, dy: (e.clientY - f.top) / k - st.y };
      st.held = true; started = true; hist = [{ t: performance.now(), x: st.x, y: st.y }];
      obj.dragging = true; obj.refresh && obj.refresh(); el.classList.add("held");
    });
    el.addEventListener("pointermove", (e) => {
      if (!st.held) return;
      const f = frame.getBoundingClientRect(), k = unit();
      const nx = (e.clientX - f.left) / k - grab.dx, ny = (e.clientY - f.top) / k - grab.dy;
      st.a += ((o.a + (nx - st.x) * 0.9) - st.a) * 0.25;
      st.x = Math.max(o.minX - 120, Math.min(o.maxX + 120, nx)); st.y = Math.min(o.y, ny);
      hist.push({ t: performance.now(), x: st.x, y: st.y }); if (hist.length > 6) hist.shift();
      paint();
    });
    const up = () => {
      if (!st.held) return;
      st.held = false; obj.dragging = false; obj.refresh && obj.refresh(); el.classList.remove("held");
      const a = hist[0], b = hist[hist.length - 1], dt = Math.max(0.016, (b.t - a.t) / 1000);
      st.vx = Math.max(-2500, Math.min(2500, (b.x - a.x) / dt)); st.vy = Math.max(-2500, Math.min(2500, (b.y - a.y) / dt));
    };
    el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
  }

  window.Apple = Apple; window.ApplePhysics = Physics;
})();
