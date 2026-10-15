---
name: sdd-deliver
description: Deliver a verified SDD change through the requested PR, CI, review, and authorized merge steps while reconciling specs and retaining evidence. Use when implementation is verified and PR delivery or landing is requested.
---

# Deliver

Read `~/.agents/references/spellbook/sdd/README.md` and its `artifacts.md`,
especially reconciliation and delivery states. Inspect the branch, intended
base, current diff, evidence, and any existing PR before publishing anything.
Preserve unrelated work. If evidence is incomplete or stale, return to
[sdd-verify](../sdd-verify/SKILL.md).

Carry out the delivery actions already requested. Use the available `commit`,
`file-pr`, and `babysit-pr` skills for their respective requested operations,
reading their instructions when applicable; use repository and forge procedures
directly if those skills are unavailable. Do not invent a merge or deployment
grant from a request to implement or open a PR. Prepare a concrete merge-ready
result before asking for any additional authorization needed to land it.

Reconcile changed behavior into maintained specs in the implementation PR by
default, preserving unchanged requirements and scenarios. Retain the proposal,
design, tasks, deltas, and evidence in the archive according to the shared
convention. Follow an existing project reconciliation policy instead when one
exists; for post-merge work, name its owner and outstanding action. Archiving
artifacts is not evidence that the PR merged.

Write the PR around the user-visible problem and resulting behavior. Link its
requirements and verification evidence and disclose gaps and remaining gates.
Use the forge to inspect current CI, reviews, and conflicts. Handle real findings
within scope, reverify fixes, and keep evidence aligned with the latest patch.
Follow the harness's PR linking and native monitoring contracts when available;
do not create a second watcher alongside its native monitor.

For a stack, verify each layer against its actual base, reconcile only the
behavior that layer delivers, and land authorized layers in dependency order.
Recheck a child's base, diff, and evidence after a parent lands. Keep unresolved
findings and missing required evidence visible; green CI alone does not cover them.

Before an authorized merge, verify required checks, approvals, conflict state,
current head and base, and acceptance coverage. After requesting a merge, read
the forge's result: queued or auto-merge enabled still means pending. Report
the observed state as PR opened, merge-ready, or merged, with the PR link and
remaining gates. Report deployment only with separate authorization and direct
deployment evidence.
