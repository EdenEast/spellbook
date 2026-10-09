---
name: automate-me
description: "Draft or update a personal -mode skill from working conventions and scoped conversation evidence. Use when explicitly asked to automate me, refresh a personal mode skill, or capture preferences in a skill."
disable-model-invocation: true
---

# Automate me

Turn the user's working conventions into one personal `-mode` skill. Run this
workflow only on an explicit request. Adding or installing `automate-me` does
not start a history review or create a personal mode skill.

This copy is repository-only. Its canonical directory is
`.agents/skills/automate-me/`; `.claude/skills/automate-me` links here. Global
installers only read `skills/`, so this skill stays local. Resolve the loaded
directory's symlink before following relative references below.

## Check for an existing mode

Find matching `*-mode/SKILL.md` files in this repository's `skills/` and active
project skill locations. Inspect the active harness's personal skill directory
only when personal placement or an existing personal mode is in scope. Use the
user's stated handle, or ask for one when it affects the name or destination.

Preserve an existing mode's location. Treat a refresh or update request as
permission to revise it; ask about replacement only when the request leaves that
choice unclear. Preserve rules the user has not contradicted. For a tracked
mode, use `git log -1 --format=%cI -- <path>` to establish the previous edit's
history cutoff. Use the user's requested window when provided, and state gaps
when the cutoff or history is unavailable.

## Gather evidence

Start with the current conversation, supplied handoffs, and relevant repository
instructions. When recent history is part of the request, establish the project,
host, topic, and time window before reading stored sessions. Use a supplied
workspace transcript directory or discover the active harness's project-scoped
history. Do not search unrelated projects' conversations.

For T3 sessions, read
[the T3 history guide](../../../skills/why/references/sources/t3-history.md). Open databases
read-only, inspect their schema, filter project/thread metadata before messages,
and deduplicate continuing tasks. Record coverage and source gaps. Keep raw
session exports outside this repository.

Look for recurring preferences about:

- Response length, tone, and format, especially user corrections.
- Autonomy and when to ask for clarification.
- Delegation, model selection, and specialized workflows.
- Verification and what the user considers finished.
- Code and prose conventions.
- Worktrees, commits, pull requests, and review.
- Skill selection, authoring, and maintenance.

Separate user instructions from assistant suggestions. A current explicit
preference can stand on its own; an inferred preference needs repeated,
independent evidence. Check contradictions and avoid counting related sessions
as independent confirmations. Keep concise evidence pointers for proposed rules.

Investigate directly by default. Delegate history slices only when the user or
applicable instructions authorize delegation, giving every worker the same
source boundaries. Missing history is a coverage limit, not a reason to invent
preferences or block drafting from supplied evidence.

## Ask about intent and changes

Ask one or two focused questions about gaps that affect the draft. Use the active
harness's structured question tool when available, or concise chat questions.
Offer relevant choices rather than a long questionnaire. For an update, ask
what changed or is missing instead of repeating a full interview. Continue
independent evidence review while waiting for answers; do not treat silence as a
new preference.

## Draft the mode

Use the active harness's skill-authoring guidance when available, such as
`skill-creator`; otherwise read
[writing-for-agents](../../../skills/writing-for-agents/SKILL.md) and its linked skill mechanics.
There is no required Cursor authoring tool or external example mode.

In Spellbook, default to repository-only output in
`.agents/skills/<handle>-mode/`, with `.claude/skills/<handle>-mode` linking to
that directory. Use `skills/<handle>-mode/` for a globally installed skill only
when requested. For another repository, follow its established skill layout.
Use personal placement only when the user requests it.

Use lowercase letters, digits, and hyphens for the handle. Keep the frontmatter
`description` a single YAML scalar, quoting it or using `>-` when needed. Trigger
on the handle and requests to work in that user's style, rather than generic
coding or review keywords. Preserve an existing invocation policy. New modes
are explicitly invoked by default with `disable-model-invocation: true` and,
for Codex, `agents/openai.yaml` containing
`policy.allow_implicit_invocation: false`. Enable implicit invocation when the
user requests it.

Group only the rules supported by evidence. Possible sections include response
style, autonomy, investigation, delegation, code and prose, verification,
process, and skills. Skip sections without specific preferences. Write
operational instructions using "the user" rather than the author's name.
Reference existing skills and principle documents instead of copying them.

## Review and finish

Apply [unslop](../../../skills/unslop/SKILL.md) through the harness's skill mechanism or read
it directly. Keep meaning, commands, identifiers, and useful technical vocabulary.
Show the draft with a short account of its evidence and open questions. Revise
from feedback without forcing a fixed number of rounds.

Validate frontmatter, relative references, invocation policy, placement, and
repository discovery. In Spellbook, update `skills/README.md` and confirm a
repository-only output is excluded from both global installers. Report whether
validation was static or included a real invocation.

Completion means the requested mode is drafted or updated in the agreed scope,
its rules have evidence, and remaining uncertainties are visible. Create a
commit or pull request only when that action is requested. A request to capture
preferences does not itself request a commit, push, or publication.

For a task-specific skill or one narrow workflow, use skill-authoring guidance
directly instead of building a personal mode.
