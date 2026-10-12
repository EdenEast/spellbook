# Spellbook portability

Read this file before the mode or a matched playbook. The bundled playbooks and
helpers retain pstack's workflows. Apply the adaptations here wherever upstream
assumes Cursor, a companion skill, or an authorization grant.

## Scope and authorization

User and repository instructions govern the task. A question stays read-only.
The mode selects a workflow and working style. It does not itself authorize
commits, pushes, PRs, merges, messages, deployments, deletion, or unrelated fixes.
Complete authorized preparation before an approval gate. Honor existing grants
without asking again. A request to state a plan ends with the plan, not execution.

Run Opening a PR only when publication is authorized. Otherwise report the
verified local result. Pause safely preserves work in a durable note and on disk.
Make its WIP commit only when committing is authorized. Never reset user work or
infer that untracked files are disposable. Cleanup requires the requested scope,
an inventory, and evidence that each candidate is unused.

Use isolated development targets for prototypes and runtime instrumentation.
Touch production, live databases, or daily-driver preview channels only with an
explicit grant. A full-autonomy instruction retains operator gates and does not
bypass enforced tool approvals.

## Companion resolution

Load an installed companion by name when the harness supports it. Otherwise
read its `SKILL.md` through the relative pointer below. Resolve pointers from
this file. Keep that skill's invocation and authorization rules.

| Upstream name | Spellbook companion |
| --- | --- |
| architect | [architect](../../architect/SKILL.md) |
| how | [how](../../how/SKILL.md) |
| why | [why](../../why/SKILL.md) |
| unslop | [unslop](../../unslop/SKILL.md) |
| technical-writing | [technical-writing](../../technical-writing/SKILL.md) |
| create-skill | [writing-for-agents](../../writing-for-agents/SKILL.md), plus an installed skill-creator when available |
| reflect | [retro](../../retro/SKILL.md), only for a requested retrospective |

Principles live in the [shared index](../../../references/principles/README.md).
If the checkout-relative path is unavailable, use
`~/.agents/references/spellbook/principles/README.md`. Read the full documents
whose triggers match before applying them. Remove the `principle-` prefix to
resolve an upstream name. `principle-sequence-verifiable-units` maps to
`sequence-verifiable-units.md`. Attribute only a principle read this session
that materially changed a choice.

The following companions are not shipped with this import. If installed, read
and use them. Otherwise perform the stated work directly and report the fallback.
Do not imply that an unavailable skill, model, or tool ran.

- `swarm` partitions exploration or verification into named coverage lanes.
  Give each lane its scope, input SHA, acceptance criteria, and evidence to return.
  Aggregate every lane, including failures and gaps.
- `arena` runs alternative implementations in isolated directories against the
  same brief. Judge the results under a shared rubric, blind to model identity
  when supported. Record selection and any grafted changes.
- `interrogate` challenges a contested design against explicit invariants and
  failure cases. Use independent reviewers when permitted. If independence is
  unavailable, label a self-review and retain the independent shipping gate.
- `figure-it-out` authors a task-specific playbook from the goal, dependencies,
  risks, per-step evidence, and a checkable completion predicate. A plan-only
  request still ends before execution.
- `show-me-your-work` keeps a TSV decision trail outside the working tree unless
  the task calls for a committed audit record. Record time, unit, hypothesis or
  choice, action, observed result, evidence path, and next step. Audit it against
  actual artifacts at checkpoints and close.
- `benchmark-checklist` validates workload equivalence, warmup, noise, sample
  count, work completed, and errors before trusting a measured delta. Record
  commands and raw artifacts. Apply the Explain the number reference.
- `tdd` runs the failing behavior test before the fix and the passing test after.
  Preserve the repro evidence even when separate commits are not authorized.
- `deslop` reviews the full diff for unnecessary complexity and scope drift.
  `no-comments` reviews comments for obsolete claims and redundant narration.
  Keep comments that explain a non-obvious constraint or reason.
- `control-ui` and `control-cli` drive the actual user interaction and preserve
  screenshots or output. Use the host's browser or terminal tools and the
  project's supported drivers. Report an unreachable surface as blocked
  verification, rather than substituting compilation for runtime proof.

