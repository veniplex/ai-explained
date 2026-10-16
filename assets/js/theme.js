/* AI explained: the colour theme. Three choices: System (the default: follow the setting of the device, also while the page is open), Light and Dark.
   Only Light and Dark are saved (key ae17-theme, in this browser only: no cookies; a choice saved by an older version of the site under another key is not read, so a first visit is always on System); no saved choice means System. This script sits in the <head> and sets the
   theme before the first paint, so there is no flash; the button (#theme-toggle) is wired as soon as the page has loaded and steps System, Light, Dark.
   A click on the button changes the theme as a circle that grows out of the button and uncovers the new colours (View Transitions API); without that API, or with reduced motion asked for, or when the colours do not change, the switch is instant.
   The stylesheets read only data-theme (light or dark, always set here); data-theme-pref says which of the three is chosen, for the icon of the button.
   Plain ES5. */
(function () {
  "use strict";

  var KEY = "ae17-theme", root = document.documentElement, ORDER = ["system", "light", "dark"], NAME = { system: "System", light: "Light", dark: "Dark" };
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function read() {
    try { var t = localStorage.getItem(KEY); if (t === "light" || t === "dark") return t; } catch (e) {}
    return "system";
  }
  function write(pref) {
    try { if (pref === "system") localStorage.removeItem(KEY); else localStorage.setItem(KEY, pref); } catch (e) {}
  }
  // The colour of the browser's own bar (the <meta name="theme-color"> pair is set for the device's setting): a chosen Light or Dark takes the matching one.
  function chrome(pref) {
    if (!document.querySelectorAll) return;
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      var m = metas[i], was = m.getAttribute("data-media");
      if (was === null) { was = m.getAttribute("media") || ""; m.setAttribute("data-media", was); }
      if (pref === "system") { if (was) m.setAttribute("media", was); else m.removeAttribute("media"); }
      else m.setAttribute("media", (/dark/.test(was) === (pref === "dark")) ? "all" : "not all");
    }
  }
  function apply(pref) {
    root.setAttribute("data-theme", pref === "system" ? (mq && mq.matches ? "dark" : "light") : pref);
    root.setAttribute("data-theme-pref", pref);
    chrome(pref);
  }

  root.className += (root.className ? " " : "") + "js";
  apply(read());
  // On System the page follows the device while it is open.
  if (mq) {
    var onChange = function () { if (read() === "system") apply("system"); };
    if (mq.addEventListener) mq.addEventListener("change", onChange); else if (mq.addListener) mq.addListener(onChange);
  }

  function label(btn, pref) {
    var next = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
    btn.setAttribute("aria-label", "Colour theme: " + NAME[pref] + ". Switch to " + NAME[next]);
    btn.setAttribute("title", "Theme: " + NAME[pref] + " (click for " + NAME[next] + ")");
  }
  // The circle: the old page stays still under the new one, which is clipped to a circle that grows from the middle of the button to the farthest corner.
  var CSS = "::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}::view-transition-old(root){z-index:1}::view-transition-new(root){z-index:2}";
  function reveal(btn, change) {
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    var done = function () { if (style.parentNode) style.parentNode.removeChild(style); };
    try {
      var r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      var w = window.innerWidth, h = window.innerHeight;
      var radius = Math.sqrt(Math.pow(Math.max(x, w - x), 2) + Math.pow(Math.max(y, h - y), 2));
      var t = document.startViewTransition(change);
      t.ready.then(function () {
        root.animate(
          { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + radius + "px at " + x + "px " + y + "px)"] },
          { duration: 600, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      }, function () {});
      t.finished.then(done, done);
    } catch (err) { done(); change(); }
  }
  function wire() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    label(btn, read());
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var next = ORDER[(ORDER.indexOf(read()) + 1) % ORDER.length];
      var before = root.getAttribute("data-theme");
      var change = function () { write(next); apply(next); label(btn, next); };
      var after = next === "system" ? (mq && mq.matches ? "dark" : "light") : next;
      var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!document.startViewTransition || still || after === before) { change(); return; }
      reveal(btn, change);
    });
    // Another tab changed the choice.
    window.addEventListener("storage", function (e) { if (e.key === KEY || e.key === null) { apply(read()); label(btn, read()); } });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire); else wire();
})();
