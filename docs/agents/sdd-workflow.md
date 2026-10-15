# Maintain the brainstorming and SDD workflow

This is the first source draft implementing the direction in
[the design handoff](sdd-handoff.md). The handoff remains a historical record of
the proposal before implementation. No installation or PR creation is part of
this draft's authoring scope.

## Ownership and decisions

Maintain stage behavior in `skills/brainstorm/SKILL.md` and the seven `skills/sdd*`
entry points. Maintain the shared execution contract in
[references/sdd/README.md](../../references/sdd/README.md) and artifact rules in
[artifacts.md](../../references/sdd/artifacts.md). Keep user-facing examples in
[the usage guide](../user/sdd.md) and domain definitions in
[the glossary](../GLOSSARY.md). Update the skill and reference catalogs when this
inventory or its loading triggers change.

First-draft choices resolve the handoff's open packaging questions:

- `brainstorm` remains outside SDD; `sdd-discover` starts from an intended
  direction and reuses any idea brief. A thin `sdd` skill routes and resumes;
  six stage skills own discovery through delivery.
- Normal automatic skill selection stays enabled. A stage can be requested
  directly. Stages follow existing authorization instead of requiring approvals
  at every transition; a plan-only request still stops after planning.
- Use existing project artifacts first. Otherwise use OpenSpec-style capability
  specs and change directories without requiring its CLI. `evidence.md` is a
  local addition; optional combined records are not a standard OpenSpec schema.
- Persist idea briefs under `docs/ideas/` only when useful. Keep casual exploration
  in chat. Keep behavior in specs, technical decisions in design, execution in
  tasks, and observations in evidence.
- Reconcile specs and prepare the archive in the implementation PR by default.
  Archive presence does not prove merge. An existing post-merge policy takes
  precedence and needs a named owner. Multi-PR work reconciles only delivered
  behavior per layer and retains explicit pending scope.
- Report PR opened, merge-ready, merged, and deployed separately. Avoid an
  overloaded “shipped” status; resolve ambiguous endpoint authorization when it
  matters. Native execution remains available without delegates or model roles.

The handoff mentions `grilling`, `grill-me`, `grill-with-docs`, and local
`poteto-mode` resources that are absent from this checkout. No existing skill is
removed or replaced. If a target harness supplies interview skills, treat them
as techniques for focused clarification; discovery additionally investigates the
project and its test seams. Do not make repeated interviews a prerequisite.

## Source maintenance

The skills and reference collection are **adapted**, not adopted. Each has
`SOURCE.toml`, source-specific `ADAPTATIONS.md` decisions, and unchanged applicable
license notices under `licenses/`. Review exact pinned sources outside the
checkout following [external-source guidance](external-sources.md). Read the
recorded scope: a targeted playbook review is not a complete review of its host
skill. Update sources only after accounting for the relevant changes; installation
is a separate operation.

## First-draft evaluation

The following are manual instruction walkthroughs, not independent model trials.
They establish whether the draft supplies a coherent path for the scenario;
they do not prove automatic skill selection or model compliance.

### Brainstorming with no intent to build

Request: “Explore ideas for my reading notes; I may decide to build nothing.”
Follow `brainstorm`: stay exploratory, compare options, and accept deferral or
rejection. No change directory or spec is required. Inspection found explicit
stopping outcomes and a conditional transition requiring pursuit authorization.

### Known direction entering discovery directly

Request: “Use SDD to add selected-record CSV export through opening a PR.”
Follow `sdd` to discovery without brainstorming. Inspect the existing export
behavior and tests, ground scope in the proposal, then continue through the
authorized stages. Inspection found no mandatory brainstorming interview, no
stage-by-stage approval requirement, and no implied merge grant.

### Brief handed to a fresh agent

Input: an idea brief marking a user decision to pursue export, one agent-suggested
format, and an unresolved permission question. Discovery reuses the decision,
checks project evidence, and retains the suggestion and question as unsettled.
The proposal supplies grounding; requirement/scenario links later connect tasks
to proof. Inspection found explicit distinctions between those decision types
and a resumption check against checkout reality.

### Ambiguous feature

Request: “Make export better,” with no concrete outcome. Inspect current behavior
and identify whether the problem concerns selection, format, or speed. Ask the
material product question while investigating independent facts. Inspection
found a path back to brainstorming if the direction is uncertain and no license
to invent numerical acceptance targets. Do not encode a guessed product choice
as an accepted requirement.

### Change spanning PRs

Input: two layers, first CSV selection and then background exports. The plan
assigns requirements and proof per layer. Reconcile only CSV behavior in the
first PR; keep background behavior pending. Recheck the child's evidence when
its parent lands. Inspection found these rules in planning, delivery, and the
artifact reference, including a single-change alternative with pending scope.

### Drift, unavailable evidence, and stopping boundaries

Input: tasks checked complete but a UI flow was never run, followed by a rebase.
Verification classifies that scenario as unverified and reassesses old evidence
against the new base. It cannot report merge-ready from checked tasks and CI
alone. A verification-only request reports findings; an implementation request
permits in-scope fixes. A plan-only request stops before implementation. Inspection
found all three boundaries explicitly represented.

## Validation and remaining work

Completed during draft authoring:

- All eight skills passed the skill-creator `quick_validate.py` check. Its PyYAML
  dependency was installed in a temporary virtual environment.
- Checked 84 local navigation links, shared reference paths, and stage targets;
  parsed nine provenance records and compared 31 source paths and unchanged
  license notices against the reconstructed pinned trees outside the checkout.
- Exercised the existing installer for Codex, Claude Code, and Pi using a separate
  temporary home per target. Dry-run left each home empty; installation exposed
  all eight complete skills, their stage links, and shared references; status
  reported the links installed; uninstall removed them. No active harness
  configuration was modified. This proves file availability, not live harness
  discovery or skill loading.
- `git diff --check` passed. No TypeScript tooling changed, so the TypeScript
  check and test suite were not required for this Markdown-only increment.

For later edits, repeat the frontmatter, link, source record, and notice checks.
Use temporary homes for any installation checks. Review the walkthrough scenarios
above when changing routing, authorization, or artifact ownership.

Runtime trials remain outstanding: use realistic requests in independent contexts
to observe discovery, conditional reading, question quality, artifact usefulness,
requirement coverage, drift recovery, and stopping behavior. Include a nearby
request that should not select SDD, such as a simple explanation or typo fix.
Report harnesses and models actually exercised rather than claiming portability
from Markdown inspection alone.
