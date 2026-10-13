/* AI explained (v14): the guides in the kitchen voice (glossary, "easily confused", the build ladder). */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";
  var K = AE3.kitchen = AE3.kitchen || {};

  K.compare = {
    lede: "They all help the chef, but different people hand them over, at different moments, and only some are enforced by a lock rather than by the chef's good judgement.",
    note: "“Enforced by a lock” means the kitchen makes it happen whatever the chef thinks; the rest depends on the chef's judgement. “Takes room on the counter” means how much of the chef's limited counter it uses.",
    rows: {
      "System prompt": {
        pic: "The owner's standing orders pinned above the pass, written once by whoever runs the restaurant and read with every ticket.",
        tell: "Always read first, on every order, and still only words: the chef may bend it, because it is not a lock."
      },
      "Instruction files": {
        pic: "House rules laid on the counter at the start of every shift, kept as a short sheet in the kitchen.",
        tell: "The kitchen lays it out by itself every shift. It always takes room, and the chef may still ignore it."
      },
      "Memory": {
        pic: "The notebook where the chef writes what must survive between shifts: preferences, decisions, progress.",
        tell: "The only one the chef writes itself, and only the notes recalled for this order take room on the counter."
      },
      "Skills": {
        pic: "Recipe cards waiting in a box, each with a one-line label, plus any ready-made helpers it needs.",
        tell: "Only the label sits on the counter until a dish needs the card. Then the whole card comes out."
      },
      "Playbooks": {
        pic: "A written routine for a repeating job, with its steps in order, handed over when that job starts.",
        tell: "A person or the head chef hands it over, and it takes room on the counter only for that one job."
      },
      "Slash commands": {
        pic: "A saved shortcut order that the owner calls by name instead of writing the same ticket again.",
        tell: "Only the owner calls it, by name, and only then does it land on the counter."
      },
      "Tools": {
        pic: "A knife, pot or oven the chef can ask for. The kitchen works it and brings back the result.",
        tell: "The chef decides when to ask, but the tool itself does exactly what it was built to do. That part is a lock."
      },
      "MCP": {
        pic: "The standard plug: any appliance fits any socket, so one supplier's tools work in many kitchens.",
        tell: "It is a plug, not a tool. The kitchen connects it, and the chef then uses the tools on the other end."
      },
      "Plugins": {
        pic: "A boxed starter set to install: recipe cards, shortcuts, helpers, alarms and plugs handed over together.",
        tell: "It is a box holding the others. Once opened, each part behaves exactly as it always does."
      },
      "Hooks": {
        pic: "Smoke alarms and the lock on the till: automatic checks hung at fixed moments, such as just before the chef opens the till.",
        tell: "The kitchen runs them whatever the chef thinks, they take almost no room, and the chef cannot talk them out of it."
      },
      "Sub-agents": {
        pic: "Helpers prepping in their own corners, each with a small counter, who hand back one finished bowl.",
        tell: "Only the finished bowl returns, so the head chef's counter stays clear, but more helpers mean a bigger bill."
      },
      "RAG": {
        pic: "Before cooking, someone fetches the few cookbook pages that match this order and lays them on the counter.",
        tell: "Pages are fetched fresh for each order, so the counter holds only what matched, however big the shelf."
      }
    }
  };

  K.build = {
    lede: "How a restaurant grows from one cook to a brigade: start on the lowest rung that could work, and climb only when the tastings show you must.",
    intro: "This guide shows how a restaurant grows from one cook to a brigade, one rung at a time. The full builder's guide, with patterns, standards and a checklist, is written in technical words.",
    ladder: [
      {
        name: "One order ticket",
        what: "One clear ticket handed to the chef, with a few sample dishes. The chef answers from the cookbooks alone.",
        climb: "the order needs facts the chef lacks, or things done outside the kitchen."
      },
      {
        name: "Chef with a cookbook shelf and tools",
        what: "The same single chef, now able to look things up, use tools and keep a notebook. The chef decides when to reach for them.",
        climb: "the work has separate stages that need a taste check in between."
      },
      {
        name: "A fixed recipe",
        what: "You write the steps: several tickets in a fixed order, each working on the last result. Every path is set in advance.",
        climb: "the steps cannot be known in advance, or depend on what turns up along the way."
      },
      {
        name: "One chef in a full kitchen",
        what: "One chef tasting and adjusting in a loop, with tools, recipe cards and keys to the cupboards, picks its own steps. Most real jobs end up here.",
        climb: "the work floods the counter, or independent parts could be cooked at the same time."
      },
      {
        name: "Chef with helpers",
        what: "The head chef hands focused jobs to helpers, each with a small counter of their own, and gets one finished bowl back from each.",
        climb: "the job is huge, runs for a long time, or reaches into other restaurants."
      },
      {
        name: "A brigade and a night shift",
        what: "Several chefs working together, a night shift that starts on a timer, and head chefs of other restaurants trading orders by a shared standard. The most power, bill and risk.",
        climb: "there is no higher rung. Spend on the taste panel, the cameras and the house rules instead."
      }
    ]
  };
})(window.AE3);
