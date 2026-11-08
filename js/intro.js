/* Home top section (Figma "new" page, Homepage):
   - a full-width NYC sky (the Figma shader) that fades into the white page and scrolls with it
   - intro text + live NYC weather and time
   - the 2D apple: falls from the sky, blinks, eyes follow the mouse, and hops away from the mouse */
(function () {
  window.SKY_HTML = `<div class="hero-sky" aria-hidden="true"><canvas class="sky"></canvas><canvas class="wx-layer"></canvas></div>`;
  window.INTRO_HTML = `
    <div class="hero-text">
      <p class="intro-text">Aiya is a Product Designer from <a href="https://en.wikipedia.org/wiki/Kazakhstan" target="_blank" rel="noopener">Kazakhstan</a> 🇰🇿, now in NYC, who starts with research and builds what she designs. Focused on how people interact with each other and AI.</p>
      <p class="intro-wx" aria-live="off"></p>
    </div>
    <div class="apple-slot" aria-hidden="true"></div>`;

  /* frame units: desktop 1634.8 = the Figma intro container; phone 839.7 units = 354 phone px */
  window.FRAME_UNITS = (phone) => (phone ? 839.7 : 1590);
  window.HERO_UNITS = (phone) => (phone ? 839.7 : 1634.8);
  const PK = 839.7 / 354;   // phone px → frame units

  /* mountIntro(hero, skyEl, {phone}) → controller. Live NYC time + weather unless overridden:
     c.set({ minutes, kind, temp, word }) — null = live again */
  window.mountIntro = function (frame, skyEl, opts) {
    opts = opts || {};
    const S = window.SKY, phone = !!opts.phone;
    const sky = new S.Sky(skyEl.querySelector("canvas.sky"), { weights: [1, 0, 0] });
    const layer = new WeatherLayer(skyEl.querySelector(".wx-layer"));
    const wx = frame.querySelector(".intro-wx");
    const apple = new Apple(frame.querySelector(".apple-slot"), { follow: true, blink: true });
    // Figma: apple centre (1340.4, 294.4) in the 1634.8 × 588.8 container, turned 30°.
    // Drag and throw it from edge to edge; it passes behind the text.
    const o = phone
      ? { W: 839.7, H: 250 * PK, x: 177 * PK, y: 250 * PK - 196, a: 30, minX: 215, maxX: 839.7 - 215 }
      : { W: 1634.8, H: 588.8, x: 1340.4, y: 294.4, a: 30, minX: 215, maxX: 1634.8 - 215 };
    const phys = new ApplePhysics(apple, frame, o);
    new IntersectionObserver((es, ob) => { if (es[0].isIntersecting) { phys.start(); ob.disconnect(); } }, { threshold: 0.2 }).observe(frame);

    const over = {};
    function update() {
      const L = S.NYC.live || {};
      const min = over.minutes ?? S.nycMinutes();
      const w = S.weightsAt(min, L.sunrise, L.sunset);
      const isDay = over.minutes != null ? w[0] + w[1] * 0.5 > 0.5 : (L.isDay ?? w[2] < 0.5);
      const [kind, word] = over.kind != null ? [over.kind, over.word] : WeatherLayer.kindOf(L.code, isDay);
      sky.params.weights = w;
      sky.params.weatherPreset = 0;
      layer.set(kind);
      const temp = over.temp ?? L.temp;
      const t = over.minutes != null
        ? new Date(2000, 0, 1, Math.floor(min / 60), min % 60).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(" ", "").toLowerCase()
        : S.nycTime();
      // Figma: "In NYC it’s rainy (12°C), 6:30pm."
      const w0 = word ? word.charAt(0).toLowerCase() + word.slice(1) : "";
      wx.textContent = "In NYC it’s " + (w0 ? w0 + " " : "") + (temp != null ? `(${temp}°C)` : "") + (w0 || temp != null ? ", " : "") + t + ".";
    }
    S.NYC.on(update); S.NYC.start();
    update(); setInterval(update, 15000);
    return { sky, apple, phys, update, layer,
      set(v) { Object.assign(over, v); Object.keys(over).forEach((k) => over[k] == null && delete over[k]); update(); } };
  };
})();