When a playbook cites `pstack/skills/<name>/SKILL.md`, resolve the companion here.
Use bundled files relative to the resolved poteto-mode directory. Examples that
start with `skills/poteto-mode/` assume the Spellbook checkout. Resolve that
directory before running them in another project. Do not assume the consumer's
trunk contains Spellbook or pstack. For trunk rereads, use the repository that
owns the workflow and its actual path, or re-read the installed file and record
its SOURCE.toml pin. Never substitute a nonexistent `git show` path.

## Delegation and host tools

Use the host's task list or keep a local checklist when no task-list tool exists.
Use its question tool for missing preferences. An experiment settles observable
facts. Required operator decisions remain gates until answered.

`Task`, `AskQuestion`, `subagent_type`, `environment: cloud`, and Cursor model
slugs are upstream mechanics. Use available delegation tools within user,
repository, and host limits. State file ownership before parallel writes. A
`poteto-agent` becomes an ordinary worker brief that points to this mode, its
matched playbook, standing orders, scope, and acceptance criteria.

Inherit the parent model unless an applicable instruction explicitly configures
another available model. `/setup-pstack` is not shipped. Do not silently choose
unavailable models or claim diverse-model review on a single model. Use fewer
concurrent lanes when the host limits concurrency, while keeping every required
scenario and verdict. Missing cloud VMs can become isolated local worktrees when
the task permits local execution.

Delegation must earn its cost. For work one agent finishes in one pass, perform
implementation and a distinct review pass yourself when local instructions
require it. Preserve the same acceptance criteria and evidence. A workflow
requiring independent verdicts, such as Shipping, remains blocked without an
independent reviewer. Eval's blinded independent judge also cannot become a
self-judgment. State these limits and continue independent authorized work.

`/loop` is Cursor-specific. Use an available watcher or scheduling tool. Without
one, watch during the active session with bounded waits and report the lifetime
limit. Do not promise a background heartbeat after the session ends. Never treat
elapsed time as operator approval.

Use a host-provided durable store when available. Otherwise choose a task-scoped
directory outside the working tree and report its path. Pass `--store <dir>` to
the orchestration helper or set `ORCH_STORE`. A temporary directory is a session
checkpoint, not a durable multi-day store. Read transcripts only from the current
task's known scope. Without transcript access, report that eval chain-following
or session reconstruction has limited evidence.

Keep the mode's Babysit request-to-mode mapping and stop conditions. The separate
Spellbook babysit-pr skill does not replace its watcher protocol. Shipping still
needs an explicit landing request and independent verdicts at the actual head.
Use host PR tools and register PR links when the host requires it.

## Bundled helpers

The plan checker runs with Node.js. The PR watcher and orchestration CLI require
Bun. Their bootstrap installs locked dependencies next to the bundled scripts
on first use. Inspect that location before executing against a read-only or
shared installation. For validation, copy the scripts to a temporary directory
and run dependency installation and tests there.

- `node scripts/check-plan.mjs <plan.md>` checks the strict multi-phase plan
  format. Its ten-lane and `/loop` markers describe the upstream program
  contract. A static pass does not establish host support or live verification.
  Report capability gaps separately. Do not invent a model name or loop to pass.
- `bun scripts/watch-pr/watch-pr --help` describes the GitHub watcher. It requires
  authenticated `gh` for live reads. Origin uses the playbook's separate path.
- `bun scripts/orch/orch.ts --help` describes bookkeeping. Its frontier resolver
  requires Graphite's `gt` CLI and metadata, even though other PR playbooks use
  `gh` or Origin. If Graphite is unavailable, maintain the documented frontier JSON and ledger from
  actual forge base refs and head SHAs. Retain one topology writer and generation
  checks. Report that the CLI did not resolve the frontier.
- `bash scripts/worktree-audit.sh <repo>` uses `git`, `gh`, `jq`, and `rg`. It
  fetches `origin/main` and reads current-workspace Cursor transcripts. Its chat
  timestamp commands assume macOS. On other hosts, use it only as a partial
  inventory and inspect active sessions separately. A `safe` bucket never proves
  that a worktree is unused or authorizes deletion.

The import includes all upstream playbooks, scripts, tests, and the license.
Static validation and helper tests establish packaging and script behavior.
Live invocation, cloud orchestration, browser control, and authenticated forge
workflows require separate evidence in the environment where they run.
