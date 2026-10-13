/* Agentic AI, Explained (v8): page 1, the chef (the language model). */
(window.COMIC.pages = window.COMIC.pages || []).push({
  n: 1, id: "chef", hash: "ch-1", zone: "model",
  title: "The chef",
  lead: "The chef has read every cookbook ever written, and forgets each order the moment it is served.",
  panels: [
    {
      size: "s", bg: "kitchen",
      alt: "The chef stands calmly in the middle of towering stacks of cookbooks, a full shelf behind, one hand on the chin.",
      cap: "The chef has read every cookbook ever written, and learned nothing else. That is the whole skill: knowing what usually comes next.",
      scene: [
        ["shelf", 200, 118, { w: 300 }],
        ["books", 62, 240, { n: 9 }], ["books", 336, 240, { n: 11 }],
        ["books", 112, 240, { n: 4 }], ["books", 292, 240, { n: 5 }],
        ["chef", 200, 236, { s: 1.0, mood: "think", arms: "think", d: 2 }],
        ["cookbook", 150, 240, { zone: "tools", r: -8, d: 3 }], ["cookbook", 252, 240, { zone: "ops", r: 6, d: 3 }]
      ],
      say: [{ t: "I have read every one of them.", at: [30, 4], tail: "br", w: 44 }]
    },
    {
      size: "s", bg: "kitchen",
      alt: "The chef points at a menu card where word pieces appear one by one: Fresh, tom, ato, soup, and an empty box for the next piece.",
      cap: "The chef writes the menu one small word-piece at a time. A chef who plans every step first (a **reasoning** chef) starts slower, but fewer dishes burn.",
      scene: [
        ["note", 244, 112, { w: 284, h: 78, f: "paper", t: " " }],
        ["label", 150, 62, { t: "Menu", size: 13, f: "ink3", d: 1 }],
        ["note", 156, 98, { w: 52, h: 34, t: "Fresh", size: 15, fx: [-16, 0], d: 2 }],
        ["note", 210, 98, { w: 44, h: 34, t: "tom", size: 15, fx: [-16, 0], d: 4 }],
        ["note", 258, 98, { w: 44, h: 34, t: "ato", size: 15, fx: [-16, 0], d: 6 }],
        ["note", 313, 98, { w: 58, h: 34, t: "soup", size: 15, fx: [-16, 0], d: 8 }],
        ["note", 362, 98, { w: 30, h: 34, t: "?", size: 17, f: "paper", d: 10 }],
        ["chef", 86, 238, { s: 0.9, mood: "think", arms: "up", d: 1 }],
        ["tomato", 330, 240, { d: 3 }], ["tomato", 356, 240, { d: 3, r: 8 }], ["tomato", 343, 219, { d: 3 }]
      ],
      say: [{ t: "What usually comes next?", at: [34, 52], tail: "bl", k: "think", w: 36 }]
    },
    {
      size: "s", bg: "kitchen",
      alt: "The owner asks the price of tomatoes. The chef answers with a confident smile, but the cookbooks behind it stop at a calendar page.",
      cap: "The cookbooks stop on a fixed date. So the chef answers with a confident guess from memory, and the guess is old.",
      scene: [
        ["shelf", 330, 118, { w: 120 }],
        ["calendar", 340, 196, { t: "THE END", d: 1 }],
        ["owner", 62, 238, { s: 0.95, mood: "calm", arms: "out" }],
        ["chef", 214, 238, { s: 1.0, mood: "proud", arms: "hips", d: 2 }],
        ["bang", 262, 100, { d: 4 }]
      ],
      say: [
        { t: "What do tomatoes cost today?", at: [3, 5], tail: "bl", w: 44 },
        { t: "Easy. They cost what they always cost.", at: [50, 5], tail: "bl", w: 46 }
      ]
    },
    {
      size: "s", bg: "kitchen",
      alt: "The finished dish sits on the counter. The sleepy chef has an empty thought cloud while old order tickets drift away.",
      cap: "Once the dish is served, the chef forgets the order. The next order starts from a blank mind.",
      scene: [
        ["chef", 140, 238, { s: 0.95, mood: "sleepy", arms: "down", d: 1 }],
        ["counter", 150, 250, { w: 236, h: 54 }],
        ["plate", 80, 185, { d: 3 }], ["cloche", 80, 185, { d: 4 }],
        ["zz", 176, 76, { d: 5 }],
        ["ticket", 288, 120, { t: "Fri", r: 18, fx: [-60, 30], amb: "amb-bob", d: 2 }],
        ["ticket", 340, 176, { t: "Wed", r: -14, fx: [-70, 24], amb: "amb-bob", d: 3 }],
        ["ticket", 352, 92, { t: "Mon", r: 30, fx: [-80, 26], amb: "amb-bob", d: 4 }]
      ],
      say: [{ t: "\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0", at: [8, 4], tail: "br", k: "think", w: 26 }]
    }
  ],
  names: [
    { kw: "the chef", term: "language model", id: "model", def: "A model trained on huge amounts of text to predict what comes next. It reads and writes text, piece by piece." },
    { kw: "the planning chef", term: "reasoning model", id: "reasoning", def: "A reasoning model, also called a thinking model, works through a problem step by step before it answers." }
  ]
});
