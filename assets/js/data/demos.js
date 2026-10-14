/* AI explained: the "Try it" parts. Small demos that run in the page (assets/js/demos/<id>.js, loaded when one comes near the screen) and links to
   tools of other people that show a thing better than a text can.
   list    the demos: title, kind (live: the page really computes it; scripted: a hand-written run that shows a mechanism, labelled as such;
           recorded: a real run copied once), zone (the colour), lede (what to do), note (what is simplified).
   links   the tools elsewhere: title, url, by, note. A link is only a link: nothing is requested until it is clicked.
   terms   term id -> { demos: [demo ids], links: [link ids] }: the "Try it" part of a glossary page.
   guides  guide id -> section id -> { demos, links }: shown under the text of that part.
   Checked by scripts/site-content.js (every demo has its script, every id exists, every address is https). */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";

  AE3.demos = {

    list: {
      "tokenizer": {
        title: "Cut text into tokens", kind: "live", zone: "harness",
        lede: "First train a tiny tokenizer on a few lines of your own text and watch it learn its pieces. Then load the real one of GPT-2 and see how ordinary text, other languages, code and numbers are cut.",
        note: "The real tokenizer is the one of GPT-2 (2019). Newer models cut text differently, so counts from one model never carry over to another."
      },
      "context-window": {
        title: "Fill a context window", kind: "scripted", zone: "harness",
        lede: "Step through a coding task and watch what takes up room in the window. Then switch on a remedy and run it again.",
        note: "Toy numbers in a small window so that it fills in a few steps. Real windows are far larger, but they fill the same way."
      },
      "request-growth": {
        title: "The request is sent again every turn", kind: "live", zone: "harness",
        lede: "Step through four turns of one task. Each turn sends everything so far again. Switch on caching, change the prices, and see what the bill does.",
        note: "Only input tokens are counted. The prices are example numbers you can change; look up the current ones before you plan with them. The one-off surcharge some providers add for writing a cache entry is left out."
      },
      "permissions": {
        title: "Allow, ask or deny", kind: "live", zone: "control",
        lede: "Write the rules, and see what happens to each action an agent proposes. Then switch on the hook and see what a rule outside the model adds.",
        note: "A simplified rule language. Real tools differ in syntax. Here, as in many of them, deny beats ask and ask beats allow, and an action no rule mentions is asked about."
      },
      "trifecta": {
        title: "The lethal trifecta", kind: "live", zone: "control",
        lede: "Tick what your agent can do and see whether it has all three of the abilities that make a hidden instruction dangerous.",
        note: "A rule of thumb, not a proof. Two of the three are not safe on their own; they are only less bad."
      },
      "pass-k": {
        title: "One try or many", kind: "live", zone: "ops",
        lede: "Set how often an agent succeeds on one try and how many times you run it. See the chance that at least one run works, and the chance that every run works.",
        note: "Assumes every try is independent and succeeds with the same chance. Real runs are rarely that tidy, so treat the curves as a first estimate."
      },
      "quantisation": {
        title: "Fewer bits, smaller model", kind: "live", zone: "model",
        lede: "Pick a model size and the number of bits per weight. See how much memory the weights need, and what rounding does to a row of weights.",
        note: "Weights only. The context cache, activations and the runtime need more memory on top. The sample weights are made up and simple rounding is used; real methods are cleverer."
      },
      "tool-call": {
        title: "Who does what in a tool call", kind: "scripted", zone: "tools",
        lede: "Step through one tool call. The model only writes the call; the harness checks it and runs the tool. Try a broken call and see where it stops.",
        note: "Field names are simplified. Every provider has its own, but the order of the steps is the same."
      },
      "mcp-conversation": {
        title: "A conversation between client and server", kind: "scripted", zone: "tools",
        lede: "Step through the messages a client and an MCP server exchange, from the first greeting to a tool call.",
        note: "Shortened, and as in the 2026-07-28 revision of the specification, where there is no initialize handshake and every request carries its protocol version and the client's identity in `_meta`. Older revisions open with an initialize handshake."
      },
      "oauth-flow": {
        title: "Signing in without sharing a password", kind: "scripted", zone: "control",
        lede: "Step through the authorisation-code flow with PKCE: how an app gets a short-lived token for one task without ever seeing a password.",
        note: "The values are made up. The order of the steps and what travels where is the real flow."
      },
      "loop-break": {
        title: "Break the loop", kind: "scripted", zone: "harness",
        lede: "An agent whose fix does not work keeps trying. Choose which safeguards are on, run it, and see where it stops and what it costs.",
        note: "A hand-written run with made-up costs. It shows why the stop has to live outside the model."
      },
      "fan-out": {
        title: "One worker or several", kind: "scripted", zone: "orch",
        lede: "Split six equal jobs across more workers and see what happens to the time and to the number of tokens used.",
        note: "Toy numbers. The shape is real: parallel work finishes sooner, and the extra setup and the merge cost tokens."
      }
    },

    links: {
      "tiktokenizer": { title: "Tiktokenizer", url: "https://tiktokenizer.vercel.app/", by: "dqbd", note: "Pick an OpenAI model and see how it cuts your text, with the token count. OpenAI's tokenizers only." },
      "hf-tokenizer": { title: "The Tokenizer Playground", url: "https://huggingface.co/spaces/Xenova/the-tokenizer-playground", by: "Xenova, on Hugging Face", note: "Paste text and see the tokens and their numbers, and compare tokenizers of different model families." },
      "transformer-explainer": { title: "Transformer Explainer", url: "https://poloclub.github.io/transformer-explainer/", by: "Georgia Tech, Polo Club", note: "A small GPT-2 runs live in your browser: type a sentence, watch the attention and the next-token chances, and change temperature, top-k and top-p." },
      "llm-visualization": { title: "LLM Visualization", url: "https://bbycroft.net/llm", by: "bbycroft.net", note: "A 3D animated walk through a small language model, layer by layer." },
      "diffusion-explainer": { title: "Diffusion Explainer", url: "https://poloclub.github.io/diffusion-explainer/", by: "Georgia Tech, Polo Club", note: "How Stable Diffusion turns a text prompt into an image, step by step." },
      "tf-playground": { title: "TensorFlow Playground", url: "https://playground.tensorflow.org/", by: "TensorFlow", note: "Train a small neural network in the browser and change its layers, features and learning rate." },
      "embedding-projector": { title: "Embedding Projector", url: "https://projector.tensorflow.org/", by: "TensorFlow", note: "Explore embeddings as points in space and see which ones sit close together." },
      "neuronpedia": { title: "Neuronpedia", url: "https://www.neuronpedia.org/", by: "Neuronpedia, open source", note: "Explore what features inside a model respond to, and trace how a prompt is processed. Advanced." },
      "prompt-airlines": { title: "Prompt Airlines", url: "https://promptairlines.com/", by: "Wiz", note: "Try to talk an airline's chatbot into giving you a free ticket. No sign-up to start." },
      "crontab-guru": { title: "crontab.guru", url: "https://crontab.guru/", by: "Cronitor", note: "Type a cron expression and read it back in plain words." },
      "oauth-playground": { title: "OAuth 2.0 Playground", url: "https://www.oauth.com/playground/", by: "oauth.com", note: "Run the real flows (authorisation code, PKCE, device code and more) against a test server and see every request." },
      "jwt-io": { title: "JWT Debugger", url: "https://jwt.io/", by: "Auth0", note: "Decode a JSON Web Token and see its parts. Use test tokens only, never a real one." },
      "mcp-inspector": { title: "MCP Inspector", url: "https://modelcontextprotocol.io/docs/tools/inspector", by: "Model Context Protocol", note: "The official tool for testing an MCP server: list its tools and call them. It runs on your own computer (Node 22.19 or newer), not in the browser." },
      "reinforcejs": { title: "REINFORCEjs", url: "https://cs.stanford.edu/people/karpathy/reinforcejs/", by: "Andrej Karpathy", note: "Small browser demos of agents learning by trial and reward." },
      "models-dev": { title: "models.dev", url: "https://models.dev/", by: "an open-source project", note: "A table of models with their prices, context limits and features. Prices change, so read the current ones there." },
      "artificial-analysis": { title: "Artificial Analysis", url: "https://artificialanalysis.ai/", by: "Artificial Analysis", note: "Independent comparisons of models and providers: quality, price and speed." },
      "swe-bench": { title: "SWE-bench", url: "https://www.swebench.com/", by: "the SWE-bench team", note: "The leaderboard of the benchmark in which a coding agent has to fix real issues from open-source projects." },
      "arena": { title: "Arena", url: "https://arena.ai/", by: "Arena (formerly LMArena)", note: "Compare two anonymous models side by side and see the leaderboard built from people's votes." },
      "langfuse-demo": { title: "Langfuse demo project", url: "https://langfuse.com/docs/demo", by: "Langfuse", note: "A shared project with example traces of model runs, to click through before setting anything up." },
      "nist-playbook": { title: "NIST AI RMF Playbook", url: "https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook", by: "NIST", note: "Suggested actions for the four functions of the framework, as a web page and as PDF, CSV, Excel and JSON downloads." },
      "eu-checker": { title: "EU AI Act Compliance Checker", url: "https://artificialintelligenceact.eu/assessment/eu-ai-act-compliance-checker/", by: "Future of Life Institute", note: "An unofficial questionnaire on whether the Act applies to your system. Its last update was July 2025 (October 2026), so check the current text." }
    },

    terms: {
      "tokenizer": { demos: ["tokenizer"], links: ["tiktokenizer", "hf-tokenizer"] },
      "token": { demos: ["tokenizer"], links: ["tiktokenizer"] },
      "context": { demos: ["context-window"], links: ["models-dev"] },
      "compaction": { demos: ["context-window"] },
      "context-rot": { demos: ["context-window"] },
      "token-budget": { demos: ["context-window"] },
      "tool-search": { demos: ["context-window"] },
      "turn": { demos: ["request-growth"] },
      "prompt-caching": { demos: ["request-growth"] },
      "kv-cache": { demos: ["request-growth"] },
      "cost": { demos: ["request-growth"], links: ["models-dev", "artificial-analysis"] },
      "unit-economics": { demos: ["request-growth"] },
      "permissions": { demos: ["permissions"] },
      "permission-mode": { demos: ["permissions"] },
      "least-privilege": { demos: ["permissions"] },
      "hooks": { demos: ["permissions"] },
      "approval-fatigue": { demos: ["permissions"] },
      "lethal-trifecta": { demos: ["trifecta"] },
      "security": { demos: ["trifecta"], links: ["prompt-airlines"] },
      "prompt-injection": { demos: ["trifecta"], links: ["prompt-airlines"] },
      "indirect-prompt-injection": { demos: ["trifecta"] },
      "data-exfiltration": { demos: ["trifecta"] },
      "egress-filtering": { demos: ["trifecta"] },
      "jailbreak": { links: ["prompt-airlines"] },
      "pass-at-k": { demos: ["pass-k"] },
      "quantisation": { demos: ["quantisation"] },
      "parameters": { demos: ["quantisation"], links: ["tf-playground", "llm-visualization"] },
      "open-weight-model": { demos: ["quantisation"] },
      "small-language-model": { demos: ["quantisation"] },
      "tools": { demos: ["tool-call"] },
      "tool-schema": { demos: ["tool-call"] },
      "function-calling": { demos: ["tool-call"] },
      "structured-output": { demos: ["tool-call"] },
      "mcp": { demos: ["mcp-conversation"], links: ["mcp-inspector"] },
      "json-rpc": { demos: ["mcp-conversation"] },
      "mcp-client": { demos: ["mcp-conversation"] },
      "mcp-server": { demos: ["mcp-conversation"], links: ["mcp-inspector"] },
      "mcp-host": { demos: ["mcp-conversation"] },
      "oauth": { demos: ["oauth-flow"], links: ["oauth-playground", "jwt-io"] },
      "agent-loop": { demos: ["loop-break"] },
      "stop-condition": { demos: ["loop-break"] },
      "long-horizon-task": { demos: ["loop-break"] },
      "react": { demos: ["loop-break"] },
      "fan-out": { demos: ["fan-out"] },
      "parallelization": { demos: ["fan-out"] },
      "map-reduce": { demos: ["fan-out"] },
      "sub-agent": { demos: ["fan-out"] },
      "orchestrator-workers": { demos: ["fan-out"] },
      "multi-agent-system": { demos: ["fan-out"] },
      "transformer": { links: ["transformer-explainer", "llm-visualization"] },
      "attention": { links: ["transformer-explainer"] },
      "temperature": { links: ["transformer-explainer"] },
      "inference": { links: ["transformer-explainer"] },
      "embedding": { links: ["embedding-projector"] },
      "semantic-search": { links: ["embedding-projector"] },
      "vector-database": { links: ["embedding-projector"] },
      "diffusion-model": { links: ["diffusion-explainer"] },
      "interpretability": { links: ["neuronpedia"] },
      "cron": { links: ["crontab-guru"] },
      "reinforcement-learning": { links: ["reinforcejs"] },
      "model-routing": { links: ["models-dev"] },
      "benchmark": { links: ["swe-bench", "arena", "artificial-analysis"] },
      "coding-agent": { links: ["swe-bench"] },
      "llm-as-judge": { links: ["arena"] },
      "latency": { links: ["artificial-analysis"] },
      "trace": { links: ["langfuse-demo"] },
      "observability": { links: ["langfuse-demo"] },
      "nist-ai-rmf": { links: ["nist-playbook"] },
      "governance": { links: ["nist-playbook"] },
      "eu-ai-act": { links: ["eu-checker"] },
      "risk-tier": { links: ["eu-checker"] }
    },

    guides: {
      "how-it-works": {
        "tokens": { demos: ["tokenizer"], links: ["tiktokenizer", "hf-tokenizer"] },
        "the-request": { demos: ["request-growth"] },
        "tool-calls": { demos: ["tool-call"] },
        "stopping": { demos: ["loop-break"] },
        "long-jobs": { demos: ["fan-out"] },
        "cost-and-checks": { links: ["models-dev", "artificial-analysis"] }
      },
      "context": {
        "what-fills-it": { demos: ["context-window"] },
        "order-and-caching": { demos: ["request-growth"] }
      },
      "secure": {
        "permissions": { demos: ["permissions"] },
        "prompt-injection": { links: ["prompt-airlines"] },
        "trifecta": { demos: ["trifecta"] },
        "credentials": { demos: ["oauth-flow"], links: ["oauth-playground", "jwt-io"] }
      },
      "evaluate": {
        "repeats": { demos: ["pass-k"] },
        "regression": { links: ["swe-bench", "arena"] },
        "traces": { links: ["langfuse-demo"] }
      },
      "build": {
        "protocols": { demos: ["mcp-conversation"], links: ["mcp-inspector"] }
      }
    }
  };
})(window.AE3);
