/* Agentic AI, Explained (v13): kitchen voice, chapters 1 to 4 (chef, counter, tools, loop) and their eight entries. */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";
  var K = AE3.kitchen = AE3.kitchen || {};
  K.chapters = K.chapters || {};
  K.entries = K.entries || {};

  Object.assign(K.chapters, {
    chef: {
      title: "The chef",
      problem: "What is this thing everyone calls AI, and why can it talk about food it has never tasted?",
      lead: "Picture a chef who has read every cookbook ever written. Ask for a dish and the chef knows what usually comes next. But the chef forgets each order the moment it is served.",
      text: [
        "The chef (the **language model**) learned from cookbooks, thousands of shelves of them, and from nothing else. That is its whole skill: given the start of a menu or a sentence, it knows which words usually follow. It writes its answer one small word-piece at a time.",
        "That simple skill goes far. The chef can write a menu, explain a sauce, plan a week of dinners or translate a recipe. A chef that stops and plans every step before starting (a **reasoning** chef) is slower to begin, but fewer dishes burn.",
        "Two limits matter from the start. The cookbooks end on a fixed date, so the chef knows nothing newer. And the chef forgets every order the moment it is served, so each new order starts from a blank mind."
      ],
      example: "You are the owner, and it is Friday evening. You say: find the three cheapest market stalls for 20 kilos of tomatoes for Saturday, write them into the order book, and place the order at the best one once I say OK. The chef answers at once from memory. The prices sound sensible, but they are old guesses."
    },
    counter: {
      title: "The counter",
      problem: "The chef knows nothing about you, your budget or what the market charges today.",
      lead: "The chef can only work with what lies on the counter. Anything about you or about today that is not on the counter, the chef cannot know. And the counter has a fixed size.",
      text: [
        "Everything the chef can use right now lies on the counter (the **context**): your order ticket (the **prompt**), your notes, the owner's standing orders pinned above the pass, and every earlier ticket from this conversation. The chef forgets each order, so before every move the whole pile is laid out again, and the chef reads all of it.",
        "The counter has a fixed size, the **context window**. A big counter holds a whole stack of cookbooks, but a cluttered one hides what matters: the soft-tomato rule gets buried under old scraps. Putting the right things on the counter, and nothing else, is the owner's most useful skill."
      ],
      example: "This time you put three things on the counter: a budget of 60 euros, delivery on Saturday morning, and your rule that soft tomatoes are never acceptable. The answer gets much more specific. It names the sort of tomato and a sensible price range. But the prices are still guessed, because nothing on the counter says what any stall charges today."
    },
    tools: {
      title: "Knives, pots and one plug",
      problem: "The chef can only talk. Nobody has handed over a single knife.",
      lead: "Give the chef knives, pots and an oven, and talk turns into cooking. New appliances all use one standard plug, so any of them can be connected.",
      text: [
        "**Tools** are the knives, pots and oven, and the phone and order book too. The chef never touches anything itself. It says which tool it wants and what to do with it, and the kitchen around it does the work and puts the result on the counter.",
        "Appliances come from many makers. The **MCP** is the standard plug: a maker builds one appliance with that plug, and it fits every socket. That is why a chef can be connected to a market's price list without a special adapter each time."
      ],
      example: "You hand the chef two tools: a phone with the numbers of the market stalls, and the order book. Now the chef asks the phone for today's tomato price at each stall, and the answers land on the counter. For the first time the prices are real. Nothing is written down yet."
    },
    loop: {
      title: "Taste, adjust, taste again",
      problem: "One phone call is never enough. Real jobs take many steps, and nobody knows in advance how many.",
      lead: "A good chef cooks a little, tastes, and decides the next move, again and again, until the dish is right.",
      text: [
        "Put the pieces together and run them in a circle. The chef looks at the counter and picks one move. A tool does it. The result lands on the counter, and the chef looks again. This tasting circle (the **agent loop**) is what turns a chef who only talks into a chef who finishes jobs.",
        "It stops when the dish is right, when the owner's limit is reached, or when the chef is stuck. The kitchen around the chef (the **harness**) sets up the counter, hands over the tools and keeps the house rules. Chef, counter, tools and tasting circle together make an **agent**."
      ],
      example: "The chef rings the first stall, then the second. The third says the tomatoes are sold out, so the chef rings the next one. It compares the prices, tastes the result against your budget and the soft-tomato rule, then writes the three cheapest stalls into the order book. Placing the order still waits for your OK."
    }
  });

  Object.assign(K.entries, {
    model: {
      line: "The chef has read every cookbook, knows what usually comes next, and forgets each order the moment it is served.",
      how: [
        "The chef (the **language model**) learned only from cookbooks, so it knows what the cookbooks said and nothing newer. Given the start of a sentence, it picks the word that most likely comes next, then the next, one at a time. That is how a whole answer appears.",
        "The cookbooks stop at a fixed date, and the chef keeps nothing between orders. Every order starts from a blank mind."
      ],
      example: "Alone, the chef quotes tomato prices from old cookbooks. They sound sensible, and nobody has checked them against today's market.",
      forYou: [
        "Treat a confident answer as a guess until something real backs it up.",
        "If the chef needs to know it, put it on the counter."
      ]
    },
    reasoning: {
      line: "Before a tricky dish, the chef stops and plans every step first: slower to start, but fewer dishes burn.",
      how: [
        "A **reasoning** chef writes out a plan before cooking: what to do first, what could go wrong, what to check afterwards. The plan lies on the counter, so the chef reads its own thoughts before each move.",
        "That takes more time and costs more, because every written word is paid for. For a simple order it is wasted effort."
      ],
      example: "Before ringing any stall, the chef plans: compare price per kilo, drop soft tomatoes, check delivery for Saturday. Then it starts.",
      forYou: [
        "Ask for careful planning on hard jobs, such as the whole Saturday order.",
        "Skip it for quick questions, where it only adds waiting and cost."
      ]
    },
    context: {
      line: "The counter: the chef can only use what lies on it, and it has a fixed size.",
      how: [
        "The chef forgets each order, so before every move the whole counter is laid out again and read from start to end. If something is not on it, the chef cannot know it.",
        "The counter (the **context window**) has a fixed size. When it fills with old scraps, the chef is slower and costs more, and the one note that matters, such as the soft-tomato rule, can get lost."
      ],
      example: "The chef now sees your budget, Saturday delivery and the soft-tomato rule on the counter. The answer is specific, but it still does not know today's prices.",
      forYou: [
        "Put only what matters on the counter: budget, date, rules.",
        "Start a fresh counter when an old job is cluttering it."
      ]
    },
    prompt: {
      line: "The order ticket you hand over: what you want tonight, in your own words.",
      how: [
        "Your **prompt** is the order ticket. The chef cooks only what the ticket says, together with whatever else lies on the counter. A vague ticket gets a vague dish.",
        "A good ticket says the goal, what you will accept and what you will not, and when to stop and ask you."
      ],
      example: "Your ticket reads: find the three cheapest stalls for 20 kilos of tomatoes for Saturday, write them in the order book, and wait for my OK.",
      forYou: [
        "Name the goal, the limits and the finish line.",
        "Say which step needs your OK."
      ]
    },
    tools: {
      line: "Knives, pots and an oven: they turn the chef's talk into cooking.",
      how: [
        "Without **tools** the chef can only describe a dish. With them, the chef says which one it wants, for example the phone with a stall's number, and the kitchen around it uses it. The result comes back on the counter.",
        "The chef never touches a tool itself. The kitchen decides which tools exist and which may be used."
      ],
      example: "The chef phones the first stall, and the answer lands on the counter: 1.80 euros a kilo today. That is a real price, not a guess.",
      forYou: [
        "Hand over only the tools the job needs.",
        "Keep the dangerous ones, such as paying, behind your OK."
      ]
    },
    mcp: {
      line: "The standard plug: any appliance built with it works in any kitchen that has the socket.",
      how: [
        "Without a standard, every appliance needs its own cable fitted by hand. With one plug (the **MCP**), a maker builds an appliance once and it works in every kitchen with the matching socket.",
        "The kitchen's socket lists what is plugged in. The chef reads that list, then picks what to use."
      ],
      example: "The market's phone line and the order book both have the standard plug, so the chef uses them without any special fitting.",
      forYou: [
        "Prefer appliances with the standard plug.",
        "Plug in only what you trust, because the chef will use it."
      ]
    },
    "agent-loop": {
      line: "The chef cooks, tastes and adjusts, again and again, until the dish is right.",
      how: [
        "Each turn has three parts: the chef looks at the counter, picks one move, and a tool carries it out. The result lands on the counter and the chef looks again. The **agent loop** runs round until the dish is right.",
        "It stops when the goal is met, a limit is hit, or the chef asks you. Without a limit it could taste forever."
      ],
      example: "One stall is sold out, so the chef tries the next, tastes the prices against your budget, and writes the three cheapest into the order book.",
      forYou: [
        "Set a limit on steps and money.",
        "Ask the chef to taste its own work before it calls the dish done."
      ]
    },
    harness: {
      line: "The kitchen around the chef: it lays out the counter, runs the appliances and enforces the rules.",
      how: [
        "The chef only thinks and speaks. The **harness** is everything else: it lays out the counter, hands over the tools, does what the chef asks and writes results back. It also checks the house rules, such as no ordering without your OK.",
        "Two kitchens with the same chef can behave very differently, because the kitchen around the chef is not the same."
      ],
      example: "The chef says: ring the next stall. The kitchen makes the call and puts the answer on the counter. When the chef asks to place the order, the kitchen waits for your OK.",
      forYou: [
        "Judge a kitchen by its rules and its tools, not only by its chef.",
        "Let the kitchen enforce what matters."
      ]
    }
  });
})(window.AE3);
