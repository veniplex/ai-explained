/* AI explained: the glossary. Every term of the glossary that is not one of the 21 main terms (those are in entries.js and have a full page);
   each has its own page at glossary/<id>/ in both ways. The technical words are here, the kitchen sentences are in voice-glossary-kitchen.js.
   Fields: id (the address), term (the name shown), aka (other names, for the search), cat (one of CATS), icon (one of V3.icons, icons.js),
   entry (the main term it belongs to, if any), related (other glossary ids), def (one or two sentences), more (optional, up to three short paragraphs).
   Inline markup as everywhere: `code`, **bold**, [[id]] or [[id|label]] (an id of a main term or of this glossary), [text](https://…). */
window.AE3 = window.AE3 || {};
(function (AE3) {
  "use strict";

  // The groups of the glossary. zone: the colour on the map.
  AE3.glossaryCats = [
    { id: "models", title: "Models and training", zone: "model" },
    { id: "prompting", title: "Prompts and context", zone: "harness" },
    { id: "tools", title: "Tools and protocols", zone: "tools" },
    { id: "agents", title: "Agents and loops", zone: "harness" },
    { id: "knowledge", title: "Knowledge and memory", zone: "know" },
    { id: "safety", title: "Safety and control", zone: "control" },
    { id: "teams", title: "Teams and workflows", zone: "orch" },
    { id: "ops", title: "Quality, cost and rules", zone: "ops" },
    { id: "uses", title: "Products and uses", zone: "start" }
  ];

  // The icon of each of the 21 main terms (the other terms carry theirs).
  AE3.glossaryIcons = {
    model: "net", reasoning: "bubble", context: "window", prompt: "pencil", tools: "wrench", mcp: "plug", "agent-loop": "loop", harness: "gear",
    instructions: "note", skills: "puzzle", knowledge: "search", memory: "db", permissions: "key", sandbox: "box", hooks: "flag", security: "shield",
    team: "team", background: "clock", evals: "checklist", cost: "coin", governance: "gavel"
  };

  AE3.glossary = [

    /* ---- Models and training ---- */
    { id: "chain-of-thought", term: "Chain of thought", aka: ["CoT", "step-by-step reasoning"], cat: "models", icon: "ladder", entry: "reasoning", related: ["reasoning-model", "test-time-compute", "self-consistency"],
      def: "The intermediate reasoning steps a model writes before its final answer. Writing the steps out gives the model room to work through a problem, which usually improves accuracy on maths, logic and planning.",
      more: [
        "The reasoning is ordinary generated text, so each written step becomes part of the context that later tokens are predicted from. A wrong early step can carry forward, and the final answer may not follow from the steps shown. Written reasoning is therefore a working aid, not a reliable record of how the model reached its answer.",
        "Longer reasoning costs output tokens and latency, and on simple questions it adds little. In agents it is used to plan the next tool call and to check results. Many APIs return it as separate blocks, which should be passed back unchanged on the next turn and treated as untrusted when logged or shown."
      ] },
    { id: "effort", term: "Effort", aka: ["thinking level", "reasoning effort", "thinking budget"], cat: "models", icon: "gauge", entry: "reasoning", related: ["reasoning-model", "test-time-compute", "token-budget"],
      def: "A setting that tells a model how much reasoning, and therefore how many tokens, to spend on a task. Higher effort suits hard, multi-step problems; lower effort is faster and cheaper for simple ones.",
      more: [
        "Effort is usually exposed as a coarse setting, such as low, medium or high, that caps or guides how many tokens the model may spend on reasoning before it answers. Some APIs express it as a token budget instead. It changes how long the model thinks, not what it knows, so it cannot fix a missing fact or a poor prompt.",
        "Set it per task, not once for a whole system. An agent can use low effort for routing and simple lookups, and high effort for planning or debugging. Too much effort on easy steps wastes money and time, and too little on hard steps produces shallow plans and skipped checks. Measure both on your own tasks with [[evals]]."
      ] },
    { id: "fine-tuning", term: "Fine-tuning", aka: ["supervised fine-tuning", "SFT", "LoRA"], cat: "models", icon: "pencil", entry: "model", related: ["post-training", "distillation", "rlhf", "open-weight-model"],
      def: "Further training of a model's weights on your own examples, so that its behaviour changes for good and not only for one request. It is usually tried after better instructions, context and tools, since those are cheaper to change and to undo.",
      more: [
        "Full fine-tuning updates every weight and needs a lot of memory. Parameter-efficient methods such as LoRA train a small set of added weights and leave the original model untouched, which is far cheaper and lets one base model serve many variants.",
        "Fine-tuning is good for style, format and narrow skills. It is a poor way to add facts that change, because new knowledge is better supplied at request time with [[rag]] or tools."
      ] },
    { id: "hallucination", term: "Hallucination", aka: ["confabulation", "fabrication"], cat: "models", icon: "warning", entry: "model", related: ["grounding", "citation", "rag", "knowledge-cutoff"],
      def: "A confident but false or unsupported statement produced by a model, such as an invented fact, a made-up quotation or a function that does not exist. It happens because the model predicts plausible text and has no built-in check of truth.",
      more: [
        "The model samples likely continuations, and a fluent false claim can be as likely as a true one, especially for rare facts, exact figures, citations and names. It is most common when the answer is not in the context or the question assumes something false. Fluency and confidence say nothing about whether a claim is correct.",
        "Common mitigations are to supply source text with [[rag]] and ask for quotations, to let the model say it does not know, to verify claims with tools, and to run a second check. In agents, a hallucinated function name or file path often shows up as a failed tool call, while an invented fact in a final report is harder to catch. Mitigation lowers the rate but does not remove it."
      ] },
    { id: "reasoning-model", term: "Reasoning model", aka: ["thinking model"], cat: "models", icon: "bubble", entry: "reasoning", related: ["chain-of-thought", "test-time-compute", "effort", "reinforcement-learning", "tree-of-thought"],
      def: "A model trained to think step by step before answering, trading extra tokens and time for accuracy. It tends to do better on maths, code and multi-step planning, and needs less step-by-step coaching in the prompt.",
      more: [
        "Reasoning models are typically trained with reinforcement learning on tasks whose results can be checked, so they learn to explore, check and backtrack in a long hidden or visible chain of thought. They are served like other models, but the reasoning tokens count towards output limits and cost, and the number of them varies from request to request.",
        "They help most on maths, code, planning and tasks with many constraints. They can be slower and wasteful on simple lookups, and they may overthink. Prompts should state the goal and the constraints rather than dictate every step, since over-prescriptive instructions can get in the way. For agents they are often used as the planner, with smaller models doing routine steps."
      ] },
    { id: "transformer", term: "Transformer", aka: ["transformer architecture"], cat: "models", icon: "chip", entry: "model", related: ["attention", "parameters", "pre-training", "mixture-of-experts"],
      def: "The neural-network architecture behind modern language models, built on attention. It reads all tokens of its input in parallel and learns which ones matter for each other, which made training at very large scale practical.",
      more: [
        "A transformer stacks many layers, each with [[attention]] followed by a feed-forward network, plus residual connections and normalisation. Positions are encoded explicitly because attention itself ignores order. For text generation the model is causal: each token can attend only to earlier ones, so output is produced one token at a time.",
        "Training parallelises well on accelerators, because all positions of a sequence are processed together. The cost is that attention work grows with the square of the sequence length, which limits context size and makes long inputs expensive. Most of the variation between current models is in details such as how attention is organised, how experts are used and how positions are encoded."
      ] },
    { id: "pre-training", term: "Pre-training", aka: ["base model training", "next-token prediction"], cat: "models", icon: "books", entry: "model", related: ["post-training", "foundation-model", "parameters", "knowledge-cutoff"],
      def: "The first and largest training stage, in which a model learns to predict the next token across huge amounts of text, code and other data. It gives the model its general knowledge and language ability, and it sets the knowledge cutoff.",
      more: [
        "The data is filtered, deduplicated and split into tokens. The model is trained to predict each next token, and the error is propagated back to adjust the weights over a very large number of steps on many accelerators. This takes weeks or months and is the most expensive stage, so it is done rarely and its result is reused as a base.",
        "The outcome is a base model that continues text well but does not reliably follow instructions or refuse harmful requests. Its quality depends heavily on data quality and mix. It can reproduce errors, bias and memorised text from the data, and it knows nothing after the cutoff, which is why [[post-training]], tools and retrieval are added afterwards."
      ] },
    { id: "post-training", term: "Post-training", aka: ["alignment training", "instruction tuning"], cat: "models", icon: "funnel", entry: "model", related: ["pre-training", "fine-tuning", "rlhf", "reinforcement-learning"],
      def: "All training after pre-training that shapes how a model behaves: supervised examples of good answers, preference tuning such as RLHF, and reinforcement learning on tasks with checkable results. It turns a text predictor into an assistant that follows instructions and uses tools.",
      more: [
        "Typical stages are supervised fine-tuning on written demonstrations, preference training from human or model judgements, and reinforcement learning on tasks with checkable results. Together they teach format, tone, refusal behaviour, tool-calling syntax and the habit of reasoning before answering. It uses far less compute than [[pre-training]] but a great deal of careful data work.",
        "Post-training shapes behaviour more than knowledge. Over-optimising for a reward can make a model flattering, evasive or good at gaming a metric, and the same training can shift behaviour in ways nobody tested. This is why a new model version can behave differently with an unchanged prompt, and why agent prompts and tools should be re-tested on upgrade."
      ] },
    { id: "foundation-model", term: "Foundation model", aka: ["base model", "frontier model"], cat: "models", icon: "globe", entry: "model", related: ["pre-training", "fine-tuning", "multimodal-model", "open-weight-model"],
      def: "A large model trained on broad data so that it can be adapted to many tasks, through prompting, fine-tuning or tools. Language models are the best-known kind; others handle images, audio, video or several at once.",
      more: [
        "A foundation model is trained once at high cost and then reused. Adaptation ranges from writing a prompt, through supplying documents and tools, to [[fine-tuning]] the weights. Because many products share the same base, its flaws, biases and security weaknesses are shared as well, and a change by its maker can alter every product built on it.",
        "In agent systems the foundation model is the reasoning component, accessed through an [[api]] or run on your own hardware. Choosing one means weighing capability, context length, speed, cost, data handling and licence terms. The term says how a model is used, not how large it is, so a small model can also serve as one."
      ] },
    { id: "open-weight-model", term: "Open-weight model", aka: ["open model", "open weights"], cat: "models", icon: "folder", entry: "model", related: ["foundation-model", "fine-tuning", "quantisation", "small-language-model"],
      def: "A model whose trained weights are published so that anyone can download and run them on their own hardware, under a licence that sets the terms. Open-weight is not the same as open source: training data and training code are often not released.",
      more: [
        "With the weights you can run the model offline, inspect it, quantise it and fine-tune it, so prompts and data never need to leave your systems. That helps with privacy, cost at scale and control over versions, since nothing changes unless you change it. The licence may still limit commercial use, field of use or the size of the company.",
        "The trade-offs are operational. You must provide the hardware, serving software, monitoring and security patches, and the best open models may lag the best hosted ones on some tasks. Safety measures in the weights can be removed by fine-tuning, so the deployer carries responsibility for what the model is allowed to do."
      ] },
    { id: "parameters", term: "Parameters", aka: ["weights", "model size", "billions of parameters"], cat: "models", icon: "bars", entry: "model", related: ["transformer", "pre-training", "quantisation", "mixture-of-experts"],
      def: "The numbers inside a neural network that training adjusts; together they hold everything the model has learned. Modern language models have billions or trillions of them, and size is a rough guide to capability, memory needs and running cost.",
      more: [
        "Most parameters are the weights in matrices that multiply the activations in each layer, plus embeddings and biases. At inference the weights must be held in accelerator memory, so memory needed is roughly the parameter count times the bytes per number. [[quantisation]] reduces that by storing each number with fewer bits, at some cost in quality.",
        "Parameter count is a poor single measure of ability. Training data, training length and design matter as much, and a well-trained smaller model can beat a larger one. In a [[mixture-of-experts]] model only a fraction of the parameters is active for each token, so total and active counts differ. Compare models by testing them on your own tasks."
      ] },
    { id: "attention", term: "Attention", aka: ["self-attention", "attention mechanism"], cat: "models", icon: "eye", entry: "model", related: ["transformer", "kv-cache", "long-context", "lost-in-the-middle"],
      def: "The mechanism in a transformer that lets each token weigh every other token in the context when deciding what comes next. It is how a model links a pronoun to its noun, or an instruction to a detail far earlier in the text.",
      more: [
        "For each token the model computes how strongly it should look at each earlier token, then blends their information by those weights. Doing this in many parallel heads and many layers lets the model track grammar, facts and instructions at once.",
        "The cost of attention grows with the length of the context, which is why long inputs are slower and dearer, and why tricks such as the [[kv-cache]] matter."
      ] },
    { id: "temperature", term: "Temperature", aka: ["sampling", "top-p", "top-k", "nucleus sampling"], cat: "models", icon: "thermo", entry: "model", related: ["structured-output", "self-consistency", "hallucination"],
      def: "A setting that controls how random a model's choice of the next token is. Low values make output more predictable and repeatable; high values make it more varied. Related settings, such as top-p, limit which candidate tokens may be picked at all.",
      more: [
        "At every step the model scores all possible next tokens. The sampler then picks one: temperature reshapes the scores, top-k keeps only the k best, and top-p keeps the smallest set whose probabilities add up to p.",
        "A temperature of zero makes the choice nearly deterministic, but identical output is still not guaranteed, because of how computation is done on shared hardware. Some reasoning models fix these settings and do not let you change them."
      ] },
    { id: "rlhf", term: "RLHF (reinforcement learning from human feedback)", aka: ["RLHF", "preference tuning", "human feedback"], cat: "models", icon: "hand", entry: "model", related: ["post-training", "reinforcement-learning", "alignment", "constitutional-ai"],
      def: "A post-training method in which people rank model answers, a reward model learns those preferences, and the language model is then tuned to produce answers that score higher. It is a main reason chat models follow instructions and sound helpful.",
      more: [
        "First a model is trained on pairs of answers where people marked the better one, and it learns to give a score. Then the language model is updated with a reinforcement learning algorithm to raise that score, with a penalty for drifting too far from its starting behaviour. Some methods skip the separate reward model and train on the preference pairs directly.",
        "The reward model is only an approximation of what people want, and the language model can learn to exploit it. Typical side effects are flattery, long and confident answers, and agreeing with the user when the user is wrong. Rater guidelines and rater pools shape the result, which is why the same method can give assistants with different manners."
      ] },
    { id: "reinforcement-learning", term: "Reinforcement learning", aka: ["RL", "reward"], cat: "models", icon: "target", entry: "reasoning", related: ["rlhf", "rlvr", "reasoning-model", "post-training"],
      def: "Training by trial and reward: the model tries something, receives a score for the outcome and is adjusted to make high-scoring behaviour more likely. In language models it is used to teach preferences, step-by-step reasoning and tool use.",
      more: [
        "The model generates an attempt, a reward function scores it, and the update raises the probability of the choices that led to higher scores. Because the reward often arrives only at the end of a long attempt, the method must work out which earlier steps deserve credit. Training also needs enough variety in attempts, so the model must explore, not only repeat what it already does.",
        "The model optimises exactly the reward it is given, not the intention behind it. Weak or gameable rewards lead to reward hacking, such as special-casing a test instead of solving the problem. Rewards from a [[rlhf]] reward model, a rule or an automatic check each have different failure modes, and agent training needs realistic environments to avoid learning habits that fail in production."
      ] },
    { id: "rlvr", term: "RLVR (reinforcement learning with verifiable rewards)", aka: ["RLVR", "verifiable rewards"], cat: "models", icon: "ruler", entry: "reasoning", related: ["reinforcement-learning", "reasoning-model", "rlhf"],
      def: "Reinforcement learning in which the reward comes from an automatic check, such as a passing unit test or a correct maths answer, rather than from a human or a learned judge. It is widely used to train reasoning models on maths and code.",
      more: [
        "For each prompt the model produces several attempts, a checker such as a test suite or an answer matcher marks them pass or fail, and the update favours the passing ones. Because the check is programmatic, it is cheap, consistent and hard to flatter, so training can run at large scale without human raters. It is a form of [[reinforcement-learning]].",
        "It only works where a reliable check exists, so it is strongest in maths, code and puzzles and weaker for writing quality or judgement. Weak tests can be gamed, for example by hard-coding expected outputs. Gains may not transfer to tasks without a checker. The same idea applies to agents, where a passing build or a satisfied condition can serve as the reward."
      ] },
    { id: "distillation", term: "Distillation", aka: ["knowledge distillation", "teacher and student"], cat: "models", icon: "flask", entry: "model", related: ["small-language-model", "fine-tuning", "quantisation", "inference"],
      def: "Training a smaller student model to imitate the outputs of a larger teacher model. The student keeps much of the teacher's quality at a fraction of the size, cost and delay.",
      more: [
        "The student is trained on text generated by the teacher, or on the teacher's full probability distribution over next tokens, which carries more information than a single correct answer. The student can also learn from the teacher's reasoning traces. A well-chosen set of prompts, covering the real use, matters more than a very large set.",
        "The student rarely matches the teacher outside the range of examples it was trained on, and it inherits the teacher's mistakes and biases. The terms of the teacher's licence may forbid using its outputs to train another model. In agent systems, distillation is used to turn an expensive planner into a cheap model for one narrow, high-volume step."
      ] },
    { id: "mixture-of-experts", term: "Mixture of experts (MoE)", aka: ["MoE", "sparse model", "expert routing"], cat: "models", icon: "fork", entry: "model", related: ["parameters", "transformer", "inference"],
      def: "A model design with many specialised sub-networks, called experts, where a learned router activates only a few of them for each token. The model can be very large in total yet cost less to run per token, since only part of it works at a time.",
      more: [
        "Each feed-forward block contains many expert networks and a small router. For every token, the router scores the experts and sends the token to the top few, then combines their outputs. Experts are not hand-assigned to topics. They specialise during training in ways that are often hard to interpret, and a load-balancing term keeps the router from favouring a few.",
        "Compute per token is lower than for a dense model of the same total size, but all expert weights must still sit in memory, and tokens routed to experts on different devices create communication cost. Batch size and uneven routing affect throughput. For users this mostly appears as cost and speed, since the quality depends on the model, not on the design alone."
      ] },
    { id: "multimodal-model", term: "Multimodal model", aka: ["vision-language model", "VLM", "multimodal"], cat: "models", icon: "camera", entry: "model", related: ["foundation-model", "computer-use", "voice-agent", "diffusion-model"],
      def: "A model that takes more than one kind of input, such as text, images, audio or video, and sometimes produces more than one kind of output. A vision-language model handles images together with text, for example to read a screenshot or a chart.",
      more: [
        "Non-text input is converted into sequences of embeddings that sit alongside text tokens. An image is cut into patches and encoded, audio is turned into frames, and the transformer attends over all of them together. Output is often text only, though some models also produce images or speech. Each image or audio clip uses a number of tokens that counts against the context and the bill.",
        "Typical failures are misread small text, wrong counts, errors in spatial layout and details missed in dense images. Resolution limits can cut away fine print. In agents, multimodal input enables [[computer-use]] and document reading, but content inside an image can carry hidden instructions, so images are an input for [[prompt-injection]] like any other."
      ] },
    { id: "diffusion-model", term: "Diffusion model", aka: ["image generation model", "text-to-image"], cat: "models", icon: "flask", entry: "model", related: ["multimodal-model", "generative-ai", "transformer"],
      def: "A generative model that learns to turn random noise into an image, audio or video by removing noise step by step, guided by a text description. It is the basis of most image generators; text models mostly use transformers instead.",
      more: [
        "Training adds noise to real examples in steps and teaches a network to predict and remove it. To generate, the process starts from pure noise and runs many denoising steps, each guided by an encoding of the text prompt. Working in a compressed latent space makes this affordable. Guidance strength trades prompt fidelity against variety, and the number of steps trades quality against time.",
        "Typical weaknesses are rendering text inside images, exact counts, hands, and consistent characters across several images. Outputs can reflect biases and copyrighted styles in the training data. Agents usually call a diffusion model as a tool, with a prompt written by the language model. Some newer systems combine diffusion with transformers, so the line between the two families is blurring."
      ] },
    { id: "small-language-model", term: "Small language model (SLM)", aka: ["SLM", "small model", "on-device model"], cat: "models", icon: "chip", entry: "model", related: ["distillation", "quantisation", "model-routing", "open-weight-model"],
      def: "A language model small enough to run cheaply, quickly or on a laptop or phone, typically from under one billion to a few billion parameters. On narrow tasks, especially after fine-tuning, it can match a larger model, so agents often use one for simple steps.",
      more: [
        "Small models are made by training on well-chosen data, by [[distillation]] from a larger model, and by [[quantisation]] so the weights fit in little memory. Their limits show in broad world knowledge, long multi-step reasoning and following complex instructions. They run with low latency and can stay on the device, which keeps data private and works offline.",
        "They suit classification, extraction, routing, short rewriting and well-defined tool calls, particularly after [[fine-tuning]] on the task. An agent system often puts a large model on planning and small models on frequent, simple steps, which cuts cost and delay. The risk is that a small model fails silently on an unusual input, so test them on realistic edge cases."
      ] },
    { id: "test-time-compute", term: "Test-time compute", aka: ["inference-time compute", "inference-time scaling", "thinking time"], cat: "models", icon: "hourglass", entry: "reasoning", related: ["reasoning-model", "effort", "self-consistency", "chain-of-thought"],
      def: "Computing power spent while a model answers rather than while it is trained, usually by letting it write a longer chain of thought or try several answers. More of it often improves results on hard problems, at a cost in time and tokens.",
      more: [
        "There are two main forms. The model can think for longer in one chain of thought, or the system can sample several answers and choose among them, by majority vote, a verifier or a learned scorer. Search over partial solutions is a third option. Each trades more tokens and time for a higher chance of a right answer.",
        "Returns diminish, and extra compute helps most when the model sometimes solves a problem and a check can recognise the good attempt. If the model never finds the answer, more attempts add cost without benefit. It makes cost and latency variable, so agent systems set budgets and caps, and use more compute only on steps where accuracy matters most."
      ] },

    /* ---- Prompts and context ---- */
    { id: "context-engineering", term: "Context engineering", aka: ["context design"], cat: "prompting", icon: "funnel", entry: "context", related: ["prompt-engineering", "context-rot", "compaction", "system-prompt"],
      def: "Curating the full set of tokens a model sees at each step: instructions, tools, knowledge, history and results. The aim is the smallest set of information that makes the right answer likely.",
      more: [
        "[[prompt-engineering]] is about wording one instruction well. Context engineering is wider: it decides what to retrieve, what to keep from earlier turns, what to summarise and which tools to describe, at every step of a long run.",
        "Common techniques are retrieving on demand instead of loading everything, [[compaction]] of old history, keeping notes outside the window, and handing sub-tasks to helpers with a fresh context."
      ] },
    { id: "context-rot", term: "Context rot", aka: ["context degradation", "long-context decay"], cat: "prompting", icon: "warning", entry: "context", related: ["long-context", "lost-in-the-middle", "compaction", "context-engineering"],
      def: "The decline in a model's accuracy as its context grows longer and noisier. Relevant details get harder to find among the clutter, so more context is not always better.",
      more: [
        "Attention is spread over every token in the window, so irrelevant material competes with relevant material, and similar but wrong passages can distract the model. Accuracy often falls well before the stated context limit, and it falls faster when the task needs reasoning over the content than when it only needs a word looked up. Position matters too, as in [[lost-in-the-middle]].",
        "In long agent runs it builds up from stale tool output, abandoned plans and repeated attempts. Remedies are to keep the context small and relevant, to clear or [[compaction|compact]] old results, to store notes outside the window and to hand sub-tasks to fresh sub-agents. Measuring accuracy at several context lengths on your own task shows where the decline starts."
      ] },
    { id: "token", term: "Token", aka: ["tokens", "token count"], cat: "prompting", icon: "tag", entry: "context", related: ["tokenizer", "context", "cost", "token-budget"],
      def: "The unit models read and write, roughly three quarters of an English word. Context limits, prices and speed are all counted in tokens.",
      more: [
        "A tokenizer splits text into pieces from a fixed vocabulary, often common words, parts of words, single characters or bytes. Common words are usually one token, while rare words, names, code, numbers and many non-English languages need more. Each token is turned into a vector, and the model produces the next token one at a time.",
        "Token counts differ between model families, so cost and context use cannot be compared by word count. Models also see tokens, not letters, which explains weak spelling, counting letters and some arithmetic errors. In agents, tool results, file contents and the history all consume tokens, so budgeting them is a main part of [[context-engineering]]."
      ] },
    { id: "agents-md", term: "AGENTS.md", aka: ["agent instruction file", "CLAUDE.md", "rules file"], cat: "prompting", icon: "note", entry: "instructions", related: ["system-prompt", "coding-agent", "agentic-ai-foundation"],
      def: "An open, cross-tool Markdown file of instructions for coding agents, placed in a repository. It holds what an agent cannot guess, such as how to build and test, conventions and what to avoid.",
      more: [
        "Coding agents read the file at the start of a session and add it to the context, so its text is paid for in tokens every time. Many tools find it in the repository root and also read nested files in subdirectories, with the closest file taking priority for work in that folder. Because it is plain Markdown, any tool and any person can read it.",
        "Keep it short and concrete: build and test commands, naming and layout rules, and things that are easy to get wrong. Long files, generated summaries of the code and out-of-date rules do harm, since the agent follows them anyway. Treat it like code, with review and updates. Never place secrets in it, and remember that anyone who can edit it can steer the agent."
      ] },
    { id: "prompt-engineering", term: "Prompt engineering", aka: ["prompt design", "prompting"], cat: "prompting", icon: "pencil", entry: "prompt", related: ["context-engineering", "few-shot-prompting", "system-prompt", "structured-output"],
      def: "Writing and refining the instructions, examples and structure given to a model so that it produces the result you want. It is done by testing variations against sample inputs, and it overlaps with [[context-engineering]], which also covers what else the model sees.",
      more: [
        "Practical techniques include stating the goal and audience, giving the format wanted, supplying examples, separating instructions from data with clear delimiters, and telling the model what to do instead of only what to avoid. Prompts should be versioned and tested on a fixed set of inputs, since a change that fixes one case often breaks another.",
        "Prompts are brittle across model versions, and clever wording gives less than clear requirements, good examples and the right information. For agents, the larger lever is usually the tool descriptions, the context and the checks, not the wording of one instruction. Prompt text cannot enforce a rule reliably, so anything that must hold should also be enforced in code."
      ] },
    { id: "system-prompt", term: "System prompt", aka: ["system message", "developer message", "standing instructions"], cat: "prompting", icon: "doc", entry: "instructions", related: ["persona", "agents-md", "prompt-injection", "prompt-engineering"],
      def: "Standing text, set by the developer or the app, placed at the start of the context to frame every turn: role, rules, tone and available tools. Models are usually trained to give it more weight than ordinary input, but it is not a security boundary.",
      more: [
        "The model receives the system prompt in a separate role or position, and training teaches it to follow that role more closely than text from users or tools. In agent harnesses it typically holds the identity, behaviour rules, tool usage guidance and project instructions. It is re-sent on every request, so it costs tokens each turn and is a good candidate for [[prompt-caching]].",
        "Because it is only text the model may follow or not, it can be ignored, argued around or leaked by a persistent user, and it is weaker than later instructions that are more specific or recent. Do not put secrets in it, and do not rely on it for access control. Enforce permissions in the tools and the surrounding code."
      ] },
    { id: "few-shot-prompting", term: "Few-shot prompting", aka: ["zero-shot", "one-shot", "examples in the prompt"], cat: "prompting", icon: "stack", entry: "prompt", related: ["in-context-learning", "prompt-engineering", "structured-output"],
      def: "Putting a few worked examples of the task into the prompt so that the model copies their format and style. With no examples it is called zero-shot, with one, one-shot. Examples often steer output more reliably than a description alone.",
      more: [
        "The examples set the pattern for input, output and style, and the model continues it. Choose examples that cover the real range of inputs, including hard and edge cases, and keep their format identical. Order can matter, and the model often copies the last example. For structured tasks, examples work well together with a schema or [[structured-output]].",
        "Examples cost tokens on every call and can narrow behaviour too much, so the model may copy surface details, such as length or a repeated label, instead of the underlying rule. Wrong or inconsistent labels in the examples hurt results. Reasoning models often need fewer examples. Test with and without them, and rotate examples if one skews the output."
      ] },
    { id: "in-context-learning", term: "In-context learning", aka: ["ICL", "learning from examples in the prompt"], cat: "prompting", icon: "book", entry: "context", related: ["few-shot-prompting", "fine-tuning", "context"],
      def: "A model's ability to pick up a task from instructions and examples placed in its context, without any change to its weights. The learning lasts only for that request: the next request starts from the same unchanged model.",
      more: [
        "Nothing is stored in the weights. The examples and instructions are simply part of the input, and the model's attention lets it use them to infer the task and respond accordingly. The effect is strong for format and style, weaker for new facts or skills the model has not met in training, and sensitive to how the examples are chosen and ordered.",
        "It is the basis of [[few-shot-prompting]] and of how agents use their history, tool results and retrieved documents. Its limits are the size of the window and [[context-rot]], and anything learned is lost when the context ends. For lasting change, save notes to [[memory]] or use [[fine-tuning]], which actually changes the weights."
      ] },
    { id: "structured-output", term: "Structured output", aka: ["JSON mode", "constrained decoding", "response schema"], cat: "prompting", icon: "ruler", entry: "prompt", related: ["tool-schema", "function-calling", "temperature"],
      def: "Making a model reply in a fixed machine-readable format, usually JSON that matches a given schema. Some systems enforce the format while the text is generated, so the result always parses; others only ask for it and validate afterwards.",
      more: [
        "Constrained decoding works by masking the tokens that would break the schema at each step, so only valid continuations can be sampled. That guarantees syntax, such as valid JSON with the right keys and types, but not that the values are correct. A model can fill a field with a plausible wrong value, so semantic checks are still needed.",
        "Keep schemas simple. Deep nesting, many optional fields and ambiguous names raise error rates, and field order can affect quality, for example when a reasoning field is placed before the answer. Where enforcement is not available, parse, validate and retry with the error message. Structured output is how agents hand results to code, and it is closely related to [[function-calling]]."
      ] },
    { id: "kv-cache", term: "KV cache (key-value cache)", aka: ["key-value cache", "attention cache"], cat: "prompting", icon: "db", entry: "context", related: ["prompt-caching", "attention", "long-context", "latency"],
      def: "Memory in which a model keeps the intermediate attention results, the keys and values, of tokens it has already processed, so it does not recompute them for every new token. It makes generation fast, and it is what [[prompt-caching]] reuses across requests.",
      more: [
        "In attention, each token produces a key and a value for every layer. Without a cache these would be recomputed for the whole history at each new token. With the cache they are stored and only the new token is processed. The price is memory, which grows with context length, layers and the number of requests served at once.",
        "Cache size is a main limit on how many long conversations a server can hold. Techniques such as sharing keys and values across heads, quantising the cache and evicting old entries reduce it. A cache is only reusable if the beginning of the input is identical, so changing early text invalidates everything after it. This is why stable prefixes make [[prompt-caching]] work."
      ] },
    { id: "long-context", term: "Long context", aka: ["long context window", "million-token context", "needle in a haystack"], cat: "prompting", icon: "window", entry: "context", related: ["context-rot", "lost-in-the-middle", "rag", "kv-cache"],
      def: "The ability of a model to take very large inputs, from hundreds of thousands of tokens up to a million or more, in one request. It lets a model read a whole codebase or report at once, but cost grows with length and accuracy on details can still drop.",
      more: [
        "A common test is needle in a haystack: hide one fact in a long text and ask for it. Models now score well on this simple test, but it measures finding one item, not reasoning across many.",
        "Retrieval with [[rag]] or tools often beats pasting everything in: it is cheaper, faster and puts only relevant text in front of the model."
      ] },
    { id: "lost-in-the-middle", term: "Lost in the middle", aka: ["middle-of-context effect", "position bias"], cat: "prompting", icon: "eye", entry: "context", related: ["context-rot", "long-context", "attention"],
      def: "The finding, first reported in 2023, that models use information at the start and end of a long context more reliably than information in the middle. It is one reason to put key instructions and facts at the edges, and not to rely on a large window alone.",
      more: [
        "The effect appears because of how models are trained and how position is encoded, and the exact strength varies between models and has changed with newer training. It is largest when the context is long, crowded with similar passages, or the answer must be found among many near matches. Plain recall of a single clear fact is usually easier than combining several facts.",
        "Practical steps are to place key instructions at the start and repeat them near the end, to keep the context short, to retrieve fewer and better passages, and to put the most relevant ones first or last after [[reranking]]. Evaluate with your own data, putting the answer at different positions, since results from a public test may not carry over."
      ] },
    { id: "persona", term: "Persona", aka: ["role prompt", "role prompting", "character"], cat: "prompting", icon: "mask", entry: "prompt", related: ["system-prompt", "prompt-engineering", "instructions"],
      def: "A role or character a model is told to take, such as a reviewer, a tutor or a support agent, usually set in the system prompt. It shifts tone, vocabulary and focus, but does not give the model skills or facts it lacks.",
      more: [
        "A persona is written as text, such as a role, a viewpoint, a tone and a few rules, and the model adjusts the style and focus of its output to fit. It changes how things are said and what is emphasised, but it does not raise capability. Claiming to be an expert does not make the model more accurate and can make it sound more sure than it should.",
        "Problems come from personas that are too strong. The model may stay in role when it should flag uncertainty, invent credentials, or become inconsistent over a long session. A persona can also be used as a route to bypass rules, as in role-play [[jailbreak]] attempts. Keep personas short, state the task and limits explicitly and test whether behaviour holds under pressure."
      ] },
    { id: "stop-sequence", term: "Stop sequence", aka: ["stop token", "end-of-turn"], cat: "prompting", icon: "flag", entry: "prompt", related: ["streaming", "structured-output", "temperature"],
      def: "A string that ends the model's output the moment it is generated. Developers use stop sequences to cut a reply off at a delimiter, such as the end of a list, or to stop the model before it starts writing the next speaker's turn.",
      more: [
        "The check runs on the generated text during decoding. When the output ends with the listed string, generation halts and the string is normally left out of the returned text. It saves tokens and time, and it prevents the model from continuing into an unwanted section. Most APIs allow a few stop strings, and the stop reason is reported in the response.",
        "Typical mistakes are choosing a string that also appears in valid output, which cuts replies short, and relying on one that the model does not produce reliably, so generation runs to the length limit. Tokenisation can split a string unexpectedly. Always check the stop reason, and treat a length cut-off as a truncated answer, since a truncated JSON object will fail to parse."
      ] },
    { id: "streaming", term: "Streaming", aka: ["token streaming", "server-sent events"], cat: "prompting", icon: "cloud", entry: "context", related: ["latency", "stop-sequence", "voice-agent"],
      def: "Sending a model's answer to the client piece by piece as it is generated, instead of waiting for the whole reply. The reader sees text start almost at once; agents also stream tool calls and progress events.",
      more: [
        "Most APIs use server-sent events or a similar stream. The client receives small events, such as text deltas, the start and end of a content block, tool-call arguments in fragments and a final message with the stop reason and token usage. The client assembles the fragments in order. Total generation time is unchanged, but the first token arrives much earlier.",
        "Streaming complicates error handling, since a failure can arrive after part of the answer was shown. Partial JSON in tool arguments must not be parsed until it is complete, and retries must not duplicate side effects. Connections can drop or be closed by proxies. Agents use streaming to show progress and let a user interrupt a long run early."
      ] },
    { id: "tokenizer", term: "Tokenizer", aka: ["tokenisation", "byte-pair encoding", "BPE"], cat: "prompting", icon: "squeeze", entry: "context", related: ["token", "context", "cost", "embedding"],
      def: "The component that splits text into tokens and maps each to a number before the model reads it, and turns the model's output numbers back into text. Each model family has its own tokenizer, so the same text can cost a different number of tokens in different models.",
      more: [
        "The vocabulary is built before training, commonly by merging the most frequent byte or character pairs repeatedly until a set size is reached. Encoding is deterministic: the same text always gives the same tokens. Special tokens mark boundaries such as the start of a message, a role or a tool call, and the model is trained to use them.",
        "Use the matching tokenizer to count tokens and budget the context, because a different one gives different counts. Odd splits explain trouble with exact spelling, rare names, long numbers and unusual scripts. Whitespace and casing can change the tokens and so the model's behaviour. Text that tries to imitate special tokens should be escaped, since it can confuse a poorly built harness."
      ] },

    /* ---- Tools and protocols ---- */
    { id: "computer-use", term: "Computer use", aka: ["GUI agent", "screen control"], cat: "tools", icon: "cursor", entry: "tools", related: ["browser-agent", "multimodal-model", "rpa", "sandbox"],
      def: "A model operating a graphical interface by looking at screenshots and sending mouse and keyboard actions. It works with any application, even without an API, but is slower and less reliable than calling a tool directly.",
      more: [
        "The loop is simple: take a screenshot, let the model choose an action such as click at a position, type text or press a key, run it, and repeat. The model must read the screen and estimate coordinates, so scaling, small targets and dense screens cause misses. Each step adds an image to the context, which makes long sessions expensive.",
        "Failures include clicking the wrong element, losing track after a pop-up and repeating a failed step. It also meets untrusted content, so a page or document can hold instructions that act as [[prompt-injection]]. Run it in a [[sandbox]] or virtual machine with limited accounts, require approval for risky actions, and prefer an API or [[mcp-server]] whenever one exists."
      ] },
    { id: "connector", term: "Connector", aka: ["integration", "app connector"], cat: "tools", icon: "link", entry: "mcp", related: ["mcp-server", "oauth", "api", "plugin"],
      def: "A ready-made integration, usually an MCP server, that links an AI app to a service such as a drive, a calendar or a CRM. Setting one up normally means signing in and granting it access to that account.",
      more: [
        "A connector hides authentication, tool definitions and data formats behind one setup step. Once enabled, the service's tools appear for the model, and the app sends requests to it as the signed-in user. The access is usually limited by scopes, so a read-only grant allows searching but not editing, and the person can remove it at any time.",
        "The main risks are granting more access than the task needs, the connector returning untrusted text that carries [[indirect-prompt-injection]], and many tools filling the context. Prefer narrow scopes and approval for any action that writes, sends or deletes. Review which connectors are enabled in a workspace, since each one widens what a single bad instruction can reach."
      ] },
    { id: "function-calling", term: "Function calling", aka: ["tool calling", "tool use"], cat: "tools", icon: "terminal", entry: "tools", related: ["tool-schema", "structured-output", "mcp-client", "code-execution"],
      def: "Another name for tool use: the model returns a structured request to call a named function with arguments, which your code executes, and the result is sent back to the model.",
      more: [
        "The developer sends the tool definitions with the request. If the model decides a tool is needed, it stops and returns the tool name and arguments, and the application validates them, runs the function and sends the result in a new message. The model never executes anything itself. Some models can return several calls at once so independent ones run in parallel.",
        "Errors usually come from arguments that are missing, of the wrong type or invented, from choosing the wrong tool among similar ones, and from results too large for the context. Validate every argument as untrusted input, return clear error messages the model can act on, and keep the [[tool-schema]] precise. The calls are the interface between the model and any real system."
      ] },
    { id: "mcp-server", term: "MCP server", aka: ["Model Context Protocol server"], cat: "tools", icon: "plug", entry: "mcp", related: ["mcp-client", "mcp-host", "connector", "json-rpc"],
      def: "A program that exposes tools, resources and prompts to AI applications over the Model Context Protocol. One server can be used by any application that speaks the protocol.",
      more: [
        "A server can run on your own machine, talking over standard input and output, or remotely over HTTP, where access is usually granted with [[oauth]]. Tools are actions, resources are readable items such as files or records, and prompts are ready-made templates.",
        "A server can reach whatever the account behind it can reach, and its tool descriptions are read by the model. Install only servers you trust, and watch for [[tool-poisoning]]."
      ] },
    { id: "plugin", term: "Plugin", aka: ["extension", "add-on"], cat: "tools", icon: "folder", entry: "skills", related: ["skills", "slash-command", "mcp-server", "hooks", "tool-poisoning"],
      def: "An installable bundle of skills, commands, sub-agents, hooks and MCP servers, so that a whole setup can be shared with one install. Plugins can run code with your permissions, so install only ones you trust.",
      more: [
        "A plugin is a package with a manifest that lists its parts, and the host loads them when the plugin is enabled. Components can be added or updated as a unit, and a team can share one version through a marketplace or repository. Skills and commands load into the context on demand, while hooks and servers run as code.",
        "Because a plugin can run commands and reach the network with your access, it carries supply-chain risk, and an update can change what it does. Read the contents, pin a version, and prefer plugins from sources you can audit. Enable only what a project needs, since every added skill or tool takes space in the context and can confuse tool choice."
      ] },
    { id: "slash-command", term: "Slash command", aka: ["custom command", "saved prompt"], cat: "tools", icon: "terminal", entry: "skills", related: ["skills", "plugin", "prompt-engineering", "playbook"],
      def: "A saved prompt template invoked by name, such as /review. In most harnesses custom commands are now written as skills.",
      more: [
        "The host replaces the command with the stored text, which may include arguments passed in, then sends it to the model like any other prompt. Commands are saved as files, so they can be versioned in a repository and shared with a team. A skill generalises the idea: it can have its own files and scripts, and the model can load it by itself when relevant.",
        "Commands suit short, repeatable tasks that a person starts on purpose, such as review, commit or test. Problems are vague wording, large hidden instructions that surprise users, and commands that grant broad tool permissions. Keep each one focused and review changes to the files like code, since a modified command in a shared repository changes what every user's agent is told to do."
      ] },
    { id: "a2a", term: "A2A (Agent2Agent)", aka: ["Agent2Agent protocol", "agent-to-agent protocol"], cat: "tools", icon: "globe", entry: "team", related: ["agent-card", "mcp-server", "multi-agent-system", "handoff"],
      def: "Open protocol that lets agents from different vendors discover each other through Agent Cards and delegate tasks over standard web transports. MCP connects an agent to tools; A2A connects agents to one another.",
      more: [
        "A client agent fetches the remote agent's [[agent-card]], then sends a task over HTTP using JSON-RPC and receives status updates and results. Tasks have a lifecycle, such as working, waiting for input and completed, and results are returned as artifacts. Long tasks can stream updates or notify a callback address, so the caller need not wait on an open connection.",
        "The remote agent is opaque: the client sees only what it chooses to return, not its prompts, tools or memory, which allows cooperation across organisations. That also means trust is limited. Authenticate the agent, treat its replies as untrusted input that may carry [[prompt-injection]], and limit what it may receive. Many systems need only [[mcp-server]] tools and add A2A when they must delegate to other agents."
      ] },
    { id: "tool-schema", term: "Tool schema", aka: ["tool definition", "function schema", "JSON Schema"], cat: "tools", icon: "doc", entry: "tools", related: ["function-calling", "structured-output", "tool-search", "mcp-server"],
      def: "The description of a tool given to the model: its name, a plain-language purpose and the parameters it accepts, usually written as JSON Schema. The model reads it to decide when to call the tool and how to fill in the arguments, so clear names and descriptions matter as much as the code.",
      more: [
        "Most schemas have a name, a description and a list of typed parameters with their own descriptions, allowed values and which ones are required. The model sees this text as part of the context and decides from it. Good descriptions say when to use the tool and when not to, what the arguments mean, and what comes back. Examples of valid arguments can help.",
        "Common faults are vague names, two tools that overlap, too many optional parameters and free-text fields where an enumerated value would do. A tool that returns huge results, or errors with no explanation, wastes context and leads to loops. Change a schema like a public interface, with tests, because small wording changes can alter which tool a model picks."
      ] },
    { id: "tool-search", term: "Tool search", aka: ["dynamic tool loading", "deferred tools"], cat: "tools", icon: "search", entry: "tools", related: ["tool-schema", "context-engineering", "token-budget"],
      def: "A way to avoid loading hundreds of tool definitions into the context: the model gets a search tool, looks up the tools a task needs and only those are added. It saves tokens and helps the model choose the right tool from a large set.",
      more: [
        "The tools are indexed by name and description, often with a lighter summary kept in the context. The model issues a search with keywords or a description of the need, gets back the best matches and then receives their full schemas for use. Some systems rank with keywords, others with [[embedding]] similarity, and a few let the model browse by category.",
        "It keeps the fixed prompt small and stable, which also helps [[prompt-caching]], and it avoids the confusion that comes from choosing among hundreds of similar tools. The trade-off is an extra step and the risk that a poor description means the right tool is never found. Write descriptions with the words users would use, and check how often the right tool is retrieved."
      ] },
    { id: "code-execution", term: "Code execution", aka: ["code interpreter", "code sandbox"], cat: "tools", icon: "terminal", entry: "tools", related: ["sandbox", "container", "microvm", "data-agent"],
      def: "A tool that lets a model write and run code in an isolated environment and read the output. It adds exact calculation, data analysis and file handling that text prediction alone cannot give, and it must run in a [[sandbox]] because the model wrote the code.",
      more: [
        "The model writes code, the harness runs it in an isolated process or container with limited files, memory, time and network, and the output or error is returned as text for the model to read. Because errors come back, the model can correct its own code and try again. State such as variables or files may persist for the session, or be reset for each run.",
        "The code is untrusted, so isolation matters more than convenience. Block network egress unless needed, give no secrets, cap resources and time, and mount only the files the task requires. Typical failures are infinite loops, huge output that fills the context and code that works on sample data but not the real data. Sending results through code instead of the model also saves tokens."
      ] },
    { id: "api", term: "API", aka: ["application programming interface", "REST API", "endpoint"], cat: "tools", icon: "cloud", entry: "tools", related: ["oauth", "json-rpc", "function-calling", "rate-limit"],
      def: "A defined way for one piece of software to ask another to do something, usually as an HTTP request that returns structured data, as in a REST API. Most agent tools are thin wrappers around APIs, and most models are used through one.",
      more: [
        "An API is a contract: the address, the method, the parameters, the format of the response, the error codes and the rules for authentication and usage limits. A client built to the contract keeps working while the provider changes its internals. Versioning and deprecation notices let the provider change the contract without breaking existing users overnight.",
        "For agents, an API call is a tool the model must use correctly, so docs, clear errors and predictable responses matter. Typical problems are rate limits, timeouts, pagination, changed fields and calls that repeat a side effect when retried. Make writes idempotent where possible, and store keys in a secrets manager, not in prompts. An [[mcp-server]] often wraps one or several APIs in a form models use more easily."
      ] },
    { id: "json-rpc", term: "JSON-RPC", aka: ["JSON-RPC 2.0", "remote procedure call"], cat: "tools", icon: "link", entry: "mcp", related: ["mcp-client", "mcp-server", "api"],
      def: "A small protocol for calling remote functions by sending JSON messages that carry a method name, parameters and an id, and receiving a result or an error. MCP uses JSON-RPC 2.0 for the messages between client and server.",
      more: [
        "A request has a version field, a method name, optional parameters and an id. The reply carries the same id and either a result or an error with a code and message. A message without an id is a notification and gets no reply. Replies can arrive out of order, and the id lets the caller match each one. The format does not depend on how messages travel.",
        "MCP uses it both ways, so a client calls a server and a server may also send requests to the client. Messages move over standard input and output for local servers, or over HTTP for remote ones. Common mistakes are mismatched ids, ignoring error responses and not handling a closed connection. Debugging usually means logging the raw messages on both sides."
      ] },
    { id: "oauth", term: "OAuth", aka: ["OAuth 2.0", "authorisation", "sign in with"], cat: "tools", icon: "key", entry: "permissions", related: ["secrets", "least-privilege", "connector", "mcp-server"],
      def: "A standard that lets a person grant an application limited access to their account on another service without sharing their password. The application receives a token with specific scopes that can expire or be revoked, and the MCP specification uses it for remote servers.",
      more: [
        "In the common authorisation code flow, the person is sent to the service's own sign-in page, approves a list of scopes, and the application receives a short-lived access token and often a refresh token. The application never sees the password. Modern practice adds PKCE, which protects the exchange for clients that cannot keep a secret.",
        "For agents, the token is the real credential, so store it securely, request the narrowest scopes and expect it to expire. Mistakes include broad scopes, tokens logged or placed in prompts, and one shared token that hides who did what. A tool using a user's token acts with that user's rights, which creates [[confused-deputy]] risk, so check what each action is allowed to do."
      ] },
    { id: "browser-agent", term: "Browser agent", aka: ["web agent", "browsing agent"], cat: "tools", icon: "globe", entry: "tools", related: ["computer-use", "ai-browser", "indirect-prompt-injection", "sandbox"],
      def: "An agent that works in a web browser: it loads pages, reads their content or a screenshot, clicks, types and fills in forms to finish a task. It can use any website without an API, but it is slower and is exposed to prompt injection from page content.",
      more: [
        "It observes the page as text from the accessibility tree or the page structure, as a screenshot, or both, and acts through a controlled browser by clicking, typing, scrolling and navigating. Text-based reading is cheaper and more precise, while screenshots handle pages whose structure is unclear. It can work in a fresh profile or with a person's logged-in sessions, which are very different in risk.",
        "Failure modes include pop-ups, captchas, changing layouts, infinite scrolling and loops that retry a failing step. Every page is untrusted input, so hidden text can try to redirect the agent through [[indirect-prompt-injection]]. Limit the sites and accounts it can reach, keep sensitive sessions out of its profile and require approval before purchases, messages or other actions that cannot be undone."
      ] },
    { id: "agent-sdk", term: "Agent SDK", aka: ["agent framework", "agent library"], cat: "tools", icon: "stack", entry: "harness", related: ["harness", "scaffold", "handoff", "function-calling"],
      def: "A software library that provides the parts of an agent so you do not build them from scratch: the loop, tool calling, context handling, guardrails, hand-offs and tracing. Model vendors and independent projects both publish them; the choice mostly decides how much of the loop you control yourself.",
      more: [
        "Most SDKs implement the same loop: send the context to the model, run any requested tools, append results and repeat until a stop condition. Around it they add typed tool definitions, streaming, retries, session storage, hooks or guardrails, and tracing for debugging. Some also provide ready tools such as file access and shell, plus support for [[mcp-server]] connections.",
        "The trade-off is control against speed of building. A library hides the loop, which is helpful until you need to debug the exact prompt the model saw or change how history is trimmed. Check that you can see every request, set limits on turns and cost, and swap models. Pin the version, since agent libraries change quickly and behaviour can shift between releases."
      ] },
    { id: "agent-card", term: "Agent Card", aka: ["A2A agent card", "agent description"], cat: "tools", icon: "tag", entry: "team", related: ["a2a", "multi-agent-system", "handoff"],
      def: "A JSON description that an A2A agent publishes about itself: its name, the skills it offers, the address to reach it and how to authenticate. Other agents read it to discover what the agent can do before they delegate a task.",
      more: [
        "A card is served at a well-known address on the agent's host. It lists the endpoint URL, the protocol version, supported input and output types, whether streaming is supported, the authentication schemes required and a description for each skill with example prompts. A calling agent, or the person configuring it, reads the card to decide whether and how to use the agent.",
        "The card is a claim made by the publisher, not proof of ability, so verify an unfamiliar agent before trusting it. Cards can become out of date, and a malicious or compromised one can overstate skills or point to a bad endpoint. Some designs allow signing the card to confirm who published it. Descriptions should be precise, since they drive routing decisions."
      ] },
    { id: "mcp-client", term: "MCP client", aka: ["Model Context Protocol client"], cat: "tools", icon: "plug", entry: "mcp", related: ["mcp-host", "mcp-server", "json-rpc", "function-calling"],
      def: "The part of an AI application that opens a connection to one MCP server and speaks the protocol with it: listing its tools and sending calls. A host application usually runs one client for each server it connects to.",
      more: [
        "The client starts the connection, negotiates which protocol version and capabilities both sides support, then asks the server for its list of tools, resources and prompts. When the model requests a tool, the client forwards the call as a [[json-rpc]] message, waits for the reply and returns it. It also manages the transport, such as a local process or a remote HTTP connection.",
        "Because the client sits between the model and the server, it is a natural place for controls: timeouts, size limits on results, logging and approval of calls. Servers can also ask the client to do things, for example to request a model completion or ask the person for input, and the client must decide whether to allow it. A one-to-one link keeps each server isolated from the others."
      ] },
    { id: "mcp-host", term: "MCP host", aka: ["Model Context Protocol host"], cat: "tools", icon: "window", entry: "mcp", related: ["mcp-client", "mcp-server", "permission-mode", "harness"],
      def: "The AI application that a person uses and that runs one or more MCP clients, for example a chat app, a code editor or an agent harness. It decides which servers to connect, shows approval prompts and passes tool results to the model.",
      more: [
        "A host holds the settings for which servers to start, handles sign-in and decides which tools are offered to the model in each conversation. When the model asks for a tool, the host applies its policy: allow, ask the person or deny. It also decides how tool descriptions and results are placed in the context, which affects both cost and safety.",
        "Since the host is the trusted component, weak choices there spread everywhere. Auto-approving all tools, enabling servers from unknown sources or ignoring changes in a server's tool list invite abuse such as [[tool-poisoning]]. Good hosts show what a call will do before it runs, let people set per-server permissions and keep logs. Different hosts offer different controls, so check them before relying on a server."
      ] },

    /* ---- Agents and loops ---- */
    { id: "agent", term: "Agent", aka: ["AI agent", "LLM agent"], cat: "agents", icon: "spark", entry: "agent-loop", related: ["agent-loop", "autonomous-agent", "workflow", "harness", "turn"],
      def: "A system in which a language model uses tools in a loop to reach a goal, choosing its own next steps. It differs from a [[workflow]], where your code fixes the path in advance.",
      more: [
        "The loop is simple: the model reads the context, decides on an action, the harness runs it, and the result goes back into the context for the next decision. The run ends when the model reports it is done or a limit is reached.",
        "Autonomy is a dial. A system with one tool and a fixed path is barely an agent; one that plans, retries and delegates is far along. More autonomy means more flexibility, and also more cost, delay and risk."
      ] },
    { id: "coding-agent", term: "Coding agent", aka: ["software engineering agent", "AI coding agent"], cat: "agents", icon: "terminal", entry: "harness", related: ["agentic-coding", "coding-assistant", "agents-md", "sandbox"],
      def: "An agent specialised in software work: it reads and edits code, runs commands and tests, and opens pull requests. Tests give it a clear signal of success, which is one reason coding was an early use for agents.",
      more: [
        "It works in a loop over a code repository: search and read files, edit them, run the build, tests and linters, read the failures and try again. Project instructions in a file such as [[agents-md]] tell it how the project works. Many run in an isolated copy of the repository, so a change can be reviewed as a diff or pull request before merging.",
        "Common failures are changes that pass the tests but miss the intent, edits beyond the requested scope, invented library functions and getting stuck repeating a failing fix. Weak tests let wrong code through, so the quality of the checks sets the quality of the result. Keep tasks small, review every diff, limit what commands it may run and keep credentials out of its environment."
      ] },
    { id: "react", term: "ReAct", aka: ["reason and act", "reasoning and acting"], cat: "agents", icon: "loop", entry: "agent-loop", related: ["agent-loop", "chain-of-thought", "reflection", "function-calling"],
      def: "Reason plus act: the 2022 research pattern of interleaving written reasoning with tool actions and observations. It is the template for today's agent loop.",
      more: [
        "In each cycle the model writes a short thought, names an action and its input, the harness runs the action, and the result is added as an observation. The model then reasons about it and chooses the next action, until it decides to give a final answer. The written thoughts help it plan, notice errors and keep track of what has been tried.",
        "Modern models have tool calling and reasoning built in, so the original text format is rarely used, but the loop is the same. Typical failures are repeating the same action, following a wrong early assumption, losing the goal as the history grows and never stopping. Put a cap on steps and cost in the harness, and log each thought, action and observation so you can debug a run."
      ] },
    { id: "autonomous-agent", term: "Autonomous agent", aka: ["fully autonomous agent", "level of autonomy"], cat: "agents", icon: "rocket", entry: "agent-loop", related: ["agent", "human-in-the-loop", "stop-condition", "long-horizon-task", "background"],
      def: "An agent that carries out a long task on its own, deciding steps and using tools with little or no human input along the way. Autonomy is a dial, not a switch: more of it saves effort and also raises the cost of a mistake, so it is paired with permissions and limits.",
      more: [
        "An autonomous agent runs the [[agent-loop]]: the model reads the state, picks a tool call, the harness runs it and feeds the result back, and this repeats until a stop rule fires. The degree of autonomy is set by what the harness allows without asking. Common controls are a tool allowlist, a step or cost budget, a time limit and approval gates for risky actions.",
        "Failures are usually quiet. An agent can drift from the goal, repeat a failing step, or act on a wrong assumption made many steps earlier. Each step has some chance of error, so the chance that a long run is fully correct falls fast. Practical designs add checkpoints, tests that give an objective signal, and logs a person can review afterwards."
      ] },
    { id: "planning", term: "Planning", aka: ["task decomposition", "plan-and-execute", "to-do list"], cat: "agents", icon: "calendar", entry: "agent-loop", related: ["long-horizon-task", "orchestrator", "reflection", "chain-of-thought"],
      def: "Having an agent write a plan, a list of steps or sub-goals, before acting, and revise it as results come in. Breaking a goal into checkable parts helps on long tasks. Some systems plan once up front; others re-plan after every step.",
      more: [
        "In practice a plan is text that the model writes and then reads back on later steps, often kept in a file or a to-do list so that it survives [[compaction]]. Each step can be marked pending, in progress or done. Writing the plan first forces the model to name sub-goals, and the list gives the harness something to check progress against.",
        "Plans go wrong in two ways. A plan made too early rests on guesses about the environment, and a model may then follow it after the facts have changed. A plan that is rewritten after every step can drift or never settle. Good agents keep steps small and checkable, and re-plan when a result contradicts an assumption."
      ] },
    { id: "reflection", term: "Reflection", aka: ["self-critique", "self-refine", "self-correction"], cat: "agents", icon: "eye", entry: "agent-loop", related: ["evaluator-optimizer", "chain-of-thought", "llm-as-judge", "react"],
      def: "Having a model review its own output or the result of an action, find faults and try again. It can catch simple mistakes, but without an outside check such as a test it can also talk itself into a wrong answer.",
      more: [
        "Reflection is usually one extra model call. The model receives the task, its draft or the tool output, and a prompt asking it to find errors and say what to change. The critique is added to the context and the model tries again. The same model can play both parts, or a second model or a different prompt can act as the critic.",
        "The gain depends on the quality of the signal. A critique grounded in a failing test, a compiler error or a checked source is reliable. A critique that is only the model's opinion of its own work often misses its own blind spots, or changes a correct answer. Set a limit on the number of rounds, since each one costs tokens and time."
      ] },
    { id: "self-consistency", term: "Self-consistency", aka: ["majority voting", "voting", "best-of-n"], cat: "agents", icon: "dice", entry: "reasoning", related: ["chain-of-thought", "temperature", "test-time-compute", "pass-at-k"],
      def: "Asking a model the same question several times with some randomness, then taking the answer that most attempts agree on. It improves accuracy on reasoning problems, at several times the compute.",
      more: [
        "The method samples several independent reasoning paths at a non-zero [[temperature]], extracts the final answer from each and takes the most common one. The idea is that wrong paths tend to disagree with each other, while correct paths tend to land on the same result. It needs answers that can be compared, such as a number, a label or a short choice.",
        "It does not suit open-ended output such as long prose or code, where no two answers match exactly, unless a judge step groups them. Cost grows in direct proportion to the number of samples, and the samples can run in parallel, so latency need not rise. If the model has a systematic error, every sample shares it and the vote does not help."
      ] },
    { id: "tree-of-thought", term: "Tree of thoughts", aka: ["ToT", "tree search"], cat: "agents", icon: "tree", entry: "reasoning", related: ["chain-of-thought", "planning", "test-time-compute", "self-consistency"],
      def: "A reasoning method in which a model explores several possible next steps, scores or prunes them and backtracks, like searching a tree, instead of following a single chain of thought. It helps on puzzles and planning problems and costs many more model calls.",
      more: [
        "The search has three parts. A generator proposes several candidate next steps, an evaluator scores each partial solution (by a model prompt or a rule), and a search routine such as breadth-first or depth-first decides which branches to extend and which to drop. This lets the system back up from a dead end, which a single chain of thought cannot do.",
        "The cost is the main limit. Every branch is at least one model call, so a modest tree can need dozens or hundreds of calls. The scoring step is also a weak point, since a model can rate a wrong partial answer highly. Today it is mostly used for puzzles and search problems, while [[reasoning-model|reasoning models]] often cover the same ground inside one long answer."
      ] },
    { id: "stop-condition", term: "Stop condition", aka: ["termination condition", "max steps", "exit criteria"], cat: "agents", icon: "hand", entry: "agent-loop", related: ["agent-loop", "token-budget", "autonomous-agent", "checkpoint"],
      def: "The rule that ends an agent loop: the model says it is done, a goal check passes, or a limit on steps, time or budget is reached. Without a firm limit an agent can loop for ever, so harnesses always add one.",
      more: [
        "There are usually several conditions at once, and the first to fire ends the run. The model may emit a final answer with no further tool call. The harness may enforce a maximum number of turns, a wall-clock time limit, a token or money budget, or a repeat detector that notices the same call and result appearing again. A goal check, such as a passing test suite, is the strongest signal.",
        "Relying on the model to say it is finished is risky, because it may stop early and report success on unfinished work, or never stop. Hard limits should end the run in a clean state and report why, so that a person can tell a finished run from a cut-off one. Set the limits from observed runs, not guesses."
      ] },
    { id: "checkpoint", term: "Checkpoint", aka: ["snapshot", "rewind", "rollback"], cat: "agents", icon: "flag", entry: "harness", related: ["durable-execution", "long-horizon-task", "audit-log", "coding-agent"],
      def: "A saved snapshot of an agent's state, such as the conversation and the changes made to files, so that a run can resume after a failure or be rolled back to an earlier point. It makes long runs recoverable and mistakes reversible.",
      more: [
        "A checkpoint can hold the message history, the plan, tool state and the files the agent changed. File changes are often captured with version control or a copy of the working directory. Saving can happen before each risky step, after each turn, or on a timer. Restoring means loading the saved state and continuing from that point, possibly with a different instruction.",
        "The limit is that only state the harness controls can be rolled back. Files can be restored, but an email already sent, a payment made or a record changed in an outside service cannot. Checkpoints also take storage, and a very large state can be slow to save. Combine them with approval gates for actions that have effects outside the sandbox."
      ] },
    { id: "turn", term: "Turn", aka: ["conversation turn", "step"], cat: "agents", icon: "bubble", entry: "agent-loop", related: ["agent-loop", "stop-condition", "context", "trajectory"],
      def: "One round of a conversation: a message from the person and the model's reply. In an agent a single turn may contain several model calls and tool calls before the reply is complete, and limits are often set in turns.",
      more: [
        "The word is used in two senses, and limits depend on which one a harness means. In the chat sense a turn is one user message and one reply. In the API sense each model call is a turn, so one user request can span many turns while the agent calls tools. Check the definition before setting a maximum, or a limit meant to be generous may stop a run too early.",
        "Every turn adds to the context: the model's output, the tool call and its result. Because the whole history is usually sent again on each call, long runs grow in cost faster than in turn count, and old turns may need [[compaction]]. Counting turns is a cheap proxy for effort, and a sudden rise in turns per task is a useful warning sign."
      ] },
    { id: "trajectory", term: "Trajectory", aka: ["agent run", "transcript", "episode"], cat: "agents", icon: "graph", entry: "evals", related: ["trace", "golden-set", "reinforcement-learning", "observability"],
      def: "The full record of an agent run: every message, model call, tool call and result in order. Trajectories are what you read to debug an agent, grade with evals and, in training, use as examples to learn from.",
      more: [
        "A useful trajectory is complete and structured. It stores each model input and output, the tool name and arguments, the raw result, timings, token counts and errors, usually in a trace format that tools can search. Reading a trajectory shows where a run went wrong: a bad tool choice, a misread result, a missed instruction or a loop.",
        "Trajectories are the unit of analysis for [[evals]]. Graders can score the final result, but also the path: did the agent use the right tool, avoid forbidden actions, stay within budget. The same records can be filtered into training data, for example by keeping runs that passed a test. Treat them as sensitive, since they can contain private data and [[secrets]] from tool results."
      ] },
    { id: "scaffold", term: "Scaffold", aka: ["scaffolding", "agent scaffold"], cat: "agents", icon: "ladder", entry: "harness", related: ["harness", "agent-sdk", "benchmark", "agent-loop"],
      def: "The code around a model that turns it into an agent: the loop, the tools, the prompts and the handling of memory. Benchmark scores depend on the scaffold as well as the model, so one model can score very differently in different scaffolds. Harness is the common name for the same thing.",
      more: [
        "A scaffold decides what the model sees and what it can do. It builds the system prompt, defines the tool set, parses tool calls, runs them, trims or summarises old context and applies stop rules. Two scaffolds around the same model can differ in tool design, retry behaviour and how errors are shown, and these details often matter as much as the model's raw ability.",
        "For this reason, results should be compared with the scaffold held fixed, or reported together with it. Changing the scaffold is often the cheapest way to improve an agent, for example by returning clearer error messages or by giving a tool a narrower interface. A scaffold built around one model's habits may work worse after the model is swapped."
      ] },
    { id: "long-horizon-task", term: "Long-horizon task", aka: ["long-running task", "multi-hour task"], cat: "agents", icon: "hourglass", entry: "background", related: ["planning", "checkpoint", "compaction", "durable-execution", "autonomous-agent"],
      def: "A task that takes many steps, often hours of work, with later steps depending on earlier ones. Small errors compound over such a task, so it needs planning, memory, checkpoints and regular checks, and it is where agents most often fail.",
      more: [
        "The core problem is compounding. If each step succeeds with a probability slightly below one, the chance of getting through hundreds of steps falls steeply. Context also fills with old output, so the model may forget early constraints, repeat work or lose the goal. Many such tasks outlast a single context window and must carry state between windows.",
        "Common remedies are a written plan and progress file, checkpoints, regular tests that give an objective signal, and [[compaction]] or [[long-term-memory]] to carry what matters across windows. Splitting the work into parts for sub-agents helps when parts are independent. Review points matter too, since a run that has quietly gone wrong for hours is expensive to untangle."
      ] },

    /* ---- Knowledge and memory ---- */
    { id: "agentic-rag", term: "Agentic RAG", aka: ["agentic retrieval"], cat: "knowledge", icon: "search", entry: "knowledge", related: ["rag", "agentic-search", "reranking", "tool-search", "knowledge-graph"],
      def: "Retrieval used as a tool inside the agent loop, so the agent decides when and what to retrieve and can refine its queries. It handles questions that one search cannot answer, at the price of extra model calls.",
      more: [
        "In plain [[rag]] the system retrieves once, using the user's question, and passes the results to the model. In the agentic form, retrieval is a tool. The model can rewrite the question, search several sources, read what came back, notice that it is not enough and search again with new terms. It can also decide that no retrieval is needed at all.",
        "The trade-offs are cost, latency and predictability. Each search adds a model call, and the number of rounds varies from question to question. An agent can also stop too early with thin evidence, or keep searching without gain, so set a cap on rounds. The approach pays off for multi-part questions and comparisons, and is wasteful for simple lookups that one search would answer."
      ] },
    { id: "agentic-search", term: "Agentic search", aka: ["grep-style search", "search by tools"], cat: "knowledge", icon: "folder", entry: "knowledge", related: ["agentic-rag", "semantic-search", "coding-agent", "deep-research"],
      def: "Finding information with ordinary tools (list files, grep, read, web search) step by step, instead of a pre-built index. It needs no indexing and always sees the current state, but it uses more steps.",
      more: [
        "The agent uses the same tools a developer would: listing directories, matching names, searching text with patterns, reading files in part, or querying the web. It narrows down step by step, reading results and choosing the next query. Nothing is built in advance, so there is no index to keep fresh, no [[chunking]] choice to tune and no embedding model to run.",
        "The weak points are speed and coverage. Many steps cost time and tokens, and a poorly chosen query can miss the relevant file, particularly when the vocabulary in the code or text differs from the words the agent guesses. It works best on structured material such as source code, where names and paths carry meaning. Very large or unstructured collections often still need an index, so the two approaches are often combined."
      ] },
    { id: "compaction", term: "Compaction", aka: ["context compression", "summarisation", "context compaction"], cat: "knowledge", icon: "squeeze", entry: "memory", related: ["context-rot", "long-term-memory", "context-engineering", "long-horizon-task"],
      def: "Summarising older parts of a conversation so that a long run keeps fitting into the context window. The summary keeps decisions and open items and drops detail, so what is lost is a trade-off to design for.",
      more: [
        "A harness triggers compaction when the context nears its limit, or when the agent or user requests it. A model call writes a summary of the older turns, and that summary replaces them while recent turns stay word for word. Good summaries keep the goal, decisions made, constraints, file names, open questions and the next step.",
        "The risk is silent loss. A detail that seemed minor, such as an exact error message or a rule the user stated early, may be dropped, and the agent will not know it is gone. Repeated compaction compounds this, since later summaries are written from earlier summaries. Keep important facts in files or [[long-term-memory]] where they can be reloaded exactly."
      ] },
    { id: "embedding", term: "Embedding", aka: ["vector embedding", "text embedding"], cat: "knowledge", icon: "target", entry: "knowledge", related: ["vector-database", "semantic-search", "chunking", "rag"],
      def: "A vector of numbers that represents the meaning of a piece of text, an image or code, placed so that similar meanings lie close together. It lets software compare meaning by measuring distance.",
      more: [
        "An embedding model reads a piece of text and returns a fixed-length list of numbers, often hundreds or thousands long. Texts with similar meaning get vectors that point in similar directions, and closeness is measured with cosine similarity or a dot product. The vector is a learned summary, so it cannot be turned back into the exact words.",
        "Quality depends on the model chosen and on the text embedded. Vectors from different models are not comparable, so changing the model means re-embedding everything. Long passages blur several topics into one vector, which is why text is split by [[chunking]] first. Embeddings capture topic well but can miss exact identifiers, negation and numbers, which is a reason to pair them with keyword search."
      ] },
    { id: "playbook", term: "Playbook", aka: ["runbook", "procedure"], cat: "knowledge", icon: "checklist", entry: "skills", related: ["skills", "instructions", "slash-command"],
      def: "A written, reusable procedure for a recurring task, with steps, checks and a definition of done. Packaged as a skill, an agent can load it only when the task calls for it.",
      more: [
        "A good playbook states when it applies, the inputs it needs, the steps in order, the checks after each step and what counts as done. It is plain text, stored as a file in the project or as a [[skills|skill]], and loaded into context only when the task matches its description. This keeps the always-present context small.",
        "Playbooks fail when they are vague, too long or out of date. An agent follows written steps closely, so a step that no longer matches the real system causes confident errors. Include the commands to run and the signs of success. Review playbooks like code, and test them by letting an agent follow one on a real task and noting where it stalls."
      ] },
    { id: "rag", term: "RAG (retrieval-augmented generation)", aka: ["RAG", "retrieval augmented generation", "retrieval"], cat: "knowledge", icon: "books", entry: "knowledge", related: ["embedding", "vector-database", "chunking", "reranking", "grounding"],
      def: "Retrieving relevant passages from a knowledge base and adding them to the prompt before the model answers. It gives the model current or private facts without retraining, and lets answers point to their sources.",
      more: [
        "A typical pipeline splits documents into chunks, stores their embeddings in a vector database, embeds the question at request time, fetches the nearest chunks, optionally reranks them, and puts the best few into the context.",
        "Quality depends mostly on retrieval: chunk size, hybrid search, reranking and good metadata. When the wrong passage is retrieved, a fluent answer can still be wrong, so evaluate retrieval separately from generation."
      ] },
    { id: "vector-database", term: "Vector database", aka: ["vector store", "vector index"], cat: "knowledge", icon: "db", entry: "knowledge", related: ["embedding", "semantic-search", "hybrid-search", "rag"],
      def: "A database built to store embeddings and quickly find those nearest to a query embedding. It is the usual store behind semantic search and [[rag]], and many also add metadata filters and keyword search.",
      more: [
        "A vector database stores each embedding with an id and metadata, and answers nearest-neighbour queries. Exact search compares the query with every vector, which is slow at scale. Most systems use approximate indexes, such as graph-based or cluster-based ones, that check only a small part of the data. This trades a little recall for much lower latency.",
        "In practice, retrieval quality depends less on the database than on the embedding model, the [[chunking]] and the filters. Metadata filters, for example by tenant, date or document type, are essential for access control and relevance. The index must be updated when sources change, or answers go stale. Some teams use a vector extension of an ordinary database to avoid running a separate system."
      ] },
    { id: "chunking", term: "Chunking", aka: ["document splitting", "text splitting"], cat: "knowledge", icon: "bars", entry: "knowledge", related: ["embedding", "rag", "vector-database", "reranking"],
      def: "Splitting documents into smaller pieces, called chunks, before embedding and indexing them. Chunks must be small enough to be specific and large enough to make sense alone; common choices split by heading or paragraph, often with some overlap.",
      more: [
        "Chunk size is a trade-off. Small chunks give precise matches but lose the surrounding context, so a pronoun or a table row may mean nothing alone. Large chunks keep context but blur topics and use more of the context window when retrieved. Splitting at natural boundaries, such as headings, paragraphs or functions, usually beats cutting at a fixed character count.",
        "Overlap between neighbouring chunks, a title added to each chunk, or storing the parent section beside the chunk can repair lost context. Tables, code and lists need special handling so they are not cut in the middle. Chunking is a common hidden cause of poor [[rag]]: if the answer is split across two chunks and only one is retrieved, the model cannot see it."
      ] },
    { id: "reranking", term: "Reranking", aka: ["reranker", "cross-encoder"], cat: "knowledge", icon: "ladder", entry: "knowledge", related: ["hybrid-search", "rag", "semantic-search"],
      def: "A second step in retrieval: a model scores the top results of a fast first search against the query and reorders them, so that the best few reach the context. It is slower than the first search and noticeably improves relevance.",
      more: [
        "The first search is built for speed. It compares a query vector, or keywords, with millions of items and returns perhaps fifty or a hundred candidates. A reranker, often a cross-encoder model, then reads the query and each candidate together and gives a relevance score. Because it sees both texts at once, it judges fit more accurately than a comparison of two separate vectors.",
        "The cost is extra latency and compute for every query, which grows with the number of candidates scored. Choose that number by measuring: too few and the right result may never reach the reranker, too many and delay rises. A reranker cannot recover a document the first search missed, so check recall at the first stage too."
      ] },
    { id: "hybrid-search", term: "Hybrid search", aka: ["keyword plus vector search", "BM25"], cat: "knowledge", icon: "merge", entry: "knowledge", related: ["semantic-search", "reranking", "vector-database", "rag"],
      def: "Combining keyword search, which finds exact words and names, with semantic search, which finds similar meaning, and merging the two result lists. Each catches what the other misses, so hybrid search usually beats either alone.",
      more: [
        "The two searches run side by side and produce separate ranked lists. These are merged, commonly with reciprocal rank fusion, which scores each item by its position in each list and so avoids comparing raw scores that are on different scales. A weighted sum of normalised scores is another option. A [[reranking|reranker]] is often added afterwards to order the merged set.",
        "Hybrid search matters most for queries that mix meaning and exact terms, such as product codes, error messages, names and abbreviations, which embeddings handle poorly. The cost is two indexes to build and keep in step. Tune the balance on real queries, since the best mix differs between collections of code, legal text and support pages."
      ] },
    { id: "knowledge-graph", term: "Knowledge graph", aka: ["GraphRAG", "graph retrieval"], cat: "knowledge", icon: "net", entry: "knowledge", related: ["rag", "semantic-search", "embedding", "agentic-rag"],
      def: "A store of facts as entities and the relationships between them, such as a person who works at a company. Queries can follow links across several steps, and GraphRAG uses such a graph, often built by a model from text, to retrieve connected facts and not only similar passages.",
      more: [
        "Facts are stored as triples: a subject, a relationship and an object. Queries can follow several links, for example from a customer to an order to a product to a supplier, and return exact answers that similarity search would struggle to assemble. The graph can be written by hand, drawn from existing databases, or extracted from text by a model.",
        "Building and maintaining the graph is the hard part. Model extraction can invent links or merge two different entities into one, so errors enter the store as if they were facts. A schema, validation and source references for each fact reduce this. A graph pays off when relationships are the point; for simple question answering over documents, plain [[rag]] is often enough."
      ] },
    { id: "grounding", term: "Grounding", aka: ["grounded generation", "source-based answers"], cat: "knowledge", icon: "ruler", entry: "knowledge", related: ["hallucination", "citation", "rag", "agentic-search"],
      def: "Tying a model's answer to supplied sources, such as retrieved passages, tool results or search hits, rather than to its memory alone. A grounded answer can be checked against what was supplied, and grounding is a main defence against hallucination.",
      more: [
        "In a grounded system the prompt includes the source material, and the instruction tells the model to answer from it and to say so when the answer is not there. Sources can come from [[rag]], from a tool result, or from a document the user attached. Showing which passage supports each claim, as a [[citation]], lets a reader check it.",
        "Grounding reduces errors but does not remove them. A model can still ignore the source, mix it with memory, or misread it. Retrieval itself may bring back the wrong passage, and then the model grounds its answer in the wrong text. Measure faithfulness to the sources separately from general quality, and test what happens when the sources hold no answer."
      ] },
    { id: "citation", term: "Citation", aka: ["source attribution", "references"], cat: "knowledge", icon: "link", entry: "knowledge", related: ["grounding", "deep-research", "ai-search", "hallucination"],
      def: "A reference that points from a claim in an answer to the source it came from, such as a link, a page or a passage. Citations let a reader verify the answer, but they must be checked: a model can cite a source that does not support the claim.",
      more: [
        "There are two ways to produce citations. In one, the model is given numbered sources and asked to name the numbers it used. In the other, the system finds the supporting passage after the answer is written. Either way, the link points at a stored source with an id, so that the page or passage can be shown to the reader.",
        "The common failure is a citation that looks right but does not support the claim, or a link to a source that was never retrieved. Check that each cited id was in the supplied set, and where it matters, check that the passage entails the claim, by a second model or by a person. A citation shows where to look; it does not prove the claim is true."
      ] },
    { id: "long-term-memory", term: "Long-term memory", aka: ["persistent memory", "agent memory", "memory store"], cat: "knowledge", icon: "folder", entry: "memory", related: ["short-term-memory", "scratchpad", "compaction", "vector-database"],
      def: "Information an agent keeps across sessions, stored outside the context window in files, notes or a database and loaded back when relevant. It lets an assistant remember preferences and past work, and it needs rules for what to save, update and forget.",
      more: [
        "Most designs use one of three forms. Plain files such as notes or an instructions file are loaded at the start of each session. A structured store holds facts with fields, such as a preference and its date. A retrieval index stores past conversations or notes and returns the most relevant on demand. The agent writes to memory during work, or a separate step extracts what to keep afterwards.",
        "Memory raises hard questions. Stored items can become wrong, contradict each other or pile up until retrieval is noisy, so entries need dates, sources and a way to update or delete them. Memory can also carry private data across users, or hold an injected instruction that persists. Keep it scoped per user, inspectable and editable by the person it concerns."
      ] },
    { id: "short-term-memory", term: "Short-term memory", aka: ["working memory", "session memory"], cat: "knowledge", icon: "window", entry: "memory", related: ["long-term-memory", "context", "compaction", "scratchpad"],
      def: "What an agent holds during a single session: the current context window with the conversation so far, tool results and any working notes. It is lost when the session ends unless something is saved to [[long-term-memory]].",
      more: [
        "Short-term memory is the context window, so it is limited by its size and by cost, since every token in it is processed on each call. It holds the system prompt, the conversation, tool definitions and tool results. The model reads all of it at once through [[attention]], but long contexts can be handled less well in the middle, a problem known as [[lost-in-the-middle]].",
        "When the window fills, the harness must act: drop old turns, shorten large tool results, or apply [[compaction]]. What is cut is gone from the model's view. Because the window starts empty in a new session, anything that must survive, such as a decision or a preference, has to be saved outside it on purpose."
      ] },
    { id: "scratchpad", term: "Scratchpad", aka: ["working notes", "notes file", "to-do file"], cat: "knowledge", icon: "note", entry: "memory", related: ["short-term-memory", "planning", "chain-of-thought", "long-term-memory"],
      def: "A place where a model writes intermediate notes, calculations or plans while it works, before the final answer. It can be the model's own reasoning text or a file the agent keeps updating; either way it holds working information apart from the final output.",
      more: [
        "A scratchpad can take two forms. In the first the model writes reasoning text before its answer, which is the basis of [[chain-of-thought]]. In the second, the agent has a file or note tool and keeps a running record there: a plan, a list of findings, intermediate results. A file scratchpad outlives context trimming and can be reread when needed.",
        "The benefit is that writing a step down makes it available to later steps instead of depending on the model holding it silently. The risks are clutter and staleness. A scratchpad that grows without limit costs tokens, and old notes that are no longer true can mislead the agent. Keep the structure simple, and prune or rewrite it as the task changes."
      ] },
    { id: "semantic-search", term: "Semantic search", aka: ["vector search", "similarity search", "embedding search"], cat: "knowledge", icon: "search", entry: "knowledge", related: ["embedding", "vector-database", "hybrid-search", "rag"],
      def: "Searching by meaning instead of exact words: the query and the documents are turned into embeddings and the closest ones are returned. A search for 'car repair' can find a page about 'fixing a vehicle', but it can miss exact names and codes, which keyword search handles well.",
      more: [
        "The pipeline has two stages. At index time each document or chunk is turned into an [[embedding]] and stored, usually in a [[vector-database]]. At query time the question is embedded by the same model, and the nearest stored vectors are returned. Because the comparison is by meaning, it handles synonyms and paraphrase well, and can work across languages with a suitable model.",
        "Its weaknesses are exact matching and explanation. Part numbers, rare names, version strings and negations are often not captured well, and the system cannot say why a result matched. Results are always returned, even when nothing relevant exists, so apply a similarity threshold or a reranker. Pairing it with keyword search, as in [[hybrid-search]], covers most gaps."
      ] },
    { id: "knowledge-cutoff", term: "Knowledge cutoff", aka: ["training cutoff", "cut-off date"], cat: "knowledge", icon: "calendar", entry: "model", related: ["pre-training", "hallucination", "rag", "agentic-search"],
      def: "The date after which a model has seen no training data, so it knows nothing about later events unless they are given in the context or fetched by search. Models are usually released months after their cutoff, and used for a long time after that.",
      more: [
        "A model cannot reliably know what happened after its cutoff, and it often cannot state its own cutoff accurately, since the last months before it are thinly covered in the training data. When asked about recent events it may answer from older information, or invent a plausible reply. This is a common source of [[hallucination]] about new libraries, prices, laws and product versions.",
        "The standard fix is to supply current facts at request time. Put the current date in the system prompt, and give the agent search, documentation or [[rag]] tools. For code, point the agent at the installed version's own documentation, since it may otherwise write for an older interface. Do not use fine-tuning to add fast-changing facts."
      ] },

    /* ---- Safety and control ---- */
    { id: "guardrails", term: "Guardrails", aka: ["safety filters", "input and output checks"], cat: "safety", icon: "shield", entry: "hooks", related: ["hooks", "least-privilege", "jailbreak", "structured-output"],
      def: "Checks around a model or agent that block or correct unsafe, off-topic or malformed inputs and outputs. They can be rules, classifiers or other models, and work best as one layer among several, not as the only defence.",
      more: [
        "Guardrails can sit at several points: on the input before the model sees it, on the output before the user does, and on tool calls before they run. Methods include pattern rules, allowlists, schema validation, specialised classifiers and a second model acting as judge. Rules are fast and predictable but rigid; classifiers and models are flexible but can be wrong and can add delay and cost.",
        "No guardrail is complete, and attackers probe for gaps, so treat each as one layer. Rules enforced in code, such as [[least-privilege]] access and a [[sandbox]], hold even when the model is fooled, while a prompt that says be careful does not. Tune for both kinds of error: too lax lets harm through, too strict blocks legitimate work and teaches people to work around the check."
      ] },
    { id: "human-in-the-loop", term: "Human-in-the-loop", aka: ["HITL", "human oversight", "approval step"], cat: "safety", icon: "hand", entry: "permissions", related: ["approval-fatigue", "permission-mode", "autonomous-agent", "handoff"],
      def: "Explicit points where a person approves, corrects or takes over an agent's work. Human oversight is most valuable at actions that are costly or hard to undo, and least valuable when approvals are so frequent that nobody reads them.",
      more: [
        "The harness pauses at defined points and waits for a person: before running a command, sending a message, spending money or changing data. The person sees what the agent plans to do and can approve, edit or refuse. Approval can be given once, for a class of actions, or for the rest of a session, which trades control for speed.",
        "The design question is where to put the pauses. Gating everything wears people out and invites rubber-stamping, as in [[approval-fatigue]]. Gating nothing leaves the person to find mistakes afterwards. Place checks before irreversible or external actions, show the real action and not a summary of it, and make the safe path the default. Log each decision in an [[audit-log]]."
      ] },
    { id: "lethal-trifecta", term: "Lethal trifecta", aka: ["three risky capabilities"], cat: "safety", icon: "warning", entry: "security", related: ["indirect-prompt-injection", "data-exfiltration", "egress-filtering", "least-privilege"],
      def: "A name for the dangerous combination of three things in one agent: access to private data, exposure to untrusted content and a way to communicate outside. With all three, a hidden instruction can steal the data. Removing any one of them breaks the attack.",
      more: [
        "Each leg alone is manageable. An agent with private data but no untrusted input has nothing hostile to read. One with untrusted input but no sensitive data has little to steal. One with no outward channel cannot send anything. With all three, [[indirect-prompt-injection]] in a page or email can tell the agent to read the data and send it out, and the model cannot reliably tell the instruction from legitimate content.",
        "The reliable defence is architectural: remove at least one leg for a given task. That can mean read-only access to private data, tools that cannot make outbound requests ([[egress-filtering]]), or separating the agent that reads untrusted pages from the one that holds the data. Filtering the model's text is not enough, since an attacker needs only one phrasing that gets through."
      ] },
    { id: "permission-mode", term: "Permission mode", aka: ["approval mode", "autonomy setting"], cat: "safety", icon: "key", entry: "permissions", related: ["permissions", "human-in-the-loop", "approval-fatigue", "mcp-host"],
      def: "A harness setting that decides which actions an agent may take without asking first. Typical modes range from asking before every change to running freely inside a sandbox.",
      more: [
        "A mode is a policy that the harness applies to each tool call before it runs. A strict mode asks for approval for every write, command or network request. A middle mode allows reads and edits in the project but asks for other actions. A permissive mode runs everything without asking. Allow and deny lists refine the mode, for example permitting one named command but blocking others.",
        "Enforcement should be in the harness, not in the prompt, since a model can be talked out of an instruction but cannot override code that denies the call. Permissive modes are only reasonable inside a [[sandbox]] with limited files, network and [[secrets]]. Choose the mode per task, and review settings that were loosened to get past a one-off prompt and then left in place."
      ] },
    { id: "prompt-injection", term: "Prompt injection", aka: ["instruction injection"], cat: "safety", icon: "bug", entry: "security", related: ["indirect-prompt-injection", "jailbreak", "lethal-trifecta", "guardrails"],
      def: "An attack in which text the model processes overrides its intended instructions. Models cannot reliably tell instructions from data in their context, so no filter removes the risk completely; the strongest defence is to limit what a fooled agent can do.",
      more: [
        "Direct injection comes from the person typing to the model. [[indirect-prompt-injection]] hides the instructions in content the agent fetches, such as a page, a message or a tool result, and is the larger risk for agents.",
        "Defences work in layers: treat all fetched content as untrusted, give the agent [[least-privilege]] access, filter outbound traffic with [[egress-filtering]], and ask a person before irreversible actions."
      ] },
    { id: "jailbreak", term: "Jailbreak", aka: ["safety bypass", "DAN prompt"], cat: "safety", icon: "lock", entry: "security", related: ["prompt-injection", "red-teaming", "alignment", "guardrails"],
      def: "A prompt crafted to make a model ignore its safety training or rules and produce content it would normally refuse. Providers patch known jailbreaks but new ones keep appearing, so refusals are not a reliable security control.",
      more: [
        "Common techniques include role-play framings, hypothetical scenarios, asking the model to continue a harmful text, encoding the request in another language or format, splitting a request across steps, and long examples that shift the model's pattern. Some are found by hand; others are generated by automated search against a model. A jailbreak targets the model's own safety behaviour, whereas [[prompt-injection]] targets an application.",
        "Providers train against known attacks and add classifier checks, but this is a continuing contest, and a fixed defence tends to be bypassed eventually. For builders, the practical point is to keep real security outside the model. Do not rely on a refusal to protect data or actions; limit permissions so that a model that has been talked into something harmful still cannot do much."
      ] },
    { id: "red-teaming", term: "Red teaming", aka: ["adversarial testing", "attack testing"], cat: "safety", icon: "target", entry: "security", related: ["jailbreak", "prompt-injection", "evals", "alignment"],
      def: "Deliberately attacking a model or agent to find failures before real attackers do: eliciting harmful output, tricking it into misusing tools, extracting private information. It is done by people, by automated attack models, or both, and its findings feed fixes and evals.",
      more: [
        "A red-team exercise starts with a threat model: what the system can do, what an attacker wants and what must never happen. Testers then try prompt injection, [[jailbreak|jailbreaks]], tool misuse, data leaks and abuse of permissions, both by hand and with automated attack generators. Results are written up with the exact inputs, so that each failure can be reproduced.",
        "The value comes from what happens next. Findings should become fixes and also regression tests in the [[evals]] suite, so a repaired weakness stays repaired after model or prompt changes. A red team finds problems; it cannot prove their absence, and a clean report only covers the attacks that were tried. Repeat it when the model, tools or permissions change."
      ] },
    { id: "data-exfiltration", term: "Data exfiltration", aka: ["data leakage", "data theft"], cat: "safety", icon: "funnel", entry: "security", related: ["lethal-trifecta", "egress-filtering", "indirect-prompt-injection", "secrets"],
      def: "Getting private information out of a system to a place the owner did not intend. With agents it usually means a hidden instruction makes the agent send secrets out through a request, a link, an image or a message.",
      more: [
        "For agents, the usual route is a tool call or a rendered output that carries data to an outside address. The agent might fetch a URL with the secret in its query string, write to a public place, send an email, or output a markdown image whose link includes the data, which a client then loads automatically. Often the instruction behind it comes from [[indirect-prompt-injection]].",
        "Defences work at the channel. Block or allowlist outbound destinations ([[egress-filtering]]), do not render remote images or links automatically from untrusted output, and keep secrets out of the agent's reach. Review what leaves the system in an [[audit-log]]. Detection after the fact is weak, because once data has left it cannot be recalled, so prevention at the exit point is worth more."
      ] },
    { id: "confused-deputy", term: "Confused deputy", aka: ["privilege escalation by proxy"], cat: "safety", icon: "scales", entry: "security", related: ["least-privilege", "indirect-prompt-injection", "permissions", "oauth"],
      def: "A security flaw in which a program with legitimate authority is tricked by a less privileged party into using that authority on its behalf. An agent holding a person's credentials and steered by a malicious page or message is a classic case.",
      more: [
        "The name comes from a classic case: a service had authority to write to certain files, and a user tricked it into writing where the user themselves had no right. The service, the deputy, used its own authority because it could not tell whose request it was serving. The flaw lies in mixing the authority of the caller with that of the program.",
        "An agent is a natural deputy. It holds tokens and tool access, and it reads text from many sources with no firm boundary between data and instruction. The remedy is to limit what the deputy can do ([[least-privilege]]), to act with the end user's own scoped rights instead of a broad shared account, and to confirm sensitive actions with a person. Checks must be made in code at the tool, not by the model."
      ] },
    { id: "least-privilege", term: "Least privilege", aka: ["minimal access", "principle of least privilege"], cat: "safety", icon: "key", entry: "permissions", related: ["permissions", "secrets", "sandbox", "confused-deputy"],
      def: "The rule that something gets only the access it needs for its task, and only for as long as it needs it. For agents that means narrow tool lists, read-only access where possible and short-lived credentials, so a mistake or an attack can do limited harm.",
      more: [
        "To apply it, list what the task needs and grant only that. Give a read-only token when the agent only reads, restrict file access to one directory, expose only the tools the task uses, and allow network access only to named hosts. Use credentials that expire and can be revoked, and separate identities for separate agents so that actions can be traced.",
        "The usual error is convenience: one broad key shared by every agent, or a tool that accepts any command because narrowing it takes work. Narrow tools are better than broad ones guarded by a prompt. Re-check permissions as the task changes, since access added for a one-off need tends to remain. Limiting access does not stop an attack, but it limits what a successful attack can reach."
      ] },
    { id: "egress-filtering", term: "Egress filtering", aka: ["outbound allowlist", "network allowlist", "domain allowlist"], cat: "safety", icon: "shield", entry: "sandbox", related: ["sandbox", "data-exfiltration", "lethal-trifecta", "container"],
      def: "Controlling which destinations a system may send traffic to, usually with an allowlist of approved domains. For an agent in a sandbox it closes the main route for stolen information to leave, even when the agent has been tricked.",
      more: [
        "The filter sits at the network edge of the sandbox, in a proxy or firewall, and checks each outbound connection against a list of allowed domains and ports. Everything else is refused. A typical allowlist covers the package registry, the model API and the services the task needs. Filtering by domain name is more precise than by address, since many sites share addresses.",
        "Gaps remain. An allowed domain can itself be a way out if it lets anyone upload data, such as a public paste service or a shared storage bucket, so allow narrowly. Encoded traffic over DNS can slip past filters that watch only web requests. Log every blocked attempt: a blocked request from an agent is a strong signal that something tried to send data out."
      ] },
    { id: "tool-poisoning", term: "Tool poisoning", aka: ["malicious tool description", "tool description attack"], cat: "safety", icon: "bug", entry: "mcp", related: ["mcp-server", "tool-schema", "indirect-prompt-injection", "plugin"],
      def: "An attack that hides malicious instructions in a tool's description or metadata, which the model reads but the person may never see. A tool from an untrusted source can steer the agent to leak data or misuse other tools.",
      more: [
        "A tool is described to the model by a name, a description and a parameter schema, and the model treats these as trusted guidance. A poisoned description can add hidden text such as an instruction to read a private file and pass its contents as an argument. Related variants change a tool's description after approval (sometimes called a rug pull), or give a tool a name that shadows a trusted one.",
        "Because the person often sees only a short label, the attack is hard to notice. Defences include using tool servers from sources you trust, pinning versions and reviewing the full descriptions when they change, showing the real arguments before a sensitive call, and keeping each server's access separate. Treat tool metadata as untrusted input, like any content from outside."
      ] },
    { id: "indirect-prompt-injection", term: "Indirect prompt injection", aka: ["injection through content", "cross-prompt injection"], cat: "safety", icon: "eye", entry: "security", related: ["prompt-injection", "lethal-trifecta", "browser-agent", "confused-deputy"],
      def: "Prompt injection where the malicious instruction does not come from the person but is hidden in content the agent reads: a web page, an email, a document or a tool result. It is the main practical risk of agents that read untrusted content.",
      more: [
        "The attack works because a model receives instructions and data in the same stream of text and has no reliable way to keep them apart. A page can include hidden text, a document can carry white-on-white lines, and a tool result can contain a command. When the agent reads it, the model may follow it as though the user had asked.",
        "Filters and warnings in the prompt reduce the rate but do not close the hole, so design as if some injections will succeed. Limit what the agent can do after reading untrusted material, keep private data and outward channels apart (see [[lethal-trifecta]]), require approval for sensitive actions, and run the work in a [[sandbox]]. Test with realistic poisoned content during [[red-teaming]]."
      ] },
    { id: "approval-fatigue", term: "Approval fatigue", aka: ["consent fatigue", "click-through", "permission prompt fatigue"], cat: "safety", icon: "bell", entry: "permissions", related: ["human-in-the-loop", "permission-mode", "sandbox", "least-privilege"],
      def: "The habit of clicking approve without reading when an agent asks for permission too often. Constant prompts teach people to say yes, which defeats the check. Better designs ask rarely, for risky actions, and make safe actions automatic inside a [[sandbox]].",
      more: [
        "The effect is easy to see in logs: approval rates near one hundred per cent and decisions made within a second or two. At that point the check gives a false sense of safety, because the one dangerous request is approved along with the hundred harmless ones. It grows when prompts are frequent, look alike, show raw technical output, or block progress without any explanation.",
        "Reduce the number of prompts instead of asking people to try harder. Allow clearly safe actions automatically within a [[sandbox]], batch related requests, and reserve interruptions for actions that are irreversible or reach outside the environment. Make each prompt specific, showing the exact command and its target, and make risky ones look different from routine ones. Measure approval rates and times as a health signal."
      ] },
    { id: "audit-log", term: "Audit log", aka: ["activity log", "audit trail"], cat: "safety", icon: "doc", entry: "governance", related: ["observability", "trace", "governance", "checkpoint"],
      def: "A tamper-resistant, time-ordered record of who or what did what: each tool call, approval, access and change an agent made. It supports investigation, compliance and accountability, and should be kept where the agent itself cannot edit it.",
      more: [
        "Useful entries record the actor (which agent and on whose behalf), the action, its arguments, the target, the time, the outcome and any approval and who gave it. Writing entries from the harness, not from the model, keeps them accurate. Store them append-only, with integrity protection such as hashing or write-once storage, and with access limited so the agent cannot alter or delete them.",
        "The log needs care about content. Arguments and results can contain personal data ([[pii]]) and [[secrets]], so mask them or restrict who can read the log. Keep enough detail to reconstruct an incident, and agree retention periods that meet legal duties without hoarding data. A log nobody reads has little value, so add alerts for unusual patterns, such as large reads or blocked actions."
      ] },
    { id: "pii", term: "PII (personally identifiable information)", aka: ["personal data", "PII", "GDPR"], cat: "safety", icon: "mask", entry: "governance", related: ["governance", "secrets", "audit-log", "guardrails"],
      def: "Information that identifies a person, alone or in combination, such as a name, email address, ID number or health record. Privacy laws such as the GDPR limit how it is processed, so systems often detect and mask it before it reaches a model or a log.",
      more: [
        "Personal data has no single technical definition, and laws differ on what counts. Direct identifiers include names, emails, phone numbers and ID numbers. Indirect ones, such as a job title, a postcode and a date of birth, can single out a person when combined. Some categories, for example health, are given extra protection by law.",
        "In agent systems it can leak at many points: prompts, retrieved documents, tool results, logs, traces and [[long-term-memory]]. Common controls are detecting and masking it before it reaches a model or a log, limiting what tools can read, setting retention periods, and keeping data in approved regions. Detection tools miss some cases and flag harmless text, so combine them with access limits and do not assume they catch everything."
      ] },
    { id: "alignment", term: "Alignment", aka: ["AI alignment", "value alignment"], cat: "safety", icon: "scales", entry: "security", related: ["rlhf", "constitutional-ai", "red-teaming", "interpretability"],
      def: "Making an AI system pursue the goals and values its builders and users intend, and behave safely when instructions are incomplete or in conflict. In practice it covers training methods such as RLHF, testing for bad behaviour, and research into why models act as they do.",
      more: [
        "The central difficulty is that what people want is hard to specify fully. A model trained to maximise a measurable signal may find an unintended way to score well, which is called reward hacking. Methods in use include [[rlhf]] and other preference training, [[constitutional-ai]], careful data selection, and adversarial testing, with [[interpretability]] research as a possible check on what is happening inside.",
        "For agents, alignment problems appear as practical behaviour: taking a shortcut that technically meets the goal, going beyond the scope that was asked for, or hiding a failure. These are reduced by clear instructions, narrow permissions, checks that measure the real outcome and review of trajectories. Alignment is a matter of degree and has to be tested again whenever the model or setting changes."
      ] },
    { id: "constitutional-ai", term: "Constitutional AI", aka: ["CAI", "RLAIF", "principles-based training"], cat: "safety", icon: "book", entry: "model", related: ["alignment", "rlhf", "post-training"],
      def: "A training method published by Anthropic in which a model critiques and revises its own answers against a written list of principles, the constitution, and is then trained on the improved answers and on AI-generated preference labels. It reduces the need for people to label harmful content.",
      more: [
        "The method has two stages. In the supervised stage the model drafts an answer, critiques it against a chosen principle, and rewrites it; the revised answers are used for fine-tuning. In the reinforcement stage, a model compares pairs of answers according to the principles, and these AI-made preferences train a reward signal, a setup called reinforcement learning from AI feedback.",
        "The principles are written in plain language and can be inspected and changed, which makes the intended behaviour easier to state and audit than labels from many individual raters. The limits are that the result depends on how well the model applies the principles, that principles can conflict, and that the choice of principles is a human judgement. It is one technique within [[post-training]], not a guarantee of safe behaviour."
      ] },
    { id: "interpretability", term: "Interpretability", aka: ["mechanistic interpretability", "explainability"], cat: "safety", icon: "search", entry: "model", related: ["alignment", "parameters", "attention", "red-teaming"],
      def: "Research into how a model computes its answers, by examining its internal activations and circuits rather than only its outputs. The aim is to explain, and eventually verify, why a model does what it does; today it gives partial insight, not full explanations.",
      more: [
        "Methods look at the internal numbers of a network. Probes train a small classifier on activations to test whether some concept is represented. Other work tries to break activations into more understandable features, and traces how features connect into circuits that perform a task. Researchers also intervene, switching a feature on or off, to test whether it really causes a behaviour.",
        "The field is young. Findings often cover narrow behaviours in small or simplified settings, and extending them to the largest models is hard. Explanations can sound convincing without being causal. For practitioners, the lasting point is that a model's own account of its reasoning is not proof of what it did internally, so test behaviour directly. It is a research tool more than an operational one for now."
      ] },
    { id: "container", term: "Container", aka: ["Docker container", "container isolation"], cat: "safety", icon: "box", entry: "sandbox", related: ["sandbox", "microvm", "code-execution", "egress-filtering"],
      def: "A lightweight isolated environment that packages a program with its dependencies and gives it a private view of files, processes and network. Agents use containers as a sandbox; they start fast, but they share the host's kernel, so their isolation is weaker than a virtual machine's.",
      more: [
        "A container uses features of the host operating system to limit what a process sees: separate namespaces for files, processes and network, and limits on CPU and memory. It runs from an image that fixes the software, so every run starts from the same state and can be thrown away afterwards. This makes it cheap to start many, which suits agent tasks.",
        "Because containers share the host kernel, a flaw in the kernel can let code escape, so untrusted or hostile code needs more protection. Harden them by dropping privileges, running as a non-root user, making the file system read-only where possible, limiting system calls and filtering network traffic. For stronger separation, run the container inside a [[microvm]] or use a dedicated virtual machine."
      ] },
    { id: "microvm", term: "MicroVM", aka: ["micro virtual machine", "Firecracker", "lightweight virtual machine"], cat: "safety", icon: "chip", entry: "sandbox", related: ["container", "sandbox", "code-execution", "background"],
      def: "A very small virtual machine that boots quickly and runs its own kernel, so a program inside is separated from the host by hardware virtualisation. It gives stronger isolation than a container and is a common choice for running untrusted agent code.",
      more: [
        "A microvm uses a hypervisor to run a guest with its own kernel, but strips away the devices and services a full virtual machine carries. That keeps start-up to a fraction of a second and memory use low, so a service can launch one per task or per user. An attack must break the guest kernel and then the hypervisor, a much harder path than escaping a container.",
        "The trade-offs are overhead and operation. Each guest has its own memory, images are larger than container layers, and sharing files with the host needs deliberate set-up. It also needs hardware virtualisation support, which is not available everywhere. For agents that run code from untrusted sources, such as generated programs or downloaded packages, the stronger boundary is usually worth it."
      ] },
    { id: "secrets", term: "Secrets", aka: ["credentials", "API keys", "secret management"], cat: "safety", icon: "lock", entry: "permissions", related: ["least-privilege", "oauth", "data-exfiltration", "pii"],
      def: "Credentials such as API keys, passwords and access tokens that grant access. Keep them out of prompts, files the agent reads and logs; give tools short-lived, narrowly scoped credentials supplied at run time, because anything in the context can be repeated or leaked.",
      more: [
        "A secret placed in the context can be repeated by the model, written to a log, sent in a tool call or revealed by [[indirect-prompt-injection]]. The safer pattern is to keep the secret outside the model: a tool or proxy holds it and adds it to requests, so the agent can use a service without ever reading the key. Load secrets from a manager at run time instead of storing them in files or prompts.",
        "Give each credential the smallest scope and shortest life that works, and a separate one per agent, so that one leak is contained and can be revoked without breaking everything else. Scan repositories, prompts and logs for leaked keys, and rotate any that were exposed. Remember that an agent allowed to read the whole file system, including environment files, can reach secrets you did not mean to give it."
      ] },

    /* ---- Teams and workflows ---- */
    { id: "agent-teams", term: "Agent teams", aka: ["team of agents", "peer agents"], cat: "teams", icon: "team", entry: "team", related: ["sub-agent", "multi-agent-system", "orchestrator", "handoff"],
      def: "Several full agents coordinated by a lead that share a task list and message each other, unlike sub-agents, which only report back to their caller.",
      more: [
        "In a team, each member is a full agent with its own context window, tools and loop. The members share a task list in which work can be claimed, finished or blocked, and they exchange messages directly. A lead assigns work, resolves conflicts and combines results. This differs from [[sub-agent|sub-agents]], which are started by one caller, work in isolation and only return a result.",
        "Teams suit work where parts need discussion, such as reviewing a design from several angles or investigating competing explanations of a bug. The costs are high: every member uses its own tokens, and messages add more. Members can edit the same file and conflict, or duplicate effort. Give each a clear area of ownership and a definition of done, and use a single agent when the task does not split."
      ] },
    { id: "evaluator-optimizer", term: "Evaluator-optimizer", aka: ["generator and critic", "critic loop"], cat: "teams", icon: "loop", entry: "team", related: ["reflection", "llm-as-judge", "workflow", "stop-condition"],
      def: "A workflow in which one call generates and another critiques, repeating until the result passes. It works best when the critic has clear criteria or an objective check.",
      more: [
        "The loop has a generator that produces a candidate and an evaluator that returns a verdict and specific feedback. The feedback goes back to the generator, which revises, and the cycle ends when the evaluator accepts or a round limit is reached. The evaluator can be a model with a written rubric, or code such as tests, linters and schema checks, which are more dependable.",
        "Quality depends on the evaluator. A vague critic gives vague advice, and a model judging its own style may approve flawed work or demand changes without end. Give the critic clear criteria, ideally things it can check against evidence, and keep a firm cap on rounds. It is worth the extra calls when quality is hard to get in one pass and easy to judge, as in code with tests."
      ] },
    { id: "multi-agent-system", term: "Multi-agent system", aka: ["MAS", "multi-agent"], cat: "teams", icon: "net", entry: "team", related: ["orchestrator", "sub-agent", "a2a", "swarm", "debate"],
      def: "Several agents cooperating on a task, typically a lead agent coordinating specialists. It helps when work splits into independent parts or needs fresh context, and it costs more tokens than a single agent.",
      more: [
        "The usual structure is a lead that breaks the task up, starts specialist agents with focused instructions and tools, and combines their results. Each worker has its own context window, which keeps long material out of the lead's context and lets independent work run in parallel. The lead's brief matters a great deal, since workers know only what they are told.",
        "The costs are tokens, coordination and harder debugging. Agents can duplicate work, disagree, pass on errors or lose detail when summarising for each other. Start with one agent and add more only when a measured problem, such as context overflow or clearly parallel work, calls for it. Keep a trace of each agent so that a failure can be followed through the handoffs ([[handoff]])."
      ] },
    { id: "orchestrator-workers", term: "Orchestrator-workers", aka: ["lead and workers", "manager-worker"], cat: "teams", icon: "fork", entry: "team", related: ["orchestrator", "sub-agent", "fan-out", "planning"],
      def: "A pattern in which a lead model breaks a task down at run time and delegates the parts to workers. Unlike fixed parallel branches, the number and kind of sub-tasks are decided by the model for each input.",
      more: [
        "The orchestrator receives the task, plans in a first model call, and writes a brief for each worker. A worker is a separate model call, often with its own tools and a clean context, that returns a result. The orchestrator then reads all results and either finishes, asks for more work or merges them into one answer. Because the plan is made at run time, the same code handles very different inputs.",
        "The weak point is the brief. If it leaves out a constraint, the worker cannot know it, and the orchestrator may only notice after merging. Workers can also duplicate effort or leave gaps. Cap the number of workers and rounds, ask each worker for a short structured result, and log every brief so a bad plan can be traced. See [[sub-agent]] for the worker side."
      ] },
    { id: "parallelization", term: "Parallelization", aka: ["parallel calls", "concurrency"], cat: "teams", icon: "merge", entry: "team", related: ["fan-out", "map-reduce", "self-consistency", "rate-limit"],
      def: "Running independent sub-tasks, or several attempts at one task, at the same time. It shortens waiting time and can raise reliability, but total cost and load on rate limits go up.",
      more: [
        "There are two forms. In sectioning, different parts of a task run at once and the outputs are joined. In voting, the same task runs several times and the answers are compared, merged or chosen by majority. Both need the calls to be independent: if one needs another's output, they must run in sequence. Orchestration code usually starts the calls together and waits for all of them, or for the first few to finish.",
        "Total wall-clock time falls to that of the slowest call, but tokens and spend add up, and bursts of requests hit [[rate-limit]] errors. Handle partial failure on purpose: decide whether one failed branch cancels the rest, is retried or is skipped. Merging is a common source of errors, so check that combined outputs agree with each other. Voting only helps if the attempts differ enough to fail in different ways."
      ] },
    { id: "prompt-chaining", term: "Prompt chaining", aka: ["pipeline", "sequential calls"], cat: "teams", icon: "link", entry: "team", related: ["workflow", "structured-output", "evaluator-optimizer", "dag"],
      def: "A workflow that splits a task into fixed, sequential calls with checks between them. Each call is simpler than the whole task, so it is easier to test and cheaper to fix.",
      more: [
        "Each step takes the output of the previous one as input, often in a structured format such as JSON so that code can read it. Between steps, a gate can check the result with plain code or a small model call, and stop or retry if it fails. Typical chains outline then write, extract then validate, or draft then translate. Every step has a short prompt aimed at one job.",
        "The trade-off is more calls, more latency and more places for errors to pass along: a mistake in step two is faithfully built on in step five. Keep the number of steps small, validate at the points where mistakes are costly, and log each intermediate output so that a failing step can be tested on its own. If the steps cannot be known in advance, a [[workflow]] with fixed paths is the wrong tool."
      ] },
    { id: "routing", term: "Routing", aka: ["router", "intent classification"], cat: "teams", icon: "fork", entry: "team", related: ["model-routing", "workflow", "small-language-model", "orchestrator"],
      def: "A workflow that classifies an input and sends it to a specialised path or model. It keeps each path simple and lets cheap models handle easy cases.",
      more: [
        "A router is a first step that reads the input and picks a label: a category, a language, a difficulty or a target model. It can be a small model, a classifier trained on labelled examples, an embedding lookup or plain rules. The chosen label selects which prompt, tools or model handle the rest. Routers should output a fixed set of labels and include a fallback label for inputs that fit none.",
        "Mistakes at the router cannot be fixed later, because the wrong path never sees the right instructions. Measure the router on its own, with a labelled set that includes ambiguous cases, and watch for new kinds of input that the categories do not cover. Keep the paths separate enough to justify the split. A related idea at the model level is [[model-routing]]."
      ] },
    { id: "sub-agent", term: "Sub-agent", aka: ["subagent", "helper agent", "delegated agent"], cat: "teams", icon: "folder", entry: "team", related: ["orchestrator", "agent-teams", "context", "handoff"],
      def: "A helper agent with its own fresh context window that handles one delegated task and returns a short result. It keeps the lead agent's context clean and allows several tasks to run side by side.",
      more: [
        "The lead agent calls a sub-agent like a tool. It passes a task description and receives only a final message, so the sub-agent's searches, file reads and dead ends never enter the lead's context. A sub-agent can have fewer tools, a different model and tighter permissions than its parent. Several can run at the same time when their tasks do not depend on each other.",
        "The main failure is a thin brief. The sub-agent sees nothing of the parent's conversation, so the task must name the goal, the constraints and the form of the answer. The return trip loses detail too, since the summary is all the lead gets. Cost rises because each sub-agent pays for its own context, and nested delegation is hard to follow, so limit the depth and log each run as a separate [[trace]]."
      ] },
    { id: "workflow", term: "Workflow", aka: ["LLM workflow", "agentic workflow", "deterministic workflow"], cat: "teams", icon: "graph", entry: "team", related: ["agent", "prompt-chaining", "routing", "dag", "durable-execution"],
      def: "A system in which your code orchestrates model calls along predefined paths. It is cheaper, faster and more predictable than an agent, and the right choice whenever the steps are known in advance.",
      more: [
        "In a workflow the control flow lives in ordinary code: steps, branches, loops and retries are written by a developer, and the model fills in the content at each step. The usual building blocks are [[prompt-chaining]], [[routing]], [[parallelization]] and evaluator loops. Because the path is fixed, each step can be tested alone, timed and costed, and a failed run can be replayed from a saved step.",
        "The weakness is rigidity. A workflow handles the cases its author foresaw and fails or does poorly on the rest, and each new case means new code. Many teams start with a single model call, add steps only when evals show a need, and move to an [[agent]] only when the path truly cannot be known beforehand. Long-running workflows also need saved state, as in [[durable-execution]]."
      ] },
    { id: "orchestrator", term: "Orchestrator", aka: ["supervisor", "lead agent", "manager agent"], cat: "teams", icon: "gavel", entry: "team", related: ["sub-agent", "orchestrator-workers", "planning", "handoff", "multi-agent-system"],
      def: "The agent or program that breaks a goal into parts, assigns them to other agents or tools, collects the results and decides what to do next. Some frameworks call it a supervisor or manager. It holds the overall plan, so it is also a single point of failure.",
      more: [
        "In an orchestrator design, workers have narrow jobs and little context. The orchestrator keeps the goal, tracks progress and merges results, so its context fills up faster than theirs; it often needs [[compaction]] or notes kept outside the window.",
        "Give workers clear task descriptions and a defined result format. Vague delegation is the most common cause of duplicated work and gaps in multi-agent systems."
      ] },
    { id: "swarm", term: "Swarm", aka: ["agent swarm", "peer-to-peer agents"], cat: "teams", icon: "net", entry: "team", related: ["multi-agent-system", "handoff", "orchestrator", "fan-out"],
      def: "A multi-agent style with no fixed boss: many simple agents hand control to one another by rules or by choice, each doing its own part. It suits work that splits into many independent pieces, and is harder to predict and debug than a central orchestrator.",
      more: [
        "Each agent in a swarm has its own instructions and tools, and one tool it can call is a transfer to another agent. Control passes along the chain of transfers while the shared conversation, or a small set of shared variables, travels with it. There is no central planner. The loop ends when an agent answers the user or when no further transfer is chosen. This keeps each agent's prompt short and focused.",
        "Without a planner, nobody owns the whole task, so loops, ping-pong between two agents and dropped context are common. Set a maximum number of transfers, make the transfer rules explicit in each prompt, and log every handoff in the [[trace]]. Debugging means reading the whole path of control, not one prompt. Compare [[orchestrator-workers]], where one lead holds the plan, and see [[handoff]]."
      ] },
    { id: "debate", term: "Debate", aka: ["multi-agent debate", "adversarial review"], cat: "teams", icon: "bubble", entry: "team", related: ["self-consistency", "evaluator-optimizer", "llm-as-judge", "multi-agent-system"],
      def: "Having several model instances argue for different answers over a few rounds, with a judge or a vote choosing the outcome. It can surface errors a single attempt misses, but it multiplies cost and does not guarantee that the right answer wins.",
      more: [
        "A typical setup gives each debater the question and sometimes a fixed stance. Each one writes an answer, reads the others' answers, and revises over a few rounds. A final step, either a judge model or a majority vote, picks or merges the result. The idea is that errors which one attempt would repeat may be caught by a rival that sees different evidence or reasons differently.",
        "Gains are modest and uneven. Debaters built on the same model share the same blind spots and may drift together toward a confident wrong answer. A judge can also be swayed by fluent text. Cost grows with the number of debaters times the number of rounds. Compare against simpler baselines such as [[self-consistency]] before adopting it, and check results on a [[golden-set]]."
      ] },
    { id: "map-reduce", term: "Map-reduce", aka: ["map reduce", "split and merge"], cat: "teams", icon: "merge", entry: "team", related: ["fan-out", "parallelization", "long-context", "compaction"],
      def: "A pattern in which a large input is split into pieces, each processed independently by a model call (map), and the partial results are then combined by one final call (reduce). It is used to summarise or analyse material that does not fit in one context window.",
      more: [
        "In the map step, the input is split into chunks, such as pages or files, and the same prompt runs on each chunk, usually in parallel. The outputs should be small and structured. In the reduce step, one call receives all partial outputs and combines them. If they still do not fit in one context window, reduce in several rounds, merging in groups until a single result remains.",
        "Information that needs two distant chunks together is lost, because each map call sees only its own piece. Chunk boundaries can cut a sentence or table in half, and different chunks may disagree in style or in facts. Keep the map output tied to its source location so that claims can be checked. With very long contexts, a single call is sometimes simpler, but quality there can vary, see [[long-context]]."
      ] },
    { id: "fan-out", term: "Fan-out", aka: ["fan-out and fan-in", "scatter-gather"], cat: "teams", icon: "fork", entry: "team", related: ["parallelization", "orchestrator-workers", "map-reduce", "rate-limit"],
      def: "Sending one task out to many parallel workers or model calls, then gathering ('fan-in') their results. It cuts the waiting time of broad jobs such as searching many sources, at the price of more tokens in total.",
      more: [
        "A coordinator splits the work into independent items, starts one call per item, and waits for the results, which is the fan-in step. The items might be search queries, documents, files or sub-questions. A concurrency limit controls how many run at once, so that the account's [[rate-limit]] is respected. Each result should carry an identifier so that the gathering step can match answers to items even when they arrive out of order.",
        "Plan for partial failure: some calls will time out or return errors, and the gather step needs a policy of retrying, skipping or failing the whole job. Wide fan-out also multiplies cost and can flood a downstream service with requests. Duplicate results are common, since parallel workers do not know what the others found. Deduplicate before the final answer, and consider [[map-reduce]] for the combining step."
      ] },
    { id: "dag", term: "DAG (directed acyclic graph)", aka: ["DAG", "directed acyclic graph", "dependency graph"], cat: "teams", icon: "graph", entry: "team", related: ["workflow", "prompt-chaining", "durable-execution", "parallelization"],
      def: "A graph whose steps are joined by one-way arrows that never loop back. Workflow engines use a DAG to say which steps depend on which, so independent steps run in parallel and each runs once its inputs are ready. Agent loops are not DAGs, because they repeat.",
      more: [
        "Each node is a step and each edge says that one step must finish before another starts. A scheduler walks the graph, runs every step whose inputs are ready, and passes outputs along the edges. The graph can be checked before running: a cycle is rejected, and missing inputs are found early. Because order is explicit, the engine can retry a single failed node and reuse results of nodes that already finished.",
        "A DAG suits pipelines whose shape is known up front, such as ingest, extract, validate and publish. It does not fit work that decides its next step from what it just learned, which needs loops. Teams sometimes force loops into a DAG by unrolling a fixed number of attempts, which wastes calls. Pipelines of this kind pair well with [[durable-execution]] and a [[workflow]] engine."
      ] },
    { id: "durable-execution", term: "Durable execution", aka: ["workflow engine", "resumable workflow", "persistent state"], cat: "teams", icon: "clock", entry: "background", related: ["checkpoint", "long-horizon-task", "workflow", "event-trigger"],
      def: "A way of running long workflows so that progress is saved after each step and the run survives crashes, restarts and waits of days. After a failure it resumes where it stopped, and finished steps are not repeated. Long-running agents need it to be reliable.",
      more: [
        "The engine records each step's inputs and result in a store as the run proceeds. If the process dies, a new worker replays the recorded history: finished steps return their saved results and execution continues at the first unfinished step. Timers and waits for outside events, such as a human approval, are stored as well, so a run can sleep for days without holding a process open.",
        "The code that orchestrates must be deterministic on replay, so random numbers, clocks and network calls belong inside recorded steps. A step that was in flight when the crash happened may run twice, so side effects like sending an email or a payment need idempotency keys. Model calls are recorded rather than repeated, which avoids paying again and avoids a different answer on replay. Compare [[checkpoint]]."
      ] },
    { id: "cron", term: "Cron (scheduled task)", aka: ["scheduler", "cron job", "scheduled run"], cat: "teams", icon: "calendar", entry: "background", related: ["event-trigger", "background", "durable-execution"],
      def: "A scheduler that starts a job at fixed times, such as every weekday at eight; the name comes from the Unix tool cron. Scheduled agent runs use it for recurring work like reports, checks and clean-ups, with nobody present to start them.",
      more: [
        "A cron expression has five fields: minute, hour, day of month, month and day of week. The scheduler checks the clock every minute and starts any job whose fields match. Cloud schedulers add features such as time zones, retries and overlap rules. A scheduled agent run starts in a fresh session with a fixed prompt, so everything it needs must be in that prompt, its files or its stored [[memory]].",
        "Typical problems are clock and time-zone surprises around daylight saving, overlapping runs when one run is slower than the interval, and silent failures because nobody is watching. Make jobs idempotent so a repeat does no harm, set a time limit and a [[token-budget]], and send an alert when a run fails or produces nothing. Since no person is present to approve actions, keep the agent's permissions narrow."
      ] },
    { id: "event-trigger", term: "Event trigger", aka: ["webhook", "event-driven agent"], cat: "teams", icon: "bell", entry: "background", related: ["cron", "background", "api", "durable-execution"],
      def: "A rule that starts an agent or workflow when something happens, such as a new email, a pull request or a payment. Events usually arrive as webhooks, HTTP calls that one service sends to another, so the agent reacts within moments and does not need to poll.",
      more: [
        "A service posts an HTTP request, the webhook, to an address you provide whenever the event occurs. A small receiver checks the signature, stores the event, replies quickly and passes it to a queue. A worker then starts the agent with the event as input. Events can arrive twice, late or out of order, so the handler should recognise an event it has already processed by its identifier.",
        "Treat event content as untrusted. An email subject or a pull request description is text written by someone else, and may hold instructions meant for the model, see [[indirect-prompt-injection]]. Also guard against loops, such as an agent that comments on a pull request and thereby triggers itself. Filter events narrowly, rate-limit runs per source, and record which event started each run in the [[audit-log]]."
      ] },
    { id: "handoff", term: "Handoff", aka: ["handover", "transfer of control", "escalation"], cat: "teams", icon: "hand", entry: "team", related: ["swarm", "orchestrator", "human-in-the-loop", "agent-card"],
      def: "Passing control of a task from one agent to another, with the context it needs, for example from a general agent to a specialist, or from an agent to a person. A clean handoff carries the goal, the current state and what has already been tried.",
      more: [
        "Mechanically, a handoff is a transfer of the working state: the new agent receives a message or a structured record, and sometimes the conversation so far. The sending side decides what to pass. Sending everything bloats the receiver's context, while sending only a summary risks losing a detail. Common approaches pass a short brief plus links to files or records the receiver can read for itself.",
        "Handoffs fail when the receiver has to ask again for facts the customer already gave, when ownership is unclear and two agents act at once, or when the case goes back and forth between two agents. A handoff to a person needs extra care: state what the agent did, what it could not do and what decision is needed. Log each transfer so it can be reviewed. See also [[swarm]] and [[human-in-the-loop]]."
      ] },

    /* ---- Quality, cost and rules ---- */
    { id: "benchmark", term: "Benchmark", aka: ["leaderboard", "public benchmark"], cat: "ops", icon: "ruler", entry: "evals", related: ["benchmark-contamination", "golden-set", "pass-at-k", "scaffold"],
      def: "A public, standardised set of tasks used to compare models or agents. Scores are useful for a first shortlist but say little about how a model will do on your own work, so test candidates on your own examples.",
      more: [
        "A benchmark pairs a fixed set of tasks with a scoring rule, such as exact match, passing unit tests or a grade by a judge. Running different models on the same tasks under the same settings gives numbers that can be compared. Results depend on details: the prompt format, the number of examples shown, the sampling settings and the tools allowed. Two scores are comparable only if these match.",
        "Benchmarks go stale. Once a test is public, models can be tuned toward it, its answers can leak into training data (see [[benchmark-contamination]]), and top scores bunch up near the ceiling so differences stop meaning anything. Tasks may also differ from real work in length, tools and messiness. Use public scores to build a shortlist, then decide with a private [[golden-set]] drawn from your own cases."
      ] },
    { id: "observability", term: "Observability", aka: ["monitoring", "telemetry", "logging"], cat: "ops", icon: "eye", entry: "evals", related: ["trace", "audit-log", "drift", "latency"],
      def: "Recording traces, metrics and logs of agent runs so you can inspect and improve them. It shows what an agent did and why, what each run cost, and where it is slow or failing.",
      more: [
        "Instrumentation wraps each model call, tool call and decision, and records what went in, what came out, how long it took and how many tokens it used. These records are linked into a [[trace]] per run, and aggregated into metrics such as error rate, cost per task and [[latency]] percentiles. Logs of prompts and outputs let you replay a failure with the same inputs. Many teams use standard tracing formats so tools can be swapped.",
        "Because traces hold user data, decide what to store, redact personal data, and set retention limits. Averages hide problems, so look at the slowest and the most expensive runs, and sample failures for review. Observability shows what happened, not whether it was good, so pair it with [[evals]] that score outputs. Alerts on cost spikes and on runs that loop catch many faults early."
      ] },
    { id: "prompt-caching", term: "Prompt caching", aka: ["context caching", "cache hit", "cached tokens"], cat: "ops", icon: "stack", entry: "cost", related: ["kv-cache", "latency", "unit-economics", "context-engineering"],
      def: "Re-using the processed form of an unchanged prompt prefix, which cuts cost and latency. A request that matches a cached prefix is a cache hit and is billed at a lower rate, so keep stable text first and changing text last.",
      more: [
        "When a request arrives, the provider checks whether the start of the prompt matches a prefix it has already processed. If so, it reuses the stored attention state, the [[kv-cache]], instead of recomputing it, and only the new tail is processed. The match must be exact and from the beginning, so a changed character early in the prompt breaks the reuse for everything after it. Cached entries expire after a short time unless refreshed by use.",
        "Order the prompt for reuse: system instructions, tool definitions and reference material first, then the conversation, then the latest message. Do not put a timestamp, a user name or a random id near the top. Changing the tool list or the model also invalidates the cache. Some providers need explicit markers to say where the cached prefix ends, others detect it automatically, so check the documentation of the one you use."
      ] },
    { id: "llm-as-judge", term: "LLM-as-judge", aka: ["model-graded evaluation", "LLM judge", "AI grader"], cat: "ops", icon: "gavel", entry: "evals", related: ["golden-set", "reflection", "evaluator-optimizer", "regression-test"],
      def: "Using a language model to grade another model's output against a rubric, for example for correctness, helpfulness or tone. It scales to cases that no exact check can score, but it needs calibration against human ratings, since judges tend to favour longer answers and their own style.",
      more: [
        "A judge prompt contains the task, the answer to be graded and a rubric with clear levels, and asks for a short reason followed by a score or a verdict. Pairwise comparison, where the judge picks the better of two answers, is usually more stable than absolute scores. Asking for the reason before the score, using low temperature and giving a few worked examples all tend to improve consistency.",
        "Known biases include a preference for longer answers, for the first answer shown, and for text that resembles the judge's own writing. A judge may also be fooled by confident but wrong answers. Check agreement with human labels on a sample, swap the order of pairs, and use a different model family as judge where possible. Keep a human-rated [[golden-set]] to detect when the judge itself drifts."
      ] },
    { id: "golden-set", term: "Golden set", aka: ["gold set", "reference set", "ground truth", "eval dataset"], cat: "ops", icon: "checklist", entry: "evals", related: ["regression-test", "llm-as-judge", "benchmark", "drift"],
      def: "A curated set of inputs with known good answers or accepted criteria, used to measure a system every time it changes. It is built from real cases, kept stable, and grown whenever a new failure turns up.",
      more: [
        "Each item has an input and either an expected output or a checklist of what a good output must contain. Items come from real traffic, support tickets or past failures, and should cover common cases, edge cases and known traps. Running the whole set on every change gives a score that is comparable over time. Reviewing a sample of items by hand keeps the labels honest.",
        "A set that is too small gives noisy scores, so a change of one point may mean nothing. A set that is never updated stops reflecting real use, while one that leaks into prompts or training data will flatter the system, see [[benchmark-contamination]]. Keep a held-out part that nobody tunes against. Version the set, record who changed it and why, and use it as the basis for [[regression-test]] runs."
      ] },
    { id: "regression-test", term: "Regression test", aka: ["regression eval", "non-regression"], cat: "ops", icon: "flask", entry: "evals", related: ["golden-set", "llm-as-judge", "drift", "observability"],
      def: "A test run after every change to confirm that what used to work still does. For AI systems it means re-running the [[golden-set]] after a change of model, prompt or tools, because a fix in one area often breaks another.",
      more: [
        "The test stores a fixed set of inputs and the results that were accepted earlier. After any change, it runs the system on all of them and compares the new results with the old. For model output, exact comparison is rarely useful, so checks use rules, structured fields, test suites or a judge. A change passes if the score does not fall below an agreed threshold, and a drop on any category is flagged even when the average is stable.",
        "Because model output varies from run to run, repeat uncertain cases and compare averages, or the test will fail at random and be ignored. Run the cheap checks on every commit and the expensive full set before release. Every incident should become a new test case. Provider-side model updates can also cause regressions without any change of yours, so schedule runs, see [[drift]]."
      ] },
    { id: "pass-at-k", term: "pass@k", aka: ["pass at k", "pass@1", "best-of-k"], cat: "ops", icon: "dice", entry: "evals", related: ["self-consistency", "benchmark", "coding-agent", "golden-set"],
      def: "A score for tasks with checkable answers, such as code with tests: the chance that at least one of k attempts succeeds. Pass@1 is success on the first try, and the gap between pass@1 and pass@k shows how much repeated attempts help.",
      more: [
        "To estimate it, generate n samples for each problem, count the c that pass, and compute the chance that a random choice of k of the n contains at least one pass. This uses an unbiased formula and is more reliable than simply running k attempts once. With k equal to one, it is the average success rate. Higher k rewards models that are sometimes right even when they are usually wrong.",
        "Pass@k says what is possible if something can pick the right attempt, such as a test suite. In production there is often no such check, so pass@1 or a majority vote reflects real behaviour better. Sampling settings matter, since high [[temperature]] makes attempts more varied and raises pass@k. Report n, k and settings alongside the score, and beware weak tests, which let wrong code count as a pass."
      ] },
    { id: "benchmark-contamination", term: "Benchmark contamination", aka: ["data contamination", "test-set leakage", "train-test leakage"], cat: "ops", icon: "warning", entry: "evals", related: ["benchmark", "golden-set", "pre-training"],
      def: "When test questions or their answers have leaked into a model's training data, so that its score reflects memory and not ability. It inflates public benchmark results, and is one reason to evaluate on private examples of your own.",
      more: [
        "Contamination happens when benchmark items appear in the web text, code repositories or forum posts used for [[pre-training]], or when later training data are built from outputs that already include them. A model can then reproduce an answer from memory. Even partial leakage, such as the questions without the answers, can help. Because training sets are large and often undisclosed, it is hard to prove or rule out.",
        "Detection methods include searching for overlapping text, checking whether a model can complete an item verbatim, and comparing scores on original items against freshly written variants. A large gap suggests memory. Defences are private or regularly refreshed test sets, items created after the model's [[knowledge-cutoff]], and your own [[golden-set]] that has never been published. Treat public scores of unknown provenance with care."
      ] },
    { id: "trace", term: "Trace", aka: ["span", "tracing", "run trace"], cat: "ops", icon: "graph", entry: "evals", related: ["observability", "trajectory", "latency", "audit-log"],
      def: "The recorded path of one request or agent run as a tree of timed steps, called spans: each model call, tool call and decision with its inputs, outputs, duration and cost. Traces are the main tool for debugging agents.",
      more: [
        "A trace has a root span for the whole request and child spans for each step, nested to match the call structure. Each span records a start time, a duration, inputs, outputs, the model used, token counts and any error. A viewer shows the tree and a timeline, so you can see which step took the longest, which tool call returned an error, and what the model saw just before a bad decision.",
        "Traces can get large, because they hold full prompts and tool outputs, and they may contain personal or secret data. Redact before storing and limit who can read them. Sample heavily in production but keep every failed run. Useful practice is to search traces for patterns, such as repeated tool calls, then turn real failures into cases for a [[golden-set]]. Traces are a core part of [[observability]]."
      ] },
    { id: "latency", term: "Latency", aka: ["response time", "time to first token", "throughput"], cat: "ops", icon: "hourglass", entry: "cost", related: ["streaming", "prompt-caching", "effort", "inference"],
      def: "How long a system takes to respond. For models it is usually split into the time to the first token and the speed of generation after that. Latency rises with context length, reasoning effort and the number of tool calls, and it is traded against quality and cost.",
      more: [
        "Time to first token covers the network, queueing and the processing of the whole prompt, so it grows with prompt length. After that, tokens are produced one at a time, so total time is roughly the time to first token plus the output length divided by generation speed. In an agent, each step adds a model call and a tool call, so delays add up across a run. [[streaming]] hides some of the wait.",
        "Averages mislead: the slowest few percent of requests define how a system feels, so track percentiles such as the 95th. Levers include shorter prompts, [[prompt-caching]], a smaller model, a lower [[effort]] setting, shorter outputs and running independent calls in parallel. Each lever has a cost in quality or money, so measure before and after. Retries after timeouts can make a slow system slower still."
      ] },
    { id: "rate-limit", term: "Rate limit", aka: ["throttling", "HTTP 429", "quota"], cat: "ops", icon: "gauge", entry: "cost", related: ["batch-processing", "parallelization", "api", "fan-out"],
      def: "A cap on how many requests or tokens an account may use per minute or per day. Going over it returns an error, commonly HTTP 429, and the client should wait and retry with growing delays. Agents running in parallel reach limits quickly.",
      more: [
        "Providers usually set separate caps for requests per minute and for input and output tokens per minute, sometimes also for concurrent requests. When a cap is hit, the API returns an error, often with a header saying how long to wait. Limits differ by model and account tier, and a long prompt can use up a token cap with very few requests.",
        "Good clients retry with exponential backoff and random jitter, so that many clients do not retry at the same instant. They also queue work, cap concurrency and honour the wait time the server gives. Parallel agents, [[fan-out]] jobs and [[cron]] runs that start together are common causes of bursts. Spread them out, move non-urgent work to [[batch-processing]], and alert on sustained errors, which may mean a quota needs raising."
      ] },
    { id: "batch-processing", term: "Batch processing", aka: ["batch API", "asynchronous batch"], cat: "ops", icon: "stack", entry: "cost", related: ["rate-limit", "unit-economics", "latency", "map-reduce"],
      def: "Sending many requests together for asynchronous processing instead of waiting for each answer. Providers often offer batch interfaces at a discount, with results returned within hours, which suits large jobs that are not urgent, such as classifying a backlog.",
      more: [
        "You upload a file of requests, each with an identifier, and the provider processes them in the background when capacity is free. When finished, you download a results file and match each result to its request by identifier. The requests are independent, so results may come back in any order. Batch jobs normally have a stated completion window and sit outside the live [[rate-limit]] for interactive traffic.",
        "Batch suits work with no one waiting: classification of a backlog, bulk summaries, embedding a corpus or running a large eval. It does not suit chats or agents that need the result of one step to decide the next. Some requests in a batch can fail while others succeed, so collect failures and resubmit only those. Combining batch with [[prompt-caching]] can lower cost further, where the provider allows it."
      ] },
    { id: "token-budget", term: "Token budget", aka: ["max tokens", "thinking budget", "spend limit"], cat: "ops", icon: "coin", entry: "cost", related: ["effort", "stop-condition", "unit-economics", "token"],
      def: "A limit on how many tokens a request, a reasoning phase or a whole agent run may use. It caps cost and prevents runaway loops, and is often set together with limits on steps and time.",
      more: [
        "Budgets can be set at several levels. A maximum on output tokens stops one reply from running on. A cap on thinking tokens bounds [[reasoning]] effort. A run-level budget counts all input and output tokens across steps and stops the loop when it is spent. Counts come from the usage fields the API returns, so the harness can add them up after each call.",
        "A budget that is too tight cuts answers off or makes the agent give up on hard tasks, and one that is too loose lets a stuck loop burn money before it stops. Decide what happens at the limit: finish with a partial result, summarise and hand over, or fail loudly. Because every step resends the history, cost grows faster than step count, so combine budgets with [[compaction]] and limits on steps and time."
      ] },
    { id: "unit-economics", term: "Unit economics", aka: ["cost per task", "cost per resolution", "ROI"], cat: "ops", icon: "bars", entry: "cost", related: ["token-budget", "model-routing", "batch-processing", "prompt-caching"],
      def: "What one unit of work costs against what it earns, for example the cost per resolved support ticket against its value. For agents it shows whether automation pays off once model calls, retries, tool fees and human review are all counted.",
      more: [
        "The calculation starts with a unit, such as one ticket resolved or one document processed, and adds every cost that unit incurs: input and output tokens over all steps, retries, tool and search fees, hosting, monitoring and the time of people who review or fix results. Divide by the number of units that actually succeed, not by the number attempted. Compare that figure with the value of the unit or with the cost of the current process.",
        "Common mistakes are counting only the price of a single call, ignoring failed runs and rework, and assuming costs stay flat as volume grows. Costs per task vary widely, so look at the distribution, not just the mean, and watch the expensive tail. Levers include [[model-routing]], [[prompt-caching]], [[batch-processing]] and a [[token-budget]]. Re-check regularly, as model prices and quality change."
      ] },
    { id: "model-routing", term: "Model routing", aka: ["LLM router", "model cascade", "model selection"], cat: "ops", icon: "fork", entry: "cost", related: ["routing", "small-language-model", "unit-economics", "latency"],
      def: "Sending each request to the model best suited to it, usually a small, fast model for easy cases and a larger one for hard cases. Done well it cuts cost and latency with little loss of quality, but it needs a reliable way to judge difficulty.",
      more: [
        "A router sees the request and picks a model. Simple approaches use rules, such as input length or task type. More flexible ones use a small classifier or a cheap model to estimate difficulty, or send the request to the cheap model first and escalate if a confidence check or validator fails. This last pattern is called a cascade, and it keeps the cost of easy cases low.",
        "Routing needs evidence. Build a labelled set, measure quality and cost per route, and choose thresholds from the data. Failure modes are routing a hard request to a weak model, which gives a poor answer that looks fine, and the added [[latency]] of an extra call or a failed first try. Differences between models in format and tool use can also break a pipeline when the route changes. Related: [[routing]]."
      ] },
    { id: "drift", term: "Drift", aka: ["model drift", "data drift", "behaviour drift"], cat: "ops", icon: "thermo", entry: "evals", related: ["regression-test", "golden-set", "observability", "knowledge-cutoff"],
      def: "A gradual change in a system's behaviour or in the world it works in, so that quality declines without any change of your own. Causes include a provider updating a model, shifting questions and outdated knowledge; regular evals on fresh samples catch it.",
      more: [
        "Drift has several sources. A provider may update or replace a model behind the same name. The inputs may change, for example new products, new slang or a new document layout. Knowledge goes out of date, as the [[knowledge-cutoff]] recedes. Tools and websites the agent depends on may change their formats. Any of these can reduce quality without a single line of your code changing.",
        "Detect it by running a fixed [[golden-set]] on a schedule and by scoring a fresh sample of live traffic, then comparing with past results. Track input statistics too, such as length and topic mix. Pin the model version where the provider allows it, and plan time to re-test and adapt prompts when a version is retired. Alerts should fire on a sustained drop, not a single bad day."
      ] },
    { id: "eu-ai-act", term: "EU AI Act", aka: ["European AI regulation", "AI Act"], cat: "ops", icon: "scales", entry: "governance", related: ["risk-tier", "governance", "iso-iec-42001", "nist-ai-rmf"],
      def: "The European Union's law that regulates AI by risk level: some uses are banned, high-risk uses face strict duties, and some systems must be transparent, for example by telling people they are talking to an AI. It entered into force in 2024 and its duties apply in stages.",
      more: [
        "The Act sorts AI uses into levels. A short list of practices is prohibited. High-risk systems, such as those used in hiring, credit or critical infrastructure, must have risk management, data governance, documentation, logging, human oversight and accuracy and security measures, and must pass a conformity check before use. Systems that talk to people or generate content face transparency duties. General-purpose models have their own duties, which grow for the most capable ones.",
        "It applies to providers who place systems on the EU market and to deployers who use them in the EU, even if they are based elsewhere. Duties differ by role, so work out whether you build, adapt or only use a system. For agents, the main practical tasks are to classify each use by [[risk-tier]], keep an [[audit-log]], make sure a person can oversee and override ([[human-in-the-loop]]), and keep technical documentation. This is general information, not legal advice."
      ] },
    { id: "nist-ai-rmf", term: "NIST AI RMF", aka: ["AI Risk Management Framework", "NIST AI 100-1"], cat: "ops", icon: "book", entry: "governance", related: ["governance", "risk-tier", "iso-iec-42001", "eu-ai-act"],
      def: "A voluntary framework from the US National Institute of Standards and Technology, published in January 2023, that helps organisations manage AI risk through four functions: govern, map, measure and manage.",
      more: [
        "The framework is organised into four functions. Govern sets policies, roles and culture. Map establishes the context of a system, its purpose, its users and its possible harms. Measure analyses and tracks those risks with tests and metrics. Manage decides priorities, applies controls and responds to incidents. The functions are meant to be repeated through the life of a system, not run once. A companion profile covers generative AI.",
        "It is voluntary and does not give a pass or fail result, so it is a way to structure work, not a certificate. Organisations often fill in a risk register per system and tie the Measure function to [[evals]], [[red-teaming]] and monitoring. It maps onto other regimes, such as the [[eu-ai-act]] and [[iso-iec-42001]], which helps teams avoid keeping separate sets of records. The common failure is writing documents that no one uses."
      ] },
    { id: "iso-iec-42001", term: "ISO/IEC 42001", aka: ["AI management system standard", "ISO 42001"], cat: "ops", icon: "flag", entry: "governance", related: ["governance", "nist-ai-rmf", "eu-ai-act", "audit-log"],
      def: "An international standard, published in 2023, for an AI management system: the policies, roles, risk processes and controls an organisation sets up to develop or use AI responsibly. Organisations can be audited and certified against it.",
      more: [
        "It follows the structure used by other ISO management system standards, such as those for information security and quality. It asks an organisation to define its scope, set an AI policy, assign roles, assess risks and impacts, apply controls, monitor results, run internal audits and improve over time. An annex lists controls, for example on data quality, transparency, human oversight and the management of third-party suppliers.",
        "Certification is by an accredited external auditor, and it covers the management system, not the safety or quality of any single model. Having it shows that processes exist, which buyers and regulators may value, but a certified organisation can still ship a flawed agent. It is most useful when the controls are tied to real practice, such as [[evals]], an [[audit-log]] and clear ownership of each system, and it complements the [[nist-ai-rmf]]."
      ] },
    { id: "risk-tier", term: "Risk tier", aka: ["risk level", "risk category", "risk-based approach"], cat: "ops", icon: "ladder", entry: "governance", related: ["eu-ai-act", "governance", "human-in-the-loop", "nist-ai-rmf"],
      def: "A grouping of AI uses by how much harm they could cause, with duties that grow with the tier. The EU AI Act has unacceptable, high, limited and minimal risk; many organisations use similar tiers to decide how much testing and human oversight an agent needs.",
      more: [
        "Assigning a tier usually asks a few questions. What is the domain, such as health, employment or finance? Does the output affect a person's rights or safety? Can the system act on its own, or does a person review it first? Is the action reversible? Who is affected, and how many? The answers place the use in a tier, and each tier carries a fixed list of requirements for testing, documentation and oversight.",
        "Tier applies to the use, not to the model, so the same model can be low risk in one product and high risk in another. Re-assess when a use changes, for example when an agent gains write access or a new tool. Tiers are only as good as their application, and teams may under-classify to avoid work. Link tiers to concrete controls such as [[human-in-the-loop]] and [[least-privilege]], and to the [[eu-ai-act]]."
      ] },
    { id: "inference", term: "Inference", aka: ["model serving", "running a model"], cat: "ops", icon: "chip", entry: "cost", related: ["latency", "quantisation", "kv-cache", "unit-economics"],
      def: "Running a trained model to produce output, as opposed to training it. Every request is an inference call, and its cost and speed depend on model size, context length and output length. Most of the ongoing expense of an AI product is inference.",
      more: [
        "Inference has two phases. In prefill, the model processes the whole prompt in parallel and builds the [[kv-cache]]. In decoding, it generates one token at a time, each step reading the model weights and the cache. Prefill is limited by computation and decoding mostly by memory bandwidth. This is why long prompts raise time to first token, and why output length drives total [[latency]].",
        "Providers raise throughput by batching requests from many users on one accelerator, which trades a little latency for far lower cost per token. Techniques such as [[quantisation]], smaller models and caching cut cost further. For agents, inference cost compounds because each step resends a growing history. Measure tokens per task, not per call, and set a [[token-budget]] to keep runs in bounds."
      ] },
    { id: "quantisation", term: "Quantisation", aka: ["quantization", "4-bit model", "int8"], cat: "ops", icon: "squeeze", entry: "cost", related: ["parameters", "open-weight-model", "small-language-model", "inference"],
      def: "Storing a model's weights with fewer bits, for example 8 or 4 instead of 16, so that it takes less memory and runs faster. Quality drops a little, often very little, which lets large open-weight models run on modest hardware.",
      more: [
        "Weights are stored as floating-point numbers, commonly 16 bits each. Quantisation maps them to a smaller set of values, such as 8-bit or 4-bit integers, with a scale factor for each small group of weights. At run time the values are scaled back, or the arithmetic is done at low precision directly. Memory use falls roughly in proportion to the bits, and because decoding is limited by memory bandwidth, speed often improves too.",
        "Quality loss grows as bits fall, and it is not uniform: some tasks, such as long reasoning, exact arithmetic or rare languages, suffer more than casual chat. Methods that protect the most sensitive weights or calibrate on sample data lose less. Always test the quantised model on your own [[golden-set]], not only on generic scores. The cache can also be quantised, which helps with [[long-context]] but adds its own error."
      ] },

    /* ---- Products and uses ---- */
    { id: "agentic-ai", term: "Agentic AI", aka: ["agentic systems"], cat: "uses", icon: "spark", entry: "agent-loop", related: ["agent", "autonomous-agent", "workflow", "generative-ai"],
      def: "Umbrella term for AI systems that pursue goals with some autonomy by planning and taking actions, rather than only answering questions.",
      more: [
        "The term covers systems built around an [[agent-loop]]: a model decides what to do, calls [[tools]], reads the results and repeats until a goal is met or a limit is reached. Autonomy is a matter of degree, from a fixed [[workflow]] with a few model calls to an open-ended agent that chooses its own steps. Most useful products sit in the middle, with bounded freedom and checks.",
        "The word is also used loosely in marketing, so ask what the system actually does: which tools it can call, who approves actions, how long it runs unattended and how it is tested. More autonomy brings more risk, because errors compound across steps and actions can be hard to undo. Sound practice is to start with the simplest design that works, add [[permissions]] and [[evals]], and widen autonomy only as evidence allows."
      ] },
    { id: "agentic-ai-foundation", term: "Agentic AI Foundation (AAIF)", aka: ["AAIF", "Linux Foundation agent projects"], cat: "uses", icon: "globe", entry: "mcp", related: ["mcp-server", "agents-md", "a2a"],
      def: "A foundation under the Linux Foundation, formed in December 2025, that hosts open agent projects, among them MCP and AGENTS.md. It gives shared standards a neutral home outside any single company.",
      more: [
        "Hosting a project at a neutral foundation means its trademarks, repository and governance belong to the foundation and not to one vendor. Contributors from several companies can serve on technical committees, and changes follow published processes. For a protocol such as [[mcp]], this lowers the risk that a single company changes it against the interests of others, and it encourages competing products to implement it the same way.",
        "A foundation does not by itself make a standard good or widely used. Adoption still depends on how well the specification is written, how complete the reference implementations are and whether major tools support it. Neutral governance can also move more slowly than a single owner. When you choose a standard, check the release history, the open issues and which products implement it, and plan for versions to change."
      ] },
    { id: "deep-research", term: "Deep research", aka: ["research agent", "long-form research"], cat: "uses", icon: "books", entry: "knowledge", related: ["agentic-search", "citation", "ai-search", "long-horizon-task"],
      def: "Long-running agentic search that reads many sources and synthesises a report with citations. It trades minutes of waiting and many tokens for breadth, and its claims still need checking against the sources.",
      more: [
        "A typical system has a planner that breaks the question into sub-questions, search workers that run queries and read pages, and a writer that combines the notes into a report with citations. Often the workers run in parallel, as in [[orchestrator-workers]], and a loop lets the planner search again when it finds gaps. Intermediate notes are kept outside the context window, so many sources can be handled.",
        "Typical faults are citing a page that does not support the claim, relying on weak or biased sources, missing paywalled or recent material, and presenting a thin answer with a confident tone. The report can mix up facts from different sources. Check key claims against the cited pages, prefer primary sources, and read the stated search method. Cost and time are high, so use it when breadth matters, and see [[agentic-search]]."
      ] },
    { id: "chatbot", term: "Chatbot", aka: ["conversational AI", "chat interface"], cat: "uses", icon: "bubble", entry: "prompt", related: ["assistant", "agent", "customer-service-agent", "voice-agent"],
      def: "A program that holds a conversation in text or speech. Older chatbots followed scripts and decision trees; today the word usually means a language-model assistant that answers in a chat window and, unlike an agent, normally only talks and does not act.",
      more: [
        "A scripted chatbot matches the user's text to intents and follows a decision tree or fills slots in a form. It is predictable and cheap, but breaks on anything outside its script. A language-model chatbot generates replies from the conversation, usually with a [[system-prompt]] that sets its role and rules. It copes with open wording, but it can invent facts, so many deployments add [[rag]] and [[guardrails]].",
        "A plain chatbot has no tools, so it cannot check an order or change a booking, and its knowledge stops at the [[knowledge-cutoff]] unless it is given sources. Common failures are answering confidently without evidence, losing track in long conversations, and being steered off topic. Turning a chatbot into an [[agent]] means adding tools and permissions, and with them the need for stronger safeguards and testing."
      ] },
    { id: "assistant", term: "AI assistant", aka: ["copilot", "assistant", "personal assistant"], cat: "uses", icon: "window", entry: "harness", related: ["chatbot", "agent", "coding-assistant", "agentic-ai"],
      def: "A system that helps a person with tasks on request, using a language model plus some tools and context. Copilot is a common name for an assistant built into an application that suggests while the person stays in control; an agent is instead given a goal and acts on its own.",
      more: [
        "An assistant typically combines a model, a [[system-prompt]], some retrieved context from the person's documents and a small set of [[tools]]. The person asks, the assistant proposes, and the person accepts, edits or rejects. Because a human reviews each result, the assistant can be wrong more often than an autonomous agent could be allowed to be, as errors are caught before they have an effect.",
        "The trade-off is attention. If the suggestions are mostly right, people stop checking them, which is the risk behind [[approval-fatigue]]. Useful assistants make it easy to see the source of a claim, to undo changes and to correct the assistant, and they limit what data it can read. Moving from assistant to agent is a change in who is accountable for each step, so treat it as a design decision."
      ] },
    { id: "agentic-coding", term: "Agentic coding", aka: ["agent-driven development", "AI pair programming"], cat: "uses", icon: "pencil", entry: "agent-loop", related: ["coding-agent", "vibe-coding", "coding-assistant", "agents-md"],
      def: "Developing software by directing a coding agent that reads the project, edits files, runs tests and iterates, while the developer sets goals, reviews changes and decides. It differs from autocomplete, which only suggests the next lines.",
      more: [
        "The agent works in a loop on a real checkout of the project. It searches and reads files, edits them, runs the build, tests and linters, reads the errors and tries again. Instructions in a file such as [[agents-md]] tell it the project's conventions and commands. Work often happens in a [[sandbox]] or a separate branch, and the result is a diff or a pull request for a person to review.",
        "Tests and type checks give the agent a signal about whether it is right, so projects with good tests get far better results. Typical failures are changes that satisfy the tests but miss the intent, edits that spread too widely, invented functions or packages, and a loss of the thread in large tasks. Keep tasks small, require tests to pass, review the diff as you would a colleague's, and limit [[permissions]]."
      ] },
    { id: "vibe-coding", term: "Vibe coding", aka: ["prompt-driven programming"], cat: "uses", icon: "dice", entry: "agent-loop", related: ["agentic-coding", "coding-assistant", "hallucination"],
      def: "Building software by describing what you want in plain language and accepting the code the AI writes without reading it closely, judging only by whether it runs. It makes quick prototypes easy, but unreviewed code can hide bugs and security holes.",
      more: [
        "The loop is: describe the feature, run the result, and if it misbehaves paste the error or describe the problem and ask for a fix. The person steers by outcome and does not read the code. This works well for throwaway tools, demonstrations and exploring an idea, because the cost of a flaw is low and speed matters. It also lets people without programming training make working software.",
        "The risks grow with the stakes. Unread code may hold security flaws such as missing input checks, exposed [[secrets]] or unsafe dependencies, and when something breaks nobody understands it well enough to repair it. The code tends to pile up patches and become hard to change. For anything shared, public or holding real data, add review, tests and a security check, which moves the work toward [[agentic-coding]]."
      ] },
    { id: "rpa", term: "RPA (robotic process automation)", aka: ["RPA", "software robots", "screen scraping"], cat: "uses", icon: "gear", entry: "tools", related: ["computer-use", "workflow", "agentic-ai"],
      def: "Software robots that copy a person's clicks and keystrokes in existing applications to run fixed, rule-based routines, such as moving values between systems. RPA breaks when screens change; agents add judgement for messy cases, and the two are often combined.",
      more: [
        "An RPA bot is a recorded or scripted sequence that drives user interfaces: it opens an application, finds fields by position, label or element identifier, types values and clicks buttons. It follows rules exactly and is auditable, since every step is explicit. It is often used where an old system has no API and the process is stable, high in volume and structured, such as copying invoice data between systems.",
        "The weakness is brittleness. A moved button, a changed label or an unexpected pop-up stops the bot, and exceptions fall to a person. Language models help by reading unstructured documents, deciding between cases and recovering from small changes, but they add cost, delay and variation to what was deterministic. A sound design keeps fixed steps in RPA or a [[workflow]] and calls a model only where judgement is needed. See also [[computer-use]]."
      ] },
    { id: "ai-search", term: "AI search", aka: ["answer engine", "generative search"], cat: "uses", icon: "search", entry: "knowledge", related: ["rag", "citation", "deep-research", "semantic-search"],
      def: "Search that retrieves sources and has a language model write a direct answer with citations, rather than only listing links. It combines [[rag]] with a search index, and its quality depends on retrieval, source quality and checking the citations.",
      more: [
        "The pipeline rewrites the question into search queries, retrieves pages or passages, ranks them with [[reranking]], and passes the best text to a model that writes an answer and attaches [[citation]] markers. Some systems fetch the full pages, others use stored snippets or an index built in advance. Follow-up questions are rewritten using the earlier conversation so that they can be searched on their own.",
        "Quality depends on the weakest stage. Poor retrieval gives a fluent answer to the wrong question; a low-quality source gets repeated as fact; and a citation can point to a page that does not say what is claimed. Fresh events may be missing from the index. Click through for important claims, prefer answers that quote the source text, and compare with a plain search when the stakes are high. See [[grounding]]."
      ] },
    { id: "coding-assistant", term: "Coding assistant", aka: ["AI pair programmer", "code completion"], cat: "uses", icon: "terminal", entry: "harness", related: ["coding-agent", "agentic-coding", "assistant", "vibe-coding"],
      def: "A tool inside an editor or terminal that helps write code: completions, questions about the codebase, explanations and edits the developer accepts. It is the less autonomous end of a range that runs up to a [[coding-agent]].",
      more: [
        "Common features are inline completion, a chat that can see open files or the repository, and commands that explain, refactor or write tests for a selection. The tool builds a prompt from the surrounding code, related files found by search or [[embedding]] lookup, and the user's request. The developer reads each suggestion and decides whether to accept it, so the person remains the one who edits and runs the code.",
        "Suggestions look plausible even when wrong, and they may call functions that do not exist, use outdated library interfaces or reproduce insecure patterns. Context is limited, so the tool can miss conventions that live in files it did not read. Keep reviewing and testing accepted code as you would your own, and do not paste secrets into prompts. Moving to a [[coding-agent]] lets the tool run commands and edit many files itself."
      ] },
    { id: "customer-service-agent", term: "Customer-service agent", aka: ["support agent", "service bot"], cat: "uses", icon: "hand", entry: "harness", related: ["handoff", "human-in-the-loop", "chatbot", "voice-agent"],
      def: "An agent that handles support requests: it reads the customer's message, looks up the account and policies, answers or takes actions such as a refund, and hands over to a person when unsure or when the case is sensitive. Success is measured by resolution rate, quality and escalations.",
      more: [
        "The agent is given a [[system-prompt]] with the company's policies and tone, access to knowledge via [[rag]], and tools to look up orders, update records or issue refunds. For each message it decides whether to answer, ask a question, call a tool or escalate. Tool permissions and limits, such as a refund ceiling, are enforced in code and not left to the prompt, so the model cannot be talked past them.",
        "Frequent faults are inventing a policy, promising something the company does not offer, mishandling an angry or vulnerable customer, and being manipulated by a customer's text, see [[prompt-injection]]. Test with real past conversations and adversarial ones, log every action, and define clear triggers for [[handoff]] to a person, such as legal threats, repeated failures or a customer asking for a human. Measure outcomes, not only speed."
      ] },
    { id: "data-agent", term: "Data agent", aka: ["analytics agent", "text-to-SQL", "BI agent"], cat: "uses", icon: "db", entry: "knowledge", related: ["code-execution", "least-privilege", "agentic-search", "observability"],
      def: "An agent that answers questions about an organisation's data: it writes and runs queries or code, reads the results and explains them, often with charts. Reliability depends on a clear data model, access limits and checking the queries it ran.",
      more: [
        "The agent is given a description of the schema, tables and business definitions, often as retrieved context. For a question it writes SQL or code, runs it in a restricted environment, reads the result and decides whether to refine or explain. Good systems keep a small semantic layer that fixes the meaning of terms like revenue or active user, so that different questions use the same definitions.",
        "The main danger is a query that runs without error but answers the wrong question, for instance by joining on the wrong key, double counting rows or misreading a time range. The explanation sounds sure of itself either way. Show the query and the data behind each answer, use read-only credentials with [[least-privilege]], limit row counts and cost, and check results against known figures with a [[golden-set]] of questions."
      ] },
    { id: "ai-browser", term: "AI browser", aka: ["agentic browser", "browser with an agent"], cat: "uses", icon: "globe", entry: "tools", related: ["browser-agent", "computer-use", "indirect-prompt-injection", "permission-mode"],
      def: "A web browser with an AI agent built in, which reads pages and can click, fill in forms and carry out multi-step tasks for the person. It acts inside the person's signed-in sessions, so [[indirect-prompt-injection]] from web pages is its main risk.",
      more: [
        "The agent reads the page through its text structure, the accessibility tree, a screenshot or both, and chooses actions such as click, type, scroll and navigate. After each action it looks at the new page and decides the next one. This lets it work on sites without an API. It shares the person's cookies and logins, so it can reach any account that is signed in, which is the source of both its power and its risk.",
        "Web pages can hide text aimed at the model, so a page the agent merely reads may try to redirect it, see [[browser-agent]] and [[indirect-prompt-injection]]. Typical controls are a list of allowed sites, confirmation before purchases, sending messages or changing settings, and a separate profile with few logins. Pages with pop-ups, captchas or unusual layouts often defeat the agent, so expect to step in."
      ] },
    { id: "voice-agent", term: "Voice agent", aka: ["speech agent", "voice assistant", "real-time voice"], cat: "uses", icon: "mic", entry: "tools", related: ["multimodal-model", "streaming", "latency", "customer-service-agent"],
      def: "An agent that talks by speech: speech is turned into text, a model decides the reply and any tool calls, and text is turned back into speech, or a speech-native model handles the audio directly. Delay and interruptions matter much more than in text.",
      more: [
        "There are two designs. In a pipeline, speech recognition produces text, the model replies, and a speech synthesiser reads the reply aloud. Each stage adds delay, and tone and emphasis of the caller are lost. In a speech-native design, one model takes audio in and produces audio out, which keeps tone and is faster. Both need voice activity detection to decide when the caller has finished speaking.",
        "Natural conversation needs a response within well under a second, so teams use [[streaming]] at every stage and start speaking before the full reply exists. Barge-in, where the caller interrupts, must stop the audio and discard the rest of the reply. Recognition errors on names, numbers and accents are a common source of mistakes, so read back important details. Phone calls also raise consent and recording rules."
      ] },
    { id: "generative-ai", term: "Generative AI", aka: ["GenAI", "gen AI"], cat: "uses", icon: "camera", entry: "model", related: ["foundation-model", "diffusion-model", "agentic-ai", "multimodal-model"],
      def: "AI that creates new content, such as text, images, audio, video and code, rather than only classifying or predicting a label. Language models and diffusion models are its main kinds.",
      more: [
        "Most generative models learn the statistical structure of a large collection of examples and then sample new items from it. A language model predicts the next [[token]] repeatedly. A [[diffusion-model]] starts from noise and removes it step by step, guided by a text prompt. Audio and video models use related ideas. The output is new in the sense that it is generated, not looked up, though it may resemble the training data.",
        "Because the output is sampled, it can be fluent and wrong, and the same prompt can give different results. Generated content may reflect biases or copyrighted material in the training data, and it can be misused to produce misleading text or images. Agents build on generative models by adding [[tools]] and a loop, so the faults of the model carry over and need checks such as [[evals]] and [[guardrails]]."
      ] }
  ];
})(window.AE3);
