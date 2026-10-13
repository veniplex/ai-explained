/* AI explained (v15): the guides. Each renderer returns the content of a guide page (pages.js adds the heading): the long guides (sections, steps, code, tables, examples), the table of easily confused things, the build guide and the reading list; about() is the content of the about page. */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3.sk, D = window.AE3, G = D.guides, voice = V3.voice;
  var h = sk.h, s = sk.s, rich = sk.rich, $$ = sk.$$, clear = sk.clear;
  var T = V3.terms;

  function chip(id, label) {
    var t = T.get(id);
    if (!t) return null;
    return h("a", { class: "chip", href: sk.url.entry(id), "data-entry": id, "data-zone": t.zone }, label || t.label || t.name);
  }
  function chips(ids) { return ids && ids.length ? h("div", { class: "chips" }, ids.map(function (id) { return chip(id); })) : null; }
  function note(id) { var g = voice.guide(id); return g.note ? h("p", { class: "page-note" }, rich(g.note)) : null; }

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
  function renderCompare() {
    var c = G.compare;
    var tbl = h("table", { class: "cmp" },
      h("thead", null, h("tr", null, c.columns.map(function (col) { return h("th", { scope: "col" }, col); }))),
      h("tbody", null, c.rows.map(function (r) {
        return h("tr", null, h("th", { scope: "row" }, chip(r.entry, r.name)),
          r.cells.map(function (cell, i) {
            if (i === c.detCol) {
              var cls = /^yes/i.test(cell) ? "yes" : /^no/i.test(cell) ? "no" : "part";
              return h("td", null, h("span", { class: "tag tag-" + cls }, cell));
            }
            return h("td", null, rich(cell));
          }));
      })));
    return h("div", null, h("div", { class: "card table-scroll" }, tbl), note("compare"));
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
    var B = G.build;
    return h("div", null,
      h("div", { class: "build-grid" },
        h("div", null,
          h("h2", { class: "subhead" }, "The complexity ladder"),
          h("p", { class: "sub-lede" }, "Start on the lowest rung that could work. Climb only when your tests show the current rung fails."),
          h("ol", { class: "ladder" }, B.ladder.map(function (r, i) {
            return h("li", { class: "card rung" }, h("span", { class: "lvl" }, "Level", h("b", null, String(i))),
              h("h3", null, r.name), h("p", null, rich(r.what)), h("p", { class: "climb" }, h("b", null, "Climb when: "), rich(r.climb)));
          }))),
        h("div", null,
          h("h2", { class: "subhead" }, "Twelve steps to a reliable agent"),
          h("ol", { class: "recipe" }, B.recipe.map(function (r) {
            return h("li", null, h("h3", null, r.title), h("p", null, rich(r.text)), chips(r.entries));
          })))),
      h("h2", { class: "subhead" }, "Patterns, from fixed workflows to agent teams"),
      h("p", { class: "sub-lede" }, "Ordered by autonomy: the further down, the more the model decides and the less predictable cost and behaviour become. Pick the first one that solves your problem."),
      h("div", { class: "patterns" }, B.patterns.map(function (p) {
        return h("figure", { class: "card pattern", id: "pattern-" + p.id },
          h("div", { class: "pattern-head" }, h("h2", null, p.name), h("span", { class: "kind" }, p.kind)),
          patternSvg(p), h("figcaption", { class: "visually-hidden" }, p.alt),
          h("p", null, rich(p.what)),
          h("p", null, h("strong", null, "Use when: "), rich(p.use)),
          h("p", null, h("strong", null, "Example: "), rich(p.example)),
          h("div", { class: "pattern-meta" },
            h("span", null, "Autonomy ", meter(p.autonomy)), h("span", null, "Cost ", meter(p.cost)), h("span", null, "Predictability ", meter(p.predictability))),
          chips(p.entries));
      })),
      h("h2", { class: "subhead" }, "Four example routes"),
      h("div", { class: "flows" }, B.flows.map(function (f) {
        var route = h("div", { class: "flow-route" });
        f.route.forEach(function (st, i) {
          if (i) route.appendChild(h("span", { class: "sep", "aria-hidden": "true" }, "→"));
          route.appendChild(h("span", { class: "flow-stop" }, chip(st.e), st.n ? h("span", { class: "flow-stop-note" }, st.n) : null));
        });
        return h("article", { class: "card flow" }, h("h3", null, f.name), h("p", null, rich(f.goal)), route, f.why ? h("p", null, rich(f.why)) : null);
      })),
      h("h2", { class: "subhead" }, "Open protocols and standards"),
      protocols(),
      h("h2", { class: "subhead" }, "Pre-launch checklist"),
      checklist(),
      note("build"));
  }

  /* ---------- Learn more ---------- */
  function renderLearn() {
    return h("div", { class: "learn-grid" }, G.learn.map(function (grp) {
      return h("div", { class: "learn-col" + (grp.wide ? " learn-col-wide" : "") }, h("h2", null, grp.title), grp.intro ? h("p", null, grp.intro) : null, linkList(grp.items));
    }));
  }

  /* ---------- The long guides ---------- */
  function codeBlock(c) {
    return h("figure", { class: "code" }, h("figcaption", null, c.label), h("pre", null, h("code", null, c.text)));
  }
  function tableOf(t) {
    return h("div", { class: "card table-scroll gd-table" }, h("table", { class: "tbl" },
      h("thead", null, h("tr", null, t.head.map(function (c) { return h("th", { scope: "col" }, rich(c)); }))),
      h("tbody", null, t.rows.map(function (r) { return h("tr", null, r.map(function (c, i) { return i ? h("td", null, rich(c)) : h("th", { scope: "row" }, rich(c)); })); }))));
  }
  function renderArticle(id) {
    var g = voice.guide(id), u = voice.ui();
    var expect = h("aside", { class: "gd-expect", "data-zone": "harness" },
      h("p", { class: "eyebrow" }, "What you will know afterwards"),
      h("ul", null, g.expect.map(function (t) { return h("li", null, rich(t)); })));
    sk.sketchBox(expect, { seed: 41, boil: false, sw: 1.3, radius: 10, fill: "zt" });
    var body = g.sections.map(function (s, i) {
      return h("section", { class: "gd-section", id: "s-" + s.id, "aria-labelledby": "h-" + s.id },
        h("h2", { id: "h-" + s.id }, h("span", { class: "gd-n", "aria-hidden": "true" }, String(i + 1)), s.title),
        s.text.map(function (p) { return h("p", null, rich(p)); }),
        s.list ? h("ul", { class: "bd-list" }, s.list.map(function (t) { return h("li", null, rich(t)); })) : null,
        s.steps ? h("ol", { class: "gd-steps" }, s.steps.map(function (st) { return h("li", null, h("b", null, rich(st.t)), h("span", null, rich(st.d))); })) : null,
        s.table ? tableOf(s.table) : null,
        s.code ? codeBlock(s.code) : null,
        s.callout ? h("aside", { class: "gd-callout" }, h("b", null, rich(s.callout.t)), h("span", null, rich(s.callout.d))) : null,
        s.example ? V3.pages.exampleBlock(u.ex, s.example) : null);
    });
    return h("div", { class: "gd" },
      h("div", { class: "gd-top" }, expect),
      h("div", { class: "gd-body" }, body,
        h("div", { class: "gd-terms" }, h("h2", null, "Terms in this guide"), chips(g.terms))));
  }

  /* ---------- About ---------- */
  function about() {
    var count = T.list.length, main = Object.keys(D.entries).length;
    var what = [
      h("p", null, "A free, open-source explanation of AI as of ", h("strong", null, D.meta.snapshot), ", for people who are new to it and for people who build with it."),
      h("p", null, h("a", { href: sk.url.kitchen() }, "The kitchen story"), " is one hand-drawn restaurant kitchen that builds itself on a single screen. Every part of it is a real part of an AI agent, and at the end the real names are laid over the kitchen."),
      h("p", null, h("a", { href: sk.url.home() }, "The technical deep dive"), " goes through eight chapters and " + main + " main terms in plain technical words, with no pictures at all: the mechanism, the details and checked sources.")
    ];
    return h("div", { class: "about" },
      h("div", null,
        h("h2", null, "What this is"),
        what,
        h("h2", null, "Guides and the glossary"),
        h("p", null, h("a", { href: sk.url.guides() }, "The guides"), " take one question each from start to finish: how an agent works, how to manage its context, how to build one, how to secure it and how to test it. ",
          h("a", { href: sk.url.glossary() }, "The glossary"), " lists " + count + " terms, one page each. Every glossary page also shows where the term sits in the kitchen of the story. Hovering over a term anywhere shows a short explanation and a link to its page."),
        h("h2", null, "How sources were chosen"),
        h("ul", null,
          h("li", null, "Primary sources first: vendor documentation and engineering blogs, specifications, standards bodies and regulators."),
          h("li", null, "Seminal or widely cited papers, linked to their arXiv or publisher pages."),
          h("li", null, "Videos only from large, reputable channels known for careful explanations."),
          h("li", null, "Every link was checked when the snapshot was made. Dated facts say when they were true.")),
        h("h2", null, "Corrections"),
        h("p", null, "Found an error or a broken link? ", h("a", { href: D.meta.repo + "/issues", target: "_blank", rel: "noopener" }, "Open an issue on GitHub"),
          ". All content lives in ", h("code", null, "assets/js/data/"), "."),
        h("p", null, "Last updated: ", h("time", { datetime: D.meta.updated }, sk.fmtDate(D.meta.updated)), ".")),
      h("div", null,
        h("h2", null, "Privacy"),
        h("ul", null,
          h("li", null, "No cookies, no analytics, no tracking."),
          h("li", null, "Fonts and scripts are self-hosted, so no requests go to third parties."),
          h("li", null, "Videos are plain links rather than embeds."),
          h("li", null, "Your theme choice, how you sort the glossary and your checklist are stored only in your own browser.")),
        h("h2", null, "Credits"),
        h("p", null, "Typefaces: Source Serif 4, DM Sans and DM Mono, under the SIL Open Font License. Hand-drawn shapes: rough.js by Preet Shihn, MIT licence."),
        h("p", null, "An independent project, not affiliated with any company or product mentioned on this page.")));
  }

  V3.guides = {
    render: { "how-it-works": function () { return renderArticle("how-it-works"); }, context: function () { return renderArticle("context"); },
      secure: function () { return renderArticle("secure"); }, evaluate: function () { return renderArticle("evaluate"); },
      compare: renderCompare, build: renderBuild, learn: renderLearn },
    about: about,
    linkList: linkList,
    chip: chip
  };
})();
