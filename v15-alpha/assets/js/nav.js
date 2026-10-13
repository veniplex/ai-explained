/* AI explained (v15): the menu. The menu (a <details> in the top bar, so it opens without this script) closes with Esc, with a click elsewhere and when focus
   leaves it, and the arrow keys move between its links. Plain ES5. */
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
    // Opening the menu closes the list of search hits, and the other way round.
    menu.addEventListener("toggle", function () {
      var list = document.getElementById("search-results");
      if (menu.open && list) list.hidden = true;
    });
    // The arrow keys move between the links, as in the version dropdown.
    menu.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      var links = Array.prototype.slice.call(menu.querySelectorAll("a")), i = links.indexOf(document.activeElement);
      if (!menu.open) return;
      e.preventDefault();
      var n = e.key === "ArrowDown" ? (i + 1) % links.length : (i <= 0 ? links.length - 1 : i - 1);
      links[n].focus();
    });
  }
})();
