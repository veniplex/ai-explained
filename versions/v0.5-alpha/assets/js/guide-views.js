/* Agentic AI, Explained (v5): the five guides. Each renderer returns the content of a guide page (pages.js adds the heading).
   Adapted from v0.1-alpha's guide renderers; blocks are now entries. Where a guide has a text in both voices, the two
   stand side by side (kitchen on the left, technical on the right). */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3.sk, D = window.AE3, G = D.guides, voice = V3.voice, K = voice.kitchen, T = voice.tech;
  var h = sk.h, s = sk.s, rich = sk.rich, $$ = sk.$$, clear = sk.clear;
  var ZONE = {};
  D.chapters.forEach(function (c) { c.entries.forEach(function (id) { ZONE[id] = c.zone; }); });

  function chip(id, label) {
    var e = D.entries[id];
    if (!e) return null;
    return h("a", { class: "chip", href: sk.url.entry(id), "data-entry": id, "data-zone": ZONE[id] }, label || e.label || e.name);
  }
  function chips(ids) { return ids && ids.length ? h("div", { class: "chips" }, ids.map(function (id) { return chip(id); })) : null; }
  // The note under a guide: one per voice that has one.
  function note(id) {
    var notes = [K, T].map(function (v) { return { v: v, text: v.guide(id).note }; }).filter(function (n) { return n.text; });
    return notes.length ? h("div", { class: "page-notes" }, notes.map(function (n) { return h("p", { class: "page-note" }, rich(n.text)); })) : null;
  }
  function iconSvg(svgText) { var sp = document.createElement("span"); sp.innerHTML = svgText; return sp.firstChild; }

  var TYPE_LABEL = { definition: "Explainer", docs: "Docs", guide: "Guide", paper: "Paper", spec: "Spec", video: "Video", course: "Course", blog: "Essay", tool: "Tool", law: "Law", standard: "Standard", book: "Book" };
  function linkList(links) {
    return h("ul", { class: "links" }, links.map(function (l) {
      var m = [l.by, l.year].filter(Boolean).join(" · ");
      return h("li", null,
        h("span", { class: "badge link-type" + (l.type ? " link-type-" + l.type : "") }, TYPE_LABEL[l.type] || l.type || "Link"),
        h("a", { href: l.url, target: "_blank", rel: "noopener" }, l.title),
        h("span", { class: "link-meta" }, m + (l.note ? (m ? " · " : "") + l.note : "")));
    }));
  }

  /* ---------- Easily confused ---------- */
  // One card per concept: the kitchen picture and what sets it apart on the left, the technical columns on the right.
  function renderCompare() {
    var c = G.compare, rows = D.kitchen.compare.rows;
    return h("div", null,
      h("div", { class: "cmp-cards" }, c.rows.map(function (r) {
        var k = rows[r.name];
        var facts = h("dl", { class: "cmp-facts" }, r.cells.map(function (cell, i) {
          var value;
          if (i === c.detCol) {
            var cls = /^yes/i.test(cell) ? "yes" : /^no/i.test(cell) ? "no" : "part";
            value = h("span", { class: "tag tag-" + cls }, cell);
          } else value = rich(cell);
          return h("div", null, h("dt", { class: "eyebrow" }, c.columns[i + 1]), h("dd", null, value));
        }));
        return h("article", { class: "card cmp-card" },
          h("h3", { class: "cmp-name" }, chip(r.entry, r.name)),
          h("div", { class: "cmp-pair" },
            h("div", { class: "voice voice-kitchen" }, sk.voiceTag("kitchen"),
              h("p", { class: "cmp-pic" }, rich(k.pic)), h("p", { class: "cmp-tell" }, h("b", null, "What sets it apart: "), rich(k.tell))),
            h("div", { class: "voice voice-technical" }, sk.voiceTag("technical"), facts)));
      })),
      note("compare"));
  }

  /* ---------- Build your own ---------- */
  var KIND_FILL = { io: "paper", llm: "model", tool: "tools", gate: "control", human: "start", agent: "harness" };
  function pathPoints(d) {
    var pts = [], x = 0, y = 0, re = /([MLHV])\s*(-?[\d.]+)(?:[\s,]+(-?[\d.]+))?/g, m;
    while ((m = re.exec(d))) {
      if (m[1] === "M" || m[1] === "L") { x = +m[2]; y = +m[3]; }
      else if (m[1] === "H") x = +m[2];
      else y = +m[2];
      pts.push([x, y]);
    }
    return pts;
  }
  function patternSvg(p) {
    var g = p.svg, seed = p.id.length * 31;
    var svg = s("svg", { viewBox: "0 0 " + g.w + " " + g.h, role: "img", "aria-label": p.alt });
    var lay = s("g");
    (g.edges || []).forEach(function (e, i) {
      var pts = pathPoints(e.d), n = pts.length;
      sk.paint(lay, { t: "path", a: e.d, sw: 1.4, r: 0.5, bow: 0.4, dash: e.dashed ? "4 4" : null, single: !!e.dashed }, seed + i);
      sk.paint(lay, { t: "lin", a: sk.head(pts[n - 2][0], pts[n - 2][1], pts[n - 1][0], pts[n - 1][1], 7), sw: 1.4, r: 0.3 }, seed + 50 + i);
      if (e.both) sk.paint(lay, { t: "lin", a: sk.head(pts[1][0], pts[1][1], pts[0][0], pts[0][1], 7), sw: 1.4, r: 0.3 }, seed + 80 + i);
      if (e.l) lay.appendChild(s("text", { x: e.lx, y: e.ly, "text-anchor": e.la || "middle", class: "pd-elabel" }, e.l));
    });
    (g.labels || []).forEach(function (lb) { lay.appendChild(s("text", { x: lb.x, y: lb.y, "text-anchor": lb.a || "middle", class: "pd-elabel" }, lb.t)); });
    (g.nodes || []).forEach(function (nd, i) {
      var k = nd.k || "llm";
      if (k === "io") sk.paint(lay, { t: "ellipse", a: [nd.x + nd.w / 2, nd.y + nd.h / 2, nd.w, nd.h], fill: KIND_FILL[k], sw: 1.4, r: 0.6 }, seed + 120 + i);
      else sk.paint(lay, { t: "rect", a: [nd.x, nd.y, nd.w, nd.h], fill: KIND_FILL[k], sw: 1.4, r: 0.6, bow: 0.4 }, seed + 120 + i);
      var lines = nd.t.split("\n");
      lines.forEach(function (ln, j) {
        lay.appendChild(s("text", { x: nd.x + nd.w / 2, y: nd.y + nd.h / 2 + 4 + (j - (lines.length - 1) / 2) * 13, "text-anchor": "middle", class: "pd-text" }, ln));
      });
    });
    svg.appendChild(lay);
    return svg;
  }
  function meter(n) {
    return h("span", { class: "meter", role: "img", "aria-label": n + " of 5" }, [1, 2, 3, 4, 5].map(function (k) { return h("i", { class: k <= n ? "is-on" : null }); }));
  }
  function protocols() {
    var cols = ["Protocol", "Connects", "Origin", "Governance", "Status (" + D.meta.snapshot + ")"];
    return h("div", { class: "card table-scroll" }, h("table", { class: "proto" },
      h("thead", null, h("tr", null, cols.map(function (c) { return h("th", { scope: "col" }, c); }))),
      h("tbody", null, G.build.protocols.map(function (p, i) {
        var prev = G.build.protocols[i - 1];
        var grp = p.group && (!prev || prev.group !== p.group) ? h("tr", { class: "grp" }, h("th", { colspan: "5", scope: "colgroup" }, p.group)) : null;
        return [grp, h("tr", null,
          h("th", { scope: "row" },
            h("span", { class: "proto-name" }, p.name),
            p.url ? h("a", { class: "proto-link", href: p.url, target: "_blank", rel: "noopener" }, p.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]) : null,
            p.entry ? h("div", { class: "proto-chip" }, chip(p.entry)) : null),
          h("td", null, rich(p.connects)),
          h("td", null, rich(p.origin)),
          h("td", null, rich(p.governance)),
          h("td", null, rich(p.status), p.sources && p.sources.length ? h("span", null, " ", p.sources.map(function (src, j) {
            return h("a", { href: src, target: "_blank", rel: "noopener", class: "proto-link", "aria-label": "Source " + (j + 1) + " for " + p.name }, "[" + (j + 1) + "]");
          })) : null))];
      }))));
  }
  function checklist() {
    var saved = {};
    try { saved = JSON.parse(sk.store("ae3-checklist") || "{}") || {}; } catch (e) { saved = {}; }
    var list = h("div", { class: "checklist" });
    G.build.checklist.forEach(function (item, i) {
      var input = h("input", { type: "checkbox", id: "chk-" + i, "data-key": item.k });
      input.checked = !!saved[item.k];
      list.appendChild(h("label", { for: "chk-" + i }, input, h("span", null, rich(item.t))));
    });
    var count = h("span"), reset = h("button", { class: "link-btn", type: "button" }, "Clear all");
    function update(save) {
      var boxes = $$("input", list), done = boxes.filter(function (b) { return b.checked; }).length;
      count.textContent = done + " of " + boxes.length + " done";
      if (!save) return;
      var state = {};
      boxes.forEach(function (b) { if (b.checked) state[b.getAttribute("data-key")] = 1; });
      sk.store("ae3-checklist", JSON.stringify(state));
    }
    list.addEventListener("change", function () { update(true); });
    reset.addEventListener("click", function () { $$("input", list).forEach(function (b) { b.checked = false; }); update(true); });
    update(false);
    return h("div", null, list, h("div", { class: "checklist-meta" }, count, reset));
  }
  function renderBuild() {
    var B = G.build, KB = D.kitchen.build;
    function rung(v, r, i) {
      return h("div", { class: "card rung voice voice-" + v.kind }, h("span", { class: "lvl" }, "Level", h("b", null, String(i))),
        h("h4", null, r.name), h("p", null, rich(r.what)), h("p", { class: "climb" }, h("b", null, "Climb when: "), rich(r.climb)));
    }
    return h("div", null,
      h("h3", { class: "subhead" }, "The complexity ladder"),
      h("ol", { class: "ladder" }, B.ladder.map(function (r, i) {
        return h("li", { class: "rung-pair" }, rung(K, KB.ladder[i], i), rung(T, r, i));
      })),
      h("p", { class: "tech-only" }, sk.voiceTag("technical", "From here on in technical words only"), "The steps, patterns, routes, standards and checklist below have no kitchen version."),
      h("h3", { class: "subhead" }, "Twelve steps to a reliable agent"),
      h("ol", { class: "recipe" }, B.recipe.map(function (r) { return h("li", null, h("h4", null, r.title), h("p", null, rich(r.text)), chips(r.entries)); })),
      h("h3", { class: "subhead" }, "Patterns, from fixed workflows to agent teams"),
      h("p", { class: "sub-lede" }, "Ordered by autonomy: the further down, the more the model decides and the less predictable cost and behaviour become. Pick the first one that solves your problem."),
      h("div", { class: "patterns" }, B.patterns.map(function (p) {
        return h("figure", { class: "card pattern", id: "pattern-" + p.id },
          h("div", { class: "pattern-head" }, h("h3", null, p.name), h("span", { class: "kind" }, p.kind)),
          patternSvg(p), h("figcaption", { class: "visually-hidden" }, p.alt),
          h("p", null, rich(p.what)),
          h("p", null, h("strong", null, "Use when: "), rich(p.use)),
          h("p", null, h("strong", null, "Example: "), rich(p.example)),
          h("div", { class: "pattern-meta" },
            h("span", null, "Autonomy ", meter(p.autonomy)), h("span", null, "Cost ", meter(p.cost)), h("span", null, "Predictability ", meter(p.predictability))),
          chips(p.entries));
      })),
      h("h3", { class: "subhead" }, "Four example routes"),
      h("div", { class: "flows" }, B.flows.map(function (f) {
        var route = h("div", { class: "flow-route" });
        f.route.forEach(function (st, i) {
          if (i) route.appendChild(h("span", { class: "sep", "aria-hidden": "true" }, "→"));
          route.appendChild(h("span", { class: "flow-stop" }, chip(st.e), st.n ? h("span", { class: "flow-stop-note" }, st.n) : null));
        });
        return h("article", { class: "card flow" }, h("h4", null, f.name), h("p", null, rich(f.goal)), route, f.why ? h("p", null, rich(f.why)) : null);
      })),
      h("h3", { class: "subhead" }, "Open protocols and standards"),
      protocols(),
      h("h3", { class: "subhead" }, "Pre-launch checklist"),
      checklist(),
      note("build"));
  }

  /* ---------- Glossary ---------- */
  function slug(term) { return sk.norm(term).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function renderGlossary() {
    var listEl = h("div", { class: "gloss" });
    var input = h("input", { id: "gloss-search", type: "search", placeholder: "Filter terms", autocomplete: "off", spellcheck: "false" });
    var countEl = h("span", { class: "gloss-count", "aria-live": "polite" });
    var terms = G.glossary.slice().sort(function (a, b) { return a.term.localeCompare(b.term, "en", { sensitivity: "base" }); });
    function draw(q) {
      clear(listEl);
      q = sk.norm(q).trim();
      var shown = terms.filter(function (e) { return !q || sk.norm(e.term + " " + K.glossary(e) + " " + T.glossary(e)).indexOf(q) !== -1; });
      var letter = "", dl = null;
      shown.forEach(function (e) {
        var L = e.term[0].toUpperCase();
        if (!/[A-Z]/.test(L)) L = "#";
        if (L !== letter) {
          letter = L;
          listEl.appendChild(h("p", { class: "gloss-letter", "aria-hidden": "true" }, L));
          dl = h("dl");
          listEl.appendChild(dl);
        }
        dl.appendChild(h("div", { class: "gloss-entry", id: "term-" + slug(e.term) }, h("dt", null, e.term),
          h("dd", { "data-label": "In the kitchen" }, rich(K.glossary(e))),
          h("dd", { "data-label": "In technical words" }, rich(T.glossary(e)),
            e.entry && D.entries[e.entry] ? h("a", { class: "link-btn", href: sk.url.entry(e.entry), "aria-label": "Open " + e.term }, "Open") : null)));
      });
      if (!shown.length) listEl.appendChild(h("p", { class: "gloss-empty" }, "No term matches “" + input.value + "”."));
      countEl.textContent = shown.length + " of " + terms.length + " terms";
    }
    input.addEventListener("input", function () { draw(input.value); });
    draw("");
    return h("div", null,
      h("div", { class: "gloss-tools" },
        h("div", { class: "search-field" },
          iconSvg('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>'),
          h("label", { class: "visually-hidden", for: "gloss-search" }, "Filter the glossary"), input),
        countEl),
      h("div", { class: "gloss-heads", "aria-hidden": "true" }, h("span"), sk.voiceTag("kitchen"), sk.voiceTag("technical")),
      listEl);
  }

  /* ---------- Learn more ---------- */
  function renderLearn() {
    return h("div", { class: "learn-grid" }, G.learn.map(function (grp) {
      return h("div", { class: "learn-col" + (grp.wide ? " learn-col-wide" : "") }, h("h3", null, grp.title), grp.intro ? h("p", null, grp.intro) : null, linkList(grp.items));
    }));
  }

  /* ---------- About ---------- */
  function renderAbout() {
    return h("div", { class: "about" },
      h("div", null,
        h("h3", null, "What this is"),
        h("p", null, "A free, open-source explanation of AI agents as of ", h("strong", null, D.meta.snapshot), ", written for people who are new to AI. It follows one example through seven short chapters and an epilogue, and ends with a map of the whole system."),
        h("p", null, "Everything is told twice, side by side. The kitchen version, on the left, explains it with a restaurant kitchen and nothing else. The technical version, on the right, uses no picture at all: the mechanism, the details, dated facts and checked sources."),
        h("h3", null, "The full reference"),
        h("p", null, "The first version, ", h("a", { href: D.meta.v1 }, "v0.1-alpha"), ", shows all 42 building blocks at once, with more detail for people who build agents. Every entry here links to the blocks it covers there."),
        h("h3", null, "How sources were chosen"),
        h("ul", null,
          h("li", null, "Primary sources first: vendor documentation and engineering blogs, specifications, standards bodies and regulators."),
          h("li", null, "Seminal or widely cited papers, linked to their arXiv or publisher pages."),
          h("li", null, "Videos only from large, reputable channels known for careful explanations."),
          h("li", null, "Every link was checked when the snapshot was made. Dated facts say when they were true.")),
        h("h3", null, "Corrections"),
        h("p", null, "Found an error or a broken link? ", h("a", { href: D.meta.repo + "/issues", target: "_blank", rel: "noopener" }, "Open an issue on GitHub"),
          ". All content lives in ", h("code", null, "assets/js/data/"), "."),
        h("p", null, "Last updated: ", h("time", { datetime: D.meta.updated }, sk.fmtDate(D.meta.updated)), ".")),
      h("div", null,
        h("h3", null, "Privacy"),
        h("ul", null,
          h("li", null, "No cookies, no analytics, no tracking."),
          h("li", null, "Fonts and scripts are self-hosted, so no requests go to third parties."),
          h("li", null, "Videos are plain links rather than embeds."),
          h("li", null, "Your theme choice and checklist are stored only in your own browser.")),
        h("h3", null, "Credits"),
        h("p", null, "Typefaces: Source Serif 4, DM Sans and DM Mono, under the SIL Open Font License. Hand-drawn shapes: rough.js by Preet Shihn, MIT licence."),
        h("p", null, "An independent project, not affiliated with any company or product mentioned on this page.")));
  }

  V3.guides = {
    render: { compare: renderCompare, build: renderBuild, glossary: renderGlossary, learn: renderLearn, about: renderAbout },
    linkList: linkList,
    chip: chip
  };
})();
