/* AI explained: the "Try it" parts. A small demo sits on a glossary page (between the definition and the related terms) or under the text of a part of a guide,
   next to links to tools of other people. The placements, the titles and the links are in data/demos.js; each demo is its own script in assets/js/demos/<id>.js,
   loaded when its frame comes near the screen, so a page without a demo loads nothing extra. A demo registers itself with V3.demos.define(id, function (ctx) {...}),
   where ctx has its frame's body, the pen helpers and a few small tools.
   Every frame says what kind of demo it is: computed live (real maths in the page), scripted (a hand-written run that shows a mechanism) or recorded (a real run,
   copied once). A scripted run is never passed off as the behaviour of a model. Plain ES5, no frameworks, no request to anywhere. */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3 && V3.sk, A = window.AE3 || {};
  if (!sk) return;
  var h = sk.h, url = sk.url, D = A.demos || { list: {}, links: {}, terms: {}, guides: {} };
  var KIND = { live: "Computed live", scripted: "Scripted run", recorded: "Recorded run" };
  var defs = {}, waiting = {}, serial = 0;

  /* ---------- Small tools for the demos ------------------------------------------------------------ */
  // 12345 -> "12,345"
  function num(n) { return Math.round(n).toLocaleString("en-GB"); }
  // A row of buttons of which one is on: pick(label, [[value, text], ...], value, onchange) -> the element, with .set(value).
  function pick(label, options, value, onchange) {
    var box = h("div", { class: "dm-pick", role: "group", "aria-label": label }), now = value;
    options.forEach(function (o) {
      var b = h("button", { type: "button", class: "dm-chip", "data-v": String(o[0]) }, o[1]);
      b.addEventListener("click", function () { set(o[0]); onchange(o[0]); });
      box.appendChild(b);
    });
    function set(v) {
      now = v;
      Array.prototype.forEach.call(box.querySelectorAll("button"), function (b) { var on = b.getAttribute("data-v") === String(v); b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
    }
    set(value);
    box.set = set;
    box.value = function () { return now; };
    return box;
  }
  // A labelled tick box: toggle(text, checked, onchange, hint) -> the label element, with .input.
  function toggle(text, checked, onchange, hint) {
    var id = "dm-t" + (++serial), input = h("input", { type: "checkbox", id: id });
    input.checked = !!checked;
    input.addEventListener("change", function () { onchange(input.checked); });
    var el = h("label", { class: "dm-toggle", for: id }, input, h("span", { class: "dm-toggle-text" }, h("span", null, text), hint ? h("small", null, hint) : null));
    el.input = input;
    return el;
  }
  // A labelled slider: slider(text, {min, max, step, value}, show(value) -> text, onchange(value)).
  function slider(text, o, show, onchange) {
    var id = "dm-s" + (++serial), out = h("output", { class: "dm-out", for: id });
    var input = h("input", { type: "range", id: id, min: o.min, max: o.max, step: o.step || 1, value: o.value });
    function sync() { out.textContent = show(+input.value); }
    input.addEventListener("input", function () { sync(); onchange(+input.value); });
    sync();
    var el = h("div", { class: "dm-slider" }, h("label", { for: id }, text), input, out);
    el.input = input;
    return el;
  }
  // The buttons of a stepper: Back, Next, Start again, with a counter. Returns { el, set(i, n) }.
  function stepper(go) {
    var back = h("button", { type: "button", class: "btn btn-sm" }, "Back"), next = h("button", { type: "button", class: "btn btn-sm btn-ink" }, "Next");
    var count = h("span", { class: "dm-count", "aria-live": "polite" }), i = 0, n = 1;
    back.addEventListener("click", function () { if (i > 0) go(i - 1); });
    next.addEventListener("click", function () { go(i < n - 1 ? i + 1 : 0); });
    return {
      el: h("div", { class: "dm-steps" }, back, next, count),
      set: function (at, total) { i = at; n = total; count.textContent = "Step " + (at + 1) + " of " + total; back.disabled = at === 0; next.textContent = at === total - 1 ? "Start again" : "Next"; }
    };
  }

  /* ---------- A frame, and the loading of the demo ---------------------------------------------------- */
  function frame(id) {
    var m = D.list[id];
    var body = h("div", { class: "dm-body" }, h("p", { class: "dm-wait" }, "Loading the demo…"));
    var el = h("figure", { class: "dm", "data-zone": m.zone, "data-demo": id },
      h("figcaption", { class: "dm-head" }, h("span", { class: "dm-kind dm-kind-" + m.kind }, KIND[m.kind]), h("span", { class: "dm-title" }, m.title)),
      h("p", { class: "dm-lede" }, sk.rich(m.lede)),
      body,
      m.note ? h("p", { class: "dm-note" }, sk.rich(m.note)) : null);
    return { el: el, body: body };
  }

  function run(id, f) {
    sk.clear(f.body);
    try { defs[id]({ body: f.body, el: f.el, h: h, sk: sk, reduced: sk.reduced(), num: num, pick: pick, toggle: toggle, slider: slider, stepper: stepper, url: url }); }
    catch (e) { f.body.appendChild(h("p", { class: "dm-wait" }, "This demo could not start. Reload the page to try again.")); }
  }
  function define(id, fn) {
    defs[id] = fn;
    (waiting[id] || []).forEach(function (f) { run(id, f); });
    waiting[id] = [];
  }
  var loading = {};
  function load(id, f) {
    if (defs[id]) { run(id, f); return; }
    (waiting[id] = waiting[id] || []).push(f);
    if (loading[id]) return;
    loading[id] = true;
    var s = document.createElement("script");
    s.src = url.base + "assets/js/demos/" + id + ".js";
    s.onerror = function () { loading[id] = false; (waiting[id] || []).forEach(function (x) { sk.clear(x.body); x.body.appendChild(h("p", { class: "dm-wait" }, "The demo could not be loaded. Reload the page to try again.")); }); waiting[id] = []; };
    document.body.appendChild(s);
  }
  function mount(id) {
    var f = frame(id);
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); load(id, f); } }, { rootMargin: "300px 0px" });
      io.observe(f.el);
    } else load(id, f);
    return f.el;
  }

  /* ---------- The tools of other people ----------------------------------------------------------------- */
  function links(ids) {
    if (!ids || !ids.length) return null;
    return h("div", { class: "dm-links" },
      h("h3", { class: "dm-links-h" }, "Try it elsewhere"),
      h("ul", null, ids.map(function (id) {
        var l = D.links[id];
        return h("li", null,
          h("a", { href: l.url, target: "_blank", rel: "noopener" }, l.title),
          h("span", { class: "dm-links-by" }, l.by),
          h("span", { class: "dm-links-note" }, l.note));
      })));
  }

  // The parts of a page: demos first, then the links. spec = { demos: [...], links: [...] }.
  function block(spec) {
    if (!spec) return null;
    var parts = (spec.demos || []).map(mount);
    var more = links(spec.links);
    if (more) parts.push(more);
    return parts.length ? h("div", { class: "dm-block" }, parts) : null;
  }
  function forTerm(id) { return block(D.terms[id]); }
  function forSection(guide, section) { var g = D.guides[guide]; return block(g && g[section]); }

  V3.demos = { define: define, forTerm: forTerm, forSection: forSection, has: function (id) { return !!D.terms[id]; } };
})();
