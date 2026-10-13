/* AI explained: turns the site into an app that can be installed. It registers the service worker of this folder (sw.js, which keeps the files and the pages
   seen so the site also opens without a network) and offers the browser's own install prompt where the page has a button for it ([data-install], on the about
   page). Nothing is sent anywhere; without service workers (an old browser, a page opened from a file) the site is the same site, only without the offline copy.
   Plain ES5. */
(function () {
  "use strict";

  var script = document.currentScript, here = script && script.src ? script.src : "";
  var secure = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";

  if ("serviceWorker" in navigator && secure && here) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register(new URL("../../sw.js", here).href).catch(function () {});
    });
  }

  // The install prompt: kept until a button asks for it.
  var deferred = null;
  function buttons() { return Array.prototype.slice.call(document.querySelectorAll("[data-install]")); }
  function show(on) { buttons().forEach(function (b) { b.hidden = !on; }); }
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferred = e;
    show(true);
  });
  window.addEventListener("appinstalled", function () { deferred = null; show(false); });
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("[data-install]") : null;
    if (!b || !deferred) return;
    var p = deferred;
    deferred = null;
    show(false);
    p.prompt();
  });
  // Already running as an app: nothing to offer.
  var standalone = window.matchMedia && window.matchMedia("(display-mode: standalone)").matches;
  if (standalone) document.documentElement.setAttribute("data-app", "");
})();
