# Naming the versions

Every version has a codename: the last name of a person whose work shaped AI as it is today. The names run in historical order, so the oldest version has the earliest name (v0.1-alpha is Lovelace) and each new release takes the next person in time. The dropdown shows it next to the version ("v1.0 · Vaswani"). The used names are in [`versions/versions.js`](../versions/versions.js), each with `year`, the year of that person's key contribution.

## The rule

1. **One name per release.** The last name of one person, one word of letters (McCarthy is fine), never used before.
2. **Historical order.** The `year` of the new name is the same as or later than the year of the release before it. Within one year, order by month of publication. `scripts/versions.test.js` checks this.
3. **Researchers and scientists only.** Pick someone known for technical work: a paper, a method, a system, a result that changed the field. No company founders, chief executives or other tech executives, even when they did research before.
4. **Nobody political.** No politicians, no one known for political activity or political controversy. A name must be one nobody has to defend.
5. **Look for a spread.** Different countries, different decades of life, women and men, theory and practice. Check the person and the year against a primary source (the paper, the prize citation) before the release.
6. **Say why in one line.** The line in the list below is also what to tell people about the name.

## The next names

The upcoming candidates in order. A release takes the **first** row and removes it from this table in the same change that adds it to `versions/versions.js` (`codename`, `year`). Rows are suggestions and may be swapped when they break the rule or when a better fit comes up, as long as the years stay in order. When the table runs low, add rows by the same rule. `scripts/versions.test.js` checks that the rows are not used yet, are in order and come after the newest release.

<!-- queue:start -->
| Name | Year | Key contribution |
| --- | --- | --- |
| Radford | 2018 | GPT-1: generative pre-training of a language model |
| Devlin | 2018 | BERT: bidirectional pre-training for language understanding |
| Lewis | 2020 | Retrieval-augmented generation (RAG) |
| Dosovitskiy | 2020 | The Vision Transformer: transformers for images |
| Hu | 2021 | LoRA: cheap fine-tuning with low-rank adapters |
| Jumper | 2021 | AlphaFold 2: predicting protein structures |
| Wei | 2022 | Chain-of-thought prompting |
| Ouyang | 2022 | InstructGPT: training models to follow instructions from human feedback |
| Yao | 2022 | ReAct: language models that reason and act with tools |
| Schick | 2023 | Toolformer: models that teach themselves to use tools |
<!-- queue:end -->
