/* The first home block: NYC sky, weather layer, intro text, yurt, live NYC weather + time, 2D apple. */
(function () {
  window.INTRO_HTML = `
    <canvas class="sky"></canvas>
    <canvas class="wx-layer" aria-hidden="true"></canvas>
    <p class="intro-text">Aiya is a Product Designer from <a href="https://en.wikipedia.org/wiki/Kazakhstan" target="_blank" rel="noopener">Kazakhstan</a> 🇰🇿, <a href="https://www.bbc.com/travel/article/20181120-the-birthplace-of-the-modern-apple" target="_blank" rel="noopener">the home of apples</a>. Now in NYC</p>
    <div class="yurt" aria-hidden="true"><img src="assets/yurt.webp" alt="" draggable="false"></div>
    <p class="intro-wx" aria-live="off"></p>
    <div class="apple-slot" aria-hidden="true"></div>`;

  /* Frame units. Desktop: 1590 = the Figma frame. Phone: 839.7 units = 354 phone px,
     so the 431-unit apple is 181.7 px like in the iPhone Figma frame. */
  window.FRAME_UNITS = (phone) => (phone ? 839.7 : 1590);
  const PK = 839.7 / 354;   // phone px → frame units

  /* mountIntro(frame) → controller. Follows live NYC time + weather unless overridden:
     c.set({ minutes, kind, temp, word }) — null = live again */
  window.mountIntro = function (frame, opts) {
    opts = opts || {};
    const S = window.SKY, phone = !!opts.phone;
    const sky = new S.Sky(frame.querySelector("canvas"), { weights: [1, 0, 0] });
    const wx = frame.querySelector(".intro-wx");
    const layer = new WeatherLayer(frame.querySelector(".wx-layer"));
    const apple = new Apple(frame.querySelector(".apple-slot"), { follow: true, blink: true });
    // Figma: apple centre (1364.4, 443.4) of 1590×680, turned 30°. Phone: centre (210.4, 256.1) of 354×423.
    // phone: the apple rests on the bottom edge (its lowest point is 192.6 units below its centre)
    const o = phone ? { W: 839.7, H: 380 * PK, x: 210.4 * PK, y: 380 * PK - 196, a: 30, minX: 90 * PK, maxX: 300 * PK }
                    : { W: 1590, H: 680, x: 1364.4, y: 443.4, a: 30, minX: 260, maxX: 1440 };
    const phys = new ApplePhysics(apple, frame, o);
    let yurtPhys = null;
    if (!phone) {   // the yurt can be picked up and dropped too
      const yurt = { host: frame.querySelector(".yurt") };
      yurtPhys = new ApplePhysics(yurt, frame, { W: 1590, H: 680, x: 167.2, y: 498.4, a: 0, S: [290.42, 245.65], minX: 150, maxX: 1440, rest: true });
    }
    new IntersectionObserver((es, ob) => { if (es[0].isIntersecting) { phys.start(); ob.disconnect(); } }, { threshold: 0.35 }).observe(frame);

    const over = {};
    function update() {
      const L = S.NYC.live || {};
      const min = over.minutes ?? S.nycMinutes();
      const w = S.weightsAt(min, L.sunrise, L.sunset);
      const isDay = over.minutes != null ? w[0] + w[1] * 0.5 > 0.5 : (L.isDay ?? w[2] < 0.5);
      const [kind, word] = over.kind != null ? [over.kind, over.word] : WeatherLayer.kindOf(L.code, isDay);
      sky.params.weights = w;
      sky.params.weatherPreset = 0;   // the shader keeps its Figma look; weather is drawn on top
      layer.set(kind);
      const temp = over.temp ?? L.temp;
      const t = over.minutes != null
        ? new Date(2000, 0, 1, Math.floor(min / 60), min % 60).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(" ", "").toLowerCase()
        : S.nycTime();
      // Figma: "In New York it’s sunny, 19°C, 3:12pm"
      const w0 = word ? word.charAt(0).toLowerCase() + word.slice(1) : "";
      wx.textContent = "In New York it’s " + [w0, temp != null ? temp + "°C" : null, t].filter(Boolean).join(", ");
    }
    S.NYC.on(update); S.NYC.start();
    update(); setInterval(update, 15000);
    return {
      sky, apple, phys, yurtPhys, update, layer,
      set(v) { Object.assign(over, v); Object.keys(over).forEach((k) => over[k] == null && delete over[k]); update(); }
    };
  };
})();
