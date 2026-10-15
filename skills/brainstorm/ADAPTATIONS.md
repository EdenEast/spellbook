# Sources and adaptation decisions

First-draft Spellbook instructions, independently authored from the pinned
sources below. Source ideas inform behavior; they do not control future changes.
Applicable upstream notices are retained unchanged in `licenses/`.

## superpowers

Reviewed: `brainstorming` (including builder-check prompt, visual companion documentation, and companion script inventory), `writing-plans`, and `finishing-a-development-branch`. The visual server is not imported or required.

Incorporated: Exploratory conversation, explicit assumptions, handoff clarity, verifiable tasks, and distinct integration outcomes.

### Declined

- Brainstorming is a standalone exploration rather than a mandatory gateway to all creative work or a forced design-to-plan transition.
- Fixed conversational scripts, mandatory browser offers, approval gates at every stage, and automatic design commits are replaced by scope-aware judgment.
- Required subagents, model roles, cleanup rules based on path names, and fixed integration menus are not imported. Existing authorization governs transitions.

## Local packaging

This is an adapted stage in the first-draft brainstorming and SDD workflow.
Its SKILL.md owns stage-specific decisions. The shared execution and artifact
contracts live at `~/.agents/references/spellbook/sdd/`; their maintenance record
is in `references/sdd/` in the Spellbook source checkout. Normal automatic skill
selection remains enabled. No upstream helpers or runtime dependencies are
imported. Native execution and independently requested stages remain available.

No source update is deferred within the pinned review scope. Broader upstream
trees and newer revisions have not been reviewed. Packaging checks and manual
walkthroughs do not establish runtime effectiveness or cross-harness discovery.
