/* Agentic AI, Explained (v7): page 2, the counter (the context). */
(window.COMIC.pages = window.COMIC.pages || []).push({
  n: 2, id: "counter", hash: "ch-2", zone: "harness",
  title: "The counter",
  lead: "The chef can only work with what lies on the counter, and the counter has a fixed size.",
  panels: [
    {
      size: "w", bg: "kitchen",
      alt: "The chef reads behind a long counter. On it lie today's order ticket, the owner's notes and a pile of old tickets. The house rules are pinned to the wall.",
      cap: "Everything the chef can use lies on the counter (the **context**): your order, your notes, the house rules and every earlier ticket. What is not on the counter, the chef cannot know.",
      scene: [
        ["sheet", 92, 168, { title: "House rules", lines: ["Be polite.", "Ask first."], w: 104 }],
        ["chef", 410, 240, { s: 1.2, mood: "think", arms: "down", d: 1 }],
        ["counter", 410, 254, { w: 720, h: 56 }],
        ["ticket", 232, 187, { t: "Sat", r: -4, d: 2 }],
        ["note", 300, 187, { w: 50, h: 40, r: 3, d: 3 }],
        ["note", 352, 187, { w: 50, h: 40, r: -5, f: "soft", d: 3 }],
        ["pile", 560, 187, { n: 7, d: 4 }],
        ["ticket", 650, 187, { r: 6, d: 5 }],
        ["ticket", 690, 187, { r: -3, d: 5 }]
      ],
      say: [
        { t: "The order", at: [23, 36], k: "sign", w: 16 },
        { t: "Notes", at: [37, 22], k: "sign", w: 16 },
        { t: "Old tickets", at: [63, 28], k: "sign", w: 22 }
      ]
    },
    {
      size: "s", bg: "kitchen",
      alt: "The chef scratches its head while tickets, notes and the house rules slide in from both sides onto the counter, laid out again.",
      cap: "The chef forgets, so before every move the whole pile is laid out again. The chef reads all of it, every time.",
      scene: [
        ["chef", 200, 238, { s: 1.0, mood: "oops", arms: "think", d: 1 }],
        ["counter", 200, 252, { w: 340, h: 56 }],
        ["sheet", 70, 130, { title: "Rules", lines: ["Ask first."], w: 92, fx: [-70, 0], d: 1 }],
        ["ticket", 96, 185, { t: "Sat", fx: [-90, 0], d: 3 }],
        ["note", 140, 185, { w: 44, h: 36, fx: [-80, 0], d: 4 }],
        ["note", 262, 185, { w: 44, h: 36, f: "soft", fx: [80, 0], d: 4 }],
        ["pile", 322, 185, { n: 5, fx: [90, 0], d: 3 }]
      ],
      say: [{ t: "Wait, who are you again?", at: [44, 3], tail: "bl", k: "think", w: 38 }]
    },
    {
      size: "s", bg: "kitchen",
      alt: "The counter is buried under a huge pile. Only the corner of a note saying no soft tomatoes peeks out. The worried chef cannot find it.",
      cap: "The counter has a fixed size (the **context window**). When it is cluttered, the owner's rule gets buried under old scraps.",
      scene: [
        ["chef", 240, 238, { s: 1.0, mood: "worried", arms: "shrug", d: 1 }],
        ["counter", 170, 252, { w: 290, h: 56 }],
        ["note", 80, 185, { w: 84, h: 44, t: "No soft", r: -6, f: "soft", d: 2 }],
        ["pile", 140, 185, { n: 14, d: 3 }],
        ["pile", 190, 185, { n: 12, d: 4 }],
        ["ticket", 112, 190, { r: 10, d: 5 }], ["ticket", 205, 190, { r: -8, d: 5 }],
        ["ques", 300, 90, { d: 6 }]
      ],
      say: [{ t: "Where is the soft-tomato rule?", at: [4, 4], tail: "br", w: 46 }]
    },
    {
      size: "w", bg: "kitchen",
      alt: "The owner lays three things on a tidy counter: a note for 60 euros, a note for Saturday morning and a note for no soft tomatoes. The chef is pleased and names a firm tomato.",
      cap: "This time you put only three things on the counter. The answer gets much more specific, but the prices are still guessed.",
      scene: [
        ["chef", 560, 240, { s: 1.1, mood: "proud", arms: "down", d: 2 }],
        ["counter", 400, 254, { w: 480, h: 56 }],
        ["owner", 110, 240, { s: 1.1, mood: "happy", arms: "give" }],
        ["note", 270, 187, { w: 76, h: 54, t: "60 euros", size: 13, f: "oks", fx: [-60, -40], d: 1 }],
        ["note", 360, 187, { w: 76, h: 54, t: "Saturday", size: 13, f: "oks", fx: [-120, -40], d: 2 }],
        ["note", 450, 187, { w: 76, h: 54, t: "No soft", size: 13, f: "oks", fx: [-180, -40], d: 3 }],
        ["tomato", 650, 240, { r: 13, d: 5 }], ["tomato", 682, 240, { r: 13, d: 5 }], ["tomato", 666, 213, { r: 13, d: 5 }]
      ],
      say: [
        { t: "Only three things.", at: [3, 6], tail: "br", w: 26 },
        { t: "Firm tomatoes, middling price.", at: [60, 5], tail: "bl", w: 34 },
        { t: "Only a guess.", at: [40, 14], tail: "br", k: "think", w: 22 }
      ]
    }
  ],
  names: [
    { kw: "the counter", term: "context window", id: "context", def: "The context is everything the model sees in one request. The context window is its size limit." },
    { kw: "the order ticket", term: "prompt", id: "prompt", def: "A prompt is the message you send. The system prompt holds standing instructions, sent with every request." }
  ]
});
