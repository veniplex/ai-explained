/* Demo "The lethal trifecta": three abilities that together make a hidden instruction dangerous. Computed live (a rule, not a model). */
(function () {
  "use strict";
  V3.demos.define("trifecta", function (c) {
    var h = c.h;
    var LEGS = [
      ["data", "It can read private data", "your files, mail, database, code, secrets"],
      ["untrusted", "It reads content that others can write", "web pages, incoming mail, tickets, comments, documents from outside"],
      ["out", "It can send things out", "web requests, email, links or images in its answers, writing to a shared place"]
    ];
    var PRESETS = [
      ["code", "Coding agent with web access", { data: 1, untrusted: 1, out: 1 }],
      ["mail", "Email assistant", { data: 1, untrusted: 1, out: 1 }],
      ["notes", "Notes helper on your own files", { data: 1, untrusted: 0, out: 0 }],
      ["web", "Web researcher with no files", { data: 0, untrusted: 1, out: 1 }],
      ["own", "Reports from your own database", { data: 1, untrusted: 0, out: 1 }]
    ];
    var state = { data: 1, untrusted: 1, out: 1 }, boxes = {}, verdict = h("div", { class: "dm-tri-verdict", "aria-live": "polite" });

    function ruleOut(missing) {
      return {
        data: ["No private data in reach.", "There is nothing secret to steal, but a hidden instruction can still make the agent act outward: send messages or call services in your name. Keep a person in the loop for anything that leaves."],
        untrusted: ["Nobody else can plant an instruction.", "Only text you control reaches the agent. The risk moves to your own inputs and to anything that is added later, so keep the two other abilities in mind when the inputs change."],
        out: ["No way out.", "A hidden instruction cannot send your data anywhere by itself. It can still steer the agent's work and corrupt what it writes, so check what it produces before anything relies on it."]
      }[missing];
    }
    function draw() {
      var on = LEGS.filter(function (l) { return state[l[0]]; }), n = on.length, cls, head, text, fixes = null;
      if (n === 3) {
        cls = "bad"; head = "All three: dangerous.";
        text = "A page, mail or file written by someone else can carry an instruction. The agent can read your private data and has a way to send it out, so a hidden instruction can make it do exactly that. Take one of the three away.";
        fixes = ["Close the way out: allow only listed addresses, and do not render links or images from the model's output.", "Keep private data out of reach: give the agent only the files and accounts this one task needs.", "Keep untrusted content away from the agent that holds the data: let a separate agent with no data and no way out read it and hand over a short summary."];
      } else if (n === 2) {
        var missing = LEGS.filter(function (l) { return !state[l[0]]; })[0][0], r = ruleOut(missing);
        cls = "part"; head = "Two of three. " + r[0]; text = r[1];
      } else if (n === 1) {
        cls = "ok"; head = "One of three."; text = "A hidden instruction has little to work with. Each ability you add later changes this, so check again then.";
      } else { cls = "ok"; head = "None of the three."; text = "An agent that reads nothing from outside, holds no private data and cannot send anything out has little to leak. It also has little to do."; }
      c.sk.clear(verdict);
      verdict.className = "dm-tri-verdict dm-tri-" + cls;
      verdict.appendChild(h("p", { class: "dm-tri-head" }, head));
      verdict.appendChild(h("p", null, text));
      if (fixes) verdict.appendChild(h("ul", null, fixes.map(function (f) { return h("li", null, f); })));
      // The three abilities as a row of marks: on, off.
      LEGS.forEach(function (l) { boxes[l[0]].input.checked = !!state[l[0]]; });
    }
    var picker = c.pick("Examples", PRESETS.map(function (p) { return [p[0], p[1]]; }), "code", function (id) {
      PRESETS.forEach(function (p) { if (p[0] === id) { LEGS.forEach(function (l) { state[l[0]] = p[2][l[0]]; }); } });
      draw();
    });
    var legs = h("div", { class: "dm-controls dm-tri-legs" }, LEGS.map(function (l) {
      var t = c.toggle(l[1], state[l[0]], function (v) { state[l[0]] = v ? 1 : 0; picker.set(null); draw(); }, l[2]);
      boxes[l[0]] = t;
      return t;
    }));
    c.body.appendChild(picker);
    c.body.appendChild(legs);
    c.body.appendChild(verdict);
    draw();
  });
})();
