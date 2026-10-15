# Artifact conventions

Read when persisting an idea brief or creating, revising, verifying, or
reconciling SDD artifacts. Follow an existing project convention first. These
are defaults for projects without one, not a requirement to initialize a tool.

## Idea brief

Keep a casual brainstorm in chat. When a durable handoff is useful, default to
`docs/ideas/YYYY-MM-DD-<topic>.md`, or a user-selected notes location outside a
repository. Check for an existing brief before creating another one. Creating
the brief does not authorize a commit or an SDD change directory.

Include the problem and audience, options and meaningful tradeoffs, user
decisions, agent recommendations, assumptions, unresolved questions, and links
to research or prototype evidence. State the outcome: exploring, pursue,
defer, or reject. Distinguish a suggested direction from the user's decision
to pursue it. Discovery can reuse this input without treating it as a spec.

## Change artifacts

For a durable SDD change without an existing artifact system, use:

```text
openspec/
  specs/<capability>/spec.md
  changes/<change>/
    proposal.md
    specs/<capability>/spec.md
    design.md
    tasks.md
    evidence.md
```

Choose a descriptive kebab-case change name and reuse existing capability paths.
Separate unrelated changes. Inspect active and archived work before choosing a
name or editing a record; do not overwrite a different unfinished change.
On the implementation branch, maintained specs describe that branch's delivered
behavior; the target branch's specs remain unchanged until merge.

- `proposal.md`: discovery's grounded brief. Record intent, audience, scope,
  non-goals, affected capabilities, constraints, evidence pointers, risks, and
  remaining decisions. A brief from brainstorming is input, not a second spec.
- `specs/<capability>/spec.md` within a change: proposed behavior deltas, with
  requirement identifiers and acceptance scenarios. Reference existing specs
  for unchanged behavior. Do not invent behavior changes for a pure refactor.
- `design.md`: technical choices, reasons, alternatives, interfaces, and
  migration or rollout considerations where relevant. Omit when no durable
  design explanation is needed.
- `tasks.md`: verifiable slices, requirement links, dependencies, progress,
  verification procedures, blockers, and the next ready action. If tasks live in
  a project tracker, use an index of those items instead of a second checklist.
- `evidence.md`: acceptance coverage, observed results, patch identity,
  environment, gaps, review findings and dispositions, and delivery references.
  This is a Spellbook addition, not a standard OpenSpec artifact requirement.

Short changes may combine the grounded brief, design notes, tasks, and evidence
under labeled sections in `proposal.md`; maintain a distinct behavioral contract
when the project keeps capability specs. Do not create empty documents for stages
that add no information. Trivial edits may stay in chat under the execution
contract. Existing project schema requirements override these shortcuts.

## Requirements and deltas

Use stable identifiers, such as `export/R1`, as references in tasks and evidence.
In OpenSpec-style documents, retain the standard heading shape and use a stable
requirement name; an identifier can be recorded in its text or in the coverage
record. Do not rename existing requirement headings merely to add identifiers.
Each requirement states observable behavior and has concrete scenarios:

```markdown
## ADDED Requirements

### Requirement: Export the current selection
The system MUST export only the selected records in the user's requested format.

#### Scenario: Export a subset
- **GIVEN** records A and B exist and only B is selected
- **WHEN** the user requests CSV export
- **THEN** the downloaded CSV contains B and excludes A
```

Use `## MODIFIED Requirements` for changed existing requirements, carrying the
full updated requirement and all still-applicable scenarios. A partial replacement
can accidentally erase behavior. Use `## REMOVED Requirements` with a reason and
migration expectation for intentional removal. New capability specs also need a
purpose. Preserve the project's existing syntax and identifiers when different.

The CLI is not needed to write these records. When a project uses OpenSpec
commands, inspect its installed version, schema, and help, then use its validation
and synchronization procedures. A lightweight document set or `evidence.md`
addition is not automatically CLI-compatible. Do not install or reconfigure
OpenSpec just to run this workflow.

## Traceability and evidence

Keep a compact mapping from each requirement and relevant scenario to its task
and proof. A useful coverage row records the requirement/scenario reference,
task reference, implementation pointer, verification procedure, observed result,
evidence location, and status: passed, failed, or unverified. Split rows when
scenarios have different results; one passing example does not cover them all.

Record command output or a concise result with a retained log, screenshots,
generated artifacts, or an inspection record appropriate to the claim. Store
large evidence outside the source tree when project practice calls for it,
with stable retrievable pointers and no credentials or sensitive payloads.

Identify the tested commit and base. For an uncommitted patch, record the base
commit and a reproducible identity of the tested contents, including relevant
untracked files; a commit SHA alone describes neither. Record the environment
and procedure well enough to repeat the check. An unavailable runtime leaves
runtime acceptance unverified even if static checks pass.

After a code change, rebase, conflict resolution, or base update, determine which
evidence still applies and explain any reuse. Rerun affected or uncertain checks.
Never use an earlier green result as proof of behavior its patch did not contain.
For large changes, summarize coverage and blockers while retaining the detailed
record for resumption.

## Reconciliation and archive

Default to reconciling maintained specs in the implementation PR so behavior
and code land together. Apply added requirements, replace modified requirements
with their complete updated content, and remove only intentional removals.
Preserve unaffected requirements and scenarios. Review the resulting full spec
against the implementation and current base, especially when other changes
touch the same capability.

After verification and reconciliation, move the completed change record to
`openspec/changes/archive/YYYY-MM-DD-<change>/` in that PR. Preserve its deltas,
decisions, tasks, and evidence, and repair links affected by the move. The date
records archival preparation, not a claimed merge date. Archive presence does
not prove delivery. If review reopens implementation, update the archived record
and its evidence or restore it to active work; ensure routing can still find it.

For a change spanning PRs, partition delivery-sized changes by default and link
them in an overarching brief. Each layer reconciles only the behavior it makes
true and retains its own evidence. If an existing project instead uses one
multi-PR change, keep pending requirements and tasks explicitly pending; update
maintained specs incrementally and archive only after all scoped work is verified.

An existing policy may reconcile or archive after merge. Follow it and record
the owner, remaining action, and evidence location in the PR handoff. Do not
report reconciliation complete while that action is pending. Avoid applying
archived deltas a second time on resumption.
