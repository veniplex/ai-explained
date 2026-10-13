/* AI explained (v14): the menu and the memory of the way read last. The menu (a <details> in the top bar, so it opens without this script) closes with Esc,
   with a click elsewhere and when focus leaves it. On the start page, the links of the menu that belong to a way (guides, glossary, about) are pointed at the
   way the visitor was last in (kitchen or technical); inside kitchen/, technical/ and story/ they are already right. Without this script, or without storage,
   they lead to the kitchen. The one thing stored is `ae14-path`, in the visitor's own browser. Plain ES5. */
(function () {
  "use strict";

  var path = document.body.getAttribute("data-path"), saved = null;
  try { saved = localStorage.getItem("ae14-path"); } catch (e) { /* private mode */ }
  if (path === "kitchen" || path === "technical") {
    try { localStorage.setItem("ae14-path", path); } catch (e) { /* private mode */ }
  } else if (saved === "technical") {
    Array.prototype.forEach.call(document.querySelectorAll("a[data-follow]"), function (a) {
      a.setAttribute("href", a.getAttribute("href").replace("kitchen/", "technical/"));
    });
  }

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
