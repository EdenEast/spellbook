# Source and adaptations

These documents adapt all 24 pstack principles at the recorded revision.
[SOURCE.toml](SOURCE.toml) maps each document to its upstream file;
the shared [pstack license](../../licenses/pstack.txt) retains the upstream notice.

The references retain pstack's concrete defaults and diagnostics, including the
three-layer flattening trigger, smallest-diff preference, tooling for nontrivial
work, per-unit checks, and side-by-side design alternatives. They use ordinary
Markdown with loading triggers, application guidance, boundaries, and checks.

Spellbook keeps these deliberate adaptations:

- Task scope and authorization constrain cleanup, redesign, automation, and
  human-independent execution. Principles do not authorize new work or live
  system changes, commits, rebases, or PRs by themselves.
- Compatibility needed by external consumers or staged rollouts is retained.
  Runtime checks remain appropriate for dynamic invariants that types cannot
  establish; boundary guards and labeled mitigations can be valid fixes.
- Delegation is optional and follows active instructions. Large payloads can
  instead use bounded reads, external artifacts, and traceable summaries.
- Testing retains pstack's weak-test examples and diagnostic for code that does
  no work, but judges assertions by relevant defect sensitivity rather than
  banning matcher names. Tests should also survive behavior-preserving internal
  refactors. Useful negative assertions, boundary mocks, and structural checks
  remain valid.
- Attack the premise requires writing the premise down and testing it with a
  rerunnable observation before the next fix. A per-actor census is the usual
  check for distribution problems when it distinguishes the explanations, not
  a mandatory gate. An even census does not by itself disprove every premise
  or rule out multiple causes.
- Verification units can contain tightly coupled edits. Regression evidence
  precedes fixes, while delivered commits obey repository policy rather than
  requiring a failing-test commit or an automatic rebase.
- Explain the number incorporates benchmark checks and Prove it works describes
  reviewable evidence without importing pstack's companion skills or requiring
  their log format and review workflow.

Principles guide decisions; they do not grant permission, mandate model choices,
or import pstack's mode and shipping workflows. Related references distinguish
scope minimization from reader effort, domain modeling from type enforcement,
and proof of a result from sequencing work or interpreting a measurement.

## cursor/plugins upstream integration

Reviewed and accounted for the full mapped scope from
`ccb5507cec1546dc88135c1139c811e6c59115ba` to
`6b78e9f4e46c75d1697d837e51f07c2692e60b24`: 17 principle files changed,
seven were unchanged, and none were added, deleted, or moved.

Incorporated selectively from `e5136d8` and `36cecbf`:

- Fix root causes distinguishes legitimate states needing handling from invalid
  states whose producer needs fixing. A difficult investigation prompts a
  proposed cheap diagnostic signal; implementation still requires task scope
  and appropriate operating constraints.
- Test behavior, not implementation checks both defect sensitivity and survival
  of behavior-preserving refactors, retaining intentional structural invariants.
- Make operations idempotent reconciles observed state with the goal and uses
  ownership/staleness evidence valid across interruption points. PID checks are
  examples, not universal proof; uncertain ownership means preserving the
  resource and reporting a conflict.
- Attack the premise replaces the census gate with a hypothesis-driven test and
  follows supporting evidence to why earlier fixes failed.

### Declined

- Prose compression and metadata edits in `00b14f1` for Build the lever,
  Explain the number, Minimize reader load, Model the domain, Never block on
  the human, Redesign from first principles, and Subtract before you add:
  local structure already carries the substance and explicit boundaries.
- Body deletions in `00b14f1`, `08bd59b`, and `99743e9` for Encode lessons in
  structure, Exhaust the design space, Guard the context window, Laziness
  protocol, Migrate callers then delete legacy APIs, and Type system discipline:
  retain the concrete defaults, examples, and checks. Some rules survive only
  in upstream frontmatter descriptions, which local references do not have;
  other guidance disappears entirely. Upstream's prompt cuts do not establish
  that removing this guidance works in the local loading model.
- Removal of the testing no-work diagnostic and weak-assertion examples:
  retain them as qualified diagnostics, not blanket matcher bans.
- The `typescript-best-practices` companion pointer: keep principles
  language-neutral and self-contained. Benchmark guidance remains incorporated
  locally rather than requiring the benchmark companion skill.
- Absolute claims that a refactor-sensitive test catches no bugs or that a
  lengthy workaround comment proves the code wrong: retain contract-based
  judgment and evidence, including error wording when consumers depend on it.

### Verification

The baseline-to-target comparison found 24 mapped principles at both revisions,
17 modifications, no inventory changes, and no additional principle-tree
supporting files. All local relative file links resolve and every principle is
listed in the index. The upstream `pstack/LICENSE` is unchanged across the range
and byte-identical to `licenses/pstack.txt` at the target. The shared license
registry remains unchanged because its recorded check is still valid.

The seven unchanged principles are Boundary discipline, Experience first,
Foundational thinking, Outcome-oriented execution, Prove it works, Separate
before serializing shared state, and Sequence work into verifiable units.
Changes to unmapped workflows such as `correct` and `poteto-mode` are outside
this collection's scope.

Structural checks and manual decision walkthroughs cover the revised guidance;
they do not establish model compliance or effectiveness across harnesses.
