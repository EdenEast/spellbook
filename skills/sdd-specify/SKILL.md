---
name: sdd-specify
description: Turn grounded intent into behavioral requirements and acceptance scenarios for a new or changed capability. Use when SDD discovery is sufficient and the change needs a verifiable specification.
---

# Specify

Read `~/.agents/references/spellbook/sdd/README.md` and its `artifacts.md` before
editing requirements. Reuse discovery, existing capability specs, glossary terms,
and settled user decisions. Fill a missing consequential fact through discovery
instead of guessing or restarting an interview.

Define scope and observable behavior for each affected capability. Give each
requirement a stable identifier and concrete acceptance scenarios covering the
successful outcome and relevant failure, boundary, and recovery conditions.
Include compatibility and measurable constraints when required by the request;
do not invent targets to make vague aspirations look precise.

Keep technical choices in design and execution steps in tasks. A consumer-facing
interface can be a behavioral contract; an internal function name usually is not.
For changed behavior, preserve existing scenarios that still apply, specify
intentional removals and migration expectations, and distinguish proposed behavior
from the maintained specification. A behavior-preserving change can reference
the existing contract without inventing a delta.

Check that every in-scope outcome has an acceptance condition, each condition is
observable, and no material product decision is disguised as an assumption.
Surface contradictions and resolve only the affected decisions. Do not weaken
requirements just because an implementation fails them.

Return the spec for a specification-only request. If further work is already
authorized and no consequential ambiguity blocks it, continue with
[sdd-plan](../sdd-plan/SKILL.md).
