# Spellbook handoff — 2026-10-08

## Continuation on 2026-10-08

The user subsequently authorized adopting the listed skills. Five external
skills now live in `skills/`: `diagnosing-bugs`, `writing-for-agents`, `unslop`,
`retro`, and `blast-radius`. Each includes pinned `SOURCE.toml` provenance and
the applicable MIT notice. Supporting resources were retained; local adaptations
remove mandatory orchestration and add infrastructure/headless handling and
portable companion loading. `retro` and `blast-radius` retain explicit-only
invocation; the other three allow model invocation. The catalog and the authored
`commit` skill's `unslop` pointer were updated. No harness home configuration was
changed and no commit or PR was created.

Adoption validation passed: manifests and explicit-only policies, source records,
licenses, relative references, catalog entries, Bash template syntax/smoke check,
and temporary-home install/dry-run/uninstall across all three targets. There are
now 11 skills. `npm run check` and all seven installer tests passed. The bundled
skill validator does not recognize `disable-model-invocation`; that boolean and
its matching Codex policy were checked separately, and the remaining manifest
was validated in a temporary compatible copy. Live harness invocation was not
tested.

The recommendation report is now in [SKILL_REVIEW.md](SKILL_REVIEW.md). Wrath's
13 message-bearing threads were reviewed, including all 32 user messages and
selected assistant outcomes. The accessible local and Wrath databases had no
shared thread or message IDs. Rize responded to Tailscale ping, but SSH timed
out on port 22 over both Tailscale and its reported LAN endpoint; its history
has not been reviewed. The user explicitly authorized skipping Rize if access
did not work, so the recommendation review concludes with that coverage limit.

The report recommends an initial batch of `diagnosing-bugs`,
`writing-for-agents`, `unslop`, and `retro`, then an adapted `blast-radius`.
`recall` and `how` need larger ports; operational verification belongs in a
project-specific skill. Supporting resources and license notices for the main
candidates were retrieved and inspected at the pinned revisions below. No
skills were imported and no TypeScript tooling changed in the continuation.

The rest of this document preserves the earlier handoff and its original
research state. Use the report for the current recommendations and coverage.

The active task is to recommend which Matt Pocock and pstack skills Eden should
adopt, based on recent T3 Code sessions across this machine, **rize**, and
**wrath**. Research is incomplete. No external skills have been imported during
this review, and no final shortlist has been presented. The latest request was
to write this handoff; resume the research when asked.

## Project direction and completed implementation

Spellbook is being rewritten as a global skill collection for Codex, Claude
Code, and Pi. T3 Code is the usual frontend and orchestrator; execution often
happens on remote NixOS machines, with access from a phone.

The user explicitly chose a simple structure:

- All skills live in `skills/<name>/`, regardless of origin.
- Imported skills have `SOURCE.toml` recording `repository`, `path`, and the full
  upstream `commit` last integrated. Local edits live directly beside that file.
- Reconstruct upstream versions from those records in an external cache. Do not
  commit upstream snapshots or generated patch files.
- Pi-specific content lives under `pi/`; maintained extensions go in
  `pi/extensions/`.
- Start with an empty extension collection and selectively readopt external
  skills, rather than carrying all previous content forward.

The working tree already contains substantial **uncommitted** rewrite changes.
The many deletions under `source/` and the old installer paths are intentional;
do not undo them or treat them as accidental research changes.

Implemented:

- `scripts/install.ts`: install, uninstall, status, dry-run, target selection,
  conflict preflight, and removal of stale links owned by this checkout.
- Codex and Pi skills link into `~/.agents/skills/<name>`; Claude skills link into
  `~/.claude/skills/<name>`. Selecting either Codex or Pi affects their shared
  skill links.
- Pi extensions link into `~/.pi/agent/extensions/spellbook-<name>`.
- A Home Manager module exposes `programs.spellbook` and per-resource links.
- The root package can serve as a native Pi extension package. Its skill,
  prompt, and theme discovery lists are empty; extension discovery points at
  `pi/extensions`.
- Node >=24.2 runs the TypeScript installer without a build step. The Nix dev
  shell provides Node 24, Git, and Just.
- Old shell/PowerShell installers, module shim, bundled extensions, theme, and
  external skills were removed from the new layout.

Six authored skills without source records were restored unchanged from the
previous layout at Git commit `7e2789f`: `babysit-pr`, `commit`, `file-pr`,
`html-communication`, `postplan-read`, and `summarization`, including their
supporting references. See [the catalog](skills/README.md). All six currently
allow model invocation and can also be requested by a human. The `commit`
skill references `unslop`, which is not yet installed.

Earlier validation passed: `npm run check`, all seven installer tests, and
`nix flake check` for the current x86_64-linux system. Home Manager was also
evaluated with empty and populated selections. These are prior results, not
checks rerun while writing this handoff. No harness home configuration was
changed to test installation.

