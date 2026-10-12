/* Agentic AI, Explained (v8): the start of the comic. The chapters are the files page-0.js to page-9.js; scripts/check-v8.js lists the format. */
(window.COMIC.pages = window.COMIC.pages || []).push({
  n: 0, id: "start", hash: "", zone: "start",
  kicker: "A comic strip · one Saturday in a kitchen",
  title: "How an AI agent works",
  lead: "A restaurant kitchen explains it. The chef, the counter, the tools and the locks are all real parts of an AI agent.",
  panels: [
    {
      size: "w", zone: "harness", bg: "kitchen",
      alt: "A bright restaurant kitchen. The owner and the chef stand at the steel counter. Morning light comes through the window.",
      cap: "This is a restaurant kitchen. You own it. The chef at the counter has read every cookbook ever written.",
      scene: [
        ["window", 120, 150, { w: 110, h: 84 }],
        ["shelf", 700, 112, { w: 170 }],
        ["counter", 410, 258, { w: 360, h: 56 }],
        ["chef", 470, 202, { s: 1.08, mood: "happy", arms: "up", fx: [0, 20] }],
        ["owner", 270, 238, { s: 1.0, mood: "calm", arms: "out", d: 1 }],
        ["rays", 120, 108, { n: 7, r0: 70, r1: 86, k: "part", d: 2 }],
        ["tomato", 360, 202, { d: 3 }], ["tomato", 380, 202, { d: 3, r: 8 }],
        ["pot", 600, 202, { steam: 1, d: 3 }]
      ],
      say: [
        { t: "Morning, boss.", at: [58, 10], tail: "bl", w: 24 },
        { t: "Big order tomorrow.", at: [14, 14], tail: "br", w: 24 }
      ]
    },
    {
      size: "s", zone: "tools", bg: "kitchen",
      alt: "The owner points at an order ticket on the counter. The chef looks at it.",
      cap: "It is Friday evening, and you have one job for tomorrow.",
      scene: [
        ["counter", 280, 258, { w: 260, h: 54 }],
        ["owner", 100, 262, { mood: "calm", arms: "point" }],
        ["ticket", 236, 204, { t: "Sat", r: -4, fx: [-70, -10] }],
        ["chef", 336, 204, { s: 0.9, mood: "think", arms: "down", d: 2 }]
      ],
      say: [{ t: "Find the three cheapest market stalls for 20 kilos of tomatoes. Write them in the order book. Place the order once I say OK.", at: [3, 3], tail: "bl", w: 66 }]
    },
    {
      size: "s", zone: "model", bg: "kitchen",
      alt: "Four small drawings with labels: the chef, the counter, the tools and the locks.",
      cap: "Each chapter shows one part of the kitchen. Each part is a real part of an AI agent.",
      scene: [
        ["chef", 56, 182, { s: 0.62, mood: "happy", arms: "up" }],
        ["counter", 152, 196, { w: 64, h: 34 }],
        ["phone", 248, 176, { s: 1.15, ring: 1 }],
        ["padlock", 338, 186, { s: 1.5 }],
        ["label", 56, 222, { t: "the chef", size: 14, d: 3 }], ["label", 152, 222, { t: "the counter", size: 14, d: 3 }],
        ["label", 248, 222, { t: "the tools", size: 14, d: 3 }], ["label", 338, 222, { t: "the locks", size: 14, d: 3 }]
      ]
    },
    {
      size: "w", zone: "ops", bg: "plain",
      alt: "Three buttons, Back, Play and Next panel, and the left and right arrow keys.",
      cap: "Press **Next**, or the right arrow key, and the story grows one panel to the right. **Back** takes one away. **Play** tells it by itself.",
      scene: [
        ["pill", 250, 150, { t: "← Back", w: 130 }],
        ["pill", 410, 150, { t: "▶ Play", w: 130 }],
        ["pill", 590, 150, { t: "Next panel →", w: 170, f: "ink", tf: "paper", d: 1 }],
        ["keycap", 250, 262, { t: "←", d: 2 }], ["keycap", 590, 262, { t: "→", d: 2 }],
        ["arrowline", 0, 0, { pts: [[590, 112], [590, 86], [640, 70]], w: 2.6, d: 3 }],
        ["label", 700, 62, { t: "start here", size: 17, f: "clay", d: 4 }]
      ]
    }
  ]
});
