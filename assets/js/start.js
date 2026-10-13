/* AI explained: the start page. Draws its pictures with the pen of sketch.js and makes it answer back:
     - the demo: pick a goal and watch an agent run the loop (think, act, observe, and ask or answer), step by step;
     - the numbers that count up, the scribble under the title, the notes of the guides;
     - "Pull a term": a random term of the glossary (the hover cards' file is loaded only when that part comes near the screen).
   The cards, the notes and the links are plain HTML, so the page works without this script. Plain ES5, no frameworks. */
(function () {
  "use strict";

  var sk = window.V3 && window.V3.sk;
  if (!sk) return;
  var h = sk.h, reduced = sk.reduced();

  /* ---------- The cards of the two ways in ---------------------------------------------------- */
  // The kitchen story's card: the chef thinking, with two options and a tick.
  var head = sk.head;
  var story = sk.$("#pic-story svg");
  if (story) sk.sketchInto(story, [
    { t: "circle", a: [78, 106, 58], fill: "paper" },
    { t: "circle", a: [62, 62, 32], fill: "paper" }, { t: "circle", a: [94, 62, 32], fill: "paper" }, { t: "circle", a: [78, 50, 38], fill: "paper" },
    { t: "rect", a: [58, 64, 40, 16], fill: "paper" },
    { t: "circle", a: [70, 104, 5], fill: "ink", r: 0.3 }, { t: "circle", a: [86, 104, 5], fill: "ink", r: 0.3 },
    { t: "path", a: "M70 118Q78 124 86 118", sw: 1.6 },
    { t: "circle", a: [114, 86, 7], fill: "paper" }, { t: "circle", a: [126, 73, 11], fill: "paper" },
    { t: "ellipse", a: [180, 50, 100, 66], fill: "zm" },
    { t: "line", a: [150, 42, 188, 42], sw: 2 }, { t: "lin", a: head(176, 42, 190, 42, 7), sw: 2 },
    { t: "line", a: [150, 58, 176, 58], sw: 2 },
    { t: "path", a: "M184 58l6 6 10-13", sw: 2.4 }
  ], 31, { base: { r: 0.9 } });

  // The deep dive's card has no kitchen picture: the four parts of an agent as plain icons (model, context, tools, loop).
  var tech = sk.$("#pic-tech");
  if (tech) {
    [["model", "chef"], ["harness", "counter"], ["tools", "tools"], ["harness", "loop"]].forEach(function (p, i) {
      if (i) tech.appendChild(h("span", { class: "pic-op", "aria-hidden": "true" }, "+"));
      tech.appendChild(sk.doodleSvg(p[0], "pic-icon", 21 + i, undefined, p[1]));
    });
  }

  /* ---------- The scribble under the title ---------------------------------------------------- */
  var word = sk.$(".start-word"), scribble = sk.$(".start-scribble");
  if (scribble) {
    sk.sketchInto(scribble, [{ t: "path", a: "M3 9C50 3 96 13 150 7S258 10 297 4", sw: 3.2, line: "clay", r: 1.1, single: true }], 7, { anim: !reduced, delay: 0.5, stagger: 0 });
    if (word && !reduced) word.classList.add("is-drawing");
  }

  /* ---------- The sections below the hero rise as they arrive ------------------------------------------ */
  if ("IntersectionObserver" in window && !reduced) {
    sk.$$(".ways, .pull, .shelf").forEach(function (sec) {
      if (sec.getBoundingClientRect().top < window.innerHeight) return;
      sec.classList.add("rv");
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { io.disconnect(); sec.classList.add("rv-in"); }
      }, { rootMargin: "0px 0px -12% 0px" });
      io.observe(sec);
    });
  }

  /* ---------- The numbers ----------------------------------------------------------------------- */
  function countUp(el) {
    var to = parseInt(el.getAttribute("data-count"), 10), plus = el.hasAttribute("data-plus") ? "+" : "";
    if (!to || reduced) return;
    var t0 = null, dur = 900;
    function frame(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e) + (k === 1 ? plus : "");
      if (k < 1) requestAnimationFrame(frame);
    }
    el.textContent = "0";
    requestAnimationFrame(frame);
  }
  sk.$$("[data-count]").forEach(function (el) {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { io.disconnect(); countUp(el); }
    }, { threshold: 0.6 });
    io.observe(el);
  });

  /* ---------- The demo: an agent at work ---------------------------------------------------------- */
  // The stations of the loop. Think, act and observe repeat; ask (a person approves a risky step) and answer end it.
  var STATIONS = [
    { kind: "think", name: "Think", icon: "net", zone: "model", says: "The model reads everything so far and decides what to do next." },
    { kind: "act", name: "Act", icon: "wrench", zone: "tools", says: "The model asks for a tool; the program around it runs the tool." },
    { kind: "observe", name: "Observe", icon: "eye", zone: "know", says: "The tool's result goes back into the context, and the loop starts again." },
    { kind: "ask", name: "Ask you", icon: "hand", zone: "control", says: "A risky step waits for a person to approve it before anything happens." },
    { kind: "answer", name: "Answer", icon: "flag", zone: "ops", says: "The goal is met, so the loop stops. Real agents also stop at a step limit or a budget." }
  ];
  var RUNS = [
    { goal: "Fix the failing test", steps: [
      ["think", "The test suite fails. I should read the error first."],
      ["act", "run_tests()"],
      ["observe", "1 failed: total() returned 5, expected 4."],
      ["think", "The loop in total() counts the last item twice."],
      ["act", "edit_file(\"cart.py\", line 12)"],
      ["observe", "File saved."],
      ["act", "run_tests()"],
      ["observe", "12 passed."],
      ["answer", "Fixed: total() counted the last item twice. All 12 tests pass."]
    ] },
    { goal: "Book a table for four on Friday", steps: [
      ["think", "I need a restaurant with a free table for four on Friday evening."],
      ["act", "search_restaurants(party=4, day=\"Fri\")"],
      ["observe", "3 places found. Trattoria Nove has 19:30 free."],
      ["ask", "Book Trattoria Nove, Friday 19:30, for four? Waiting for your approval."],
      ["observe", "You approved."],
      ["act", "book_table(\"Trattoria Nove\", \"Fri 19:30\", 4)"],
      ["observe", "Booking confirmed."],
      ["answer", "Booked: Trattoria Nove, Friday at 19:30, four people."]
    ] },
    { goal: "Summarise this week's support emails", steps: [
      ["think", "I need the messages from the support inbox for the last seven days."],
      ["act", "search_mail(inbox=\"support\", since=\"7d\")"],
      ["observe", "42 emails found."],
      ["think", "That is too much to read in one go. I will read them in batches and count the topics."],
      ["act", "read_mail(batch=1..3)"],
      ["observe", "Top topics: login problems (17), invoices (11), export bug (8)."],
      ["answer", "Login problems lead with 17 of 42 emails, followed by invoices (11) and the export bug (8)."]
    ] }
  ];

  var elGoals = sk.$("#demo-goals"), elStations = sk.$("#demo-stations"), elLog = sk.$("#demo-log"), elExplain = sk.$("#demo-explain"),
      elReplay = sk.$("#demo-replay"), elSkip = sk.$("#demo-skip"), elStatus = sk.$("#demo-status");
  var stationEls = {}, loopEl = null, goalBtns = [], current = 0, token = 0, timer = 0, queue = [], started = false;

  function arrowSvg(seed) {
    var svg = sk.s("svg", { class: "st-arrow", viewBox: "0 0 28 14", "aria-hidden": "true", focusable: "false" });
    sk.sketchInto(svg, [{ t: "line", a: [2, 7, 24, 7], sw: 1.6, single: true }, { t: "lin", a: head(14, 7, 25, 7, 6), sw: 1.6, single: true }], seed);
    return svg;
  }
  function buildStations() {
    STATIONS.forEach(function (st, i) {
      var li = h("li", { class: "st", "data-zone": st.zone, "data-kind": st.kind },
        h("span", { class: "st-ico" }, sk.glyph ? sk.glyph(st.icon, "st-glyph", 4 + i) : null),
        h("span", { class: "st-name" }, st.name));
      if (i < 2) li.appendChild(arrowSvg(41 + i));
      else if (i === 2) li.appendChild(h("span", { class: "st-split", "aria-hidden": "true" }));
      elStations.appendChild(li);
      stationEls[st.kind] = li;
    });
    // The way back from observe to think: the loop itself.
    var back = sk.s("svg", { class: "st-back", viewBox: "0 0 300 26", preserveAspectRatio: "none", "aria-hidden": "true", focusable: "false" });
    sk.sketchInto(back, [
      { t: "path", a: "M250 3C252 20 240 23 150 23S50 21 52 6", sw: 1.6, single: true, r: 0.8 },
      { t: "lin", a: head(52, 14, 52, 3, 7), sw: 1.6, single: true }
    ], 77);
    loopEl = h("li", { class: "st-loop", "aria-hidden": "true" }, back, h("span", { class: "st-loop-label" }, "repeat"));
    elStations.appendChild(loopEl);
  }

  function setActive(kind) {
    Object.keys(stationEls).forEach(function (k) { stationEls[k].classList.toggle("on", k === kind); });
    if (loopEl) loopEl.classList.toggle("on", kind === "observe");
    var st = STATIONS.filter(function (x) { return x.kind === kind; })[0];
    if (st) elExplain.textContent = st.says;
  }

  function addStep(step, instant) {
    var li = h("li", { class: "ls ls-" + step[0] + (instant ? "" : " ls-new"), "data-zone": stationEls[step[0]].getAttribute("data-zone") },
      h("span", { class: "ls-kind" }, STATIONS.filter(function (x) { return x.kind === step[0]; })[0].name),
      step[0] === "act" ? h("code", { class: "ls-text" }, step[1]) : h("span", { class: "ls-text" }, step[1]));
    elLog.appendChild(li);
    elLog.scrollTo ? elLog.scrollTo({ top: elLog.scrollHeight, behavior: reduced || instant ? "auto" : "smooth" }) : (elLog.scrollTop = elLog.scrollHeight);
    setActive(step[0]);
  }

  function finish(run) {
    elReplay.disabled = false; elSkip.disabled = true;
    elStatus.textContent = "Done. The agent answered: " + run.steps[run.steps.length - 1][1];
  }

  function play(i, instant) {
    clearTimeout(timer);
    var my = ++token, run = RUNS[i];
    current = i; started = true;
    goalBtns.forEach(function (b, k) { b.setAttribute("aria-pressed", k === i ? "true" : "false"); });
    sk.clear(elLog);
    elStatus.textContent = "";
    elReplay.disabled = true; elSkip.disabled = false;
    queue = run.steps.slice();
    if (instant || reduced) { queue.forEach(function (s) { addStep(s, true); }); queue = []; finish(run); return; }
    setActive("");
    elExplain.textContent = "Goal: " + run.goal + ".";
    function next() {
      if (my !== token) return;
      if (!queue.length) { finish(run); return; }
      var s = queue.shift();
      addStep(s, false);
      timer = setTimeout(next, s[0] === "think" || s[0] === "ask" ? 1500 : s[0] === "answer" ? 0 : 1050);
    }
    timer = setTimeout(next, 650);
  }

  if (elGoals && elStations && elLog) {
    buildStations();
    RUNS.forEach(function (r, i) {
      var b = h("button", { class: "chip demo-goal", type: "button", "aria-pressed": "false", "data-zone": ["harness", "tools", "know"][i], onclick: function () { play(i); } }, r.goal);
      goalBtns.push(b);
      elGoals.appendChild(b);
    });
    elReplay.addEventListener("click", function () { play(current); });
    elSkip.addEventListener("click", function () {
      token++; clearTimeout(timer);
      var run = RUNS[current];
      queue.forEach(function (s) { addStep(s, true); }); queue = [];
      finish(run);
    });
    // The first run starts as soon as the demo is on the screen.
    if ("IntersectionObserver" in window && !reduced) {
      var seen = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { seen.disconnect(); if (!started) play(0); }
      }, { threshold: 0.35 });
      seen.observe(sk.$("#demo"));
    } else play(0, true);
  }

  /* ---------- The guides' notes ---------------------------------------------------------------------- */
  var TILT = [-0.7, 0.5, -0.3, 0.7, -0.5, 0.4, -0.6, 0.3];
  sk.$$(".snote").forEach(function (a, i) {
    a.style.setProperty("--tilt", TILT[i % TILT.length] + "deg");
    var icon = a.getAttribute("data-icon");
    if (icon && sk.glyph) a.insertBefore(sk.glyph(icon, "snote-icon", 9 + i), a.querySelector("b"));
    sk.sketchBox(a, { seed: 61 + i * 13, boil: false, sw: 1.4, radius: 8, fill: "zt" });
  });

  /* ---------- Pull a term ------------------------------------------------------------------------------- */
  var pull = sk.$("#pull"), pullBtn = sk.$("#pull-next"), pullShown = "";
  function pullOne() {
    var G = window.AE_GLANCE;
    if (!G) return;
    var ids = Object.keys(G).filter(function (k) { return k !== pullShown; }), id = ids[Math.floor(Math.random() * ids.length)], t = G[id];
    pullShown = id;
    var card = sk.$("#pull-card");
    card.classList.remove("pull-swap");
    sk.$("#pull-group").textContent = t.g || "";
    sk.$("#pull-name").textContent = t.n;
    sk.$("#pull-name").href = sk.url.entry(id);
    sk.$("#pull-text").textContent = t.t;
    sk.$("#pull-open").href = sk.url.entry(id);
    card.setAttribute("data-zone", t.z || "know");
    void card.offsetWidth;
    if (!reduced) card.classList.add("pull-swap");
  }
  if (pull && pullBtn) {
    var loaded = false;
    var load = function (then) {
      if (window.AE_GLANCE) { loaded = true; then && then(); return; }
      if (loaded) return;
      loaded = true;
      var sc = document.createElement("script");
      sc.src = sk.url.base + "assets/js/data/glance.js";
      sc.onload = function () { pullBtn.hidden = false; if (then) then(); };
      document.body.appendChild(sc);
    };
    pullBtn.addEventListener("click", pullOne);
    if ("IntersectionObserver" in window) {
      var near = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { near.disconnect(); load(pullOne); }
      }, { rootMargin: "400px 0px" });
      near.observe(pull);
    }
  }
})();
