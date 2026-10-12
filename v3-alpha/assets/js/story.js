/* Agentic AI, Explained (v3): the guided path. Renders the hero, the chapters with their pictures,
   the map that grows beside them, the "map so far" sketches for narrow screens, and the whole
   kitchen with the recap at the end. Clicks are handled in app.js. */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3.sk, D = window.AE3;
  var h = sk.h, rich = sk.rich, $ = sk.$, $$ = sk.$$;
  var WIDE = "(min-width: 1024px)";
  var ZONE = {};
  D.chapters.forEach(function (c) { c.entries.forEach(function (id) { ZONE[id] = c.zone; }); });
  // Which kitchen picture (from v1-alpha's story) illustrates which chapter.
  var PIC_FOR = { chef: "chef", counter: "counter", tools: "tools", loop: "taste", recipes: "cards", locks: "locks", helpers: "helpers", "kitchen-ops": "critics" };

  function chip(id) {
    var e = D.entries[id];
    return h("button", { class: "chip", type: "button", "data-entry": id, "data-zone": ZONE[id] }, e.label || e.name);
  }
  function anchor(c) { return c.n === 8 ? "ch-e" : "ch-" + c.n; }
  function picture(id, zone) {
    var svg = sk.s("svg", { viewBox: "0 0 240 160", role: "img", "aria-label": sk.PIC_ALT[id] });
    sk.sketchInto(svg, sk.PICS[id](), 17 + id.length * 13, { base: { r: 0.9 } });
    return h("figure", { class: "pic", "data-zone": zone }, svg);
  }

  function hero() {
    return h("section", { class: "hero", "aria-labelledby": "hero-title" },
      h("div", { class: "hero-text" },
        h("p", { class: "eyebrow" }, "Snapshot · " + D.meta.snapshot),
        h("h1", { class: "hero-title", id: "hero-title" }, D.hero.title),
        h("p", { class: "hero-line" }, rich(D.hero.line)),
        h("div", { class: "hero-actions" },
          h("button", { class: "btn btn-ink", type: "button", "data-go": "ch-1" }, "Start ", h("span", { class: "btn-note" }, "(about " + D.hero.minutes + " minutes)")),
          h("button", { class: "btn", type: "button", "data-go": "map" }, "Skip to the map"))),
      picture("order", "start"));
  }

  function contextBars() {
    var root = h("div", { class: "fig ctx-wrap" });
    D.figures.contextBars.forEach(function (row, ri) {
      var bar = h("div", { class: "ctx-bar", role: "img", "aria-label": row.title + ": " + row.segs.map(function (sg) { return sg.label + " " + sg.pct + "%"; }).join(", ") });
      row.segs.forEach(function (sg) {
        bar.appendChild(h("div", { class: "ctx-seg" + (sg.cls ? " ctx-seg-" + sg.cls : ""), "data-zone": sg.zone || "start", style: "flex: 0 0 " + sg.pct + "%" }, sg.pct >= 15 ? sg.label : ""));
      });
      sk.sketchOutline(bar, 400 + ri * 9);
      root.appendChild(h("div", { class: "ctx-row" },
        h("h3", { class: "ctx-title" }, row.title),
        bar,
        h("p", { class: "ctx-break" }, row.segs.filter(function (sg) { return sg.cls !== "free"; }).map(function (sg) {
          return h("span", { "data-zone": sg.zone || "start" }, h("i", { "aria-hidden": "true" }), sg.label + " " + sg.pct + "%");
        })),
        h("p", { class: "cap" }, rich(row.caption))));
    });
    return root;
  }
  function figure(kind) {
    if (kind === "context-bars") return contextBars();
    if (kind === "loop") return h("div", { class: "fig fig-loop", "data-zone": "harness" }, V3.map.loop(), h("p", { class: "fig-cap" }, "Tap the loop to read more."));
    return null;
  }

  function chapter(c) {
    var id = anchor(c);
    return h("section", { class: "chapter", id: id, "data-n": c.n, "data-zone": c.zone, "aria-labelledby": id + "-t", tabindex: "-1" },
      h("p", { class: "eyebrow" }, (c.n === 8 ? "Epilogue" : "Chapter " + c.n) + " · " + c.term),
      h("h2", { class: "ch-title", id: id + "-t" }, c.title),
      h("div", { class: "mini-map", "data-mini": c.n, inert: true, "aria-hidden": "true" }),
      h("p", { class: "ch-problem" }, rich(c.problem)),
      h("div", { class: "ch-kitchen" }, picture(PIC_FOR[c.id], c.zone),
        h("div", null, h("p", { class: "eyebrow" }, "In the kitchen"), h("p", { class: "ch-kitchen-text" }, rich(c.kitchen)))),
      h("div", { class: "ch-section ch-real" }, h("p", { class: "eyebrow" }, "In real life"), c.real.map(function (p) { return h("p", null, rich(p)); })),
      figure(c.figure),
      h("div", { class: "ch-section ch-example" }, h("p", { class: "eyebrow" }, "In our example"), h("p", null, rich(c.example))),
      h("div", { class: "ch-section ch-terms" }, h("p", { class: "eyebrow" }, "New words"), h("div", { class: "chips" }, c.entries.map(chip))));
  }

  function hub() {
    var map = V3.map.create({ layout: "hub", ring: true, stage: 8 });
    var count = Object.keys(D.entries).length;
    // Count each source once, however many entries cite it.
    var seen = {};
    Object.keys(D.sources).forEach(function (id) { D.sources[id].sources.forEach(function (s) { seen[s.url] = true; }); });
    var sources = Object.keys(seen).length;
    return h("section", { class: "hub", id: "map", "aria-labelledby": "hub-title", tabindex: "-1" },
      h("div", { class: "hub-head" },
        h("p", { class: "eyebrow" }, "The whole kitchen"),
        h("h2", { class: "hub-title", id: "hub-title" }, "Everything on one map"),
        h("p", { class: "hub-lede" }, "Tap any word to open it. Tap a heading to go back to its chapter.")),
      map.el,
      h("div", { class: "recap" },
        h("h2", { class: "recap-title" }, "5 things to remember"),
        h("ol", { class: "ideas" }, D.recap.map(function (it, i) {
          return h("li", null, h("span", { class: "idea-num", "aria-hidden": "true" }, String(i + 1)), h("h3", null, it.t), h("p", null, rich(it.d)),
            h("div", { class: "chips" }, it.entries.map(chip)));
        }))),
      h("footer", { class: "stamp" },
        h("span", { class: "badge badge-clay" }, "Snapshot · " + D.meta.snapshot),
        h("span", null, count + " entries · " + sources + " checked sources"),
        h("span", null,
          h("button", { class: "link-btn", type: "button", "data-guide": "about" }, "About this page"), " · ",
          h("a", { href: D.meta.v1 }, "Full reference (v1-alpha)"), " · ",
          h("a", { href: D.meta.repo, target: "_blank", rel: "noopener" }, "GitHub"))));
  }

  // The chapter crossing the middle of the screen sets the stage of the map beside the text.
  function track(chapters, sticky, aside) {
    var current = 1;
    function fit() {
      var inner = $(".story-map-inner", aside);
      inner.style.zoom = "";
      if (!window.matchMedia(WIDE).matches || !("zoom" in inner.style)) return;
      var avail = window.innerHeight - $(".bar").offsetHeight - 40, natural = inner.offsetHeight;
      if (natural > avail) inner.style.zoom = Math.max(0.7, avail / natural).toFixed(3);
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
    } else {
      sticky.setStage(8, null);
    }
    window.addEventListener("resize", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    requestAnimationFrame(fit);
  }

  // Narrow screens: each chapter gets its own small "map so far", built when it comes near.
  function lazyMinis(chapters) {
    var boxes = $$(".mini-map", chapters);
    function build(box) {
      if (box._built) return;
      box._built = true;
      var n = +box.getAttribute("data-mini");
      box.appendChild(V3.map.create({ layout: "tall", mini: true, ring: false, stage: n, current: n }).el);
    }
    if (!("IntersectionObserver" in window)) { boxes.forEach(build); return; }
    var io = new IntersectionObserver(function (list) {
      list.forEach(function (en) { if (en.isIntersecting) { build(en.target); io.unobserve(en.target); } });
    }, { rootMargin: "600px 0px" });
    boxes.forEach(function (b) { io.observe(b); });
  }

  function render(main) {
    var chapters = h("div", { class: "chapters" }, D.chapters.map(chapter));
    var sticky = V3.map.create({ layout: "tall", ring: false, stage: 1, current: 1 });
    var aside = h("aside", { class: "story-map", "aria-label": "The map so far" }, h("div", { class: "story-map-inner" }, sticky.el));
    sk.append(main, [hero(), h("div", { class: "story" }, chapters, aside), hub()]);
    track(chapters, sticky, aside);
    lazyMinis(chapters);
  }

  V3.story = { render: render };
})();
