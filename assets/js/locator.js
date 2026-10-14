/* AI explained: "where it sits in the kitchen". Every glossary page shows the whole kitchen of the story, small, with the part this term is about
   outlined, a sentence on what that part is and a way into the story (the labelled kitchen, #e-<id>). The kitchen is drawn from the same lists as the story itself
   (COMIC.kitchen, COMIC.steps, COMIC.names), as it stands at the last step, so the picture and the story can never disagree. Exposes V3.locator.section(term).
   Plain ES5. */
(function () {
  "use strict";

  var C = window.COMIC, V3 = window.V3;
  if (!C || !C.kitchen || !C.steps || !C.names || !C.actor || !C.room || !C.halo || !V3 || !V3.sk) return;
  var K = C.kitchen, STEPS = C.steps, NAMES = C.names, sk = V3.sk, h = sk.h, url = sk.url, NS = "http://www.w3.org/2000/svg";
  var RANK = { wall: 0, furn: 1, top: 2, floor: 3, people: 4, front: 5 };
  var PEOPLE = { chef: 1, owner: 1, person: 1 };

  function svg(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  // What is in the kitchen at the last step: which things, where they stand and how people look (the same rule as the reader's).
  function lastState() {
    var st = { on: {}, pos: {}, pose: {} };
    STEPS.forEach(function (p) {
      (p.show || []).forEach(function (id) { st.on[id] = true; });
      (p.hide || []).forEach(function (id) { delete st.on[id]; });
      Object.keys(p.go || {}).forEach(function (id) { st.pos[id] = p.go[id]; });
      Object.keys(p.pose || {}).forEach(function (id) { st.pose[id] = p.pose[id]; });
    });
    return st;
  }

  function scene(host, nm) {
    var st = lastState();
    var room = svg("g"), back = svg("g"), front = svg("g"), halos = svg("g", { class: "loc-halos" });
    room.appendChild(C.room(K.wall));
    K.actors.map(function (a, i) { return { a: a, i: i }; })
      .filter(function (p) { return st.on[p.a.id] || (p.a.o && p.a.o.always); })
      .sort(function (p, q) { return (RANK[p.a.layer] - RANK[q.a.layer]) || (p.i - q.i); })
      .forEach(function (p) {
        var a = p.a, spec = {}, want, pos = st.pos[a.id] || [a.x, a.y];
        Object.keys(a).forEach(function (k) { spec[k] = a[k]; });
        spec.x = pos[0]; spec.y = pos[1];
        want = st.pose[a.id] || (a.poses && a.poses[0]) || (PEOPLE[a.prop] ? "calm/down" : null);
        spec.poses = want ? [want] : [];
        var e = C.actor(spec);
        if (!e) return;
        e.classList.add("on");
        Array.prototype.forEach.call(e.querySelectorAll(".pose"), function (pg) { pg.classList.add("on"); });
        (RANK[a.layer] >= RANK.people ? front : back).appendChild(e);
      });
    (nm.boxes || [nm.box]).forEach(function (b, k) { halos.appendChild(C.halo(b, nm.zone, "loc-" + nm.id + k)); });
    var world = svg("g", { class: "loc-world" });
    world.appendChild(room);
    world.appendChild(back);
    world.appendChild(front);
    host.appendChild(world);
    host.appendChild(halos);
  }

  // The section "Where it sits in the kitchen" of a glossary page: the kitchen of the story, small, with the spot this term belongs to outlined, a sentence on
  // what that spot is, and one way into the story (the labelled kitchen, #e-<id>). A main term has a spot of its own; every other term sits at the spot of the
  // main term it belongs to.
  // **bold bridges** of the kitchen sentence (a technical word the kitchen voice may use) become <strong>.
  function bold(text) {
    return String(text || "").split(/\*\*([^*]+)\*\*/).map(function (part, i) { return i % 2 ? h("strong", null, part) : part; });
  }
  function section(t) {
    var nm = null, spot = t.entry || t.id;
    NAMES.forEach(function (n) { if (n.id === spot) nm = n; });
    if (!nm) return null;
    var line = V3.terms.kitchen(t.id), main = V3.terms.get(spot);
    // The picture is a link too, but only for the mouse: the button beside it says the same.
    var box = h("a", { class: "loc-pic", href: url.kitchen("e-" + spot), tabindex: "-1", "aria-hidden": "true" });
    var card = h("aside", { class: "locator", "data-zone": nm.zone, "aria-labelledby": "loc-title" },
      box,
      h("div", { class: "loc-text" },
        h("h3", { class: "loc-title", id: "loc-title" }, nm.kw.charAt(0).toUpperCase() + nm.kw.slice(1)),
        t.main ? null : h("p", { class: "loc-part" }, "Part of ", h("a", { href: url.entry(spot), "data-entry": spot }, main.name)),
        h("p", { class: "loc-line" }, bold(line)),
        h("div", { class: "loc-actions" },
          h("a", { class: "btn btn-sm", href: url.kitchen("e-" + spot) }, "See it in the kitchen"))));
    // The drawing takes a moment; the page does not wait for it.
    var draw = function () {
      var s = svg("svg", { class: "loc-sk", viewBox: "0 " + K.y0 + " " + K.w + " " + (K.h - K.y0), role: "img", "aria-label": "The kitchen of the story, with " + nm.kw + " outlined" });
      scene(s, nm);
      // The sheet of the deep dive paints every .sk-line in ink; here the lines keep the colours they were drawn with.
      Array.prototype.forEach.call(s.querySelectorAll(".sk-line"), function (p) { p.setAttribute("class", "kt-line"); });
      box.appendChild(s);
      box.classList.add("is-drawn");
    };
    if (window.requestIdleCallback) window.requestIdleCallback(draw, { timeout: 600 }); else setTimeout(draw, 30);
    return h("div", { class: "bd-section" }, h("h2", null, "Where it sits in the kitchen"), card);
  }

  V3.locator = { section: section };
})();
