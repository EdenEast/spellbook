# Sources and adaptation decisions

First-draft Spellbook instructions, independently authored from the pinned
sources below. Source ideas inform behavior; they do not control future changes.
Applicable upstream notices are retained unchanged in `licenses/`.

## matt-pocock

Reviewed: `to-spec`, `to-tickets`, `implement-spec`, and `implement`, including their UI metadata. These are complete small skill directories.

Incorporated: Reuse settled context, behavioral test seams, vertical slices, and explicit task dependencies.

### Declined

- Tracker setup, automatic publishing, automatic commits, integration-branch fan-out, and worktree cleanup are not portable stage requirements.
- Mandatory approval of test seams and every task breakdown is replaced by focused questions only for unresolved decisions.
- Expand/contract is conditional on compatibility needs; mechanical changes can be atomic.

## superpowers

Reviewed: `brainstorming` (including builder-check prompt, visual companion documentation, and companion script inventory), `writing-plans`, and `finishing-a-development-branch`. The visual server is not imported or required.

Incorporated: Exploratory conversation, explicit assumptions, handoff clarity, verifiable tasks, and distinct integration outcomes.

### Declined

- Brainstorming is a standalone exploration rather than a mandatory gateway to all creative work or a forced design-to-plan transition.
- Fixed conversational scripts, mandatory browser offers, approval gates at every stage, and automatic design commits are replaced by scope-aware judgment.
- Required subagents, model roles, cleanup rules based on path names, and fixed integration menus are not imported. Existing authorization governs transitions.

## openspec

Reviewed: `docs/concepts.md` and the complete `schemas/spec-driven` directory, including schema and templates. Other OpenSpec docs named in the handoff are not claimed as reviewed for this draft.

Incorporated: Capability specs, change deltas, separated proposal/design/tasks, iterative artifacts, and reconciliation with retained history.

### Declined

- CLI installation, fixed command names, store configuration, and an unchanged standard schema are not required. Existing project schemas still govern CLI-managed work.
- Artifact completion or archival alone does not establish verified behavior or merge readiness.
- Spellbook adds evidence.md and defaults to reconciliation and archival in the implementation PR; this is an explicit local workflow convention.

## addy-osmani

Reviewed: The complete single-file `spec-driven-development`, `planning-and-task-breakdown`, and `shipping-and-launch` skill directories. Shipping guidance informed the separation of deployment from PR delivery; no deployment playbook is imported.

Incorporated: Observable success criteria, explicit assumptions, capability boundaries, task verification, and reuse of existing artifact systems.

### Declined

- Mandatory later-turn approvals, a fixed number of files per task, and copying project style and commands into every spec add ceremony without establishing the behavioral contract.
- A second SPEC.md or tasks tree is not created when an existing artifact system already owns that record.
- Universal deployment audits, numerical rollout thresholds, feature flags, and automatic launch actions are outside this PR delivery workflow.

## pstack

Reviewed: `pstack/README.md` and the feature, multi-phase-plan, and shipping playbooks, with the poteto-mode companion inventory inspected for dependencies. This is a targeted adaptation, not an adoption or complete review of poteto-mode.

Incorporated: Ownership of verification, evidence matching the patch, dependency-ordered PR delivery, and confirming actual merge state.

### Declined

- Mandatory delegates, cloud agents, swarms, model roles, ten runtime lanes, and unconditional performance gates are not requirements. Native execution stays available.
- Automatic PR creation, merge, force pushes, scheduled loops, and worktree cleanup do not follow from loading a workflow.
- Patch-id alone is not a universal proof of evidence freshness. Reassess affected behavior and environment and rerun uncertain checks.

## Local conventions

Brainstorming and discovery are separate. Eight portable skills share this
collection rather than duplicating the execution and artifact contracts.
Artifact paths, evidence.md, optional combined records for short changes, and
pre-merge archival are first-draft choices, not claims about upstream defaults.

The local principles collection supplies engineering guidance through its own
loading index and provenance. No existing skills were replaced. The grill-*
and poteto-mode skills mentioned in the handoff are absent from this checkout.
If a harness supplies interviewing skills, use them as focused techniques;
they neither replace discovery grounding nor start delivery by themselves.

No source update is deferred within the pinned review scope. Broader upstream
trees and newer revisions have not been reviewed. Runtime and cross-harness
effectiveness remain untested; see the repository draft evaluation record.
