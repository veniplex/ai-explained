/* Agentic AI, Explained (v8): page 3, tools ("Knives, pots and one plug"). */
(window.COMIC.pages = window.COMIC.pages || []).push({
  n: 3, id: "tools", hash: "ch-3", zone: "tools",
  title: "Knives, pots and one plug",
  lead: "Give the chef knives, pots and an oven, and talk turns into cooking.",
  panels: [
    {
      size: "s", bg: "kitchen",
      alt: "The chef shrugs with empty hands at a bare counter and can only describe a soup.",
      cap: "Without tools the chef can only talk. It can describe a dish, but it cannot cook one or look anything up.",
      scene: [
        ["chef", 200, 238, { s: 1.15, mood: "worried", arms: "shrug", d: 1 }],
        ["counter", 200, 256, { w: 300, h: 56 }],
        ["ques", 320, 90, { d: 3 }]
      ],
      say: [{ t: "I can tell you about a soup. I cannot make one.", at: [4, 4], tail: "br", w: 50 }]
    },
    {
      size: "s", bg: "kitchen",
      alt: "The owner hands over a phone and the order book, which slide onto the counter. The chef opens both hands.",
      cap: "You hand the chef two tools: a phone with the numbers of the market stalls, and the order book.",
      scene: [
        ["owner", 62, 238, { s: 0.95, mood: "happy", arms: "give" }],
        ["counter", 240, 252, { w: 200, h: 56 }],
        ["chef", 338, 238, { s: 0.9, mood: "happy", arms: "out", d: 1 }],
        ["phone", 190, 185, { fx: [-110, -30], d: 2 }],
        ["orderbook", 256, 185, { lines: 0, fx: [-150, -30], d: 3 }],
        ["label", 190, 142, { t: "phone", size: 13, f: "ink3", d: 5 }],
        ["label", 256, 124, { t: "order book", size: 13, f: "ink3", d: 5 }]
      ],
      say: [{ t: "Two tools for you.", at: [8, 6], tail: "bl", w: 40 }]
    },
    {
      size: "w", bg: "kitchen",
      alt: "The chef asks for the phone. It rings and a market stall far away answers with today's price, which lands on the counter as a price tag.",
      cap: "The chef never touches anything itself. It says which tool it wants, the kitchen does it, and the answer lands on the counter.",
      scene: [
        ["stall", 640, 240, { t: "Stall 1", d: 3 }],
        ["person", 740, 240, { s: 0.95, hat: "cap", mood: "happy", arms: "up", d: 4 }],
        ["chef", 90, 240, { s: 1.1, mood: "calm", arms: "pointl", flip: true, d: 1 }],
        ["counter", 230, 254, { w: 220, h: 56 }],
        ["phone", 250, 187, { ring: 1, d: 2 }],
        ["a_wire", 0, 0, { pts: [[280, 168], [380, 120], [480, 176], [560, 130]], d: 5 }],
        ["tag", 196, 187, { t: "1.80", s: 1.3, fx: [120, -50], d: 7 }]
      ],
      say: [
        { t: "Ring the first stall.", at: [3, 5], tail: "bl", w: 26 },
        { t: "RING", at: [38, 36], k: "sfx" },
        { t: "1.80 euros a kilo today.", at: [56, 6], tail: "br", w: 30 }
      ]
    },
    {
      size: "w", bg: "kitchen",
      alt: "Six different appliances stand on a long counter. Their cords hang down and all plug into one socket strip on the floor.",
      cap: "Appliances come from many makers. One standard plug (the **MCP**) means any of them fits any socket, with no special adapter.",
      scene: [
        ["counter", 410, 160, { w: 740, h: 50 }],
        ["oven", 100, 99, { fire: 1, d: 1 }],
        ["phone", 216, 99, { d: 1 }],
        ["pot", 330, 99, { steam: 1, d: 1 }],
        ["notebook", 490, 99, { d: 1 }],
        ["pan", 590, 99, { d: 1 }],
        ["orderbook", 710, 99, { lines: 0, d: 1 }],
        ["strip", 410, 238, { n: 6, d: 2 }],
        ["a_cord", 0, 0, { pts: [[100, 99], [100, 150], [300, 170], [312, 214]], d: 3 }],
        ["a_cord", 0, 0, { pts: [[216, 99], [216, 150], [340, 190], [350, 214]], d: 3 }],
        ["a_cord", 0, 0, { pts: [[330, 99], [330, 160], [384, 190], [388, 214]], d: 3 }],
        ["a_cord", 0, 0, { pts: [[490, 99], [490, 160], [440, 190], [426, 214]], d: 3 }],
        ["a_cord", 0, 0, { pts: [[590, 99], [590, 150], [490, 190], [464, 214]], d: 3 }],
        ["a_cord", 0, 0, { pts: [[710, 99], [710, 160], [540, 180], [502, 214]], d: 3 }]
      ],
      say: [{ t: "One plug fits all.", at: [44, 3], k: "sign", w: 30 }]
    }
  ],
  names: [
    { kw: "the knives, pots and phone", term: "tools", id: "tools", def: "A tool is something the model can ask to have done, such as a search or a new row in a table." },
    { kw: "the standard plug", term: "MCP", id: "mcp", def: "MCP, the Model Context Protocol, is an open standard for connecting AI applications to other software." }
  ]
});
