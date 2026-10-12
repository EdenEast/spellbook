# Spellbook portability

The bundled workflow and design references retain pstack's architecture process.
Apply these adaptations wherever they assume Cursor or an unavailable companion.

## Scope and invocation

User and repository instructions govern the task. An architecture question or a
request for a plan stays read-only. Proceed to implementation only within the
authorized scope. The optional checkpoint remains available when requested.
Shipping a scaffold as a commit requires authorization to commit.

Use the host's task list, or keep a local checklist for the five phases. Preserve
existing work when creating sketches or replacing them. Scrapping an architecture
means redesigning the task's sketch; it does not authorize deleting unrelated work.

## Companion and principle resolution

Load companions by name when supported, otherwise read their relative files:

- **how**: [how](../../how/SKILL.md), for the grounding explanation.
- **why**: [why](../../why/SKILL.md), for ownership and layering rationale.

Keep their invocation policies. An explicit architect request includes its
prescribed grounding passes; unrelated automatic invocation remains restricted.

Principles are shared references, rather than separate principle skills. Read
the [shared index](../../../references/principles/README.md) in the checkout, or
`~/.agents/references/spellbook/principles/README.md` when installed. Remove the
`principle-` prefix to resolve a document name and read each matching document
before applying it. Attribute a decision only to a principle read this session.

**arena** and **interrogate** are not bundled. If installed and their invocation
policy permits the requested work, read and use them. Otherwise perform the
arena fallback below. For optional adversarial pressure, review the synthesized
sketch against explicit invariants and failure cases. Use an independent reviewer
when permitted; label a self-review when independence is unavailable.

## Delegation and models

Use available host delegation tools within user and repository limits. State
file ownership before parallel writes. Inherit the parent model unless applicable
instructions explicitly select another available model. Cursor Task fields,
`pstack-models.mdc`, and the upstream default model slugs are not prerequisites.
Report rejected or unavailable configured models; keep the same design brief
and evidence requirements when using the available configuration.

When delegation is unavailable or disallowed, produce separate candidate designs
in sequential passes. Keep their artifacts separate until synthesis. Report that
the candidates came from one agent and model; this does not establish independent
or diverse-model review. The runner prompt's discipline still applies in full.

## Arena fallback

1. Frame the design-sketch task and its grounding artifacts. Define three to six
   concrete scoring criteria for this task before judging candidates. Give each
   candidate the same task and grounding; reserve the rubric for comparison.
2. Assign each candidate a separate output directory, using isolated worktrees
   where appropriate or separate sketch directories. Use
   [runner-prompt.md](runner-prompt.md) for every candidate. Produce at least two
   structurally distinct, complete design packages before synthesis. Report a
   dropout and replace it when fewer than two viable packages remain.
3. Once candidates finish, use an independent read-only cross-judge when
   available and permitted. Give it the rubric and candidate paths. Prefer a
   different configured model family when available. Otherwise record the
   absence of an independent verdict and perform a distinct review pass.
4. Read every candidate end to end. Screen each against
   [design-red-flags.md](design-red-flags.md), then score each rubric criterion.
   Compare with the cross-judge when present and resolve disagreements by
   reading both rationales. Prefer the base a maintainer can extend without
   breaking invariants; break ties with the cleaner boundary or smaller API.
5. Revisit every losing candidate. Graft useful parts deliberately into one
   coherent shape. Record the base, each graft and its source, rejected ideas
   and reasons, convergence, dropouts, and review limits in
   [rationale-template.md](rationale-template.md). If candidates converge on
   one shape, produce a distinct alternative before synthesis as architect
   requires. If divergence exposes an underspecified brief, reframe and rerun.
6. Verify the synthesized package: caller usage agrees with types and
   signatures, the module map covers affected boundaries, invariants and
   validation have clear owners, and the rationale records the comparison.
   Run suitable static checks when possible; scaffold bodies may deliberately
   remain unimplemented. Record verification results and limits. If a problem
   came from the brief, reframe; if a candidate already solved it, revisit the
   graft. Continue to Phase C only after the package is coherent.
