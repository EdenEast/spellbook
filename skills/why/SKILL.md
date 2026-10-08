---
name: why
description: Investigate design rationale, trade-offs, regressions, and the origin of constraints using source history and relevant records. Return cited findings with explicit confidence and gaps. Use how for runtime behavior.
disable-model-invocation: true
---

# Why

Investigate the motivation and intent behind code. `how` explains current
behavior; this skill asks which decisions and constraints led to that behavior.

Read [references/epistemics.md](references/epistemics.md) before forming an
answer. Separate direct evidence, supported conclusions, inference, speculation,
and unknowns. A current implementation does not prove its own historical intent.

## Establish the target

Use the user's question, conversation, and actual repository state to identify
the files, symbols, decision, and relevant period. State a reasonable
interpretation when needed. Find the executing host and checkout before choosing
local or remote commands; inspect available runtimes rather than assuming them.

Anchor the investigation in the relevant code and history. Useful commands:

```sh
git blame -L <start>,<end> -- <file>
git log --follow -p -- <file>
git log --oneline -20 -- <file>
git log -1 --format=%B <commit>
```

Inspect commit messages, patches, linked tickets, and PR discussions. Use `gh`
when available and authenticated, a connected host tool, or an accessible
read-only API. Git history can be shallow and a directory may not be a checkout;
report those limits. Load
[references/sources/code-archaeology.md](references/sources/code-archaeology.md)
for deeper history work.

## Discover and choose evidence sources

Inspect the tools and connected sources exposed by the current harness. Use its
tool discovery/search mechanism when provided; resource listings are a fallback
for resource-based servers. Discover connectors through their app tools, not
resource listings. Tool names in the playbooks are examples, not guaranteed APIs.
Inspect the callable schema before querying. An unauthenticated or unavailable
source is a gap; continue with the accessible evidence.

Read [references/source-playbook.md](references/source-playbook.md) to select
relevant categories: source control, tickets, documents, team chat, observability,
error history, product analytics, or agent session history. Use only the
corresponding playbooks. Consider all categories for a broad historical review;
for a narrow question, start with the code anchor and the sources most likely to
answer it. Expand when the evidence is incomplete or contradictory. Record which
sources were searched, empty, inaccessible, or outside scope. A missing connector
does not imply there are no local documents or command-line sources.

Read [references/sources/incident-postmortem.md](references/sources/incident-postmortem.md)
when defensive code may have originated in an incident. When prior agent work
is relevant, read
[references/sources/t3-history.md](references/sources/t3-history.md) for scoped
T3 history access. Use the current conversation or supplied handoff first.

## Investigate

Research directly by default. Use
[references/investigator-prompt.md](references/investigator-prompt.md) as the
working evidence contract. Search the user's target and date range, read
relevant discussions in context, follow useful leads, and record contradictions
and null results. Keep excerpts short and redact secrets or private details.

For a broad investigation, independent source queries can run concurrently.
Delegate by source only when the harness supports it and delegation is
available, authorized, and useful. Provide the original question, code anchor,
matching playbook, and read-only scope. Inherit the current model unless another
supported model is explicitly specified. Do not weaken permissions to obtain
connector access. Without delegation, collect the same evidence yourself.

Investigation does not authorize sending messages, changing tickets, modifying
files, running deployments, or executing data mutations. Use bounded read-only
queries and existing authorization. In T3 Code, if the current task involves
working on a PR, register it with `link_pull_request` when available and audit
with `list_thread_pull_requests` before finishing. Historical PRs cited only as
background are not thread work.

## Synthesize and present

Use [references/synthesizer-prompt.md](references/synthesizer-prompt.md) with your
own evidence notes or delegated findings. Verify key citations, reconcile
contradictions without hiding them, and preserve confidence language. Load
`unslop` or read [../unslop/SKILL.md](../unslop/SKILL.md) to edit prose without
turning an inference into a fact.

Lead with the answer the evidence supports. For a substantial investigation,
include the code anchor, direct/supported findings, reasonable inferences,
competing hypotheses when needed, gaps, sources consulted, and confidence.
For a narrow answer, compress the format while keeping citations, confidence,
and material gaps explicit. Sources consulted should describe actual coverage,
not a boilerplate list implying every source was searched.

If the user is preparing a change, turn relevant history into concrete preserve,
change, avoid, and risk constraints. Keep the result an investigation unless
implementation was also requested.
