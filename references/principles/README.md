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
| [Laziness protocol](laziness-protocol.md) | Sizing a change or adding abstractions or signal threading. | Prefer the least lasting complexity that meets the requirement. |
| [Foundational thinking](foundational-thinking.md) | Planning dependent phases or shared foundations. | Establish the data shape and useful prerequisites before consumers. |
| [Redesign from first principles](redesign-from-first-principles.md) | A new requirement strains an abstraction. | Consider the coherent target, then justify and deliver the change incrementally. |
| [Attack the premise](attack-the-premise.md) | Repeated fixes assume the same untested premise. | Test the shared assumption before another fix. |
| [Subtract before you add](subtract-before-you-add.md) | An addition or refactor builds on obsolete or redundant code. | Remove verified dead weight before extending the design. |
| [Minimize reader load](minimize-reader-load.md) | Behavior requires tracing layers or holding hidden state. | Reduce indirection and state a reader must track. |
| [Outcome-oriented execution](outcome-oriented-execution.md) | A planned migration has explicit target and phase boundaries. | Converge on the target without unnecessary transitional designs. |
| [Experience first](experience-first.md) | Product scope or implementation convenience competes with usability. | Choose the result for consumers and maintainers. |
| [Exhaust the design space](exhaust-the-design-space.md) | A consequential design has uncertain competing shapes. | Compare distinct alternatives at useful fidelity. |
| [Build the lever](build-the-lever.md) | Repeated edits or checks are costly or error prone by hand. | Use a small rerunnable tool when it earns its cost. |

## Architecture

| Principle | When to use | Rule |
| --- | --- | --- |
| [Model the domain](model-the-domain.md) | State combinations, repeated rules, or branching obscure the domain. | Choose a structure that encodes the rules in one place. |
| [Boundary discipline](boundary-discipline.md) | Designing validation, error handling, or adapters. | Validate at trust boundaries and isolate domain logic. |
| [Type system discipline](type-system-discipline.md) | Designing types, signatures, or variant handling. | Rule out invalid combinations and handle meaningful cases. |
| [Make operations idempotent](make-operations-idempotent.md) | Commands or lifecycle steps face retries, crashes, or restarts. | Reconcile partial progress toward the same intended end state. |
| [Migrate callers then delete legacy APIs](migrate-callers-then-delete-legacy-apis.md) | Replacing an API whose callers can move together. | Migrate callers and retire the old path when compatibility permits. |
| [Separate before serializing shared state](separate-before-serializing-shared-state.md) | Concurrent actors may write one mutable target. | Remove unnecessary sharing before adding coordination. |

## Verification

| Principle | When to use | Rule |
| --- | --- | --- |
| [Prove it works](prove-it-works.md) | Before claiming a task or change succeeded. | Check actual output or behavior with evidence appropriate to the claim. |
| [Fix root causes](fix-root-causes.md) | Debugging a failure or repeated symptom. | Reproduce, test explanations, and fix the verified cause. |
| [Sequence work into verifiable units](sequence-verifiable-units.md) | Planning dependent stages, sweeps, or delivery. | End each meaningful increment in a checkable state. |
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

Spellbook adds task scope, authorization boundaries, and checkable criteria.
It scales tooling and prototyping to their benefit, retains necessary
compatibility and runtime checks, and makes delegation optional. The testing
reference uses defect sensitivity in place of the upstream matcher heuristic.
Attack the premise generalizes the upstream actor census to observations that
can falsify assumptions in other domains. Explain the number includes measurement
guidance without requiring the upstream benchmark skill.

Principles guide decisions; they do not grant permission, mandate model choices,
or import pstack's mode and shipping workflows. Related references distinguish
scope minimization from reader effort, domain modeling from type enforcement,
and proof of a result from sequencing work or interpreting a measurement.
