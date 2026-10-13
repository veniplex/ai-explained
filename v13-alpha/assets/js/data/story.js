/* Agentic AI, Explained (v13): the story. One list of steps. Each step changes the one room a little: it shows or hides things of
   kitchen.js, sends people somewhere (go), changes how they look (pose), and says one line (cap) in the kitchen voice, with a
   few speech bubbles (say). Things stay where the last step left them. A step may also turn night on or off and move the camera
   (cam: the middle of what to look at, used on small screens). The last steps (map) lay the real names over the faded kitchen.
     id, ch (the chapter), cap, show [ids], hide [ids], go {id: [x, y]}, pose {id: "mood/arms"}, say [{t, at: [x, y], tail, k, w}],
     night (true | false), cam [x, y], map ("all" | the chapter number: which real names to show). */
(function () {
  "use strict";
  var C = window.COMIC;

  C.chapters = [
    { n: 0, id: "start", hash: "", zone: "start", title: "How an AI agent works", short: "Start" },
    { n: 1, id: "chef", hash: "ch-1", zone: "model", title: "The chef", short: "1" },
    { n: 2, id: "counter", hash: "ch-2", zone: "harness", title: "The counter", short: "2" },
    { n: 3, id: "tools", hash: "ch-3", zone: "tools", title: "Knives, pots and one plug", short: "3" },
    { n: 4, id: "loop", hash: "ch-4", zone: "harness", title: "Taste, adjust, taste again", short: "4" },
    { n: 5, id: "recipes", hash: "ch-5", zone: "know", title: "Recipe cards and a notebook", short: "5" },
    { n: 6, id: "locks", hash: "ch-6", zone: "control", title: "Locks and your OK", short: "6" },
    { n: 7, id: "helpers", hash: "ch-7", zone: "orch", title: "Helpers and the night shift", short: "7" },
    { n: 8, id: "kitchen-ops", hash: "ch-8", zone: "ops", title: "Running the kitchen", short: "8" },
    { n: 9, id: "end", hash: "ch-e", zone: "start", title: "The whole kitchen", short: "End" },
    { n: 10, id: "names", hash: "map", zone: "start", title: "The real names", short: "Names" }
  ];

  var HOME = [375, 652], COUNTER = [710, 652], TOOLS = [1050, 652], LOCKS = [1330, 652];

  C.steps = [
    /* 0 · Start */
    { id: "empty", ch: 0, cap: "A restaurant kitchen on a Friday evening. It is empty and quiet, and it is about to build itself.",
      show: ["window"], cam: [330, 380] },
    { id: "owner", ch: 0, cap: "You own it. Tomorrow you need 20 kilos of firm tomatoes.",
      show: ["owner"], pose: { owner: "calm/out" },
      say: [{ t: "Twenty kilos of firm tomatoes, please.", at: [30, 436], tail: "bl", w: 230 }] },
    { id: "plan", ch: 0, cap: "Every piece of this kitchen is a real part of an **AI agent**, an assistant that works on a goal by itself. At the end, the real names go on top.",
      pose: { owner: "happy/cheer" } },

    /* 1 · The chef */
    { id: "chef", ch: 1, cap: "This is the chef, a **language model**. It has read every cookbook ever written, and learned nothing else.",
      show: ["chef", "books1", "books2", "books3", "books4"], pose: { chef: "think/think", owner: "calm/down" }, cam: [375, 480],
      say: [{ t: "I have read every one of them.", at: [320, 410], tail: "bl", w: 200 }] },
    { id: "menu", ch: 1, cap: "It writes the menu one small word-piece at a time. All it knows is what usually comes next.",
      show: ["menu", "menu-l", "piece1", "piece2", "piece3", "piece4", "piece5"], pose: { chef: "think/up" } },
    { id: "reason", ch: 1, cap: "A chef who plans every step first (a **reasoning** chef) starts slower, but fewer dishes burn.",
      hide: ["menu", "menu-l", "piece1", "piece2", "piece3", "piece4", "piece5"], show: ["plan"], pose: { chef: "calm/think" } },
    { id: "date", ch: 1, cap: "The cookbooks stop on a fixed date. So the chef answers with a confident guess, and the guess is old.",
      hide: ["plan"], show: ["calendar"], pose: { chef: "proud/hips", owner: "calm/out" },
      say: [{ t: "What do tomatoes cost today?", at: [20, 430], tail: "bl", w: 220 }, { t: "Easy. They cost what they always cost.", at: [300, 418], tail: "bl", w: 210 }] },
    { id: "forget", ch: 1, cap: "Once the dish is served, the chef forgets the order. The next one starts from a blank mind.",
      hide: ["calendar"], show: ["zz", "t-fri", "t-wed", "t-mon"], pose: { chef: "sleepy/down", owner: "calm/down" } },

    /* 2 · The counter */
    { id: "counter", ch: 2, cap: "Everything the chef can work with lies on this counter, the **context**. What is not on it, the chef cannot know.",
      hide: ["zz", "t-fri", "t-wed", "t-mon"], show: ["counter"], go: { chef: COUNTER, owner: [490, 652] }, pose: { chef: "calm/hold", owner: "calm/give" }, cam: [740, 470] },
    { id: "order", ch: 2, cap: "You put your order on the counter. That message is the **prompt**.",
      show: ["order"], go: { order: [575, 493] }, pose: { owner: "happy/give" } },
    { id: "notes", ch: 2, cap: "Your house rule goes there too, and every older ticket.",
      show: ["rulenote", "old1", "old2", "old3"], pose: { owner: "calm/down" } },
    { id: "reread", ch: 2, cap: "The chef forgets, so before every move the whole pile is laid out again. The chef reads all of it, every time.",
      show: ["pile"], pose: { chef: "think/hold" } },
    { id: "window", ch: 2, cap: "The counter has a fixed size, the **context window**. When it is cluttered, your rule gets buried.",
      hide: ["pile"], show: ["ctxframe", "pile2"], pose: { chef: "worried/shrug", owner: "worried/down" },
      say: [{ t: "Where did the rule go?", at: [560, 290], tail: "br", k: "think", w: 190 }] },
    { id: "tidy", ch: 2, cap: "This time only what matters lies on the counter. The answer is much more specific, but the prices are still a guess.",
      hide: ["pile2", "old1", "old2", "old3"], pose: { chef: "proud/hips", owner: "happy/down" } },

    /* 3 · Knives, pots and one plug */
    { id: "talk", ch: 3, cap: "Without tools the chef can only talk. It can describe a dish, but it cannot cook one or look anything up.",
      show: ["counter2"], go: { chef: TOOLS }, pose: { chef: "calm/shrug" }, cam: [1040, 470],
      say: [{ t: "I can describe it, but I cannot cook it.", at: [930, 360], tail: "br", w: 210 }] },
    { id: "handover", ch: 3, cap: "You hand the chef two **tools**: a phone with the numbers of the market stalls, and the order book.",
      show: ["phone", "orderbook", "stall1", "stall2", "stall3", "stall4"], pose: { chef: "happy/hold" } },
    { id: "kit", ch: 3, cap: "Pots, an oven and knives are tools too. The chef never touches anything itself: it names a tool, and the kitchen does it.",
      show: ["oven", "pot", "block"], pose: { chef: "calm/point" } },
    { id: "plug", ch: 3, cap: "Appliances come from many makers. One standard plug, the **MCP** (Model Context Protocol), means any of them fits any socket.",
      show: ["sockets"], pose: { chef: "proud/hips" } },

    /* 4 · Taste, adjust, taste again */
    { id: "look", ch: 4, cap: "The chef looks at the counter and picks one move.",
      show: ["loop", "lab-look"], go: { chef: [760, 652] }, pose: { chef: "calm/point" }, cam: [880, 440] },
    { id: "pick", ch: 4, cap: "It thinks, and chooses: ring the market.",
      show: ["lab-pick", "idea"], pose: { chef: "think/think" } },
    { id: "do", ch: 4, cap: "A tool does it. The chef never dials itself.",
      hide: ["idea"], show: ["lab-do"], go: { chef: TOOLS }, pose: { chef: "calm/hold" } },
    { id: "see", ch: 4, cap: "The answer lands on the counter, and the chef looks again. This tasting circle is the **agent loop**.",
      show: ["lab-see", "result"], go: { chef: [820, 652], result: [700, 493] }, pose: { chef: "calm/point" } },
    { id: "calls", ch: 4, cap: "The chef phones the first stall, then the second. The third is sold out, so it rings the next one.",
      hide: ["result"], show: ["call1", "p1", "call2", "p2", "call3", "p3", "no3", "call4", "p4"], go: { chef: TOOLS }, pose: { chef: "think/hold" } },
    { id: "order-book", ch: 4, cap: "It weighs the prices against your budget and writes three lines in the order book. Placing the order still waits for your OK.",
      hide: ["call1", "call2", "call3", "call4", "no3"], show: ["ok2"], go: { owner: [900, 652] }, pose: { chef: "proud/point", owner: "calm/out" },
      say: [{ t: "Ask me before you buy.", at: [790, 330], tail: "br", w: 190 }] },
    { id: "stops", ch: 4, cap: "The circle stops when the dish is right, when your limit is reached, or when the chef is stuck and asks you.",
      hide: ["p1", "p2", "p3", "p4", "ok2"], show: ["stop"], pose: { chef: "worried/shrug", owner: "calm/down" } },
    { id: "agent", ch: 4, cap: "Chef, counter, tools and the circle together make an **agent**. The kitchen around it keeps the house rules, the **harness**.",
      hide: ["stop"], show: ["agentframe"], go: { chef: [880, 652], owner: [490, 652] }, pose: { chef: "happy/cheer" } },

    /* 5 · Recipe cards and a notebook */
    { id: "rules", ch: 5, cap: "Your house rules are pinned above the counter, the **instruction files**. The chef reads them at the start of every shift.",
      hide: ["agentframe", "loop", "lab-look", "lab-pick", "lab-do", "lab-see"], show: ["rules"], go: { chef: COUNTER }, pose: { chef: "calm/point" }, cam: [780, 470] },
    { id: "cards", ch: 5, cap: "Recipe cards wait in a box, and only their titles show. The chef takes out a card, a **skill**, only when a dish needs it.",
      show: ["cards", "card"], go: { chef: [838, 652], card: [790, 410] }, pose: { chef: "happy/hold" } },
    { id: "shelf", ch: 5, cap: "For facts the chef never read, it does not guess. It fetches a page from the cookbook shelf, **retrieval**, or phones the market and asks.",
      hide: ["card"], show: ["shelf", "page"], go: { chef: [560, 652], page: [650, 420] }, pose: { chef: "think/hold" } },
    { id: "notebook", ch: 5, cap: "The notebook keeps last Saturday's note, so it lies open on the counter before you say a word. That is **memory**.",
      hide: ["page"], show: ["notebook"], go: { chef: COUNTER }, pose: { chef: "taste/hold" } },
    { id: "clutter", ch: 5, cap: "The counter fills up again.",
      show: ["pile3"], pose: { chef: "worried/shrug" } },
    { id: "summary", ch: 5, cap: "So the chef tidies up and keeps a short summary. That is **compaction**.",
      hide: ["pile3"], show: ["summary"], pose: { chef: "proud/hips" } },

    /* 6 · Locks and your OK */
    { id: "keys", ch: 6, cap: "Keys to the cupboards, the **permissions**: some the chef opens alone, some need your OK, and some stay locked.",
      hide: ["summary"], show: ["counter3", "cab1", "cab2", "cab3"], go: { chef: LOCKS, owner: [1200, 652] }, pose: { chef: "calm/point", owner: "calm/out" }, cam: [1240, 470] },
    { id: "sealed", ch: 6, cap: "The test kitchen is sealed. If something burns in there, nothing in the real kitchen is touched. That is a **sandbox**.",
      show: ["sandbox", "burnt"], pose: { chef: "oops/shrug" } },
    { id: "alarm", ch: 6, cap: "The smoke alarm and the lock on the till work whatever the chef thinks. These are **hooks and guardrails**.",
      show: ["alarm", "till"], pose: { chef: "calm/point" } },
    { id: "note", ch: 6, cap: "A stall slips a note into the delivery, and the chef reads it like any order. That is **prompt injection**.",
      show: ["courier", "crate-a", "forged"], go: { courier: [1330, 660], "crate-a": [1388, 662], forged: [1388, 628] }, pose: { chef: "worried/hold" },
      say: [{ t: "The note says to pay in full. Fine.", at: [1090, 560], tail: "br", k: "think", w: 200 }] },
    { id: "lock", ch: 6, cap: "A rule on the wall only asks politely. A lock holds: the alarm rings, and the till says no.",
      show: ["bang", "no-till"], pose: { chef: "oops/shrug", owner: "worried/down" } },

    /* 7 · Helpers and the night shift */
    { id: "helpers", ch: 7, cap: "For a big job the chef sends helpers to three corners. Each has a small counter of its own and checks one stall.",
      hide: ["courier", "crate-a", "forged", "bang", "no-till"], show: ["h1", "hc1", "h2", "hc2", "h3", "hc3"], go: { chef: [760, 615], owner: [490, 652] },
      pose: { chef: "happy/out", h1: "calm/down", h2: "calm/down", h3: "calm/down", owner: "calm/down" }, cam: [840, 520] },
    { id: "bowls", ch: 7, cap: "Each helper, a **sub-agent**, hands back one finished bowl, so the chef's counter stays clear.",
      show: ["bowl1", "bowl2", "bowl3"], go: { bowl1: [600, 493], bowl2: [700, 493], bowl3: [800, 493] }, pose: { h1: "happy/give", h2: "happy/give", h3: "happy/give", chef: "proud/hips" } },
    { id: "night", ch: 7, cap: "At night the kitchen is empty. A timer rings and the chef starts alone. That is a **background agent**.",
      hide: ["h1", "hc1", "h2", "hc2", "h3", "hc3", "bowl1", "bowl2", "bowl3", "owner"], show: ["nightwindow", "clock", "alarm2"], night: true, go: { chef: COUNTER }, pose: { chef: "sleepy/hold" }, cam: [700, 470] },
    { id: "morning", ch: 7, cap: "In the morning a note is pinned up. Nobody watched the night shift, so it got the tightest locks: it could look and report, but not buy.",
      hide: ["nightwindow", "clock", "alarm2"], show: ["owner", "morningnote"], night: false, go: { owner: [490, 652] }, pose: { chef: "proud/hips", owner: "happy/point" } },

    /* 8 · Running the kitchen */
    { id: "panel", ch: 8, cap: "A taste panel tries the chef on twenty past Saturdays. These tests are called **evals**.",
      hide: ["morningnote"], show: ["panel-table", "judge1", "judge2", "judge3", "score1", "score2", "score3"], go: { chef: [345, 652] },
      pose: { chef: "taste/hold", judge1: "happy/down", judge2: "calm/down", judge3: "happy/down" }, cam: [250, 520] },
    { id: "camera", ch: 8, cap: "Cameras record every step, so you can see the exact frame where a dish went wrong. That is **observability**.",
      show: ["camera", "film"], pose: { chef: "calm/point" } },
    { id: "bill", ch: 8, cap: "Every word-piece the chef reads and writes is paid for. These pieces are called **tokens**. A cluttered counter makes a long bill.",
      show: ["bill1"], pose: { chef: "worried/hold" } },
    { id: "bill-short", ch: 8, cap: "A tidy counter, and a cheaper chef for the easy steps, make a short one.",
      hide: ["bill1"], show: ["bill2"], pose: { chef: "proud/hips" } },
    { id: "inspector", ch: 8, cap: "The health inspector has a rule book and a log of every order the chef tried to place, allowed or not. That is **governance**.",
      show: ["inspector", "logpage", "rulebook"], go: { chef: [1190, 640] }, pose: { chef: "calm/down" }, cam: [1300, 470] },

    /* 9 · The whole kitchen */
    { id: "ok", ch: 9, cap: "You say OK. The till opens once, and 20 kilos of firm tomatoes arrive on Saturday morning.",
      hide: ["bill2"], show: ["courier2", "crates-b1", "crates-b2", "crates-b3"], go: { owner: [1385, 652], courier2: [1235, 660], "crates-b1": [1283, 664], "crates-b2": [1283, 642], "crates-b3": [1283, 620], chef: [1160, 640] },
      pose: { owner: "happy/point", till: "open", courier2: "happy/give", chef: "happy/cheer" }, cam: [1250, 470],
      say: [{ t: "OK.", at: [1330, 440], tail: "br", w: 70 }] },
    { id: "whole", ch: 9, cap: "Here is the whole kitchen. You give the order. The chef reads the counter, uses tools, keeps notes, calls helpers, works behind locks, and is tasted and inspected.",
      show: ["h1", "hc1", "h2", "hc2", "h3", "hc3"], go: { chef: [700, 652], owner: [490, 652] }, pose: { chef: "calm/down", owner: "calm/out", h1: "calm/down", h2: "calm/down", h3: "calm/down" }, cam: [700, 350] },
    { id: "idea1", ch: 9, cap: "First idea: each order is forgotten the moment it is served. Only what is on the counter right now counts, plus what the chef learned from the cookbooks.",
      show: ["ring1"], go: { chef: HOME }, pose: { chef: "think/think" },
      say: [{ t: "Which order was this again?", at: [310, 400], tail: "bl", k: "think", w: 200 }] },
    { id: "idea2", ch: 9, cap: "Second idea: the counter is small, and clutter hides what matters. Cards, shelf and notebook bring the right thing at the right time. Helpers keep the counter clean.",
      hide: ["ring1"], show: ["ring2"], go: { chef: COUNTER }, pose: { chef: "calm/hold" } },
    { id: "idea3", ch: 9, cap: "Third idea: a rule on the wall asks the chef politely. A lock on the cupboard cannot be talked round. Put the dangerous things behind locks.",
      hide: ["ring2"], show: ["ring3"], go: { chef: LOCKS }, pose: { chef: "oops/shrug" } },
    { id: "idea4", ch: 9, cap: "Fourth idea: start simple. One order ticket beats a fixed recipe, and a fixed recipe beats a chef who improvises, until the taste panel shows you need more.",
      hide: ["ring3"], show: ["ring4"], go: { chef: COUNTER }, pose: { chef: "calm/point" } },
    { id: "idea5", ch: 9, cap: "Fifth idea: taste every dish, and let a second cook taste it too. That turns a plausible dish into a good one.",
      hide: ["ring4"], show: ["ring5", "spoon"], go: { chef: [300, 640] }, pose: { chef: "taste/hold", judge1: "happy/down", judge2: "happy/down", judge3: "happy/down" } },

    /* 10 · The real names, laid over the faded kitchen. map: "all" shows every name, map: n puts chapter n in focus. */
    { id: "map", ch: 10, map: "all", cap: "Now the real names go over the picture. The scene fades into the background, so you can see which part is which. Tap or click a label to read what it means.",
      hide: ["ring5", "spoon", "bill2"], show: ["plan", "loop", "clock", "alarm2", "bill1", "forged"], go: { chef: [375, 652], owner: [490, 652], forged: [1283, 596] },
      pose: { chef: "calm/down", owner: "calm/out" }, cam: [750, 350] },
    { id: "map-1", ch: 10, map: 1, cap: "The model reads text and writes text, one piece at a time. A reasoning model plans before it answers." },
    { id: "map-2", ch: 10, map: 2, cap: "Everything the model sees in one request is its context, and the context window is the size limit. Your message is the prompt." },
    { id: "map-3", ch: 10, map: 3, cap: "Tools let the model ask for things to be done: search, send, save. MCP is the open plug that lets one connector serve many tools." },
    { id: "map-4", ch: 10, map: 4, cap: "The agent loop repeats look, act, see. The harness is the app that runs the loop and does what the model cannot." },
    { id: "map-5", ch: 10, map: 5, cap: "Instruction files hold standing rules, skills hold know-how loaded on demand, search brings in facts, and memory keeps notes between sessions." },
    { id: "map-6", ch: 10, map: 6, cap: "Permissions say what needs approval. A sandbox contains mistakes. Hooks and guardrails act whatever the model says, against prompt injection." },
    { id: "map-7", ch: 10, map: 7, cap: "Sub-agents work on their own small pieces and report back. Background agents start on a trigger and work while nobody watches." },
    { id: "map-8", ch: 10, map: 8, cap: "Evals test the agent, observability records each step, cost counts tokens, and governance covers policy, logs and law." }
  ];
})();
