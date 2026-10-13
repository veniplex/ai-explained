/* AI explained (v14): the hover card. Any link to a term (data-entry="<id>": a chip, a word in the text, a block of the map, a bold word of the
   story) shows a short explanation when the mouse rests on it or the keyboard focuses it, with a link to the full page. The words come
   from data/glance-<way>.js (written by scripts/build-v14-pages.js): in the technical deep dive the technical sentence, everywhere else the kitchen
   sentence. The link of the card is the link you are on, so a click or Enter on the term goes to the same page; the card only adds the words
   first. Touch screens get no card (a tap simply opens the page). Esc, a scroll or leaving closes it. Plain ES5, no frameworks. */
(function () {
  "use strict";

  var G = window.AE_GLANCE;
  if (!G || !document.body) return;
  var PATH = document.body.getAttribute("data-path") || "kitchen", TECH = PATH === "technical";
  var card = null, current = null, showTimer = 0, hideTimer = 0, keyboard = false;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }
  function triggerOf(node) {
    var a = node && node.closest ? node.closest("a[data-entry]") : null;
    if (!a || a.hasAttribute("data-nopop") || a.closest(".pop, .search-results") || !G[a.getAttribute("data-entry")]) return null;
    return a;
  }

  function build() {
    card = el("div", "pop");
    card.id = "pop";
    card.setAttribute("role", "tooltip");
    card.hidden = true;
    card.appendChild(el("p", "pop-eyebrow"));
    card.appendChild(el("p", "pop-title"));
    card.appendChild(el("p", "pop-text"));
    var more = el("a", "pop-link", "Open the full page");
    more.tabIndex = -1;
    more.appendChild(el("span", "", " →"));
    more.lastChild.setAttribute("aria-hidden", "true");
    card.appendChild(more);
    card.addEventListener("pointerenter", function () { clearTimeout(hideTimer); });
    card.addEventListener("pointerleave", function () { later(hide, 160); });
    document.body.appendChild(card);
  }
  function later(fn, ms) { clearTimeout(hideTimer); hideTimer = setTimeout(fn, ms); }

  function place(a, ev) {
    var rects = a.getClientRects(), r = rects[0] || a.getBoundingClientRect(), i;
    if (ev && ev.clientX !== undefined) {
      for (i = 0; i < rects.length; i++) if (ev.clientY >= rects[i].top - 2 && ev.clientY <= rects[i].bottom + 2 && ev.clientX >= rects[i].left - 2 && ev.clientX <= rects[i].right + 2) { r = rects[i]; break; }
    }
    var vw = document.documentElement.clientWidth, vh = window.innerHeight, w = card.offsetWidth, h = card.offsetHeight;
    var left = Math.max(8, Math.min(r.left, vw - w - 8)), top = r.bottom + 8;
    if (top + h > vh - 8 && r.top - h - 8 >= 8) top = r.top - h - 8;
    card.style.left = Math.round(left) + "px";
    card.style.top = Math.max(8, Math.round(top)) + "px";
  }

  function show(a, ev) {
    var id = a.getAttribute("data-entry"), g = G[id];
    if (!card) build();
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    if (current && current !== a) current.removeAttribute("aria-describedby");
    current = a;
    var ch = g.c === 8 ? "Epilogue" : "Chapter " + g.c;
    card.setAttribute("data-zone", g.z);
    // A term of the story names its chapter; a term only the glossary has names its group.
    card.firstChild.textContent = g.x ? "Glossary · " + g.g : (TECH ? "Term · " : "Real name · ") + ch;
    card.childNodes[1].textContent = g.n;
    card.childNodes[2].textContent = TECH ? g.t : g.k;
    card.childNodes[3].setAttribute("href", a.getAttribute("href"));
    card.hidden = false;
    place(a, ev);
    card.classList.add("is-on");
    a.setAttribute("aria-describedby", "pop");
  }
  function hide() {
    clearTimeout(showTimer);
    if (!card || card.hidden) { current = null; return; }
    card.classList.remove("is-on");
    card.hidden = true;
    if (current) current.removeAttribute("aria-describedby");
    current = null;
  }

  document.addEventListener("pointerover", function (e) {
    if (e.pointerType === "touch") return;
    var a = triggerOf(e.target);
    if (!a) return;
    if (a === current && card && !card.hidden) { clearTimeout(hideTimer); return; }
    clearTimeout(hideTimer);
    clearTimeout(showTimer);
    showTimer = setTimeout(function () { show(a, e); }, card && !card.hidden ? 60 : 260);
  });
  document.addEventListener("pointerout", function (e) {
    if (e.pointerType === "touch") return;
    var a = triggerOf(e.target);
    if (!a || (e.relatedTarget && (a.contains(e.relatedTarget) || (card && card.contains(e.relatedTarget))))) return;
    clearTimeout(showTimer);
    later(hide, 160);
  });
  document.addEventListener("keydown", function (e) {
    keyboard = true;
    if (e.key === "Escape" && card && !card.hidden) { hide(); e.stopPropagation(); }
  }, true);
  document.addEventListener("pointerdown", function (e) { keyboard = false; if (!(card && card.contains(e.target))) hide(); }, true);
  document.addEventListener("focusin", function (e) {
    var a = triggerOf(e.target);
    if (a && keyboard) show(a);
  });
  document.addEventListener("focusout", function (e) { if (triggerOf(e.target)) hide(); });
  // Focusing a link scrolls it into view: keep the card with it. Any other scroll closes it.
  window.addEventListener("scroll", function () {
    if (current && card && !card.hidden && document.activeElement === current) place(current);
    else hide();
  }, { passive: true, capture: true });
  window.addEventListener("resize", hide);
})();
