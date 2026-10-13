/* Agentic AI, Explained (v8): page 8, running the kitchen. */
(window.COMIC.pages = window.COMIC.pages || []).push({
  n: 8, id: "kitchen-ops", hash: "ch-8", zone: "ops",
  title: "Running the kitchen",
  lead: "A good kitchen tastes its food, watches its bill and answers to an inspector.",
  panels: [
    {
      size: "s", zone: "ops", bg: "kitchen",
      alt: "The chef nervously offers a plate to a table of three judges with score cards. A stack of calendar pages for twenty past Saturdays hangs on the wall.",
      cap: "A taste panel tries the chef on twenty past Saturdays. These tests are called **evals**.",
      scene: [
        ["calendar", 66, 96, { t: "Sat", r: -4 }], ["calendar", 74, 100, { t: "Sat", r: 3 }], ["calendar", 70, 104, { t: "Sat", r: -1 }],
        ["label", 108, 84, { t: "20 Saturdays", size: 12, f: "ink3", italic: true, anchor: "start" }],
        ["person", 235, 232, { s: 0.8, mood: "calm", arms: "down", shirt: "m-know" }],
        ["person", 290, 232, { s: 0.8, mood: "think", arms: "down", shirt: "m-tools", hair: "p3" }],
        ["person", 345, 232, { s: 0.8, mood: "happy", arms: "down", shirt: "m-model" }],
        ["counter", 290, 258, { w: 200, h: 42 }],
        ["scorecard", 235, 205, { t: " ", size: 14, s: 0.8 }], ["check", 235, 190, { d: 3, s: 0.8 }],
        ["scorecard", 290, 205, { t: " ", size: 14, s: 0.8 }], ["check", 290, 190, { d: 3, s: 0.8 }],
        ["scorecard", 345, 205, { t: " ", size: 14, s: 0.8 }], ["check", 345, 190, { d: 3, s: 0.8 }],
        ["chef", 80, 240, { s: 0.85, mood: "worried", arms: "give" }],
        ["plate", 170, 205, { c: "clay", fx: [-40, 0], d: 4 }]
      ],
      say: [
        { t: "It picks well in 17 of 20.", at: [34, 5], tail: "br", w: 44, from: "tl" }
      ]
    },
    {
      size: "s", zone: "ops", bg: "kitchen",
      alt: "A camera on the wall films the kitchen. On the counter lies a film strip of four pictures: a ticket, a phone, a soft tomato circled in red, and the order book. The owner points at the circled one.",
      cap: "Cameras record every step, so you can see the exact frame where a dish went wrong.",
      scene: [
        ["camera", 345, 78, { flip: true }],
        ["counter", 225, 258, { w: 300, h: 44 }],
        ["owner", 38, 240, { s: 0.72, mood: "think", arms: "point" }],
        ["c_film", 225, 207, { bad: 2, fx: [0, -20] }],
        ["c_ring", 259, 160, { rx: 40, ry: 44, d: 3 }],
        ["bang", 306, 106, { d: 4 }]
      ],
      say: [
        { t: "This is where it went wrong.", at: [6, 5], tail: "bl", w: 48 }
      ]
    },
    {
      size: "w", zone: "ops", bg: "kitchen",
      alt: "Two pictures side by side. Before: a chef looks worried behind a cluttered counter, and a very long receipt stands beside it. After: a tidy counter, the chef calm, a small cheaper chef doing the easy steps, and a short receipt.",
      cap: "Every word the chef reads and writes is paid for, as **tokens**. A cluttered counter makes a long bill. A tidy counter and a cheaper chef for the easy steps make a short one.",
      scene: [
        ["label", 70, 40, { t: "before", size: 20, f: "ink3" }],
        ["label", 482, 40, { t: "after", size: 20, f: "ink3" }],
        ["chef", 118, 206, { s: 0.95, mood: "worried", arms: "hold" }],
        ["counter", 190, 258, { w: 240, h: 56 }],
        ["pile", 218, 191, { n: 8 }],
        ["c_receipt", 345, 240, { h: 178, d: 2 }],
        ["arrowline", 0, 0, { pts: [[392, 130], [430, 124]], d: 3 }],
        ["chef", 520, 206, { s: 0.95, mood: "proud", arms: "out" }],
        ["counter", 600, 258, { w: 240, h: 56 }],
        ["ticket", 560, 191, { t: "Sat", r: -3 }],
        ["chef", 668, 206, { s: 0.6, mood: "happy", arms: "hold", d: 1 }],
        ["note", 668, 128, { w: 82, h: 24, t: "easy steps", f: "paper", size: 11 }],
        ["c_receipt", 770, 240, { h: 62, d: 2 }]
      ],
      say: [
        { t: "I reread it all each time.", at: [20, 12], tail: "l", w: 18 }
      ]
    },
    {
      size: "w", zone: "ops", bg: "kitchen",
      alt: "A health inspector with a clipboard stands by a rule book on a small counter. On the wall hangs a log of orders the chef tried to place: two ticked as allowed and one crossed as refused. The chef stands by the till.",
      cap: "The health inspector has a rule book and a log of every order the chef tried to place, allowed or not.",
      scene: [
        ["c_logpage", 520, 215, { title: "Orders the chef tried", w: 250, rows: [["order at stall 1: allowed", true], ["premium tomatoes: refused", false], ["order over budget: refused", false]] }],
        ["person", 118, 240, { s: 1.0, mood: "calm", arms: "down", shirt: "m-ops", hat: "cap", clip: true }],
        ["counter", 260, 258, { w: 100, h: 44 }],
        ["c_rulebook", 260, 203, { s: 1.15, fx: [0, -14], d: 2 }],
        ["counter", 735, 258, { w: 110, h: 44 }],
        ["till", 710, 203, { }],
        ["chef", 770, 205, { s: 0.85, mood: "calm", arms: "down", flip: true }]
      ],
      say: [
        { t: "Show me the rules and the log.", at: [22, 8], tail: "l", w: 20 }
      ]
    }
  ],
  names: [
    { kw: "taste panel", term: "Evals & observability", id: "evals", def: "Evals are tests for AI: real tasks with clear pass or fail criteria." },
    { kw: "the bill", term: "Cost & providers", id: "cost", def: "AI is billed per token: the small pieces of text that go in and come out." },
    { kw: "health inspector", term: "Governance & regulation", id: "governance", def: "Governance means the policies, records and legal duties around using AI in an organisation." }
  ]
});
