# Source and adaptations

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
