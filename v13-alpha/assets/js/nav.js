/* Agentic AI, Explained (v13): remembers which way of reading the visitor was last in (kitchen or technical) and points the two links of the top bar
   that belong to a way (Guides, References) at it on the pages that have none, the start page above all. Inside kitchen/, technical/ and
   story/ the links are already right. It also scrolls the row of sections on a phone to the one the page is in. Without this script, or without storage, they lead to the kitchen. The one thing stored is
   `ae13-path`, in the visitor's own browser. Plain ES5. */
(function () {
  "use strict";

  var path = document.body.getAttribute("data-path"), saved = null;
  try { saved = localStorage.getItem("ae13-path"); } catch (e) { /* private mode */ }
  if (path === "kitchen" || path === "technical") {
    try { localStorage.setItem("ae13-path", path); } catch (e) { /* private mode */ }
  } else if (saved === "technical") {
    Array.prototype.forEach.call(document.querySelectorAll("a[data-follow]"), function (a) {
      a.setAttribute("href", a.getAttribute("href").replace("kitchen/", "technical/"));
    });
  }

  // On a narrow screen the row of sections scrolls sideways: bring the one you are in into view.
  var row = document.querySelector(".sections"), cur = row && row.querySelector("a[aria-current]");
  function reveal() { if (cur && row.scrollWidth > row.clientWidth) row.scrollLeft = cur.offsetLeft - (row.clientWidth - cur.offsetWidth) / 2; }
  reveal();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(reveal);
})();
