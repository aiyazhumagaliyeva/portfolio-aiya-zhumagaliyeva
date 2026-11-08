/* NYC weather gradient — a WebGL2 port of the Figma shader "NYC weather gradient"
   (same math, same params). Figma's own runtime needs WebGPU + HTML-in-Canvas,
   which most browsers don't have yet, so this draws the identical sky with WebGL.

   Changes from the Figma shader (asked for: tied to NYC time, light, not heavy):
   - time of day is a smooth blend of daylight / sunset / night (weights), not a hard switch
   - night is lifted ("nightLift") so it stays soft blue instead of near-black
   - rain / storm presets are mixed toward "cloudy" so bad weather is never dark      */
(function () {
  const VERT = `#version 300 es
  in vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

  const FRAG = `#version 300 es
  precision highp float;
  uniform vec2 uRes; uniform float uTime, uScale;
  uniform vec3 uW;            // weights: daylight, sunset, night
  uniform int uPreset;        // 0 clear, 1 cloudy, 2 rain, 3 snow, 4 storm
  uniform float uTemp, uCover, uMix, uDir, uGrain, uSpeed, uAmount, uStars, uTwinkle, uLift, uSoften;
  out vec4 o;
  float H(vec2 p){ vec3 q = fract(vec3(p.x, p.y, p.x) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  float N(vec2 p){ vec2 c = floor(p), f = fract(p), w = f * f * (3.0 - 2.0 * f);
    return mix(mix(H(c), H(c + vec2(1, 0)), w.x), mix(H(c + vec2(0, 1)), H(c + vec2(1, 1)), w.x), w.y); }
  vec3 ramp(float t){   // Figma "Custom sky colors"
    vec3 a = vec3(0.19, 0.39, 0.67), b = vec3(0.57, 0.72, 0.82), c = vec3(0.96, 0.85, 0.75);
    return t <= 0.52 ? mix(a, b, clamp(t / 0.52, 0.0, 1.0)) : mix(b, c, clamp((t - 0.52) / 0.48, 0.0, 1.0));
  }
  void preset(int k, out vec3 t, out vec3 m, out vec3 h, out float z){
    t = vec3(0.12, 0.39, 0.72); m = vec3(0.48, 0.71, 0.87); h = vec3(0.90, 0.86, 0.77); z = 0.04;
    if (k == 1) { t = vec3(0.31, 0.48, 0.66); m = vec3(0.62, 0.73, 0.81); h = vec3(0.89, 0.86, 0.81); z = 0.15; }
    else if (k == 2) { t = vec3(0.21, 0.30, 0.42); m = vec3(0.43, 0.56, 0.63); h = vec3(0.70, 0.76, 0.76); z = 0.28; }
    else if (k == 3) { t = vec3(0.57, 0.66, 0.79); m = vec3(0.79, 0.85, 0.91); h = vec3(0.95, 0.94, 0.93); z = 0.24; }
    else if (k == 4) { t = vec3(0.12, 0.15, 0.27); m = vec3(0.31, 0.35, 0.47); h = vec3(0.58, 0.59, 0.64); z = 0.34; }
  }
  void main(){
    vec2 uv = vec2(gl_FragCoord.x / uRes.x, 1.0 - gl_FragCoord.y / uRes.y);
    float aspect = uRes.x / uRes.y, time = uTime;
    float cover = clamp(uCover / 100.0, 0.0, 1.0), mA = clamp(uAmount / 100.0, 0.0, 1.0), ft = time * max(uSpeed, 0.0);
    float th = uDir * 0.01745329252 + mA * (0.19 * sin(ft * 0.16) + 0.07 * sin(ft * 0.29));
    vec2 ax = vec2(cos(th), sin(th)), p = (uv - 0.5) * vec2(aspect, 1.0);
    float ext = max(abs(ax.x) * aspect + abs(ax.y), 0.001);
    vec2 drift = mA * (ax * ft * 0.055 + vec2(0.24 * sin(ft * 0.13), 0.18 * (cos(ft * 0.17) - 1.0)));
    vec2 evo = vec2(sin(ft * 0.11), cos(ft * 0.14) - 1.0) * mA * 0.32;
    float warp = (N(p * 2.4 + drift + 11.6) - 0.5) * 0.14 * mA;
    float pos = clamp(0.5 + dot(p, ax) / ext + mA * 0.085 * sin(ft * 0.25) + warp, 0.0, 1.0);
    vec2 cu = (p + drift) * vec2(2.6, 3.8) + vec2(7.3, 2.8) + evo;
    float cloud = N(cu) * 0.62 + N(cu * 2.07 + 4.1) * 0.27 + N(cu * 4.13 + 9.7) * 0.11;

    vec3 T, M, Hz; float haze; preset(uPreset, T, M, Hz, haze);
    if (uPreset == 2 || uPreset == 4) {   // keep bad weather light
      vec3 t2, m2, h2; float z2; preset(1, t2, m2, h2, z2);
      T = mix(T, t2, uSoften); M = mix(M, m2, uSoften); Hz = mix(Hz, h2, uSoften); haze = mix(haze, z2, uSoften * 0.5);
    }
    float warm = clamp((uTemp + 20.0) / 60.0, 0.0, 1.0);
    vec3 tint = mix(vec3(-0.07, 0.0, 0.09), vec3(0.14, 0.025, -0.07), warm);
    T += tint * 0.45; M += tint * 0.75; Hz += tint;

    // the three looks, blended by time of day
    vec3 sT = mix(T, vec3(0.22, 0.24, 0.47), 0.68), sM = mix(M, vec3(0.72, 0.46, 0.56), 0.72), sH = mix(Hz, vec3(1.0, 0.69, 0.43), 0.82);
    vec3 nT = T * mix(vec3(0.12, 0.15, 0.26), vec3(1.0), uLift), nM = M * mix(vec3(0.16, 0.20, 0.34), vec3(1.0), uLift), nH = Hz * mix(vec3(0.28, 0.26, 0.33), vec3(1.0), uLift);
    vec3 w = uW / max(uW.x + uW.y + uW.z, 0.0001);
    vec3 top = T * w.x + sT * w.y + nT * w.z, mid = M * w.x + sM * w.y + nM * w.z, hor = Hz * w.x + sH * w.y + nH * w.z;

    float sp = mix(pos, smoothstep(0.0, 1.0, pos), 1.0 - cover);
    vec3 col = mix(top, mid, smoothstep(0.0, 0.64, sp));
    col = mix(col, hor, smoothstep(0.42, 1.0, sp));
    vec3 cc = ramp(pos); float pm = clamp(uMix / 100.0, 0.0, 1.0);
    vec3 sky = mix(col, cc, pm);
    float lum = dot(sky, vec3(0.2126, 0.7152, 0.0722));
    sky = mix(sky, vec3(lum), cover * 0.28);
    float hs = (0.035 + haze + cover * 0.29) * smoothstep(0.18, 0.83, cloud);
    vec3 hc = mix(mid, vec3(0.89, 0.90, 0.91), 0.45) * w.x + mix(sM, sH, 0.35) * w.y + (nM * 1.22) * w.z;
    hc = mix(hc, cc, pm);
    sky = mix(sky, hc, hs);

    if (w.z > 0.001) {   // stars (fixed positions, only their light twinkles)
      vec2 g = (p + vec2(3.7, 2.1)) * 24.0, cell = floor(g);
      float seed = H(cell + 91.7);
      vec2 cen = vec2(H(cell + 14.1), H(cell + 63.9)) * 0.6 + 0.2;
      float d = length(fract(g) - cen);
      float ph = uRes.y / max(uScale, 0.001);
      float r = mix(0.55, 1.15, seed) * 24.0 / ph;
      float aa = max(fwidth(d), 0.0001);
      float core = 1.0 - smoothstep(max(r - aa, 0.0), r + aa, d);
      float halo = exp(-d * d / max(r * r * 5.0, 1e-6)) * 0.12;
      float amt = clamp(uStars / 100.0, 0.0, 1.0);
      float present = step(1.0 - amt * 0.24, seed) * step(0.001, amt);
      float tw = mix(1.0, 0.55 + (0.5 + 0.5 * sin(time * (0.65 + seed * 0.8) + seed * 63.0)) * 0.45, clamp(uTwinkle / 100.0, 0.0, 1.0));
      // Figma hides stars under heavy cloud cover; here stars are only thinned so night always has a few
      float occ = mix(1.0 - cover, 1.0, 0.55) * (1.0 - smoothstep(0.30, 0.76, cloud) * cover * 0.6);
      float light = clamp((core + halo) * present * tw * occ, 0.0, 1.0) * w.z;
      sky = mix(sky, mix(vec3(0.72, 0.83, 1.0), vec3(1.0, 0.94, 0.81), seed), light);
    }
    float grain = (H(floor(uv * vec2(aspect, 1.0) * 540.0)) - 0.5) * (uGrain / 100.0) * 0.10;
    o = vec4(clamp(sky + grain, 0.0, 1.0), 1.0);
  }`;

  // Figma params on the homepage intro + footer
  const FIGMA = { motionAmount: 44, motionSpeed: 0.55, cloudCover: 94, temperature: 40, customMix: 24, direction: 314,
                  grainAmount: 70, starsAmount: 68, twinkleAmount: 100, weatherPreset: 0, nightLift: 0.38, soften: 0.55 };

  const skies = [];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Sky(canvas, params). params.weights = [day, sunset, night]. Change params any time. */
  function Sky(canvas, params) {
    const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
    this.canvas = canvas; this.params = Object.assign({ weights: [1, 0, 0] }, FIGMA, params || {});
    this.ok = !!gl; if (!gl) { canvas.classList.add("no-gl"); return; }
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s)); return s; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(pr)); this.ok = false; canvas.classList.add("no-gl"); return; }
    gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {}; ["uRes", "uTime", "uScale", "uW", "uPreset", "uTemp", "uCover", "uMix", "uDir", "uGrain", "uSpeed", "uAmount", "uStars", "uTwinkle", "uLift", "uSoften"]
      .forEach((n) => (this.u[n] = gl.getUniformLocation(pr, n)));
    this.gl = gl; this.visible = true; this.t0 = performance.now() - Math.random() * 20000;
    new ResizeObserver(() => this.resize()).observe(canvas); this.resize();
    new IntersectionObserver((es) => { this.visible = es[0].isIntersecting; }).observe(canvas);
    skies.push(this);
  }
  Sky.prototype.resize = function () {
    const r = this.canvas.getBoundingClientRect(); if (!r.width) return;
    this.scale = Math.min(devicePixelRatio || 1, 1.5);
    this.canvas.width = Math.round(r.width * this.scale); this.canvas.height = Math.round(r.height * this.scale);
    this.draw(performance.now());
  };
  Sky.prototype.draw = function (now) {
    if (!this.ok || !this.canvas.width) return;
    const gl = this.gl, u = this.u, P = this.params;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uTime, reduce ? 40 : (now - this.t0) / 1000);
    gl.uniform1f(u.uScale, this.scale);
    gl.uniform3f(u.uW, P.weights[0], P.weights[1], P.weights[2]);
    gl.uniform1i(u.uPreset, P.weatherPreset | 0);
    gl.uniform1f(u.uTemp, P.temperature); gl.uniform1f(u.uCover, P.cloudCover); gl.uniform1f(u.uMix, P.customMix);
    gl.uniform1f(u.uDir, P.direction); gl.uniform1f(u.uGrain, P.grainAmount); gl.uniform1f(u.uSpeed, P.motionSpeed);
    gl.uniform1f(u.uAmount, P.motionAmount); gl.uniform1f(u.uStars, P.starsAmount); gl.uniform1f(u.uTwinkle, P.twinkleAmount);
    gl.uniform1f(u.uLift, P.nightLift); gl.uniform1f(u.uSoften, P.soften);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  let last = 0;
  function loop(now) {
    if (now - last > 1000 / 30) {   // 30 fps is plenty for a slow sky
      last = now;
      skies.forEach((s) => { if (s.visible && s.canvas.offsetParent !== null) s.draw(now); });
    }
    if (!reduce) requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ---------- NYC time of day → weights ---------- */
  const TZ = "America/New_York";
  function nycMinutes(d) {
    const p = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(d || new Date());
    return (+p.find((x) => x.type === "hour").value % 24) * 60 + +p.find((x) => x.type === "minute").value;
  }
  const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  /* minutes since NYC midnight → [day, sunset, night]. Sunrise/sunset glow lasts ~1.5h each. */
  function weightsAt(min, sunrise, sunset) {
    sunrise = sunrise ?? 6 * 60 + 40; sunset = sunset ?? 17 * 60 + 50;
    const glow = Math.max(1 - Math.abs(min - sunrise) / 55, 1 - Math.abs(min - sunset) / 55, 0);
    const g = sstep(0, 1, glow);
    const day = sstep(sunrise - 25, sunrise + 35, min) * (1 - sstep(sunset - 35, sunset + 25, min));
    return [day * (1 - g), g, (1 - day) * (1 - g)];
  }
  /* WMO weather code → [shader preset, word]. */
  function weatherOf(code, isDay) {
    if (code == null) return [0, ""];
    if (code === 0) return [0, isDay ? "Sunny" : "Clear"];
    if (code === 1) return [0, isDay ? "Mostly sunny" : "Mostly clear"];
    if (code === 2) return [1, "Partly cloudy"];
    if (code === 3) return [1, "Cloudy"];
    if (code === 45 || code === 48) return [1, "Foggy"];
    if (code >= 51 && code <= 57) return [2, "Drizzle"];
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return [2, "Rainy"];
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return [3, "Snowy"];
    if (code >= 95) return [4, "Stormy"];
    return [1, "Cloudy"];
  }
  const nycTime = (d) => new Date(d || Date.now()).toLocaleTimeString("en-US", { timeZone: TZ, hour: "numeric", minute: "2-digit" }).replace(" ", "").toLowerCase();

  /* Live NYC weather (Open-Meteo, no key). cb({temp, code, isDay, sunrise, sunset}) */
  const NYC = { live: null, listeners: [] };
  const toMin = (s) => { const m = /T(\d\d):(\d\d)/.exec(s || ""); return m ? +m[1] * 60 + +m[2] : null; };
  function fetchNYC() {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&current=temperature_2m,weather_code,is_day&daily=sunrise,sunset&timezone=America%2FNew_York&forecast_days=1")
      .then((r) => r.json()).then((j) => {
        NYC.live = { temp: Math.round(j.current.temperature_2m), code: j.current.weather_code, isDay: !!j.current.is_day,
                     sunrise: toMin(j.daily.sunrise[0]), sunset: toMin(j.daily.sunset[0]) };
        try { localStorage.setItem("nycWeather", JSON.stringify(NYC.live)); } catch (e) {}
        NYC.listeners.forEach((f) => f(NYC.live));
      }).catch(() => {   // weather service down: use the last weather this browser saw, or the saved snapshot
        if (NYC.live) return;
        let last = null; try { last = JSON.parse(localStorage.getItem("nycWeather") || "null"); } catch (e) {}
        const snap = last || window.NYC_SNAPSHOT;
        if (snap) { NYC.live = snap; NYC.listeners.forEach((f) => f(NYC.live)); }
      });
  }
  NYC.on = (f) => { NYC.listeners.push(f); if (NYC.live) f(NYC.live); };
  NYC.start = () => { if (NYC.started) return; NYC.started = true; fetchNYC(); setInterval(fetchNYC, 15 * 60 * 1000); };

  window.SKY = { Sky, FIGMA, weightsAt, nycMinutes, weatherOf, nycTime, NYC };
})();
