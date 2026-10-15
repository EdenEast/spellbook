---
name: sdd
description: Start or resume spec-driven development from a direction through discovery, specification, planning, implementation, verification, and PR delivery. Use when the user requests SDD or coordinated delivery guided by durable behavioral requirements.
---

# Spec-driven development

Read `~/.agents/references/spellbook/sdd/README.md` for the shared execution
contract. Select the user's change from their request, artifacts, branch, or PR;
ask only if multiple plausible changes would send work in different directions.
Preserve existing work and reuse the project's artifact system.

Route by usable evidence, rather than by the mere presence of files:

- Open-ended exploration with no direction to pursue: read
  [brainstorm](../brainstorm/SKILL.md). This is outside SDD.
- A direction without project grounding: read
  [sdd-discover](../sdd-discover/SKILL.md).
- Grounded scope without observable requirements: read
  [sdd-specify](../sdd-specify/SKILL.md).
- Usable requirements without an executable breakdown: read
  [sdd-plan](../sdd-plan/SKILL.md).
- Ready tasks with unfinished behavior: read
  [sdd-implement](../sdd-implement/SKILL.md).
- Implemented work without current coverage and behavior evidence: read
  [sdd-verify](../sdd-verify/SKILL.md).
- Verified work ready for the requested PR actions: read
  [sdd-deliver](../sdd-deliver/SKILL.md).

Read the selected stage and its inputs, then do the authorized work. Load later
stages when needed. Recheck stale artifacts against the checkout and prior
decisions; repair the earliest consequential gap without repeating settled
interviews. When scope or requirements change, update their owning artifacts
and affected tasks and evidence before proceeding with dependent work.

For an end-to-end request, continue through the authorized stages. For a request
limited to discovery, a spec, a plan, or verification, produce that result and
stop there. At a handoff, name the change, artifact paths, current result,
unresolved decisions, authorization boundary, and next useful action. Report
delivery state precisely; file completion alone never establishes shipping.
