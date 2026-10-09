# Skill adoption review

Reviewed on 2026-10-08. Subsequently adopted with your authorization:
`diagnosing-bugs`, `writing-for-agents`, `unslop`, `retro`, and `blast-radius`.
See [the catalog](skills/README.md) for current invocation settings. The rest of
this report preserves the recommendation evidence and pre-adoption assessment.

Start with Matt Pocock's `diagnosing-bugs`,
`writing-for-agents`, and `retro`, plus pstack's `unslop`. Add an adapted
`blast-radius` next. These address observed failures and preferences with a
manageable maintenance cost. No external skills were imported during the research
phase; the five listed above were imported in the subsequent adoption step.

## Coverage and limits

The query window was 2026-09-08 through the review on 2026-10-08, using UTC
message timestamps. The available histories only contained relevant messages
from October 3–8:

| Environment | Coverage | Limits |
| --- | --- | --- |
| Local machine | Six earlier threads, October 7–8; 57 user messages | The original pass reviewed 45 user messages outside the two Spellbook design threads and relevant assistant responses. This continuation reread those prompts and the design requests. The current resume thread is excluded from the totals. |
| Wrath | 13 threads containing messages, October 3–7; 32 user messages | Read all user messages and selected assistant responses, including the main debugging, deployment, documentation, and skill-maintenance outcomes. One additional empty thread was excluded. |
| Rize | Skipped with your authorization; no session history read | SSH through the supplied alias timed out twice on port 22. Tailscale ping succeeded; a connection to the LAN endpoint it reported also timed out. You instructed us to skip it if access did not work. |

The accessible databases contain 19 earlier threads and 89 user messages.
There were no shared thread IDs, message IDs, or identical user-message texts
between the local and Wrath samples. Related Thor and Spellbook threads still
represent continuing projects, rather than independent repetitions. In
particular, the long backup investigation should not dominate the ranking
merely because it needed many messages.

Queries used read-only SQLite connections. Wrath's Node 24 runtime provided
`node:sqlite`; Python was unavailable there. Raw history remains outside this
repository. Assistant reports of successful builds and deployments are session
evidence, not independently repeated operational checks.

All 38 Matt manifests and 51 pstack manifests were screened in the earlier
pass. This continuation deep-read the finalists and selected alternatives,
retrieved their supporting resources, and checked the MIT license notices.
This is selective review, not a full audit of every upstream skill or a test
of invocation behavior in each harness.

## Recommended first batch

The ordering weighs observed usefulness, new capability beyond the six authored
skills, and adaptation cost. The invocation settings below are recommendations
for Spellbook, rather than claims about identical behavior across harnesses.

