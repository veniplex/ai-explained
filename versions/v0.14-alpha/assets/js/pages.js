/* AI explained (v14): the pages of a deep dive that are not the chapters: one term (glossary/<id>/), the glossary (glossary/), one guide (guides/<id>/),
   the list of guides (guides/) and the about page (about/). Each has its own address, so a link points to exactly this page. The chapters and the map are
   story.js. The page is told in the voice of its way (voice.js): kitchen/ with the restaurant kitchen only, technical/ in plain words with no picture.
   A term page has the list of all terms at its side (a menu, the term you are on marked). A main term (21 of them) has a full page: the picture or the
   definition, how it works, an example that leads to the story chapter explaining it, tips, and in the technical voice the details and sources. A term of
   the glossary has its definition, more words where it needs them, the main term it belongs to, and related terms. */
(function () {
  "use strict";

  var V3 = window.V3, sk = V3.sk, D = window.AE3, voice = V3.voice, T = V3.terms;
  var h = sk.h, rich = sk.rich, url = sk.url;
  var chip = V3.guides.chip;

  var ENTRIES = D.entries;
  function chLabel(c) { return c.n === 8 ? "Epilogue" : "Chapter " + c.n; }
  function neighbour(list, id, step) { var k = list.indexOf(id); return list[(k + step + list.length) % list.length]; }
  function plainText(s) { return String(s || "").replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1").replace(/\[([^\]]+)\]\(https?:[^)\s]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1"); }

  /* ---------- Shared pieces ----------------------------------------------------------------- */
  function section(title, body) { return body ? h("div", { class: "bd-section" }, h("h2", null, title), body) : null; }
  function paras(list) { return h("div", { class: "prose" }, list.map(function (p) { return h("p", null, rich(p)); })); }
  function bullets(items) { return items && items.length ? h("ul", { class: "bd-list" }, items.map(function (t) { return h("li", null, rich(t)); })) : null; }
  function kitchenCard(text, zone, label) {
    var card = h("div", { class: "eli5", "data-zone": zone },
      h("div", null, h("span", { class: "eyebrow eli5-label" }, label), h("p", { class: "eli5-text" }, rich(text))),
      sk.doodleSvg(zone, "eli5-doodle", 13, sk.reduced() ? null : 0.15));
    sk.sketchBox(card, { seed: 29 + zone.length, boil: false, sw: 1.3 });
    return card;
  }
  function pager(prev, next) {
    return h("nav", { class: "pager", "aria-label": "More" },
      h("a", { class: "pager-link pager-prev", href: prev.href, rel: "prev" }, h("span", { class: "eyebrow" }, prev.kind), h("b", null, prev.label)),
      h("a", { class: "pager-link pager-next", href: next.href, rel: "next" }, h("span", { class: "eyebrow" }, next.kind), h("b", null, next.label)));
  }
  // The way from an example to the story that explains it: the chapter of the kitchen story it belongs to (story/#ch-N). The technical voice
  // says it plainly and names no picture; the kitchen voice names the chapter and offers the deep dive's chapter as well.
  function storyLink(chapter, n) {
    var num = chapter ? chapter.n : n;
    if (!num) return null;
    var kitchen = voice.kitchen(), title = chapter ? voice.chapter(chapter) : null;
    var links = [h("a", { class: "btn btn-sm", href: url.kitchen("ch-" + num) },
      kitchen ? "Watch " + (num === 8 ? "the epilogue" : "chapter " + num) + " in the story" : "See this told as a story: " + (num === 8 ? "epilogue" : "chapter " + num), h("span", { "aria-hidden": "true" }, " →"))];
    if (kitchen) links.push(h("a", { class: "btn btn-ghost btn-sm", href: url.home(num === 8 ? "ch-e" : "ch-" + num) }, "Read it in the deep dive"));
    return h("p", { class: "story-link" }, links, kitchen && title ? h("span", { class: "story-link-note" }, chLabel({ n: num }) + " · " + title.title) : null);
  }
  function exampleBlock(title, text, chapter, n) {
    return h("div", { class: "bd-section" }, h("h2", null, title), h("p", { class: "bd-example" }, rich(text)), storyLink(chapter, n));
  }
  function relatedChips(ids) {
    var list = (ids || []).filter(function (id) { return T.get(id); });
    return list.length ? section("Related", h("div", { class: "chips" }, list.map(function (r) { return chip(r); }))) : null;
  }
  function icon(name, cls, seed) { return sk.glyph ? sk.glyph(name, cls, seed, sk.reduced() ? null : 0.1) : null; }

  /* ---------- The list of all terms at the side of a term page --------------------------------- */
  function sidebar(currentId) {
    var count = T.list.length, current = null;
    var input = h("input", { type: "search", id: "gl-filter", placeholder: "Filter terms", autocomplete: "off", spellcheck: "false", "aria-label": "Filter the terms" });
    var groups = T.cats.map(function (c) {
      var items = c.terms.map(function (t) {
        var a = h("a", { href: url.entry(t.id), "data-name": sk.stem(t.name + " " + t.aka.join(" ")), "data-nopop": "" }, h("span", null, t.name));
        if (t.id === currentId) { a.setAttribute("aria-current", "page"); current = a; }
        return h("li", { "data-id": t.id }, a);
      });
      return h("div", { class: "gl-side-group", "data-zone": c.zone },
        h("p", { class: "gl-side-head" }, h("i", { class: "zdot", "aria-hidden": "true" }), h("span", null, c.title)), h("ul", null, items));
    });
    var nav = h("nav", { class: "gl-side-list", "aria-label": "All terms" }, groups);
    var empty = h("p", { class: "gl-side-empty", hidden: true }, "No term matches.");
    input.addEventListener("input", function () {
      var q = sk.stem(input.value).trim(), shown = 0;
      sk.$$("li", nav).forEach(function (li) { var on = !q || li.firstChild.getAttribute("data-name").indexOf(q) !== -1; li.hidden = !on; if (on) shown++; });
      sk.$$(".gl-side-group", nav).forEach(function (g) { g.hidden = !sk.$$("li:not([hidden])", g).length; });
      empty.hidden = shown > 0;
    });
    var box = h("details", { class: "gl-side-box", open: true },
      h("summary", null, h("span", null, "All terms"), h("span", { class: "gl-side-count" }, String(count))),
      h("div", { class: "gl-side-tools" }, input), nav, empty);
    var wide = window.matchMedia ? window.matchMedia("(min-width: 960px)") : null;
    function fit() { box.open = !wide || wide.matches; }
    fit();
    if (wide && wide.addEventListener) wide.addEventListener("change", fit);
    // The term you are on is in view when the list opens.
    if (current) setTimeout(function () {
      if (nav.scrollHeight <= nav.clientHeight) return;
      var r = current.getBoundingClientRect(), n = nav.getBoundingClientRect();
      nav.scrollTop = Math.max(0, nav.scrollTop + r.top - n.top - nav.clientHeight / 2 + r.height / 2);
    }, 80);
    return h("aside", { class: "gl-side" }, box);
  }

  /* ---------- A main term ------------------------------------------------------------------- */
  function deeper(id) {
    var e = ENTRIES[id], src = D.sources[id] || { sources: [] };
    var box = h("div", { class: "deeper deeper-open" }, h("h2", { class: "deeper-title" }, voice.ui().details));
    sk.append(box, [
      section("Details", paras(e.deeper.details)),
      section("Also covers", e.deeper.includes && e.deeper.includes.length ? h("ul", { class: "bd-list" }, e.deeper.includes.map(function (x) {
        return h("li", null, h("strong", null, x.name + ": "), rich(x.text));
      })) : null),
      section("Sources", src.sources.length ? h("div", null, V3.guides.linkList(src.sources.slice(0, 3)),
        src.sources.length > 3 ? h("details", { class: "more-sources" }, h("summary", null, "All sources (" + src.sources.length + ")"), V3.guides.linkList(src.sources.slice(3))) : null) : null)
    ]);
    return box;
  }
  // Kitchen voice: a way to the technical page of the same term, where the details and sources are.
  function realThing(id) {
    var u = voice.ui();
    return h("aside", { class: "real-thing" },
      h("h2", { class: "real-thing-title" }, u.realThing),
      h("p", null, u.realThingText),
      h("a", { class: "btn", href: url.twin(id) }, u.switchTo));
  }
  function mainBody(t) {
    var id = t.id, c = t.chapter, u = voice.ui(), v = voice.entry(id), kitchen = voice.kitchen();
    var wrap = h("div", { class: "bd", "data-zone": c.zone });
    if (kitchen) {
      sk.append(wrap, [
        kitchenCard(v.line, c.zone, u.entryLead),
        section(u.how, paras(v.how)),
        exampleBlock(u.ex, v.example, c),
        section(u.forYou, bullets(v.forYou)),
        realThing(id),
        relatedChips(ENTRIES[id].related)
      ]);
    } else {
      sk.append(wrap, [
        h("p", { class: "def" }, h("span", { class: "eyebrow def-label" }, u.entryLead), rich(v.line)),
        section(u.how, paras(v.how)),
        exampleBlock(u.ex, v.example, c),
        section(u.forYou, bullets(v.forYou)),
        deeper(id),
        relatedChips(ENTRIES[id].related)
      ]);
    }
    return wrap;
  }

  /* ---------- A term of the glossary ------------------------------------------------------------ */
  function termBody(t) {
    var id = t.id, g = t.raw, u = voice.ui(), kitchen = voice.kitchen(), zone = t.zone;
    var wrap = h("div", { class: "bd", "data-zone": zone });
    var def = kitchen ? kitchenCard(T.line(id), zone, u.entryLead)
      : h("p", { class: "def" }, h("span", { class: "eyebrow def-label" }, u.entryLead), rich(g.def));
    var more = T.more(id);
    var part = null;
    if (t.entry) {
      var main = T.get(t.entry), c = t.chapter;
      part = h("div", { class: "bd-section" }, h("h2", null, "Where it fits"),
        h("a", { class: "part-card", href: url.entry(t.entry), "data-zone": c.zone, "data-entry": t.entry },
          h("span", { class: "eyebrow" }, "Part of the main term"), h("b", null, main.name), h("span", null, rich(T.line(t.entry)))),
        storyLink(c));
    }
    sk.append(wrap, [
      def,
      more.length ? section("In more words", paras(more)) : null,
      part,
      relatedChips(t.related),
      kitchen ? realThing(id) : null
    ]);
    return wrap;
  }

  /* ---------- The page of a term ------------------------------------------------------------------- */
  function termPage(id) {
    var t = T.get(id), c = T.cats.filter(function (x) { return x.id === t.cat; })[0], kitchen = voice.kitchen();
    var i = T.list.indexOf(t), prev = T.list[(i + T.list.length - 1) % T.list.length], next = T.list[(i + 1) % T.list.length];
    var eyebrow = [c.title, t.main ? "main term" : null].filter(Boolean).join(" · ");
    var aka = t.aka && t.aka.length ? h("p", { class: "term-aka" }, "Also called ", t.aka.map(function (a, k) { return [k ? ", " : "", h("em", null, a)]; })) : null;
    var article = h("article", { class: "page page-entry", "data-zone": t.zone },
      h("header", { class: "page-head term-head" },
        h("div", { class: "term-head-text" },
          h("p", { class: "eyebrow page-eyebrow" }, h("a", { href: url.glossary() }, "Glossary"), " · " + eyebrow),
          h("h1", { class: "page-title" }, t.name), aka),
        icon(t.icon, "term-icon", 17)),
      kitchen && t.main && V3.locator ? V3.locator.entry(id) : null,
      t.main ? mainBody(t) : termBody(t),
      pager({ href: url.entry(prev.id), kind: "Previous term", label: prev.name }, { href: url.entry(next.id), kind: "Next term", label: next.name }));
    return h("div", { class: "gl-layout" }, sidebar(id), article);
  }

  /* ---------- The glossary ----------------------------------------------------------------------- */
  // Draw an icon when its card comes near the screen, so 150 drawings do not hold the page up.
  var lazy = window.IntersectionObserver ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      lazy.unobserve(e.target);
      var host = e.target, t = T.get(host.getAttribute("data-icon-of"));
      if (t) host.appendChild(icon(t.icon, "gl-icon", 5));
    });
  }, { rootMargin: "300px" }) : null;
  function iconHost(t) {
    var host = h("span", { class: "gl-icon-host", "data-icon-of": t.id, "aria-hidden": "true" });
    if (lazy) lazy.observe(host); else host.appendChild(icon(t.icon, "gl-icon", 5));
    return host;
  }
  function termCard(t) {
    var main = t.main, c = t.chapter;
    return h("li", null, h("a", { class: "gl-card", href: url.entry(t.id), "data-zone": t.zone, "data-name": sk.stem(t.name + " " + t.aka.join(" ") + " " + T.line(t.id)), "data-entry": t.id, "data-nopop": "" },
      iconHost(t),
      h("span", { class: "gl-card-text" },
        h("b", null, t.name),
        h("span", { class: "gl-card-line" }, rich(plainText(T.line(t.id)))),
        main || c ? h("span", { class: "gl-card-tag" }, main ? "Main term · " + chLabel(c) : chLabel(c)) : null)));
  }
  function glossaryPage() {
    var kitchen = voice.kitchen(), count = T.list.length, view = "topic", catFilter = "all";
    var lede = kitchen
      ? count + " words from the world of AI, each with a picture from the kitchen. The 21 main terms have a page with a picture, an example and the chapter that explains them."
      : count + " terms from the world of AI, from model to governance, A to Z. The 21 main terms have a full page with an example, details and sources; the rest have a clear definition and the terms next to them.";
    var input = h("input", { id: "gl-search", type: "search", placeholder: "Filter the glossary", autocomplete: "off", spellcheck: "false" });
    var countEl = h("span", { class: "gloss-count", "aria-live": "polite" });
    var listEl = h("div", { class: "gl-list" });
    var chips = h("div", { class: "gl-filter", role: "group", "aria-label": "Show one group" });
    var viewBtns = h("div", { class: "gl-view", role: "group", "aria-label": "Order" });
    function chipBtn(id, label, zone) {
      var b = h("button", { type: "button", class: "gl-chip" + (id === catFilter ? " is-on" : ""), "aria-pressed": id === catFilter ? "true" : "false", "data-cat": id, "data-zone": zone || null },
        zone ? h("i", { class: "zdot", "aria-hidden": "true" }) : null, label);
      b.addEventListener("click", function () { catFilter = id; sk.$$(".gl-chip", chips).forEach(function (x) { var on = x.getAttribute("data-cat") === id; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); }); draw(); });
      return b;
    }
    chips.appendChild(chipBtn("all", "All"));
    T.cats.forEach(function (c) { chips.appendChild(chipBtn(c.id, c.title, c.zone)); });
    [["topic", "By topic"], ["az", "A to Z"]].forEach(function (v) {
      var b = h("button", { type: "button", class: "gl-chip" + (v[0] === view ? " is-on" : ""), "aria-pressed": v[0] === view ? "true" : "false", "data-view": v[0] }, v[1]);
      b.addEventListener("click", function () { view = v[0]; sk.$$("button", viewBtns).forEach(function (x) { var on = x.getAttribute("data-view") === view; x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); }); draw(); });
      viewBtns.appendChild(b);
    });
    function matches(t, q) { return (catFilter === "all" || t.cat === catFilter) && (!q || sk.stem(t.name + " " + t.aka.join(" ") + " " + T.line(t.id)).indexOf(q) !== -1); }
    function draw() {
      var q = sk.stem(input.value).trim(), shown = 0;
      if (lazy) lazy.disconnect();
      sk.clear(listEl);
      if (view === "topic") {
        T.cats.forEach(function (c) {
          var items = c.terms.filter(function (t) { return matches(t, q); });
          if (!items.length) return;
          shown += items.length;
          var hid = "gl-" + c.id;
          listEl.appendChild(h("section", { class: "ref-group", "data-zone": c.zone, "aria-labelledby": hid },
            h("h2", { class: "ref-group-title", id: hid }, h("i", { class: "zdot", "aria-hidden": "true" }), c.title, h("span", { class: "gl-group-n" }, String(items.length))),
            h("ul", { class: "gl-grid" }, items.map(termCard))));
        });
      } else {
        var items = T.list.filter(function (t) { return matches(t, q); }), letter = "", ul = null;
        shown = items.length;
        items.forEach(function (t) {
          var L = t.name[0].toUpperCase(); if (!/[A-Z]/.test(L)) L = "#";
          if (L !== letter) {
            letter = L;
            listEl.appendChild(h("h2", { class: "gl-letter", id: "gl-letter-" + L }, L));
            ul = h("ul", { class: "gl-grid" });
            listEl.appendChild(ul);
          }
          ul.appendChild(termCard(t));
        });
      }
      if (!shown) listEl.appendChild(h("p", { class: "gloss-empty" }, "No term matches “" + input.value + "”."));
      countEl.textContent = shown + " of " + count + " terms";
    }
    input.addEventListener("input", draw);
    draw();
    return h("article", { class: "page page-list page-glossary" },
      h("header", { class: "page-head" },
        h("p", { class: "eyebrow page-eyebrow" }, "Look it up"),
        h("h1", { class: "page-title" }, "Glossary"),
        h("p", { class: "page-lede" }, lede)),
      h("div", { class: "gl-tools" },
        h("div", { class: "search-field gl-search" }, h("label", { class: "visually-hidden", for: "gl-search" }, "Filter the glossary"), input),
        viewBtns, countEl),
      chips, listEl);
  }

  /* ---------- A guide ------------------------------------------------------------------------ */
  function guidePage(id) {
    var list = D.guideList, k = list.map(function (x) { return x.id; }).indexOf(id), g = voice.guide(id);
    var prev = list[(k + list.length - 1) % list.length], next = list[(k + 1) % list.length];
    var lede = h("p", { class: "page-lede" }, rich(g.lede));
    lede.hidden = !g.lede;
    var kind = voice.kitchen() ? "Told with the kitchen" : "Technical guide";
    return h("article", { class: "page page-guide", "data-guide": id },
      h("header", { class: "page-head" },
        h("a", { class: "crumb", href: url.guides() }, h("span", null, "← All guides")),
        h("p", { class: "eyebrow page-eyebrow" }, kind + " · " + g.minutes + " min read"),
        h("h1", { class: "page-title" }, g.title),
        lede),
      h("div", { class: "page-body" }, V3.guides.render[id]()),
      pager({ href: url.guide(prev.id), kind: "Previous guide", label: prev.menu }, { href: url.guide(next.id), kind: "Next guide", label: next.menu }));
  }

  /* ---------- The list of guides: a pinboard of notes ---------------------------------------------- */
  var NOTE_ZONE = { "how-it-works": "harness", context: "model", build: "tools", secure: "control", evaluate: "ops", compare: "orch", learn: "know" };
  function guidesPage() {
    var kitchen = voice.kitchen();
    return h("article", { class: "page page-list page-guides" },
      h("header", { class: "page-head" },
        h("p", { class: "eyebrow page-eyebrow" }, "Read in depth"),
        h("h1", { class: "page-title" }, "Guides"),
        h("p", { class: "page-lede" }, kitchen
          ? "Each guide takes one question from start to finish, told with the kitchen. Pick the one you need; they do not depend on each other."
          : "Each guide takes one question from start to finish, with the mechanisms, the failure modes and what to do about them. Terms link to the glossary.")),
      h("ul", { class: "note-grid" }, D.guideList.map(function (g, i) {
        var m = voice.guide(g.id), a = h("a", { class: "note-card", href: url.guide(g.id), "data-zone": NOTE_ZONE[g.id] || "start", style: "--tilt:" + [-0.7, 0.5, -0.3, 0.7, -0.5, 0.4, -0.6][i % 7] + "deg" },
          h("span", { class: "note-tape", "aria-hidden": "true" }),
          icon(g.icon, "note-icon", 9 + i),
          h("b", { class: "note-title" }, g.menu),
          h("span", { class: "note-hint" }, g.hint),
          h("span", { class: "note-meta" }, h("span", null, m.minutes + " min read"), m.sections ? h("span", null, m.sections.length + " parts") : null));
        sk.sketchBox(a, { seed: 61 + i * 13, boil: false, sw: 1.4, radius: 8, fill: "zt" });
        return h("li", null, a);
      })));
  }

  /* ---------- About ------------------------------------------------------------------------------ */
  function aboutPage() {
    return h("article", { class: "page page-about" },
      h("header", { class: "page-head" },
        h("p", { class: "eyebrow page-eyebrow" }, "About"),
        h("h1", { class: "page-title" }, "About this site")),
      h("div", { class: "page-body" }, V3.guides.about()));
  }

  V3.pages = { term: termPage, glossary: glossaryPage, guide: guidePage, guides: guidesPage, about: aboutPage, chLabel: chLabel, storyLink: storyLink, exampleBlock: exampleBlock };
})();
