/* AI explained: the start page. Draws its pictures with the pen of sketch.js and makes it answer back:
     - the demo: pick a goal and watch an agent run the loop (think, act, observe, and ask or answer), step by step;
     - the scribble under the title and the notes of the guides;
     - "Pull a term": a random term of the glossary (the hover cards' file is loaded only when that part comes near the screen).
   The cards, the notes and the links are plain HTML, so the page works without this script. Plain ES5, no frameworks. */
(function () {
  "use strict";

  var sk = window.V3 && window.V3.sk;
  if (!sk) return;
  var h = sk.h, reduced = sk.reduced();

  /* ---------- The pictures of the two ways in ----------------------------------------------------- */
  // The kitchen story's tile: the chef thinking, with two options and a tick.
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

  // The deep dive's tile has no kitchen picture: the four parts of an agent as plain icons (model, context, tools, loop).
  var tech = sk.$("#pic-tech");
  if (tech) {
    [["model", "chef"], ["harness", "counter"], ["tools", "tools"], ["harness", "loop"]].forEach(function (p, i) {
      if (i) tech.appendChild(h("span", { class: "pic-op", "aria-hidden": "true" }, "+"));
      tech.appendChild(sk.doodleSvg(p[0], "pic-icon", 21 + i, undefined, p[1]));
    });
  }

  // Both tiles are drawn like the notes of the guides.
  sk.$$(".way").forEach(function (a, i) { sk.sketchBox(a, { seed: 23 + i * 17, boil: false, sw: 1.4, radius: 8, fill: "zt" }); });

  /* ---------- The scribble under the title ---------------------------------------------------- */
  var word = sk.$(".start-word"), scribble = sk.$(".start-scribble");
  if (scribble) {
    sk.sketchInto(scribble, [{ t: "curve", a: [[3, 9], [50, 4], [96, 11], [150, 7], [204, 3.5], [258, 9], [297, 4]], sw: 3.2, line: "clay", r: 1.1, single: true }], 7, { anim: !reduced, delay: 0.5, stagger: 0 });
    if (word && !reduced) word.classList.add("is-drawing");
  }

  /* ---------- The sections below the hero rise as they arrive ------------------------------------------ */
  if ("IntersectionObserver" in window && !reduced) {
    sk.$$(".pull, .shelf").forEach(function (sec) {
      if (sec.getBoundingClientRect().top < window.innerHeight) return;
      sec.classList.add("rv");
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { io.disconnect(); sec.classList.add("rv-in"); }
      }, { rootMargin: "0px 0px -12% 0px" });
      io.observe(sec);
    });
  }

  /* ---------- The demo: an agent at work ---------------------------------------------------------- */
  // The kinds of step: the model thinks, a tool is used (act), its result comes back (observe), a risky step waits for a person (ask), the loop ends (answer).
  var KINDS = { think: "Think", act: "Act", observe: "Observe", ask: "Ask you", answer: "Answer" };
  var ZONES = { think: "model", act: "tools", observe: "know", ask: "control", answer: "ops" };
  var RUNS = [
    { goal: "Fix the failing test", steps: [
      ["think", "The test fails. I should read the error first."],
      ["act", "run_tests()"],
      ["observe", "1 failed: total() counts the last item twice."],
      ["act", "edit_file(\"cart.py\")"],
      ["observe", "12 passed."],
      ["answer", "Fixed: total() no longer counts the last item twice."]
    ] },
    { goal: "Book a table for four", steps: [
      ["think", "I need a free table for four on Friday evening."],
      ["act", "search_restaurants(party=4, day=\"Fri\")"],
      ["observe", "Trattoria Nove has 19:30 free."],
      ["ask", "Book it for 19:30? Waiting for your approval."],
      ["act", "book_table(\"Trattoria Nove\", \"Fri 19:30\")"],
      ["answer", "Booked: Trattoria Nove, Friday at 19:30."]
    ] },
    { goal: "Summarise the support emails", steps: [
      ["think", "I need this week's messages from the support inbox."],
      ["act", "search_mail(inbox=\"support\", since=\"7d\")"],
      ["observe", "42 emails found."],
      ["act", "read_mail(batch=1..3)"],
      ["answer", "Most are about login problems (17), then invoices (11)."]
    ] }
  ];

  var elGoals = sk.$("#demo-goals"), elLog = sk.$("#demo-log"), elReplay = sk.$("#demo-replay"), elStatus = sk.$("#demo-status");
  // Every run is also laid out, unseen, in the cell of the log: the box takes the height of the longest one (at the width it has) and never grows while a run plays.
  function reserveRoom() {
    var box = sk.$("#demo-logbox");
    if (!box) return;
    RUNS.forEach(function (run) {
      var ghost = h("ol", { class: "ls-ghost", "aria-hidden": "true" });
      run.steps.forEach(function (st) { addStep(st, true, ghost); });
      box.appendChild(ghost);
    });
  }
  var goalBtns = [], current = 0, token = 0, timer = 0, started = false;

  function addStep(step, instant, into) {
    var li = h("li", { class: "ls ls-" + step[0] + (instant ? "" : " ls-new"), "data-zone": ZONES[step[0]] },
      h("span", { class: "ls-kind" }, KINDS[step[0]]),
      step[0] === "act" ? h("code", { class: "ls-text" }, step[1]) : h("span", { class: "ls-text" }, step[1]));
    (into || elLog).appendChild(li);
  }

  function finish(run) {
    elReplay.disabled = false;
    elStatus.textContent = "Done. The agent answered: " + run.steps[run.steps.length - 1][1];
  }

  function play(i, instant) {
    clearTimeout(timer);
    var my = ++token, run = RUNS[i], n = 0;
    current = i; started = true;
    goalBtns.forEach(function (b, k) { b.setAttribute("aria-pressed", k === i ? "true" : "false"); });
    sk.clear(elLog);
    elStatus.textContent = "";
    if (instant || reduced) { run.steps.forEach(function (s) { addStep(s, true); }); finish(run); return; }
    elReplay.disabled = true;
    function next() {
      if (my !== token) return;
      if (n >= run.steps.length) { finish(run); return; }
      var s = run.steps[n++];
      addStep(s, false);
      timer = setTimeout(next, s[0] === "think" || s[0] === "ask" ? 1300 : 900);
    }
    timer = setTimeout(next, 500);
  }

  if (elGoals && elLog) {
    reserveRoom();
    RUNS.forEach(function (r, i) {
      var b = h("button", { class: "chip demo-goal", type: "button", "aria-pressed": "false", "data-zone": ["harness", "tools", "know"][i], onclick: function () { play(i); } }, r.goal);
      goalBtns.push(b);
      elGoals.appendChild(b);
    });
    elReplay.addEventListener("click", function () { play(current); });
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