| Rank | Skill | Session evidence | Adaptation |
| --- | --- | --- | --- |
| 1 | Matt: [diagnosing-bugs](https://github.com/mattpocock/skills/blob/b0618bc436ad893b3c5e84e55fba86586d34a404/skills/engineering/diagnosing-bugs/SKILL.md) | Backup SSH crossed container users, native SSH, permissions, and key availability. Wrath had separate CI, boot, activation, and skill-discovery investigations. | Moderate: add environment discovery and an infrastructure branch; keep model invocation. |
| 2 | Matt: [writing-for-agents](https://github.com/mattpocock/skills/blob/b0618bc436ad893b3c5e84e55fba86586d34a404/skills/productivity/writing-for-agents/SKILL.md) | You requested durable Thor instructions, then compression; requested CI regeneration guidance; and maintain customized skills here. | Small: retain its companion reference and qualify harness-specific invocation claims; keep model invocation. |
| 3 | pstack: [unslop](https://github.com/cursor/plugins/blob/ccb5507cec1546dc88135c1139c811e6c59115ba/pstack/skills/unslop/SKILL.md) | You repeatedly asked for essential, concise documentation. Wrath sessions also show it being used alongside commit and documentation work. Your authored `commit` already references it. | Small: resolve contradictory invocation wording and soften rigid punctuation rules; recommend model invocation for writing/editing and explicit loading by callers. |
| 4 | Matt: [retro](https://github.com/mattpocock/skills/blob/b0618bc436ad893b3c5e84e55fba86586d34a404/skills/engineering/retro/SKILL.md) | You asked for instructions that prevent stale generated CI workflows after a failure. Other sessions required corrections about the current host, headless operation, and available runtimes. | Small to moderate: replace the hardcoded Skill tool call and mandatory two-agent review assumptions; keep human-only invocation. |

For `diagnosing-bugs`, establish the current host, user, shell, available
runtimes, process or container boundary, and actual endpoint before testing
hypotheses. Distinguish configuration evaluation, build, activation, and live
behavior. A successful Nix build did not establish that agenix activation would
succeed on Thor. Prefer a bounded, read-only diagnostic probe on live systems;
stress loops and reproductions that mutate state need an appropriate isolated
environment. Allow evidence gathering when reproducing a boot or infrastructure
failure unattended is impossible. Its
[HITL template](https://github.com/mattpocock/skills/blob/b0618bc436ad893b3c5e84e55fba86586d34a404/skills/engineering/diagnosing-bugs/scripts/hitl-loop.template.sh)
waits for terminal input, so provide a mobile/headless observation path too.

For `writing-for-agents`, include
[SKILL-MECHANICS.md](https://github.com/mattpocock/skills/blob/b0618bc436ad893b3c5e84e55fba86586d34a404/skills/productivity/writing-for-agents/SKILL-MECHANICS.md).
The useful behavior is concise navigation, progressive disclosure, and
checkable completion criteria. Its statements about hidden descriptions and
cross-skill invocation should be treated as harness-specific assumptions and
verified before adoption. Instructions worth preserving here include the
source-record contract, Nix runtime constraints, and operational gotchas;
straightforward facts already available from scripts need less duplication.

For `unslop`, the manifest disables model invocation while the description says
it must always apply. Make that choice explicit locally. A caller such as
`commit` needs a portable way to load the file when there is no Skill tool.
Preserve code, literal commands, quotations, and necessary technical names.
Avoid converting its punctuation preferences into rules that make text harder
to read. Existing Codex writing instructions overlap with it; the benefit is a
shared standard across Codex, Claude, Pi, and authored caller skills.

For `retro`, keep the initial result as ranked improvement proposals. Inspect
existing checks before proposing more rules. The stale CI workflow incident
is a concrete opportunity to distinguish a missing check from a check that
already existed but was not run. Remove assumptions that every task has
separate implementation and reviewer agents. It complements `writing-for-agents`
by identifying improvements, while the latter guides how to express them.

## Next additions and larger ports

| Priority | Candidate | Why it fits | Work before adoption |
| --- | --- | --- | --- |
| Next | pstack: [blast-radius](https://github.com/cursor/plugins/blob/ccb5507cec1546dc88135c1139c811e6c59115ba/pstack/skills/blast-radius/SKILL.md) | You explicitly asked to inspect Hemera before changing the NAS SSH port. Secret recipient changes and generated workflow jobs also have effects beyond the edited file. | Moderate: make `why` and `arena` optional, load `unslop` portably, and allow relevant configuration/endpoint proofs without a required multi-model review. Keep human-only invocation. |
| Larger port | pstack: [recall](https://github.com/cursor/plugins/blob/ccb5507cec1546dc88135c1139c811e6c59115ba/pstack/skills/recall/SKILL.md) | You returned to backup work after SSH detours and requested history review across machines. | Replace Cursor transcript paths with a T3 SQLite reader, explicit host/window/topic selection, schema discovery, deduplication, and source citations. Remove mandatory delegation and unconditional `why` sweeps. Keep human-only invocation initially. |
| Larger port | pstack: [how](https://github.com/cursor/plugins/blob/ccb5507cec1546dc88135c1139c811e6c59115ba/pstack/skills/how/SKILL.md) | You asked how Disko supplies filesystem definitions, what recovery looks like, and what headless Sync changes. | Remove `.mdc` model configuration and fixed model names. Permit a direct answer for narrow questions. Retain its explanation references; treat Nix evaluation and live state as distinct evidence. Keep human-only invocation initially. |
| Per project | pstack: [create-verification-skill](https://github.com/cursor/plugins/blob/ccb5507cec1546dc88135c1139c811e6c59115ba/pstack/skills/create-verification-skill/SKILL.md) | You asked whether sync was correct, whether backups were actually active, how to trigger them, and where snapshots lived. | Generate a Nyx/Thor verifier using project-owned paths and real checks: units/timers, sync coverage, fresh snapshots, and isolated restore evidence. Port Cursor destinations and browser assumptions; retain feature-map references. Keep the generator human-invoked. |

`blast-radius` is a good fifth skill, but its current dependencies increase the
cost of importing it unchanged. Broaden its review boundary to service units,
ports, credentials, generated configuration, and other repositories explicitly
in scope. Report several independent safety conditions when needed, rather than
forcing an infrastructure change into a single decisive fact.

`recall` should distinguish prior agent claims from verified current state and
report unavailable hosts explicitly. Projection messages support goals and
decisions; they are insufficient by themselves to audit every tool action.
When a complete handoff already exists, use it before mining history. This
review supplies a useful future fixture: local Python and remote Node, shared
project names without shared IDs, and a reachable peer with unavailable SSH.

## Defer or avoid duplication

- Defer `architect`, `arena`, `swarm`, and `automate-me`. Their orchestration,
  model routing, and companion dependencies add substantial portability and
  maintenance work. The reviewed sessions do not establish that benefit.
- Prefer `retro` initially over pstack `correct`; propose specific improvements
  before giving a global skill a broad structural-fix mandate.
- Defer either collection's `tdd` and `teach` pending evidence from more
  application-development or learning sessions. Avoid importing colliding names.
- Keep authored `file-pr`, `babysit-pr`, and `summarization`. There is no strong
  reason from this sample to add overlapping PR or summary workflows.
- Matt's [handoff](https://github.com/mattpocock/skills/blob/b0618bc436ad893b3c5e84e55fba86586d34a404/skills/productivity/handoff/SKILL.md)
  is an optional small addition. Adapt its temporary-directory default to your
  requested destination and a discoverable path across remote sessions. It
  partially overlaps with `summarization`; this one resumed task alone is weak
  evidence for another global skill.
- Matt's `research` is a compact primary-source research recipe, but requires
  a background agent. Its core sourcing discipline can inform other skills
  without adopting another globally discoverable workflow yet.
- pstack `technical-writing` adds document-mode guidance, but overlaps with
  `unslop` and your existing preferences. Add it only if longer runbooks or
  reference documentation need that extra structure.

## Provenance and adoption requirements

This review uses the revisions already pinned by the handoff:

| Collection | Repository | Last reviewed upstream commit |
| --- | --- | --- |
| Matt Pocock | `https://github.com/mattpocock/skills` | `b0618bc436ad893b3c5e84e55fba86586d34a404` |
| pstack | `https://github.com/cursor/plugins` | `ccb5507cec1546dc88135c1139c811e6c59115ba` |

These recommendations concern those versions, not an assertion that their
branches have remained unchanged. Both collections have MIT notices, for
[Matt Pocock](https://github.com/mattpocock/skills/blob/b0618bc436ad893b3c5e84e55fba86586d34a404/LICENSE)
and [Lauren Tan](https://github.com/cursor/plugins/blob/ccb5507cec1546dc88135c1139c811e6c59115ba/pstack/LICENSE).
Preserve the applicable notice in each imported skill directory.

If adoption is requested, import the complete selected directories into
`skills/<name>/`, including required references/scripts; record repository,
upstream path, and full last-integrated SHA in `SOURCE.toml`. Keep local edits
in place and update `skills/README.md` by invocation settings. Validate the
result in each intended harness without changing daily-driver configuration
for installer tests. The subsequent adoption added the five approved skills;
no commit or PR was created.
