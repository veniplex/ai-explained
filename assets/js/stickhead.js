/* AI explained: the heading you are in stays in view. On the long pages (a guide, a glossary term, the about page) the heading of the part you are reading sticks
   just under the top bar once it would scroll out, and the heading of the next part takes its place when that part reaches the top. In the deep dive the same job
   is done by a slim bar with the chapter's number and title (.ch-stick, drawn by story.js). The sticking itself is CSS (position: sticky); this script only marks
   the heading that is pinned right now (.is-stuck: a thin rule and a soft shadow under it), shows the chapter bar when the chapter's own title has scrolled out, and
   tells the page how tall a pinned heading is (--stick-h) so a jump to a source or a note lands below it. Plain ES5. */
(function () {
  "use strict";

  var HEADS = ".gd-section > h2, .gd-section-plain > h2, .bd > .bd-section > h2, .about > div > h2";
  var queued = false;

  function line() {
    var bar = document.querySelector(".bar");
    return bar ? bar.getBoundingClientRect().bottom : 0;
  }

  function update() {
    queued = false;
    var y = line(), tallest = 0, i, list, el, r;
    list = document.querySelectorAll(HEADS);
    for (i = 0; i < list.length; i++) {
      el = list[i];
      r = el.getBoundingClientRect();
      var pinned = Math.abs(r.top - (parseFloat(getComputedStyle(el).top) || y)) < 1 && r.height > 0;
      if (pinned !== el.classList.contains("is-stuck")) el.classList.toggle("is-stuck", pinned);
      if (r.height > tallest) tallest = r.height;
    }
    list = document.querySelectorAll(".chapter > .ch-stick");
    for (i = 0; i < list.length; i++) {
      el = list[i];
      var title = el.parentNode.querySelector(".ch-title");
      var on = !!title && title.getBoundingClientRect().bottom <= (parseFloat(getComputedStyle(el).top) || y) + 2;
      if (on !== el.classList.contains("is-on")) el.classList.toggle("is-on", on);
    }
    if (!tallest && document.querySelector(".ch-stick")) tallest = document.querySelector(".ch-stick").offsetHeight; // the deep dive: the slim chapter bar
    var h = Math.ceil(tallest || 0);
    if (h !== update.h) { update.h = h; if (h) document.documentElement.style.setProperty("--stick-h", h + "px"); }
  }

  function queue() { if (!queued) { queued = true; requestAnimationFrame(update); } }

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  window.addEventListener("load", queue);
  document.addEventListener("DOMContentLoaded", queue);
  // the pages draw their content after the scripts have run: look again when the page changes
  if (window.MutationObserver) {
    var mo = new MutationObserver(queue);
    document.addEventListener("DOMContentLoaded", function () { mo.observe(document.body, { childList: true, subtree: true }); });
  }
})();
