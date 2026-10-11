---
name: recall
description: Reconstruct recent working context from chat history, project records, and current state. Use for recall my work on X, catch me up, what have I been working on, or where did I leave off before resuming work.
disable-model-invocation: true
---

# Recall

Rebuild the user's working context and return a short brief of where things
stand and what to do next. Combine the user's chat history with the shared
record of prior fixes, reversions, incidents, and unresolved reports.

Recall is read-only. Suggest the next action; starting or resuming implementation
requires a request that authorizes it.

## Establish scope

Use a supplied state capsule first. If it already covers the request, skip
history mining and verify only the current-state claims that matter.

Pin the topic, workspace, and time window before searching. Default to the
active workspace and the last seven days, stating the actual date range.
Honor a requested full-history search; never silently replace all history with
a recent sample. Read another project's history only when asked.

A request to resume one specific chat needs that chat and its artifacts, rather
than a sweep across recent work. A request to capture habits belongs to
`automate-me` when available. A standalone summary belongs to
[../summarization/SKILL.md](../summarization/SKILL.md).

## Find and search chat history

Identify the executing harness, host, and history sources. Prefer exposed
history tools or supplied transcripts. Inspect available configuration and
session metadata to locate records; formats and roots can differ by installation.

- For Codex, check the configured Codex data directory for session records.
- For Claude Code, check its configured project history directory.
- For Pi, check its configured agent session directory.
- For T3 history, read
  [../why/references/sources/t3-history.md](../why/references/sources/t3-history.md).
  Use read-only database access and inspect the schema before querying.
- Cursor commonly stores transcripts at
  `~/.cursor/projects/<slug>/agent-transcripts/<uuid>/<uuid>.jsonl`.
  Its workspace slug drops the leading slash and replaces `/` with `-`.

Filter by workspace and date using metadata before reading message bodies.
Order candidates by recorded activity time, falling back to real modification
time; UUID names do not establish chronology. Exclude the current conversation
from historical mining, plus identifiable subagent, evaluation, and test chats.
Search the topic first, then read matching regions with enough surrounding
context to preserve decisions and corrections. Report missing history or
incomplete coverage; neither proves there was no work.

For each relevant chat, collect the topic, user's goal, decisions, open threads,
struggles and corrections, and artifacts such as PRs, tickets, and branches.
Cite the session or thread ID, date, and message or transcript location.
Distinguish user decisions from assistant claims. Deduplicate continuing threads
and copies of the same conversation.

Search directly by default. For a large corpus, delegate independent slices
only when available, authorized, and useful. Give each investigator a distinct
slice, the scope, exclusions, and the same findings contract above. Inherit the
current model unless another supported model is explicitly requested. Keep raw
transcripts out of the main context and return cited findings instead.

## Sweep the shared record

When the topic names a feature, file, subsystem, or bug, also search the relevant
project records. Ask: what is the current state, what was tried and failed or
was reverted, and what are users still reporting? Chat history alone can miss
work done by other people.

Use the evidence-source guidance in [../why/SKILL.md](../why/SKILL.md) and its
[source playbooks](../why/references/source-playbook.md), reading only the
playbooks relevant to this topic. This reuses investigation guidance, rather
than starting a separate rationale report. Check source control, linked PRs and
tickets, and relevant incident, document, chat, or error records that are
accessible within scope. Query independent sources concurrently when useful.
Record empty results and unavailable sources as coverage limits.

Skip this sweep for pure activity recall with no named target, such as
what did I do this week. History and current project state are enough for that
request. Use bounded read-only access; recall does not authorize external
messages, ticket changes, or production access.

## Verify current state

Check the surfaced branches, commits, PRs, tickets, and local changes using
`git`, authenticated `gh`, or available read-only host tools. Establish whether
changes are merged, open, reverted, or still local. Historical success claims
do not prove current behavior. Label uncommitted work as verified only when
there is evidence for the relevant checks and no later changes invalidate it.

When a conclusion hinges on tools an agent ran, files it read, or errors it hit,
consult the full relevant transcript and tool outputs. A projected or trimmed
chat may omit them. Report the gap if the full record is unavailable.

## Return the brief

Group by thread and stay on the named topic. Include adjacent work only when it
blocks this work. Lead with the state capsule, then thread status, problems, and
the next move. Cut detail before dropping relevant threads.

- Capsule: at most five bullets describing the work and its overall state.
- Threads: one line each with an evidence-backed tag: `[merged #N]`,
  `[open PR #N]`, `[in flight <branch>]`, `[verified, uncommitted]`,
  `[reverted #N]`, or `[planned, not started]`. Use `[unverified]` when evidence
  cannot establish one of these states, and name the missing check.
- Problems: at most five recurring issues, including reported symptoms and
  fixes that failed or were reverted. Include material coverage gaps.
- Next move: the single most useful concrete action, accounting for blockers.

Cite chat findings by their session or thread identifiers and shared-record
findings by PR, ticket, document, or incident link. Apply
[../unslop/SKILL.md](../unslop/SKILL.md) to the wording. Keep private context in
the current conversation unless sharing is requested; sanitize it before any
public output.