Still unimplemented: upstream check/diff/three-way merge tooling, declarative
external Pi package management, and Nix packaging of extension dependencies.
These are separate from the current recommendation task.

## Research scope and source material

The user requested a comparison of these collections with their recent session
history:

- [Matt Pocock's skills](https://github.com/mattpocock/skills)
- [Lauren Tan's pstack](https://github.com/cursor/plugins/tree/main/pstack)

An inventory and skill manifests were fetched at these exact revisions:

| Collection | Upstream revision | Manifests screened |
| --- | --- | --- |
| `mattpocock/skills` | `b0618bc436ad893b3c5e84e55fba86586d34a404` | 38, including in-progress and miscellaneous skills |
| `cursor/plugins`, `pstack/` | `ccb5507cec1546dc88135c1139c811e6c59115ba` | 51, including individual principle skills |

Temporary research files are currently at
`/tmp/spellbook-skill-review-z82qsib9`. Each collection has a `source.json`
inventory. Manifest paths mirror upstream beneath the collection directory,
for example:

```text
mattpocock/skills/engineering/diagnosing-bugs/SKILL.md
mattpocock/skills/productivity/writing-for-agents/SKILL.md
pstack/pstack/skills/recall/SKILL.md
```

Only manifests were downloaded in this research pass. Supporting scripts,
references, and license files must still be inspected before recommending a
complete import. Temporary files may disappear; the pinned revisions above
allow reconstruction. All manifests were screened by metadata; selected
candidates were read in depth. Do not claim every skill was fully audited.

## Session history collected so far

The local database is `/home/eden/.t3/userdata/state.sqlite`. It was queried
read-only using Python's SQLite URI mode:

```python
sqlite3.connect('file:/home/eden/.t3/userdata/state.sqlite?mode=ro', uri=True)
```

Relevant tables are `projection_projects`, `projection_threads`,
`projection_thread_messages`, and `projection_thread_sessions`. Inspect schemas
before reusing queries on another machine. Threads have title, project, dates,
and worktree fields; messages have `thread_id`, `role`, `text`, and timestamps.
Avoid authentication tables and credentials. Do not put raw session exports
into this repository.

At the time of review, the local database contained six threads from October
7–8, 2026, with 55 user messages and 115 assistant messages. All used Codex.
Counts will change as this conversation continues. The threads were:

| Thread | User messages at review |
| --- | ---: |
| Set Up Obsidian Sync on Thor | 11 |
| Fix Pi Codex Authentication | 2 |
| Obsidian Headless Sync Implications | 3 |
| Schedule Obsidian Vault Backups on Thor | 29 |
| Design Harness-Agnostic Agent Skills | 1 |
| Design Harness Agnostic Skills and Pi Extensions (this thread) | 9 |

All 45 user messages outside the two Spellbook threads were reviewed, together
with relevant assistant responses. The two Spellbook threads overlap; do not
count them as independent evidence of repeated behavior. Tool outputs and
live infrastructure were not independently audited in this research.

Observed patterns:

- Frequent NixOS/headless work, interest in what Nix can package, and explicit
  deployment instructions such as Colmena `test` instead of `switch`.
- Agents needed corrections about which machine they were on and whether a GUI
  was available. One attempted SSH to the machine already executing the task.
- Extended backup/SSH troubleshooting crossed Tailscale SSH, native SSH ports,
  container versus host users, filesystem traversal permissions, and hardware
  key availability. This favors systematic environment discovery and falsifiable
  debugging steps.
- The user asked to inspect Hemera configuration before changing the TrueNAS
  SSH port: concrete evidence for checking effects beyond the immediate change.
- The user requested durable Thor instructions in `AGENTS.md`, then asked to
  compress them: concise agent documentation matters.
- Questions about recovery, live sync, triggering backups, service activation,
  and snapshot location show a need for concrete verification and operational
  handovers.
- Returning to earlier work after SSH detours, and this cross-environment
  history review itself, support a session-recall capability.
- The current rewrite repeatedly favors fewer directories and less maintenance.
  A large orchestration framework needs stronger evidence than this local sample.

## Remote access status: next research step

The user explicitly supplied **rize** and **wrath** as SSH host aliases to
include. Reading relevant session history there is within the requested scope.

- **wrath:** SSH succeeded with `BatchMode=yes` and `ConnectTimeout=10`;
  `hostname` returned `wrath`. The default shell is fish and `python3` was not
  found. No remote session history has been read yet. Discover available
  `node`, `sqlite3`, `python`, or Nix tools, and locate the T3 database. Use
  explicit `sh -c` if shell syntax requires it.
- **rize:** The initial SSH probe did not return a usable result before the
  handoff. Its old tool session ID was `37342`; polling while writing this
  document returned `Unknown process id`. Retry the connection. Do not report
  Rize as successfully reviewed or definitively unreachable.

Use read-only SQL or a proper SQLite online backup if an export is needed;
copying only a live database file can omit WAL changes. Query thread metadata
first, then relevant messages. Establish and report the time window and actual
coverage across machines, deduplicating any shared history. A last-30-days
window is a reasonable starting assumption, but was not specified by the user.

## Provisional candidates, not a final ranking

| Candidate | Evidence of fit | Adaptation or remaining review |
| --- | --- | --- |
| Matt: `diagnosing-bugs` | Long SSH, backup, and authentication investigations | Strong reproduction/hypothesis loop. Add host/user/process/endpoint discovery. Permit read-only diagnostic loops; avoid blindly applying stress loops or forced regression tests to live infrastructure. Inspect `scripts/hitl-loop.template.sh`. |
| Matt: `writing-for-agents` | Requests to add and then compress machine instructions; maintaining this skill repository | Focuses on pointers, progressive disclosure, and completion criteria. Inspect supporting `SKILL-MECHANICS.md` before importing. |
| Matt: `retro` | Repeated environment corrections could improve future instructions | Human-invoked; depends on `writing-for-agents`. Proposes improvements rather than immediately imposing broad changes. Adapt assumptions about implementation/review stages if needed. |
| pstack: `unslop` | Preference for concise prose; existing `commit` dependency | Low apparent portability cost. Upstream has `disable-model-invocation: true` despite wording that it should always apply. Decide explicit invocation/caller behavior; soften overly rigid punctuation rules if needed. |
| pstack: `recall` | Resuming interrupted tasks and reviewing history across machines | Substantial port: assumes Cursor transcript directories, Cursor tools, and a `why` record sweep; references `unslop`. Needs T3 SQLite support, environment selection, and source-aware summaries. |
| pstack: `how` | Repeated requests for explanations and operational understanding | Uses Cursor Task tooling, `.mdc` rules, and hardcoded model names; even its simple path spawns an explainer. Replace those assumptions for all three harnesses and allow direct explanations without delegation. |
| pstack: `create-verification-skill` | Repeated requests to prove sync/backups actually work | Produces a repository-specific verifier. Port `.cursor/skills` destinations and browser assumptions; define infrastructure verification scope carefully. Better considered per project than as a blanket global workflow. |
| Matt: `wizard` | Human steps involving authentication and provisioning | Bash script/template workflow assumes browser opening and secret/config writes. Needs Nix runtime declarations and headless/mobile alternatives. Less immediate than debugging and documentation. |
| pstack: `blast-radius` | Explicit request to check other host configuration before a port change | Promising from metadata; full instructions still need review before recommending. |

Other findings:

- pstack `automate-me` resembles this research task, but assumes Cursor history,
  `create-skill`, question tools, subagents, and automatic commit/PR steps. It is
  not ready to apply directly here.
- pstack `architect` orchestrates `how`/`why`, `arena`, optional `interrogate`,
  and principle skills, with automatic implementation and model-specific
  configuration. Defer unless broader session evidence justifies that machinery.
- pstack `correct` can immediately implement broad structural fixes from
  repeated errors. Matt's `retro` appears a smaller initial fit for this user.
- Both collections include `tdd` and `teach`; avoid importing overlapping names
  without deliberately choosing one. Current local evidence is mostly
  infrastructure work, not enough to rank coding/test workflows confidently.
- `codebase-design`, `research`, `grilling`, `grill-with-docs`, `to-spec`,
  `show-me-your-work`, and `why` need further selective review if remote history
  points toward them. Some earlier combined reads were truncated.

## How to finish the current task

1. Read recent T3 threads on Rize and Wrath, handling their actual runtimes and
   data locations. Record coverage and limits honestly.
2. Compare recurring tasks and corrections across environments. Separate
   repeated needs from one lengthy troubleshooting thread.
3. Deep-read the best candidates and their dependencies at the pinned revisions.
   Check harness assumptions, invocation settings, supporting files, and overlap
   with the six authored skills.
4. Present a small ranked shortlist with concrete session evidence, expected
   benefit, and required local adaptations. Distinguish straightforward imports
   from substantial ports and deferred options. Link claims to upstream files.
5. Stop at recommendations unless the user requests adoption. If importing later,
   include supporting resources/license notices, add `SOURCE.toml`, and update
   `skills/README.md` by invocation settings.

Follow [AGENTS.md](AGENTS.md). Run `npm run check` and `npm test` if TypeScript
tooling changes; installer tests must use temporary homes. Do not invoke the
research subjects as skills merely because their manifests were read. No
delegation was requested for this task. No commit or PR has been created.
