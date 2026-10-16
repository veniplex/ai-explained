/* AI explained: the move from one page to the next. The animation itself is CSS (nav.css: @view-transition); this script only gives the top bar a view-transition-name
   for the length of a move, so the bar stays put while the page under it changes. The name is not set at other times: a named element is a containing block
   for fixed children (the menu on a phone, for one). Needs pageswap and pagereveal (Chrome and Edge 124 and up); other browsers just navigate.
   Plain ES5. */
(function () {
  "use strict";
  if (!("onpagereveal" in window)) return;

  var NAME = "site-bar";
  function bar() { return document.querySelector("header.bar"); }
  function name(on) { var b = bar(); if (b) b.style.viewTransitionName = on ? NAME : ""; }

  // The old page: before its picture is taken.
  window.addEventListener("pageswap", function (e) { if (e.viewTransition) name(true); });
  // The new page: before its first paint (the bar is in the head's render-blocking wait, so it exists by now).
  window.addEventListener("pagereveal", function (e) {
    var t = e.viewTransition;
    if (!t) return;
    name(true);
    var off = function () { name(false); };
    t.finished.then(off, off);
  });
})();
