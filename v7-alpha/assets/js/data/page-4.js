/* Agentic AI, Explained (v7): page 4, the tasting circle (the agent loop and the harness). */
(window.COMIC.pages = window.COMIC.pages || []).push({
  n: 4, id: "loop", hash: "ch-4", zone: "harness",
  title: "Taste, adjust, taste again",
  lead: "A good chef cooks a little, tastes, and decides the next move, again and again, until the dish is right.",
  panels: [
    {
      size: "w", bg: "kitchen",
      alt: "Four small pictures go round a circle of arrows: the chef looks at the counter, picks one move, a phone does it, and the answer lands on the counter.",
      cap: "The chef looks at the counter and picks one move. A tool does it, and the result lands on the counter. Then the chef looks again: this tasting circle is the **agent loop**.",
      scene: [
        ["b_card", 190, 82, { w: 204, h: 112 }], ["b_card", 630, 82, { w: 204, h: 112 }],
        ["b_card", 190, 222, { w: 204, h: 112 }], ["b_card", 630, 222, { w: 204, h: 112 }],
        ["cycle", 410, 152, { r: 56 }],
        ["label", 410, 158, { t: "again", size: 17, f: "clay" }],
        /* 1 look at the counter */
        ["label", 190, 49, { t: "look at the counter", size: 17 }],
        ["counter", 232, 128, { w: 78, h: 26 }],
        ["ticket", 212, 103, { t: "Sat", s: 0.62 }], ["note", 238, 103, { s: 0.7 }], ["tomato", 258, 103, { r: 9, s: 0.9 }],
        ["chef", 150, 126, { s: 0.46, mood: "calm", arms: "point" }],
        /* 2 pick one move */
        ["label", 630, 49, { t: "pick one move", size: 17 }],
        ["chef", 575, 126, { s: 0.46, mood: "think", arms: "think" }],
        ["b_dots", 0, 0, { pts: [[594, 108], [604, 100]], rs: [3, 4.5] }],
        ["b_cloud", 650, 96, { w: 84, h: 52, inside: ["phone", 0, 12, { s: 0.7 }] }],
        /* 3 a tool does it */
        ["label", 630, 189, { t: "a tool does it", size: 17 }],
        ["phone", 596, 262, { s: 1.05, ring: 1 }],
        ["orderbook", 676, 262, { s: 0.85 }],
        /* 4 the result lands */
        ["label", 190, 189, { t: "the result lands", size: 17 }],
        ["counter", 190, 266, { w: 100, h: 26 }],
        ["tag", 190, 232, { t: "1,80", s: 1.1, fx: [0, -26] }],
        /* numbers */
        ["b_num", 100, 38, { t: "1" }], ["b_num", 540, 38, { t: "2" }], ["b_num", 540, 178, { t: "3" }], ["b_num", 100, 178, { t: "4" }]
      ],
      say: []
    },
    {
      size: "w", zone: "tools", bg: "market",
      alt: "The chef phones four market stalls in a row. The first two answer, the third has a sold-out board, so the chef rings the fourth.",
      cap: "The chef phones the first stall, then the second. The third is sold out, so the chef rings the next one.",
      scene: [
        ["window", 52, 170, { w: 56, h: 48 }],
        ["counter", 150, 262, { w: 170, h: 52 }],
        ["chef", 150, 214, { s: 0.95, mood: "think", arms: "hold" }],
        ["phone", 105, 204, { s: 0.9 }],
        ["stall", 330, 236, { s: 0.74 }], ["stall", 440, 236, { s: 0.74 }], ["stall", 550, 236, { s: 0.74 }], ["stall", 660, 236, { s: 0.74 }],
        ["tag", 330, 150, { t: "1,80", s: 1 }],
        ["check", 440, 150, { s: 1.3 }],
        ["b_soldout", 550, 214, { s: 1.1 }], ["cross", 550, 150, { s: 1.4 }],
        ["phone", 660, 158, { s: 0.9, ring: 1, d: 3 }]
      ],
      say: [
        { t: "Stall one, your price?", at: [3, 5], tail: "bl", w: 21 },
        { t: "1.80 euros a kilo today.", at: [31, 4], tail: "bl", w: 19 },
        { t: "Sorry, sold out.", at: [56, 4], tail: "bl", w: 14 },
        { t: "RING", at: [83, 12], k: "sfx" }
      ]
    },
    {
      size: "s", bg: "kitchen",
      alt: "The chef tastes a firm tomato. Beside it the order book has three lines, a budget note says 60 and the till stays locked.",
      cap: "The chef tastes the prices against your budget and the soft-tomato rule, then writes three lines in the order book. Placing the order still waits for your OK.",
      scene: [
        ["note", 42, 104, { t: "60", w: 44, h: 40, size: 18 }], ["note", 92, 98, { t: "firm", w: 50, h: 40, size: 14, f: "oks" }],
        ["counter", 250, 262, { w: 290, h: 56 }],
        ["chef", 140, 206, { s: 0.95, mood: "taste", arms: "hold" }],
        ["spoon", 148, 176, { s: 0.7 }],
        ["tomato", 176, 202, {}],
        ["orderbook", 240, 200, { s: 1.15, lines: 3 }],
        ["check", 240, 156, { s: 1.1, d: 2 }],
        ["till", 330, 198, { s: 1.0 }],
        ["padlock", 330, 192, { s: 1.0, d: 3 }]
      ],
      say: [{ t: "Firm, and under 60. That will do.", at: [46, 4], tail: "bl", w: 34, k: "think" }, { t: "Wait for OK", at: [70, 30], k: "sign", w: 24 }]
    },
    {
      size: "s", bg: "plain",
      alt: "Three ways out of the circle: a plate with a tick for a dish that is right, a stop sign for the owner's limit, and the chef with a hand up for being stuck.",
      cap: "The circle stops when the dish is right, when your limit is reached, or when the chef is stuck and asks you. Without a limit it could taste forever.",
      scene: [
        ["cycle", 200, 68, { r: 28 }],
        ["arrowline", 0, 0, { pts: [[172, 90], [100, 124]], w: 2.4, head: 9 }],
        ["arrowline", 0, 0, { pts: [[200, 100], [200, 124]], w: 2.4, head: 9 }],
        ["arrowline", 0, 0, { pts: [[228, 90], [300, 124]], w: 2.4, head: 9 }],
        ["plate", 80, 212, { s: 1.1 }], ["check", 80, 160, { s: 1.5 }],
        ["b_stop", 200, 232, { s: 1.1 }],
        ["chef", 318, 238, { s: 0.7, mood: "worried", arms: "up" }], ["ques", 352, 150, { s: 1.2 }],
        ["label", 80, 264, { t: "the dish is right", size: 13 }],
        ["label", 200, 264, { t: "your limit", size: 13 }],
        ["label", 318, 264, { t: "stuck, so ask", size: 13 }]
      ],
      say: []
    },
    {
      size: "w", zone: "harness", bg: "kitchen",
      alt: "The owner hands over an order. Inside a dashed kitchen frame the chef stands at the counter in the circle of arrows, with tools beside and the house rules on the wall.",
      cap: "Chef, counter, tools and the tasting circle together make an **agent**. The kitchen around them keeps the house rules.",
      scene: [
        ["b_frame", 236, 34, { w: 560, h: 234 }],
        ["label", 516, 28, { t: "the kitchen around the chef keeps the house rules", size: 17, f: "ink3" }],
        ["sheet", 300, 138, { w: 92, title: "House rules", lines: ["soft never", "OK first"] }],
        ["b_tape", 300, 70, {}],
        ["cycle", 460, 148, { r: 74 }],
        ["counter", 460, 258, { w: 190, h: 54 }],
        ["chef", 460, 208, { s: 1.0, mood: "think", arms: "hold" }],
        ["counter", 680, 258, { w: 160, h: 54 }],
        ["phone", 622, 200, { s: 1.0 }], ["orderbook", 676, 200, { s: 0.8 }], ["pot", 748, 200, { s: 0.7, steam: 1 }],
        ["owner", 110, 240, { s: 1.0, mood: "calm", arms: "give" }],
        ["ticket", 205, 196, { t: "Sat", fx: [-60, 0], r: -4 }],
        ["label", 110, 280, { t: "you", size: 19 }],
        ["label", 460, 284, { t: "chef + counter + circle", size: 19 }],
        ["label", 680, 284, { t: "tools", size: 19 }]
      ],
      say: [{ t: "Wait for my OK.", at: [2, 8], tail: "bl", w: 20 }]
    }
  ],
  names: [
    { kw: "The tasting circle", term: "Agent loop", id: "agent-loop", def: "The cycle that turns a model into an agent: look, act, see the result, repeat." },
    { kw: "The kitchen around the chef", term: "Harness", id: "harness", def: "The harness is the app around the model: it runs the agent loop and does what the model cannot." }
  ]
});
