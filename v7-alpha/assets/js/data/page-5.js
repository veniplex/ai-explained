/* Agentic AI, Explained (v7): page 5, recipe cards and a notebook (instructions, skills, looking things up, memory). */
(window.COMIC.pages = window.COMIC.pages || []).push({
  n: 5, id: "recipes", hash: "ch-5", zone: "know",
  title: "Recipe cards and a notebook",
  lead: "Some know-how must lie on the counter every shift. Some waits in a box, some sits on a shelf, and some goes into a notebook.",
  panels: [
    {
      size: "s", bg: "kitchen",
      alt: "House rules on a sheet are pinned to the wall above the pass. The chef stands at the counter and reads them.",
      cap: "Your house rules are pinned above the pass (the **instruction files**). The chef reads them at the start of every shift, before the first ticket.",
      scene: [
        ["counter", 200, 262, { w: 340, h: 56 }],
        ["sheet", 128, 150, { w: 132, title: "House rules", lines: ["Soft tomatoes never.", "Cash only stalls out."], s: 1.4 }],
        ["b_tape", 128, 52, { s: 1.4 }],
        ["label", 128, 176, { t: "read every shift", size: 14, u: 1 }],
        ["chef", 300, 206, { s: 0.88, mood: "calm", arms: "hold", d: 1 }]
      ],
      say: [{ t: "Rules first, then the tickets.", at: [50, 4], tail: "br", w: 38 }]
    },
    {
      size: "s", bg: "kitchen",
      alt: "A box of recipe cards on the counter shows only titles. The chef lifts one card out and holds it up: price per kilo.",
      cap: "Recipe cards wait in a box, and only their titles show. The chef takes out a card, a **skill**, only when a dish needs it, so the other cards take no room.",
      scene: [
        ["counter", 150, 262, { w: 250, h: 56 }],
        ["b_titlebox", 100, 195, { s: 1.25, titles: ["a", "b", "c", "d"], label: "recipe cards" }],
        ["chef", 240, 206, { s: 0.9, mood: "happy", arms: "up" }],
        ["b_bigcard", 336, 112, { title: "price per kilo", lines: ["add delivery", "divide by weight"], w: 108, fx: [-110, 50], d: 2 }],
        ["label", 100, 232, { t: "only titles show", size: 12, f: "ink3" }]
      ],
      say: [{ t: "Ah, that dish needs this card.", at: [4, 5], tail: "br", w: 38 }]
    },
    {
      size: "w", zone: "tools", bg: "kitchen",
      alt: "The chef reads an open cookbook on the counter. A shelf of cookbooks hangs on the wall, and the phone rings with a stall's answer about delivery.",
      cap: "For facts the chef never read, it does not guess. It fetches a page from the cookbook shelf, or phones the market and asks.",
      scene: [
        ["shelf", 120, 134, { w: 190 }],
        ["cookbook", 154, 94, { zone: "know", r: 22 }],
        ["label", 120, 162, { t: "the cookbook shelf", size: 18 }],
        ["counter", 410, 262, { w: 300, h: 56 }],
        ["arrowline", 0, 0, { pts: [[188, 104], [250, 130], [312, 168]], w: 2.4, head: 10 }],
        ["chef", 420, 206, { s: 1.0, mood: "think", arms: "hold" }],
        ["b_openbook", 330, 200, { w: 120, h: 52, lines: ["page 12:", "price per kilo"] }],
        ["phone", 520, 200, { s: 1.1, ring: 1 }],
        ["b_dash", 0, 0, { pts: [[540, 160], [600, 110], [660, 130]] }],
        ["stall", 720, 238, { s: 0.8 }],
        ["label", 560, 288, { t: "the phone call to the market", size: 18 }]
      ],
      say: [
        { t: "No guessing. Look it up.", at: [27, 5], tail: "br", w: 20, k: "think" },
        { t: "Our delivery rules.", at: [70, 4], tail: "br", w: 20 }
      ]
    },
    {
      size: "w", zone: "know", bg: "kitchen",
      alt: "Split picture. Left, last Saturday: the chef writes in the notebook that stall 2 had firm tomatoes. Right, this Saturday: the notebook lies open on the counter and the chef reads it.",
      cap: "The notebook keeps last Saturday's note, so it is open on the counter before you say a word. When the counter fills up, the chef tidies it and keeps a short summary.",
      scene: [
        ["b_dash", 0, 0, { pts: [[410, 16], [410, 284]], k: "rule", w: 2.6 }],
        ["calendar", 70, 118, { t: "last Sat", s: 1.3 }],
        ["counter", 220, 262, { w: 250, h: 56 }],
        ["chef", 260, 206, { s: 1.0, mood: "proud", arms: "up" }],
        ["notebook", 160, 196, { s: 1.2 }],
        ["crate", 345, 200, { n: 5, d: 2 }],
        ["calendar", 480, 118, { t: "this Sat", s: 1.3 }],
        ["counter", 640, 262, { w: 300, h: 56 }],
        ["ticket", 500, 200, { t: "Sat" }],
        ["b_openbook", 614, 200, { w: 160, h: 56, size: 9, lines: ["last Saturday:", "firm tomatoes", "at stall 2"] }],
        ["chef", 720, 206, { s: 1.0, mood: "happy", arms: "point", d: 2 }]
      ],
      say: [
        { t: "Firm ones at stall 2.", at: [18, 5], tail: "br", w: 22 },
        { t: "The notebook says stall 2.", at: [66, 5], tail: "br", w: 22 }
      ]
    }
  ],
  names: [
    { kw: "The house rules", term: "Instruction files", id: "instructions", def: "Instruction files hold standing rules in plain text. The harness puts them in the context at the start of every new chat or job." },
    { kw: "The recipe cards", term: "Skills", id: "skills", def: "A skill is written know-how for one kind of task. The agent loads it only when that task comes up." },
    { kw: "The shelf and the phone call", term: "Looking things up (search and RAG)", id: "knowledge", def: "Looking things up gives the agent facts it was never trained on, from the web, your files or a company knowledge base." },
    { kw: "The notebook", term: "Memory and compaction", id: "memory", def: "The model remembers nothing between requests, so memory means notes kept outside the context and loaded again when needed." }
  ]
});
