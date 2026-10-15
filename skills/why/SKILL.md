---
name: why
description: "Use for 'why does X work this way', 'why we picked Y', design rationale, regressions, postmortems, or data-backed thresholds. Traces code and source control history, follows relevant leads into available evidence sources, and returns cited decisions and tradeoffs with explicit confidence and coverage gaps. Use how for runtime behavior."
disable-model-invocation: true
---

# Why

Investigate the motivation and intent behind code. The companion `how` skill answers what the code does and how it works. `why` answers what forces led to its shape.

Read [agent usage](~/.agents/references/spellbook/agent-usage.md) before
starting. Investigate and synthesize inline on the current session model by
default. Do not write files or modify external state. Tool access and permission
modes vary by harness; use available read capabilities rather than Cursor-specific
Task settings.

## Operating Posture

Operate as a **careful, cautious, and precise investigator**. Be honest about what you know vs what you're inferring. Read `references/epistemics.md` for the full confidence framework and phrasing guide. Follow it during investigation and synthesis.

## Step 1. Understand the Target and the Question

The **target** is usually a chunk of code, a pattern, a feature, or a named design decision. The **question** is usually a design rationale, a tradeoff, a motivating edge case, an external constraint, dead code, or a broad history sweep.

If the target is vague ("why do we do it this way?" with no clear referent), make your best guess from conversation context (open files, recent edits, cursor location, what was just discussed). State your interpretation briefly so the user can redirect if you're off, then proceed.

## Step 2. Establish the Code Anchor

Build a compact seed context inline: file paths and line ranges, key symbols (functions, classes, constants), the last few commits touching the target, PR numbers from merge commits (pattern `(#1234)` in the subject line), and any linked ticket IDs. Use targeted history queries as needed: `git blame -L <start>,<end> <file>` for last-touch commits, `git log --follow -p -- <file>` for full history with patches through renames, `git log --oneline -20 -- <file>` for recent commits with PR numbers visible, and `git log -1 --format=%B <commit>` to extract PR numbers. For substantive commits bearing on the question, retrieve PR bodies and discussion when an authenticated GitHub CLI is available: `gh pr view <number> --json title,body,author,createdAt,mergedAt,labels,closingIssuesReferences,comments,reviews`. Keep the anchor for synthesis and share it only with investigators the user explicitly requests. Git history may be shallow or absent, and GitHub access may be unavailable; record those limitations rather than assuming access.

## Step 3. Investigate relevant evidence

Start with source control history and in-repository evidence. Read
`references/source-playbook.md` for the source index and load only the playbooks
needed for the question. Use `references/investigator-prompt.md` as the evidence
checklist, without generating an intermediate report for every source.

Follow relevant linked PRs, tickets, docs, or discussions. Discover additional
read tools from the harness's available tool descriptions when a lead or an
unanswered material question warrants another source. Do not inspect a
Cursor-specific MCP directory or assume a connector exists. Tool names in the
playbooks are examples; use the actual available tool schemas. The `how` skill
is optional context for runtime behavior, not a required extra invocation.

Consider these evidence categories when deciding where a missing answer might live:

1. **Source control history**: implementation-time rationale in commits, PRs, comments, and tests.
2. **Issue / ticket tracker**: product or business forcing functions.
3. **Long-form documents**: design rationale and alternatives considered.
4. **Real-time team chat**: deliberation that never reached a document.
5. **Infrastructure observability**: runtime constraints, incidents, timeouts, and rate limits.
6. **Error / exception tracking**: exceptions that motivated defensive or corrective code.
7. **Product analytics warehouse**: experiments, usage, migrations, and data-backed thresholds.

For defensive code (null checks, retries, timeouts, rate limits, feature flags,
egress guards, OOM handlers), also read `references/sources/incident-postmortem.md`
and search relevant available evidence around the change's date. Defensive code
is a reason to consider incident evidence, not an automatic search of every service.

Bound searches by target, symbols, authors, or dates. Expand when a concrete lead,
contradiction, or material gap warrants it. Stop when the question is adequately
supported or the remaining uncertainty can be stated honestly. If the PR already
answers a narrow question, cite it and report the limited coverage.

Maintain a compact coverage map for all seven categories. Distinguish searched
(including empty results), unavailable, and available but not searched. Give the
actual scope reason for an unsearched source; do not claim it was irrelevant or
unavailable merely because the answer was found elsewhere. Lack of access is a
gap, and an unsearched source is not an empty search.

Only if the user explicitly requests delegation, give each investigator a
bounded source and the relevant template, playbook, anchor, and question. Keep
the same coverage and confidence rules, use available harness capabilities,
and follow the shared usage policy. An investigation request by itself does
not authorize additional agents.

## Step 4. Synthesize

Synthesize inline using `references/synthesizer-prompt.md` as the writing guide,
together with the evidence, code anchor, original question, coverage map, and
`references/epistemics.md`. Verify uncertain citations against the actual source.
Do not spawn a separate synthesizer by default.

## Step 5. Present

Preserve the confidence language when presenting findings. Keep the distinction
between historical evidence and a plausible explanation of the current code.

## Output Format

Use the structure in `references/synthesizer-prompt.md`: The Question, The Code
in Question, What We Found, What We Can Reasonably Infer, Competing Hypotheses,
What We Don't Know, Sources Consulted, Confidence Summary. Scale detail to the
question and omit inapplicable inference or hypothesis sections. Keep confidence
separation, specific gaps, and one coverage entry per evidence category, including
unsearched sources and the reasons.

If the user's `why` question is a precursor to changing this code, convert the
lineage findings into a Preserve / Change / Avoid / Risk constraint set for
planning the change.

## Common Failure Modes to Avoid

- **Recency bias**. Assuming the most recent commit is authoritative. The current shape is often the accretion of many earlier decisions. Trace back.
