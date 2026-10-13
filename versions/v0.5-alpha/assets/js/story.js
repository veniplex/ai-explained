/* Agentic AI, Explained (v5): the guided path. Renders the hero, the chapters, the map that grows beside them, the
   "map so far" sketches for narrower screens, and the whole map with the recap at the end. Every section is told in
   both voices side by side: the kitchen on the left, the technical words on the right (voice.js). On narrow screens
   the two columns stack. Clicks are handled in app.js. */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3.sk, D = window.AE3, voice = V3.voice;
  var h = sk.h, rich = sk.rich, $ = sk.$, $$ = sk.$$, clear = sk.clear;
  // Wide and tall enough for the sticky map beside the two columns; the same breakpoint as the narrow block in style.css.
  var WIDE = "(min-width: 1480px) and (min-height: 660px)";
  var ZONE = {};
  D.chapters.forEach(function (c) { c.entries.forEach(function (id) { ZONE[id] = c.zone; }); });
  // Which kitchen picture (from v0.1-alpha's story) illustrates which chapter.
  var PIC_FOR = { chef: "chef", counter: "counter", tools: "tools", loop: "taste", recipes: "cards", locks: "locks", helpers: "helpers", "kitchen-ops": "critics" };

  function chip(id) {
    var e = D.entries[id];
    return h("a", { class: "chip", href: sk.url.entry(id), "data-entry": id, "data-zone": ZONE[id] }, e.label || e.name);
  }
  function anchor(c) { return c.n === 8 ? "ch-e" : "ch-" + c.n; }
  function picture(id, zone) {
    var svg = sk.s("svg", { viewBox: "0 0 240 160", role: "img", "aria-label": sk.PIC_ALT[id] });
    sk.sketchInto(svg, sk.PICS[id](), 17 + id.length * 13, { base: { r: 0.9 } });
    return h("figure", { class: "pic", "data-zone": zone }, svg);
  }

  // The technical voice shows the four parts instead of the kitchen picture. Each part leads to its chapter.
  var FORMULA = [["Model", "ch-1", "model", "chef"], ["Context", "ch-2", "harness", "counter"], ["Tools", "ch-3", "tools", "tools"], ["Loop", "ch-4", "harness", "loop"]];
  function formula() {
    var parts = [];
    FORMULA.forEach(function (p, i) {
      if (i) parts.push(h("span", { class: "formula-op", "aria-hidden": "true" }, "+"));
      parts.push(h("a", { class: "zone formula-part", href: "#" + p[1], "data-go": p[1], "data-zone": p[2] }, sk.doodleSvg(p[2], "formula-icon", 21 + i, undefined, p[3], true), p[0]));
    });
    parts.push(h("span", { class: "formula-op", "aria-hidden": "true" }, "="));
    parts.push(h("span", { class: "zone formula-part formula-agent", "data-zone": "start" }, "Agent"));
    var box = h("div", { class: "formula", role: "group", "aria-label": "Model plus context plus tools plus loop equals agent" }, parts);
    $$(".formula-part", box).forEach(function (el, i) { sk.sketchBox(el, { seed: 61 + i * 7, sw: 1.3 }); });
    return box;
  }

  function hero() {
    var K = voice.kitchen, T = voice.tech;
    return h("section", { class: "hero", id: "start", "aria-labelledby": "hero-title", tabindex: "-1" },
      h("div", { class: "hero-head" },
        h("p", { class: "eyebrow" }, "Snapshot · " + D.meta.snapshot),
        h("h1", { class: "hero-title", id: "hero-title" }, D.hero.title),
        h("p", { class: "hero-sub" }, "Everything on this page is told twice, side by side: once with a restaurant kitchen, once in plain technical words.")),
      h("div", { class: "hero-voices" },
        h("div", { class: "voice voice-kitchen" }, sk.voiceTag("kitchen"), h("p", { class: "hero-line" }, rich(K.hero.line)), picture("order", "start")),
        h("div", { class: "voice voice-technical" }, sk.voiceTag("technical"), h("p", { class: "hero-line" }, rich(T.hero.line)), formula())),
      h("div", { class: "hero-actions" },
        h("button", { class: "btn btn-ink", type: "button", "data-go": "ch-1" }, "Start ", h("span", { class: "btn-note" }, "(about " + D.hero.minutes + " minutes)")),
        h("button", { class: "btn", type: "button", "data-go": "map" }, "Skip to the map")));
  }

  function contextBars(v) {
    var root = h("div", { class: "fig ctx-wrap" });
    D.figures.contextBars.forEach(function (segs, ri) {
      var row = v.figure(ri);
      // pct and colour come from core.js, the words from the voice of the column.
      var parts = segs.map(function (sg, i) { return { label: row.segs[i], pct: sg.pct, zone: sg.zone, cls: sg.cls }; });
      var bar = h("div", { class: "ctx-bar", role: "img", "aria-label": row.title + ": " + parts.map(function (sg) { return sg.label + " " + sg.pct + "%"; }).join(", ") });
      parts.forEach(function (sg) {
        bar.appendChild(h("div", { class: "ctx-seg" + (sg.cls ? " ctx-seg-" + sg.cls : ""), "data-zone": sg.zone || "start", style: "flex: 0 0 " + sg.pct + "%" }, sg.pct >= 15 ? sg.label : ""));
      });
      sk.sketchOutline(bar, 400 + ri * 9);
      root.appendChild(h("div", { class: "ctx-row" },
        h("h3", { class: "ctx-title" }, row.title),
        bar,
        h("p", { class: "ctx-break" }, parts.filter(function (sg) { return sg.cls !== "free"; }).map(function (sg) {
          return h("span", { "data-zone": sg.zone || "start" }, h("i", { "aria-hidden": "true" }), sg.label + " " + sg.pct + "%");
        })),
        h("p", { class: "cap" }, rich(row.caption))));
    });
    return root;
  }
  function figure(kind, v) {
    if (kind === "context-bars") return contextBars(v);
    if (kind === "loop") return h("div", { class: "fig fig-loop", "data-zone": "harness" }, V3.map.loop(v), h("p", { class: "fig-cap" }, "Tap the loop to read more."));
    return null;
  }

  // One column of a chapter, in the words of one voice. Both columns are built by this function, so they stay alike.
  function column(c, v) {
    var kind = v.kind, id = anchor(c), t = v.chapter(c), u = v.ui, kitchen = v.kitchen;
    var eyebrow = (c.n === 8 ? "Epilogue" : "Chapter " + c.n) + (t.term ? " · " + t.term : "");
    var titleId = id + (kitchen ? "-t" : "-tt");
    return h("div", { class: "voice voice-" + kind, "data-voice": kind },
      h("div", { class: "ch-head" },
        h("div", null, sk.voiceTag(kind), h("p", { class: "eyebrow" }, eyebrow), h("h2", { class: "ch-title", id: titleId }, t.title)),
        kitchen ? picture(PIC_FOR[c.id], c.zone) : sk.doodleSvg(c.zone, "ch-icon", 31 + c.n, undefined, c.id, true)),
      h("p", { class: "ch-problem" }, rich(t.problem)),
      kitchen ? h("p", { class: "ch-lead" }, rich(t.lead)) : null,
      h("div", { class: "ch-section ch-real" }, h("p", { class: "eyebrow" }, u.text), t.text.map(function (p) { return h("p", null, rich(p)); })),
      figure(c.figure, v),
      h("div", { class: "ch-section ch-example" }, h("p", { class: "eyebrow" }, u.example), h("p", null, rich(t.example))));
  }

  function chapter(c) {
    var id = anchor(c);
    return h("section", { class: "chapter", id: id, "data-n": c.n, "data-zone": c.zone, "aria-labelledby": id + "-t " + id + "-tt", tabindex: "-1" },
      h("div", { class: "mini-map", "data-mini": c.n, inert: true, "aria-hidden": "true" }),
      h("div", { class: "spread" }, column(c, voice.kitchen), column(c, voice.tech)),
      h("div", { class: "ch-section ch-terms" }, h("p", { class: "eyebrow" }, voice.tech.ui.terms), h("div", { class: "chips" }, c.entries.map(chip))));
  }

  function hub() {
    var K = voice.kitchen, T = voice.tech;
    var map = V3.map.create({ layout: "hub", ring: true, stage: 8 });
    var count = Object.keys(D.entries).length;
    // Count each source once, however many entries cite it.
    var seen = {};
    Object.keys(D.sources).forEach(function (id) { D.sources[id].sources.forEach(function (s) { seen[s.url] = true; }); });
    var sources = Object.keys(seen).length;
    return h("section", { class: "hub", id: "map", "aria-labelledby": "hub-title", tabindex: "-1" },
      h("div", { class: "hub-head" },
        h("p", { class: "eyebrow" }, K.ui.hub + " · " + T.ui.hub),
        h("h2", { class: "hub-title", id: "hub-title" }, "Everything on one map"),
        h("p", { class: "hub-lede" }, "Tap any word to open it. Tap a heading to go back to its chapter. Each name is the kitchen word, with the technical one beside it.")),
      map.el,
      h("div", { class: "recap" },
        h("h2", { class: "recap-title" }, "5 things to remember"),
        h("div", { class: "recap-heads", "aria-hidden": "true" }, sk.voiceTag("kitchen"), sk.voiceTag("technical")),
        h("ol", { class: "ideas" }, D.recap.map(function (it, i) {
          var rk = K.recap[i], rt = T.recap[i];
          return h("li", null, h("span", { class: "idea-num", "aria-hidden": "true" }, String(i + 1)),
            h("div", { class: "idea-voices" },
              h("div", { class: "voice voice-kitchen" }, h("h3", null, rk.t), h("p", null, rich(rk.d))),
              h("div", { class: "voice voice-technical" }, h("h3", null, rt.t), h("p", null, rich(rt.d)))),
            h("div", { class: "chips" }, it.entries.map(chip)));
        }))),
      h("footer", { class: "stamp" },
        h("span", { class: "badge badge-clay" }, "Snapshot · " + D.meta.snapshot),
        h("span", null, count + " entries · " + sources + " checked sources"),
        h("span", null,
          h("a", { href: sk.url.guide("about") }, "About this page"), " · ",
          h("a", { href: D.meta.v1 }, "Full reference (v0.1-alpha)"), " · ",
          h("a", { href: D.meta.repo, target: "_blank", rel: "noopener" }, "GitHub"))));
  }

  // Listeners on the window and observers are undone when the page is drawn again.
  var undo = [];
  function listen(type, fn, opts) { window.addEventListener(type, fn, opts); undo.push(function () { window.removeEventListener(type, fn, opts); }); }

  // The chapter crossing the middle of the screen sets the stage of the map beside the text.
  function track(chapters, sticky, aside) {
    var current = 1;
    function fit() {
      var inner = $(".story-map-inner", aside);
      inner.style.zoom = "";
      if (!window.matchMedia(WIDE).matches || !("zoom" in inner.style)) return;
      var avail = window.innerHeight - $(".bar").offsetHeight - 40, natural = inner.offsetHeight;
      if (natural > avail) inner.style.zoom = Math.max(0.68, avail / natural).toFixed(3);
    }
    function set(n) {
      if (n === current) return;
      current = n;
      sticky.setStage(n, n);
      fit();
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (list) {
        list.forEach(function (en) { if (en.isIntersecting) set(+en.target.getAttribute("data-n")); });
      }, { rootMargin: "-45% 0px -50% 0px" });
      $$(".chapter", chapters).forEach(function (el) { io.observe(el); });
      undo.push(function () { io.disconnect(); });
    } else {
      sticky.setStage(8, null);
    }
    listen("resize", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    requestAnimationFrame(fit);
  }

  // Where you are: a vertical row of dots at the left edge of wide screens (one per stop on the page, with the
  // name on hover or focus), and a thin line under the top bar on narrower ones. Both follow the scroll position.
  function stops() {
    var list = [{ id: "start", label: "Start", zone: "start" }];
    D.chapters.forEach(function (c) { list.push({ id: anchor(c), label: (c.n === 8 ? "Epilogue" : c.n) + " · " + voice.kitchen.chapter(c).title + " · " + voice.tech.chapter(c).title, zone: c.zone }); });
    list.push({ id: "map", label: voice.kitchen.ui.hub + " · " + voice.tech.ui.hub, zone: "start" });
    return list;
  }
  function rail(list) {
    return h("nav", { class: "rail", "aria-label": "Where you are on the page" },
      h("ol", { class: "rail-list" }, list.map(function (st) {
        return h("li", null, h("a", { class: "rail-item", href: "#" + st.id, "data-go": st.id, "data-zone": st.zone },
          h("span", { class: "rail-dot", "aria-hidden": "true" }), h("span", { class: "rail-label" }, st.label)));
      })));
  }
  function followScroll(list, railEl, line) {
    var items = $$(".rail-item", railEl), fill = $("i", line), queued = false, last = -1;
    function update() {
      queued = false;
      var secs = list.map(function (st) { return document.getElementById(st.id); });
      var probe = window.innerHeight * 0.4, cur = 0, frac = 0;
      secs.forEach(function (el, i) { if (el && el.getBoundingClientRect().top <= probe) cur = i; });
      if (cur < secs.length - 1) {
        var a = secs[cur].getBoundingClientRect().top, b = secs[cur + 1].getBoundingClientRect().top;
        frac = Math.max(0, Math.min(1, (probe - a) / Math.max(1, b - a)));
      }
      railEl.style.setProperty("--rail-p", ((cur + frac) / (list.length - 1)).toFixed(4));
      var doc = document.documentElement, max = Math.max(1, doc.scrollHeight - window.innerHeight);
      fill.style.transform = "scaleX(" + Math.max(0, Math.min(1, window.scrollY / max)).toFixed(4) + ")";
      if (cur === last) return;
      last = cur;
      items.forEach(function (a2, i) {
        a2.classList.toggle("is-past", i < cur);
        if (i === cur) a2.setAttribute("aria-current", "location"); else a2.removeAttribute("aria-current");
      });
    }
    function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }
    listen("scroll", queue, { passive: true });
    listen("resize", queue);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
    queue();
  }

  // Narrow or short screens: each chapter gets its own small "map so far". All of them are built up front, so
  // nothing above the reader changes height while scrolling back up (Safari has no scroll anchoring).
  // Where they are hidden (wide screens) they cost little: the sketches draw only at a non-zero size.
  function buildMinis(chapters) {
    $$(".mini-map", chapters).forEach(function (box) {
      var n = +box.getAttribute("data-mini");
      box.appendChild(V3.map.create({ layout: "tall", mini: true, ring: false, stage: n, current: n }).el);
    });
  }

  function render(main) {
    undo.splice(0).forEach(function (fn) { fn(); });
    clear(main);
    $$(".rail, .progress").forEach(function (el) { el.remove(); });
    var chapters = h("div", { class: "chapters" }, D.chapters.map(chapter));
    var sticky = V3.map.create({ layout: "tall", ring: false, stage: 1, current: 1 });
    var aside = h("aside", { class: "story-map", "aria-label": "The map so far" }, h("div", { class: "story-map-inner" }, sticky.el));
    var list = stops(), railEl = rail(list), line = h("div", { class: "progress", "aria-hidden": "true" }, h("i"));
    sk.append(main, [hero(), h("div", { class: "story" }, chapters, aside), hub()]);
    document.body.appendChild(railEl);
    document.body.appendChild(line);
    track(chapters, sticky, aside);
    buildMinis(chapters);
    followScroll(list, railEl, line);
  }

  V3.story = { render: render };
})();
