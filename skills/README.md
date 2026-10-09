# Skills

Skills are grouped by invocation settings. Human-only skills explicitly disable
model invocation with `disable-model-invocation: true`. Model-invokable skills
can be selected by the agent when their descriptions match the task, and can
also be requested by name. Invocation syntax depends on the harness.

Model invocation does not override a skill's requirement for a user request or
authorization to perform an action.

Shared decision guidance lives in the [reference catalog](../references/README.md).
Its [principles](../references/principles/README.md) are loaded through global
instructions and can be named by the user during any task. They are ordinary
reference documents, separate from skill invocation and discovery.

The six authored skills (`babysit-pr`, `commit`, `file-pr`, `html-communication`,
`postplan-read`, and `summarization`) include `agents/openai.yaml` display names
and short descriptions for Codex. They retain default implicit invocation;
their instructions still define when a user request is required. This metadata
follows the [OpenAI skill format](https://learn.chatgpt.com/docs/build-skills).

## Human-invokable only

These imported skills retain `disable-model-invocation: true` and Codex's
`policy.allow_implicit_invocation: false`. Enforcement depends on the harness;
their instructions require an explicit request for their workflow.

| Skill | Description | Use cases |
| --- | --- | --- |
| [automate-me](../.agents/skills/automate-me/SKILL.md) | Draft or update a personal mode skill from working conventions and scoped conversation evidence. Repository-only; excluded from global installers. | When explicitly asked to capture preferences, automate me, or refresh a personal mode. Uses `writing-for-agents`, `unslop`, and the T3 history guide when needed. |
| [blast-radius](blast-radius/SKILL.md) | Review effects beyond a diff and verify the conditions a change's safety depends on. | When asked what a change could break, including cross-service contracts, ports, secret recipients, or generated configuration. |
| [bro](bro/SKILL.md) | Restate the last assistant message in simpler, concise language. | When an explanation is too dense or jargon-heavy. Preserves commands, citations, meaning, and uncertainty. |
| [create-verification-skill](create-verification-skill/SKILL.md) | Generate and prove a project-local verification skill with a maintained feature map. | When explicitly asked for an app, CLI, service, library, or infrastructure verifier. Includes feature-map examples and portable authoring guidance. |
| [grill-me](grill-me/SKILL.md) | Interview you to sharpen a plan, decision, or idea. | When you want to stress-test your thinking without generating domain documentation. Loads `grilling`. |
| [grill-with-docs](grill-with-docs/SKILL.md) | Interview you while recording settled domain language and significant design decisions. | Design discussions that should produce or update a glossary and ADRs. Loads `grilling` and `domain-modeling`. |
| [how](how/SKILL.md) | Explain architecture, runtime flow, and ownership from actual source and configuration. | Code walkthroughs, how something works, and where responsibility belongs. Supports direct investigation and optional authorized delegation. |
| [maintain-verification-skill](maintain-verification-skill/SKILL.md) | Check a verification skill and feature map against source and live behavior, correcting verified drift. | When explicitly asked to audit or maintain a verifier. Covers every mapped feature, reports blockers, and keeps product fixes outside the maintenance pass. |
| [retro](retro/SKILL.md) | Review a session and propose evidence-based improvements to agent instructions, tooling, and checks. | When asked for a retrospective or how to prevent recurring mistakes. Implementation requires that work to be in scope. |
| [technical-writing](technical-writing/SKILL.md) | Structure technical documents and edit sentences for clarity, precision, and an international audience. | When explicitly asked to write or review tutorials, how-to guides, reference docs, explanations, RFCs, README files, PR descriptions, or commit messages. Uses `unslop`. |
| [teach](teach/SKILL.md) | Combine runtime behavior and design rationale into a plain explanation at your requested depth. | Learning a change or subsystem. Uses `how` and `why` as needed without mandatory subagents or fixed models. |
| [why](why/SKILL.md) | Investigate design rationale and constraints with cited historical evidence, confidence tiers, and explicit gaps. | Why a design was chosen, origins of defensive code or thresholds, and preparing changes that preserve earlier constraints. Can read scoped T3 session history when relevant. |

## Model-invokable

All of these skills can also be invoked by a human.

| Skill | Description | Use cases |
| --- | --- | --- |
| [babysit-pr](babysit-pr/SKILL.md) | Monitor a pull request through review and CI, investigate feedback, and address verified issues. | When asked to watch a PR, fix failing checks, or handle review-bot feedback until the PR is ready. Merging requires an explicit request. |
| [commit](commit/SKILL.md) | Create Git or Jujutsu commits, or draft commit messages, using Conventional Commits and appropriate attribution. | When asked to commit changes, suggest a message, or describe a Jujutsu change. A request for a message alone does not create a commit. |
| [diagnosing-bugs](diagnosing-bugs/SKILL.md) | Diagnose bugs, regressions, and infrastructure failures with symptom-specific checks and competing hypotheses. | Broken behavior, slow operations, CI failures, SSH or backup issues, and deployment failures across evaluation, build, activation, and live behavior. |
| [domain-modeling](domain-modeling/SKILL.md) | Sharpen domain terminology, check it against the code, and document settled concepts and decisions. | Resolving overloaded terms, maintaining `GLOSSARY.md`, and recording significant trade-offs in ADRs. Document edits must be in scope. |
| [file-pr](file-pr/SKILL.md) | Create a concise pull request with a problem-focused title and description, checking for an existing PR and the intended base first. | When asked to open a PR or prepare completed work for review. |
| [grilling](grilling/SKILL.md) | Stress-test a plan through rounds of questions ordered by their dependencies. | When asked to grill an idea or clarify a design; also used by both grilling entrypoints. |
| [html-communication](html-communication/SKILL.md) | Produce a self-contained, mobile-readable HTML document and publish it through Postplan. | When asked for an HTML plan, specification, findings report, comparison, or UI mock variants. Applies to communication documents, not product HTML. |
| [postplan-read](postplan-read/SKILL.md) | Fetch and read a Postplan document through its raw HTML endpoint. | When the user provides a `postplan.dev` URL to read, review, summarize, or use as context. |
| [summarization](summarization/SKILL.md) | Summarize content accurately for its audience and purpose, preserving important facts, uncertainty, and decisions. | When asked for a TL;DR, executive summary, technical overview, meeting recap, research summary, or changelog. |
| [unslop](unslop/SKILL.md) | Edit prose to remove filler, vague claims, AI writing patterns, and unnecessary jargon. | Drafting or revising documentation, explanations, commit messages, and PR descriptions; also loaded by companion skills. |
| [writing-for-agents](writing-for-agents/SKILL.md) | Write concise agent instructions with useful context pointers and checkable completion criteria. | Creating or editing skills, `AGENTS.md`, `CLAUDE.md`, and references consumed by agents. |

## Repository-only scope

Local discovery follows `<harness>/skills/<name>/SKILL.md`, with uppercase
`SKILL.md`. Repository-only skills live directly in `.agents/skills/`, with
Claude Code discovery links pointing to them:

```text
.agents/skills/automate-me/SKILL.md
.claude/skills/automate-me/ -> ../../.agents/skills/automate-me
```

Codex and Pi discover the `.agents/skills/` path; Claude Code discovers the
`.claude/skills/` path. Both resolve to the same `SKILL.md`. The checkout
installer and Home Manager read only `skills/`, excluding these local skills
from global installation.

## Dependencies

- `create-verification-skill` uses `writing-for-agents` and `unslop`, includes
  feature-map examples, and points to `maintain-verification-skill` for upkeep.
  Maintenance uses `unslop` and the generator for proof standards; companion
  loading has relative file fallbacks. Browser and terminal tools come from the
  active harness and target project, with no mandatory delegation or PR creation.

- `automate-me` uses `writing-for-agents` and `unslop`, with relative file
  fallbacks. Scoped T3 history review uses the guide included with `why`;
  unavailable history does not prevent drafting from supplied evidence.

- `teach` uses the included `how` and `why` skills; all four new pstack skills
  use `unslop`. Companion loading has relative file fallbacks.
- `how` includes exploration and explanation references. `why` includes
  confidence, investigation, synthesis, source playbooks, and a T3 history guide.
  External source access is optional and discovered from the active harness;
  there is no required connector, model-routing file, or delegation API.
- `grill-me` uses `grilling`; `grill-with-docs` uses `grilling` and
  `domain-modeling`. Both entrypoints include relative file pointers for
  harnesses without a skill invocation tool.
- `domain-modeling` includes glossary and ADR format references and follows
  existing repository documentation conventions where present.
- `commit`, `retro`, `blast-radius`, and `technical-writing` use the included
  `unslop` skill. `technical-writing` includes a relative file fallback.
- `retro` uses the included `writing-for-agents` skill. Imported callers provide
  relative file pointers when the harness has no skill invocation tool.
- `diagnosing-bugs` includes a Bash template for observations in an interactive
  terminal; chat-based observations are supported for headless/mobile sessions.
- `html-communication` requires the Postplan CLI for publishing.
- `postplan-read` uses `curl` and `mktemp` to retrieve documents into unique
  temporary files.
