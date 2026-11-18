/* Portfolio — pages: home (#), about (#about), case studies (#orderly, #powerpoints, #afterimage, #open). */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const PHONE = matchMedia("(max-width: 760px)");
  // sizes follow the window: desktop = Figma 1728 frame scaled to the window; phone = 393 frame scaled
  let U = 1;
  function setUnits() {
    const w = document.documentElement.clientWidth || innerWidth;
    U = Math.min(w, 1728) / 1728;
    document.documentElement.style.setProperty("--u", U + "px");
    document.documentElement.style.setProperty("--p", Math.min(w / 393, 1.1) + "px");   // phone layout never grows past 110%
  }
  setUnits();
  const px = (n) => `calc(${n} * var(--u))`, mx = (n) => `calc(${n} * var(--m))`;

  const LINKS = {
    linkedin: "https://www.linkedin.com/in/aiya-zhumagaliyeva",
    github: "https://github.com/aiyazhumagaliyeva",
    email: "mailto:reachaiya@gmail.com",
    instagram: "https://www.instagram.com/aiya_zhuma/"
  };

  /* ---------- Home cards (Figma px inside an 819×740 card; default → hover) ---------- */
  const CARDS = [
    { id: "orderly", title: "Orderly", src: "assets/orderly-card.mp4", poster: "assets/orderly-card-poster.webp", video: true,
      rest: [183.7, 30.1, 451.6, 694], hover: [159.8, 19, 499.5, 765.3] },
    { id: "powerpoints", title: "PowerPoints", src: "assets/pp-card.png", mul: true,
      rest: [113.1, 89.5, 610, 574.8], hover: [78.4, 86.5, 670.1, 631.4] },   // phone sits exactly where the Orderly phone sits, at rest and on hover
    { id: "afterimage", title: "After the Image", src: "assets/ati-card.png", mul: true,
      rest: [-1, -19, 762, 718], hover: [-20, 4, 800, 753.8] },
    { id: "open", title: "Open 10AM - 8PM", src: "assets/open-cover.jpg", light: true, noStroke: true,
      rest: [-63, -5.2, 926, 810.5], hover: [-177, -89.6, 1118.9, 979.3] }
  ];
  const pc = (v, of) => (v / of * 100).toFixed(3) + "%";
  const CW = 819, CH = 740;   // card size (Figma)
  const rect = (r) => `left:${pc(r[0], CW)};top:${pc(r[1], CH)};width:${pc(r[2], CW)};height:${pc(r[3], CH)}`;
  // hover = the Figma "Project Title" size, done with a smooth transform (scale + move)
  const hv = (r, h) => `translate(${((h[0] - r[0]) / r[2] * 100).toFixed(3)}%, ${((h[1] - r[1]) / r[3] * 100).toFixed(3)}%) scale(${(h[2] / r[2]).toFixed(4)})`;
  function cardHTML(c) {
    const media = c.video
      ? `<video class="m" src="${c.src}"${c.poster ? ` poster="${c.poster}"` : ""} muted loop playsinline preload="metadata" data-auto style="${rect(c.rest)};--hv:${hv(c.rest, c.hover)}"></video>`
      : `<img class="m${c.mul ? " mul" : ""}" src="${c.src}" alt="" loading="lazy" style="${rect(c.rest)};--hv:${hv(c.rest, c.hover)}">`;
    return `<a class="card${c.light ? " light" : ""}${c.noStroke ? " nostroke" : ""}" href="#${c.id}" data-card="${c.id}" aria-label="${c.title}"${c.titleTop ? ` style="--tt:${pc(c.titleTop, CH)}"` : ""}>
      ${media}<span class="t">${c.title}</span></a>`;
  }

  /* ---------- Shared blocks ---------- */
  function footHTML() {
    return `<div class="foot-row"><footer class="frame foot" data-sky="foot">
      <canvas class="sky"></canvas>
      <div class="apple-slot"></div>
      <h2>Get in Touch!</h2>
      <nav class="foot-links">
        <a href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="${LINKS.github}" target="_blank" rel="noopener">GitHub</a>
        <a href="${LINKS.email}">Email</a>
        <a href="${LINKS.instagram}" target="_blank" rel="noopener">Instagram</a>
      </nav></footer></div>`;
  }
  const BACK = `<a class="back" href="#" aria-label="Back to home"><img class="b-desk" src="assets/back.svg" alt=""><img class="b-ph" src="assets/back-phone.svg" alt=""></a>`;

  /* ---------- Case studies (Figma px) ----------
     item: [src, w, h, opts]  opts: v = video, c = crop [w%, h%, x%, y%] (else cover), r = corner radius */
  const TOP20 = "20px 20px 0 0";
  const PH_A = [127.81, 127.22, -13.9, -13.4], PH_B = [133, 125.28, -16.5, -12.64], PH_C = [132.06, 131.45, -16.03, -15.51];
  const CASES = {
    // new layout (Figma "new" page): 762 text column, wide 1174 media, Helvetica
    orderly: { title: "Orderly", when: "September - December 2025", v2: { head: 762, col: 762, gap: 40, cls: "or" }, end: false, blocks: [
      { t: "<p>Orderly helps busy international students and young professionals stay in touch with loved ones across time zones.</p>" },
      { items: [["assets/or-quotes.webp", 1174, 574, {}]] },
      { t: "<p>Orderly lets you change the theme and set your first language, so the app feels more personal. It was made to test the hypothesis that apps feel unfriendly because of visual complexity and language barriers.</p>" },
      { items: [["assets/or-themes.webp", 1174, 734, {}]] },
      { t: "<p>The app allows you to put in multiple time zones, so you can at a glance see when to call your loved ones.</p>" },
      { items: [["assets/or-zones.mp4", 1174, 530, { v: 1, poster: "assets/or-zones-poster.webp", fit: "fill" }]] },
      { t: "<p>You can connect Orderly to your Google Calendar, and the app will show your weekly workload and daily schedule, so young professionals can stress less about their responsibilities.</p>" },
      { items: [["assets/or-gcal.webp", 1174, 871, {}]] },
      { t: "<p>Orderly also suggests when to meet up. Because it can see your and your friend’s calendars, it knows when you’re both free and where your events are. When you’re both free and nearby, the app suggests a time and place to meet, and writes the message for you.</p>" },
      { items: [["assets/or-suggest.mp4", 1174, 871, { v: 1, poster: "assets/or-suggest-poster.webp", fit: "fill" }]] },
      { t: "<p>Process</p><p>I started with time management: how might we help students organize their time and manage personal and school life in one place?</p>" },
      { items: [["assets/or-motion.mp4", 872, 345.5, { v: 1, poster: "assets/or-motion-poster.webp" }]] },
      { t: "<p>Research<br>I interviewed 4 international students studying in New York, ages 18-21, about daily life, family back home, and the tools they use to stay in touch with family and friends.</p>" },
      { items: [["assets/or-wire.webp", 873, 379, {}]] },
      { t: "<p>A few things kept coming up across all of the interviews:</p><p>Staying close takes a lot of effort. In New York you don’t see the same people every day, so friendships only last if you actively keep them going.<br>Time zones restrict when international students can call home. One student calls her family only in a small window because of a 13–14 hour difference, another said her mom’s most common text is “Are you asleep?”</p><p>The tools they use right now don’t help much. Notion feels too complex to set up, and Apple Calendar shows too little to connect with someone. As one student put it, there should be a “golden middle.”</p>" },
      { mgap: 0, items: [["assets/or-old1.webp", 481, 377.9, {}], ["assets/or-old2.webp", 498.1, 377.9, { ml: -43.1 }]] },
      { t: "<p>The shift<br>The interviews showed the bigger problem wasn’t time management, it was staying in touch with friends nearby and family far away.</p>" },
      { caps: ["Solo event creation", "Group event creation"], gap: 321, items: [
        ["assets/orderly-weekly.mp4", 486, 709, { v: 1, c: PH_C, r: TOP20 }], ["assets/orderly-group-event.mp4", 454, 709, { v: 1, c: [140.39, 131.2, -22.63, -15.6], r: TOP20 }]] },
      { t: "<p>This project was my first end-to-end app design. I learned how much real users shape the product. My first idea seemed more like time management, but talking to the target audience turned it into an app about staying connected.</p>" }
    ]},
    powerpoints: { title: "PowerPoints", when: "April 2025", v2: { head: 872, col: 872, gap: 53, cls: "pp" }, blocks: [
      { t: "<p>Long hours of studying and working can leave students physically exhausted and mentally drained. Between all-nighters, demanding deadlines, and hours spent at a desk, pain and fatigue often build up in different parts of the body. But what if we could move that discomfort somewhere else, or share it with someone else? PowerPoints explores this possibility through a speculative app that allows users to track, redistribute, and transfer physical energy and pain within their bodies and between other people.</p>" },
      { items: [["assets/pp-brand.webp", 985, 648, {}]] },
      { t: "<p>PowerPoints imagines the body as a system of energy points. Each body part has a capacity of 0 to 10, allowing users to move points from one area to another when something becomes exhausted. The same ability extends to other people, making it possible to send or request energy from friends.</p>" },
      { caps: ["Selecting a body part", "Point transmission"], gap: 330, items: [
        ["assets/pp-body.webp", 489, 712, { c: [127.81, 127.22, -13.85, -13.55], r: TOP20 }], ["assets/pp-transmit.webp", 459, 712, { c: [134.83, 126.23, -17.42, -13.12], r: TOP20 }]] },
      { t: "<p>The interactive body dashboard lets users select individual body parts, check their energy levels, and reallocate points where needed. Through the contacts screen, users can also search for friends, choose a type of discomfort, and send or request points. Both interactions are designed to make an imaginary superpower feel simple and familiar.</p>" },
      { caps: ["Contact list", "Sending points"], gap: 416, rowH: 770, items: [
        ["assets/pp-contacts.webp", 461, 716, { c: [133.27, 124.77, -13.41, -12.38], r: TOP20 }], ["assets/pp-sending.webp", 490, 716, { c: [126.33, 125.74, -9.75, -12.66], r: TOP20 }]] }
    ]},
    afterimage: { title: "After the Image", when: "September - December 2025", blocks: [
      { t: "<p>After the Image is a print and digital exploration of grief. How it lives in memory, and in the empty spaces memory leaves behind. The project pairs a printed book with an interactive website, each offering a different way to sit with loss.</p><p>When someone passes, their memories don't disappear, they become harder to hold. After the Image is a two-part project that explores grief through image, absence, and the spaces a reader is forced to face on their own.</p>" },
      { items: [["assets/ati-mockups.png", 995, 381, { c: [100, 100.62, 0, -0.54], r: TOP20 }]] },
      { items: [["assets/ati-fade-1.mp4", 995, 627, { v: 1, r: TOP20 }]] },
      { items: [["assets/ati-fade-2.mp4", 995, 741, { v: 1, r: "30px" }]] },
      { t: "<p>Each chapter is separated by an interactive puzzle that encourages visitors to pause and reflect before moving forward. By asking them to reconstruct fragments of memories, these interactions turn grief into something to actively engage with rather than passively observe.</p>" },
      { mgap: 10, items: [["assets/ati-puzzle-1.mp4", 518, 362.79, { v: 1 }], ["assets/ati-puzzle-2.mp4", 517, 362.09, { v: 1 }]], rowH: 362 },
      { mgap: 10, items: [["assets/ati-puzzle-3.mp4", 518, 362.79, { v: 1 }], ["assets/ati-puzzle-4.mp4", 517, 362.09, { v: 1 }]], rowH: 362 },
      { t: "<p>The final chapter reverses this progression, bringing the images back into focus. Just as a photograph or familiar detail can bring back a fading memory, the return of these images serves as a reminder that forgetting is not always permanent. Both the book and website end on a more hopeful note, emphasizing the memories that remain.</p>" },
      { mgap: 10, items: [["assets/ati-restore-1.mp4", 525.5, 368.04, { v: 1, r: "30px", inner: 495 }], ["assets/ati-restore-2.mp4", 525.5, 368.04, { v: 1 }]], rowH: 362 }
    ]},
    open: { title: "Open 10AM - 8PM", when: "August - September 2026", start: true, blocks: [
      { t: "<p>Open 10AM - 8PM is a photographic archive exploring the relationship between people and the objects they choose. Through 256 photographs taken across Manhattan stores, the project documents everyday purchasing decisions, questioning what draws our attention to certain products and what those choices might reveal about us.</p>" },
      { mgap: 20, rowW: 995, items: [["assets/open-front.jpg", 400, 443, { c: [175.85, 124.70, -36.67, -10.99], r: "30px" }], ["assets/open-back.jpg", 602, 443, { c: [119.54, 142.40, -11.78, -23.72], r: "30px" }]] },
      { t: "<p>Each spread pairs a person with an object they selected. The person appears smaller on the left, while the product occupies the entire right page. This contrast shifts attention toward the object, encouraging readers to observe the relationship between the buyer and their choice without being given an explanation.</p>" },
      { items: [["assets/open-walkthrough.mp4", 995, 627, { v: 1 }]] },
      { t: "<p>The photographs are arranged chronologically, following a day of shopping from 10 AM to 8 PM. A detachable cover index records the objects and their timestamps, allowing readers to navigate the collection as both a visual archive and a timeline of everyday consumption.</p>" },
      { items: [["assets/open-index.jpg", 978, 467, { c: [103.23, 162.32, 0.07, -24.43], r: "30px" }]] },
      { items: [["assets/open-timestamp.jpg", 979, 708, { c: [99.9, 103.57, 0.05, -1.79], r: "30px" }]] },
      { grid: 30, rows: [   // 2 × 2, the same 30 px gap across and down
        [["assets/open-backspread.jpg", 474.5, 332.32, { r: "30px" }], ["assets/open-spiral.jpg", 474.5, 332.32, { r: "30px" }]],
        [["assets/open-canned.jpg", 474.5, 332.32, { c: [102.17, 109.65, -1.18, -3.63], r: "30px" }], ["assets/open-bag.jpg", 474.5, 332.32, { r: "30px" }]]] }
    ]}
  };

  function itemHTML([src, w, h, o]) {
    const v = o.v, crop = o.c;
    const pos = crop ? `style="width:${crop[0]}%;height:${crop[1]}%;left:${crop[2]}%;top:${crop[3]}%"` : `class="fill"${o.fit ? ` style="object-fit:${o.fit}"` : ""}`;
    const tag = v ? `<video src="${src}"${o.poster ? ` poster="${o.poster}"` : ""} muted loop playsinline preload="metadata" data-auto ${pos}></video>` : `<img src="${src}" alt="" loading="lazy" ${pos}>`;
    if (o.inner) {   // a smaller rounded box centred in its slot
      return `<div style="flex:none;width:${mx(w)};height:${mx(h)};display:flex;justify-content:center"><div class="mi" style="width:${mx(o.inner)};height:100%;border-radius:${o.r ? `calc(${parseFloat(o.r)} * var(--m))` : 0}">${tag}</div></div>`;
    }
    const r = o.r ? o.r.split(" ").map((x) => `calc(${parseFloat(x)} * var(--m))`).join(" ") : "0";
    return `<div class="mi" style="width:${mx(w)};height:${mx(h)};border-radius:${r}${o.ml ? `;margin-left:${mx(o.ml)}` : ""}">${tag}</div>`;
  }
  function blockHTML(b) {
    if (b.t) return `<div class="txt"${b.pad ? ` style="padding-bottom:${px(b.pad)}"` : ""}>${b.t}</div>`;
    if (b.rows) return `<div class="show" style="gap:${mx(b.grid)}">${b.rows.map((r) => `<div class="mrow" style="gap:${mx(b.grid)}">${r.map(itemHTML).join("")}</div>`).join("")}</div>`;
    const caps = b.caps ? `<div class="caps" style="gap:${mx(b.gap)}"><span>${b.caps[0]}</span><span>${b.caps[1]}</span></div>` : "";
    const row = `<div class="mrow" style="gap:${mx(b.mgap ?? 36)};${b.rowW ? `width:${mx(b.rowW)};` : ""}${b.rowH ? `height:${mx(b.rowH)};` : ""}">${b.items.map(itemHTML).join("")}</div>`;
    return `<div class="show">${caps}${row}</div>`;
  }
  function caseHTML(id) {
    const c = CASES[id];
    const v = c.v2 ? ` v2 ${c.v2.cls}" style="--hw:${c.v2.head};--cw:${c.v2.col};--hg:${c.v2.gap}` : "";
    return `<main class="cs${v}" data-page="${id}">${BACK}
      <header class="cs-head"><h1>${c.title}</h1><p>${c.when}</p></header>
      <div class="col${c.start ? " start" : ""}">${c.blocks.map(blockHTML).join("")}${c.end === false ? "" : `<div class="cs-end"></div>`}</div>
      ${footHTML()}</main>`;
  }

  const BIO = `<p>My name is Aiya.<br>I'm a product designer and a senior at Parsons in NYC. I was born and raised in <a href="https://www.google.com/search?q=almaty%2C+kazakhstan" target="_blank" rel="noopener">Almaty, Kazakhstan,</a> where I grew up painting and exploring the world through art, from still lifes and portraits to sculptures and <a href="https://aiyapaints.cargo.site/" target="_blank" rel="noopener">human-size oil paintings</a>.</p>
        <p>When I came to <a href="https://www.newschool.edu/parsons/" target="_blank" rel="noopener">Parsons</a>, design changed the way I think about creativity and became my way to contribute to the world around me. I've painted for loved ones, designed brand assets for local companies, and worked on UX projects. Now I start with research, build what I design, and focus on how people interact with each other and AI.</p>`;
  const JOBS = [
    ["Product Designer at Maxworld Inc.", "February - August 2026", `In Maxworld Inc., I was the sole designer on a web project. I led wireframing, visual direction, and user research for <a href="https://lovesigns.com" target="_blank" rel="noopener">Lovesigns.com,</a> from concept to developer handoff, and designed the full visual system and all site imagery. While working I conducted extended research using AI agents to inform product decisions.`],
    ["Product Designer at Oki (Aleem)", "August 2025 - May 2026", `I designed <a href="https://oki.team" target="_blank" rel="noopener">“Aleem,”</a> the mascot of an AI English-learning app that hit #1 in the App Store Education category across five Central Asian countries, surpassing Duolingo in ranking within three days; 300,000+ downloads by December 2025.`],
    ["Brand Designer at Energo University", "December 2024", "I designed a merchandise collection for a 5,000+ student campus, drawing on Kazakh ornamental patterns, nomadic architecture, and traditional musical instruments. The collection now regularly appears in student-generated social media content and worn by students on campus."]
  ].map(([t, d, x]) => `<div class="job"><div class="jh"><h3>${t}</h3><p class="when">${d}</p></div><p>${x}</p></div>`).join("");
  const ABOUT = `<main class="ab" data-page="about">
    <header class="top"><a class="logo" href="#" aria-label="Home"><span>🍎</span><span>🍎</span><span>🍎</span><span>🍎</span></a><nav class="nav"><a href="#about" aria-current="page">About</a><a href="#playground">Playground</a></nav></header>
    <div class="col">
      <div class="ab-photo"><img src="assets/about.jpg" alt="Aiya Zhumagaliyeva"></div>
      <div class="txt">${BIO}</div>
      <section class="exp"><h2>Experience</h2><div class="exp-list">${JOBS}</div></section>
    </div>
    ${footHTML()}</main>`;

  /* ---------- Playground (Figma "new" page → playground): 3 columns, picture + caption ---------- */
  const PLAY = [   // [src, Figma height at 533.3 wide, column, caption, link, poster]
    ["assets/ati-fade-1.mp4", 335.9, 0, "After The Image, Parsons, Fall 2025", "#afterimage"],
    ["assets/ati-fade-2.mp4", 396.9, 1, "After The Image, Parsons, Fall 2025", "#afterimage"],
    ["assets/open-book.mp4", 404, 2, "Open 10AM-8PM, Parsons, Fall 2026", null, "assets/open-book-poster.webp"],   // no link for now
    ["assets/arch-allwater.jpg", 309, 0, "All Water LLC, Parsons, Fall 2026", "https://aiyazhumagaliyeva.github.io/all-water-llc/"],
    ["assets/arch-apples.mp4", 522, 1, "Apples are from Almaty, Side Project, 2026", "https://aiyazhumagaliyeva.github.io/apple-is-from-almaty/", "assets/arch-apples.jpg"],
    ["assets/arch-circles.webp", 320, 2, "Circles, Parsons, Fall 2026"],
    ["assets/arch-oki.webp", 522, 0, "Mascot design, Oki (Aleem), 2026"],
    ["assets/arch-sansu.webp", 533, 1, "Sansu Brand Design, Side Project, February 2026"],
    ["assets/arch-change.mp4", 305, 2, "Change, Parsons, Spring 2024", "https://aiyazhumagaliyeva.github.io/change/index.html", "assets/arch-change.jpg"],
    ["assets/arch-mantra.webp", 604, 0, "Mantra Merch, Parsons, Fall 2024"],
    ["assets/arch-poster.webp", 530, 1, "Poster Design, Parsons, Fall 2024"],
    ["assets/arch-fish.webp", 427, 2, "Fish, Parsons, Fall 2024"],
    ["assets/arch-merch.webp", 497, 0, "Brand Merchandise, Side Project, Winter 2026"],
    ["assets/arch-tag.webp", 322, 1, "Tag Design, Side Project, Fall 2023"],
    ["assets/arch-qazaq.webp", 387, 2, "Qazaq Blend Brand Design, Side Project, Winter 2024"]
  ];
  function playItem([src, h, , cap, href, poster]) {
    const video = /\.mp4$/.test(src);
    const m = video ? `<video class="fill" src="${src}"${poster ? ` poster="${poster}"` : ""} muted loop playsinline preload="metadata" data-auto></video>`
                    : `<img class="fill" src="${src}" alt="${cap}" loading="lazy">`;
    const box = href ? `<div class="pg-m" style="aspect-ratio:533.3 / ${h}">${m}</div>` : `<div class="mi pg-m" style="aspect-ratio:533.3 / ${h}">${m}</div>`;
    const inner = `${box}<span class="pg-cap">${cap}</span>`;
    const ext = href && href[0] !== "#" ? ' target="_blank" rel="noopener"' : "";   // case studies open here, other sites in a new tab
    return href ? `<a class="pg-item" href="${href}"${ext}>${inner}</a>` : `<div class="pg-item">${inner}</div>`;
  }
  const PLAYGROUND = `<main data-page="playground" class="pg">
    <header class="top"><a class="logo" href="#" aria-label="Home"><span>🍎</span><span>🍎</span><span>🍎</span><span>🍎</span></a><nav class="nav"><a href="#about">About</a><a href="#playground" aria-current="page">Playground</a></nav></header>
    <div class="pg-cols">${[0, 1, 2].map((c) => `<div class="pg-col">${PLAY.filter((x) => x[2] === c).map(playItem).join("")}</div>`).join("")}</div>
    ${footHTML()}</main>`;
  window.PLAY_LIST = () => PLAY.map(playItem).join("");

  const HOME = `<main data-page="home" class="home">${window.SKY_HTML}
    <header class="top"><a class="logo" href="#" aria-label="Home"><span>🍎</span><span>🍎</span><span>🍎</span><span>🍎</span></a><nav class="nav"><a href="#about">About</a><a href="#playground">Playground</a></nav></header>
    <section class="hero" id="intro" data-units="hero" aria-label="Introduction">${window.INTRO_HTML}</section>
    <div class="cards">${cardHTML(CARDS[0])}${cardHTML(CARDS[1])}</div>
    ${footHTML()}<div class="trail"></div></main>`;

  /* ---------- Videos start when you scroll to them (40% on screen), from the beginning ---------- */
  const vidIO = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.intersectionRatio >= 0.4) { const p = v.play(); if (p) p.catch(() => {}); }
    else { v.pause(); if (!e.isIntersecting) v.currentTime = 0; }   // fully off screen → rewind, so it starts fresh next time
  }), { threshold: [0, 0.4] });
  const watchVideos = (root) => root.querySelectorAll("video[data-auto]").forEach((v) => { v.muted = true; vidIO.observe(v); });

  /* ---------- Frame units + skies + apples ---------- */
  function setFrameUnits(root) {
    root.querySelectorAll(".frame, [data-units]").forEach((f) => {
      const w = f.getBoundingClientRect().width || 1590 * U;   // (phone: 354 phone px wide)
      f.style.setProperty("--fu", w / (f.dataset.units === "hero" ? HERO_UNITS(PHONE.matches) : FRAME_UNITS(PHONE.matches)) + "px");
    });
    const colW = innerWidth - 32;
    document.documentElement.style.setProperty("--m", PHONE.matches ? colW / 1000 + "px" : "var(--u)");
  }
  function mountFooter(root) {
    root.querySelectorAll("[data-sky=foot]").forEach((f) => {
      if (f.dataset.on) return; f.dataset.on = 1;
      new SKY.Sky(f.querySelector("canvas"), { weights: [1, 0, 0] });   // the footer keeps the Figma look
      new Apple(f.querySelector(".apple-slot"), { follow: false, blink: true, every: [3000, 2000], closed: 250 });   // footer: quick blink every 3–5 s
    });
  }

  /* ---------- Router ---------- */
  const app = $("#app");
  const pages = {};
  function page(name) {
    if (!pages[name]) {
      const P = PHONE.matches && window.PHONE_PAGES;
      const html = P ? (name === "home" ? P.home(window.INTRO_HTML, footHTML()) : name === "about" ? P.about(BACK, footHTML(), BIO, JOBS) : name === "playground" ? P.playground(footHTML()) : P.case(name, BACK, footHTML()))
                     : (name === "home" ? HOME : name === "about" ? ABOUT : name === "playground" ? PLAYGROUND : caseHTML(name));
      app.insertAdjacentHTML("beforeend", html);
      const el = app.lastElementChild; pages[name] = el;
      setFrameUnits(el); watchVideos(el); mountFooter(el);
      if (name === "home") window.mountIntro($("#intro"), el.querySelector(".hero-sky"), { phone: PHONE.matches });
    }
    return pages[name];
  }
  function route() {
    const h = location.hash.slice(1);
    const name = h === "about" || h === "playground" || CASES[h] ? h : "home";
    Object.entries(pages).forEach(([k, el]) => (el.hidden = k !== name));
    const el = page(name); el.hidden = false;
    setFrameUnits(el);
    document.title = name === "home" ? "Aiya Zhumagaliyeva" : (name === "about" ? "About" : name === "playground" ? "Playground" : CASES[name].title) + " — Aiya Zhumagaliyeva";
    if (route.prev && route.prev !== name) scrollTo(0, name === "home" ? route.homeY || 0 : 0);
    route.prev = name;
  }
  addEventListener("scroll", () => { if (route.prev === "home") route.homeY = scrollY; }, { passive: true });
  addEventListener("hashchange", route);
  addEventListener("resize", () => { setUnits(); Object.values(pages).forEach((el) => !el.hidden && setFrameUnits(el)); });
  PHONE.addEventListener("change", () => location.reload());
  app.addEventListener("click", (e) => {   // the back arrow / logo go home without leaving a "#" in the address
    const a = e.target.closest('a[href="#"]'); if (!a) return;
    if (a.matches(".logo, .ph-logo")) { e.preventDefault(); location.assign(location.pathname + location.search); return; }   // the apples reload the whole page
    e.preventDefault(); history.pushState(null, "", location.pathname + location.search); route();
  });
  route();

  /* ---------- Picture viewer (case study pictures + videos) ---------- */
  const zoom = $("#zoom"), zimgEl = $("#zoom-img"), zvid = $("#zoom-vid");
  let zimg = zimgEl;
  const natW = () => zimg.naturalWidth || zimg.videoWidth || 1, natH = () => zimg.naturalHeight || zimg.videoHeight || 1;
  let Z = { s: 1, x: 0, y: 0, fit: 1 }, ptrs = new Map(), pinch = null, dragFrom = null, moved = false;
  function zApply() { zimg.style.transform = `translate(${Z.x}px, ${Z.y}px) scale(${Z.s})`; zoom.classList.toggle("zoomed", Z.s > Z.fit * 1.01); }
  function zFit() { const W = innerWidth, H = innerHeight, pad = PHONE.matches ? 20 : 70, iw = natW(), ih = natH();
    Z.fit = Math.min((W - pad * 2) / iw, (H - pad * 2) / ih, 1.5); Z.s = Z.fit; Z.x = (W - iw * Z.s) / 2; Z.y = (H - ih * Z.s) / 2; zApply(); }
  function zClamp() { const W = innerWidth, H = innerHeight, w = natW() * Z.s, h = natH() * Z.s;
    Z.x = w <= W ? (W - w) / 2 : Math.min(0, Math.max(W - w, Z.x)); Z.y = h <= H ? (H - h) / 2 : Math.min(0, Math.max(H - h, Z.y)); }
  function zZoomAt(cx, cy, f) { const s = Math.min(Z.fit * 8, Math.max(Z.fit, Z.s * f)), k = s / Z.s; Z.x = cx - (cx - Z.x) * k; Z.y = cy - (cy - Z.y) * k; Z.s = s; zClamp(); zApply(); }
  function openZoom(src, isVideo) {
    zimg = isVideo ? zvid : zimgEl; zvid.hidden = !isVideo; zimgEl.hidden = !!isVideo;
    if (isVideo) { zvid.onloadedmetadata = zFit; zvid.src = src; zvid.muted = true; const p = zvid.play(); if (p) p.catch(() => {}); }
    else { zimgEl.onload = zFit; zimgEl.src = src; }
    zoom.hidden = false; document.body.classList.add("locked");
    if (isVideo ? zvid.readyState >= 1 : zimgEl.complete) zFit();
    requestAnimationFrame(() => zoom.classList.add("open"));
  }
  function closeZoom() { zoom.classList.remove("open"); document.body.classList.remove("locked");
    setTimeout(() => { zoom.hidden = true; zimgEl.removeAttribute("src"); zvid.pause(); zvid.removeAttribute("src"); zvid.load(); }, 250); }
  zoom.addEventListener("wheel", (e) => { e.preventDefault(); const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY; zZoomAt(e.clientX, e.clientY, Math.exp(-d * (e.ctrlKey ? 0.01 : 0.0022))); }, { passive: false });
  zoom.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".zoom-close")) return;
    zoom.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = false;
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) }; }
    else dragFrom = { x: e.clientX - Z.x, y: e.clientY - Z.y, sx: e.clientX, sy: e.clientY };
  });
  zoom.addEventListener("pointermove", (e) => {
    if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && ptrs.size === 2) { const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y); zZoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, d / pinch.d); pinch.d = d; moved = true; return; }
    if (dragFrom) { if (Math.hypot(e.clientX - dragFrom.sx, e.clientY - dragFrom.sy) > 4) moved = true;
      if (Z.s > Z.fit * 1.01) { Z.x = e.clientX - dragFrom.x; Z.y = e.clientY - dragFrom.y; zClamp(); zApply(); zoom.classList.add("dragging"); } }
  });
  const zUp = (e) => {
    ptrs.delete(e.pointerId); zoom.classList.remove("dragging"); if (ptrs.size < 2) pinch = null;
    if (!ptrs.size) {
      if (!moved && e.type === "pointerup") {
        const r = zimg.getBoundingClientRect(), inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) closeZoom(); else if (Z.s > Z.fit * 1.01) zFit(); else zZoomAt(e.clientX, e.clientY, 2.5);
      }
      dragFrom = null;
    } else { const [p] = [...ptrs.values()]; dragFrom = { x: p.x - Z.x, y: p.y - Z.y, sx: p.x, sy: p.y }; }
  };
  zoom.addEventListener("pointerup", zUp); zoom.addEventListener("pointercancel", zUp);
  $("#zoom-close").addEventListener("click", closeZoom);
  addEventListener("resize", () => { if (!zoom.hidden) zFit(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !zoom.hidden) closeZoom(); });
  app.addEventListener("click", (e) => {
    const el = e.target.closest(".mi img, .mi video"); if (!el) return;
    openZoom(el.currentSrc || el.src, el.tagName === "VIDEO");
  });
})();
