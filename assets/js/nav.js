/* AI explained: the menu. The menu (a <details> in the top bar, so it opens without this script) closes with Esc, with a click elsewhere and when focus
   leaves it, and the arrow keys move between its links (the version button at its foot included). On a phone the version button is in the foot of the menu: the
   tab it hangs in under the bar would cover the page there. Plain ES5. */
(function () {
  "use strict";

  var menu = document.getElementById("site-menu");
  if (menu) {
    var btn = menu.querySelector("summary");
    menu.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.open) { menu.open = false; btn.focus(); e.stopPropagation(); }
    });
    document.addEventListener("pointerdown", function (e) { if (menu.open && !menu.contains(e.target)) menu.open = false; });
    menu.addEventListener("focusout", function (e) { if (menu.open && e.relatedTarget && !menu.contains(e.relatedTarget)) menu.open = false; });
    // The version list opens in place at the foot of the panel: bring it into view, or a short window would show only its first line.
    menu.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest(".menu-foot .vs-btn") : null;
      if (!b) return;
      setTimeout(function () { var list = menu.querySelector(".menu-foot .vs-menu"); if (list && !list.hidden && list.scrollIntoView) list.scrollIntoView({ block: "nearest" }); }, 30);
    }, true); // in the capture phase: the version button stops the click from going further
    // The arrow keys move between the links, as in the version dropdown.
    menu.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      if (e.target.closest && e.target.closest(".vs")) return; // the version list has its own arrow keys
      var links = Array.prototype.slice.call(menu.querySelectorAll("a, .vs-btn")).filter(function (x) { return x.offsetParent !== null; }), i = links.indexOf(document.activeElement);
      if (!menu.open) return;
      e.preventDefault();
      var n = e.key === "ArrowDown" ? (i + 1) % links.length : (i <= 0 ? links.length - 1 : i - 1);
      links[n].focus();
    });
  }

  // The version button (made by version-switcher.js, which runs before the page has finished loading) hangs in the tab under the bar, and sits in the foot of the
  // menu on a phone.
  var tab = document.querySelector(".version-tab"), foot = document.querySelector("[data-version-menu]"), narrow = window.matchMedia ? window.matchMedia("(max-width: 760px), (max-height: 520px)") : null;
  function place() {
    var vs = document.querySelector(".vs");
    if (!vs || !tab || !foot || !narrow) return;
    var home = narrow.matches ? foot : tab;
    if (vs.parentNode !== home) home.appendChild(vs);
  }
  if (narrow) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", place); else place();
    if (narrow.addEventListener) narrow.addEventListener("change", place); else if (narrow.addListener) narrow.addListener(place);
  }
})();
