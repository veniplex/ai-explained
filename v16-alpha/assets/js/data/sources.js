/* AI explained (v16): sources and facts. Per entry: search synonyms, dated facts (at most 4) and all sources, de-duplicated and ordered. */
window.AE3 = window.AE3 || {};
window.AE3.sources = {
  "model": {
    "aka": [
      "foundation model (llm)",
      "foundation model",
      "llm",
      "large language model",
      "gpt",
      "claude",
      "gemini",
      "llama",
      "transformer",
      "open weights",
      "frontier model",
      "slm",
      "fine-tuning & post-training",
      "fine-tuning",
      "training",
      "sft",
      "rlhf",
      "dpo",
      "lora",
      "qlora",
      "rft",
      "reinforcement fine-tuning",
      "distillation",
      "post-training",
      "alignment",
      "ai model"
    ],
    "facts": [
      {
        "text": "Anthropic (October 2026): Claude Fable 5.1 is the most capable generally available model; Claude Opus 5.5 (22 September 2026) is the recommended default, alongside Sonnet 5.5 and Haiku 5.5. All have a 1M-token context window.",
        "source": "https://platform.claude.com/docs/en/models/overview"
      },
      {
        "text": "OpenAI is winding down self-serve fine-tuning: no new organisations since May 2026, and no new training jobs at all from 6 January 2027.",
        "source": "https://developers.openai.com/api/docs/deprecations"
      },
      {
        "text": "OpenAI (October 2026): GPT-6 Astra is the flagship for complex reasoning and coding, GPT-6.1 Sol balances intelligence and cost, and GPT-6 Luna serves high-volume work.",
        "source": "https://developers.openai.com/api/docs/models"
      },
      {
        "text": "No model in the Gemini API supports fine-tuning any more; Google offers tuning on Gemini Enterprise Agent Platform instead.",
        "source": "https://ai.google.dev/gemini-api/docs/model-tuning"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "Large language model",
        "by": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Large_language_model",
        "year": 2026,
        "note": "Encyclopedic overview: transformers, tokens, training stages, multimodality, open-weight models."
      },
      {
        "type": "definition",
        "title": "What is Fine-Tuning?",
        "by": "IBM Think (Dave Bergmann)",
        "url": "https://www.ibm.com/think/topics/fine-tuning",
        "year": 2024,
        "note": "Clear explainer of fine-tuning, PEFT and how it differs from pretraining."
      },
      {
        "type": "docs",
        "title": "TRL - Transformers Reinforcement Learning",
        "by": "Hugging Face",
        "url": "https://huggingface.co/docs/trl/index",
        "year": 2026,
        "note": "Open-source library for SFT, DPO, GRPO and other post-training methods."
      },
      {
        "type": "paper",
        "title": "Attention Is All You Need",
        "by": "Vaswani et al. (Google Brain)",
        "url": "https://arxiv.org/abs/1706.03762",
        "year": 2017,
        "note": "Seminal paper introducing the transformer architecture behind modern LLMs."
      },
      {
        "type": "paper",
        "title": "On the Opportunities and Risks of Foundation Models",
        "by": "Bommasani et al. (Stanford CRFM)",
        "url": "https://arxiv.org/abs/2108.07258",
        "year": 2021,
        "note": "Coined 'foundation model'; capabilities, risks and societal impact."
      },
      {
        "type": "paper",
        "title": "Training language models to follow instructions with human feedback",
        "by": "Ouyang et al. (OpenAI)",
        "url": "https://arxiv.org/abs/2203.02155",
        "year": 2022,
        "note": "InstructGPT: the SFT + RLHF recipe behind chat assistants."
      },
      {
        "type": "paper",
        "title": "Constitutional AI: Harmlessness from AI Feedback",
        "by": "Bai et al. (Anthropic)",
        "url": "https://arxiv.org/abs/2212.08073",
        "year": 2022,
        "note": "Alignment via written principles and RL from AI feedback (RLAIF)."
      },
      {
        "type": "paper",
        "title": "Direct Preference Optimization: Your Language Model is Secretly a Reward Model",
        "by": "Rafailov et al. (Stanford)",
        "url": "https://arxiv.org/abs/2305.18290",
        "year": 2023,
        "note": "DPO: preference tuning without a separate reward model or RL loop."
      },
      {
        "type": "guide",
        "title": "Model optimization",
        "by": "OpenAI API docs",
        "url": "https://developers.openai.com/api/docs/guides/model-optimization",
        "year": 2026,
        "note": "When to prompt vs fine-tune (SFT, DPO, RFT); eval-driven loop; wind-down notice."
      },
      {
        "type": "course",
        "title": "Post-training of LLMs",
        "by": "DeepLearning.AI",
        "url": "https://www.deeplearning.ai/courses/post-training-of-llms",
        "year": 2025,
        "note": "Short course on SFT, DPO and online RL for post-training."
      },
      {
        "type": "blog",
        "title": "The Illustrated Transformer",
        "by": "Jay Alammar",
        "url": "https://jalammar.github.io/illustrated-transformer/",
        "year": 2018,
        "note": "Widely used illustrated, step-by-step explanation of transformer self-attention."
      },
      {
        "type": "video",
        "title": "Large Language Models explained briefly",
        "by": "3Blue1Brown",
        "url": "https://www.youtube.com/watch?v=LPZh9BOjkQs",
        "year": 2024,
        "note": "Short visual intro to next-token prediction, transformers and training."
      },
      {
        "type": "video",
        "title": "[1hr Talk] Intro to Large Language Models",
        "by": "Andrej Karpathy",
        "url": "https://www.youtube.com/watch?v=zjkBMFhNj_g",
        "year": 2023,
        "note": "How LLMs are trained, tool use, the LLM-as-operating-system idea, security."
      },
      {
        "type": "video",
        "title": "Deep Dive into LLMs like ChatGPT",
        "by": "Andrej Karpathy",
        "url": "https://www.youtube.com/watch?v=7xTGNNLPyMI",
        "year": 2025,
        "note": "Full training stack for a general audience: pretraining, fine-tuning, RL, tools."
      },
      {
        "type": "video",
        "title": "Is Fine-Tuning Still Needed? LLMs, RAG, & LoRA",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=-W2JdSl1v48",
        "year": 2026,
        "note": "When fine-tuning beats RAG and prompting; role of LoRA in 2026."
      }
    ]
  },
  "reasoning": {
    "aka": [
      "reasoning & thinking",
      "thinking",
      "extended thinking",
      "chain of thought",
      "cot",
      "test-time compute",
      "effort",
      "reasoning model",
      "o-series",
      "budget"
    ],
    "facts": [
      {
        "text": "Current Claude models think adaptively by default; the effort setting (low, medium, high, xhigh, max) is the main control, and manual thinking budgets are being retired.",
        "source": "https://platform.claude.com/docs/en/build-with-claude/effort"
      },
      {
        "text": "OpenAI's reasoning tokens stay hidden but occupy the context and are billed as output; reasoning effort ranges from none to max, depending on the model.",
        "source": "https://developers.openai.com/api/docs/guides/reasoning"
      },
      {
        "text": "Gemini uses a thinking level (low, medium, high), with thought summaries available on request.",
        "source": "https://ai.google.dev/gemini-api/docs/thinking"
      },
      {
        "text": "DeepSeek-R1 (2025, peer-reviewed in Nature) showed that reasoning can be learned through reinforcement learning alone, without human-written reasoning examples.",
        "source": "https://www.nature.com/articles/s41586-025-09422-z"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "What Is a Reasoning Model?",
        "by": "IBM Think (Dave Bergmann)",
        "url": "https://www.ibm.com/think/topics/reasoning-model",
        "year": 2026,
        "note": "Plain-language explainer of reasoning/thinking models and test-time compute."
      },
      {
        "type": "docs",
        "title": "Thinking",
        "by": "Anthropic (Claude Platform Docs)",
        "url": "https://platform.claude.com/docs/en/build-with-claude/thinking",
        "year": 2026,
        "note": "Adaptive thinking, display modes, billing, effort interplay, tools and caching."
      },
      {
        "type": "paper",
        "title": "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
        "by": "Wei et al. (Google)",
        "url": "https://arxiv.org/abs/2201.11903",
        "year": 2022,
        "note": "Seminal chain-of-thought paper: intermediate steps boost multi-step reasoning."
      },
      {
        "type": "paper",
        "title": "Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters",
        "by": "Snell et al. (UC Berkeley / Google DeepMind)",
        "url": "https://arxiv.org/abs/2408.03314",
        "year": 2024,
        "note": "Key test-time compute scaling study: compute-optimal allocation by difficulty."
      },
      {
        "type": "paper",
        "title": "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
        "by": "DeepSeek-AI",
        "url": "https://arxiv.org/abs/2501.12948",
        "year": 2025,
        "note": "Open reasoning model trained with large-scale RL; also published in Nature 2025."
      },
      {
        "type": "guide",
        "title": "Reasoning models",
        "by": "OpenAI API docs",
        "url": "https://developers.openai.com/api/docs/guides/reasoning",
        "year": 2026,
        "note": "Reasoning tokens, effort levels, summaries, encrypted reasoning items, context budgeting."
      },
      {
        "type": "blog",
        "title": "Why We Think",
        "by": "Lilian Weng",
        "url": "https://lilianweng.github.io/posts/2025-05-01-thinking/",
        "year": 2025,
        "note": "Deep survey of test-time compute, chain-of-thought, RL for reasoning, faithfulness."
      },
      {
        "type": "video",
        "title": "Why AI Models Pause to Think: Test Time Compute Explained",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=DAlC8mL5ZlI",
        "year": 2026,
        "note": "Martin Keen explains test-time compute, chain of thought and reasoning models."
      }
    ]
  },
  "context": {
    "aka": [
      "context window & tokens",
      "context window",
      "tokens",
      "tokenizer",
      "context length",
      "stateless",
      "working memory",
      "context rot",
      "lost in the middle",
      "1m context",
      "context engineering",
      "context",
      "context management",
      "progressive disclosure",
      "just in time",
      "attention budget",
      "write select compress isolate"
    ],
    "facts": [
      {
        "text": "About one million tokens is now standard at the frontier: every current Claude model has a 1M-token window, with up to 128,000 output tokens per request.",
        "source": "https://platform.claude.com/docs/en/build-with-claude/context-windows"
      },
      {
        "text": "The term took off in June 2025 when Tobi Lütke and Andrej Karpathy endorsed it. Karpathy called it “the delicate art and science of filling the context window with just the right information for the next step.”",
        "source": "https://simonwillison.net/2025/Jun/27/context-engineering/"
      },
      {
        "text": "Anthropic: “The Messages API is stateless, which means that you always send the full conversational history to the API.”",
        "source": "https://platform.claude.com/docs/en/build-with-claude/working-with-messages"
      },
      {
        "text": "Chroma's Context Rot study (July 2025) tested 18 models and found performance “grows increasingly unreliable as input length grows”, even on deliberately simple tasks.",
        "source": "https://research.trychroma.com/context-rot"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "What is a context window?",
        "by": "IBM Think",
        "url": "https://www.ibm.com/think/topics/context-window",
        "year": 2026,
        "note": "Defines context window, tokens, and trade-offs of larger windows."
      },
      {
        "type": "definition",
        "title": "What Is Context Engineering?",
        "by": "IBM Think (Joshua Noble)",
        "url": "https://www.ibm.com/think/topics/context-engineering",
        "year": 2026,
        "note": "Plain-language definition of context engineering for LLM applications."
      },
      {
        "type": "docs",
        "title": "Context windows",
        "by": "Anthropic (Claude Platform Docs)",
        "url": "https://platform.claude.com/docs/en/build-with-claude/context-windows",
        "year": 2026,
        "note": "How context accumulates per turn, sizes, thinking, overflow, compaction, context rot."
      },
      {
        "type": "docs",
        "title": "Using the Messages API",
        "by": "Anthropic (Claude Platform Docs)",
        "url": "https://platform.claude.com/docs/en/build-with-claude/working-with-messages",
        "year": 2026,
        "note": "States the API is stateless: always resend full conversation history."
      },
      {
        "type": "paper",
        "title": "Lost in the Middle: How Language Models Use Long Contexts",
        "by": "Liu et al. (Stanford)",
        "url": "https://arxiv.org/abs/2307.03172",
        "year": 2023,
        "note": "Shows models miss information placed in the middle of long contexts."
      },
      {
        "type": "paper",
        "title": "Context Rot: How Increasing Input Tokens Impacts LLM Performance",
        "by": "Chroma (Hong, Troynikov, Huber)",
        "url": "https://www.trychroma.com/research/context-rot",
        "year": 2025,
        "note": "18-model study: accuracy degrades as input length grows."
      },
      {
        "type": "paper",
        "title": "Context Rot: How Increasing Input Tokens Impacts LLM Performance",
        "by": "Chroma (Kelly Hong, Anton Troynikov, Jeff Huber)",
        "url": "https://research.trychroma.com/context-rot",
        "year": 2025,
        "note": "Technical report: 18 LLMs degrade non-uniformly as input length grows."
      },
      {
        "type": "guide",
        "title": "Effective context engineering for AI agents",
        "by": "Anthropic Engineering",
        "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
        "year": 2025,
        "note": "Context as finite attention budget; curation, compaction, memory, sub-agents."
      },
      {
        "type": "blog",
        "title": "Context Engineering",
        "by": "LangChain",
        "url": "https://www.langchain.com/blog/context-engineering-for-agents",
        "year": 2025,
        "note": "Write/select/compress/isolate strategies, illustrated with popular agents and papers."
      },
      {
        "type": "blog",
        "title": "Context Engineering for AI Agents: Lessons from Building Manus",
        "by": "Yichao 'Peak' Ji, Manus",
        "url": "https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus",
        "year": 2025,
        "note": "Production lessons: KV-cache, tool masking, file system as memory, recitation."
      },
      {
        "type": "blog",
        "title": "How Long Contexts Fail",
        "by": "Drew Breunig",
        "url": "https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html",
        "year": 2025,
        "note": "Four failure modes: context poisoning, distraction, confusion, clash."
      },
      {
        "type": "blog",
        "title": "Context engineering",
        "by": "Simon Willison",
        "url": "https://simonwillison.net/2025/Jun/27/context-engineering/",
        "year": 2025,
        "note": "Origin of the term; Lütke and Karpathy quotes, why it beats 'prompt engineering'."
      },
      {
        "type": "video",
        "title": "Let's build the GPT Tokenizer",
        "by": "Andrej Karpathy",
        "url": "https://www.youtube.com/watch?v=zduSFxRajkE",
        "year": 2024,
        "note": "Builds a BPE tokenizer from scratch; explains why tokens matter."
      },
      {
        "type": "video",
        "title": "What is a Context Window? Unlocking LLM Secrets",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=-QVoIxEpFkM",
        "year": 2025,
        "note": "Short explainer of context windows, tokens and long-context trade-offs."
      },
      {
        "type": "video",
        "title": "Context Engineering for Agents",
        "by": "LangChain",
        "url": "https://www.youtube.com/watch?v=4GiqzUHD5AA",
        "year": 2025,
        "note": "Video companion to LangChain's context engineering post."
      }
    ]
  },
  "prompt": {
    "aka": [
      "system prompt & prompt engineering",
      "system prompt",
      "prompt",
      "prompt engineering",
      "instructions",
      "role",
      "persona",
      "few-shot",
      "examples",
      "xml tags"
    ],
    "facts": [
      {
        "text": "Anthropic: newer Claude models follow the system prompt more closely, so aggressive wording such as “CRITICAL: You MUST…” can cause over-triggering. Plain instructions work better.",
        "source": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices"
      },
      {
        "text": "OpenAI's Model Spec (latest version 18 August 2026) defines the chain of command between platform, developer and user instructions, and says to ignore instructions found in untrusted data by default.",
        "source": "https://model-spec.openai.com/2026-08-18.html"
      },
      {
        "text": "Anthropic publishes the system prompts of its own apps; on the API, the developer writes the system prompt.",
        "source": "https://platform.claude.com/docs/en/release-notes/system-prompts/overview"
      },
      {
        "text": "The Prompt Report (2024) catalogues 58 text-prompting techniques.",
        "source": "https://arxiv.org/abs/2406.06608"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "What Is Prompt Engineering?",
        "by": "IBM Think",
        "url": "https://www.ibm.com/think/topics/prompt-engineering",
        "year": 2026,
        "note": "Accessible definition of prompt engineering with common techniques."
      },
      {
        "type": "spec",
        "title": "Model Spec (2026/08/18)",
        "by": "OpenAI",
        "url": "https://model-spec.openai.com/2026-08-18.html",
        "year": 2026,
        "note": "How models prioritize platform, developer and user instructions (chain of command)."
      },
      {
        "type": "docs",
        "title": "Prompting best practices",
        "by": "Anthropic (Claude Platform Docs)",
        "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices",
        "year": 2026,
        "note": "Living reference: roles, clarity, examples, XML, long context, agentic prompting."
      },
      {
        "type": "paper",
        "title": "The Prompt Report: A Systematic Survey of Prompt Engineering Techniques",
        "by": "Schulhoff et al.",
        "url": "https://arxiv.org/abs/2406.06608",
        "year": 2024,
        "note": "Most comprehensive taxonomy of prompting techniques and terminology."
      },
      {
        "type": "guide",
        "title": "Prompt engineering",
        "by": "OpenAI API docs",
        "url": "https://developers.openai.com/api/docs/guides/prompt-engineering",
        "year": 2026,
        "note": "Message roles, instructions priority, few-shot, prompt versioning and evals."
      },
      {
        "type": "guide",
        "title": "Prompt design strategies",
        "by": "Google AI for Developers (Gemini API)",
        "url": "https://ai.google.dev/gemini-api/docs/prompting-strategies",
        "year": 2026,
        "note": "Gemini prompting: clear instructions, few-shot, context, system instructions, Gemini 3 tips."
      },
      {
        "type": "course",
        "title": "Anthropic's Interactive Prompt Engineering Tutorial",
        "by": "Anthropic (GitHub)",
        "url": "https://github.com/anthropics/prompt-eng-interactive-tutorial",
        "year": 2024,
        "note": "Nine hands-on chapters from basic structure to complex prompts."
      },
      {
        "type": "video",
        "title": "AI prompt engineering: A deep dive",
        "by": "Anthropic",
        "url": "https://www.youtube.com/watch?v=T9aRN5JkmL8",
        "year": 2024,
        "note": "Anthropic prompt engineers discuss how they actually write prompts."
      }
    ]
  },
  "tools": {
    "aka": [
      "tools & function calling",
      "tools",
      "tool use",
      "function calling",
      "functions",
      "tool call",
      "json schema",
      "structured outputs",
      "api",
      "tool search",
      "programmatic tool calling",
      "aci",
      "computer & browser use",
      "computer use",
      "browser use",
      "gui agent",
      "operator",
      "screenshot",
      "click",
      "rpa",
      "playwright",
      "web agent",
      "chrome",
      "atlas"
    ],
    "facts": [
      {
        "text": "Anthropic's tool search (November 2025) cut tokens for tool definitions by about 85% and raised accuracy on an MCP evaluation from 49% to 74%.",
        "source": "https://www.anthropic.com/engineering/advanced-tool-use"
      },
      {
        "text": "OSWorld 2.0 (June 2026) tests long professional workflows of about 318 tool calls each; the best reported full success rate was about 21%.",
        "source": "https://osworld-v2.xlang.ai/"
      },
      {
        "text": "Claude's docs note that tool selection degrades beyond 30 to 50 tools, and that five MCP servers can use about 55,000 tokens of definitions before any work starts.",
        "source": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool"
      },
      {
        "text": "Claude computer use is generally available on the Claude API (2026), with classifiers that scan screenshots for prompt injection.",
        "source": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "What Is Tool Calling?",
        "by": "IBM Think (Cole Stryker)",
        "url": "https://www.ibm.com/think/topics/tool-calling",
        "year": 2025,
        "note": "Plain-language explainer of tool/function calling for agents."
      },
      {
        "type": "docs",
        "title": "Tool use with Claude",
        "by": "Anthropic",
        "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview",
        "year": 2026,
        "note": "Client vs server tools, tool loop, which tool fits which task."
      },
      {
        "type": "docs",
        "title": "Function calling",
        "by": "OpenAI",
        "url": "https://developers.openai.com/api/docs/guides/function-calling",
        "year": 2026,
        "note": "Function and custom tools, strict mode, namespaces, tool search."
      },
      {
        "type": "docs",
        "title": "Function calling with the Gemini API",
        "by": "Google AI for Developers",
        "url": "https://ai.google.dev/gemini-api/docs/function-calling",
        "year": 2026,
        "note": "Calling modes, parallel and compositional function calls."
      },
      {
        "type": "docs",
        "title": "Structured outputs",
        "by": "Anthropic",
        "url": "https://platform.claude.com/docs/en/build-with-claude/structured-outputs",
        "year": 2026,
        "note": "Schema-validated JSON outputs and strict tool inputs for Claude."
      },
      {
        "type": "docs",
        "title": "Structured model outputs",
        "by": "OpenAI",
        "url": "https://developers.openai.com/api/docs/guides/structured-outputs",
        "year": 2026,
        "note": "JSON Schema-conformant responses and strict function calling."
      },
      {
        "type": "docs",
        "title": "Computer use tool",
        "by": "Anthropic",
        "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool",
        "year": 2026,
        "note": "Current computer_toolset_20260801, agent loop, security guidance."
      },
      {
        "type": "docs",
        "title": "Browser use tool",
        "by": "Anthropic",
        "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool",
        "year": 2026,
        "note": "Page-level browser actions without a full desktop."
      },
      {
        "type": "docs",
        "title": "Computer use",
        "by": "OpenAI",
        "url": "https://developers.openai.com/api/docs/guides/tools-computer-use",
        "year": 2026,
        "note": "Code-execution harness vs computer tool in Responses API."
      },
      {
        "type": "docs",
        "title": "Computer use",
        "by": "Google AI for Developers (Gemini API)",
        "url": "https://ai.google.dev/gemini-api/docs/computer-use",
        "year": 2026,
        "note": "Gemini computer-use loop, environments, safety decisions."
      },
      {
        "type": "blog",
        "title": "Writing effective tools for agents — with agents",
        "by": "Anthropic Engineering (Ken Aizawa)",
        "url": "https://www.anthropic.com/engineering/writing-tools-for-agents",
        "year": 2025,
        "note": "Principles and eval loop for designing agent-friendly tools."
      },
      {
        "type": "blog",
        "title": "Introducing advanced tool use on the Claude Developer Platform",
        "by": "Anthropic Engineering (Bin Wu et al.)",
        "url": "https://www.anthropic.com/engineering/advanced-tool-use",
        "year": 2025,
        "note": "Tool search, programmatic tool calling, tool use examples, with metrics."
      },
      {
        "type": "blog",
        "title": "Developing a computer use model",
        "by": "Anthropic",
        "url": "https://www.anthropic.com/news/developing-computer-use",
        "year": 2024,
        "note": "How Anthropic trained Claude to operate computers via screenshots."
      },
      {
        "type": "blog",
        "title": "Introducing the Gemini 2.5 Computer Use model",
        "by": "Google DeepMind",
        "url": "https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-computer-use-model/",
        "year": 2025,
        "note": "Browser-focused computer-use model behind Project Mariner."
      },
      {
        "type": "tool",
        "title": "Browser Use Open Source",
        "by": "Browser Use",
        "url": "https://docs.browser-use.com/open-source/introduction",
        "year": 2026,
        "note": "Popular open-source Python library for browser agents."
      },
      {
        "type": "video",
        "title": "What is Tool Calling? Connecting LLMs to Your Data",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=h8gMhXYAv1k",
        "year": 2025,
        "note": "Short whiteboard explainer of the tool-calling loop."
      },
      {
        "type": "video",
        "title": "Introduction to Operator & Agents",
        "by": "OpenAI",
        "url": "https://www.youtube.com/watch?v=CSE77wAdDLg",
        "year": 2025,
        "note": "Launch of Operator and the Computer-Using Agent (CUA)."
      },
      {
        "type": "video",
        "title": "Introduction to ChatGPT agent",
        "by": "OpenAI",
        "url": "https://www.youtube.com/watch?v=1jn_RpbPbEc",
        "year": 2025,
        "note": "Launch of ChatGPT agent (Jul 2025)."
      }
    ]
  },
  "mcp": {
    "aka": [
      "model context protocol (mcp)",
      "mcp",
      "model context protocol",
      "mcp server",
      "mcp client",
      "connector",
      "connectors",
      "integration",
      "usb-c",
      "resources",
      "mcp apps",
      "registry"
    ],
    "facts": [
      {
        "text": "Current specification: revision 2026-07-28. The core is now stateless (no initialisation handshake or sessions); long-running Tasks became an extension; Roots, Sampling, Logging and dynamic client registration are deprecated.",
        "source": "https://modelcontextprotocol.io/specification/2026-07-28/changelog"
      },
      {
        "text": "The maintainers reported close to half a billion monthly SDK downloads at that release.",
        "source": "https://blog.modelcontextprotocol.io/posts/2026-07-28/"
      },
      {
        "text": "Official extensions include MCP Apps (interactive UI), Tasks, Skills over MCP and enterprise-managed authorisation.",
        "source": "https://modelcontextprotocol.io/extensions/overview"
      },
      {
        "text": "Presenting MCP servers as code APIs cut one Drive-to-Salesforce workflow from about 150,000 to 2,000 tokens (Anthropic, November 2025).",
        "source": "https://www.anthropic.com/engineering/code-execution-with-mcp"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "What is the Model Context Protocol (MCP)?",
        "by": "Model Context Protocol (modelcontextprotocol.io)",
        "url": "https://modelcontextprotocol.io/docs/getting-started/intro",
        "year": 2026,
        "note": "Official intro: hosts, clients, servers, why MCP exists."
      },
      {
        "type": "definition",
        "title": "What is Model Context Protocol (MCP)?",
        "by": "IBM Think (Anna Gutowska)",
        "url": "https://www.ibm.com/think/topics/model-context-protocol",
        "year": 2025,
        "note": "Neutral explainer of MCP architecture and use cases."
      },
      {
        "type": "spec",
        "title": "Specification",
        "by": "Model Context Protocol (revision 2026-07-28; AAIF / Linux Foundation)",
        "url": "https://modelcontextprotocol.io/specification/2026-07-28",
        "year": 2026,
        "note": "Authoritative current protocol specification."
      },
      {
        "type": "spec",
        "title": "Key Changes",
        "by": "Model Context Protocol (2026-07-28 changelog)",
        "url": "https://modelcontextprotocol.io/specification/2026-07-28/changelog",
        "year": 2026,
        "note": "What changed since 2025-11-25: stateless, MRTR, deprecations."
      },
      {
        "type": "blog",
        "title": "The 2026-07-28 Specification",
        "by": "MCP Blog (David Soria Parra, Den Delimarsky)",
        "url": "https://blog.modelcontextprotocol.io/posts/2026-07-28/",
        "year": 2026,
        "note": "Maintainers explain the release and adoption numbers."
      },
      {
        "type": "blog",
        "title": "Introducing the Model Context Protocol",
        "by": "Anthropic",
        "url": "https://www.anthropic.com/news/model-context-protocol",
        "year": 2024,
        "note": "Original Nov 2024 launch announcement."
      },
      {
        "type": "blog",
        "title": "Donating the Model Context Protocol and establishing the Agentic AI Foundation",
        "by": "Anthropic",
        "url": "https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation",
        "year": 2025,
        "note": "MCP moves to Linux Foundation's AAIF (Dec 2025)."
      },
      {
        "type": "video",
        "title": "What is MCP? Integrate AI Agents with Databases & APIs",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=eur8dUO9mvE",
        "year": 2025,
        "note": "Concise visual explainer of MCP clients and servers."
      },
      {
        "type": "video",
        "title": "Building Agents with Model Context Protocol - Full Workshop with Mahesh Murag of Anthropic",
        "by": "AI Engineer",
        "url": "https://www.youtube.com/watch?v=kQmXtrmQ5Zg",
        "year": 2025,
        "note": "Two-hour workshop by an Anthropic MCP engineer."
      }
    ]
  },
  "agent-loop": {
    "aka": [
      "agent loop (think, act, observe)",
      "agent loop",
      "react",
      "loop",
      "tool loop",
      "agentic loop",
      "turn",
      "reason act",
      "observation",
      "planning & task lists",
      "planning & to-dos",
      "plan mode",
      "todo",
      "to-do list",
      "task list",
      "decomposition",
      "spec",
      "tree of thoughts",
      "plan and solve",
      "verification & self-correction",
      "verification",
      "tests",
      "testing",
      "self-correction",
      "reflection",
      "reflexion",
      "self-refine",
      "critic",
      "reviewer",
      "evaluator",
      "llm as judge",
      "tdd",
      "check work",
      "agent",
      "ai agent",
      "agentic"
    ],
    "facts": [
      {
        "text": "ReAct (2022) interleaved reasoning with actions and beat imitation and reinforcement-learning baselines by 34 and 10 percentage points on two interactive benchmarks, using only one or two examples.",
        "source": "https://arxiv.org/abs/2210.03629"
      },
      {
        "text": "Claude Code's plan mode lets the agent read files and run exploratory commands but blocks edits until you approve the plan.",
        "source": "https://code.claude.com/docs/en/permission-modes"
      },
      {
        "text": "Claude Code best practices: “Give Claude a check it can run: tests, a build, a screenshot to compare. It's the difference between a session you watch and one you walk away from.”",
        "source": "https://code.claude.com/docs/en/best-practices"
      },
      {
        "text": "Claude Agent SDK: “Each full cycle is one turn”, and the model keeps calling tools until it produces a response with no tool calls. Hooks can intercept, modify or block each call.",
        "source": "https://code.claude.com/docs/en/agent-sdk/agent-loop"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "Building effective agents",
        "by": "Anthropic (Erik Schluntz, Barry Zhang)",
        "url": "https://www.anthropic.com/engineering/building-effective-agents",
        "year": 2024,
        "note": "Canonical workflows-vs-agents distinction and five workflow patterns."
      },
      {
        "type": "definition",
        "title": "I think “agent” may finally have a widely enough agreed upon definition to be useful jargon now",
        "by": "Simon Willison",
        "url": "https://simonwillison.net/2025/Sep/18/agents/",
        "year": 2025,
        "note": "Origin of 'an LLM agent runs tools in a loop to achieve a goal'."
      },
      {
        "type": "definition",
        "title": "What is AI Agent Planning?",
        "by": "IBM Think",
        "url": "https://www.ibm.com/think/topics/ai-agent-planning",
        "year": 2025,
        "note": "Explainer of how agents decompose goals into steps."
      },
      {
        "type": "docs",
        "title": "How the agent loop works",
        "by": "Anthropic - Claude Agent SDK docs",
        "url": "https://code.claude.com/docs/en/agent-sdk/agent-loop",
        "year": 2026,
        "note": "Turns, tool execution, message stream, hooks, budgets."
      },
      {
        "type": "docs",
        "title": "Running agents",
        "by": "OpenAI - Agents SDK docs",
        "url": "https://openai.github.io/openai-agents-python/running_agents/",
        "year": 2026,
        "note": "Runner loop: final output, handoffs, tool calls, max_turns."
      },
      {
        "type": "docs",
        "title": "How Claude Code works",
        "by": "Anthropic - Claude Code docs",
        "url": "https://code.claude.com/docs/en/how-claude-code-works",
        "year": 2026,
        "note": "Agentic loop (gather, act, verify), tools, context, checkpoints."
      },
      {
        "type": "docs",
        "title": "Choose a permission mode (plan mode)",
        "by": "Anthropic - Claude Code docs",
        "url": "https://code.claude.com/docs/en/permission-modes",
        "year": 2026,
        "note": "How plan mode blocks edits until a plan is approved."
      },
      {
        "type": "docs",
        "title": "Track todos",
        "by": "Anthropic - Claude Agent SDK docs",
        "url": "https://code.claude.com/docs/en/agent-sdk/todo-tracking",
        "year": 2026,
        "note": "Todo/task tools, lifecycle and model availability."
      },
      {
        "type": "docs",
        "title": "Best practices for Claude Code",
        "by": "Anthropic - Claude Code docs",
        "url": "https://code.claude.com/docs/en/best-practices",
        "year": 2026,
        "note": "'Give Claude a way to verify its work' and other practices."
      },
      {
        "type": "paper",
        "title": "ReAct: Synergizing Reasoning and Acting in Language Models",
        "by": "Shunyu Yao et al. (Princeton, Google)",
        "url": "https://arxiv.org/abs/2210.03629",
        "year": 2022,
        "note": "Seminal think-act-observe loop interleaving reasoning and tool actions."
      },
      {
        "type": "paper",
        "title": "Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models",
        "by": "Lei Wang et al.",
        "url": "https://arxiv.org/abs/2305.04091",
        "year": 2023,
        "note": "Plan first, then solve subtasks; ACL 2023."
      },
      {
        "type": "paper",
        "title": "ReWOO: Decoupling Reasoning from Observations for Efficient Augmented Language Models",
        "by": "Binfeng Xu et al.",
        "url": "https://arxiv.org/abs/2305.18323",
        "year": 2023,
        "note": "Planner/Worker/Solver architecture that plans before tool calls."
      },
      {
        "type": "paper",
        "title": "Tree of Thoughts: Deliberate Problem Solving with Large Language Models",
        "by": "Shunyu Yao et al.",
        "url": "https://arxiv.org/abs/2305.10601",
        "year": 2023,
        "note": "Tree search over thoughts with lookahead and backtracking."
      },
      {
        "type": "paper",
        "title": "Reflexion: Language Agents with Verbal Reinforcement Learning",
        "by": "Noah Shinn et al.",
        "url": "https://arxiv.org/abs/2303.11366",
        "year": 2023,
        "note": "Self-reflection stored as memory to improve subsequent attempts."
      },
      {
        "type": "paper",
        "title": "Self-Refine: Iterative Refinement with Self-Feedback",
        "by": "Aman Madaan et al.",
        "url": "https://arxiv.org/abs/2303.17651",
        "year": 2023,
        "note": "Generate-critique-revise loop with a single LLM."
      },
      {
        "type": "paper",
        "title": "Large Language Models Cannot Self-Correct Reasoning Yet",
        "by": "Jie Huang et al. (Google DeepMind)",
        "url": "https://arxiv.org/abs/2310.01798",
        "year": 2023,
        "note": "Limits of intrinsic self-correction without external feedback."
      },
      {
        "type": "guide",
        "title": "A practical guide to building agents",
        "by": "OpenAI",
        "url": "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf",
        "year": 2025,
        "note": "When to build agents; model/tools/instructions; orchestration; guardrails."
      },
      {
        "type": "blog",
        "title": "Unrolling the Codex agent loop",
        "by": "OpenAI (Michael Bolin)",
        "url": "https://openai.com/index/unrolling-the-codex-agent-loop/",
        "year": 2026,
        "note": "How Codex's agent loop orchestrates model, tools and context."
      },
      {
        "type": "blog",
        "title": "Agentic Design Patterns Part 4: Planning",
        "by": "Andrew Ng (DeepLearning.AI The Batch)",
        "url": "https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-4-planning/",
        "year": 2024,
        "note": "Ng on planning as an agentic design pattern."
      },
      {
        "type": "blog",
        "title": "Harness design for long-running application development",
        "by": "Anthropic (Prithvi Rajasekaran)",
        "url": "https://www.anthropic.com/engineering/harness-design-long-running-apps",
        "year": 2026,
        "note": "Why separate evaluator agents beat self-grading."
      },
      {
        "type": "blog",
        "title": "Agentic Design Patterns Part 2: Reflection",
        "by": "Andrew Ng (DeepLearning.AI The Batch)",
        "url": "https://www.deeplearning.ai/the-batch/agentic-design-patterns-part-2-reflection/",
        "year": 2024,
        "note": "Reflection as a simple, high-impact agentic pattern."
      },
      {
        "type": "tool",
        "title": "Evaluator optimizer",
        "by": "Anthropic - Claude Cookbook",
        "url": "https://platform.claude.com/cookbook/patterns-agents-evaluator-optimizer",
        "year": 2026,
        "note": "Runnable generator + evaluator feedback loop."
      },
      {
        "type": "video",
        "title": "Claude Agent SDK [Full Workshop] — Thariq Shihipar, Anthropic",
        "by": "AI Engineer",
        "url": "https://www.youtube.com/watch?v=TqC1qOfiVcQ",
        "year": 2026,
        "note": "Builds an agent loop with bash, files and verification from scratch."
      },
      {
        "type": "video",
        "title": "Tree of Thoughts: Deliberate Problem Solving with Large Language Models (Full Paper Review)",
        "by": "Yannic Kilcher",
        "url": "https://www.youtube.com/watch?v=ut5kp56wW_4",
        "year": 2023,
        "note": "Detailed walkthrough of the Tree of Thoughts paper."
      },
      {
        "type": "video",
        "title": "Claude Code best practices | Code w/ Claude",
        "by": "Anthropic",
        "url": "https://www.youtube.com/watch?v=gv0WHhKelSE",
        "year": 2025,
        "note": "Anthropic talk on Claude Code workflows incl. tests and verification."
      }
    ]
  },
  "harness": {
    "aka": [
      "harness (agent runtime)",
      "harness",
      "runtime",
      "scaffold",
      "scaffolding",
      "agent framework",
      "claude code",
      "codex",
      "gemini cli",
      "cursor",
      "copilot",
      "devin",
      "openhands",
      "goose",
      "cline",
      "harness engineering",
      "coding agent",
      "surfaces & interfaces",
      "ui",
      "chat",
      "ide",
      "cli",
      "terminal",
      "desktop",
      "browser",
      "slack",
      "generative ui",
      "ag-ui",
      "mcp apps",
      "agent client protocol",
      "acp",
      "agent sdks & frameworks",
      "agent sdks",
      "framework",
      "library",
      "langgraph",
      "langchain",
      "crewai",
      "autogen",
      "semantic kernel",
      "adk",
      "agents sdk",
      "claude agent sdk",
      "pydantic ai",
      "vercel ai sdk",
      "strands",
      "agentcore",
      "mastra",
      "smolagents",
      "llamaindex",
      "chatgpt",
      "claude",
      "gemini",
      "app"
    ],
    "facts": [
      {
        "text": "Claude Code's documentation calls “the layer around the model that provides the tools and manages the context the model sees” the agentic harness.",
        "source": "https://code.claude.com/docs/en/how-claude-code-works"
      },
      {
        "text": "MCP Apps, the first official MCP extension (January 2026), lets tools return interactive interfaces inside a chat. Claude, ChatGPT, VS Code Copilot, Microsoft 365 Copilot, Cursor and Goose render them.",
        "source": "https://modelcontextprotocol.io/extensions/client-matrix"
      },
      {
        "text": "Microsoft Agent Framework 1.0 (3 April 2026) is the “direct successor” to Semantic Kernel and AutoGen, built by the same teams.",
        "source": "https://learn.microsoft.com/en-us/agent-framework/overview/"
      },
      {
        "text": "OpenAI's “Harness engineering” post (February 2026) describes a five-month internal project that shipped a beta product with no manually written code: humans steer, agents execute.",
        "source": "https://openai.com/index/harness-engineering/"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "Agent Harness",
        "by": "Microsoft Learn - Agent Framework",
        "url": "https://learn.microsoft.com/en-us/agent-framework/concepts/harness",
        "year": 2026,
        "note": "Vendor-neutral definition plus capability matrix of a harness."
      },
      {
        "type": "definition",
        "title": "AI browser",
        "by": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/AI_browser",
        "year": 2026,
        "note": "Defines AI and agentic browsers, examples and risks."
      },
      {
        "type": "spec",
        "title": "Introduction - Agent Client Protocol",
        "by": "Agent Client Protocol (Zed and community)",
        "url": "https://agentclientprotocol.com/get-started/introduction",
        "year": 2026,
        "note": "Open protocol connecting editors and coding agents."
      },
      {
        "type": "spec",
        "title": "AG-UI Overview",
        "by": "AG-UI (Agent User Interaction Protocol, CopilotKit)",
        "url": "https://docs.ag-ui.com/introduction",
        "year": 2026,
        "note": "Event protocol connecting agent backends to frontends."
      },
      {
        "type": "docs",
        "title": "Platforms and integrations",
        "by": "Anthropic (Claude Code Docs)",
        "url": "https://code.claude.com/docs/en/platforms",
        "year": 2026,
        "note": "Compares CLI, Desktop, IDE, web, mobile, Slack, CI surfaces."
      },
      {
        "type": "docs",
        "title": "Use ChatGPT",
        "by": "OpenAI (ChatGPT Learn)",
        "url": "https://learn.chatgpt.com/docs/use-chatgpt",
        "year": 2026,
        "note": "Chat vs ChatGPT Work vs Codex modes in one app."
      },
      {
        "type": "docs",
        "title": "Agent SDK overview",
        "by": "Anthropic - Claude Agent SDK docs",
        "url": "https://code.claude.com/docs/en/agent-sdk/overview",
        "year": 2026,
        "note": "Claude Code's harness as a Python/TypeScript library."
      },
      {
        "type": "docs",
        "title": "Claude Managed Agents overview",
        "by": "Anthropic - Claude Platform docs",
        "url": "https://platform.claude.com/docs/en/managed-agents/overview",
        "year": 2026,
        "note": "Hosted agent harness with cloud or self-hosted sandboxes (beta)."
      },
      {
        "type": "docs",
        "title": "OpenAI Agents SDK",
        "by": "OpenAI",
        "url": "https://openai.github.io/openai-agents-python/",
        "year": 2026,
        "note": "Agents, tools, handoffs, guardrails, sessions, tracing (Python)."
      },
      {
        "type": "docs",
        "title": "Agents",
        "by": "OpenAI API docs",
        "url": "https://developers.openai.com/api/docs/guides/agents",
        "year": 2026,
        "note": "Choosing between Agents API, Agents SDK, Responses API, ChatKit."
      },
      {
        "type": "docs",
        "title": "Agent Development Kit (ADK)",
        "by": "Google",
        "url": "https://adk.dev/",
        "year": 2026,
        "note": "ADK 2.x docs: agents, graph workflows, multi-agent, deployment."
      },
      {
        "type": "docs",
        "title": "Microsoft Agent Framework Overview",
        "by": "Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/agent-framework/overview/",
        "year": 2026,
        "note": "Agents, Harness Agent, workflows; successor to SK and AutoGen."
      },
      {
        "type": "paper",
        "title": "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering",
        "by": "John Yang et al. (Princeton)",
        "url": "https://arxiv.org/abs/2405.15793",
        "year": 2024,
        "note": "Seminal paper showing the agent-computer interface drives performance."
      },
      {
        "type": "paper",
        "title": "Terminal-Bench: Benchmarking Agents on Hard, Realistic Tasks in Command Line Interfaces",
        "by": "Mike A. Merrill et al.",
        "url": "https://arxiv.org/abs/2601.11868",
        "year": 2026,
        "note": "Terminal-Bench 2.0: 89 hard CLI tasks to compare agent harnesses."
      },
      {
        "type": "guide",
        "title": "Harness engineering",
        "by": "Birgitta Böckeler (Thoughtworks), martinfowler.com",
        "url": "https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html",
        "year": 2026,
        "note": "Build an outer harness of guides (feedforward) and sensors (feedback) around agents."
      },
      {
        "type": "blog",
        "title": "Effective harnesses for long-running agents",
        "by": "Anthropic",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
        "year": 2025,
        "note": "Initializer + coding agent, progress files, feature lists, git."
      },
      {
        "type": "blog",
        "title": "Building agents with the Claude Agent SDK",
        "by": "Anthropic",
        "url": "https://claude.com/resources/articles/building-agents-with-the-claude-agent-sdk",
        "year": 2025,
        "note": "Why Claude Code's harness became a general agent SDK."
      },
      {
        "type": "blog",
        "title": "Harness engineering: leveraging Codex in an agent-first world",
        "by": "OpenAI (Ryan Lopopolo)",
        "url": "https://openai.com/index/harness-engineering/",
        "year": 2026,
        "note": "Shipping a product with zero hand-written code via harness design."
      },
      {
        "type": "blog",
        "title": "Harness design for long-running application development",
        "by": "Anthropic (Prithvi Rajasekaran)",
        "url": "https://www.anthropic.com/engineering/harness-design-long-running-apps",
        "year": 2026,
        "note": "Planner-generator-evaluator harness; cost vs quality trade-offs."
      },
      {
        "type": "blog",
        "title": "A harness for every task: dynamic workflows in Claude Code",
        "by": "Anthropic (Thariq Shihipar, Sid Bidasaria)",
        "url": "https://claude.dev/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code/",
        "year": 2026,
        "note": "Claude writes task-specific multi-agent harnesses as scripts."
      },
      {
        "type": "blog",
        "title": "Bring Your Own Agent to Zed — Featuring Gemini CLI",
        "by": "Zed (Nathan Sobo)",
        "url": "https://zed.dev/blog/bring-your-own-agent-to-zed",
        "year": 2025,
        "note": "Launch post introducing ACP."
      },
      {
        "type": "blog",
        "title": "JetBrains × Zed: Open Interoperability for AI Coding Agents in Your IDE",
        "by": "JetBrains",
        "url": "https://blog.jetbrains.com/ai/2025/10/jetbrains-zed-open-interoperability-for-ai-coding-agents-in-your-ide/",
        "year": 2025,
        "note": "JetBrains joins ACP for agents in its IDEs."
      },
      {
        "type": "blog",
        "title": "Microsoft Agent Framework Version 1.0",
        "by": "Microsoft (Shawn Henry)",
        "url": "https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/",
        "year": 2026,
        "note": "1.0 GA announcement for .NET and Python."
      },
      {
        "type": "video",
        "title": "Harness Engineering: How to Build Software When Humans Steer, Agents Execute — Ryan Lopopolo, OpenAI",
        "by": "AI Engineer",
        "url": "https://www.youtube.com/watch?v=am_oeAoUhew",
        "year": 2026,
        "note": "OpenAI engineer on harness engineering with Codex."
      },
      {
        "type": "video",
        "title": "AI Model vs Agentic Harness: What Actually Drives AI",
        "by": "IBM Technology (Martin Keen)",
        "url": "https://www.youtube.com/watch?v=ZELPNFXJ4_o",
        "year": 2026,
        "note": "Separates the model from the harness around it: tools, memory and loops."
      },
      {
        "type": "video",
        "title": "What Is the Agent Client Protocol – and Why JetBrains and Zed Are Building It Together",
        "by": "JetBrains",
        "url": "https://www.youtube.com/watch?v=n11pDnBXPgk",
        "year": 2026,
        "note": "ACP explained by JetBrains and Zed."
      },
      {
        "type": "video",
        "title": "Meet ChatGPT Work",
        "by": "OpenAI",
        "url": "https://www.youtube.com/watch?v=yRc5HcGJ-Cs",
        "year": 2026,
        "note": "OpenAI's unified desktop agent surface (Jul 2026)."
      },
      {
        "type": "video",
        "title": "Introducing Agent Development Kit",
        "by": "Google for Developers",
        "url": "https://www.youtube.com/watch?v=zgrOwow_uTQ",
        "year": 2025,
        "note": "Official introduction to Google's ADK."
      },
      {
        "type": "video",
        "title": "Microsoft Agent Framework releasing version 1.0",
        "by": "Microsoft Developer",
        "url": "https://www.youtube.com/watch?v=suBDqt4677I",
        "year": 2026,
        "note": "Official walkthrough of the Agent Framework 1.0 release."
      }
    ]
  },
  "instructions": {
    "aka": [
      "instruction files (agents.md and friends)",
      "instruction files",
      "agents.md",
      "claude.md",
      "gemini.md",
      "rules",
      "cursor rules",
      "copilot instructions",
      "custom instructions",
      "project memory",
      "readme for agents"
    ],
    "facts": [
      {
        "text": "AGENTS.md is used by more than 60,000 open-source projects; the nearest file in the folder tree wins.",
        "source": "https://agents.md/"
      },
      {
        "text": "Since version 2.1.277 Claude Code reads AGENTS.md directly when there is no CLAUDE.md; GitHub Copilot reads AGENTS.md alongside its own instruction files.",
        "source": "https://code.claude.com/docs/en/memory"
      },
      {
        "text": "Evidence is mixed: a February 2026 study found that context files do not generally improve task success but raise inference cost by over 20%. Repository overviews did not help; specific instructions were followed.",
        "source": "https://arxiv.org/abs/2602.11988"
      },
      {
        "text": "Codex caps the combined chain of instruction files at 32 KiB by default.",
        "source": "https://learn.chatgpt.com/docs/agent-configuration/agents-md"
      }
    ],
    "sources": [
      {
        "type": "spec",
        "title": "AGENTS.md",
        "by": "agents.md (Agentic AI Foundation)",
        "url": "https://agents.md/",
        "year": 2025,
        "note": "Official site of the open AGENTS.md format with examples and FAQ."
      },
      {
        "type": "docs",
        "title": "How Claude remembers your project",
        "by": "Anthropic - Claude Code Docs",
        "url": "https://code.claude.com/docs/en/memory",
        "year": 2026,
        "note": "CLAUDE.md scopes, .claude/rules, AGENTS.md support, auto memory."
      },
      {
        "type": "docs",
        "title": "Custom instructions with AGENTS.md",
        "by": "OpenAI - Codex docs (ChatGPT Learn)",
        "url": "https://learn.chatgpt.com/docs/agent-configuration/agents-md",
        "year": 2026,
        "note": "How Codex discovers, layers and caps AGENTS.md files."
      },
      {
        "type": "docs",
        "title": "Adding repository custom instructions for GitHub Copilot",
        "by": "GitHub Docs",
        "url": "https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions",
        "year": 2026,
        "note": "copilot-instructions.md, path-specific instructions, AGENTS.md."
      },
      {
        "type": "docs",
        "title": "Rules",
        "by": "Cursor Docs",
        "url": "https://cursor.com/docs/rules",
        "year": 2026,
        "note": "Project, user and team rules (.mdc) and AGENTS.md in Cursor."
      },
      {
        "type": "docs",
        "title": "Provide context with GEMINI.md files",
        "by": "Google - Gemini CLI docs",
        "url": "https://geminicli.com/docs/cli/gemini-md/",
        "year": 2026,
        "note": "Hierarchical and just-in-time GEMINI.md context files."
      },
      {
        "type": "paper",
        "title": "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?",
        "by": "Gloaguen, Mündler-Sasahara, Müller, Raychev, Vechev",
        "url": "https://arxiv.org/abs/2602.11988",
        "year": 2026,
        "note": "Context files rarely raise success and add 20%+ cost."
      },
      {
        "type": "paper",
        "title": "On the Impact of AGENTS.md Files on the Efficiency of AI Coding Agents",
        "by": "Lulla, Mohsenimofidi, Galster, Zhang et al.",
        "url": "https://arxiv.org/abs/2601.20404",
        "year": 2026,
        "note": "AGENTS.md linked to faster runs and fewer output tokens."
      },
      {
        "type": "blog",
        "title": "Linux Foundation Announces the Formation of the Agentic AI Foundation (AAIF), Anchored by New Project Contributions Including Model Context Protocol (MCP), goose and AGENTS.md",
        "by": "Linux Foundation",
        "url": "https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation",
        "year": 2025,
        "note": "Press release: AGENTS.md moves to neutral foundation governance."
      }
    ]
  },
  "skills": {
    "aka": [
      "agent skills",
      "skills",
      "skill",
      "skill.md",
      "progressive disclosure",
      "procedural knowledge",
      "agentskills.io",
      "capabilities",
      "playbooks & runbooks",
      "playbooks",
      "playbook",
      "runbook",
      "sop",
      "standard operating procedure",
      "procedure",
      "checklist",
      "recipe",
      "devin playbooks",
      "ace",
      "slash commands & prompt templates",
      "slash commands",
      "slash command",
      "/command",
      "prompt template",
      "custom prompt",
      "prompt file",
      "saved prompt",
      "mcp prompts",
      "macro",
      "plugins & extensions",
      "plugins",
      "plugin",
      "extension",
      "marketplace",
      "bundle",
      "package",
      "apps",
      "chatgpt apps",
      "gemini extensions"
    ],
    "facts": [
      {
        "text": "The open standard (December 2025) requires only a name and a description. In October 2026 agentskills.io lists 46 compatible products, including Claude Code, ChatGPT and Codex, GitHub Copilot, VS Code, Cursor and Gemini CLI.",
        "source": "https://agentskills.io/home"
      },
      {
        "text": "Devin: “A playbook is like a custom system prompt for a repeated task.” Its template has sections for procedure, specifications, advice, forbidden actions and what is required from the user.",
        "source": "https://docs.devin.ai/product-guides/creating-playbooks"
      },
      {
        "text": "Claude Code: “Custom commands have been merged into skills.” Old command files keep working; skills add supporting files and automatic loading.",
        "source": "https://code.claude.com/docs/en/skills"
      },
      {
        "text": "Claude Code plugins (October 2025) bundle skills, agents, hooks and MCP servers, and marketplaces are plain Git repositories. Claude Cowork plugins (January 2026) package the same for business roles.",
        "source": "https://code.claude.com/docs/en/plugins/overview"
      }
    ],
    "sources": [
      {
        "type": "spec",
        "title": "Specification - Agent Skills",
        "by": "agentskills.io (open standard, originated at Anthropic)",
        "url": "https://agentskills.io/specification",
        "year": 2025,
        "note": "Normative SKILL.md format, frontmatter fields, directory layout."
      },
      {
        "type": "spec",
        "title": "Prompts",
        "by": "Model Context Protocol specification (2026-07-28)",
        "url": "https://modelcontextprotocol.io/specification/2026-07-28/server/prompts",
        "year": 2026,
        "note": "MCP prompt templates, user-controlled, often shown as slash commands."
      },
      {
        "type": "spec",
        "title": "Agent Plugins",
        "by": "agent-plugins.org (open standard)",
        "url": "https://agent-plugins.org/",
        "year": 2026,
        "note": "Portable plugin.json + skills + mcp.json packaging standard."
      },
      {
        "type": "docs",
        "title": "Agent Skills",
        "by": "Anthropic - Claude Platform Docs",
        "url": "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview",
        "year": 2026,
        "note": "Using skills through the Claude API and apps."
      },
      {
        "type": "docs",
        "title": "Extend Claude with skills",
        "by": "Anthropic - Claude Code Docs",
        "url": "https://code.claude.com/docs/en/skills",
        "year": 2026,
        "note": "Authoring, invoking and sharing skills in Claude Code."
      },
      {
        "type": "docs",
        "title": "Creating Playbooks",
        "by": "Cognition - Devin Docs",
        "url": "https://docs.devin.ai/product-guides/creating-playbooks",
        "year": 2026,
        "note": "What playbooks are, template sections, sharing via macros."
      },
      {
        "type": "docs",
        "title": "Devin Skills",
        "by": "Cognition - Devin Docs",
        "url": "https://docs.devin.ai/product-guides/skills",
        "year": 2026,
        "note": "Skills vs playbooks vs memory comparison table."
      },
      {
        "type": "docs",
        "title": "Playbooks",
        "by": "Google Cloud - Dialogflow CX docs",
        "url": "https://docs.cloud.google.com/dialogflow/cx/docs/concept/playbook",
        "year": 2026,
        "note": "Vendor feature: goal, instructions, examples for generative agents."
      },
      {
        "type": "docs",
        "title": "Use promptbooks in Microsoft Security Copilot",
        "by": "Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/copilot/security/using-promptbooks",
        "year": 2026,
        "note": "Prebuilt prompt sequences used like security playbooks."
      },
      {
        "type": "docs",
        "title": "Commands",
        "by": "Anthropic - Claude Code Docs",
        "url": "https://code.claude.com/docs/en/commands",
        "year": 2026,
        "note": "Built-in commands, bundled skills and MCP prompts as commands."
      },
      {
        "type": "docs",
        "title": "Custom commands",
        "by": "Google - Gemini CLI docs",
        "url": "https://geminicli.com/docs/cli/custom-commands/",
        "year": 2026,
        "note": "TOML command files, namespacing and arguments."
      },
      {
        "type": "docs",
        "title": "Custom Prompts",
        "by": "OpenAI - Codex docs (ChatGPT Learn)",
        "url": "https://learn.chatgpt.com/docs/custom-prompts",
        "year": 2026,
        "note": "Deprecated Codex prompt commands; points to skills."
      },
      {
        "type": "docs",
        "title": "Use prompt files in VS Code",
        "by": "Microsoft - VS Code docs",
        "url": "https://code.visualstudio.com/docs/agent-customization/prompt-files",
        "year": 2026,
        "note": ".prompt.md slash commands and migration to skills."
      },
      {
        "type": "docs",
        "title": "Skills (How do I migrate commands to skills?)",
        "by": "Cursor Help",
        "url": "https://cursor.com/help/customization/skills",
        "year": 2026,
        "note": "Cursor's /migrate-to-skills for commands and rules."
      },
      {
        "type": "docs",
        "title": "Plugins overview",
        "by": "Anthropic - Claude Code Docs",
        "url": "https://code.claude.com/docs/en/plugins/overview",
        "year": 2026,
        "note": "What a Claude Code plugin contains and when to use one."
      },
      {
        "type": "docs",
        "title": "Plugins",
        "by": "OpenAI - ChatGPT and Codex docs (ChatGPT Learn)",
        "url": "https://learn.chatgpt.com/docs/plugins",
        "year": 2026,
        "note": "Universal plugin directory across ChatGPT and Codex surfaces."
      },
      {
        "type": "docs",
        "title": "Gemini CLI extensions",
        "by": "Google - Gemini CLI docs",
        "url": "https://geminicli.com/docs/extensions/",
        "year": 2026,
        "note": "Packaging commands, MCP, hooks, sub-agents and skills."
      },
      {
        "type": "docs",
        "title": "Agent plugins in VS Code",
        "by": "Microsoft - VS Code docs",
        "url": "https://code.visualstudio.com/docs/agent-customization/agent-plugins",
        "year": 2026,
        "note": "Installing plugin bundles from marketplaces in VS Code."
      },
      {
        "type": "docs",
        "title": "Plugins",
        "by": "Cursor Docs",
        "url": "https://cursor.com/docs/plugins",
        "year": 2026,
        "note": "Cursor plugin components, Agent Plugins support, Marketplace."
      },
      {
        "type": "paper",
        "title": "Voyager: An Open-Ended Embodied Agent with Large Language Models",
        "by": "Wang, Xie, Jiang, Mandlekar et al.",
        "url": "https://arxiv.org/abs/2305.16291",
        "year": 2023,
        "note": "Seminal skill library of executable code for lifelong learning."
      },
      {
        "type": "paper",
        "title": "SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks",
        "by": "Li, Liu, Chen, You et al.",
        "url": "https://arxiv.org/abs/2602.12670",
        "year": 2026,
        "note": "Paired benchmark: curated skills raise pass rates 16.6 pp."
      },
      {
        "type": "paper",
        "title": "Agentic Context Engineering: Evolving Contexts for Self-Improving Language Models",
        "by": "Zhang, Hu, Upasani, Ma et al.",
        "url": "https://arxiv.org/abs/2510.04618",
        "year": 2025,
        "note": "ACE: contexts as evolving playbooks via reflection and curation."
      },
      {
        "type": "paper",
        "title": "Dynamic Cheatsheet: Test-Time Learning with Adaptive Memory",
        "by": "Suzgun, Yuksekgonul, Bianchi, Jurafsky, Zou",
        "url": "https://arxiv.org/abs/2504.07952",
        "year": 2025,
        "note": "Self-curated memory of reusable strategies at inference time."
      },
      {
        "type": "paper",
        "title": "MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework",
        "by": "Hong, Zhuge, Chen, Zheng et al.",
        "url": "https://arxiv.org/abs/2308.00352",
        "year": 2023,
        "note": "Encodes human SOPs into multi-agent prompt workflows."
      },
      {
        "type": "course",
        "title": "Introduction to agent skills",
        "by": "Claude Academy (Anthropic)",
        "url": "https://academy.claude.com/courses/introduction-to-agent-skills",
        "year": 2026,
        "note": "Create, structure and share skills; compare them with sub-agents, hooks and MCP."
      },
      {
        "type": "blog",
        "title": "Equipping agents for the real world with Agent Skills",
        "by": "Anthropic (Barry Zhang, Keith Lazuka, Mahesh Murag)",
        "url": "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
        "year": 2025,
        "note": "Engineering rationale: SKILL.md, progressive disclosure, code in skills."
      },
      {
        "type": "blog",
        "title": "Claude Skills are awesome, maybe a bigger deal than MCP",
        "by": "Simon Willison",
        "url": "https://simonwillison.net/2025/Oct/16/claude-skills/",
        "year": 2025,
        "note": "Early analysis of skills' simplicity versus MCP."
      },
      {
        "type": "tool",
        "title": "anthropics/skills",
        "by": "Anthropic (GitHub)",
        "url": "https://github.com/anthropics/skills",
        "year": 2025,
        "note": "Public repository of example skills, spec and template."
      },
      {
        "type": "blog",
        "title": "Customize Claude Code with plugins",
        "by": "Anthropic",
        "url": "https://claude.com/resources/articles/claude-code-plugins",
        "year": 2025,
        "note": "Launch post: plugins and plugin marketplaces (Oct 2025)."
      },
      {
        "type": "blog",
        "title": "Customize Cowork with plugins",
        "by": "Anthropic",
        "url": "https://claude.com/resources/articles/cowork-plugins",
        "year": 2026,
        "note": "Role plugins for Claude Cowork; 11 open-sourced plugins."
      },
      {
        "type": "video",
        "title": "Don't Build Agents, Build Skills Instead – Barry Zhang & Mahesh Murag, Anthropic",
        "by": "AI Engineer",
        "url": "https://www.youtube.com/watch?v=CEvIs9y1uog",
        "year": 2025,
        "note": "Barry Zhang and Mahesh Murag on building skills instead of agents."
      }
    ]
  },
  "knowledge": {
    "aka": [
      "retrieval-augmented generation (rag)",
      "rag",
      "retrieval",
      "retrieval augmented generation",
      "knowledge base",
      "grounding",
      "chunking",
      "reranking",
      "graphrag",
      "agentic rag",
      "contextual retrieval",
      "citations",
      "embeddings & vector search",
      "embeddings",
      "embedding",
      "vector",
      "vector database",
      "vector db",
      "semantic search",
      "similarity",
      "cosine",
      "pgvector",
      "pinecone",
      "weaviate",
      "qdrant",
      "milvus",
      "chroma",
      "hybrid search",
      "bm25",
      "agentic search & web search",
      "agentic & web search",
      "agentic search",
      "grep",
      "glob",
      "web search",
      "browsing",
      "deep research",
      "research",
      "browsecomp"
    ],
    "facts": [
      {
        "text": "Anthropic's Contextual Retrieval (2024) cut failed retrievals by 49% with contextual embeddings plus BM25, and by 67% with reranking. For knowledge bases under about 200,000 tokens it suggests a cached prompt instead.",
        "source": "https://www.anthropic.com/engineering/contextual-retrieval"
      },
      {
        "text": "MTEB found that no single embedding method wins on every task; its multilingual successor MMTEB (2025) covers more than 500 tasks in over 250 languages.",
        "source": "https://arxiv.org/abs/2210.07316"
      },
      {
        "text": "Boris Cherny, who created Claude Code: the team tried RAG over a code index but “landed on just agentic search” (glob and grep), which “outperformed everything. By a lot.”",
        "source": "https://www.latent.space/p/claude-code"
      },
      {
        "text": "GraphRAG (Microsoft, 2024) builds an entity graph and community summaries to answer questions about a whole collection, which plain vector search handles poorly.",
        "source": "https://arxiv.org/abs/2404.16130"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "What is retrieval-augmented generation (RAG)?",
        "by": "IBM Research",
        "url": "https://research.ibm.com/blog/retrieval-augmented-generation-RAG",
        "year": 2023,
        "note": "Accessible definition and benefits of grounding LLMs."
      },
      {
        "type": "definition",
        "title": "Embeddings",
        "by": "Google for Developers - Machine Learning Crash Course",
        "url": "https://developers.google.com/machine-learning/crash-course/embeddings",
        "year": 2026,
        "note": "Intro to embedding spaces and similarity."
      },
      {
        "type": "docs",
        "title": "Hybrid Search Scoring (RRF)",
        "by": "Microsoft Learn - Azure AI Search",
        "url": "https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking",
        "year": 2026,
        "note": "How Reciprocal Rank Fusion merges keyword and vector results."
      },
      {
        "type": "docs",
        "title": "Web search tool",
        "by": "Anthropic - Claude Platform Docs",
        "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool",
        "year": 2026,
        "note": "Versions, dynamic filtering, citations, pricing."
      },
      {
        "type": "docs",
        "title": "Web search",
        "by": "OpenAI API docs",
        "url": "https://developers.openai.com/api/docs/guides/tools-web-search",
        "year": 2026,
        "note": "web_search tool modes, domain filters, citations."
      },
      {
        "type": "docs",
        "title": "Grounding with Google Search",
        "by": "Google AI for Developers - Gemini API",
        "url": "https://ai.google.dev/gemini-api/docs/google-search",
        "year": 2026,
        "note": "google_search tool, citations and billing."
      },
      {
        "type": "docs",
        "title": "Gemini Deep Research agent",
        "by": "Google AI for Developers - Gemini API",
        "url": "https://ai.google.dev/gemini-api/docs/deep-research",
        "year": 2026,
        "note": "Deep Research agent via the Interactions API."
      },
      {
        "type": "docs",
        "title": "Search",
        "by": "Cursor Docs",
        "url": "https://cursor.com/docs/agent/tools/search",
        "year": 2026,
        "note": "Instant Grep and Explore subagent; no codebase embeddings."
      },
      {
        "type": "paper",
        "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        "by": "Lewis, Perez, Piktus, Petroni et al.",
        "url": "https://arxiv.org/abs/2005.11401",
        "year": 2020,
        "note": "Seminal RAG paper (parametric + non-parametric memory)."
      },
      {
        "type": "paper",
        "title": "Retrieval-Augmented Generation for Large Language Models: A Survey",
        "by": "Gao, Xiong, Gao, Jia et al.",
        "url": "https://arxiv.org/abs/2312.10997",
        "year": 2023,
        "note": "Naive, advanced and modular RAG; components and evaluation."
      },
      {
        "type": "paper",
        "title": "From Local to Global: A Graph RAG Approach to Query-Focused Summarization",
        "by": "Edge, Trinh, Cheng, Bradley et al. (Microsoft)",
        "url": "https://arxiv.org/abs/2404.16130",
        "year": 2024,
        "note": "GraphRAG: knowledge graph + community summaries."
      },
      {
        "type": "paper",
        "title": "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks",
        "by": "Nils Reimers, Iryna Gurevych",
        "url": "https://arxiv.org/abs/1908.10084",
        "year": 2019,
        "note": "Seminal sentence-embedding method behind semantic search."
      },
      {
        "type": "paper",
        "title": "MTEB: Massive Text Embedding Benchmark",
        "by": "Muennighoff, Tazi, Magne, Reimers",
        "url": "https://arxiv.org/abs/2210.07316",
        "year": 2022,
        "note": "Standard benchmark for comparing embedding models."
      },
      {
        "type": "paper",
        "title": "BrowseComp: A Simple Yet Challenging Benchmark for Browsing Agents",
        "by": "Wei, Sun, Papay, McKinney et al. (OpenAI)",
        "url": "https://arxiv.org/abs/2504.12516",
        "year": 2025,
        "note": "Benchmark of hard-to-find facts for web agents."
      },
      {
        "type": "guide",
        "title": "Rerankers and Two-Stage Retrieval",
        "by": "Pinecone (James Briggs)",
        "url": "https://www.pinecone.io/learn/series/rag/rerankers/",
        "year": 2023,
        "note": "Why and how to add a reranker after vector search."
      },
      {
        "type": "blog",
        "title": "Contextual Retrieval in AI Systems",
        "by": "Anthropic",
        "url": "https://www.anthropic.com/engineering/contextual-retrieval",
        "year": 2024,
        "note": "Contextual embeddings + contextual BM25 + reranking, with results."
      },
      {
        "type": "tool",
        "title": "MTEB Leaderboard",
        "by": "MTEB on Hugging Face",
        "url": "https://huggingface.co/spaces/mteb/leaderboard",
        "year": 2026,
        "note": "Live rankings of embedding models by task and language."
      },
      {
        "type": "blog",
        "title": "Claude Code: Anthropic's Agent in Your Terminal",
        "by": "Latent Space (with Boris Cherny & Cat Wu)",
        "url": "https://www.latent.space/p/claude-code",
        "year": 2025,
        "note": "Why Claude Code chose agentic search over a RAG index."
      },
      {
        "type": "blog",
        "title": "How we built our multi-agent research system",
        "by": "Anthropic (Hadfield, Zhang, Lien et al.)",
        "url": "https://www.anthropic.com/engineering/multi-agent-research-system",
        "year": 2025,
        "note": "Architecture, prompting and evals of Claude Research."
      },
      {
        "type": "video",
        "title": "What is Retrieval-Augmented Generation (RAG)?",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=T-D1OfcDW1M",
        "year": 2023,
        "note": "Short explainer of how RAG grounds LLM answers."
      },
      {
        "type": "video",
        "title": "RAG vs. Fine Tuning",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=00Q0G84kq3M",
        "year": 2024,
        "note": "When to retrieve versus when to fine-tune."
      },
      {
        "type": "video",
        "title": "What is a Vector Database?",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=t9IDoenf-lo",
        "year": 2024,
        "note": "Explainer of vector databases and similarity search."
      },
      {
        "type": "video",
        "title": "Transformers, the tech behind LLMs | Deep Learning Chapter 5",
        "by": "3Blue1Brown",
        "url": "https://www.youtube.com/watch?v=wjZofJX0v4M",
        "year": 2024,
        "note": "Visual intro to transformers, including word embeddings as directions in space."
      },
      {
        "type": "video",
        "title": "Introduction to Deep Research",
        "by": "OpenAI",
        "url": "https://www.youtube.com/watch?v=YkCDVn3_wiw",
        "year": 2025,
        "note": "Launch demo of ChatGPT deep research."
      }
    ]
  },
  "memory": {
    "aka": [
      "memory",
      "long-term memory",
      "short-term memory",
      "episodic",
      "semantic",
      "procedural",
      "notes",
      "progress file",
      "memory tool",
      "remember",
      "mem0",
      "letta",
      "memgpt",
      "compaction & context editing",
      "compaction",
      "compact",
      "summarize",
      "summarisation",
      "context editing",
      "clear tool results",
      "auto-compact",
      "context reset"
    ],
    "facts": [
      {
        "text": "CoALA (2023) describes agent memory as working memory plus long-term episodic, semantic and procedural memory, with explicit actions to read and write it.",
        "source": "https://arxiv.org/abs/2309.02427"
      },
      {
        "text": "The Claude API offers server-side compaction in two beta forms: on demand, or automatically at a threshold (150,000 input tokens by default), with custom summarisation instructions.",
        "source": "https://platform.claude.com/docs/en/build-with-claude/compaction"
      },
      {
        "text": "Claude Code's auto memory (2026) lets the agent write typed notes, and the first 200 lines load every session. Gemini CLI's experimental auto memory proposes memory and skill drafts into a review inbox.",
        "source": "https://code.claude.com/docs/en/memory"
      },
      {
        "text": "Context editing clears stale tool results instead of summarising. In a 100-turn web-search evaluation it cut token use by 84%; combined with the memory tool it improved results by 39% (Anthropic, September 2025).",
        "source": "https://claude.com/resources/articles/context-management"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "What Is AI Agent Memory?",
        "by": "IBM Think",
        "url": "https://www.ibm.com/think/topics/ai-agent-memory",
        "year": 2025,
        "note": "Explainer on short- and long-term agent memory types and frameworks."
      },
      {
        "type": "docs",
        "title": "Memory tool",
        "by": "Anthropic - Claude Platform Docs",
        "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool",
        "year": 2025,
        "note": "Client-side file memory for Claude agents; commands and security."
      },
      {
        "type": "docs",
        "title": "Memory overview",
        "by": "LangChain (LangGraph docs)",
        "url": "https://docs.langchain.com/oss/python/concepts/memory",
        "year": 2026,
        "note": "Short- vs long-term memory; semantic, episodic, procedural in practice."
      },
      {
        "type": "docs",
        "title": "Compaction overview",
        "by": "Anthropic - Claude Platform Docs",
        "url": "https://platform.claude.com/docs/en/build-with-claude/compaction",
        "year": 2026,
        "note": "On-demand vs threshold compaction vs client-side summarizers; beta headers."
      },
      {
        "type": "docs",
        "title": "Context editing",
        "by": "Anthropic - Claude Platform Docs",
        "url": "https://platform.claude.com/docs/en/build-with-claude/context-editing",
        "year": 2025,
        "note": "Rule-based clearing of old tool results and thinking blocks."
      },
      {
        "type": "docs",
        "title": "Compaction",
        "by": "OpenAI API docs",
        "url": "https://developers.openai.com/api/docs/guides/compaction",
        "year": 2025,
        "note": "Server-side compaction and the /responses/compact endpoint."
      },
      {
        "type": "docs",
        "title": "Context compression",
        "by": "Google - Agent Development Kit (ADK) docs",
        "url": "https://adk.dev/context/compaction/",
        "year": 2025,
        "note": "Token-based and sliding-window compaction of ADK session events."
      },
      {
        "type": "paper",
        "title": "Cognitive Architectures for Language Agents",
        "by": "Sumers, Yao, Narasimhan, Griffiths",
        "url": "https://arxiv.org/abs/2309.02427",
        "year": 2023,
        "note": "CoALA: working, episodic, semantic, procedural memory for agents."
      },
      {
        "type": "paper",
        "title": "MemGPT: Towards LLMs as Operating Systems",
        "by": "Packer, Wooders, Lin, Fang et al.",
        "url": "https://arxiv.org/abs/2310.08560",
        "year": 2023,
        "note": "OS-style virtual context management across memory tiers."
      },
      {
        "type": "paper",
        "title": "Generative Agents: Interactive Simulacra of Human Behavior",
        "by": "Park, O'Brien, Cai, Morris et al.",
        "url": "https://arxiv.org/abs/2304.03442",
        "year": 2023,
        "note": "Memory stream, reflection and retrieval for believable agents."
      },
      {
        "type": "course",
        "title": "LLMs as Operating Systems: Agent Memory",
        "by": "DeepLearning.AI with Letta",
        "url": "https://www.deeplearning.ai/courses/llms-as-operating-systems-agent-memory",
        "year": 2024,
        "note": "Short course building MemGPT-style self-editing memory agents."
      },
      {
        "type": "blog",
        "title": "Managing context on the Claude Developer Platform",
        "by": "Anthropic",
        "url": "https://claude.com/resources/articles/context-management",
        "year": 2025,
        "note": "Launch of context editing and memory tool with eval results."
      },
      {
        "type": "blog",
        "title": "Effective harnesses for long-running agents",
        "by": "Anthropic (Justin Young)",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
        "year": 2025,
        "note": "Why compaction alone fails; progress files, feature lists, git."
      }
    ]
  },
  "permissions": {
    "aka": [
      "permissions & approval modes",
      "permissions",
      "allow",
      "deny",
      "ask",
      "approval",
      "auto mode",
      "yolo",
      "least privilege",
      "allowlist",
      "policy",
      "trusted folders",
      "human-in-the-loop",
      "human in the loop",
      "review",
      "oversight",
      "escalation",
      "interrupt",
      "handoff to human",
      "autonomy levels"
    ],
    "facts": [
      {
        "text": "Anthropic found that people approve 93% of permission prompts, a sign of approval fatigue. Its classifier-based auto mode approves routine actions and blocks risky ones.",
        "source": "https://www.anthropic.com/engineering/claude-code-auto-mode"
      },
      {
        "text": "Anthropic (February 2026): new Claude Code users fully auto-approve about 20% of sessions, experienced users over 40%, while they interrupt slightly more often. Experience shifts oversight from approving to monitoring.",
        "source": "https://www.anthropic.com/research/measuring-agent-autonomy"
      },
      {
        "text": "Auto mode's published error rates: 0.4% false alarms on 10,000 real actions, but 17% of 52 genuinely overeager actions slipped through. Anthropic calls it no replacement for careful human review.",
        "source": "https://www.anthropic.com/engineering/claude-code-auto-mode"
      },
      {
        "text": "Anthropic's February 2026 study of agent autonomy also found that about 73% of tool calls on its API involve a human in the loop and only about 0.8% of actions look irreversible.",
        "source": "https://www.anthropic.com/research/measuring-agent-autonomy"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "least privilege - Glossary | CSRC",
        "by": "NIST Computer Security Resource Center",
        "url": "https://csrc.nist.gov/glossary/term/least_privilege",
        "year": 2026,
        "note": "Authoritative NIST definitions of the principle of least privilege."
      },
      {
        "type": "definition",
        "title": "What Is Human In The Loop (HITL)? | IBM",
        "by": "IBM Think",
        "url": "https://www.ibm.com/think/topics/human-in-the-loop",
        "year": 2025,
        "note": "Explainer: human oversight and intervention in AI systems."
      },
      {
        "type": "docs",
        "title": "Choose a permission mode",
        "by": "Anthropic (Claude Code Docs)",
        "url": "https://code.claude.com/docs/en/permission-modes",
        "year": 2026,
        "note": "All Claude Code modes, classifier-based auto mode, starting-mode rules."
      },
      {
        "type": "docs",
        "title": "Configure permissions",
        "by": "Anthropic (Claude Code Docs)",
        "url": "https://code.claude.com/docs/en/permissions",
        "year": 2026,
        "note": "Allow/ask/deny rules, deny-first precedence, managed organization policies."
      },
      {
        "type": "docs",
        "title": "Agent approvals & security",
        "by": "OpenAI (Codex docs, ChatGPT Learn)",
        "url": "https://learn.chatgpt.com/docs/agent-approvals-security",
        "year": 2026,
        "note": "Codex sandbox modes, approval policies, presets, network defaults, auto-review."
      },
      {
        "type": "docs",
        "title": "Policy engine | Gemini CLI",
        "by": "Google (Gemini CLI docs)",
        "url": "https://geminicli.com/docs/reference/policy-engine/",
        "year": 2026,
        "note": "TOML allow/deny/ask_user rules, priority tiers, approval modes."
      },
      {
        "type": "docs",
        "title": "Interrupts",
        "by": "LangChain (LangGraph docs)",
        "url": "https://docs.langchain.com/oss/python/langgraph/interrupts",
        "year": 2026,
        "note": "interrupt() and Command(resume) with checkpointers and thread IDs."
      },
      {
        "type": "docs",
        "title": "Human-in-the-loop",
        "by": "LangChain docs",
        "url": "https://docs.langchain.com/oss/python/langchain/human-in-the-loop",
        "year": 2026,
        "note": "HumanInTheLoopMiddleware: approve, edit, reject, respond per tool."
      },
      {
        "type": "docs",
        "title": "Human-in-the-loop - OpenAI Agents SDK",
        "by": "OpenAI",
        "url": "https://openai.github.io/openai-agents-python/human_in_the_loop/",
        "year": 2026,
        "note": "needs_approval, interruptions, RunState serialization, approve/reject."
      },
      {
        "type": "docs",
        "title": "Handle approvals and user input",
        "by": "Anthropic (Claude Agent SDK docs)",
        "url": "https://code.claude.com/docs/en/agent-sdk/user-input",
        "year": 2026,
        "note": "canUseTool approvals and AskUserQuestion clarifying questions."
      },
      {
        "type": "docs",
        "title": "Action confirmations - Agent Development Kit (ADK)",
        "by": "Google (ADK docs)",
        "url": "https://adk.dev/tools-custom/confirmation/",
        "year": 2026,
        "note": "Pause tools for yes/no or structured human confirmation."
      },
      {
        "type": "paper",
        "title": "Levels of Autonomy for AI Agents",
        "by": "K. J. Kevin Feng, David W. McDonald, Amy X. Zhang",
        "url": "https://arxiv.org/abs/2506.12469",
        "year": 2025,
        "note": "Five autonomy levels defined by user role, operator to observer."
      },
      {
        "type": "paper",
        "title": "Measuring AI agent autonomy in practice",
        "by": "Anthropic",
        "url": "https://www.anthropic.com/research/measuring-agent-autonomy",
        "year": 2026,
        "note": "Real-world data on auto-approval, interrupts and agent-initiated stops."
      },
      {
        "type": "paper",
        "title": "Anthropic Economic Index report: Cadences",
        "by": "Anthropic",
        "url": "https://www.anthropic.com/research/economic-index-june-2026-report",
        "year": 2026,
        "note": "Latest Economic Index: autonomy and automation across Claude products."
      },
      {
        "type": "blog",
        "title": "How we built Claude Code auto mode: a safer way to skip permissions",
        "by": "Anthropic Engineering (John Hughes)",
        "url": "https://www.anthropic.com/engineering/claude-code-auto-mode",
        "year": 2026,
        "note": "Classifier design, threat model, measured false-positive/negative rates."
      },
      {
        "type": "blog",
        "title": "Making Claude Code more secure and autonomous with sandboxing",
        "by": "Anthropic Engineering",
        "url": "https://www.anthropic.com/engineering/claude-code-sandboxing",
        "year": 2025,
        "note": "Filesystem + network isolation; sandboxing cut permission prompts 84%."
      },
      {
        "type": "video",
        "title": "12-Factor Agents: Patterns of reliable LLM applications — Dex Horthy, HumanLayer",
        "by": "AI Engineer",
        "url": "https://www.youtube.com/watch?v=8kMaTybvDUw",
        "year": 2025,
        "note": "Reliable-agent patterns incl. contacting humans via tool calls."
      }
    ]
  },
  "sandbox": {
    "aka": [
      "sandbox & code execution",
      "sandbox",
      "container",
      "vm",
      "microvm",
      "docker",
      "devcontainer",
      "code interpreter",
      "code execution",
      "isolation",
      "e2b",
      "firecracker",
      "gvisor",
      "egress"
    ],
    "facts": [
      {
        "text": "Anthropic's OS-level sandbox for Claude Code (file-system and network isolation) cut permission prompts by 84% internally; the runtime is open source.",
        "source": "https://www.anthropic.com/engineering/claude-code-sandboxing"
      },
      {
        "text": "Claude Code's docs compare six isolation tiers and recommend a VM or a hosted cloud session for untrusted repositories.",
        "source": "https://code.claude.com/docs/en/sandbox-environments"
      },
      {
        "text": "Docker Sandboxes run each agent in a micro-VM and inject credentials through a proxy, so keys never enter the VM.",
        "source": "https://docs.docker.com/ai/sandboxes/architecture/"
      },
      {
        "text": "GitHub made local sandboxing for Copilot generally available on 7 October 2026.",
        "source": "https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "Sandbox (computer security)",
        "by": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Sandbox_(computer_security)",
        "year": 2026,
        "note": "General definition of sandboxing as a security mechanism."
      },
      {
        "type": "docs",
        "title": "Configure the sandboxed Bash tool",
        "by": "Anthropic (Claude Code Docs)",
        "url": "https://code.claude.com/docs/en/sandboxing",
        "year": 2026,
        "note": "How Claude Code's OS-level sandbox works and is configured."
      },
      {
        "type": "docs",
        "title": "Choose a sandbox environment",
        "by": "Anthropic (Claude Code Docs)",
        "url": "https://code.claude.com/docs/en/sandbox-environments",
        "year": 2026,
        "note": "Compares sandbox runtime, dev containers, Docker, VMs, cloud."
      },
      {
        "type": "docs",
        "title": "Sandbox",
        "by": "OpenAI (ChatGPT Learn, Codex docs)",
        "url": "https://learn.chatgpt.com/docs/sandboxing",
        "year": 2026,
        "note": "How Codex/ChatGPT sandbox local commands per OS."
      },
      {
        "type": "docs",
        "title": "Agent approvals & security",
        "by": "OpenAI (ChatGPT Learn, Codex docs)",
        "url": "https://learn.chatgpt.com/docs/agent-approvals-security",
        "year": 2026,
        "note": "Sandbox modes, approval policies, network controls for Codex."
      },
      {
        "type": "docs",
        "title": "Code execution tool",
        "by": "Anthropic",
        "url": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool",
        "year": 2026,
        "note": "Server-side sandboxed Bash/Python container for Claude."
      },
      {
        "type": "docs",
        "title": "Code Interpreter",
        "by": "OpenAI",
        "url": "https://developers.openai.com/api/docs/guides/tools-code-interpreter",
        "year": 2026,
        "note": "Sandboxed Python containers in the Responses API."
      },
      {
        "type": "blog",
        "title": "Beyond permission prompts: making Claude Code more secure and autonomous",
        "by": "Anthropic Engineering",
        "url": "https://www.anthropic.com/engineering/claude-code-sandboxing",
        "year": 2025,
        "note": "Filesystem + network isolation design; 84% fewer prompts."
      },
      {
        "type": "video",
        "title": "From fork() to Fleet: Designing an Agent Sandbox Cloud — Abhishek Bhardwaj, OpenAI",
        "by": "AI Engineer",
        "url": "https://www.youtube.com/watch?v=OqM67QG_Ikk",
        "year": 2026,
        "note": "OpenAI engineer on building agent sandbox infrastructure."
      }
    ]
  },
  "hooks": {
    "aka": [
      "hooks",
      "lifecycle",
      "pretooluse",
      "posttooluse",
      "stop hook",
      "sessionstart",
      "events",
      "deterministic",
      "automation",
      "callbacks",
      "guardrails",
      "safety",
      "content filter",
      "moderation",
      "pii",
      "jailbreak",
      "validation",
      "classifier",
      "llama guard",
      "nemo guardrails",
      "prompt shields"
    ],
    "facts": [
      {
        "text": "Claude Code documents 33 hook events (October 2026), including session start, prompt submitted, before and after each tool call, before compaction and stop.",
        "source": "https://code.claude.com/docs/en/hooks"
      },
      {
        "text": "In the OpenAI Agents SDK, input guardrails run in parallel with the agent by default; a tripped guardrail raises an exception and halts the run.",
        "source": "https://openai.github.io/openai-agents-python/guardrails/"
      },
      {
        "text": "A common shape has emerged across Claude Code, Codex and Cursor: JSON on standard input and output, matchers on tool names, and exit code 2 to block an action.",
        "source": "https://cursor.com/docs/hooks"
      },
      {
        "text": "Anthropic's Constitutional Classifiers cut jailbreak success from 86% to 4.4% (2025); the next generation (January 2026) screens all traffic for about 1% extra compute.",
        "source": "https://www.anthropic.com/research/next-generation-constitutional-classifiers"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "Hooking",
        "by": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Hooking",
        "year": 2026,
        "note": "General concept: intercepting calls or events to alter behavior."
      },
      {
        "type": "definition",
        "title": "What Are AI Guardrails? | IBM",
        "by": "IBM Think",
        "url": "https://www.ibm.com/think/topics/ai-guardrails",
        "year": 2025,
        "note": "Explainer: what AI guardrails are and how they work."
      },
      {
        "type": "docs",
        "title": "Hooks reference",
        "by": "Anthropic (Claude Code Docs)",
        "url": "https://code.claude.com/docs/en/hooks",
        "year": 2026,
        "note": "All 33 events, handler types, JSON input/output, exit codes."
      },
      {
        "type": "docs",
        "title": "Intercept and control agent behavior with hooks",
        "by": "Anthropic (Claude Agent SDK docs)",
        "url": "https://code.claude.com/docs/en/agent-sdk/hooks",
        "year": 2026,
        "note": "Python/TypeScript callbacks to block, modify or audit tool calls."
      },
      {
        "type": "docs",
        "title": "Hooks",
        "by": "OpenAI (Codex docs, ChatGPT Learn)",
        "url": "https://learn.chatgpt.com/docs/hooks",
        "year": 2026,
        "note": "Codex lifecycle hooks, config locations, trust review, blocking."
      },
      {
        "type": "docs",
        "title": "Hooks",
        "by": "Cursor",
        "url": "https://cursor.com/docs/hooks",
        "year": 2026,
        "note": "hooks.json events, command vs prompt hooks, fail-open/closed behavior."
      },
      {
        "type": "docs",
        "title": "About hooks for GitHub Copilot",
        "by": "GitHub Docs",
        "url": "https://docs.github.com/en/copilot/concepts/agents/hooks",
        "year": 2026,
        "note": "Hooks for Copilot cloud agent and Copilot CLI."
      },
      {
        "type": "docs",
        "title": "Gemini CLI hooks",
        "by": "Google (Gemini CLI docs)",
        "url": "https://geminicli.com/docs/hooks/",
        "year": 2026,
        "note": "11 events incl. BeforeModel and BeforeTool; settings.json config."
      },
      {
        "type": "docs",
        "title": "Guardrails - OpenAI Agents SDK",
        "by": "OpenAI",
        "url": "https://openai.github.io/openai-agents-python/guardrails/",
        "year": 2026,
        "note": "Input, output and tool guardrails; tripwires; parallel vs blocking."
      },
      {
        "type": "docs",
        "title": "Overview | NVIDIA NeMo Guardrails Library Developer Guide",
        "by": "NVIDIA",
        "url": "https://docs.nvidia.com/nemo/guardrails/about-nemo-guardrails-library/overview",
        "year": 2026,
        "note": "Open-source programmable rails: input, retrieval, dialog, execution, output."
      },
      {
        "type": "docs",
        "title": "Prompt Shields in Azure AI Content Safety",
        "by": "Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/concepts/jailbreak-detection",
        "year": 2026,
        "note": "Detects jailbreaks and indirect document attacks; Spotlighting."
      },
      {
        "type": "paper",
        "title": "NeMo Guardrails: A Toolkit for Controllable and Safe LLM Applications with Programmable Rails",
        "by": "Traian Rebedea et al. (NVIDIA)",
        "url": "https://arxiv.org/abs/2310.10501",
        "year": 2023,
        "note": "EMNLP 2023 demo paper introducing programmable runtime rails."
      },
      {
        "type": "paper",
        "title": "Llama Guard: LLM-based Input-Output Safeguard for Human-AI Conversations",
        "by": "Hakan Inan et al. (Meta)",
        "url": "https://arxiv.org/abs/2312.06674",
        "year": 2023,
        "note": "Seminal LLM-based prompt and response safety classifier."
      },
      {
        "type": "paper",
        "title": "Constitutional Classifiers: Defending against Universal Jailbreaks across Thousands of Hours of Red Teaming",
        "by": "Mrinank Sharma et al. (Anthropic)",
        "url": "https://arxiv.org/abs/2501.18837",
        "year": 2025,
        "note": "Classifier safeguards trained on constitution-generated synthetic data."
      },
      {
        "type": "guide",
        "title": "Automate actions with hooks",
        "by": "Anthropic (Claude Code Docs)",
        "url": "https://code.claude.com/docs/en/hooks-guide",
        "year": 2026,
        "note": "Hands-on hook recipes and walkthroughs for Claude Code."
      },
      {
        "type": "blog",
        "title": "Next-generation Constitutional Classifiers",
        "by": "Anthropic",
        "url": "https://www.anthropic.com/research/next-generation-constitutional-classifiers",
        "year": 2026,
        "note": "Probe-based cascade: ~1% compute overhead, 0.05% refusals."
      },
      {
        "type": "tool",
        "title": "meta-llama/Llama-Guard-4-12B",
        "by": "Meta (Hugging Face model card)",
        "url": "https://huggingface.co/meta-llama/Llama-Guard-4-12B",
        "year": 2025,
        "note": "Current Llama Guard: 12B multimodal, hazard categories S1-S14."
      }
    ]
  },
  "security": {
    "aka": [
      "security & prompt injection",
      "security",
      "prompt injection",
      "indirect prompt injection",
      "lethal trifecta",
      "rule of two",
      "exfiltration",
      "supply chain",
      "owasp",
      "tool poisoning",
      "camel",
      "least privilege",
      "secrets"
    ],
    "facts": [
      {
        "text": "Meta's Agents Rule of Two (October 2025): until prompt injection can be reliably detected, a session should combine at most two of untrusted input, access to sensitive data or systems, and the ability to change state or communicate externally.",
        "source": "https://ai.meta.com/blog/practical-ai-agent-security/"
      },
      {
        "text": "OWASP published its Top 10 for Agentic Applications in December 2025 (agent goal hijack, tool misuse, identity and privilege abuse, agentic supply chain and more) and a 2026 edition of its LLM Top 10 in August 2026.",
        "source": "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/"
      },
      {
        "text": "Real incident (July 2026): Hugging Face disclosed an intrusion “driven, end to end, by an autonomous AI agent system” that entered through code execution in its dataset processing.",
        "source": "https://huggingface.co/blog/security-incident-july-2026"
      },
      {
        "text": "METR's independent investigation (August 2026) describes that incident as OpenAI agents under test coordinating a multi-day hack of Hugging Face.",
        "source": "https://metr.org/blog/2026-08-26-openai-hugging-face-incident-investigation/"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "What Is a Prompt Injection Attack? | IBM",
        "by": "IBM Think",
        "url": "https://www.ibm.com/think/topics/prompt-injection",
        "year": 2024,
        "note": "Explainer: direct vs indirect prompt injection and mitigations."
      },
      {
        "type": "standard",
        "title": "OWASP GenAI LLM Top 10 2026",
        "by": "OWASP GenAI Security Project",
        "url": "https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/",
        "year": 2026,
        "note": "2026 edition of the Top 10 for LLM Applications (PDF)."
      },
      {
        "type": "standard",
        "title": "OWASP Top 10 for Agentic Applications for 2026",
        "by": "OWASP GenAI Security Project",
        "url": "https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/",
        "year": 2025,
        "note": "ASI01-ASI10: goal hijack, tool misuse, rogue agents and more."
      },
      {
        "type": "paper",
        "title": "Defeating Prompt Injections by Design",
        "by": "Edoardo Debenedetti et al.",
        "url": "https://arxiv.org/abs/2503.18813",
        "year": 2025,
        "note": "CaMeL: control/data-flow separation plus capabilities around the LLM."
      },
      {
        "type": "blog",
        "title": "The lethal trifecta for AI agents: private data, untrusted content, and external communication",
        "by": "Simon Willison",
        "url": "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/",
        "year": 2025,
        "note": "Why private data + untrusted content + exfiltration channel is dangerous."
      },
      {
        "type": "blog",
        "title": "Simon Willison on prompt-injection",
        "by": "Simon Willison",
        "url": "https://simonwillison.net/tags/prompt-injection/",
        "year": 2026,
        "note": "Running archive of prompt-injection research and incidents since 2022."
      },
      {
        "type": "blog",
        "title": "Agents Rule of Two: A Practical Approach to AI Agent Security",
        "by": "Meta AI",
        "url": "https://ai.meta.com/blog/practical-ai-agent-security/",
        "year": 2025,
        "note": "At most two of: untrusted input, sensitive access, external actions."
      },
      {
        "type": "video",
        "title": "What Is a Prompt Injection Attack?",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=jrHRe9lSqqA",
        "year": 2024,
        "note": "Short whiteboard explainer of prompt injection."
      },
      {
        "type": "video",
        "title": "Generative AI's Greatest Flaw - Computerphile",
        "by": "Computerphile",
        "url": "https://www.youtube.com/watch?v=rAEqP9VEhe8",
        "year": 2025,
        "note": "Mike Pound explains prompt injection versus SQL injection."
      }
    ]
  },
  "team": {
    "aka": [
      "sub-agents",
      "subagent",
      "sub agent",
      "delegation",
      "task tool",
      "agent as tool",
      "context isolation",
      "helper agent",
      "parallel agents",
      "multi-agent systems & agent teams",
      "multi-agent",
      "multi agent",
      "agent team",
      "agent teams",
      "swarm",
      "handoff",
      "orchestrator",
      "lead agent",
      "crew",
      "society of agents",
      "agent2agent protocol (a2a)",
      "a2a",
      "agent2agent",
      "agent to agent",
      "agent card",
      "interoperability",
      "acp",
      "cross-vendor agents",
      "workflow patterns",
      "workflow",
      "prompt chaining",
      "chaining",
      "routing",
      "parallelization",
      "orchestrator-workers",
      "evaluator-optimizer",
      "pipeline",
      "dag",
      "n8n"
    ],
    "facts": [
      {
        "text": "In Claude Code each subagent works in its own context window and returns only a summary. Built-in ones include a read-only Explore agent and a Plan agent.",
        "source": "https://code.claude.com/docs/en/sub-agents"
      },
      {
        "text": "Anthropic (2025): a lead agent with parallel sub-agents beat a single agent by 90.2% on an internal research evaluation; multi-agent runs used about 15 times the tokens of a chat.",
        "source": "https://www.anthropic.com/engineering/multi-agent-research-system"
      },
      {
        "text": "A2A 1.0, the first stable version, shipped on 12 March 2026 with signed Agent Cards, multi-tenancy and JSON-RPC, gRPC and HTTP bindings.",
        "source": "https://a2a-protocol.org/latest/blog/2026/03/12/a2a-protocol-ships-v10-production-ready-standard-for-agent-to-agent-communication/"
      },
      {
        "text": "Microsoft's guidance: “If you can write a function to handle the task, do that instead of using an AI agent.”",
        "source": "https://learn.microsoft.com/en-us/agent-framework/overview/"
      }
    ],
    "sources": [
      {
        "type": "spec",
        "title": "A2A Protocol Specification",
        "by": "A2A Project (Linux Foundation / AAIF)",
        "url": "https://a2a-protocol.org/latest/specification/",
        "year": 2026,
        "note": "Normative spec v1.0.0: data model, operations, bindings."
      },
      {
        "type": "definition",
        "title": "What are Agentic Workflows?",
        "by": "IBM Think",
        "url": "https://www.ibm.com/think/topics/agentic-workflows",
        "year": 2025,
        "note": "Explainer of agentic workflows versus traditional automation."
      },
      {
        "type": "docs",
        "title": "Create custom subagents",
        "by": "Anthropic - Claude Code docs",
        "url": "https://code.claude.com/docs/en/sub-agents",
        "year": 2026,
        "note": "Subagent files, scopes, built-ins, nesting, background runs."
      },
      {
        "type": "docs",
        "title": "Subagents in the SDK",
        "by": "Anthropic - Claude Agent SDK docs",
        "url": "https://code.claude.com/docs/en/agent-sdk/subagents",
        "year": 2026,
        "note": "Programmatic subagents, inheritance, resume, depth/spend caps."
      },
      {
        "type": "docs",
        "title": "Agent orchestration",
        "by": "OpenAI - Agents SDK docs",
        "url": "https://openai.github.io/openai-agents-python/multi_agent/",
        "year": 2026,
        "note": "Agents-as-tools vs handoffs; LLM- vs code-driven orchestration."
      },
      {
        "type": "docs",
        "title": "Subagents",
        "by": "LangChain docs",
        "url": "https://docs.langchain.com/oss/python/langchain/multi-agent/subagents",
        "year": 2026,
        "note": "Supervisor calling subagents as tools in LangChain."
      },
      {
        "type": "docs",
        "title": "Workflows: multi-agent, multi-node applications",
        "by": "Google - ADK docs",
        "url": "https://adk.dev/workflows/",
        "year": 2026,
        "note": "ADK multi-agent composition, routing and collaboration."
      },
      {
        "type": "docs",
        "title": "What is A2A?",
        "by": "A2A Project",
        "url": "https://a2a-protocol.org/latest/topics/what-is-a2a/",
        "year": 2026,
        "note": "Official conceptual introduction to the protocol."
      },
      {
        "type": "docs",
        "title": "A2A and MCP",
        "by": "A2A Project",
        "url": "https://a2a-protocol.org/latest/topics/a2a-and-mcp/",
        "year": 2026,
        "note": "How A2A (agent-to-agent) complements MCP (agent-to-tool)."
      },
      {
        "type": "docs",
        "title": "Workflows and agents",
        "by": "LangChain - LangGraph docs",
        "url": "https://docs.langchain.com/oss/python/langgraph/workflows-agents",
        "year": 2026,
        "note": "Each pattern implemented in LangGraph."
      },
      {
        "type": "docs",
        "title": "Template agent workflows",
        "by": "Google - ADK docs",
        "url": "https://adk.dev/agents/workflow-agents/",
        "year": 2026,
        "note": "Sequential, loop and parallel workflow agents."
      },
      {
        "type": "docs",
        "title": "Graph-based agent workflows",
        "by": "Google - ADK docs",
        "url": "https://adk.dev/graphs/",
        "year": 2026,
        "note": "ADK 2.0 graph workflows mixing code and LLM steps."
      },
      {
        "type": "paper",
        "title": "Why Do Multi-Agent LLM Systems Fail?",
        "by": "Mert Cemri et al. (UC Berkeley)",
        "url": "https://arxiv.org/abs/2503.13657",
        "year": 2025,
        "note": "MAST taxonomy of 14 multi-agent failure modes."
      },
      {
        "type": "paper",
        "title": "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation",
        "by": "Qingyun Wu et al. (Microsoft)",
        "url": "https://arxiv.org/abs/2308.08155",
        "year": 2023,
        "note": "Seminal conversable multi-agent framework."
      },
      {
        "type": "paper",
        "title": "MetaGPT: Meta Programming for A Multi-Agent Collaborative Framework",
        "by": "Sirui Hong et al.",
        "url": "https://arxiv.org/abs/2308.00352",
        "year": 2023,
        "note": "Role-based agents following standard operating procedures."
      },
      {
        "type": "blog",
        "title": "How we built our multi-agent research system",
        "by": "Anthropic",
        "url": "https://www.anthropic.com/engineering/multi-agent-research-system",
        "year": 2025,
        "note": "Lead agent delegating to parallel subagents in Claude Research."
      },
      {
        "type": "blog",
        "title": "Don’t Build Multi-Agents",
        "by": "Cognition (Walden Yan)",
        "url": "https://cognition.ai/blog/dont-build-multi-agents",
        "year": 2025,
        "note": "Context-sharing principles; case for single-threaded agents."
      },
      {
        "type": "blog",
        "title": "Multi-Agents: What's Actually Working",
        "by": "Cognition",
        "url": "https://cognition.ai/blog/multi-agents-working",
        "year": 2026,
        "note": "2026 update: reviewer loops, smart-friend escalation, managers."
      },
      {
        "type": "blog",
        "title": "Towards a science of scaling agent systems: When and why agent systems work",
        "by": "Google Research",
        "url": "https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/",
        "year": 2026,
        "note": "Controlled study of when multi-agent beats single agent."
      },
      {
        "type": "blog",
        "title": "Announcing the Agent2Agent Protocol (A2A)",
        "by": "Google Developers Blog",
        "url": "https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/",
        "year": 2025,
        "note": "Original launch post with design principles and partners."
      },
      {
        "type": "blog",
        "title": "Linux Foundation Launches the Agent2Agent Protocol Project to Enable Secure, Intelligent Communication Between AI Agents",
        "by": "Linux Foundation",
        "url": "https://www.linuxfoundation.org/press/linux-foundation-launches-the-agent2agent-protocol-project-to-enable-secure-intelligent-communication-between-ai-agents",
        "year": 2025,
        "note": "A2A moves to neutral open governance."
      },
      {
        "type": "blog",
        "title": "ACP Joins Forces with A2A",
        "by": "LF AI & Data",
        "url": "https://lfaidata.foundation/communityblog/2025/08/29/acp-joins-forces-with-a2a-under-the-linux-foundations-lf-ai-data/",
        "year": 2025,
        "note": "IBM's ACP merges into A2A."
      },
      {
        "type": "blog",
        "title": "A2A joins AAIF’s open agentic stack",
        "by": "Agentic AI Foundation",
        "url": "https://aaif.io/blog/a2a-joins-aaif",
        "year": 2026,
        "note": "A2A becomes an AAIF hosted project; v1.0 recap."
      },
      {
        "type": "blog",
        "title": "Building effective agents",
        "by": "Anthropic (Erik Schluntz, Barry Zhang)",
        "url": "https://www.anthropic.com/engineering/building-effective-agents",
        "year": 2024,
        "note": "Defines the five canonical workflow patterns."
      },
      {
        "type": "blog",
        "title": "Agentic Design Patterns Part 1: Four AI agent strategies that improve GPT-4 and GPT-3.5 performance",
        "by": "Andrew Ng (DeepLearning.AI The Batch)",
        "url": "https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/",
        "year": 2024,
        "note": "Reflection, tool use, planning, multi-agent collaboration."
      },
      {
        "type": "tool",
        "title": "Basic workflows",
        "by": "Anthropic - Claude Cookbook",
        "url": "https://platform.claude.com/cookbook/patterns-agents-basic-workflows",
        "year": 2026,
        "note": "Runnable code for chaining, routing and parallelization."
      },
      {
        "type": "tool",
        "title": "Orchestrator workers",
        "by": "Anthropic - Claude Cookbook",
        "url": "https://platform.claude.com/cookbook/patterns-agents-orchestrator-workers",
        "year": 2026,
        "note": "Runnable orchestrator-workers pattern."
      },
      {
        "type": "video",
        "title": "Tool, skill, or subagent? Decomposing an agent that outgrew its prompt",
        "by": "Claude (Anthropic)",
        "url": "https://www.youtube.com/watch?v=mWvtOHlZM-I",
        "year": 2026,
        "note": "Live decomposition of a bloated agent into tools, skills and sub-agents, with evals."
      },
      {
        "type": "video",
        "title": "Multi Agent Systems Explained: How AI Agents & LLMs Work Together",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=sWH0T4Zez6I",
        "year": 2025,
        "note": "Explainer of how multiple LLM agents coordinate."
      },
      {
        "type": "video",
        "title": "Building more effective AI agents",
        "by": "Anthropic",
        "url": "https://www.youtube.com/watch?v=uhJJgc-0iTQ",
        "year": 2025,
        "note": "Anthropic discussion of multi-agent patterns, skills, MCP, tools."
      },
      {
        "type": "video",
        "title": "Introduction to Agent2Agent (A2A) Protocol",
        "by": "Google Cloud Tech",
        "url": "https://www.youtube.com/watch?v=Fbr_Solax1w",
        "year": 2026,
        "note": "Google's official video introduction to A2A."
      },
      {
        "type": "video",
        "title": "A2A Protocol (Agent2Agent) Explained: How AI Agents Collaborate",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=Tud9HLTk8hg",
        "year": 2025,
        "note": "Whiteboard explainer of A2A concepts."
      },
      {
        "type": "video",
        "title": "Building Effective Agents with LangGraph",
        "by": "LangChain",
        "url": "https://www.youtube.com/watch?v=aHCDrAbH_go",
        "year": 2025,
        "note": "Implements Anthropic's workflow patterns in LangGraph."
      }
    ]
  },
  "background": {
    "aka": [
      "long-running & background agents",
      "long-running agents",
      "background agent",
      "cloud agent",
      "async agent",
      "autonomous",
      "durable execution",
      "checkpoint",
      "ralph",
      "ralph loop",
      "time horizon",
      "overnight",
      "triggers & events",
      "schedule",
      "cron",
      "webhook",
      "event",
      "ci",
      "github actions",
      "slack",
      "background",
      "automation"
    ],
    "facts": [
      {
        "text": "METR's updated measurements (January 2026) show the 50% time horizon doubling roughly every 4 months since 2023, faster than the 7-month trend measured over 2019 to 2025.",
        "source": "https://metr.org/blog/2026-1-29-time-horizon-1-1/"
      },
      {
        "text": "Claude Code routines (research preview since April 2026) run a saved prompt with repositories and connectors in Anthropic's cloud, started by a schedule, an API call or a GitHub event.",
        "source": "https://code.claude.com/docs/en/routines"
      },
      {
        "text": "METR put the public frontier at roughly 12 hours of human work at 50% success (February to March 2026), with wide uncertainty, and in September 2026 stopped updating its chart because its tasks cannot measure beyond about 16 hours.",
        "source": "https://metr.org/time-horizons/"
      },
      {
        "text": "GitHub Copilot cloud agent sessions start from issues, failing Actions runs, Slack, Teams, Jira, Linear or scheduled automations. Issues can also be assigned to third-party agents such as Claude and Codex.",
        "source": "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/start-copilot-sessions"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "Webhook",
        "by": "Wikipedia",
        "url": "https://en.wikipedia.org/wiki/Webhook",
        "year": 2026,
        "note": "Definition of HTTP callbacks that push events to systems."
      },
      {
        "type": "docs",
        "title": "Use Claude Code in the cloud",
        "by": "Anthropic - Claude Code docs",
        "url": "https://code.claude.com/docs/en/claude-code-on-the-web",
        "year": 2026,
        "note": "Cloud sessions, --cloud/--teleport, auto-fix PRs, limits."
      },
      {
        "type": "docs",
        "title": "Keep Claude working toward a goal",
        "by": "Anthropic - Claude Code docs",
        "url": "https://code.claude.com/docs/en/goal",
        "year": 2026,
        "note": "/goal completion conditions with a separate evaluator."
      },
      {
        "type": "docs",
        "title": "Checkpointing",
        "by": "Anthropic - Claude Code docs",
        "url": "https://code.claude.com/docs/en/checkpointing",
        "year": 2026,
        "note": "Automatic checkpoints, /rewind, limitations."
      },
      {
        "type": "docs",
        "title": "Codex Cloud",
        "by": "OpenAI - Codex docs (ChatGPT Learn)",
        "url": "https://learn.chatgpt.com/docs/cloud",
        "year": 2026,
        "note": "Delegating Codex tasks to cloud environments."
      },
      {
        "type": "docs",
        "title": "Events that trigger workflows",
        "by": "GitHub Docs",
        "url": "https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows",
        "year": 2026,
        "note": "Reference of GitHub events, schedules and dispatch triggers."
      },
      {
        "type": "docs",
        "title": "Claude Code GitHub Actions",
        "by": "Anthropic (Claude Code Docs)",
        "url": "https://code.claude.com/docs/en/github-actions",
        "year": 2026,
        "note": "@claude mentions and event/cron-driven Claude Code runs."
      },
      {
        "type": "docs",
        "title": "Automate work with routines",
        "by": "Anthropic (Claude Code Docs)",
        "url": "https://code.claude.com/docs/en/routines",
        "year": 2026,
        "note": "Cloud routines with schedule, API and GitHub triggers."
      },
      {
        "type": "docs",
        "title": "Push events into a running session with channels",
        "by": "Anthropic (Claude Code Docs)",
        "url": "https://code.claude.com/docs/en/channels",
        "year": 2026,
        "note": "MCP-based event push into live sessions."
      },
      {
        "type": "docs",
        "title": "Codex GitHub Action",
        "by": "OpenAI (ChatGPT Learn, Codex docs)",
        "url": "https://learn.chatgpt.com/docs/github-action",
        "year": 2026,
        "note": "Run Codex from GitHub Actions workflows."
      },
      {
        "type": "docs",
        "title": "Codex SDK",
        "by": "OpenAI (ChatGPT Learn, Codex docs)",
        "url": "https://learn.chatgpt.com/docs/codex-sdk",
        "year": 2026,
        "note": "Programmatic control of Codex agents from code/CI."
      },
      {
        "type": "paper",
        "title": "Measuring AI Ability to Complete Long Software Tasks",
        "by": "Thomas Kwa, Ben West et al. (METR)",
        "url": "https://arxiv.org/abs/2503.14499",
        "year": 2025,
        "note": "Introduces the 50% task-completion time horizon metric."
      },
      {
        "type": "blog",
        "title": "Effective harnesses for long-running agents",
        "by": "Anthropic",
        "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
        "year": 2025,
        "note": "How to keep agents productive across many context windows."
      },
      {
        "type": "blog",
        "title": "Time Horizon 1.1",
        "by": "METR",
        "url": "https://metr.org/blog/2026-1-29-time-horizon-1-1/",
        "year": 2026,
        "note": "Updated task suite, doubling times and model horizons."
      },
      {
        "type": "blog",
        "title": "Frontier Risk Report (February to March 2026)",
        "by": "METR",
        "url": "https://metr.org/blog/2026-05-19-frontier-risk-report/",
        "year": 2026,
        "note": "Latest public-frontier time horizons (~12 h at 50%)."
      },
      {
        "type": "blog",
        "title": "Ralph Wiggum as a \"software engineer\"",
        "by": "Geoffrey Huntley",
        "url": "https://ghuntley.com/ralph/",
        "year": 2025,
        "note": "Original Ralph loop: rerun one prompt until the work converges."
      },
      {
        "type": "video",
        "title": "Claude Code + GitHub Actions",
        "by": "Anthropic",
        "url": "https://www.youtube.com/watch?v=L_WFEgry87M",
        "year": 2025,
        "note": "Official demo of @claude in GitHub issues and PRs."
      },
      {
        "type": "video",
        "title": "How the GitHub Copilot coding agent works | GitHub Checkout",
        "by": "GitHub",
        "url": "https://www.youtube.com/watch?v=1GVBRhDI5No",
        "year": 2025,
        "note": "How assigning an issue launches Copilot's agent."
      }
    ]
  },
  "evals": {
    "aka": [
      "evals & benchmarks",
      "evals",
      "evaluation",
      "eval",
      "benchmark",
      "swe-bench",
      "terminal-bench",
      "tau-bench",
      "gaia",
      "osworld",
      "llm as a judge",
      "error analysis",
      "regression",
      "metr",
      "pass@k",
      "observability & tracing",
      "observability",
      "tracing",
      "traces",
      "spans",
      "logging",
      "monitoring",
      "opentelemetry",
      "otel",
      "langfuse",
      "langsmith",
      "phoenix",
      "telemetry",
      "dashboards"
    ],
    "facts": [
      {
        "text": "Anthropic's guide (January 2026): combine code, model and human graders; start with 20 to 50 tasks drawn from real failures; grade outcomes rather than exact paths; read the transcripts.",
        "source": "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
      },
      {
        "text": "OpenTelemetry's generative-AI conventions moved to their own repository and are still marked “Development”; they cover agent, tool and MCP spans.",
        "source": "https://github.com/open-telemetry/semantic-conventions-genai"
      },
      {
        "text": "Report reliability, not luck: pass@k counts a task solved if any of k tries works, pass^k only if all k do.",
        "source": "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents"
      },
      {
        "text": "Claude Code exports OpenTelemetry metrics (tokens, cost, sessions) and events, and traces each prompt with tool calls and sub-agent work nested beneath it (beta). Prompt text is redacted by default.",
        "source": "https://code.claude.com/docs/en/monitoring-usage"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "What is LLM Observability? | IBM",
        "by": "IBM Think",
        "url": "https://www.ibm.com/think/topics/llm-observability",
        "year": 2025,
        "note": "Explainer: monitoring, tracing and evaluating LLM applications."
      },
      {
        "type": "spec",
        "title": "Semantic Conventions for GenAI agent and framework spans",
        "by": "OpenTelemetry (semantic-conventions-genai)",
        "url": "https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md",
        "year": 2026,
        "note": "Standard span names/attributes for agents, workflows and tool execution."
      },
      {
        "type": "docs",
        "title": "Monitoring",
        "by": "Anthropic (Claude Code Docs)",
        "url": "https://code.claude.com/docs/en/monitoring-usage",
        "year": 2026,
        "note": "Claude Code OpenTelemetry metrics, events and beta traces."
      },
      {
        "type": "docs",
        "title": "Tracing - OpenAI Agents SDK",
        "by": "OpenAI",
        "url": "https://openai.github.io/openai-agents-python/tracing/",
        "year": 2026,
        "note": "Built-in traces/spans for agents, tools, guardrails, handoffs."
      },
      {
        "type": "docs",
        "title": "Observability & Application Tracing",
        "by": "Langfuse",
        "url": "https://langfuse.com/docs/observability/overview",
        "year": 2026,
        "note": "Open-source tracing of prompts, responses, tokens, cost, latency."
      },
      {
        "type": "docs",
        "title": "LangSmith Observability",
        "by": "LangChain",
        "url": "https://docs.langchain.com/langsmith/observability",
        "year": 2026,
        "note": "Tracing, dashboards, alerts and online evals for agents."
      },
      {
        "type": "docs",
        "title": "What is Arize Phoenix?",
        "by": "Arize AI",
        "url": "https://arize.com/docs/phoenix",
        "year": 2026,
        "note": "OpenTelemetry/OpenInference-based tracing and evaluation platform."
      },
      {
        "type": "paper",
        "title": "Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences",
        "by": "Shreya Shankar et al.",
        "url": "https://arxiv.org/abs/2404.12272",
        "year": 2024,
        "note": "EvalGen and criteria drift in LLM-assisted evaluation."
      },
      {
        "type": "paper",
        "title": "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena",
        "by": "Lianmin Zheng et al.",
        "url": "https://arxiv.org/abs/2306.05685",
        "year": 2023,
        "note": "Seminal LLM-as-a-judge study: agreement levels and biases."
      },
      {
        "type": "paper",
        "title": "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?",
        "by": "Carlos E. Jimenez et al.",
        "url": "https://arxiv.org/abs/2310.06770",
        "year": 2023,
        "note": "Benchmark of 2,294 real GitHub issues for coding agents."
      },
      {
        "type": "guide",
        "title": "Demystifying evals for AI agents",
        "by": "Anthropic Engineering (Grace, Hadfield, Olivares, De Jonghe)",
        "url": "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents",
        "year": 2026,
        "note": "Practical agent-eval guide: graders, pass@k vs pass^k, transcripts."
      },
      {
        "type": "guide",
        "title": "AI Evals: Everything You Need to Know",
        "by": "Hamel Husain & Shreya Shankar",
        "url": "https://hamel.dev/blog/posts/evals-faq/",
        "year": 2026,
        "note": "Comprehensive evals FAQ: error analysis, binary judges, judge validation."
      },
      {
        "type": "blog",
        "title": "Your AI Product Needs Evals",
        "by": "Hamel Husain",
        "url": "https://hamel.dev/blog/posts/evals/",
        "year": 2024,
        "note": "Classic case for unit tests, human/model eval and error analysis."
      },
      {
        "type": "tool",
        "title": "SWE-bench Verified",
        "by": "SWE-bench team (with OpenAI)",
        "url": "https://www.swebench.com/verified.html",
        "year": 2024,
        "note": "500 human-validated tasks; full and bash-only leaderboards."
      },
      {
        "type": "tool",
        "title": "Inspect",
        "by": "UK AI Security Institute",
        "url": "https://inspect.aisi.org.uk/",
        "year": 2026,
        "note": "Open-source eval framework with agent support, sandboxing and 200+ ready-made evals."
      },
      {
        "type": "tool",
        "title": "Task-Completion Time Horizons of Frontier AI Models",
        "by": "METR",
        "url": "https://metr.org/time-horizons/",
        "year": 2026,
        "note": "How long a task (in human time) agents can complete; no longer updated after Sep 2026."
      },
      {
        "type": "blog",
        "title": "AI Agent Observability - Evolving Standards and Best Practices",
        "by": "OpenTelemetry (Guangya Liu, Sujay Solomon)",
        "url": "https://opentelemetry.io/blog/2025/ai-agent-observability/",
        "year": 2025,
        "note": "How OTel is standardizing agent and agent-framework telemetry."
      },
      {
        "type": "video",
        "title": "Building and evaluating AI Agents — Sayash Kapoor, AI Snake Oil",
        "by": "AI Engineer",
        "url": "https://www.youtube.com/watch?v=d5EltXhbcfA",
        "year": 2025,
        "note": "Why agent claims outrun reality; best practices for agent evaluation."
      },
      {
        "type": "video",
        "title": "Your Agent Failed in Prod. Good Luck Reproducing It. - Tisha Chawla & Susheem Koul, Microsoft",
        "by": "AI Engineer",
        "url": "https://www.youtube.com/watch?v=Lc8zRh9muoY",
        "year": 2026,
        "note": "Record-and-replay debugging for non-deterministic agent failures."
      }
    ]
  },
  "cost": {
    "aka": [
      "cost & latency optimisation",
      "cost & latency",
      "cost",
      "price",
      "tokens",
      "latency",
      "speed",
      "prompt caching",
      "caching",
      "batch",
      "routing",
      "cheaper",
      "budget",
      "effort",
      "providers & inference platforms",
      "providers & platforms",
      "api",
      "inference",
      "anthropic",
      "openai",
      "google",
      "bedrock",
      "vertex",
      "azure",
      "foundry",
      "openrouter",
      "litellm",
      "ollama",
      "vllm",
      "hosting",
      "gateway",
      "router",
      "eu",
      "data residency"
    ],
    "facts": [
      {
        "text": "Small tiers are about 100 times cheaper per token than flagships: Claude Haiku 5.5 costs from $0.10/$0.50 per million tokens, Claude Fable 5.1 $10/$50 (October 2026).",
        "source": "https://platform.claude.com/docs/en/models/overview"
      },
      {
        "text": "Renamed platforms: Google's Vertex AI is now Gemini Enterprise Agent Platform, and Azure AI Foundry is now Microsoft Foundry.",
        "source": "https://docs.cloud.google.com/gemini-enterprise-agent-platform/vertex-ai-name-changes"
      },
      {
        "text": "Reading from Anthropic's prompt cache costs a tenth of the normal input price (less on the newest models); writing to a 5-minute cache costs 1.25 times.",
        "source": "https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
      },
      {
        "text": "Amazon Bedrock offers more than 100 models from many providers; OpenAI's GPT-6 Astra became generally available there in September 2026.",
        "source": "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html"
      }
    ],
    "sources": [
      {
        "type": "docs",
        "title": "Prompt caching",
        "by": "Anthropic (Claude Platform Docs)",
        "url": "https://platform.claude.com/docs/en/build-with-claude/prompt-caching",
        "year": 2026,
        "note": "Cache breakpoints, TTLs, pricing multipliers, invalidation rules."
      },
      {
        "type": "docs",
        "title": "Effort",
        "by": "Anthropic (Claude Platform Docs)",
        "url": "https://platform.claude.com/docs/en/build-with-claude/effort",
        "year": 2026,
        "note": "Trade thoroughness for token cost and latency with effort levels."
      },
      {
        "type": "docs",
        "title": "Overview - Amazon Bedrock",
        "by": "AWS",
        "url": "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html",
        "year": 2026,
        "note": "Managed access to 100+ models incl. Claude, OpenAI, DeepSeek, Kimi."
      },
      {
        "type": "docs",
        "title": "Overview of models on Agent Platform",
        "by": "Google Cloud (Gemini Enterprise Agent Platform)",
        "url": "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models",
        "year": 2026,
        "note": "Google's model catalog (formerly Vertex AI): Gemini, Claude, open models."
      },
      {
        "type": "docs",
        "title": "What is Microsoft Foundry?",
        "by": "Microsoft Learn",
        "url": "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry",
        "year": 2026,
        "note": "Microsoft's unified platform (ex-Azure AI Foundry) for models and agents."
      },
      {
        "type": "docs",
        "title": "Inference Providers",
        "by": "Hugging Face",
        "url": "https://huggingface.co/docs/inference-providers/index",
        "year": 2026,
        "note": "One API/router to open models across many serverless inference partners."
      },
      {
        "type": "docs",
        "title": "OpenRouter Quickstart Guide",
        "by": "OpenRouter",
        "url": "https://openrouter.ai/docs/quickstart",
        "year": 2026,
        "note": "Single API to hundreds of models with fallbacks and routing."
      },
      {
        "type": "paper",
        "title": "FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance",
        "by": "Chen, Zaharia & Zou (Stanford)",
        "url": "https://arxiv.org/abs/2305.05176",
        "year": 2023,
        "note": "Prompt adaptation, model approximation and LLM cascades to cut cost."
      },
      {
        "type": "paper",
        "title": "RouteLLM: Learning to Route LLMs with Preference Data",
        "by": "Ong et al. (LMSYS / UC Berkeley)",
        "url": "https://arxiv.org/abs/2406.18665",
        "year": 2024,
        "note": "Learned routers choose strong vs weak model per query."
      },
      {
        "type": "guide",
        "title": "Prompt caching",
        "by": "OpenAI API docs",
        "url": "https://developers.openai.com/api/docs/guides/prompt-caching",
        "year": 2026,
        "note": "Automatic caching, minimum lengths, discounts and prompt-structure best practices."
      },
      {
        "type": "guide",
        "title": "Latency optimization",
        "by": "OpenAI API docs",
        "url": "https://developers.openai.com/api/docs/guides/latency-optimization",
        "year": 2026,
        "note": "Seven principles for faster LLM applications."
      },
      {
        "type": "tool",
        "title": "LLM pricing calculator",
        "by": "Simon Willison (llm-prices.com)",
        "url": "https://www.llm-prices.com/",
        "year": 2026,
        "note": "Compare and calculate token costs across current models."
      },
      {
        "type": "tool",
        "title": "Ollama documentation",
        "by": "Ollama",
        "url": "https://docs.ollama.com/",
        "year": 2026,
        "note": "Run open models locally or in the cloud via a simple API."
      },
      {
        "type": "tool",
        "title": "Welcome to vLLM",
        "by": "vLLM project",
        "url": "https://docs.vllm.ai/en/latest/",
        "year": 2026,
        "note": "High-throughput open-source LLM serving engine with OpenAI-compatible server."
      },
      {
        "type": "tool",
        "title": "AI Model & API Providers Analysis",
        "by": "Artificial Analysis",
        "url": "https://artificialanalysis.ai/",
        "year": 2026,
        "note": "Independent benchmarks of model intelligence, price, speed and providers."
      },
      {
        "type": "video",
        "title": "What is Prompt Caching? Optimize LLM Latency with AI Transformers",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=u57EnkQaUTY",
        "year": 2026,
        "note": "Explains how prompt caching reuses KV state to cut latency and cost."
      },
      {
        "type": "video",
        "title": "What is Ollama? Running Local LLMs Made Simple",
        "by": "IBM Technology",
        "url": "https://www.youtube.com/watch?v=5RIOQuHOihY",
        "year": 2025,
        "note": "Explains running open models locally with Ollama and why."
      }
    ]
  },
  "governance": {
    "aka": [
      "governance & regulation",
      "governance",
      "eu ai act",
      "ai act",
      "compliance",
      "gdpr",
      "nist",
      "ai rmf",
      "iso 42001",
      "policy",
      "audit",
      "risk management",
      "regulation",
      "dsgvo"
    ],
    "facts": [
      {
        "text": "EU AI Act timeline: in force since August 2024, prohibitions since February 2025, duties for general-purpose AI models since August 2025, and generally applicable since 2 August 2026.",
        "source": "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai"
      },
      {
        "text": "The Digital Omnibus on AI, Regulation (EU) 2026/1744 (in force 27 July 2026), moved high-risk obligations to 2 December 2027 for Annex III uses and 2 August 2028 for Annex I products.",
        "source": "https://eur-lex.europa.eu/eli/reg/2026/1744/oj"
      },
      {
        "text": "Singapore's Model AI Governance Framework for Agentic AI (version 1.5, May 2026) is organised around bounding risks upfront, meaningful human accountability, technical controls and end-user responsibility.",
        "source": "https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf"
      },
      {
        "text": "NIST says its AI Risk Management Framework is being revised; the Generative AI Profile (NIST AI 600-1) lists 12 risks, including prompt injection.",
        "source": "https://www.nist.gov/itl/ai-risk-management-framework"
      }
    ],
    "sources": [
      {
        "type": "definition",
        "title": "What is AI Governance? | IBM",
        "by": "IBM Think",
        "url": "https://www.ibm.com/think/topics/ai-governance",
        "year": 2024,
        "note": "Explainer: processes, standards and guardrails for responsible AI."
      },
      {
        "type": "law",
        "title": "Regulation (EU) 2024/1689 (Artificial Intelligence Act)",
        "by": "EUR-Lex (Official Journal of the EU)",
        "url": "https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng",
        "year": 2024,
        "note": "Official text of the EU AI Act."
      },
      {
        "type": "law",
        "title": "Regulation (EU) 2026/1744 (Digital Omnibus on AI)",
        "by": "EUR-Lex (Official Journal of the EU)",
        "url": "https://eur-lex.europa.eu/eli/reg/2026/1744/oj",
        "year": 2026,
        "note": "Amends AI Act: high-risk dates moved to Dec 2027 / Aug 2028."
      },
      {
        "type": "standard",
        "title": "AI Risk Management Framework",
        "by": "NIST",
        "url": "https://www.nist.gov/itl/ai-risk-management-framework",
        "year": 2023,
        "note": "NIST AI RMF 1.0 hub, profiles and revision status."
      },
      {
        "type": "standard",
        "title": "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile",
        "by": "NIST (NIST AI 600-1)",
        "url": "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence",
        "year": 2024,
        "note": "12 generative-AI risks and suggested risk-management actions."
      },
      {
        "type": "guide",
        "title": "AI Act | Shaping Europe's digital future",
        "by": "European Commission",
        "url": "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
        "year": 2026,
        "note": "Official overview, timeline and Omnibus status of the AI Act."
      },
      {
        "type": "guide",
        "title": "The General-Purpose AI Code of Practice",
        "by": "European Commission",
        "url": "https://digital-strategy.ec.europa.eu/en/policies/contents-code-gpai",
        "year": 2025,
        "note": "Voluntary GPAI code: transparency, copyright, safety & security."
      },
      {
        "type": "guide",
        "title": "ISO/IEC 42001:2023 Artificial Intelligence Management System Standards",
        "by": "Microsoft Learn (Compliance)",
        "url": "https://learn.microsoft.com/en-us/compliance/regulatory/offering-iso-42001",
        "year": 2026,
        "note": "Explains ISO/IEC 42001 AIMS requirements (iso.org blocks automated checks)."
      },
      {
        "type": "guide",
        "title": "Model AI Governance Framework for Agentic AI (v1.5)",
        "by": "IMDA Singapore",
        "url": "https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf",
        "year": 2026,
        "note": "Agent-specific governance: bound risks, accountability, controls, users."
      }
    ]
  }
};
