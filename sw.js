/* AI explained: the service worker. It makes the site an app that can be installed and that keeps working without a network. It sits at the root of the site,
   so its scope is the whole site; it leaves everything inside versions/ (the older versions, which have workers of their own) alone, except the three files of the
   version dropdown. What it does:
     - on install it keeps the files every page needs (styles, scripts, fonts, the data, icons) and the main pages in one cache that has the build's name;
     - on activation it deletes the caches of earlier builds;
     - a page is fetched from the network first, so a visit always shows the current text, and the copy in the cache is used when there is no network (a page seen
       once is kept; with nothing for the page, the start page opens instead);
     - a file of the site comes from the cache first (it cannot differ from the build that wrote it); the files of the version dropdown (versions/versions.js and the
       script and style next to it) come from the cache while a fresh copy is fetched behind them.
   It makes no request to anywhere but this site (the star count of the GitHub button is not touched). The block between the two markers is written by
   node scripts/build-pages.js from the files of the site, so the cache name changes whenever a file does; do not edit it by hand. */
"use strict";

/* build:start */
const PREFIX = "ae-v1.0-";
const BUILD = PREFIX + "bc8c30ed00";
const PRECACHE = [
  "./",
  "story/",
  "technical/",
  "glossary/",
  "guides/",
  "about/",
  "guides/build/",
  "guides/compare/",
  "guides/context/",
  "guides/evaluate/",
  "guides/how-it-works/",
  "guides/learn/",
  "guides/secure/",
  "manifest.webmanifest",
  "assets/css/kitchen.css",
  "assets/css/nav.css",
  "assets/css/pages.css",
  "assets/css/places.css",
  "assets/css/start.css",
  "assets/css/style.css",
  "assets/fonts/dm-mono-400-latin.woff2",
  "assets/fonts/dm-mono-500-latin.woff2",
  "assets/fonts/dm-sans-latin-ext.woff2",
  "assets/fonts/dm-sans-latin.woff2",
  "assets/fonts/source-serif-4-italic-latin.woff2",
  "assets/fonts/source-serif-4-latin-ext.woff2",
  "assets/fonts/source-serif-4-latin.woff2",
  "assets/icons/apple-touch-icon.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
  "assets/icons/icon-maskable-512.png",
  "assets/js/app.js",
  "assets/js/data/bridges.js",
  "assets/js/data/core.js",
  "assets/js/data/entries.js",
  "assets/js/data/glance.js",
  "assets/js/data/glossary-refs.js",
  "assets/js/data/glossary.js",
  "assets/js/data/guides.js",
  "assets/js/data/kitchen.js",
  "assets/js/data/names.js",
  "assets/js/data/props-extra-a.js",
  "assets/js/data/props-extra-b.js",
  "assets/js/data/props-extra-c.js",
  "assets/js/data/props-kitchen.js",
  "assets/js/data/search-index.js",
  "assets/js/data/sources.js",
  "assets/js/data/story.js",
  "assets/js/data/voice-glossary-kitchen.js",
  "assets/js/data/voice-guides-long-tech-a.js",
  "assets/js/data/voice-guides-long-tech-b.js",
  "assets/js/data/voice-guides-long-tech-c.js",
  "assets/js/data/voice-guides-long-tech-d.js",
  "assets/js/data/voice-tech.js",
  "assets/js/data/voice-ui-tech.js",
  "assets/js/draw.js",
  "assets/js/github.js",
  "assets/js/guide-views.js",
  "assets/js/icons.js",
  "assets/js/kitchen.js",
  "assets/js/locator.js",
  "assets/js/map.js",
  "assets/js/nav.js",
  "assets/js/pages.js",
  "assets/js/popover.js",
  "assets/js/props.js",
  "assets/js/pwa.js",
  "assets/js/search.js",
  "assets/js/sketch.js",
  "assets/js/start.js",
  "assets/js/stickhead.js",
  "assets/js/story.js",
  "assets/js/terms.js",
  "assets/js/theme.js",
  "assets/js/totop.js",
  "assets/js/voice.js",
  "assets/vendor/rough.js",
  "versions/versions.js",
  "versions/version-switcher.js",
  "versions/version-switcher.css",
  "versions/favicon.svg"
];
/* build:end */

const SCOPE = new URL("./", self.location.href).pathname;
const SHARED = ["versions/versions.js", "versions/version-switcher.js", "versions/version-switcher.css", "versions/favicon.svg"].map((f) => new URL(f, self.location.href).pathname);
const OLDER = new URL("versions/", self.location.href).pathname;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(BUILD).then((cache) =>
      // One file that cannot be fetched does not stop the others; the page then fetches it when it needs it.
      Promise.all(PRECACHE.map((url) => cache.add(new Request(url, { cache: "reload" })).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== BUILD).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function keep(request, response) {
  if (response && response.ok && response.type === "basic") {
    const copy = response.clone();
    caches.open(BUILD).then((cache) => cache.put(request, copy)).catch(() => null);
  }
  return response;
}

// A page: the network first, the cache when there is none, and a way to the start page when the cache has nothing either (the start page itself is not
// served under another address: its styles and scripts are found by relative paths, so it would show unstyled).
function page(request) {
  return fetch(request).then((response) => keep(request, response)).catch(() =>
    caches.match(request, { ignoreSearch: true }).then((hit) => hit || caches.match(SCOPE, { ignoreSearch: true }).then((home) => (home ? Response.redirect(SCOPE, 302) : Response.error())))
  );
}
// A file of the site: the cache first.
function file(request) {
  return caches.match(request).then((hit) => hit || fetch(request).then((response) => keep(request, response)));
}
// A file of the version dropdown, shared by every version: the cache, and a fresh copy fetched for the next time.
function shared(request) {
  return caches.match(request).then((hit) => {
    const fresh = fetch(request).then((response) => keep(request, response)).catch(() => hit);
    return hit || fresh;
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  // The older versions are not part of this app: their pages and files come straight from the network (or from their own worker).
  if (url.pathname.startsWith(OLDER) && !SHARED.includes(url.pathname)) return;
  if (request.mode === "navigate" || (request.headers.get("accept") || "").includes("text/html")) {
    if (url.pathname.startsWith(SCOPE)) event.respondWith(page(request));
    return;
  }
  if (SHARED.includes(url.pathname)) event.respondWith(shared(request));
  else if (url.pathname.startsWith(SCOPE)) event.respondWith(file(request));
});
