/* Demo "Cut text into tokens". Two parts, both computed live:
   - "Train your own": byte-pair encoding on a few lines of the visitor's text, one merge at a time;
   - "The real one": the byte-level BPE tokenizer of GPT-2. Its vocabulary (data/gpt2.js, about 1 MB) is loaded from this site only when asked for. */
(function () {
  "use strict";
  V3.demos.define("tokenizer", function (c) {
    var h = c.h, num = c.num;
    var tab = "train";

    /* ---------- Train your own ---------- */
    var SAMPLE = "the cat sat on the mat and the cat ate the rat";
    var words = [], merges = [], symbols = {}, startCount = 0, doneMsg = "";
    function setup(text) {
      var t = text.replace(/\s+/g, " ").trim();
      words = (t.match(/ ?[^ ]+/g) || []).map(function (w) { return Array.from(w); });
      merges = []; doneMsg = "";
      symbols = {};
      words.forEach(function (w) { w.forEach(function (ch) { symbols[ch] = 1; }); });
      startCount = words.reduce(function (n, w) { return n + w.length; }, 0);
    }
    function bestPair() {
      var counts = {}, order = [];
      words.forEach(function (w) {
        for (var i = 0; i < w.length - 1; i++) {
          var k = w[i] + "\u0001" + w[i + 1];
          if (!counts[k]) { counts[k] = 0; order.push(k); }
          counts[k]++;
        }
      });
      var best = null;
      order.forEach(function (k) { if (!best || counts[k] > counts[best]) best = k; });
      return best ? { a: best.split("\u0001")[0], b: best.split("\u0001")[1], n: counts[best] } : null;
    }
    function mergeOnce() {
      var p = bestPair();
      if (!p || p.n < 2) { doneMsg = p ? "No pair occurs twice any more, so nothing is worth merging. A real tokenizer is trained on billions of words and goes on for tens of thousands of merges." : "There is nothing left to merge."; return false; }
      words = words.map(function (w) {
        var out = [];
        for (var i = 0; i < w.length; i++) {
          if (i < w.length - 1 && w[i] === p.a && w[i + 1] === p.b) { out.push(p.a + p.b); i++; } else out.push(w[i]);
        }
        return out;
      });
      merges.push(p);
      return true;
    }
    function show(s) { return s.replace(/ /g, "·"); }
    function chips(list, ids) {
      return h("div", { class: "dm-tk-row" }, list.map(function (t, i) {
        return h("span", { class: "dm-tk dm-tk-" + (i % 4) }, h("span", { class: "dm-tk-t" }, show(t)), ids ? h("small", null, String(ids[i])) : null);
      }));
    }

    var trainBox = h("div", { class: "dm-tk-panel" }), realBox = h("div", { class: "dm-tk-panel" });
    var tIn = h("textarea", { class: "dm-tk-in", rows: "2", maxlength: "300", "aria-label": "Text to train on", spellcheck: "false" });
    tIn.value = SAMPLE;
    var tOut = h("div", { class: "dm-tk-out", "aria-live": "polite" }), tMerges = h("ol", { class: "dm-tk-merges" }), tStat = h("p", { class: "dm-tk-stat" });
    var b1 = h("button", { type: "button", class: "btn btn-sm btn-ink" }, "Merge the most frequent pair");
    var b2 = h("button", { type: "button", class: "btn btn-sm" }, "Merge until nothing repeats");
    var b3 = h("button", { type: "button", class: "btn btn-sm btn-ghost" }, "Start over");
    function drawTrain() {
      c.sk.clear(tOut); c.sk.clear(tMerges);
      var flat = [];
      words.forEach(function (w) { flat = flat.concat(w); });
      tOut.appendChild(chips(flat));
      merges.forEach(function (m) { tMerges.appendChild(h("li", null, h("code", null, show(m.a)), " + ", h("code", null, show(m.b)), " → ", h("code", null, show(m.a + m.b)), h("span", { class: "dm-tk-x" }, " found " + m.n + " times"))); });
      var next = bestPair();
      tStat.textContent = num(flat.length) + " tokens (it started with " + num(startCount) + " single characters). The vocabulary has " + (Object.keys(symbols).length + merges.length) + " entries: " + Object.keys(symbols).length + " characters and " + merges.length + " merges. " + (doneMsg || (next && next.n >= 2 ? "The next merge would join " + show(next.a) + " and " + show(next.b) + ", which occur together " + next.n + " times." : ""));
      b1.disabled = b2.disabled = !(next && next.n >= 2);
    }
    function reset() { setup(tIn.value); drawTrain(); }
    tIn.addEventListener("input", reset);
    b1.addEventListener("click", function () { mergeOnce(); drawTrain(); });
    b2.addEventListener("click", function () { var n = 0; while (n++ < 200 && mergeOnce()) { /* keep merging */ } drawTrain(); });
    b3.addEventListener("click", reset);
    trainBox.appendChild(h("p", { class: "dm-tk-help" }, "The tokenizer starts with single characters. Again and again it finds the pair of neighbours that occurs most often and glues it into one new piece. The text is cut only inside words; a space belongs to the word after it and is shown as a dot. Edit the text and it starts over."));
    [tIn, h("div", { class: "dm-steps" }, b1, b2, b3), tOut, tStat, h("h4", { class: "dm-tk-h" }, "Merges so far"), tMerges].forEach(function (n) { trainBox.appendChild(n); });
    setup(SAMPLE); drawTrain();

    /* ---------- The real one (GPT-2) ---------- */
    var PRESETS = [
      ["en", "English", "The quick brown fox jumps over the lazy dog."],
      ["de", "German", "Der schnelle braune Fuchs springt über den faulen Hund."],
      ["ja", "Japanese", "今日はとてもいい天気ですね。"],
      ["code", "Code", "def total(items):\n    return sum(i.price for i in items)"],
      ["num", "A long number", "3.14159265358979323846264338327950288"],
      ["name", "A rare name", "Wolfeschlegelsteinhausenbergerdorff"]
    ];
    var G = null, rank = null, b2u = null, u2b = null, vocab = null, ids = null, cache = {};
    var PAT = null;
    try { PAT = new RegExp("'s|'t|'re|'ve|'m|'ll|'d| ?\\p{L}+| ?\\p{N}+| ?[^\\s\\p{L}\\p{N}]+|\\s+(?!\\S)|\\s+", "gu"); } catch (e) { PAT = null; }
    function init() {
      G = window.AE_GPT2;
      vocab = G.vocab.split("\n");
      ids = {}; vocab.forEach(function (t, i) { ids[t] = i; });
      rank = {}; G.merges.split("\n").forEach(function (l, i) { rank[l] = i; });
      var bs = [], cs = [], n = 0, b;
      for (b = 33; b <= 126; b++) bs.push(b);
      for (b = 161; b <= 172; b++) bs.push(b);
      for (b = 174; b <= 255; b++) bs.push(b);
      cs = bs.slice();
      for (b = 0; b < 256; b++) if (bs.indexOf(b) < 0) { bs.push(b); cs.push(256 + n); n++; }
      b2u = {}; u2b = {};
      bs.forEach(function (x, i) { b2u[x] = String.fromCharCode(cs[i]); u2b[String.fromCharCode(cs[i])] = x; });
    }
    function bpe(token) {
      if (cache[token]) return cache[token];
      var word = Array.from(token);
      while (word.length > 1) {
        var best = -1, bestRank = Infinity, i;
        for (i = 0; i < word.length - 1; i++) { var r = rank[word[i] + " " + word[i + 1]]; if (r !== undefined && r < bestRank) { bestRank = r; best = i; } }
        if (best < 0) break;
        var a = word[best], bb = word[best + 1], out = [];
        for (i = 0; i < word.length; i++) {
          if (i < word.length - 1 && word[i] === a && word[i + 1] === bb) { out.push(a + bb); i++; } else out.push(word[i]);
        }
        word = out;
      }
      cache[token] = word;
      return word;
    }
    function encode(text) {
      var out = [], enc = new TextEncoder();
      (text.match(PAT) || []).forEach(function (piece) {
        var mapped = Array.prototype.map.call(enc.encode(piece), function (x) { return b2u[x]; }).join("");
        bpe(mapped).forEach(function (t) { out.push(t); });
      });
      return out;
    }
    function decode(t) {
      var bytes = Array.from(t).map(function (ch) { return u2b[ch]; });
      return new TextDecoder("utf-8").decode(new Uint8Array(bytes));
    }

    var rIn = h("textarea", { class: "dm-tk-in", rows: "3", maxlength: "2000", "aria-label": "Text to cut into tokens", spellcheck: "false" });
    rIn.value = PRESETS[0][2];
    var rOut = h("div", { class: "dm-tk-out", "aria-live": "polite" }), rStats = h("ul", { class: "dm-stats" });
    function drawReal() {
      c.sk.clear(rOut); c.sk.clear(rStats);
      var text = rIn.value, toks = encode(text);
      var shown = toks.map(function (t) { return decode(t).replace(/\n/g, "↵").replace(/\t/g, "→"); });
      rOut.appendChild(chips(shown, toks.map(function (t) { return ids[t]; })));
      var nChars = Array.from(text).length, nWords = (text.match(/\S+/g) || []).length;
      [[num(nChars), "characters"], [num(nWords), nWords === 1 ? "word" : "words"], [num(toks.length), toks.length === 1 ? "token" : "tokens"]].forEach(function (x) { rStats.appendChild(h("li", null, h("b", null, x[0]), h("span", null, x[1]))); });
      if (nWords) rStats.appendChild(h("li", null, h("b", null, (toks.length / nWords).toFixed(1)), h("span", null, "tokens per word")));
      if (toks.length) rStats.appendChild(h("li", null, h("b", null, (nChars / toks.length).toFixed(1)), h("span", null, "characters per token")));
    }
    rIn.addEventListener("input", drawReal);
    var presetPick = c.pick("Examples", PRESETS.map(function (p) { return [p[0], p[1]]; }), "en", function (id) { PRESETS.forEach(function (p) { if (p[0] === id) { rIn.value = p[2]; drawReal(); } }); });
    rIn.addEventListener("input", function () { presetPick.set(null); });
    function realReady() {
      c.sk.clear(realBox);
      [h("p", { class: "dm-tk-help" }, "This is the tokenizer of GPT-2, built with byte-pair encoding like the one in the other tab but trained on a large amount of text. The small number under each token is its number in the vocabulary, which is all the model ever sees."), presetPick, rIn, rOut, rStats,
        h("p", { class: "dm-tk-help" }, "Notice how short common words are one token, how a rare name or a long number falls into many, and how text in another script needs more tokens for the same meaning. A word with a space in front of it is a different token from the same word without one.")].forEach(function (n) { realBox.appendChild(n); });
      drawReal();
    }
    var loadBtn = h("button", { type: "button", class: "btn btn-sm btn-ink" }, "Load the real tokenizer");
    var loadMsg = h("p", { class: "dm-tk-help", "aria-live": "polite" });
    function realStart() {
      c.sk.clear(realBox);
      if (!PAT || typeof TextEncoder === "undefined") { realBox.appendChild(h("p", { class: "dm-tk-help" }, "This browser is too old for the real tokenizer. The one on the left works everywhere.")); return; }
      realBox.appendChild(h("p", { class: "dm-tk-help" }, "The real tokenizer needs its vocabulary, a file of about 1 MB. It comes from this site, goes nowhere else, and is loaded only if you press the button."));
      realBox.appendChild(loadBtn); realBox.appendChild(loadMsg);
    }
    loadBtn.addEventListener("click", function () {
      if (window.AE_GPT2) { init(); realReady(); return; }
      loadBtn.disabled = true; loadMsg.textContent = "Loading…";
      var s = document.createElement("script");
      s.src = c.url.base + "assets/js/data/gpt2.js";
      s.onload = function () { init(); realReady(); };
      s.onerror = function () { loadBtn.disabled = false; loadMsg.textContent = "The file could not be loaded. Try again."; };
      document.body.appendChild(s);
    });
    if (window.AE_GPT2) { init(); realReady(); } else realStart();

    /* ---------- The two tabs ---------- */
    var picker = c.pick("Which tokenizer", [["train", "Train your own"], ["real", "The real one (GPT-2)"]], "train", function (v) { tab = v; trainBox.hidden = v !== "train"; realBox.hidden = v !== "real"; });
    realBox.hidden = true;
    c.body.appendChild(picker);
    c.body.appendChild(trainBox);
    c.body.appendChild(realBox);
  });
})();
