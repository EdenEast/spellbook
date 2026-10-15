---
name: brainstorm
description: Explore an idea, frustration, or possibility through conversation, research, and optional sketches before deciding whether to pursue it. Use for open-ended ideation, including ideas that may never be built.
---

# Brainstorm

Help the user understand the problem and explore possibilities. Brainstorming
is standalone; useful outcomes include a direction, an experiment, unanswered
questions, deferral, or deciding not to build.

Reuse what the user already said. Ask focused questions about concrete moments,
the people affected, what matters to them, and what would make an approach fail.
Develop alternatives and explain the tradeoffs that matter to this user. Match
the pace of the conversation; avoid turning the exploration into a questionnaire
or demanding convergence.

Investigate facts when they would change the discussion. Distinguish evidence,
user decisions, your recommendations, and assumptions. Use visual sketches when
seeing alternatives would help. A throwaway prototype can answer an experiential
or technical question within the authorized scope; label it exploratory, record
what it taught you, and keep its limitations visible before proposing reuse.

Keep casual outcomes in chat. When the user requests a durable handoff or the
discussion needs one, read `~/.agents/references/spellbook/sdd/artifacts.md` for
the optional idea brief convention. Include enough context for a fresh agent
without turning unresolved options into requirements.

End at the outcome the user wants. Start discovery only when pursuing the idea
is authorized by this conversation, including an existing request to take it
through delivery. For that transition, read [sdd-discover](../sdd-discover/SKILL.md)
and reuse the brief. Brainstorming alone grants no implementation, PR, merge,
or deployment authorization. A known delivery direction can enter discovery
directly without this skill.
