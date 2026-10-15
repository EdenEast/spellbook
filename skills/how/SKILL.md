---
name: how
description: "Use for \"how does X work\", code walkthroughs before changing something, and placement / ownership / layering questions (\"where should this live\", \"which package owns this\", \"is this the right layer\"). Explains subsystem architecture, runtime flow, onboarding mental models. Use why for motivation."
disable-model-invocation: true
---

# How

Explore the codebase to answer "how does X work?" questions. Produce architectural explanations at the level of a senior engineer onboarding onto a subsystem, enough to build a working mental model, not so much that it reads like annotated source code.

Read [agent usage](~/.agents/references/spellbook/agent-usage.md) before
starting. Work inline on the current session model by default. This is an
investigation and explanation workflow; do not modify the codebase.

## 1. Assess complexity

If the scope is ambiguous, state your interpretation and explore. The user can redirect.

- **Simple** (a single module, a small utility, a narrow question such as "how does function X work"): explore and explain in one pass using `references/explainer-prompt.md` as the writing guide. Omit the explorer-findings section. Go to step 4.
- **Complex** (a subsystem spanning multiple files or services, a cross-cutting feature, a full architectural overview): go to step 2.

When in doubt, take the simple path.

## 2. Explore (complex only)

Decompose the question into 2 to 4 angles, each a distinct slice of the subsystem.
Trace the relevant angles inline using `references/explorer-prompt.md` as a
checklist. Keep findings compact; do not produce separate reports merely to
feed them back to yourself. Stop tracing an angle once its flow and boundaries
are supported well enough to answer the question.

If the user explicitly requests delegation, use the explorer template for each
requested slice. Use available harness capabilities, keep the investigation
read-only, and follow the shared usage policy. Delegation does not require a
separate explainer agent.

## 3. Synthesize (complex only)

Reconcile the findings inline using `references/explainer-prompt.md`. Check
contradictions against the code and mark any unresolved gaps.

## 4. Present

Write the explanation directly. When delegated findings exist, incorporate
them without repeating their full reports.

## Output format

The explanation uses the sections defined in `references/explainer-prompt.md`, dropping any that do not apply: Overview, Key Concepts, How It Works, Where Things Live, Gotchas.
