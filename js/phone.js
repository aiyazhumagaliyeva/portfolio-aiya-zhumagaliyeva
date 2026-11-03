/* iPhone layout — built from the Figma "Phone-…" frames (393 wide). 1 Figma phone px = var(--p). */
(function () {
  const p = (n) => `calc(${n} * var(--p))`;
  const pct = (v, of) => (v / of * 100).toFixed(3) + "%";
  const TOP20 = [20, 20, 0, 0];

  /* item: [src, w, h, o]  o: v video, c crop [w%,h%,x%,y%], fit "contain" | "cover", r radius (n or [4]), cap caption */
  function item([src, w, h, o]) {
    o = o || {};
    const pos = o.c ? `style="width:${o.c[0]}%;height:${o.c[1]}%;left:${o.c[2]}%;top:${o.c[3]}%"` : `class="fill${o.fit === "contain" ? " contain" : ""}"`;
    const tag = o.v ? `<video src="${src}" muted loop playsinline preload="metadata" data-auto ${pos}></video>` : `<img src="${src}" alt="" loading="lazy" ${pos}>`;
    const r = o.r == null ? "0" : (Array.isArray(o.r) ? o.r : [o.r]).map(p).join(" ");
    const box = `<div class="mi" style="width:${p(w)};height:${p(h)};border-radius:${r}">${tag}</div>`;
    return o.cap ? `<div class="ph-fig">${box}<span class="ph-cap">${o.cap}</span></div>` : box;
  }
  const text = (html) => `<div class="ph-txt">${html}</div>`;
  const group = (gap, parts) => `<div class="ph-stack" style="gap:${p(gap)}">${parts.join("")}</div>`;

  const CASES = {
    orderly: { title: "Orderly", when: "September - December 2025", body: [group(40, [
      text("<p>People in New York have a hard time keeping up with friends. New York offers endless opportunities, yet many students struggle to build meaningful relationships. Between demanding schedules, long commutes, and the city's fast pace, staying connected often becomes an afterthought, leading to missed events, weaker social networks, and feelings of isolation. Orderly solves that issue by making it easier to stay in touch with your friends.</p>"),
      item(["assets/orderly-themes.mp4", 230, 468, { v: 1, c: [174, 125.28, -37, -12.64], r: TOP20, cap: "Customizable themes" }]),
      item(["assets/orderly-chat.png", 244, 471, { c: [177.05, 133.16, -40.86, -17.2], r: TOP20, cap: "In-app chatting" }]),
      text("<p>How do you stay close with friends when meeting up takes 4 apps?</p><p>It often takes more than one app to meet up with friends (maps, calendar, a messenger, and often also a searching tool to find where to go), making reaching out and planning feel actually impossible. What if there was an app that combined the 4 inside?</p>"),
      item(["assets/orderly-screens.png", 354, 187.4, { c: [112.75, 105.49, -6.38, -2.65] }]),
      text("<p>The app features weekly workload overview, easily accessible schedule on hand, and customizable time slots where you can insert where your loved ones live and know when you call them at any time.</p>"),
      item(["assets/orderly-widgets.png", 354, 247.9, { c: [100, 99.44, 0, 0.28] }]),
      item(["assets/orderly-group-event.mp4", 318, 460, { v: 1, c: [133, 134.26, -16.5, -17.16], r: TOP20, cap: "Group event creation" }]),
      item(["assets/orderly-ai-suggest.mp4", 338, 446, { v: 1, c: [126.04, 138.68, -13.02, -19.14], r: TOP20, cap: "AI meet-up suggestions" }]),
      item(["assets/orderly-weekly.mp4", 338, 468, { v: 1, c: [128.4, 134.65, -14.2, -17.13], r: TOP20, cap: "Solo event creation" }]),
      item(["assets/orderly-notifications.webp", 329, 487, { c: [66.52, 97.59, 16.74, 2.41], r: TOP20, cap: "Notifications" }])
    ])] },
    powerpoints: { title: "PowerPoints", when: "April 2025", body: [group(40, [
      text("<p>Long hours of studying and working can leave students physically exhausted and mentally drained. Between all-nighters, demanding deadlines, and hours spent at a desk, pain and fatigue often build up in different parts of the body. But what if we could move that discomfort somewhere else, or share it with someone else? PowerPoints explores this possibility through a speculative app that allows users to track, redistribute, and transfer physical energy and pain within their bodies and between other people.</p>"),
      item(["assets/pp-brand.webp", 360, 236, {}]),
      text("<p>PowerPoints imagines the body as a system of energy points. Each body part has a capacity of 0 to 10, allowing users to move points from one area to another when something becomes exhausted. The same ability extends to other people, making it possible to send or request energy from friends.</p>"),
      item(["assets/pp-body.webp", 240, 477, { c: [178.92, 130.48, -39.88, -15.45], r: TOP20, cap: "Selecting a body part" }]),
      item(["assets/pp-transmit.webp", 240, 469, { c: [177.49, 131.91, -38.75, -15.63], r: TOP20, cap: "Point transmission" }]),
      text("<p>The interactive body dashboard lets users select individual body parts, check their energy levels, and reallocate points where needed. Through the contacts screen, users can also search for friends, choose a type of discomfort, and send or request points. Both interactions are designed to make an imaginary superpower feel simple and familiar.</p>"),
      item(["assets/pp-contacts.webp", 250, 467, { c: [168.72, 131.34, -34.23, -15.62], r: TOP20, cap: "Contact list" }]),
      item(["assets/pp-sending.webp", 250, 484, { c: [173.1, 130.04, -35.61, -14.89], r: TOP20, cap: "Sending points" }])
    ])] },
    afterimage: { title: "After the Image", when: "September - December 2025", body: [
      group(40, [
        text("<p>After the Image is a print and digital exploration of grief. How it lives in memory, and in the empty spaces memory leaves behind. The project pairs a printed book with an interactive website, each offering a different way to sit with loss.</p><p>When someone passes, their memories don't disappear, they become harder to hold. After the Image is a two-part project that explores grief through image, absence, and the spaces a reader is forced to face on their own.</p>"),
        item(["assets/ati-mockups.png", 354, 135, { c: [100, 100.62, 0, -0.54], r: TOP20 }]),
        item(["assets/ati-fade-1.mp4", 354, 223, { v: 1, r: TOP20 }]),
        item(["assets/ati-fade-2.mp4", 354, 275, { v: 1, r: 30 }]),
        text("<p>Each chapter is separated by an interactive puzzle that encourages visitors to pause and reflect before moving forward. By asking them to reconstruct fragments of memories, these interactions turn grief into something to actively engage with rather than passively observe.</p>")
      ]),
      item(["assets/ati-puzzle-1.mp4", 366, 257, { v: 1, fit: "contain" }]),
      item(["assets/ati-puzzle-2.mp4", 366, 256, { v: 1, fit: "contain" }]),
      item(["assets/ati-puzzle-3.mp4", 354, 247.9, { v: 1, fit: "contain" }]),
      item(["assets/ati-puzzle-4.mp4", 354, 247.9, { v: 1, fit: "contain" }]),
      text("<p>The final chapter reverses this progression, bringing the images back into focus. Just as a photograph or familiar detail can bring back a fading memory, the return of these images serves as a reminder that forgetting is not always permanent. Both the book and website end on a more hopeful note, emphasizing the memories that remain.</p>"),
      item(["assets/ati-restore-1.mp4", 382, 268, { v: 1, fit: "contain" }]),
      item(["assets/ati-restore-2.mp4", 382, 267.5, { v: 1, fit: "contain" }])
    ] },
    open: { title: "Open 10AM - 8PM", when: "August - September 2026", body: [
      group(40, [
        text("<p>Open 10AM - 8PM is a photographic archive exploring the relationship between people and the objects they choose. Through 256 photographs taken across Manhattan stores, the project documents everyday purchasing decisions, questioning what draws our attention to certain products and what those choices might reveal about us.</p>"),
        item(["assets/open-front.jpg", 354, 393, { c: [171.55, 121.41, -35.78, -10.7], r: 20 }]),
        item(["assets/open-back.jpg", 354, 261, { c: [116.63, 138.64, -11.49, -23.09], r: 20 }]),
        text("<p>Each spread pairs a person with an object they selected. The person appears smaller on the left, while the product occupies the entire right page. This contrast shifts attention toward the object, encouraging readers to observe the relationship between the buyer and their choice without being given an explanation.</p>")
      ]),
      item(["assets/open-walkthrough.mp4", 354, 223, { v: 1 }]),
      text("<p>The photographs are arranged chronologically, following a day of shopping from 10 AM to 8 PM. A detachable cover index records the objects and their timestamps, allowing readers to navigate the collection as both a visual archive and a timeline of everyday consumption.</p>"),
      item(["assets/open-index.jpg", 352, 168, { c: [103.23, 162.32, 0.07, -24.43], r: 20 }]),
      item(["assets/open-timestamp.jpg", 352, 254, { c: [99.9, 103.57, 0.05, -1.79], r: 20 }]),
      item(["assets/open-backspread.jpg", 360, 252.1, { r: 30 }]),
      item(["assets/open-spiral.jpg", 360, 251, { r: 30 }]),
      item(["assets/open-canned.jpg", 360, 274, { c: [111.25, 109.65, -5.73, -3.63], r: 30 }]),
      item(["assets/open-bag.jpg", 360, 275, { c: [108.9, 106.9, -4.44, -3.45], r: 30 }])
    ] }
  };

  /* home cards: [card w, h], media [x, y, w, h], crop, title top, from the Phone-home frame */
  /* home cards — all the same size (354 × 454); the Orderly and PowerPoints phones are the same size (360 tall) */
  const CS = [354, 454];
  const CARDS = [
    { id: "orderly", title: "Orderly", src: "assets/orderly-ai-suggest.mp4", v: 1, size: CS, box: [2.1, -44, 349.8, 507.8], tt: 410 },
    { id: "powerpoints", title: "PowerPoints", src: "assets/pp-card.png", size: CS, box: [-42.7, 0.8, 444.6, 419], tt: 410 },
    { id: "afterimage", title: "After the Image", src: "assets/ati-card.png", size: CS, box: [0, 38, 354, 333.6], fit: "contain", tt: 410 },
    { id: "open", title: "Open 10AM - 8PM", src: "assets/open-cover.jpg", size: CS, box: [0, 0, 354, 454], tt: 410, light: true, noStroke: true }
  ];
  function card(c) {
    const [W, H] = c.size, [x, y, w, h] = c.box;
    const pos = c.c ? `style="width:${c.c[0]}%;height:${c.c[1]}%;left:${c.c[2]}%;top:${c.c[3]}%"` : `class="fill${c.fit === "contain" ? " contain" : ""}"`;
    const tag = c.v ? `<video src="${c.src}" muted loop playsinline preload="metadata" data-auto ${pos}></video>` : `<img src="${c.src}" alt="" loading="lazy" ${pos}>`;
    return `<a class="ph-card${c.light ? " light" : ""}${c.noStroke ? " nostroke" : ""}" href="#${c.id}" style="width:${p(W)};height:${p(H)}">
      <span class="ph-card-m" style="left:${pct(x, W)};top:${pct(y, H)};width:${pct(w, W)};height:${pct(h, H)}">${tag}</span>
      <span class="ph-card-t" style="top:${pct(c.tt, H)}">${c.title}</span></a>`;
  }

  window.PHONE_PAGES = {
    home: (intro, foot) => `<main data-page="home" class="ph">
      <header class="ph-top"><a class="ph-logo" href="#" aria-label="Home">🍎🍎🍎🍎</a><a class="ph-nav" href="#about">About</a></header>
      <div class="ph-col">
        <section class="frame intro" id="intro" aria-label="Introduction">${intro}</section>
        ${CARDS.map(card).join("")}
        ${foot}
      </div></main>`,
    case: (id, back, foot) => {
      const c = CASES[id];
      return `<main data-page="${id}" class="ph ph-cs">${back}
        <div class="ph-col ph-col-cs">
          <div class="ph-stack" style="gap:${p(23)}">
            <header class="ph-head"><h1>${c.title}</h1><p>${c.when}</p></header>
            ${c.body.join("")}
          </div>
          ${foot}
        </div></main>`;
    },
    about: (back, foot, bio, jobs) => `<main data-page="about" class="ph ph-cs">${back}
      <div class="ph-col ph-col-ab">
        <div class="ph-stack" style="gap:${p(23)}">
          ${group(40, [`<div class="mi ph-photo" style="width:${p(360)};height:${p(239.9)};border-radius:${p(40)}"><img src="assets/about.jpg" alt="Aiya Zhumagaliyeva" style="width:115.31%;height:115.33%;left:-7.61%;top:-15.41%"></div>`, text(bio)])}
          <section class="ph-exp"><h2>Experience</h2><div class="ph-jobs">${jobs}</div></section>
        </div>
        ${foot}
      </div></main>`
  };
})();
