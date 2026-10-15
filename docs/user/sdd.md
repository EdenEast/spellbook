# Brainstorm and use spec-driven development

This first draft provides a standalone `brainstorm` skill and an `sdd` entry
skill with six independently usable stages. After installing the collection
using the [usual installation procedure](install.md), ask for the workflow by
name or select a stage with your harness's skill interface. The source draft
does not install itself.

## Explore without committing to build

Ask: “Brainstorm ways to make my reading notes more useful. I'm not sure I want
to build anything.” The agent explores the problem and alternatives with you.
Research, sketches, or a throwaway prototype can clarify an idea. Deferring or
rejecting it is a valid outcome.

A useful conversation can stay in chat. For a durable handoff, ask for an idea
brief. By default it goes in `docs/ideas/YYYY-MM-DD-<topic>.md` and preserves
decisions, suggestions, evidence, assumptions, and open questions separately.
It does not start implementation automatically.

## Pursue a direction

Ask: “Use SDD to add CSV export for selected records, through opening a PR.”
The agent starts by grounding the direction in your project, then defines
behavior, plans verifiable slices, implements, verifies, and opens the PR within
your requested scope. Prior brainstorming is optional.

Ask for a narrower stage when that is all you need:

- “Use sdd-discover to investigate this idea brief in the current project.”
- “Use sdd-specify to write acceptance scenarios for the grounded proposal.”
- “Use sdd-plan to produce a plan; stop before implementation.”
- “Use sdd-implement to build the next ready slice of this change.”
- “Use sdd-verify to review coverage and behavior; report findings without edits.”
- “Use sdd-deliver to open a PR for this verified change.”

For resumption, give the change path or PR: “Use SDD to resume this change.” The
agent checks existing artifacts and evidence before selecting the next stage.
Settled decisions should not trigger another interview. Consequential unresolved
choices may still need your input.

## Keep intent connected to evidence

Your project's existing artifact conventions take precedence. Without one,
durable changes use `openspec/changes/<change>/` for the grounded proposal,
behavior deltas, design, tasks, and evidence. Maintained capability specs live
under `openspec/specs/`. Smaller changes use fewer documents; trivial edits can
use the request and a short verification note. The OpenSpec CLI is optional.

The workflow links requirements to tasks and observed results. Failed and
unverified acceptance conditions stay visible. It normally reconciles specs
and retains the completed change record in the implementation PR, so code and
its behavioral contract land together.

Opening a PR, reaching merge-ready, merging, and deploying are distinct results.
State the delivery endpoint you want; merge and deployment require appropriate
authorization. Individual stages preserve the scope of your request, and an
end-to-end request does not need fresh approval at every routine transition.

The draft uses the current agent and available tools. It requires no particular
model or additional agents. Packaging checks and manual walkthroughs are
recorded in the [maintenance notes](../agents/sdd-workflow.md); effectiveness
across live harness sessions has not yet been established.
