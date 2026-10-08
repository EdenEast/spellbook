---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet. Ask a manageable set of independent frontier questions in each round, numbered with a recommended answer. Keep remaining questions for later rounds. Wait for the user's answers before asking dependent questions.

Prefer the harness's structured question tool when available, respecting its
question and option limits. Give each question enough context to stand alone.
For chat-only or mobile sessions, use concise numbered questions. A preselected
option is not an answer; record only choices the user actually submits.

When presenting questions in chat, format a round like so:

```
**Q1. <question title>**
<question and any choices>

Recommended: <your recommended answer>

---

**Q2. <question title>**
<question and any choices>

Recommended: <your recommended answer>
```

For yes/no questions, make it clear that "yes" accepts the recommendation.
For choices, give mutually exclusive options and explain the relevant trade-off.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.

Finding _facts_ is your job, never the user's. Inspect the relevant code,
configuration, documentation, and available tools before asking for facts you
can discover. Research directly by default. Delegate only when it is available,
authorized, and useful. A running exploration is an unsettled prerequisite:
only downstream questions wait for its results; independent questions can
proceed. The _decisions_ are the user's: ask about consequential choices that
remain unresolved, and reuse decisions already made in the conversation.

The interview is done when the relevant design branches are settled and no
material question remains hidden. Summarize the agreed plan, decisions, and any
explicit assumptions. Keep questions within the user's requested scope; ordinary
implementation details do not need an exhaustive interview. If implementation
was already requested, continue the authorized work once its prerequisites are
settled. If the request was only to explore a design, hand back the agreed plan.
