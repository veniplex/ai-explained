/* Agentic AI, Explained (v6): the pages of one term and of one guide. Each has its own address
   (terms/<id>/ and guides/<id>/), so a link points to exactly this page. The guided path itself is story.js.
   A term is told twice, side by side (voice.js), with the map in the middle: the term is marked on it, and an arrow
   runs from the passage in each column to it (arrows.js). Kitchen on the left: the picture, how it works in the
   kitchen, the example and tips. Technical on the right: the definition, how it works, the example and tips. Below,
   across the whole width: the details, dated facts and sources, which only the technical voice has. */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3.sk, D = window.AE3, voice = V3.voice;
  var h = sk.h, rich = sk.rich, $$ = sk.$$, url = sk.url, K = voice.kitchen, T = voice.tech;
  var chip = V3.guides.chip;

  var ENTRIES = D.entries, ORDER = [], CHAP = {};
  D.chapters.forEach(function (c) { CHAP[c.id] = c; c.entries.forEach(function (id) { ORDER.push(id); }); });
  function chapterOf(id) { return CHAP[ENTRIES[id].chapter]; }
  function chLabel(c) { return c.n === 8 ? "Epilogue" : "Chapter " + c.n; }
  function chAnchor(c) { return c.n === 8 ? "ch-e" : "ch-" + c.n; }
  function neighbour(list, id, step) { var k = list.indexOf(id); return list[(k + step + list.length) % list.length]; }

  /* ---------- A term ------------------------------------------------------------- */
  function section(title, body) { return body ? h("div", { class: "bd-section" }, h("h3", null, title), body) : null; }
  function paras(list) { return h("div", { class: "prose" }, list.map(function (p) { return h("p", null, rich(p)); })); }
  function bullets(items) { return items && items.length ? h("ul", { class: "bd-list" }, items.map(function (t) { return h("li", null, rich(t)); })) : null; }
  function kitchenCard(text, zone, label) {
    var card = h("div", { class: "eli5", "data-zone": zone },
      h("div", null, h("span", { class: "eyebrow eli5-label" }, label), h("p", { class: "eli5-text" }, rich(text))),
      sk.doodleSvg(zone, "eli5-doodle", 13, sk.reduced() ? null : 0.15));
    sk.sketchBox(card, { seed: 29 + zone.length, boil: false, sw: 1.3 });
    return card;
  }
  function deeper(id) {
    var e = ENTRIES[id], src = D.sources[id] || { facts: [], sources: [], v1: [] };
    var box = h("div", { class: "deeper deeper-open" }, sk.voiceTag("technical"), h("h2", { class: "deeper-title" }, T.ui.details));
    sk.append(box, [
      section("Details", paras(e.deeper.details)),
      section("Also covers", e.deeper.includes && e.deeper.includes.length ? h("ul", { class: "bd-list" }, e.deeper.includes.map(function (x) {
        return h("li", null, h("strong", null, x.name + ": "), rich(x.text));
      })) : null),
      section("Status, " + D.meta.snapshot, src.facts.length ? h("ul", { class: "bd-facts" }, src.facts.map(function (f) {
        return h("li", null, rich(f.text), " ", f.source ? h("a", { href: f.source, target: "_blank", rel: "noopener" }, "source") : null);
      })) : null),
      section("Sources", src.sources.length ? h("div", null, V3.guides.linkList(src.sources.slice(0, 3)),
        src.sources.length > 3 ? h("details", { class: "more-sources" }, h("summary", null, "All sources (" + src.sources.length + ")"), V3.guides.linkList(src.sources.slice(3))) : null) : null),
      src.v1 && src.v1.length ? h("p", { class: "v1-ref" }, "Full detail in v1-alpha: ", src.v1.map(function (b, i) {
        return [i ? ", " : "", h("a", { href: url.base + D.meta.v1 + "#block-" + b.id }, b.name)];
      })) : null
    ]);
    return box;
  }
  // A passage is a piece of text an arrow can start from; on a term page every one of them is about the term.
  function point(el, id) {
    if (el) { el.classList.add("passage"); el.setAttribute("data-points", id); }
    return el;
  }
  // The map in the middle of a term page: this term marked, the rest of its chapter open, everything else folded.
  function middle(id, c) {
    var m = V3.map.create({ layout: "spine", ring: false, stage: D.chapters.length, current: c.n });
    var host = h("aside", { class: "trio-mid trio-sticky spread-map", "aria-hidden": "true" }, m.el);
    $$("a, button", host).forEach(function (el) { el.setAttribute("tabindex", "-1"); });
    var own = $$('.blk[data-entry="' + id + '"]', host)[0];
    if (own) own.classList.add("is-on");
    return host;
  }
  function entryBody(id) {
    var e = ENTRIES[id], c = chapterOf(id), wrap = h("div", { class: "bd", "data-zone": c.zone });
    var related = e.related && e.related.length ? section("Related", h("div", { class: "chips" }, e.related.map(function (r) { return chip(r); }))) : null;
    var k = K.entry(id), t = T.entry(id);
    var kitchen = h("div", { class: "voice voice-kitchen" },
      sk.voiceTag("kitchen"),
      point(kitchenCard(k.line, c.zone, K.ui.entryLead), id),
      point(section(K.ui.how, paras(k.how)), id),
      point(section(K.ui.ex, h("p", { class: "bd-example" }, rich(k.example))), id),
      point(section(K.ui.forYou, bullets(k.forYou)), id));
    var tech = h("div", { class: "voice voice-technical" },
      sk.voiceTag("technical"),
      point(h("div", { class: "def-row", "data-zone": c.zone },
        h("p", { class: "def" }, h("span", { class: "eyebrow def-label" }, T.ui.entryLead), rich(t.line)),
        sk.doodleSvg(c.zone, "def-icon", 13, undefined, e.chapter, true)), id),
      point(section(T.ui.how, paras(t.how)), id),
      point(section(T.ui.ex, h("p", { class: "bd-example" }, rich(t.example))), id),
      point(section(T.ui.forYou, bullets(t.forYou)), id));
    var spread = h("div", { class: "trio", "data-zone": c.zone, "data-ch": c.n }, kitchen, middle(id, c), tech);
    V3.arrows.add(spread);
    sk.append(wrap, [spread, deeper(id), related]);
    return wrap;
  }
  function pager(prev, next) {
    return h("nav", { class: "pager", "aria-label": "More" },
      h("a", { class: "pager-link pager-prev", href: prev.href, rel: "prev" }, h("span", { class: "eyebrow" }, prev.kind), h("b", null, prev.label)),
      h("a", { class: "pager-link pager-next", href: next.href, rel: "next" }, h("span", { class: "eyebrow" }, next.kind), h("b", null, next.label)));
  }
  function entryPage(id) {
    var e = ENTRIES[id], c = chapterOf(id), prev = neighbour(ORDER, id, -1), next = neighbour(ORDER, id, 1);
    return h("article", { class: "page page-entry", "data-zone": c.zone },
      h("header", { class: "page-head" },
        h("a", { class: "crumb", href: url.home(chAnchor(c)) }, h("i", { class: "zdot", "aria-hidden": "true" }), h("span", null, "← " + chLabel(c) + " · " + K.chapter(c).title + " · " + T.chapter(c).title)),
        h("p", { class: "eyebrow page-eyebrow" }, "Term"),
        h("h1", { class: "page-title" }, e.name)),
      entryBody(id),
      pager({ href: url.entry(prev), kind: "Previous term", label: ENTRIES[prev].label }, { href: url.entry(next), kind: "Next term", label: ENTRIES[next].label }));
  }

  /* ---------- A guide ------------------------------------------------------------ */
  function guidePage(id) {
    var list = D.guideList, k = list.map(function (x) { return x.id; }).indexOf(id), g = K.guide(id), gt = T.guide(id);
    var prev = list[(k + list.length - 1) % list.length], next = list[(k + 1) % list.length];
    // A guide with a text in both voices shows them side by side; one with a single text shows just that.
    var ledes = h("div", { class: "page-ledes" }, [[K, g], [T, gt]].filter(function (p) { return p[1].lede; }).map(function (p) {
      return h("div", { class: "voice voice-" + p[0].kind }, sk.voiceTag(p[0].kind), h("p", { class: "page-lede" }, rich(p[1].lede)));
    }));
    ledes.hidden = !ledes.firstChild;
    return h("article", { class: "page page-guide", "data-guide": id },
      h("header", { class: "page-head" },
        h("a", { class: "crumb", href: url.home() }, h("span", null, "← The guided path")),
        h("p", { class: "eyebrow page-eyebrow" }, g.eyebrow),
        h("h1", { class: "page-title" }, g.title),
        ledes),
      h("div", { class: "page-body" }, V3.guides.render[id]()),
      pager({ href: url.guide(prev.id), kind: "Previous guide", label: prev.menu }, { href: url.guide(next.id), kind: "Next guide", label: next.menu }));
  }

  V3.pages = { entry: entryPage, guide: guidePage, chLabel: chLabel };
})();
