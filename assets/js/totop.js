/* AI explained: the button that takes you back to the top of a long page. It sits at the bottom right corner and shows once the page is at least two
   windows high and you have scrolled down by most of a window. A page that fits one screen or two (the story, a short page) never shows it. Reduced motion: it
   jumps instead of gliding. Focus goes to the page's main heading, so a screen reader starts at the top too. Plain ES5. */
(function () {
  "use strict";

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "to-top";
  btn.hidden = true;
  btn.setAttribute("aria-label", "Back to the top");
  btn.setAttribute("title", "Back to the top");
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg>';
  var shown = false, queued = false;

  function reduced() { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function update() {
    queued = false;
    var doc = document.documentElement, top = window.pageYOffset || doc.scrollTop || 0, vh = window.innerHeight || doc.clientHeight;
    // Long enough to need it (the page is at least two windows high), and far enough down to want it.
    var on = doc.scrollHeight > vh * 2 && top > vh * 0.8;
    if (on === shown) return;
    shown = on;
    if (on) { btn.hidden = false; requestAnimationFrame(function () { btn.classList.add("is-on"); }); }
    else {
      btn.classList.remove("is-on");
      setTimeout(function () { if (!shown) btn.hidden = true; }, reduced() ? 0 : 200);
    }
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" });
    var h1 = document.querySelector("main h1, h1");
    if (h1) { h1.setAttribute("tabindex", "-1"); try { h1.focus({ preventScroll: true }); } catch (e) {} }
    if (history.replaceState && location.hash) { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
  });

  function init() {
    document.body.appendChild(btn);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
    // The pages draw themselves after loading, so they grow: look again.
    setTimeout(update, 600);
    setTimeout(update, 2000);
  }
  if (document.body) init(); else document.addEventListener("DOMContentLoaded", init);
})();
