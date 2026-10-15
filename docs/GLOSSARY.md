# Spellbook

Spellbook maintains personal agent instructions, skills, shared references, and
Pi extensions. These terms describe their ownership, origins, and maintenance.

## Resources

**Resource**:
A maintained item that Spellbook makes available to agents: instructions, a
skill, shared references, or a Pi extension.

**Skill**:
A discoverable set of instructions and supporting material for a specific agent
workflow.
_Avoid_: reference, prompt (as synonyms for skill).

**Active skill**:
A skill included in Spellbook's installable collection. Being active does not
mean it is installed or loaded in an agent session.
_Avoid_: installed skill, loaded skill (when describing collection membership).

**Reference**:
Reading or authoring material that can inform agent work without being
registered as a skill. A reference can itself contain adapted material.
_Avoid_: skill (for reading material alone).

**Shared reference**:
A reference maintained for use across skills or ordinary agent tasks.
_Avoid_: skill-specific reference (when the material has multiple consumers).

**Reference collection**:
A group of related shared references with a common index and maintenance scope.

## Ownership and origins

**Adapt**:
Author a locally owned skill using external ideas and local judgment. Its
sources inform its direction without governing future changes.
_Avoid_: adopt, copy (for independently authored behavior).

**Adopt**:
Bring in an external skill while preserving its workflow and identity. The
upstream skill remains the basis for updates, alongside intentional local changes.
_Avoid_: adapt, install (for establishing this upstream relationship).

**Source**:
Material used to author or bring in a resource, such as an article,
documentation, or an external skill. A resource can have several sources.
_Avoid_: reference (when identifying origin rather than a maintained resource).

**Upstream**:
The external project that maintains the original version of an adopted skill
or other imported material. An adapted skill's sources need not share one upstream.
_Avoid_: source of truth (without specifying whose behavior it governs).

**Provenance**:
The record of where material came from and which versions informed the local
resource. Provenance identifies origins; it does not transfer ownership of behavior.

**Local adjustment**:
An intentional change to an adopted skill for local preferences or environments
that preserves the skill's upstream workflow and identity.
_Avoid_: adapted skill (solely because an adopted skill has local edits).

## Maintenance

**Reviewed version**:
The version of a source whose relevant changes have been assessed for an adapted
skill. Review can conclude with incorporation or an explicit decision to decline.
_Avoid_: incorporated version, merge baseline (for a review record).

**Upstream baseline**:
The recorded upstream version against which an adopted skill's local changes
and newer upstream changes are compared. It advances after integration is complete.
_Avoid_: latest version, reviewed version (for the adopted skill's merge base).

**Source review**:
An assessment of source changes and their relevance to an adapted skill.
A completed review can leave the skill's behavior unchanged.
_Avoid_: integration (when changes have only been assessed).

**Upstream integration**:
The reconciliation of upstream changes with an adopted skill's intentional
local changes, including explicit decisions about changes that are not retained.
_Avoid_: installation, overwrite.

**Deferred change**:
A source or upstream change whose maintenance decision is still outstanding.
It differs from a declined change, which has been considered and deliberately excluded.
_Avoid_: declined change, completed review (for unresolved work).

## Development workflows

**Brainstorming**:
Standalone exploration of an idea, problem, or possibility without a commitment
to specification or implementation. It can inform discovery but is outside the
SDD cycle.
_Avoid_: discovery (as an interchangeable name for open-ended ideation).

**Discovery (SDD)**:
The first stage of spec-driven development, grounding an existing direction in
the project's context, constraints, and unknowns before specification. It can
start with or without prior brainstorming.
_Avoid_: skill discovery (which describes harness recognition of skills).

**Spec-driven development (SDD)**:
A development workflow in which explicit behavioral requirements guide planning,
implementation, and verification. In Spellbook's first-draft workflow, discovery
starts the cycle and brainstorming remains separate.
_Avoid_: subagent-driven development (a different expansion used by Superpowers).

**Idea brief**:
A persistent record of brainstorming outcomes, options, decisions, assumptions,
and unanswered questions. It can inform discovery without becoming a requirement
or a commitment to build.

**Capability spec**:
A maintained behavioral contract for a cohesive system capability, expressed as
requirements and acceptance scenarios. It describes the behavior delivered on
the branch containing it.
_Avoid_: implementation plan (which describes how to make the change).

**Delta spec**:
A change's proposed additions, modifications, or removals to a capability spec.
It preserves the distinction between intended changes and maintained behavior.

**Verification evidence**:
Recorded observations supporting a requirement or completion claim, tied to the
tested revision or patch and relevant environment. Missing or inconclusive
observations leave the claim unverified.

**Spec reconciliation**:
Updating maintained capability specs to reflect the behavior a verified change
delivers, while preserving unaffected requirements and scenarios.
_Avoid_: merge (when only the specification records have been updated).

**Merge-ready**:
A PR state in which the current patch has its required verification evidence,
checks, approvals, and conflict clearance. Authorization to merge can still be
outstanding; this state does not mean the PR is merged or deployed.

## Agent availability

**Harness**:
The agent execution environment that discovers instructions and skills and
provides the tools used by their workflows.
_Avoid_: installation target (when referring to the execution environment itself).

**Installation target**:
A supported harness selection for which Spellbook manages resource availability.
Targets can share resources, so selecting one does not imply exclusive visibility.

**Installation**:
Making maintained resources available at their selected destinations.
Installation does not author skills, review sources, or integrate upstream changes.
_Avoid_: adoption, upstream update.

**Installed skill**:
A skill made available at an installation destination. Installation alone does
not establish that a harness has discovered or loaded it.
_Avoid_: active skill, loaded skill (as interchangeable states).

**Skill discovery**:
A harness's recognition of an available skill for selection.
Discovery is separate from loading its full instructions into a session.
_Avoid_: installation, invocation.
