/* AI explained (v16): the GitHub button in the top bar, with the number of stars. The only request this site makes to anyone else: one GET to the public GitHub
   API (api.github.com) for the star count of this repository, with no cookies and nothing sent but the request itself. The number is kept for ten minutes in
   this tab (sessionStorage), so moving between pages does not ask again; if the request fails (offline, blocked, rate limit), the count stays hidden and the
   button is still a link. Plain ES5. */
(function () {
  "use strict";

  var API = "https://api.github.com/repos/veniplex/ai-explained", KEY = "ae-stars", TTL = 10 * 60 * 1000;
  var pill = document.getElementById("gh-pill"), box = document.getElementById("gh-stars"), out = document.getElementById("gh-count");
  if (!pill || !box || !out) return;

  // 950 -> "950", 1234 -> "1.2k", 12500 -> "12.5k", 1200000 -> "1.2M".
  function short(n) {
    if (n < 1000) return String(n);
    var v = n < 1e6 ? n / 1e3 : n / 1e6, s = (v < 10 ? v.toFixed(1) : String(Math.round(v * 10) / 10)).replace(/\.0$/, "");
    return s + (n < 1e6 ? "k" : "M");
  }
  function show(n) {
    out.textContent = short(n);
    box.hidden = false;
    pill.setAttribute("aria-label", "AI explained on GitHub, " + n + (n === 1 ? " star" : " stars"));
  }
  var cached = null;
  try { cached = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (e) { cached = null; }
  if (cached && typeof cached.n === "number") show(cached.n);
  if (cached && Date.now() - cached.t < TTL) return;
  if (!window.fetch) return;
  fetch(API, { headers: { Accept: "application/vnd.github+json" }, credentials: "omit", referrerPolicy: "no-referrer" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      if (!j || typeof j.stargazers_count !== "number") return;
      show(j.stargazers_count);
      try { sessionStorage.setItem(KEY, JSON.stringify({ n: j.stargazers_count, t: Date.now() })); } catch (e) {}
    })
    .catch(function () {});
})();
