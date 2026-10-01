---
name: writing-for-agents
description: Writes, reviews, and updates agent instructions. Use when creating, reviewing, or improving skills, AGENTS.md, CLAUDE.md, or reference documents consumed by agents.
---

Reference for writing any document an agent consumes: a skill, an `AGENTS.md` / `CLAUDE.md`, a doc reached by a pointer. The packaging differs; the writing does not: the same levers make each one predictable, since the agent takes the same _process_ every run rather than producing the same output.

## Create, review, or update

Match the work to the request. A review reports findings without editing. An update includes inspection, scoped edits, and validation; existing authorization to update is enough to proceed.

1. **Inspect.** Read the target document and applicable repository instructions. For a skill, read [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md), inventory its supporting files, and inspect the references, scripts, and callers affected by the request. Identify its intended tasks, target hosts, invocation policy, and behavior worth preserving. Finish when each proposed change has enough context to assess its effect.
2. **Assess.** Apply the writing principles below and, for skills, the companion's authoring checks. Prioritize broken behavior, ambiguous instructions, missing branches, and stale references. Separate observed failures from untested concerns and optional preferences. Each finding needs a location, a concrete consequence, and a proposed correction. Mark conditional checks as inapplicable when appropriate.
3. **Act.** For review-only requests, return the findings in priority order and the validation limits. For creation or updates, make the smallest coherent change that fulfills the request. Preserve unrelated edits, supported metadata, useful constraints, and existing invocation policy. Keep references, examples, and source attribution in sync. Remove resources only after checking their callers and purpose.
4. **Validate.** Check the diff, local links, and any available format validator. Run changed executable helpers in a safe fixture when applicable. For behavior changes, use the evaluation guidance below in proportion to the change. Finish with what changed, why, checks actually run, and remaining uncertainty. A format check alone does not demonstrate better agent behavior.

## Evaluate changes

Before a substantial rewrite, define observable outcomes using representative requests. Start with a successful ordinary task, a conditional branch, and a nearby request that should not invoke the skill. For a narrow fix, use the reported failure and a relevant regression case. Define success by decisions and artifacts, not exact wording.

Compare the existing skill with the revision on the same cases. For a new skill, use behavior without it as the baseline. Use fresh contexts when execution is available, and test each intended model before claiming cross-model reliability. Observe selection, reference navigation, constraint preservation, completion, and failure recovery. Record the prompt, model, skill version, expected behavior, and observed result outside the production instructions.

If execution is unavailable, perform a static walkthrough and state that limitation. Keep proposed cases distinct from tests actually run. Revise from observed failures and rerun the affected cases; avoid expanding a local correction into a universal rule without evidence.

## Context pointers

A **context pointer** is a reference held in the agent's context that names some out-of-context material and encodes the condition for reaching it. A skill's description is one; a line in `AGENTS.md` naming a doc is the same object. The pointer's _wording_, not its target, decides when the agent reaches the material, and how reliably. A must-have target behind a weakly worded pointer is a variance bug: sharpen the wording first, and inline the material only if sharpening fails.

A pointer does two jobs: state what the material is, and list the **branches** that should trigger reaching it (a branch is a distinct case the document handles, so different runs take different paths through it). Every word of an always-loaded pointer costs on every turn, so it earns even harder pruning than the body:

- **Front-load the leading word**: the pointer is where it does its triggering work.
- **Cover each trigger branch.** Collapse redundant synonyms, but preserve wording that changes successful discovery across representative prompts.
- **Cut identity the body already carries.**

## The two loads

Every document and pointer you add spends one of two budgets:

- **Context load** is the cost of always-loaded material on the agent's window: an `AGENTS.md` line, a skill description, anything sitting in context every turn, spending tokens and attention whether or not it fires.
- **Cognitive load** is the cost on the human: which documents exist and when to reach for each. The human is the index. Not a cost to minimise: it is the price of human agency; spend it where human judgement matters, remove it where it does not.

Material reached only through a pointer escapes context load at the price of the pointer's own line; material with no pointer at all rides entirely on cognitive load.

## Information hierarchy

