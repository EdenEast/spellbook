---
name: how
description: Explain subsystem architecture, runtime flow, and ownership from the actual code. Use for how something works, code walkthroughs, and placement or layering questions.
disable-model-invocation: true
---

# How

Explore the codebase to answer how something works. Build a working mental model
for an engineer unfamiliar with the subsystem. Use `why` for historical rationale;
current behavior alone does not establish the author's intent.

## Scope and environment

If the referent is unclear, use the conversation and repository state to pick a
reasonable scope, state it briefly, and explore. Match depth to the question.
A small utility usually needs one direct pass; a cross-service subsystem may
need separate exploration angles.

Identify the executing host, checkout, and available tools before choosing
commands. On NixOS, prefer the project's declared tooling. Distinguish source
configuration from evaluated configuration and from the running deployment.
Read an existing glossary for terminology, without expanding this explanation
into a domain-model rewrite.

## Explore

Do the exploration yourself by default. Read
[references/explorer-prompt.md](references/explorer-prompt.md) for a substantial
or unfamiliar subsystem; use its entry-point, flow, boundary, and evidence
checklist as working notes.

For complex questions, divide exploration by real boundaries, such as request
entry, state/storage, and external services. Use the harness's delegation tools
only when available, authorized, and helpful. Give each investigator a distinct
angle, the original question, and read-only scope. Inherit the current model
unless the user or environment instructions specify another supported model.
If delegation is unavailable, investigate the same angles directly.

Use available file and search tools, preferring `rg --files` and `rg` in a shell.
Trace the implementation instead of inferring behavior from names. Observe
runtime state only within the request's scope. If a browser observation is
useful in T3 Code, use its `preview_*` tools: check `preview_status`, open a
preview if needed, and inspect with `preview_snapshot`. Prefer snapshot locators
for any authorized interaction. Explain missing access instead of inventing a
running-system result.

## Explain

Use [references/explainer-prompt.md](references/explainer-prompt.md) to shape
substantial explanations, using your own notes or delegated findings. Reconcile
contradictions against the source and check key citations yourself.

Lead with the behavior the user asked about. Trace what triggers it, where data
flows, and which boundaries matter. Cite the key files and symbols; keep the
file map small. A diagram is useful when it clarifies a multi-component flow.
Use only applicable sections: overview, key concepts, how it works, where things
live, and gotchas. A narrow question may need only a paragraph.

Load `unslop` or read [../unslop/SKILL.md](../unslop/SKILL.md) for the wording.
Keep uncertainty and material limits intact. An explanation request authorizes
investigation, not code changes, deployments, or external messages.
