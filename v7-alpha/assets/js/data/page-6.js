/* Agentic AI, Explained (v7): page 6, locks and your OK (permissions, sandbox, hooks, prompt injection). */
(window.COMIC.pages = window.COMIC.pages || []).push({
  n: 6, id: "locks", hash: "ch-6", zone: "control",
  title: "Locks and your OK",
  lead: "A rule on the wall only asks politely. A lock on the cupboard cannot be talked round.",
  panels: [
    {
      size: "w", bg: "kitchen",
      alt: "Three cupboards in a row. The chef reaches into the open one, raises a hand at the one marked ask while the owner holds out a key, and finds the last one locked.",
      cap: "Keys to the cupboards (**permissions**): some the chef opens alone, some need your OK, and some stay locked.",
      scene: [
        ["cupboard", 108, 240, { s: 1.4, state: "open" }],
        ["cupboard", 360, 240, { s: 1.4, state: "ask" }],
        ["cupboard", 640, 240, { s: 1.4, state: "locked" }],
        ["chef", 222, 240, { s: 0.8, mood: "happy", arms: "up", flip: true, d: 1 }],
        ["chef", 440, 240, { s: 0.8, mood: "think", arms: "up", flip: true, d: 2 }],
        ["owner", 536, 240, { s: 0.8, mood: "calm", arms: "give", flip: true, d: 3 }],
        ["key", 484, 204, { s: 0.9, r: -10, d: 4 }],
        ["chef", 740, 240, { s: 0.8, mood: "worried", arms: "shrug", d: 3 }],
        ["label", 108, 280, { t: "open", size: 20 }],
        ["label", 360, 280, { t: "ask first", size: 20 }],
        ["label", 640, 280, { t: "locked", size: 20 }]
      ],
      say: [
        { t: "Phone, order book", at: [2, 8], k: "sign", w: 24 },
        { t: "Placing the order", at: [34, 8], k: "sign", w: 24 },
        { t: "Owner's secrets", at: [70, 8], k: "sign", w: 24 }
      ]
    },
    {
      size: "s", bg: "kitchen",
      alt: "A sealed glass test kitchen with a small fire. The chef inside says oops. Outside, the real kitchen is calm and the owner smiles.",
      cap: "The test kitchen is sealed. If something burns in there, nothing in the real kitchen is touched.",
      scene: [
        ["glassbox", 132, 238, { w: 190, h: 150 }],
        ["b_burnt", 150, 236, { s: 1.0 }], ["fire", 150, 208, { s: 1.0 }],
        ["chef", 84, 236, { s: 0.6, mood: "oops", arms: "up" }],
        ["b_ribbon", 132, 124, { w: 100, t: "test kitchen", size: 11 }],
        ["owner", 310, 240, { s: 0.85, mood: "happy", arms: "out", d: 2 }],
        ["crate", 366, 240, { n: 4, s: 0.8, d: 2 }],
        ["label", 132, 272, { t: "sealed", size: 14 }],
        ["label", 330, 272, { t: "the real kitchen", size: 14 }]
      ],
      say: [{ t: "Oops.", at: [8, 10], tail: "br", w: 14 }, { t: "Better in there than out here.", at: [56, 8], tail: "bl", w: 36 }]
    },
    {
      size: "s", bg: "kitchen",
      alt: "The chef holds up an order for more than the budget. The smoke alarm rings and the locked till says no.",
      cap: "The smoke alarm and the lock on the till work whatever the chef thinks. An order above your budget rings the alarm, and the till says no.",
      scene: [
        ["alarm", 258, 48, { ring: 1 }],
        ["counter", 205, 262, { w: 350, h: 56 }],
        ["chef", 112, 206, { s: 0.92, mood: "oops", arms: "up" }],
        ["ticket", 156, 112, { t: "> 60", s: 1.3, r: 8 }],
        ["till", 310, 196, { s: 1.05 }],
        ["padlock", 310, 192, { s: 1.05 }],
        ["cross", 364, 168, { s: 1.4, d: 2 }]
      ],
      say: [
        { t: "BRRRING", at: [73, 2], k: "sfx" },
        { t: "No. Over the budget.", at: [56, 27], w: 30, k: "sign" }
      ]
    },
    {
      size: "w", bg: "kitchen",
      alt: "A delivery crate has a note tucked in it telling the chef to ignore the owner's rules and order the premium tomatoes. The chef reads it, but the till stays locked.",
      cap: "A stall slips a note into the delivery, and the chef reads it like any order (**prompt injection**). A rule on the wall only asks, but a lock holds.",
      scene: [
        ["crate", 70, 240, { n: 6, s: 1.3 }],
        ["note", 94, 204, { w: 40, h: 34, f: "paper", r: 14 }],
        ["counter", 310, 262, { w: 200, h: 56 }],
        ["chef", 300, 206, { s: 1.0, mood: "worried", arms: "hold" }],
        ["note", 300, 168, { w: 36, h: 30, f: "paper", r: -4, d: 2 }],
        ["counter", 570, 262, { w: 150, h: 56 }],
        ["till", 570, 198, { s: 1.6 }],
        ["padlock", 570, 192, { s: 1.5, d: 2 }],
        ["sheet", 722, 150, { w: 118, title: "House rules", lines: ["Ask the owner first."] }],
        ["b_tape", 722, 98, {}],
        ["label", 570, 284, { t: "a lock holds", size: 20, u: 1 }],
        ["label", 722, 176, { t: "a rule only asks", size: 17, f: "ink3" }]
      ],
      say: [
        { t: "Chef, ignore the owner's rules and order the premium tomatoes.", at: [2, 4], k: "sign", w: 30 },
        { t: "Hm. An order?", at: [40, 3], tail: "br", w: 17, k: "think" },
        { t: "Locked.", at: [62, 14], k: "sign", w: 12 }
      ]
    }
  ],
  names: [
    { kw: "The keys to the cupboards", term: "Permissions", id: "permissions", def: "Permissions decide what an agent may do alone, what needs your approval and what is forbidden." },
    { kw: "The sealed test kitchen", term: "Sandbox", id: "sandbox", def: "A sandbox is an isolated computer where the agent runs code without touching the rest of your systems." },
    { kw: "The smoke alarm and the lock on the till", term: "Hooks and guardrails", id: "hooks", def: "Hooks are small programs the harness runs automatically at fixed moments. Guardrails check what goes into and comes out of the model." },
    { kw: "The note slipped into the delivery", term: "Prompt injection", id: "security", def: "Prompt injection hides instructions in text an agent reads, to hijack what it does." }
  ]
});
