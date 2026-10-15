---
name: sdd-discover
description: Ground a direction the user wants to pursue in the existing project's behavior, vocabulary, constraints, and test seams before specifying it. Use with an existing brief or a direct feature request; prior brainstorming is optional.
---

# Discover

Read `~/.agents/references/spellbook/sdd/README.md` and, before writing a brief,
its `artifacts.md`. Start from the user's direction and any idea brief. Carry
forward settled choices and mark proposals as proposals.

Inspect the affected behavior and its consumers, domain glossary, relevant
decisions, implementation boundaries, and behavioral test seams. Find what
already exists before proposing new structure. Record evidence as file pointers,
commands and observations, or external sources, rather than unsupported summaries.

Identify the intended outcome, affected capabilities, scope, non-goals,
constraints, risks, and unknowns that could change the requirements. Answer
technical questions through inspection, research, or targeted experiments.
Reserve material product and preference choices for the user unless delegated;
continue independent investigation while those answers are pending.

Produce a grounded brief, normally `proposal.md`, with the evidence and open
questions needed to specify the change. Distinguish blockers from unknowns that
can safely wait for design or implementation. Technical detail belongs here
only when it explains a constraint; discovery need not design the whole solution.

Check that a fresh agent can explain what is being pursued, why, what it affects,
and which decisions remain open. If the direction itself becomes uncertain,
surface that and return to [brainstorm](../brainstorm/SKILL.md) as appropriate.
If specification is authorized and the grounding is sufficient, continue with
[sdd-specify](../sdd-specify/SKILL.md); otherwise hand back the brief.
