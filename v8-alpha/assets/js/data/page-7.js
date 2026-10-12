/* Agentic AI, Explained (v8): page 7, helpers and the night shift. */
(window.COMIC.pages = window.COMIC.pages || []).push({
  n: 7, id: "helpers", hash: "ch-7", zone: "orch",
  title: "Helpers and the night shift",
  lead: "For a big job the chef sends helpers to their own corners. At night a timer starts the kitchen with nobody there.",
  panels: [
    {
      size: "w", zone: "orch", bg: "kitchen",
      alt: "The chef points at three small helper chefs. Each helper stands behind a small counter of their own with a phone on it, under a sign for one market stall.",
      cap: "For a big job the chef sends helpers to three corners. Each helper has a small counter of its own and checks one stall.",
      scene: [
        ["shelf", 640, 74, { w: 150 }],
        ["note", 340, 128, { w: 62, h: 24, t: "stall 1", f: "paper", size: 11 }],
        ["note", 530, 128, { w: 62, h: 24, t: "stall 2", f: "paper", size: 11 }],
        ["note", 720, 128, { w: 62, h: 24, t: "stall 3", f: "paper", size: 11 }],
        ["chef", 125, 240, { s: 1.1, mood: "happy", arms: "point" }],
        ["chef", 340, 240, { s: 0.7, mood: "happy", arms: "hold", fx: [-120, 0], d: 1 }],
        ["counter", 340, 256, { w: 130, h: 40 }],
        ["phone", 384, 205, { s: 0.8, ring: 1 }],
        ["chef", 530, 240, { s: 0.7, mood: "think", arms: "hold", fx: [-120, 0], d: 1 }],
        ["counter", 530, 256, { w: 130, h: 40 }],
        ["phone", 574, 205, { s: 0.8 }],
        ["chef", 720, 240, { s: 0.7, mood: "happy", arms: "hold", fx: [-120, 0], d: 1 }],
        ["counter", 720, 256, { w: 130, h: 40 }],
        ["phone", 764, 205, { s: 0.8, ring: 1 }]
      ],
      say: [
        { t: "One stall each, please.", at: [22, 8], tail: "l", w: 22 }
      ]
    },
    {
      size: "w", zone: "orch", bg: "kitchen",
      alt: "Three helpers on the left have each handed over one bowl. The three bowls stand in a row on the chef's counter, which is otherwise clear apart from one ticket.",
      cap: "Each helper (a **sub-agent**) hands back one finished bowl, so the chef's counter stays clear. Several cooks can also work together as a team on one big banquet.",
      scene: [
        ["counter", 540, 258, { w: 380, h: 56 }],
        ["chef", 660, 206, { s: 1.0, mood: "proud", arms: "out" }],
        ["chef", 70, 240, { s: 0.7, mood: "proud", arms: "give" }],
        ["chef", 165, 240, { s: 0.7, mood: "happy", arms: "give", d: 1 }],
        ["chef", 260, 240, { s: 0.7, mood: "proud", arms: "give", d: 2 }],
        ["bowl", 410, 191, { c: "clay", fx: [-300, 20], d: 3 }],
        ["bowl", 470, 191, { c: "clay", fx: [-300, 20], d: 4 }],
        ["bowl", 530, 191, { c: "clay", fx: [-300, 20], d: 5 }],
        ["ticket", 600, 191, { t: "Sat", r: -4, d: 6 }]
      ],
      say: [
        { t: "Done.", at: [12, 8], tail: "bl", w: 9 },
        { t: "My counter is still clear.", at: [47, 6], tail: "r", w: 24 }
      ]
    },
    {
      size: "s", zone: "orch", bg: "night",
      alt: "A dark kitchen at night. A moon shines in the window, a lamp lights the counter, a timer rings and the chef starts to work. Nobody else is there.",
      cap: "At night the kitchen is empty. A timer rings and the chef starts alone. That is a **background agent**.",
      scene: [
        ["c_nightwash", 0, 0, { w: 400, h: 300 }],
        ["c_nightwindow", 85, 160, { w: 94, h: 76 }],
        ["clock", 352, 72, { }],
        ["c_lamp", 230, 66, { w: 170, l: 126 }],
        ["counter", 230, 258, { w: 250, h: 50 }],
        ["chef", 200, 208, { s: 0.92, mood: "calm", arms: "hold", fx: [0, 14] }],
        ["alarm", 300, 182, { ring: 1, d: 2 }],
        ["pot", 150, 197, { s: 0.8, d: 2 }]
      ],
      say: [
        { t: "RING", at: [64, 40], k: "sfx" },
        { t: "The timer says it is time to start.", at: [4, 5], tail: "bl", w: 44 }
      ]
    },
    {
      size: "s", zone: "orch", bg: "kitchen",
      alt: "Morning in the kitchen. The owner reads a note on the counter that says tomatoes dropped to 1.60 at stall 2. The till next to it has a padlock on it. The chef sleeps on his feet, a few z's above his head.",
      cap: "In the morning a note waits on the pass. Nobody watched the night shift, so it got the tightest locks. It could look and report, but not buy.",
      scene: [
        ["window", 215, 150, { w: 84, h: 62 }],
        ["rays", 215, 84, { n: 5, r0: 46, r1: 62, d: 1 }],
        ["counter", 215, 258, { w: 210, h: 50 }],
        ["owner", 62, 240, { s: 0.95, mood: "happy", arms: "point" }],
        ["c_notecard", 168, 197, { w: 112, h: 50, lines: ["Tomatoes dropped", "to 1.60 at stall 2"], size: 10.5, fx: [0, -16], d: 2 }],
        ["till", 262, 197, { }],
        ["padlock", 288, 193, { s: 0.85, d: 3 }],
        ["chef", 345, 240, { s: 0.82, mood: "sleepy", arms: "down" }],
        ["zz", 340, 126, { s: 0.8, amb: "amb-bob" }]
      ],
      say: [
        { t: "It looked and left a note.", at: [3, 6], tail: "bl", w: 34 }
      ]
    }
  ],
  names: [
    { kw: "helpers", term: "Sub-agents, workflows & teams", id: "team", def: "Sub-agents are helper agents with their own fresh context; workflows run fixed steps in code." },
    { kw: "night shift", term: "Background agents & triggers", id: "background", def: "A background agent starts on its own, works while nobody watches and reports back when it is done." }
  ]
});
