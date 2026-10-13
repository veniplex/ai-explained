/* Agentic AI, Explained (v10): the pages of one term and of one guide (from v4). Each has its own address
   (terms/<id>/ and guides/<id>/), so a link points to exactly this page. The start page of the deep dive is story.js.
   A term is told in the voice that is on (voice.js). Kitchen: the picture, how it works in the kitchen, the example
   and tips, then a way to the real thing. Technical: the definition, how it works, the example, tips and, in full,
   the details, dated facts and sources. A term page also shows where the term sits in the kitchen of the story (locator.js). */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3.sk, D = window.AE3, voice = V3.voice;
  var h = sk.h, rich = sk.rich, $$ = sk.$$, url = sk.url;
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
    var box = h("div", { class: "deeper deeper-open" }, h("h2", { class: "deeper-title" }, voice.ui().details));
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
  // Kitchen voice: a way to the technical version, where the details, facts and sources are.
  function realThing() {
    var u = voice.ui();
    return h("aside", { class: "real-thing" },
      h("h2", { class: "real-thing-title" }, u.realThing),
      h("p", null, u.realThingText),
      h("button", { class: "btn", type: "button", "data-mode-set": "technical" }, u.switchTo));
  }
  function entryBody(id) {
    var e = ENTRIES[id], c = chapterOf(id), u = voice.ui(), v = voice.entry(id), kitchen = voice.kitchen();
    var wrap = h("div", { class: "bd", "data-zone": c.zone });
    var related = e.related && e.related.length ? section("Related", h("div", { class: "chips" }, e.related.map(function (r) { return chip(r); }))) : null;
    if (kitchen) {
      sk.append(wrap, [
        kitchenCard(v.line, c.zone, u.entryLead),
        section(u.how, paras(v.how)),
        section(u.ex, h("p", { class: "bd-example" }, rich(v.example))),
        section(u.forYou, bullets(v.forYou)),
        realThing(),
        related
      ]);
    } else {
      sk.append(wrap, [
        h("div", { class: "def-row", "data-zone": c.zone },
          h("p", { class: "def" }, h("span", { class: "eyebrow def-label" }, u.entryLead), rich(v.line)),
          sk.doodleSvg(c.zone, "def-icon", 13, undefined, e.chapter)),
        section(u.how, paras(v.how)),
        section(u.ex, h("p", { class: "bd-example" }, rich(v.example))),
        section(u.forYou, bullets(v.forYou)),
        deeper(id),
        related
      ]);
    }
    return wrap;
  }
  function pager(prev, next) {
    return h("nav", { class: "pager", "aria-label": "More" },
      h("a", { class: "pager-link pager-prev", href: prev.href, rel: "prev" }, h("span", { class: "eyebrow" }, prev.kind), h("b", null, prev.label)),
      h("a", { class: "pager-link pager-next", href: next.href, rel: "next" }, h("span", { class: "eyebrow" }, next.kind), h("b", null, next.label)));
  }
  // On a phone the top bar has no room for the switch between the two voices, so the page carries one of its own.
  function voiceInline() { return h("div", { class: "voice-inline" }, sk.modeSwitch()); }
  function entryPage(id) {
    var e = ENTRIES[id], c = chapterOf(id), prev = neighbour(ORDER, id, -1), next = neighbour(ORDER, id, 1);
    return h("article", { class: "page page-entry", "data-zone": c.zone },
      h("header", { class: "page-head" },
        h("a", { class: "crumb", href: url.home(chAnchor(c)) }, h("i", { class: "zdot", "aria-hidden": "true" }), h("span", null, "← " + chLabel(c) + " · " + voice.chapter(c).title)),
        h("p", { class: "eyebrow page-eyebrow" }, "Term"),
        h("h1", { class: "page-title" }, e.name),
        voiceInline()),
      V3.locator ? V3.locator.entry(id) : null,
      entryBody(id),
      pager({ href: url.entry(prev), kind: "Previous term", label: ENTRIES[prev].label }, { href: url.entry(next), kind: "Next term", label: ENTRIES[next].label }));
  }

  /* ---------- A guide ------------------------------------------------------------ */
  function guidePage(id) {
    var list = D.guideList, k = list.map(function (x) { return x.id; }).indexOf(id), g = voice.guide(id);
    var prev = list[(k + list.length - 1) % list.length], next = list[(k + 1) % list.length];
    var lede = h("p", { class: "page-lede" }, rich(g.lede));
    lede.hidden = !g.lede;
    return h("article", { class: "page page-guide", "data-guide": id },
      h("header", { class: "page-head" },
        h("a", { class: "crumb", href: url.home() }, h("span", null, "← Deep dive")),
        h("p", { class: "eyebrow page-eyebrow" }, g.eyebrow),
        h("h1", { class: "page-title" }, g.title),
        lede,
        voiceInline()),
      h("div", { class: "page-body" }, V3.guides.render[id]()),
      pager({ href: url.guide(prev.id), kind: "Previous guide", label: prev.menu }, { href: url.guide(next.id), kind: "Next guide", label: next.menu }));
  }

  V3.pages = { entry: entryPage, guide: guidePage, chLabel: chLabel };
})();
