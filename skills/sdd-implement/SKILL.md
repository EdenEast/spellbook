---
name: sdd-implement
description: Implement ready SDD slices against their behavioral requirements, keeping tasks and verification evidence current. Use when a specification and a proportionate plan identify work ready to build.
---

# Implement

Read `~/.agents/references/spellbook/sdd/README.md` and its `artifacts.md`, then
the selected requirements, design decisions, tasks, and existing evidence.
Check the actual checkout before trusting completion markers. Read the shared
principles index at `~/.agents/references/spellbook/principles/README.md` and the
documents matching the implementation and tests.

Work a ready slice whose prerequisites are satisfied. Establish the relevant
baseline, implement the behavior, and run its checks before dependent work.
For a defect, capture the failing behavior before fixing it when practical.
For new behavior, choose tests at consumer-facing seams that can detect the
specified failures. Direct inspection can suffice for a small documentation
change; avoid tests that only pin instructional wording.

Keep the implementation within scope and integrate the slice's required tests
and documentation. Record actual commands, results, and observations in evidence;
mark the task complete only when its check passes. A missing environment or an
inconclusive run leaves verification incomplete, even if the code is written.

When learning changes only the technical approach, update design and tasks.
When it changes intended behavior, revisit the affected specification with the
user's intent intact; ask for a material product decision if it is not delegated.
Record the reason and invalidate affected evidence. Continue independent ready
work while a real blocker is pending.

Repeat for the authorized slices, then read [sdd-verify](../sdd-verify/SKILL.md)
for integrated verification. Preserve unfinished work and a resumption pointer
when a blocker prevents completion. Commit, publish, and merge only within the
user's requested delivery scope.
