/* Agentic AI, Explained (v6): the arrows from the text to the map.
   A spread has the kitchen on the left, the map (or another picture) in the middle and the technical words on the right.
   Passages carry data-points="model reasoning": the pieces of the middle they are about. The passage nearest the
   reading line of each column (or the one under the pointer) gets an arrow from the edge of its column to those pieces,
   so both voices point at the same thing. The arrows are only a help for the eye: everything they say is also in the
   text, and they are drawn only where the three columns sit side by side (the same breakpoint as style.css). */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3.sk, s = sk.s, $ = sk.$, $$ = sk.$$, clear = sk.clear;
  var WIDE = "(min-width: 1300px) and (min-height: 620px)";
  var items = [], queued = false, listening = false;

  function barHeight() { var b = $(".bar"); return b ? b.getBoundingClientRect().bottom : 0; }
  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
  // A small, repeatable wobble per word, so the arrows look drawn by hand but never jump between frames.
  function wobble(text, n) {
    var k = 0;
    for (var i = 0; i < text.length; i++) k = (k * 31 + text.charCodeAt(i)) % 997;
    return ((k % 7) - 3) * n / 3;
  }

  // What a token in data-points stands for, inside the spread.
  function resolve(it, token) {
    var root = it.el, el = null;
    if (token === "you") el = $(".zone-you", root);
    else if (token === "zone") el = $('[data-ch="' + it.el.getAttribute("data-ch") + '"] .zone-title', root);
    else el = $('.blk[data-entry="' + token + '"]', root) || $('[data-ref="' + token + '"]', root);
    return el;
  }

  function nearest(list, probe) {
    var best = null, bestD = Infinity;
    list.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var d = probe < r.top ? r.top - probe : probe > r.bottom ? probe - r.bottom : 0;
      if (d < bestD) { bestD = d; best = el; }
    });
    return best;
  }

  // The two strokes of the head: a little off from the line, like a pen would leave them.
  function headPath(x2, y2, dir) {
    var a = 0.5, l = 9;
    return "M" + (x2 - dir * l * Math.cos(a)).toFixed(1) + " " + (y2 - l * Math.sin(a)).toFixed(1) + "L" + x2.toFixed(1) + " " + y2.toFixed(1) +
      "L" + (x2 - dir * l * Math.cos(a)).toFixed(1) + " " + (y2 + l * Math.sin(a) + 1).toFixed(1);
  }
  function linePath(x1, y1, x2, y2, dir, token) {
    var k = Math.max(24, Math.abs(x2 - x1) * 0.55), w = wobble(token, 5);
    return "M" + x1.toFixed(1) + " " + y1.toFixed(1) +
      "C" + (x1 + dir * k).toFixed(1) + " " + (y1 + w).toFixed(1) + " " + (x2 - dir * k).toFixed(1) + " " + (y2 - w).toFixed(1) + " " + x2.toFixed(1) + " " + y2.toFixed(1);
  }

  // Every arrow (and the dot it starts from) is kept between frames and only moved while the same passage points, so
  // scrolling slides it along. When another passage takes over, the old arrows fade away and the new ones are drawn in,
  // stroke by stroke (style.css). Passages are told apart by a number given to them the first time they point.
  var serial = 0;
  function idOf(el) { if (!el._arrowId) el._arrowId = ++serial; return el._arrowId; }
  function still() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  function put(it, key, make, update) {
    var node = it.kept[key];
    if (!node) {
      node = it.kept[key] = make();
      node.classList.add("is-new");
      it.svg.appendChild(node);
      setTimeout(function () { node.classList.remove("is-new"); }, 900);
    }
    update(node);
    node._seen = it.frame;
  }
  function retire(it) {
    Object.keys(it.kept).forEach(function (key) {
      var node = it.kept[key];
      if (node._seen === it.frame) return;
      delete it.kept[key];
      if (still()) { node.remove(); return; }
      node.classList.add("is-leaving");
      setTimeout(function () { node.remove(); }, 320);
    });
  }

  function clearArrows(it) {
    clear(it.svg);
    it.kept = {};
    $$(".is-ref", it.el).forEach(function (el) { el.classList.remove("is-ref"); });
    $$(".passage.is-focus", it.el).forEach(function (el) { el.classList.remove("is-focus"); });
    it.drawn = false;
  }

  function draw(it, box, bar, vh) {
    var probe = bar + (vh - bar) * 0.4, refs = [];
    it.frame++;
    ["kitchen", "technical"].forEach(function (side, si) {
      var col = $(".voice-" + side, it.el);
      if (!col) return;
      var list = $$(".passage[data-points]", col), held = it.hover[side], pick = null;
      if (held) { var hr = held.getBoundingClientRect(); if (hr.bottom > bar && hr.top < vh) pick = held; }
      pick = pick || nearest(list, probe);
      list.forEach(function (el) { el.classList.toggle("is-focus", el === pick); });
      if (!pick) return;
      var pr = pick.getBoundingClientRect(), cr = col.getBoundingClientRect(), dir = si === 0 ? 1 : -1;
      // Start at the reading line, but never above or below the passage or the column it is in.
      var lo = Math.max(pr.top, cr.top + 16, bar + 10), hi = Math.min(pr.bottom, cr.bottom - 16, vh - 10);
      var y1 = lo > hi ? clamp((pr.top + pr.bottom) / 2, cr.top + 16, cr.bottom - 16) : clamp(probe, lo, hi);
      var x1 = (dir === 1 ? cr.right : cr.left) - box.left, y1b = y1 - box.top, ends = [], who = side + idOf(pick);
      pick.getAttribute("data-points").split(" ").forEach(function (token) {
        var el = resolve(it, token), r = el && el.getBoundingClientRect();
        if (!r || !r.width || !r.height) return;
        refs.push(el);
        ends.push({ token: token, x: (dir === 1 ? r.left - 6 : r.right + 6) - box.left, y: r.top + r.height / 2 - box.top });
      });
      if (!ends.length) return;
      put(it, who + "-dot", function () { return s("circle", { class: "arrow-dot", r: 4 }); },
        function (n) { n.setAttribute("cx", x1.toFixed(1)); n.setAttribute("cy", y1b.toFixed(1)); });
      ends.forEach(function (e) {
        put(it, who + "-" + e.token, function () {
          var g = s("g", { class: "arrow" });
          g.appendChild(s("path", { class: "arrow-line arrow-stem", pathLength: "1" }));
          g.appendChild(s("path", { class: "arrow-line arrow-head" }));
          return g;
        }, function (n) {
          n.firstChild.setAttribute("d", linePath(x1, y1b, e.x, e.y, dir, e.token + side));
          n.lastChild.setAttribute("d", headPath(e.x, e.y, dir));
        });
      });
    });
    retire(it);
    $$(".is-ref", it.el).forEach(function (el) { if (refs.indexOf(el) === -1) el.classList.remove("is-ref"); });
    refs.forEach(function (el) { el.classList.add("is-ref"); });
    it.drawn = true;
  }

  function update() {
    queued = false;
    var vh = window.innerHeight, bar = barHeight(), wide = window.matchMedia(WIDE).matches;
    items.forEach(function (it) {
      if (!it.el.isConnected) return;
      var box = it.el.getBoundingClientRect();
      if (box.bottom < bar || box.top > vh) { if (it.drawn) clearArrows(it); return; }
      if (!it.shown) {
        it.shown = true;
        if (it.onShow) it.onShow();
        box = it.el.getBoundingClientRect();
      }
      if (wide) draw(it, box, bar, vh); else if (it.drawn) clearArrows(it);
    });
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }

  // `spread` holds a .voice-kitchen, a .voice-technical and the middle. `onShow` runs once, the first time the spread is on screen.
  function add(spread, opts) {
    var it = { el: spread, svg: s("svg", { class: "arrows", "aria-hidden": "true", focusable: "false" }), onShow: opts && opts.onShow, shown: false, drawn: false, hover: {}, kept: {}, frame: 0 };
    spread.appendChild(it.svg);
    // The passage under the pointer or holding the keyboard focus is the one that points.
    function hold(e) {
      var p = e.target instanceof Element && e.target.closest(".passage[data-points]"), col = p && p.closest(".voice");
      if (!p || !col || !spread.contains(col)) return;
      it.hover[col.classList.contains("voice-kitchen") ? "kitchen" : "technical"] = p;
      queue();
    }
    function release(e) {
      var col = e.target instanceof Element && e.target.closest(".voice");
      if (!col || !spread.contains(col)) return;
      it.hover[col.classList.contains("voice-kitchen") ? "kitchen" : "technical"] = null;
      queue();
    }
    spread.addEventListener("pointerover", hold);
    spread.addEventListener("focusin", hold);
    spread.addEventListener("pointerleave", function () { it.hover = {}; queue(); });
    spread.addEventListener("focusout", release);
    items.push(it);
    if (!listening) {
      listening = true;
      window.addEventListener("scroll", queue, { passive: true });
      window.addEventListener("resize", queue);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
    }
    queue();
    return it;
  }

  // Forget every spread (the page is drawn again).
  function reset() { items = []; }

  V3.arrows = { add: add, reset: reset, update: queue };
})();
