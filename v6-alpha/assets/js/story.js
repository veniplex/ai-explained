/* Agentic AI, Explained (v6): the guided path. Renders the hero, the chapters, and the whole map with the recap at the
   end. Every chapter is a spread of three columns: the kitchen on the left, the map so far in the middle and the
   technical words on the right (voice.js), with arrows from each passage to the pieces of the map it is about
   (arrows.js). What both voices say alike (the question of a chapter, the title of an idea) is told once, in the
   middle. On narrower screens the map moves above the two voices; on a phone everything stacks. Clicks are handled in app.js. */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3.sk, D = window.AE3, voice = V3.voice;
  var h = sk.h, rich = sk.rich, $ = sk.$, $$ = sk.$$, clear = sk.clear;
  var ZONE = {};
  D.chapters.forEach(function (c) { c.entries.forEach(function (id) { ZONE[id] = c.zone; }); });
  // Which kitchen picture (from v1-alpha's story) illustrates which chapter.
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
    parts.push(h("span", { class: "zone formula-part formula-agent", "data-zone": "start", "data-ref": "agent" }, "Agent"));
    var box = h("div", { class: "formula", role: "group", "aria-label": "Model plus context plus tools plus loop equals agent" }, parts);
    $$(".formula-part", box).forEach(function (el, i) { sk.sketchBox(el, { seed: 61 + i * 7, sw: 1.3 }); });
    return box;
  }

  // The four parts as a stack in the middle of the hero: both sentences point at the agent they add up to.
  function hero() {
    var K = voice.kitchen, T = voice.tech;
    function line(v) {
      return h("div", { class: "voice voice-" + v.kind }, sk.voiceTag(v.kind), h("p", { class: "hero-line passage", "data-points": "agent" }, rich(v.hero.line)),
        h("div", { class: "hero-task" }, h("p", { class: "eyebrow" }, v.ui.example), h("p", null, rich(v.hero.task))),
        v.kitchen ? picture("order", "start") : null);
    }
    var spread = h("div", { class: "trio hero-voices", "data-zone": "start" }, line(K), h("div", { class: "trio-mid" }, formula()), line(T));
    V3.arrows.add(spread);
    return h("section", { class: "hero", id: "start", "aria-labelledby": "hero-title", tabindex: "-1" },
      h("div", { class: "hero-head" },
        h("p", { class: "eyebrow" }, "Snapshot · " + D.meta.snapshot),
        h("h1", { class: "hero-title", id: "hero-title" }, D.hero.title),
        h("p", { class: "hero-sub" }, "Everything on this page is told twice, side by side: once with a restaurant kitchen, once in plain technical words. Where there is room, the picture between them belongs to both, and arrows show what each side means.")),
      spread,
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
  // Each paragraph and the example is a passage: data-points names the pieces of the map it is about (core.js, AE3.points).
  function column(c, v) {
    var kind = v.kind, t = v.chapter(c), u = v.ui, kitchen = v.kitchen;
    return h("div", { class: "voice voice-" + kind, "data-voice": kind },
      h("div", { class: "ch-head" },
        sk.voiceTag(kind),
        kitchen ? picture(PIC_FOR[c.id], c.zone) : sk.doodleSvg(c.zone, "ch-icon", 31 + c.n, undefined, c.id, true)),
      kitchen ? h("p", { class: "ch-lead" }, rich(t.lead)) : null,
      h("div", { class: "ch-section ch-real" }, h("p", { class: "eyebrow" }, u.text), t.text.map(function (p, i) {
        return h("p", { class: "passage", "data-points": t.points.text[i].join(" ") }, rich(p));
      })),
      figure(c.figure, v),
      h("div", { class: "ch-section ch-example passage", "data-points": t.points.example.join(" ") }, h("p", { class: "eyebrow" }, u.example), h("p", null, rich(t.example))));
  }

  // The part of a chapter that both voices share: its number, its name in both voices and the question it answers.
  function chapterHead(c) {
    var id = anchor(c), k = voice.kitchen.chapter(c);
    return h("header", { class: "ch-top" },
      h("p", { class: "eyebrow" }, c.n === 8 ? "Epilogue" : "Chapter " + c.n),
      h("h2", { class: "ch-title", id: id + "-t" }, k.title),
      h("p", { class: "ch-nick" }, k.term),
      h("p", { class: "ch-problem" }, rich(voice.problem(c))));
  }

  // The map so far for one chapter, in the middle. Its own piece is added when the chapter first comes on screen.
  // The map is a picture here: the terms are links in the chip row under the chapter, so the blocks stay out of the tab order.
  function chapterMap(c) {
    var m = V3.map.create({ layout: "spine", ring: false, stage: c.n - 1, current: c.n });
    var host = h("aside", { class: "trio-mid trio-sticky spread-map", "aria-hidden": "true" }, m.el);
    $$("a, button", host).forEach(function (el) { el.setAttribute("tabindex", "-1"); });
    return { el: host, grow: function () { m.setStage(c.n, c.n); $$("a, button", host).forEach(function (el) { el.setAttribute("tabindex", "-1"); }); } };
  }

  function chapter(c) {
    var id = anchor(c), map = chapterMap(c);
    var spread = h("div", { class: "trio spread", "data-zone": c.zone, "data-ch": c.n }, column(c, voice.kitchen), map.el, column(c, voice.tech));
    V3.arrows.add(spread, { onShow: map.grow });
    return h("section", { class: "chapter", id: id, "data-n": c.n, "data-zone": c.zone, "aria-labelledby": id + "-t", tabindex: "-1" },
      chapterHead(c), spread,
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
        h("ol", { class: "ideas" }, D.recap.map(function (it, i) {
          var rk = K.recap[i], rt = T.recap[i];
          // The idea itself is one thing: its number and both names sit in the middle, the two explanations at the sides.
          return h("li", { class: "trio idea" },
            h("div", { class: "voice voice-kitchen" }, sk.voiceTag("kitchen"), h("p", null, rich(rk.d))),
            h("div", { class: "trio-mid idea-mid" },
              h("span", { class: "idea-num", "aria-hidden": "true" }, String(i + 1)),
              h("h3", null, rk.t),
              rt.t !== rk.t ? h("p", { class: "idea-nick" }, rt.t) : null,
              h("div", { class: "chips" }, it.entries.map(chip))),
            h("div", { class: "voice voice-technical" }, sk.voiceTag("technical"), h("p", null, rich(rt.d))));
        }))),
      h("footer", { class: "stamp" },
        h("span", { class: "badge badge-clay" }, "Snapshot · " + D.meta.snapshot),
        h("span", null, count + " entries · " + sources + " checked sources"),
        h("span", null,
          h("a", { href: sk.url.guide("about") }, "About this page"), " · ",
          h("a", { href: D.meta.v1 }, "Full reference (v1-alpha)"), " · ",
          h("a", { href: D.meta.repo, target: "_blank", rel: "noopener" }, "GitHub"))));
  }

  // Listeners on the window and observers are undone when the page is drawn again.
  var undo = [];
  function listen(type, fn, opts) { window.addEventListener(type, fn, opts); undo.push(function () { window.removeEventListener(type, fn, opts); }); }

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

  function render(main) {
    undo.splice(0).forEach(function (fn) { fn(); });
    V3.arrows.reset();
    clear(main);
    $$(".rail, .progress").forEach(function (el) { el.remove(); });
    var chapters = h("div", { class: "chapters" }, D.chapters.map(chapter));
    var list = stops(), railEl = rail(list), line = h("div", { class: "progress", "aria-hidden": "true" }, h("i"));
    sk.append(main, [hero(), h("div", { class: "story" }, chapters), hub()]);
    document.body.appendChild(railEl);
    document.body.appendChild(line);
    followScroll(list, railEl, line);
  }

  V3.story = { render: render };
})();