A document is built from two content types: **steps** (the ordered actions the agent performs) and **reference** (definitions, rules, facts consulted on demand). The two mix freely: all steps (a recipe), all reference (a review's rules, this skill), or both. The core decision is where each piece sits on the **information hierarchy**, a ladder ranked by how immediately the agent needs the material:

1. **In-file step** is the primary tier: what the agent does, in order.
2. **In-file reference** is consulted on demand. Often a legitimately flat peer-set (every rule of a review on one rung), which is a fine arrangement, not a smell.
3. **Disclosed reference** is pushed out into a separate file, reached by a context pointer, loaded only when the pointer fires. Spans a sibling file in the same folder through fully external reference that lives anywhere and any document can point at.

Push too little down and the top bloats; push too much and you hide material the agent actually needs. That tension is the whole decision.

**Progressive disclosure** is the move down the ladder (out of the main file and behind a pointer) so the top stays legible. Not primarily a token optimisation: it is how the hierarchy is protected. Branching is the cleanest disclosure test: inline what every branch needs, and push behind a pointer what only some branches reach. When a document has steps, in-file reference that should be disclosed buries them and turns attending to them into a coin-flip: a variance lever, not just a legibility one.

**Co-location** is the within-file companion: where the ladder decides _how far down_ a piece sits, co-location decides _what sits beside it_ once there. Keep a concept's definition, rules, and caveats under one heading rather than scattered, so reading one part brings its neighbours with it. The test: the document should read like documentation written for the agent. Grouped material reads that way; scattered material does not. (Distinct from duplication: that repeats one meaning in two places; scattering fragments one meaning across many.)

**Sprawl** is the failure mode here: a document simply too long, even when every line is live and unique. Attention thins across the excess, and every extra line is one more to keep relevant. The cure is the ladder: disclose reference behind pointers, and split by branch or sequence so each path carries only what it needs.

## Steps and completion criteria

Every step ends on a **completion criterion**, the condition that tells the agent the work is done. Two properties make it a lever:

- **Clarity**: can the agent tell done from not-done? A vague bound ("understanding reached") invites **premature completion**: ending the step before it is genuinely done, attention slipping to _being done_. The visible steps still ahead (the **post-completion steps**) supply the pull; the criterion's clarity is the resistance. Defend in order: **sharpen the bound first** (local and cheap); only if it is irreducibly fuzzy _and_ you observe the rush, hide the later steps by splitting the sequence. Hiding requires a context boundary that actually excludes later steps. A hand-off or subagent that inherits the full conversation still sees them; inspect what context is passed and test the effect.
- **Demand**: how much it requires. "Every modified model accounted for" forces thorough work where "produce a change list" does not. Demand drives **legwork** (the digging the agent does within the work, latent in the wording rather than written as its own step), and it is not step-bound: "every rule applied" binds a body of flat reference just as "every step done" binds a sequence, which is how an all-reference document still carries an exhaustiveness bar.

The strongest criteria are both checkable and exhaustive.

Set **procedural freedom** separately from the completion criterion. Specify the outcome when several methods work, a default with an escape condition when one usually fits, and an exact sequence when order or method determines correctness. For a fallible step, state how to inspect a failed check, repair the problem, and retry. Bound retries when repeated failure requires new information or further action would exceed the authorized scope.

## When to split

Splitting one document into two spends one of the two loads, so split only when the cut earns it:

- **By sequence**: split a run of steps where the post-completion steps tempt the agent to rush the one in front of it. Test whether excluding later steps improves work on the current task before keeping the split.
- **By invocation**, skill-specific: see [`SKILL-MECHANICS.md`](SKILL-MECHANICS.md).

## Leading words

A **leading word** is a compact concept already living in the model's pretraining that the agent thinks with while running the document (_lesson_, _fog of war_, _tracer bullets_). Repeated as a token, never as a sentence, it accumulates a distributed definition and anchors a whole region of behaviour in the fewest tokens, by recruiting priors the model already holds. Coining your own works if you define it clearly, but a made-up word recruits no priors: you pay in definition tokens what a pretrained word gives free; reach for an existing word first.

It anchors twice. In the body, _execution_: the agent reaches for the same behaviour every time the word appears, and inside flat reference it focuses attention on a class of thing to look for. In a pointer, _invocation_: when the same word lives in your prompts, your docs, and your codebase, the agent links that shared language to the material and reaches it more reliably.

Hunt for opportunities to refactor with leading words. A triad spelled out at three sites, a pointer spending a sentence to gesture at one idea. Each is a passage begging to collapse into a single token:

- Define a _tight_ loop once with its required speed, determinism, and overhead constraints; reuse the label where those requirements remain in context.
- "a loop you believe in" → _red_, turning a fuzzy gate into a binary observable state (the loop goes _red_ on the bug, or it doesn't).

Use leading words as shorthand for a defined requirement. Preserve measurable conditions, and test that compression retains the intended behavior. Familiar terminology can help, but its effect depends on the model and context.

**Positive instructions** name the desired behavior, such as "write one-line comments." Prefer them when they express the requirement clearly. Keep explicit prohibitions where they establish a necessary boundary, and pair them with the allowed action when useful. Treat claims about negation causing unwanted behavior as hypotheses to test, not a universal mechanism.

## Pruning

- Keep each meaning in a **single source of truth**: one authoritative place, so changing the behaviour is a one-place edit. **Duplication** (the same meaning in more than one place) costs maintenance and tokens, and inflates a meaning's prominence on the ladder past its real rank. (The accidental inverse of a leading word, which repeats a token on purpose, never the meaning.)
- The **environment** is a source of truth too (`package.json` scripts, config files, the directory layout, `--help` output), and a document that restates it is a **cache**: a copy of a lookup, earning its load only when the lookup is expensive. Cache what the agent cannot find by looking: the unwritten convention, the reason behind a choice, the gotcha no config confesses. Leave the one-file, one-command lookups to the environment, where they cannot go stale.
- Check every line for **relevance**: does it still bear on what the document does? A line loses relevance by never bearing on the task (mere exposition, or a branch that should be disclosed) or by going stale as the behaviour or world it describes changes. Shorter documents are easier to keep relevant. Without a pruning discipline the default fate is **sediment**: stale layers that settle because adding feels safe and removing feels risky, until you must core down through them to find what is still live.
- Hunt **no-ops** sentence by sentence: an instruction the model already obeys by default pays load to say nothing. The test (does it change behaviour versus the default?) is model-relative, not reader-relative: two people disagreeing about a no-op disagree about the default, and settle it by running the document, not by debate. When a sentence fails, delete the whole sentence rather than trim words from it. If the intended behavior is still missing, try a concrete criterion or different wording and compare the resulting behavior.
