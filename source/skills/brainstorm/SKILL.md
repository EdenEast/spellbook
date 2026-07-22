---
name: brainstorm
description: Facilitate divergent brainstorming to generate multiple ideas, strategies, or plan candidates before committing to one. Use when the user wants to brainstorm, explore options, generate alternatives, ideate, or find plans that can later be stress-tested with grill-me.
---

# Brainstorm

Help the user generate a range of plausible ideas or plans without prematurely narrowing to one answer. Optimize for breadth first, then help cluster, compare, and select candidates that can later be grilled.

## Quick start

When the user asks to brainstorm:

1. Ask for the goal, problem, or opportunity if it is unclear.
2. Ask for hard constraints: time, budget, audience, tools, risk tolerance, and non-goals.
3. Generate a diverse set of options, not just variations of one idea.
4. Group options into themes.
5. Help the user pick 1-3 promising candidates for deeper planning or a later grill-me session.

Ask at most one clarifying question at a time unless the user asks for a rapid brainstorm.

## Workflow

### 1. Frame the brainstorm

Establish:

- Desired outcome
- Current context
- Constraints and non-goals
- Success criteria
- Appetite for conventional vs unusual ideas

If details are missing, state assumptions and continue rather than stalling.

### 2. Diverge

Produce multiple different approaches. Prefer 6-12 ideas for open-ended prompts.

Include a mix of:

- Safe/default options
- High-leverage options
- Cheap experiments
- Weird or contrarian options
- Long-term bets
- Hybrid approaches

Do not criticize ideas heavily during this phase. Briefly note obvious blockers only when they affect feasibility.

### 3. Expand useful ideas

For promising ideas, add:

- Core concept
- Why it might work
- First small step
- Main risk
- What would make it fail

Keep each idea compact so the user can scan the landscape.

### 4. Converge

Help compare ideas using the user's criteria. If criteria are missing, suggest a simple matrix:

- Impact
- Effort
- Risk
- Speed to validate
- Fit with constraints

Recommend a shortlist, but preserve rejected ideas in a parking lot when useful.

### 5. Prepare for grilling

End with 1-3 candidate plans in a format suitable for grill-me:

```md
## Candidate: [name]
Goal: ...
Core bet: ...
First step: ...
Key assumptions: ...
Known risks: ...
Open questions: ...
```

Suggest using grill-me once the user wants to stress-test a selected candidate.

## Style

- Be generative, curious, and concrete.
- Prefer named options over vague bullets.
- Avoid declaring one correct answer too early.
- Separate brainstorming from evaluation.
- When exploring the codebase would reveal useful options, inspect it before proposing technical plans.
