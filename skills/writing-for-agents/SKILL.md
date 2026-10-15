---
name: writing-for-agents
description: Create, edit, or review agent-facing instructions and references. Use when authoring skills, AGENTS.md or CLAUDE.md, or documents that guide an agent's work.
---

# Writing for agents

Write guidance that helps a capable agent make the intended decisions. Supply
the context, constraints, and judgment it would otherwise miss. Choose structure
and validation for the task; the considerations below are not a fixed authoring
sequence.

## Give the guidance a purpose and a home

Establish what work the guidance supports, what behavior it should produce, and
when an agent should read it. For an edit, inspect the existing guidance and its
callers before moving or removing material. Preserve the user's intended scope
and preferences.

| Material | Suitable home |
| --- | --- |
| Persistent project conventions and loading pointers | Project instructions such as AGENTS.md or CLAUDE.md |
| A discoverable, reusable workflow | A skill |
| Facts or guidance needed for a particular branch | A supporting reference |
| Guidance used by several workflows | A shared reference with loading triggers |
| Current task status, decisions, and evidence | A task artifact or handoff |

Keep rules in an authoritative location and link from their consumers. Retain
non-obvious conventions, reasons, and costly-to-discover gotchas; point to current
configuration or tool help for facts that would otherwise become stale copies.

## Make the reading path clear

Name each document and an observable condition for reading it: "Before deploying,
read `docs/deployment.md`." Cover distinct branches without repeating their
procedures in the pointer. When guidance is missed, examine its loading trigger
before inlining more content.

Keep purpose, essential constraints, and guidance needed by every branch in the
entry point. Link substantial conditional material where its condition becomes
relevant. Each split should make the reading path easier; a short, self-contained
document can stay in one file.

Group a concept's definition, rules, and exceptions together. Distinguish ordered
actions from facts or rules consulted during those actions. Require an order
where actions depend on one another; preserve judgment where several approaches
can produce the intended result.

Read the relevant supporting reference when these decisions arise:

- [Skill mechanics](references/skill-mechanics.md): for skill metadata,
  resources, format checks, or invocation behavior. Includes a compact local
  format reference.
- [Evaluation](references/evaluation.md): for substantial behavioral changes,
  inconsistent application, or constraints whose compliance needs testing.
- [Session context](references/session-context.md): for context loading,
  ambiguity handling, or handoffs across sessions.

## Match the instruction to the decision

| What the agent needs | Useful form |
| --- | --- |
| A particular output shape | Positive recipe or representative input/output example |
| A required element that gets omitted | Explicit field or slot in the output structure |
| Different behavior in different situations | Conditional keyed to an observable condition |
| A fragile operation or essential invariant | Precise constraint and a way to verify it |
| A choice among valid approaches | Desired outcome and decision criteria |

Use stable terminology and direct verbs. State the desired action first. Make
essential constraints firm, distinguish requirements from defaults and
recommendations, and state the conditions for real exceptions. Keep prohibitions
that define necessary boundaries; pair them with the permitted action when that
helps the agent proceed.

Give prescribed work a checkable completion criterion. "Every changed endpoint
has an identified caller and verification result" is more useful than "Review
the endpoints." Bound the criterion to the authorized task so it does not turn
a local change into an unrelated audit.

Use examples to clarify decisions or results, preferring one representative
example over several equivalent ones. Use scripts for deterministic work when
they materially improve reliability. Distinguish running a script from reading
its implementation, and identify any dependencies needed to run it.

## Check the resulting guidance

Remove duplicated rules, stale facts, and generic advice that adds no decision
support. Check that an agent can find the guidance, choose the relevant branch,
follow its links, and tell when the work is complete. Preserve necessary context
and exceptions when shortening text.

Match validation to the change. A link repair can be checked by inspecting its
target; a new workflow calls for realistic application and boundary scenarios.
Use observable results to assess behavior. Structural checks and manual
walkthroughs can expose defects, but do not establish model effectiveness.

Report the resulting behavior, the checks actually performed, and material
limitations. Keep authoring and evaluation within the user's authorized scope:
writing guidance does not itself authorize installation, commits, publishing,
additional agents, or changes to harness configuration.
