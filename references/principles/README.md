# Principles

Read this index before design, implementation, debugging, or substantive review.
Read the full document for each matching trigger before applying it. A user can
steer a task by naming a principle, such as "subtract before you add".

Use the documents as decision guidance within the user's authorized scope.
Their boundaries matter. User and repository instructions take precedence.
When a principle materially changes a decision, explain the choice it changed;
name only principles whose full documents you read this session. Routine replies
need no list of principles.

## Scope and design

| Principle | When to use | Rule |
| --- | --- | --- |
| [Laziness protocol](laziness-protocol.md) | Refactoring, evaluating diff size, or adding abstractions or signal threading. | Prefer deletion, flat call hierarchies, and the smallest change that solves the problem. |
| [Foundational thinking](foundational-thinking.md) | Before writing logic, planning dependent phases, or deciding what actors share. | Establish data shapes and useful prerequisites after removing dead code. |
| [Redesign from first principles](redesign-from-first-principles.md) | Integrating a requirement into an existing design. | Design as if the requirement were present from the start, then deliver incrementally. |
| [Attack the premise](attack-the-premise.md) | Repeated fixes assume the same untested premise. | Test the shared assumption before another fix. |
| [Subtract before you add](subtract-before-you-add.md) | Sequencing an addition, refactor, or rewrite. | Remove verified dead weight before construction or polishing. |
| [Minimize reader load](minimize-reader-load.md) | Behavior requires tracing layers or holding hidden state. | Reduce indirection and state a reader must track. |
| [Outcome-oriented execution](outcome-oriented-execution.md) | A planned migration has explicit target and phase boundaries. | Converge on the target without unnecessary transitional designs. |
| [Experience first](experience-first.md) | Product scope or implementation convenience competes with usability. | Prefer the consumer's experience and fewer polished features within agreed constraints. |
| [Exhaust the design space](exhaust-the-design-space.md) | A novel interaction, architecture, or product experience has competing shapes. | Compare two or three structurally different prototypes or sketches side by side. |
| [Build the lever](build-the-lever.md) | Nontrivial edits, migrations, analyses, or checks, including one-off work. | Default to a small rerunnable tool that does the work or proves the result. |

## Architecture

| Principle | When to use | Rule |
| --- | --- | --- |
| [Model the domain](model-the-domain.md) | State combinations, repeated rules, or branching obscure the domain. | Choose a structure that encodes the rules in one place. |
| [Boundary discipline](boundary-discipline.md) | Designing validation, error handling, or adapters. | Validate at trust boundaries, expose domain concepts, and keep logic in pure functions. |
| [Type system discipline](type-system-discipline.md) | Designing types, signatures, or variant handling. | Rule out invalid combinations and handle meaningful cases. |
| [Make operations idempotent](make-operations-idempotent.md) | Commands or lifecycle steps face retries, crashes, or restarts. | Reconcile partial progress toward the same intended end state. |
| [Migrate callers then delete legacy APIs](migrate-callers-then-delete-legacy-apis.md) | Replacing an API whose callers can move together. | Migrate callers and retire the old path when compatibility permits. |
| [Separate before serializing shared state](separate-before-serializing-shared-state.md) | Concurrent actors may write one mutable target. | Remove unnecessary sharing before adding coordination. |

## Verification

| Principle | When to use | Rule |
| --- | --- | --- |
| [Prove it works](prove-it-works.md) | Before claiming a task or change succeeded. | Check actual output or behavior with evidence appropriate to the claim. |
| [Fix root causes](fix-root-causes.md) | Debugging a failure or repeated symptom. | Reproduce, test explanations, and fix the verified cause. |
| [Sequence work into verifiable units](sequence-verifiable-units.md) | Planning dependent stages, sweeps, or delivery. | Check each small unit and do not advance until its check passes. |
| [Test behavior, not implementation](test-behavior-not-implementation.md) | Writing, changing, or reviewing tests. | Assert observable contracts with checks that detect relevant defects. |
| [Explain the number](explain-the-number.md) | Trusting or reporting a measured performance or evaluation result. | Establish what the measurement means and rule out misleading explanations. |

## Working process and learning

| Principle | When to use | Rule |
| --- | --- | --- |
| [Guard the context window](guard-the-context-window.md) | Large artifacts or long tasks bury relevant evidence. | Keep active context focused and summaries traceable. |
| [Never block on the human](never-block-on-the-human.md) | Considering a pause for a routine authorized step. | Continue authorized work while preserving decisions the user owns. |
| [Encode lessons in structure](encode-lessons-in-structure.md) | The same correction or instruction keeps recurring. | Enforce stable rules with mechanisms when judgment is unnecessary. |

## Source and adaptations

These documents adapt all 24 pstack principles at the recorded revision.
[SOURCE.toml](SOURCE.toml) maps each document to its upstream file;
[LICENSE](LICENSE) retains the upstream notice.

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
  banning matcher names.
  Useful negative assertions, boundary mocks, and structural checks remain valid.
- Attack the premise requires a rerunnable actor census for distribution
  problems and another falsifying observation elsewhere. An even census does
  not by itself disprove every premise or rule out multiple causes.
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
