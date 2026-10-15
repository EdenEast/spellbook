---
name: sdd-plan
description: Plan independently verifiable implementation slices from behavioral requirements, with dependencies, technical decisions, and verification. Use when a spec is ready to become an executable SDD plan.
---

# Plan

Read `~/.agents/references/spellbook/sdd/README.md` and its `artifacts.md`.
Inspect the spec and affected code before choosing tasks. Read the shared
principles index at `~/.agents/references/spellbook/principles/README.md` and the
matching documents, especially sequence work into verifiable units.

Record technical choices and reasons in `design.md` when they need a durable
explanation. Compare meaningful alternatives for uncertain architecture; use a
targeted experiment when observation can settle the choice. Refer to project
conventions instead of reproducing them.

Break work into narrow end-to-end slices, each with an observable result,
requirement/scenario references, real dependencies, affected boundaries or
interfaces, and a check that could expose a relevant failure. Include each
slice's tests and documentation with its implementation. Put risky assumptions
early and name what would cause replanning. Avoid prescribing line-by-line code
when a contract and a check leave reasonable implementation freedom.

For a wide mechanical migration, choose deliberate batches or one atomic change
with explicit consistency checks. Use expand/contract only when compatibility
or independently green delivery needs it. Do not manufacture feature slices or
temporary APIs solely to fit the workflow.

For multiple PRs, assign requirements, dependencies, verification, and spec
reconciliation to each PR. Specify which behavior becomes true at each layer
and which integration checks remain for later layers. An earlier PR must not
claim behavior that only a later unpublished patch supplies.

Check that every requirement has a task and verification path, and every task
has a purpose in scope. Record the next ready slice and any unresolved blocker.
Return the plan when that is the requested deliverable; continue with
[sdd-implement](../sdd-implement/SKILL.md) only within existing authorization.
