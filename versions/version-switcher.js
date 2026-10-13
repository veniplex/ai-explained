/* AI explained: the version dropdown. Every version loads this script (after versions.js) and gets a button in
   the header that lists all versions, marks the newest as current and the one you are on, and switches to another.
   Only the first <script> of this kind runs; it adds nothing else to the page than the button, its list and
   version-switcher.css. The main version (the first entry of versions.js, flagged main) is the site at the root of the repository; every other version is a
   folder in versions/, next to this script. Plain ES5, no frameworks. */
(function () {
  "use strict";

  var DATA = typeof window !== "undefined" ? window.AE_VERSIONS : null;

  // Where to go when switching from the version you are on to another one, as a path from the folder of this script (versions/). A page of the same kind
  // carries over when both versions have it: a term or guide page (pages: terms/<id>/, guides/<id>/), a glossary or guide page (sections: glossary/<id>/,
  // guides/<id>/) or a chapter link (guided: #ch-3); otherwise you land on the start page of the other version.
  //   list: AE_VERSIONS.list; fromId: the version you are on; rest: the path inside it ("terms/skills/" or ""); hash: "#ch-3" or "".
  function target(list, fromId, rest, hash, toId) {
    var from = find(list, fromId), to = find(list, toId), path = home(to);
    if (!to) return "./";
    if (from && from.pages && to.pages && /^(terms|guides)\/[a-z0-9-]+\/$/.test(rest)) path += rest;
    else if (from && from.sections && to.sections && /^(glossary|guides)\/[a-z0-9-]+\/$/.test(rest)) path += rest;
    else if (from && from.guided && to.guided && /^#(ch-[1-9e]|map)$/.test(hash)) path += hash;
    return path;
  }
  // A pre-release has a stage in its name (v0.17-alpha); a release does not (v1.0).
  function isPre(id) { return /-[a-z]+$/.test(id || ""); }
  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  // The start page of a version, from the folder of this script: the main version is the site root, one level up.
  function home(v) { return v ? (v.main ? "../" : v.id + "/") : "./"; }
  // "v0.6-alpha" -> "v6", for the narrow header; "v1.0" stays as it is.
  function short(id) { return id.replace(/-.*$/, ""); }
  // Which version a page belongs to, from the path of the page and the path of the site root ("/ai-explained/"): { id, rest } (rest: the path inside the version).
  function where(list, pathname, siteRoot) {
    var inside = pathname.indexOf(siteRoot) === 0 ? pathname.slice(siteRoot.length) : pathname.replace(/^\//, "");
    var m = inside.match(/^versions\/([^/]+)\/(.*)$/);
    if (m) return { id: m[1], rest: m[2].replace(/index\.html$/, "") };
    var main = list.filter(function (v) { return v.main; })[0];
    return { id: main ? main.id : "", rest: inside.replace(/index\.html$/, "") };
  }

  if (typeof module !== "undefined" && module.exports) module.exports = { target: target, short: short, where: where, isPre: isPre };
  if (!DATA || !DATA.list || !DATA.list.length || typeof document === "undefined") return;

  var script = document.currentScript, base = script && script.src ? script.src.replace(/[^/]*$/, "") : new URL("./", location.href).href;
  var list = DATA.list, latest = list[0].id;
  var siteRoot = new URL("../", base).pathname, at = where(list, location.pathname, siteRoot), here = at.id, rest = at.rest;
  // A page can offer a place of its own for the button (v16 puts it at the foot of its menu); every other page gets it in the actions of the header.
  var host = document.querySelector("[data-version-slot]") || document.querySelector(".bar-actions");
  if (!host) return;

  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = base + "version-switcher.css";
  document.head.appendChild(link);

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  var NS = "http://www.w3.org/2000/svg";
  function chevron() {
    var s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("fill", "none");
    s.setAttribute("stroke", "currentColor");
    s.setAttribute("stroke-width", "2");
    s.setAttribute("stroke-linecap", "round");
    s.setAttribute("stroke-linejoin", "round");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("class", "vs-chevron");
    var p = document.createElementNS(NS, "path");
    p.setAttribute("d", "M6 9.5l6 6 6-6");
    s.appendChild(p);
    return s;
  }

  var wrap = el("div", "vs"), btn = el("button", "btn btn-ghost vs-btn"), menu = el("ul", "vs-menu");
  btn.type = "button";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", "vs-menu");
  btn.setAttribute("aria-label", "Version: " + (here || "choose") + (here && here !== latest ? " (an older version)" : ""));
  menu.id = "vs-menu";
  menu.hidden = true;
  if (here && here !== latest) { btn.className += " is-old"; btn.setAttribute("title", "A newer version is available"); }
  var label = el("span", "vs-label");
  label.appendChild(el("span", "vs-full", here || "Versions"));
  label.appendChild(el("span", "vs-short", here ? short(here) : "Versions"));
  btn.appendChild(label);
  btn.appendChild(chevron());

  menu.appendChild(el("li", "vs-head", "Versions"));
  function entry(v) {
    var li = el("li"), a = el("a", "vs-item" + (v.id === here ? " is-here" : ""));
    a.setAttribute("data-v", v.id);
    a.href = new URL(target(list, here, rest, location.hash, v.id), base).href;
    if (v.id === here) a.setAttribute("aria-current", "page");
    var top = el("span", "vs-top");
    top.appendChild(el("b", "vs-name", v.id));
    if (v.id === latest) top.appendChild(el("span", "vs-tag", "Current"));
    a.appendChild(top);
    a.appendChild(el("span", "vs-note", v.note));
    li.appendChild(a);
    return li;
  }
  // The releases are listed; the alpha versions (and any other pre-release) are folded into one group that is closed until it is opened, or until you are on one of them.
  var releases = list.filter(function (v) { return !isPre(v.id); }), pre = list.filter(function (v) { return isPre(v.id); });
  releases.forEach(function (v) { menu.appendChild(entry(v)); });
  if (pre.length) {
    var group = el("li", "vs-group"), gbtn = el("button", "vs-group-btn"), gsub = el("ul", "vs-sub");
    gbtn.type = "button";
    gbtn.setAttribute("aria-controls", "vs-alpha");
    gbtn.appendChild(el("span", "vs-group-name", "Alpha versions"));
    gbtn.appendChild(el("span", "vs-group-count", String(pre.length)));
    gbtn.appendChild(chevron());
    gsub.id = "vs-alpha";
    pre.forEach(function (v) { gsub.appendChild(entry(v)); });
    function fold(open) {
      gbtn.setAttribute("aria-expanded", open ? "true" : "false");
      gsub.hidden = !open;
      group.classList.toggle("is-open", open);
    }
    fold(isPre(here));
    gbtn.addEventListener("click", function (e) { e.stopPropagation(); fold(gsub.hidden); });
    group.appendChild(gbtn);
    group.appendChild(gsub);
    menu.appendChild(group);
  }
  wrap.appendChild(btn);
  wrap.appendChild(menu);
  host.insertBefore(wrap, host.firstChild);

  // What the arrow keys visit: the entries that can be seen (those of a closed group cannot) and the button of the group.
  function items() { return Array.prototype.slice.call(menu.querySelectorAll("a, .vs-group-btn")).filter(function (n) { return !n.closest(".vs-sub[hidden]"); }); }
  function links() { return Array.prototype.slice.call(menu.querySelectorAll("a")); }
  // The links follow the page: a chapter or a card opened since the page loaded is carried over too. A list that would run off the
  // right edge of the window hangs from the right edge of its button instead.
  function open() {
    links().forEach(function (a) { a.href = new URL(target(list, here, rest, location.hash, a.getAttribute("data-v")), base).href; });
    menu.hidden = false;
    wrap.classList.toggle("is-right", btn.getBoundingClientRect().left + Math.min(320, window.innerWidth - 32) > window.innerWidth - 8);
    btn.setAttribute("aria-expanded", "true");
    // Let the browser lay the list out first, so it can fade in.
    requestAnimationFrame(function () { wrap.classList.add("is-open"); });
  }
  function close(refocus) {
    if (menu.hidden) return;
    wrap.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(function () { if (!wrap.classList.contains("is-open")) menu.hidden = true; }, reduced ? 0 : 160);
    if (refocus) btn.focus();
  }
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (menu.hidden || !wrap.classList.contains("is-open")) open(); else close(false);
  });
  document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) close(false); });
  wrap.addEventListener("keydown", function (e) {
    var k = e.key, list2 = items(), i = list2.indexOf(document.activeElement);
    if (k === "Escape") { if (!menu.hidden) { close(true); e.stopPropagation(); } return; }
    if (k !== "ArrowDown" && k !== "ArrowUp") return;
    e.preventDefault();
    if (menu.hidden) { open(); }
    var n = k === "ArrowDown" ? (i + 1) % list2.length : (i <= 0 ? list2.length - 1 : i - 1);
    setTimeout(function () { list2[n].focus(); }, menu.hidden ? 30 : 0);
  });
  wrap.addEventListener("focusout", function (e) { if (e.relatedTarget && !wrap.contains(e.relatedTarget)) close(false); });
})();
