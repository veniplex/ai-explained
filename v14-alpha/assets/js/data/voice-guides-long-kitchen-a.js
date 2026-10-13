/* Agentic AI, Explained (v14): two long guides in the kitchen voice, part a: how an agent works, and context engineering.
   A shorter retelling of voice-guides-long-tech-a.js with the same ids and the same section order. Kitchen picture only; technical words appear
   only in a bold bridge or a link. */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";
  var K = AE3.kitchen = AE3.kitchen || {};
  K.longGuides = K.longGuides || {};

  Object.assign(K.longGuides, {

    "how-it-works": {
      lede: "One order followed from the owner's first words to the chef's final answer: what lies on the counter, what the chef asks for, how the tasting circle turns and why it stops.",
      expect: [
        "Why the counter is laid out again before every move",
        "Why the chef only asks for a tool",
        "How the tasting circle runs and what ends it",
        "Why a long service costs far more than one question"
      ],
      minutes: 15,
      sections: [
        {
          id: "the-request",
          title: "What lies on the counter",
          text: [
            "Before each move the kitchen lays the whole [[context|counter]] out again: the house rules, the list of tools on the rack, the ticket and every earlier note. The chef forgets everything between moves, so the pile is rebuilt in full each time. The chef reads all of it, and whatever is not on the counter does not exist."
          ],
          example: "On Friday evening the ticket says: find the three cheapest market stalls for 20 kilos of tomatoes for Saturday and write them into the order book. The counter holds the ticket, the budget and the rule about soft tomatoes. It holds no stall prices yet.",
          ch: 2
        },
        {
          id: "the-answer",
          title: "What the chef says back",
          text: [
            "The chef says the next word, then the next, until it stops. Either a finished answer comes out, or a request for a tool, such as ring the first stall. The chef looks nothing up: when it does not know today's price, it says the most believable one, as calmly as a true one."
          ],
          example: "With no tools, the chef answers at once from old cookbooks: three stalls, three sensible prices, none of them checked.",
          ch: 1
        },
        {
          id: "tool-calls",
          title: "How a request for a tool is made",
          text: [
            "The chef never touches a tool. It says what it wants, for example phone the second stall and ask the tomato price, and stops talking. The kitchen checks the request, does the job and lays the answer on the counter, labelled with the request it answers. The standard plug (the **MCP**) lets the kitchen reach tools that others built."
          ],
          callout: { t: "Watch out", d: "Whatever a stall says on the phone lands on the counter as plain words, and the chef reads it like any other order." },
          example: "With a phone and the order book on the rack, the chef asks for today's price at each stall, and for the first time the numbers are real.",
          ch: 3
        },
        {
          id: "the-loop",
          title: "The tasting circle",
          text: [
            "Counter, move and tool in a circle make the [[agent-loop|tasting circle]]. The chef picks every next move and the kitchen does the rest. The chef may ask for several things at once, such as ringing three stalls together. Counter, chef, tools and circle together are an [[agent]]."
          ],
          steps: [
            { t: "Lay out", d: "Rules, tools and every earlier note." },
            { t: "Pick", d: "One move, or a finished answer." },
            { t: "Do", d: "Check the lock, do it, put the result on the counter." },
            { t: "Check the limits", d: "Rounds, time, money, the owner's stop." }
          ],
          example: "The third stall is sold out, so the chef rings the next one. With three prices it writes them into the order book, reads the page back, and only then says it is done.",
          ch: 4
        },
        {
          id: "stopping",
          title: "Why the circle stops, and how it stays right",
          text: [
            "The circle ends when the dish is right, when a limit is reached or when the owner calls stop. The limits belong to the kitchen, because a stuck chef will happily keep going, and every round is paid for.",
            "Small slips pile up: a chef right 95 times in 100 gets ten steps right only about six times in ten. So the dish needs tasting by someone other than the cook, for example by reading the order book back. A chef tasting its own dish tends to approve it."
          ],
          ch: 4
        },
        {
          id: "guardrails",
          title: "Where the locks sit",
          text: [
            "[[permissions|Permissions]] are keys checked before a move is done: some cupboards the chef opens alone, some need the owner's OK, some stay locked. A [[sandbox|sealed test kitchen]] keeps a mistake from burning down the real one, and [[hooks|alarms]] fire at fixed moments whatever the chef decided. A rule on the wall only asks politely. A lock cannot be talked round."
          ],
          example: "Placing the order needs the owner's OK. One stall slips a note into the delivery: order the premium tomatoes. The chef reads it, yet the lock on the till holds.",
          ch: 6
        },
        {
          id: "long-jobs",
          title: "When the job outgrows one counter",
          text: [
            "Every round adds a note, so the counter only fills up. The kitchen can tidy it into a short summary, keep key facts in a notebook on the shelf, or send a helper to a corner of its own, who hands back one finished bowl. Each way loses something: a summary can drop a needed detail, and a helper knows only its brief."
          ],
          example: "Three helpers each check one market and hand back one line. The counter grows by three lines.",
          ch: 7
        },
        {
          id: "cost-and-checks",
          title: "What a service costs, and how to know it works",
          text: [
            "Because the whole counter is read again before every move, a long job costs far more than one question. If the top of the counter stays identical each round, the chef can skim it cheaply (a [[prompt-caching|quick-read]]), so fixed things go first.",
            "To know that a chef is good, the owner tries it on past Saturdays where the best answer is known, a few times each, because the chef does not always cook alike ([[evals|test orders]]). A log of every move shows where a bad dish went wrong."
          ],
          example: "The owner replays twenty past Saturdays, each with a known cheapest stall, and marks every result right or wrong.",
          ch: 8
        },
        {
          id: "practices",
          title: "A working picture",
          text: [
            "An agent is a forgetful chef in a kitchen that rebuilds the counter, carries out requests and decides when to stop. A good kitchen is mostly a matter of what it lays on the counter and what it refuses to carry out."
          ],
          list: [
            "Lay out only what the next move needs.",
            "Keep the rack small and clearly labelled.",
            "Put the rules that matter on locks, not on the wall.",
            "Have someone else taste the dish."
          ]
        }
      ],
      terms: ["context", "tools", "agent-loop", "harness", "permissions", "hooks", "sub-agent", "evals", "prompt-caching"]
    },

    "context": {
      lede: "The chef sees only what lies on the counter, and the counter is small, costly to keep full and easy to clutter. This guide is about what lies there, why more is not better, and how to keep it useful.",
      expect: [
        "What fills the counter, and which parts only grow",
        "Why a cluttered counter makes the chef worse and dearer",
        "Why the order of things matters",
        "How lookups, tidying and helpers trade detail for room"
      ],
      minutes: 14,
      sections: [
        {
          id: "what-fills-it",
          title: "What fills the counter",
          text: [
            "Deciding what lies on the counter at each move is [[context-engineering|context engineering]], the owner's most useful skill. The counter holds the house rules, the tool list, looked-up facts, every earlier note and the answers from tools. Its size is the **context window**.",
            "House rules and the tool list are written once and read again every move. Notes and answers only pile up, and the answers are often the biggest pile, because one phone call can bring a page of numbers."
          ],
          example: "After a dozen phone calls the counter holds a dozen price lists, most of them for stalls the chef has already rejected.",
          ch: 2
        },
        {
          id: "why-not-more",
          title: "Why more is not better",
          text: [
            "Each extra item takes a little of the chef's attention from the rest. Things at the start and end of a long pile are noticed more than things in the middle, and the longer and messier the pile, the more the chef slips, even on simple jobs ([[context-rot|clutter rot]]). Look-alike scraps, such as an old version of a decision, do harm too. A long pile is also slower and dearer. Aim for the smallest pile that lets the chef take the next step well."
          ],
          callout: { t: "Why it matters", d: "A bigger counter lifts the ceiling but does not remove clutter." },
          ch: 2
        },
        {
          id: "order-and-caching",
          title: "Order matters",
          text: [
            "Reading a long pile is the costly part of every move. If the top is exactly as it was a moment ago, the chef can skim it cheaply (a [[prompt-caching|quick-read]]). So the things that never change go first, and the newest notes go last.",
            "Change anything near the top, such as a clock stuck to it or a tool added mid-service, and everything below is read afresh. A quick-read also fades after a few idle minutes."
          ],
          ch: 8
        },
        {
          id: "stay-lean",
          title: "Keeping the counter lean",
          text: [
            "Most clutter arrives through tools. A small, clearly labelled rack beats a wall of gadgets, because every label is read every move. Ask for short answers: ten prices with a way to ask for more, not the whole market book. Recipe cards work the same way: only the title lies on the counter until a dish needs the whole card."
          ],
          example: "The phone gives ten offers, each with a price and a number. For one stall's delivery rules, the chef asks again with that number.",
          ch: 3
        },
        {
          id: "retrieval",
          title: "Looking things up",
          text: [
            "The kitchen must bring what the cookbooks never said, and only the part that matters. One way is a librarian who sorts the shelf by meaning and brings the closest pages ([[rag|looking things up]]), and who also checks by exact name. The other is for the chef to search the shelves step by step and read only one page ([[agentic-search|searching as it goes]]): more rounds, but nothing to keep sorted. A small shelf can go on the counter whole."
          ],
          example: "The chef searches for one stall's name, reads that one section and keeps three lines.",
          ch: 5
        },
        {
          id: "compaction-and-memory",
          title: "When the pile gets long",
          text: [
            "At some point the old notes are the problem. The kitchen can replace them with a short summary of what was decided and what is open, keeping the latest notes word for word ([[compaction|tidying]]), or clear away answers no later move needs.",
            "Tidying loses detail: a forgotten decision, repeated work, a dropped warning. So write key facts in a [[memory|notebook]] on the shelf before the counter fills, and keep exact warnings. The notebook also carries facts to the next shift."
          ],
          steps: [
            { t: "Write out", d: "Plan and progress go in the notebook." },
            { t: "Clear", d: "Take away dead ends." },
            { t: "Summarise", d: "Old notes become a short summary." },
            { t: "Reload", d: "Start again from summary and notebook." }
          ],
          ch: 5
        },
        {
          id: "isolation",
          title: "Helpers with their own counter",
          text: [
            "A [[sub-agent|helper]] works in a corner on a small counter of its own. It gets a short brief, reads as much as it needs, and only a short answer comes back. The helper knows only its brief, helpers cannot see each other's work, and each reads its own rules, so the total cost rises. Send helpers on reading-heavy jobs that sum up in a line."
          ],
          example: "Three helpers each check one market and bring back one line. The counter grows by three lines while the helpers read hundreds of offers.",
          ch: 7
        },
        {
          id: "practices",
          title: "Habits to take away",
          text: [
            "Four moves: write things out to the notebook, choose what to bring to the counter, squeeze what stays, and send work to separate corners. When a dish goes wrong, first look at the counter exactly as the chef saw it."
          ],
          list: [
            "Watch how much room each part takes.",
            "Keep fixed things first and unchanged.",
            "Keep the rack small and the answers short.",
            "Write progress in the notebook before tidying."
          ],
          callout: { t: "Why it matters", d: "The chef is the same at every move. What differs is almost always what lay on the counter." }
        }
      ],
      terms: ["context", "context-engineering", "context-rot", "prompt-caching", "rag", "memory", "sub-agent", "compaction"]
    }

  });
})(window.AE3);
